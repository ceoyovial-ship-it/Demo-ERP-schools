'use client';

import { useState } from 'react';
import { MessageSquare, Search } from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface Conversation {
  id: number;
  name: string;
  role: string;
  preview: string;
  time: string;
  unread: boolean;
  initials: string;
}

const conversations: Conversation[] = [
  { id: 1, name: 'Anjali Reddy', role: 'Teacher', preview: 'Sir, Grade 10-A attendance marked', time: '5m', unread: true, initials: 'AR' },
  { id: 2, name: 'Priya Nair', role: 'Receptionist', preview: 'Fee collected from Sharma family', time: '15m', unread: true, initials: 'PN' },
  { id: 3, name: 'Ramesh Sharma', role: 'Parent', preview: 'Requesting meeting for Rahul', time: '1h', unread: false, initials: 'RS' },
  { id: 4, name: 'Rajesh Kumar', role: 'Teacher', preview: 'Science exam papers ready', time: '2h', unread: false, initials: 'RK' },
  { id: 5, name: 'Meena Iyer', role: 'Teacher', preview: 'Leave application for July 19', time: '3h', unread: false, initials: 'MI' },
  { id: 6, name: 'Vikas Jain', role: 'Teacher', preview: 'Computer lab needs new systems', time: '5h', unread: false, initials: 'VJ' },
];

export function MessagesPanel() {
  const [query, setQuery] = useState('');

  const unreadCount = conversations.filter((c) => c.unread).length;

  const filtered = conversations.filter((c) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      c.name.toLowerCase().includes(q) ||
      c.preview.toLowerCase().includes(q) ||
      c.role.toLowerCase().includes(q)
    );
  });

  const handleSelect = (name: string) => {
    toast.success(`Opening chat with ${name}`);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-lg">
          <MessageSquare className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-accent" />
          )}
          <span className="sr-only">Open messages</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold">Messages</h3>
            {unreadCount > 0 && (
              <Badge variant="default" className="h-5 px-1.5 text-[10px]">
                {unreadCount}
              </Badge>
            )}
          </div>
          <button className="text-xs text-muted-foreground transition-colors hover:text-foreground">
            Mark all read
          </button>
        </div>

        {/* Search */}
        <div className="relative p-3">
          <Search className="absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search conversations..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-9 pl-8"
          />
        </div>

        {/* Conversation list */}
        <div className="max-h-72 overflow-y-auto">
          {filtered.length > 0 ? (
            filtered.map((c) => (
              <button
                key={c.id}
                onClick={() => handleSelect(c.name)}
                className={cn(
                  'flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/50',
                  c.unread && 'bg-muted/30'
                )}
              >
                {/* Avatar initials */}
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                  {c.initials}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="truncate text-sm font-medium">{c.name}</span>
                      <span className="shrink-0 rounded-full bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                        {c.role}
                      </span>
                    </div>
                    <span className="shrink-0 text-[11px] text-muted-foreground">{c.time}</span>
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground truncate">{c.preview}</p>
                </div>

                {/* Unread indicator */}
                {c.unread && (
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-accent" />
                )}
              </button>
            ))
          ) : (
            <div className="px-4 py-8 text-center">
              <p className="text-sm text-muted-foreground">
                No conversations found for &quot;{query}&quot;
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t px-4 py-2.5">
          <button
            onClick={() => toast.success('Opening all messages')}
            className="w-full text-center text-xs font-medium text-primary transition-colors hover:text-primary/80"
          >
            View all messages
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
