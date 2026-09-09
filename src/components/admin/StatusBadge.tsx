import type { SubmissionStatus } from '@/lib/types';
import { cn } from '@/lib/utils';

const CONFIG: Record<SubmissionStatus, { label: string; classes: string }> = {
  pending:  { label: 'Pending Review',  classes: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
  approved: { label: 'Approved', classes: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  rejected: { label: 'Rejected', classes: 'bg-red-100   text-red-700   dark:bg-red-900/30   dark:text-red-400'   },
};

export function StatusBadge({ status }: { status: SubmissionStatus }) {
  const { label, classes } = CONFIG[status];
  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold', classes)}>
      {label}
    </span>
  );
}
