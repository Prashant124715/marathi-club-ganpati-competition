'use client';

import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import {
  COLLECTIONS,
  SETTINGS_DOCS,
  DEFAULT_COMPETITION_SETTINGS,
  isSubmissionsActive,
  isVotingActive,
} from '@/lib/firestore';
import type { CompetitionSettings } from '@/lib/types';

export interface UseCompetitionSettingsReturn {
  settings: CompetitionSettings;
  loading: boolean;
  error: string | null;
  isSubmissionsOpen: boolean;
  isVotingOpen: boolean;
  submissionDeadlineDate: Date | null;
  votingDeadlineDate: Date | null;
  hasSubmissionDeadlinePassed: boolean;
  hasVotingDeadlinePassed: boolean;
}

export function useCompetitionSettings(): UseCompetitionSettingsReturn {
  const [settings, setSettings] = useState<CompetitionSettings>(DEFAULT_COMPETITION_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const docRef = doc(db, COLLECTIONS.SETTINGS, SETTINGS_DOCS.COMPETITION);
    const unsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          setSettings({
            submissionsOpen: data.submissionsOpen ?? true,
            votingOpen: data.votingOpen ?? true,
            submissionDeadline: data.submissionDeadline ?? null,
            votingDeadline: data.votingDeadline ?? null,
            updatedAt: data.updatedAt,
            updatedBy: data.updatedBy,
          });
        } else {
          setSettings(DEFAULT_COMPETITION_SETTINGS);
        }
        setLoading(false);
      },
      (err) => {
        console.error('Error listening to competition settings:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const submissionDeadlineDate = settings.submissionDeadline ? settings.submissionDeadline.toDate() : null;
  const votingDeadlineDate = settings.votingDeadline ? settings.votingDeadline.toDate() : null;

  const hasSubmissionDeadlinePassed = Boolean(
    submissionDeadlineDate && submissionDeadlineDate.getTime() <= Date.now()
  );

  const hasVotingDeadlinePassed = Boolean(
    votingDeadlineDate && votingDeadlineDate.getTime() <= Date.now()
  );

  const isSubmissionsOpen = isSubmissionsActive(settings);
  const isVotingOpen = isVotingActive(settings);

  return {
    settings,
    loading,
    error,
    isSubmissionsOpen,
    isVotingOpen,
    submissionDeadlineDate,
    votingDeadlineDate,
    hasSubmissionDeadlinePassed,
    hasVotingDeadlinePassed,
  };
}
