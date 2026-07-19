'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Users, GraduationCap, UserCog, BookOpen, LayoutDashboard, ArrowRight } from 'lucide-react';
import { searchAll, type SearchResult } from '@/lib/search';
import { cn } from '@/lib/utils';

const iconMap: Record<string, typeof Search> = {
  Users,
  GraduationCap,
  UserCog,
  BookOpen,
  LayoutDashboard,
};

const typeColors: Record<string, string> = {
  student: 'text-primary bg-primary/10',
  teacher: 'text-success bg-success/10',
  parent: 'text-info bg-info/10',
  class: 'text-accent bg-accent/10',
  subject: 'text-chart-4 bg-chart-4/10',
  page: 'text-muted-foreground bg-muted',
};

const typeLabels: Record<string, string> = {
  student: 'Student',
  teacher: 'Teacher',
  parent: 'Parent',
  class: 'Class',
  subject: 'Subject',
  page: 'Page',
};

interface GlobalSearchProps {
  rolePrefix: string;
}

export function GlobalSearch({ rolePrefix }: GlobalSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (query.trim()) {
      setResults(searchAll(query, rolePrefix));
      setOpen(true);
      setActiveIndex(0);
    } else {
      setResults([]);
      setOpen(false);
    }
  }, [query, rolePrefix]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open || results.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && results[activeIndex]) {
      e.preventDefault();
      handleSelect(results[activeIndex]);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  const handleSelect = (result: SearchResult) => {
    router.push(result.href);
    setQuery('');
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative flex-1 max-w-md">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <input
        type="text"
        placeholder="Search students, teachers, classes..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => results.length > 0 && setOpen(true)}
        className="h-9 w-full rounded-lg border border-input bg-muted/50 pl-10 pr-4 text-sm outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:bg-background focus:ring-2 focus:ring-ring/20"
      />
      {open && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 max-h-96 overflow-y-auto rounded-xl border bg-popover shadow-premium-lg z-50">
          <div className="p-1.5">
            {results.map((result, i) => {
              const Icon = iconMap[result.icon] ?? Search;
              return (
                <button
                  key={result.id}
                  onClick={() => handleSelect(result)}
                  onMouseEnter={() => setActiveIndex(i)}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors',
                    activeIndex === i ? 'bg-muted' : 'hover:bg-muted/50'
                  )}
                >
                  <div className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-lg', typeColors[result.type])}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{result.label}</p>
                    <p className="text-xs text-muted-foreground truncate">{result.sublabel}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                    {typeLabels[result.type]}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="border-t px-3 py-2 text-xs text-muted-foreground">
            Use <kbd className="rounded bg-muted px-1 py-0.5 font-mono">↑↓</kbd> to navigate,{' '}
            <kbd className="rounded bg-muted px-1 py-0.5 font-mono">↵</kbd> to select
          </div>
        </div>
      )}
      {open && query.trim() && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 rounded-xl border bg-popover shadow-premium-lg z-50 p-6 text-center">
          <p className="text-sm text-muted-foreground">No results found for &quot;{query}&quot;</p>
        </div>
      )}
    </div>
  );
}
