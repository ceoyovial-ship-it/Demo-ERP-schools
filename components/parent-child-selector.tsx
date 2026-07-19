'use client';

import { useEffect, useMemo, useState } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/components/auth-provider';
import {
  getParentChildren,
  getStoredParentChildKey,
  setStoredParentChildKey,
  type ParentChildKey,
  type ParentChildSummary,
} from '@/lib/parent-data';

interface ParentChildSelectorProps {
  children: React.ReactNode;
}

export function ParentChildSelector({ children }: ParentChildSelectorProps) {
  const { profile } = useAuth();
  const parentChildren = useMemo(() => getParentChildren(profile?.email), [profile?.email]);
  const [selectedKey, setSelectedKey] = useState<ParentChildKey | null>(null);

  useEffect(() => {
    if (!parentChildren.length) return;

    const storedKey = getStoredParentChildKey(profile?.email?.split('@')[0]);
    const initialKey = storedKey && parentChildren.some((child) => child.key === storedKey)
      ? storedKey
      : parentChildren[0].key;

    setSelectedKey(initialKey);
    setStoredParentChildKey(profile?.email?.split('@')[0], initialKey);
  }, [parentChildren, profile?.email]);

  useEffect(() => {
    if (!selectedKey || !profile?.email) return;
    setStoredParentChildKey(profile?.email?.split('@')[0], selectedKey);
  }, [selectedKey, profile?.email]);

  if (parentChildren.length <= 1) {
    return <div key={selectedKey ?? 'single-child'}>{children}</div>;
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border bg-card p-3 shadow-premium">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold">Select Child</p>
            <p className="text-xs text-muted-foreground">Switch the parent portal view instantly</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {parentChildren.map((child) => {
              const initials = child.name
                .split(' ')
                .map((part) => part[0])
                .slice(0, 2)
                .join('')
                .toUpperCase();
              const active = selectedKey === child.key;

              return (
                <button
                  key={child.key}
                  type="button"
                  onClick={() => setSelectedKey(child.key)}
                  className={`flex items-center gap-3 rounded-xl border px-3 py-2 text-left transition-all ${active ? 'border-primary bg-primary/5' : 'bg-background hover:border-primary/30'}`}
                >
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">{initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{child.name}</p>
                    <p className="text-xs text-muted-foreground">{child.admissionNumber}</p>
                    <p className="text-xs text-muted-foreground">Class {child.classGrade}-{child.section}</p>
                  </div>
                  {active && <Badge variant="default" className="text-[10px]">Selected</Badge>}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div key={selectedKey ?? 'child-selector'}>{children}</div>
    </div>
  );
}
