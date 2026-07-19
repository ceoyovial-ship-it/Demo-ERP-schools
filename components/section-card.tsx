'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SectionCardProps {
  title: string;
  description?: string;
  className?: string;
  children: React.ReactNode;
  delay?: number;
}

export function SectionCard({
  title,
  description,
  className,
  children,
  delay = 0,
}: SectionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'rounded-2xl border bg-card p-6 shadow-premium',
        className
      )}
    >
      <div className="mb-4">
        <h2 className="text-base font-semibold">{title}</h2>
        {description && (
          <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {children}
    </motion.div>
  );
}
