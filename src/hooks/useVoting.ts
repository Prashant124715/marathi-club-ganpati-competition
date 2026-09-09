'use client';

import { useState, useEffect, useCallback } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firestore';
import { castVote, voteDocId, VotingError } from '@/lib/votes';
import type { CategorySlug, Vote } from '@/lib/types';
import { useAuth } from '@/contexts/AuthContext';
import { useCompetitionSettings } from '@/hooks/useCompetitionSettings';

interface UseVotingReturn {
  /** Set of categoryIds the current user has already voted in */
  votedCategories: Set<CategorySlug>;
  /** submissionId the user voted for in each category */
  votedSubmissions: Map<CategorySlug, string>;
  /** IDs of submissions currently processing a vote request */
  loadingIds: Set<string>;
  /** Per-submission error messages */
  errors: Map<string, string>;
  /** Cast a vote — handles all guards and optimistic UI update */
  vote: (submissionId: string, categoryId: CategorySlug) => Promise<void>;
  /** Whether any vote is currently being processed */
  isAnyVoting: boolean;
  /** Whether the user's votes have been loaded */
  ready: boolean;
  /** Whether voting is globally active according to competition settings */
  isVotingOpen: boolean;
  /** Deadline date object if set */
  votingDeadlineDate: Date | null;
}

/**
 * Manages the user's voting state for a given set of submissions.
 * - Loads existing votes from Firestore on mount.
 * - Exposes a `vote()` function that calls castVote() and updates UI optimistically.
 * - Tracks per-submission loading and error states.
 */
export function useVoting(): UseVotingReturn {
  const { user } = useAuth();
  const { isVotingOpen, votingDeadlineDate } = useCompetitionSettings();

  const [votedCategories, setVotedCategories]   = useState<Set<CategorySlug>>(new Set());
  const [votedSubmissions, setVotedSubmissions] = useState<Map<CategorySlug, string>>(new Map());
  const [loadingIds,  setLoadingIds]  = useState<Set<string>>(new Set());
  const [errors,      setErrors]      = useState<Map<string, string>>(new Map());
  const [ready,       setReady]       = useState(false);

  // Load existing votes for the current user
  useEffect(() => {
    if (!user) {
      setVotedCategories(new Set());
      setVotedSubmissions(new Map());
      setReady(true);
      return;
    }

    setReady(false);
    getDocs(query(collection(db, COLLECTIONS.VOTES), where('userId', '==', user.uid)))
      .then((snap) => {
        const cats = new Set<CategorySlug>();
        const subs = new Map<CategorySlug, string>();
        snap.docs.forEach((d) => {
          const v = d.data() as Vote;
          cats.add(v.categoryId);
          subs.set(v.categoryId, v.submissionId);
        });
        setVotedCategories(cats);
        setVotedSubmissions(subs);
      })
      .catch(console.error)
      .finally(() => setReady(true));
  }, [user]);

  const vote = useCallback(
    async (submissionId: string, categoryId: CategorySlug) => {
      if (!user) return;

      // Prevent repeated clicks while any vote is being processed
      if (loadingIds.size > 0) return;

      // Clear any existing error for this submission
      setErrors((prev) => { const m = new Map(prev); m.delete(submissionId); return m; });

      // Fast check before making request
      if (!isVotingOpen) {
        setErrors((prev) =>
          new Map(prev).set(submissionId, 'Voting is currently closed for this competition.')
        );
        return;
      }

      // Mark as loading
      setLoadingIds((prev) => new Set(prev).add(submissionId));

      try {
        await castVote({
          userId:        user.uid,
          userName:      user.displayName ?? user.email?.split('@')[0] ?? 'Anonymous',
          emailVerified: user.emailVerified,
          submissionId,
          categoryId,
        });

        // Set voted states ONLY after backend confirms the write
        setVotedCategories((prev) => new Set(prev).add(categoryId));
        setVotedSubmissions((prev) => new Map(prev).set(categoryId, submissionId));

      } catch (err) {
        const message =
          err instanceof VotingError
            ? err.message
            : 'An unexpected error occurred. Please try again.';
        setErrors((prev) => new Map(prev).set(submissionId, message));
      } finally {
        setLoadingIds((prev) => { const s = new Set(prev); s.delete(submissionId); return s; });
      }
    },
    [user, isVotingOpen, loadingIds.size]
  );

  return {
    votedCategories,
    votedSubmissions,
    loadingIds,
    isAnyVoting: loadingIds.size > 0,
    errors,
    vote,
    ready,
    isVotingOpen,
    votingDeadlineDate,
  };
}
