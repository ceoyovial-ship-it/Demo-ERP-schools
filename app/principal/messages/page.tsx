'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import {
  MessageSquare,
  Search,
  Send,
  PenSquare,
  CheckCheck,
  ArrowLeft,
} from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import { StatCard } from '@/components/stat-card';
import { SectionCard } from '@/components/section-card';
import { ExportButtons } from '@/components/export-buttons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Message {
  id: number;
  sender: string;
  content: string;
  time: string;
  isMe: boolean;
}

interface Conversation {
  id: number;
  name: string;
  role: 'Parent' | 'Teacher' | 'Reception' | 'Admin';
  preview: string;
  time: string;
  unread: boolean;
  initials: string;
  messages: Message[];
}

type RoleFilter = 'all' | 'Parent' | 'Teacher' | 'Reception' | 'Admin';

// ---------------------------------------------------------------------------
// Static configuration
// ---------------------------------------------------------------------------

const ROLE_FILTERS: { key: RoleFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'Parent', label: 'Parent' },
  { key: 'Teacher', label: 'Teacher' },
  { key: 'Reception', label: 'Reception' },
  { key: 'Admin', label: 'Admin' },
];

const ROLE_BADGE_STYLES: Record<Conversation['role'], string> = {
  Parent: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  Teacher: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  Reception: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  Admin: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
};

