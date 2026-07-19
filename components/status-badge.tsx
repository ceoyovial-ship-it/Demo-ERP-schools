'use client';

import { cn } from '@/lib/utils';

const variants: Record<string, string> = {
  default: 'bg-primary/10 text-primary border-primary/20',
  success: 'bg-success/10 text-success border-success/20',
  warning: 'bg-accent/10 text-accent border-accent/20',
  destructive: 'bg-destructive/10 text-destructive border-destructive/20',
  info: 'bg-info/10 text-info border-info/20',
  neutral: 'bg-muted text-muted-foreground border-border',
};

export function StatusBadge({
  status,
  variant = 'neutral',
  className,
}: {
  status: string;
  variant?: keyof typeof variants;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize',
        variants[variant],
        className
      )}
    >
      {status}
    </span>
  );
}

export function getFeeStatusVariant(status: string): keyof typeof variants {
  if (status === 'paid') return 'success';
  if (status === 'pending' || status === 'partial') return 'warning';
  if (status === 'overdue') return 'destructive';
  return 'neutral';
}

export function getAttendanceVariant(rate: number): keyof typeof variants {
  if (rate >= 90) return 'success';
  if (rate >= 75) return 'warning';
  return 'destructive';
}
