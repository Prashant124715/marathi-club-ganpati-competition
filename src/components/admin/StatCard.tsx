import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  colorClass?: string; // Tailwind text color class for the icon
  loading?: boolean;
}

export function StatCard({ title, value, icon: Icon, colorClass = 'text-saffron', loading }: StatCardProps) {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-black/5 dark:border-white/5 shadow-sm p-6 flex items-center gap-5">
      <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center bg-current/10 flex-shrink-0', colorClass)}>
        <div className="bg-current/10 rounded-xl p-2.5">
          <Icon className={cn('w-6 h-6', colorClass)} />
        </div>
      </div>
      <div>
        <p className="text-sm text-foreground/60 font-medium">{title}</p>
        {loading ? (
          <div className="h-7 w-16 bg-foreground/10 rounded animate-pulse mt-1" />
        ) : (
          <p className="text-3xl font-bold">{value}</p>
        )}
      </div>
    </div>
  );
}
