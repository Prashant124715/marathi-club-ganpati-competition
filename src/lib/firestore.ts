/**
 * Firestore collection path constants.
 * Centralised here to avoid typos and make refactoring easy.
 */
export const COLLECTIONS = {
  USERS: 'users',
  CATEGORIES: 'categories',
  SUBMISSIONS: 'submissions',
  VOTES: 'votes',
  SETTINGS: 'settings',
} as const;

export const SETTINGS_DOCS = {
  COMPETITION: 'competition',
} as const;

/**
 * Seed data for the four competition categories.
 * Run the seedCategories() helper once from an admin panel or script
 * to populate the `categories` collection in Firestore.
 */
import { setDoc, getDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Category, CategorySlug, CompetitionSettings } from '@/lib/types';

type CategorySeed = Omit<Category, 'createdAt'>;

export const CATEGORY_SEEDS: CategorySeed[] = [
  {
    id: 'home-decor',
    name: 'Home Decor',
    slug: 'home-decor',
    description:
      'Showcase your beautiful and eco-friendly Ganpati makhar and home decorations.',
    isOpen: true,
  },
  {
    id: 'reel-making',
    name: 'Reel Making',
    slug: 'reel-making',
    description:
      'Capture the festive spirit through creative short videos and reels.',
    isOpen: true,
  },
  {
    id: 'literature',
    name: 'Literature',
    slug: 'literature',
    description:
      'Express your devotion through essays, poems, and stories about Lord Ganesha.',
    isOpen: true,
  },
  {
    id: 'faculty-corner',
    name: 'Faculty Corner',
    slug: 'faculty-corner',
    description:
      'A special category for our esteemed faculty to share their festive joy.',
    isOpen: true,
  },
];

/**
 * Seeds the `categories` collection with the four competition categories.
 * Safe to call multiple times — uses setDoc (upsert), so it won't create
 * duplicate documents.
 */
export async function seedCategories(): Promise<void> {
  const promises = CATEGORY_SEEDS.map((cat) =>
    setDoc(doc(db, COLLECTIONS.CATEGORIES, cat.id), {
      ...cat,
      createdAt: serverTimestamp(),
    })
  );
  await Promise.all(promises);
  console.log('Categories seeded successfully.');
}

// ─── Competition Settings Helpers ─────────────────────────────────────────────

export const DEFAULT_COMPETITION_SETTINGS: CompetitionSettings = {
  submissionsOpen: true,
  votingOpen: true,
  submissionDeadline: null,
  votingDeadline: null,
};

export async function getCompetitionSettings(): Promise<CompetitionSettings> {
  const docRef = doc(db, COLLECTIONS.SETTINGS, SETTINGS_DOCS.COMPETITION);
  const snap = await getDoc(docRef);

  if (!snap.exists()) {
    return DEFAULT_COMPETITION_SETTINGS;
  }

  const data = snap.data();
  return {
    submissionsOpen: data.submissionsOpen ?? true,
    votingOpen: data.votingOpen ?? true,
    submissionDeadline: data.submissionDeadline ?? null,
    votingDeadline: data.votingDeadline ?? null,
    updatedAt: data.updatedAt,
    updatedBy: data.updatedBy,
  };
}

export async function updateCompetitionSettings(
  settings: Partial<CompetitionSettings> & { updatedBy?: string }
): Promise<void> {
  const docRef = doc(db, COLLECTIONS.SETTINGS, SETTINGS_DOCS.COMPETITION);
  await setDoc(
    docRef,
    {
      ...settings,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

export function isSubmissionsActive(settings: CompetitionSettings | null): boolean {
  if (!settings) return true;
  if (!settings.submissionsOpen) return false;
  if (settings.submissionDeadline) {
    return settings.submissionDeadline.toMillis() > Date.now();
  }
  return true;
}

export function isVotingActive(settings: CompetitionSettings | null): boolean {
  if (!settings) return true;
  if (!settings.votingOpen) return false;
  if (settings.votingDeadline) {
    return settings.votingDeadline.toMillis() > Date.now();
  }
  return true;
}
