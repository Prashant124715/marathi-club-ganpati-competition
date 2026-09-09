import { Timestamp } from 'firebase/firestore';

// ─── User ────────────────────────────────────────────────────────────────────

export type UserRole = 'participant' | 'admin';

export interface AppUser {
  uid: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Timestamp;
  emailVerified: boolean;
}

// ─── Category ────────────────────────────────────────────────────────────────

export type CategorySlug =
  | 'home-decor'
  | 'reel-making'
  | 'literature'
  | 'faculty-corner';

export interface Category {
  id: CategorySlug;
  name: string;
  slug: CategorySlug;
  description: string;
  isOpen: boolean;
  createdAt: Timestamp;
}

// ─── Submission ──────────────────────────────────────────────────────────────

export type SubmissionStatus = 'pending' | 'approved' | 'rejected';

export type FileType = 'image' | 'video' | 'pdf' | 'other';

export interface Submission {
  id: string;
  participantId: string;
  participantName: string;
  categoryId: CategorySlug;
  title: string;
  description: string;
  fileUrl: string;
  fileType: FileType;
  status: SubmissionStatus;
  voteCount: number;
  createdAt: Timestamp;
  approvedAt: Timestamp | null;
}

// ─── Vote ─────────────────────────────────────────────────────────────────────

export interface Vote {
  id: string;
  userId: string;
  submissionId: string;
  categoryId: CategorySlug;
  createdAt: Timestamp;
}

// ─── Competition Settings ─────────────────────────────────────────────────────

export interface CompetitionSettings {
  submissionsOpen: boolean;
  votingOpen: boolean;
  submissionDeadline: Timestamp | null;
  votingDeadline: Timestamp | null;
  updatedAt?: Timestamp;
  updatedBy?: string;
}
