import {
  runTransaction,
  doc,
  serverTimestamp,
  increment,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS, SETTINGS_DOCS } from '@/lib/firestore';
import type { CategorySlug } from '@/lib/types';

export class VotingError extends Error {
  constructor(
    public readonly code:
      | 'not_authenticated'
      | 'email_not_verified'
      | 'already_voted'
      | 'submission_not_approved'
      | 'category_closed'
      | 'voting_closed'
      | 'unknown',
    message: string
  ) {
    super(message);
    this.name = 'VotingError';
  }
}

/**
 * Deterministic vote document ID prevents duplicate votes at the database level.
 * Format: {userId}_{categoryId}
 * Since Firestore document IDs are unique, attempting a second vote in the same
 * category will be caught by the transaction read before any write occurs.
 */
export function voteDocId(userId: string, categoryId: CategorySlug): string {
  return `${userId}_${categoryId}`;
}

interface CastVoteParams {
  userId: string;
  userName: string;
  emailVerified: boolean;
  submissionId: string;
  categoryId: CategorySlug;
}

/**
 * Atomically casts a vote using a Firestore transaction.
 *
 * The transaction:
 *  1. Reads the vote document (deterministic ID: userId_categoryId)
 *  2. Reads the submission document to verify it is approved
 *  3. If either pre-condition fails, aborts with a VotingError
 *  4. Writes the vote document (set — not update, so a race condition
 *     between two concurrent requests still results in exactly one vote)
 *  5. Increments the submission's voteCount using FieldValue.increment(1),
 *     which is atomic and safe for concurrent updates
 *
 * Security rules (firestore.rules) provide the server-enforced backup layer
 * that prevents any client from bypassing this function entirely.
 */
export async function castVote({
  userId,
  userName,
  emailVerified,
  submissionId,
  categoryId,
}: CastVoteParams): Promise<void> {
  // Pre-flight checks (fast, before opening a transaction)
  if (!userId) throw new VotingError('not_authenticated', 'You must be logged in to vote.');
  if (!emailVerified) throw new VotingError('email_not_verified', 'Please verify your email before voting.');

  const voteRef       = doc(db, COLLECTIONS.VOTES,       voteDocId(userId, categoryId));
  const submissionRef = doc(db, COLLECTIONS.SUBMISSIONS, submissionId);
  const settingsRef   = doc(db, COLLECTIONS.SETTINGS,    SETTINGS_DOCS.COMPETITION);

  await runTransaction(db, async (tx) => {
    const [voteSnap, submissionSnap, settingsSnap] = await Promise.all([
      tx.get(voteRef),
      tx.get(submissionRef),
      tx.get(settingsRef),
    ]);

    // Guard: competition voting status
    if (settingsSnap.exists()) {
      const settingsData = settingsSnap.data();
      if (settingsData?.votingOpen === false) {
        throw new VotingError('voting_closed', 'Voting is currently closed for this competition.');
      }
      if (settingsData?.votingDeadline) {
        const deadlineMillis = settingsData.votingDeadline.toMillis?.() ?? 0;
        if (deadlineMillis > 0 && deadlineMillis <= Date.now()) {
          throw new VotingError('voting_closed', 'The voting deadline for this competition has passed.');
        }
      }
    }

    // Guard: duplicate vote
    if (voteSnap.exists()) {
      throw new VotingError('already_voted', 'You have already voted in this category.');
    }

    // Guard: submission must be approved
    if (!submissionSnap.exists() || submissionSnap.data()?.status !== 'approved') {
      throw new VotingError('submission_not_approved', 'This submission is not eligible for voting.');
    }

    // Write 1 — create the vote record
    tx.set(voteRef, {
      id: voteDocId(userId, categoryId),
      userId,
      userName,
      submissionId,
      categoryId,
      createdAt: serverTimestamp(),
    });

    // Write 2 — atomically increment the vote count
    tx.update(submissionRef, {
      voteCount: increment(1),
    });
  });
}