const EASE = [0.22, 1, 0.36, 1] as const;

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const initialConversations: Conversation[] = [
  {
    id: 1,
    name: 'Anjali Reddy',
    role: 'Teacher',
    preview: 'Sir, Grade 10-A attendance marked',
    time: '5m',
    unread: true,
    initials: 'AR',
    messages: [
      {
        id: 1,
        sender: 'Anjali Reddy',
        content:
          'Good morning Sir, I have marked attendance for Grade 10-A.',
        time: '10:25 AM',
        isMe: false,
      },
      {
        id: 2,
        sender: 'Anjali Reddy',
        content:
          '28 out of 30 students present. 2 absent — Karthik Rao and Aditya Verma.',
        time: '10:26 AM',
        isMe: false,
      },
      {
        id: 3,
        sender: 'You',
        content:
          'Noted. Please follow up with Karthik\'s parents regarding his attendance pattern.',
        time: '10:30 AM',
        isMe: true,
      },
      {
        id: 4,
        sender: 'Anjali Reddy',
        content:
          'Sir, Grade 10-A attendance marked. I\'ll contact them today.',
        time: '10:32 AM',
        isMe: false,
      },
    ],
  },
  {
    id: 2,
    name: 'Priya Nair',
    role: 'Reception',
    preview: 'Fee collected from Sharma family',
    time: '15m',
    unread: true,
    initials: 'PN',
    messages: [
      {
        id: 1,
        sender: 'Priya Nair',
        content:
          'Sir, ₹45,000 fee collected from the Sharma family for Q2 tuition.',
        time: '10:10 AM',
        isMe: false,
      },
      {
        id: 2,
        sender: 'Priya Nair',
        content: 'Receipt RCP-00128 generated. Payment via UPI.',
        time: '10:11 AM',
        isMe: false,
      },
      {
        id: 3,
        sender: 'You',
        content: 'Good work. Please update the fee dashboard.',
        time: '10:15 AM',
        isMe: true,
      },
    ],
  },
  {
    id: 3,
    name: 'Ramesh Sharma',
    role: 'Parent',
    preview: 'Requesting meeting for Rahul',
    time: '1h',
    unread: false,
    initials: 'RS',
    messages: [
      {
        id: 1,
        sender: 'Ramesh Sharma',
        content:
          'Dear Principal, I would like to schedule a meeting regarding Rahul\'s performance in Mathematics.',
        time: '9:15 AM',
        isMe: false,
      },
      {
        id: 2,
        sender: 'You',
        content:
          'Certainly, Mr. Sharma. Are you available this Friday at 11:00 AM?',
        time: '9:30 AM',
        isMe: true,
      },
      {
        id: 3,
        sender: 'Ramesh Sharma',
        content: 'Yes, that works perfectly. Thank you.',
        time: '9:32 AM',
        isMe: false,
      },
    ],
  },
  {
    id: 4,
    name: 'Rajesh Kumar',
    role: 'Teacher',
    preview: 'Science exam papers ready',
    time: '2h',
    unread: false,
    initials: 'RK',
    messages: [
      {
        id: 1,
        sender: 'Rajesh Kumar',
        content: 'Sir, the Science mid-term exam papers are ready for review.',
        time: '8:45 AM',
        isMe: false,
      },
      {
        id: 2,
        sender: 'You',
        content:
          'Please leave them in my office. I\'ll review by end of day.',
        time: '8:50 AM',
        isMe: true,
      },
    ],
  },
  {
    id: 5,
    name: 'Meena Iyer',
    role: 'Teacher',
    preview: 'Leave application for July 19',
    time: '3h',
    unread: false,
    initials: 'MI',
    messages: [
      {
        id: 1,
        sender: 'Meena Iyer',
        content:
          'Sir, I have submitted a leave application for July 19 due to a personal matter.',
        time: '7:30 AM',
        isMe: false,
      },
      {
        id: 2,
        sender: 'You',
        content: 'Approved. Please ensure your classes are covered.',
        time: '8:00 AM',
        isMe: true,
      },
      {
        id: 3,
        sender: 'Meena Iyer',
        content:
          'Thank you, Sir. I\'ve arranged for Kavita Singh to cover my English classes.',
        time: '8:05 AM',
        isMe: false,
      },
    ],
  },
  {
    id: 6,
    name: 'Vikas Jain',
    role: 'Teacher',
    preview: 'Computer lab needs new systems',
    time: '5h',
    unread: false,
    initials: 'VJ',
    messages: [
      {
        id: 1,
        sender: 'Vikas Jain',
        content:
          'Sir, the computer lab needs 5 new systems. Current ones are 6 years old and frequently crash.',
        time: 'Yesterday',
        isMe: false,
      },
      {
        id: 2,
        sender: 'You',
        content:
          'Please prepare a quotation and submit it to the accounts department.',
        time: 'Yesterday',
        isMe: true,
      },
    ],
  },
  {
    id: 7,
    name: 'Suresh Babu',
    role: 'Teacher',
    preview: 'Social Studies field trip proposal',
    time: '6h',
    unread: false,
    initials: 'SB',
    messages: [
      {
        id: 1,
        sender: 'Suresh Babu',
        content:
          'Sir, I\'d like to propose a field trip to the State Museum for Grades 7-8 as part of their Social Studies curriculum.',
        time: 'Yesterday',
        isMe: false,
      },
    ],
  },
  {
    id: 8,
    name: 'Kavita Singh',
    role: 'Teacher',
    preview: 'Hindi workshop materials needed',
    time: '8h',
    unread: false,
    initials: 'KS',
    messages: [
      {
        id: 1,
        sender: 'Kavita Singh',
        content:
          'Sir, I need printing budget for Hindi workshop worksheets — approximately ₹2,000.',
        time: 'Yesterday',
        isMe: false,
      },
      {
        id: 2,
        sender: 'You',
        content: 'Approved. Please submit the bill to accounts.',
        time: 'Yesterday',
        isMe: true,
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function MessagesPage() {
  const router = useRouter();
  const [conversations, setConversations] =
    useState<Conversation[]>(initialConversations);
  const [selectedConversationId, setSelectedConversationId] = useState<number>(
    initialConversations[0].id
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('all');
  const [replyText, setReplyText] = useState('');
  // On mobile, only one pane is shown at a time. Default to the list so the
  // user can pick a conversation; selecting one flips to the detail view.
  const [showDetailOnMobile, setShowDetailOnMobile] = useState(false);

  const selectedConversation =
    conversations.find((c) => c.id === selectedConversationId) ?? null;
  const unreadCount = conversations.filter((c) => c.unread).length;

  // Filter conversations by role and search query.
  const filteredConversations = conversations.filter((c) => {
    const matchesRole = roleFilter === 'all' || c.role === roleFilter;
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      q.length === 0 ||
      c.name.toLowerCase().includes(q) ||
      c.role.toLowerCase().includes(q) ||
      c.preview.toLowerCase().includes(q);
    return matchesRole && matchesSearch;
  });

  const handleSelectConversation = (id: number) => {
    setSelectedConversationId(id);
    setShowDetailOnMobile(true);
    // Mark the selected conversation as read.
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, unread: false } : c))
    );
  };

  const handleBackToList = () => {
    setShowDetailOnMobile(false);
  };

  const handleMarkAllRead = () => {
    if (unreadCount === 0) {
      toast.info('All conversations are already read');
      return;
    }
    setConversations((prev) =>
      prev.map((c) => ({ ...c, unread: false }))
    );
    toast.success('All conversations marked as read', {
      description: `${unreadCount} unread message${unreadCount > 1 ? 's' : ''} cleared`,
    });
  };

  const handleSendReply = () => {
    const text = replyText.trim();
    if (!text || !selectedConversation) return;

    const now = new Date().toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });

    const newMessage: Message = {
      id: Date.now(),
      sender: 'You',
      content: text,
      time: now,
      isMe: true,
    };

    setConversations((prev) =>
      prev.map((c) =>
        c.id === selectedConversation.id
          ? {
              ...c,
              preview: text,
              time: 'now',
              messages: [...c.messages, newMessage],
            }
          : c
      )
    );
    setReplyText('');
    toast.success('Message sent', {
      description: `Reply sent to ${selectedConversation.name}`,
    });
  };

  const handleReplyKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendReply();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: EASE }}
      className="space-y-6"
    >
      <PageHeader
        title="Messages Center"
        description="View and manage all conversations"
      >
        <ExportButtons label="messages" />
        <Button
          onClick={() => router.push('/principal/messages/new')}
          className="gap-2"
        >
          <PenSquare className="h-4 w-4" />
          <span className="hidden sm:inline">Compose</span>
        </Button>
      </PageHeader>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Conversations"
          value={conversations.length}
          icon={MessageSquare}
          change="Across all roles"
          changeType="neutral"
          description="Active conversation threads"
          delay={0}
        />
        <StatCard
          title="Unread"
          value={unreadCount}
          icon={MessageSquare}
          change={unreadCount > 0 ? 'Needs attention' : 'All caught up'}
          changeType={unreadCount > 0 ? 'negative' : 'positive'}
          description="Messages awaiting review"
          delay={0.05}
        />
        <StatCard
          title="Today's Messages"
          value="12"
          icon={Send}
          change="+4 vs yesterday"
          changeType="positive"
          description="Messages exchanged today"
          delay={0.1}
        />
        <StatCard
          title="Response Rate"
          value="94%"
          icon={CheckCheck}
          change="+2% vs last week"
          changeType="positive"
          description="Of received messages replied to"
          delay={0.15}
        />
      </div>

      {/* Filter & search bar */}
      <SectionCard
        title="Conversations"
        description={`${filteredConversations.length} of ${conversations.length} conversations shown`}
        className="p-4 sm:p-5"
      >
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          {/* Role filters */}
          <div className="flex flex-wrap items-center gap-2">
            {ROLE_FILTERS.map((f) => {
              const isActive = roleFilter === f.key;
              return (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => setRoleFilter(f.key)}
                  aria-pressed={isActive}
                  className={cn(
                    'inline-flex items-center rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'border border-input bg-background text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  {f.label}
                </button>
              );
            })}
          </div>

          {/* Search + Mark all read */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 lg:w-64">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search conversations…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleMarkAllRead}
              className="gap-2 whitespace-nowrap"
            >
              <CheckCheck className="h-4 w-4" />
              <span className="hidden sm:inline">Mark All Read</span>
              {unreadCount > 0 && (
                <span className="ml-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-semibold text-primary-foreground">
                  {unreadCount}
                </span>
              )}
            </Button>
          </div>
        </div>
      </SectionCard>

      {/* Two-column layout
          — Desktop: list (320px) + detail side by side, both always visible.
          — Mobile: only one pane at a time (list first, then detail on select). */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[320px_1fr]">
        {/* Conversation list (left) */}
        <AnimatePresence mode="wait">
          {selectedConversation && (
            <motion.div
              key="conversation-list"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, ease: EASE }}
              className={cn(
                'rounded-2xl border bg-card shadow-premium',
                showDetailOnMobile ? 'hidden lg:block' : 'block'
              )}
            >
              <div className="flex h-full max-h-[640px] flex-col">
                <div className="border-b px-4 py-3">
                  <h2 className="text-sm font-semibold">Inbox</h2>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {filteredConversations.length} conversation
                    {filteredConversations.length !== 1 ? 's' : ''}
                    {unreadCount > 0 && ` · ${unreadCount} unread`}
                  </p>
                </div>

                <div className="flex-1 overflow-y-auto">
                  {filteredConversations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-2 px-4 py-12 text-center">
                      <MessageSquare className="h-8 w-8 text-muted-foreground/50" />
                      <p className="text-sm font-medium">No conversations found</p>
                      <p className="text-xs text-muted-foreground">
                        Try adjusting your search or filters.
                      </p>
                    </div>
                  ) : (
                    <ul className="divide-y">
                      {filteredConversations.map((c, idx) => {
                        const isSelected = c.id === selectedConversationId;
                        return (
                          <motion.li
                            key={c.id}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                              duration: 0.25,
                              delay: idx * 0.03,
                              ease: EASE,
                            }}
                          >
                            <button
                              type="button"
                              onClick={() => handleSelectConversation(c.id)}
                              className={cn(
                                'flex w-full items-start gap-3 px-4 py-3 text-left transition-colors',
                                isSelected
                                  ? 'bg-primary/5'
                                  : 'hover:bg-muted/60'
                              )}
                            >
                              {/* Avatar */}
                              <div
                                className={cn(
                                  'flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold',
                                  isSelected
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-primary/10 text-primary'
                                )}
                              >
                                {c.initials}
                              </div>

                              {/* Content */}
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between gap-2">
                                  <span
                                    className={cn(
                                      'truncate text-sm',
                                      c.unread
                                        ? 'font-semibold text-foreground'
                                        : 'font-medium text-foreground'
                                    )}
                                  >
                                    {c.name}
                                  </span>
                                  <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
                                    {c.time}
                                  </span>
                                </div>
                                <div className="mt-1 flex items-center gap-2">
                                  <span
                                    className={cn(
                                      'inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide',
                                      ROLE_BADGE_STYLES[c.role]
                                    )}
                                  >
                                    {c.role}
                                  </span>
                                </div>
                                <p
                                  className={cn(
                                    'mt-1 truncate text-xs',
                                    c.unread
                                      ? 'font-medium text-foreground'
                                      : 'text-muted-foreground'
                                  )}
                                >
                                  {c.preview}
                                </p>
                              </div>

                              {/* Unread dot */}
                              {c.unread && (
                                <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-primary" />
                              )}
                            </button>
                          </motion.li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Conversation detail (right) */}
        <AnimatePresence mode="wait">
          {selectedConversation ? (
            <motion.div
              key={`detail-${selectedConversation.id}`}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              transition={{ duration: 0.3, ease: EASE }}
              className={cn(
                'h-full max-h-[640px] flex-col rounded-2xl border bg-card shadow-premium',
                showDetailOnMobile ? 'flex' : 'hidden lg:flex'
              )}
            >
              {/* Detail header */}
              <div className="flex items-center gap-3 border-b px-4 py-3">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleBackToList}
                  className="lg:hidden"
                  aria-label="Back to conversation list"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div
                  className={cn(
                    'flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary'
                  )}
                >
                  {selectedConversation.initials}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-semibold">
                    {selectedConversation.name}
                  </h3>
                  <div className="mt-0.5 flex items-center gap-2">
                    <span
                      className={cn(
                        'inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide',
                        ROLE_BADGE_STYLES[selectedConversation.role]
                      )}
                    >
                      {selectedConversation.role}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {selectedConversation.messages.length} messages
                    </span>
                  </div>
                </div>
              </div>

              {/* Message thread */}
              <div className="flex-1 space-y-4 overflow-y-auto bg-muted/30 p-4">
                {selectedConversation.messages.map((m, idx) => (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.25,
                      delay: idx * 0.04,
                      ease: EASE,
                    }}
                    className={cn(
                      'flex',
                      m.isMe ? 'justify-end' : 'justify-start'
                    )}
                  >
                    <div
                      className={cn(
                        'max-w-[78%] rounded-2xl px-4 py-2.5 text-sm shadow-sm sm:max-w-[70%]',
                        m.isMe
                          ? 'rounded-br-sm bg-primary text-primary-foreground'
                          : 'rounded-bl-sm bg-background'
                      )}
                    >
                      {!m.isMe && (
                        <p className="mb-0.5 text-xs font-semibold text-primary">
                          {m.sender}
                        </p>
                      )}
                      <p className="whitespace-pre-wrap leading-relaxed">
                        {m.content}
                      </p>
                      <p
                        className={cn(
                          'mt-1 text-[10px] tabular-nums',
                          m.isMe
                            ? 'text-primary-foreground/70'
                            : 'text-muted-foreground'
                        )}
                      >
                        {m.time}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Reply input */}
              <div className="border-t p-3">
                <div className="flex items-end gap-2">
                  <Textarea
                    placeholder="Type your reply…"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    onKeyDown={handleReplyKeyDown}
                    rows={2}
                    className="min-h-[44px] resize-none"
                  />
                  <Button
                    onClick={handleSendReply}
                    disabled={!replyText.trim()}
                    size="icon"
                    className="h-11 w-11 shrink-0"
                    aria-label="Send reply"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <p className="mt-1.5 text-[10px] text-muted-foreground">
                  Press <kbd className="rounded bg-muted px-1 py-0.5 text-[9px] font-medium">Enter</kbd> to send ·{' '}
                  <kbd className="rounded bg-muted px-1 py-0.5 text-[9px] font-medium">Shift + Enter</kbd> for a new line
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="empty-detail"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="hidden flex-col items-center justify-center gap-3 rounded-2xl border bg-card p-12 text-center shadow-premium lg:flex"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                <MessageSquare className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-base font-semibold">Select a conversation</h3>
              <p className="max-w-xs text-sm text-muted-foreground">
                Choose a conversation from the list to view its messages and
                send a reply.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
