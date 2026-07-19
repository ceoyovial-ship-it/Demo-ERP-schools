'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import {
  MessageSquare,
  Send,
  Mail,
  Smartphone,
  Megaphone,
  Check,
  CheckCheck,
  AlertCircle,
} from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import { StatCard } from '@/components/stat-card';
import { SectionCard } from '@/components/section-card';
import { DataTable, type Column } from '@/components/data-table';
import { ExportButtons } from '@/components/export-buttons';
import { StatusBadge } from '@/components/status-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { announcements, messagesLog } from '@/lib/erp-data';
import { type ExportColumn } from '@/lib/export-utils';
import { cn } from '@/lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type AnnouncementRow = (typeof announcements)[number];
type MessageRow = (typeof messagesLog)[number];
type TabKey = 'announcements' | 'messages' | 'compose';
type Channel = 'SMS' | 'WhatsApp' | 'Email';
type Audience =
  | 'all_parents'
  | 'all_students'
  | 'all_teachers'
  | 'specific_class';

interface TabDef {
  key: TabKey;
  label: string;
  icon: typeof Megaphone;
}

// ---------------------------------------------------------------------------
// Static configuration
// ---------------------------------------------------------------------------

const TABS: TabDef[] = [
  { key: 'announcements', label: 'Announcements', icon: Megaphone },
  { key: 'messages', label: 'Messages', icon: MessageSquare },
  { key: 'compose', label: 'Compose', icon: Send },
];

const CHANNELS: { key: Channel; label: string; icon: typeof Mail }[] = [
  { key: 'SMS', label: 'SMS', icon: Smartphone },
  { key: 'WhatsApp', label: 'WhatsApp', icon: MessageSquare },
  { key: 'Email', label: 'Email', icon: Mail },
];

const AUDIENCES: { value: Audience; label: string }[] = [
  { value: 'all_parents', label: 'All Parents' },
  { value: 'all_students', label: 'All Students' },
  { value: 'all_teachers', label: 'All Teachers' },
  { value: 'specific_class', label: 'Specific Class' },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function announcementStatusVariant(
  status: string
): 'success' | 'warning' | 'neutral' {
  if (status === 'sent') return 'success';
  if (status === 'draft') return 'warning';
  return 'neutral';
}

function messageStatusVariant(
  status: string
): 'success' | 'info' | 'destructive' | 'warning' | 'neutral' {
  if (status === 'delivered') return 'success';
  if (status === 'read') return 'info';
  if (status === 'failed') return 'destructive';
  if (status === 'pending') return 'warning';
  return 'neutral';
}

function channelIcon(channel: string) {
  if (channel === 'SMS') return Smartphone;
  if (channel === 'WhatsApp') return MessageSquare;
  if (channel === 'Email') return Mail;
  return MessageSquare;
}

// ---------------------------------------------------------------------------
// Column definitions
// ---------------------------------------------------------------------------

const announcementColumns: Column<AnnouncementRow>[] = [
  {
    key: 'title',
    header: 'Title',
    sortable: true,
    className: 'font-medium',
    render: (a) => (
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
          <Megaphone className="h-4 w-4 text-primary" />
        </div>
        <span className="leading-tight">{a.title}</span>
      </div>
    ),
  },
  {
    key: 'category',
    header: 'Category',
    sortable: true,
    render: (a) => (
      <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
        {a.category}
      </span>
    ),
    className: 'whitespace-nowrap',
  },
  {
    key: 'audience',
    header: 'Audience',
    sortable: true,
    render: (a) => (
      <span className="whitespace-nowrap text-sm text-muted-foreground">
        {a.audience}
      </span>
    ),
  },
  {
    key: 'date',
    header: 'Date',
    sortable: true,
    render: (a) => (
      <span className="whitespace-nowrap text-sm tabular-nums text-muted-foreground">
        {formatDate(a.date)}
      </span>
    ),
  },
  {
    key: 'channel',
    header: 'Channel',
    render: (a) => (
      <span className="whitespace-nowrap text-sm text-muted-foreground">
        {a.channel}
      </span>
    ),
  },
  {
    key: 'reach',
    header: 'Reach',
    sortable: true,
    render: (a) => (
      <span className="tabular-nums font-medium">{a.reach.toLocaleString()}</span>
    ),
    className: 'whitespace-nowrap',
  },
  {
    key: 'status',
    header: 'Status',
    render: (a) => (
      <StatusBadge
        status={a.status}
        variant={announcementStatusVariant(a.status)}
      />
    ),
    className: 'whitespace-nowrap',
  },
];

const announcementExportColumns: ExportColumn[] = [
  { key: 'title', label: 'Title' },
  { key: 'category', label: 'Category' },
  { key: 'audience', label: 'Audience' },
  { key: 'date', label: 'Date' },
  { key: 'channel', label: 'Channel' },
  { key: 'reach', label: 'Reach' },
  { key: 'status', label: 'Status' },
];

const messageExportColumns: ExportColumn[] = [
  { key: 'recipient', label: 'Recipient' },
  { key: 'channel', label: 'Channel' },
  { key: 'subject', label: 'Subject' },
  { key: 'status', label: 'Status' },
  { key: 'sentAt', label: 'Sent At' },
];

const messageColumns: Column<MessageRow>[] = [
  {
    key: 'recipient',
    header: 'Recipient',
    sortable: true,
    className: 'font-medium',
    render: (m) => (
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
          {m.recipient
            .split(' ')
            .map((n) => n[0])
            .slice(0, 2)
            .join('')
            .toUpperCase()}
        </div>
        <span className="whitespace-nowrap text-sm">{m.recipient}</span>
      </div>
    ),
  },
  {
    key: 'channel',
    header: 'Channel',
    sortable: true,
    render: (m) => {
      const Icon = channelIcon(m.channel);
      return (
        <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-sm text-muted-foreground">
          <Icon className="h-3.5 w-3.5" />
          {m.channel}
        </span>
      );
    },
  },
  {
    key: 'subject',
    header: 'Subject',
    sortable: true,
    render: (m) => <span className="text-sm">{m.subject}</span>,
  },
  {
    key: 'status',
    header: 'Status',
    render: (m) => (
      <StatusBadge
        status={m.status}
        variant={messageStatusVariant(m.status)}
      />
    ),
    className: 'whitespace-nowrap',
  },
  {
    key: 'sentAt',
    header: 'Sent At',
    sortable: true,
    render: (m) => (
      <span className="whitespace-nowrap text-sm tabular-nums text-muted-foreground">
        {m.sentAt}
      </span>
    ),
  },
];

// ---------------------------------------------------------------------------
// Tab content components
// ---------------------------------------------------------------------------

function AnnouncementsTab() {
  const totalReach = announcements.reduce((sum, a) => sum + a.reach, 0);

  return (
    <SectionCard
      title="Announcements"
      description={`${announcements.length} announcements · ${totalReach.toLocaleString()} total recipients reached`}
    >
      <div className="mb-4 flex justify-end">
        <ExportButtons
          label="announcements"
          data={announcements as unknown as Record<string, unknown>[]}
          columns={announcementExportColumns}
          filename="announcements"
        />
      </div>
      <DataTable
        data={announcements}
        columns={announcementColumns}
        searchKeys={['title', 'category', 'audience', 'channel', 'status']}
        searchPlaceholder="Search announcements…"
        pageSize={10}
        onRowClick={(a) =>
          toast.info(a.title, {
            description: `${a.category} · ${a.audience} · ${a.channel}`,
          })
        }
        initialSort={{ key: 'date', dir: 'desc' }}
      />
    </SectionCard>
  );
}

function MessagesTab() {
  return (
    <SectionCard
      title="Message Log"
      description={`${messagesLog.length} recent messages across all channels`}
    >
      <div className="mb-4 flex justify-end">
        <ExportButtons
          label="message log"
          data={messagesLog as unknown as Record<string, unknown>[]}
          columns={messageExportColumns}
          filename="message-log"
        />
      </div>
      <DataTable
        data={messagesLog}
        columns={messageColumns}
        searchKeys={['recipient', 'channel', 'subject', 'status']}
        searchPlaceholder="Search by recipient, subject, or status…"
        pageSize={10}
        onRowClick={(m) =>
          toast.info(m.subject, {
            description: `To ${m.recipient} via ${m.channel} · ${m.status}`,
          })
        }
        initialSort={{ key: 'sentAt', dir: 'desc' }}
      />
    </SectionCard>
  );
}

function ComposeTab() {
  const [channels, setChannels] = useState<Channel[]>(['SMS']);
  const [audience, setAudience] = useState<Audience>('all_parents');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const canSend = subject.trim().length > 0 && message.trim().length > 0 && channels.length > 0;

  const toggleChannel = (channel: Channel) => {
    setChannels((prev) =>
      prev.includes(channel)
        ? prev.filter((c) => c !== channel)
        : [...prev, channel]
    );
  };

  const audienceLabel =
    AUDIENCES.find((a) => a.value === audience)?.label ?? 'All Parents';

  const handleSend = () => {
    if (!canSend) return;
    setSending(true);
    // Simulate a brief async send so the button shows feedback.
    setTimeout(() => {
      setSending(false);
      toast.success('Message sent successfully', {
        description: `${channels.join(' + ')} · ${audienceLabel} · ${subject.trim()}`,
      });
      // Reset the form
      setChannels(['SMS']);
      setAudience('all_parents');
      setSubject('');
      setMessage('');
    }, 600);
  };

  return (
    <SectionCard
      title="Compose Message"
      description="Send an announcement or direct message to your selected audience"
    >
      <div className="mb-4 flex justify-end">
        <ExportButtons label="compose template" data={[]} columns={[]} />
      </div>

      <div className="space-y-6">
        {/* Channel selector */}
        <div className="space-y-2">
          <Label>Channel</Label>
          <div className="flex flex-wrap gap-2">
            {CHANNELS.map((ch) => {
              const Icon = ch.icon;
              const active = channels.includes(ch.key);
              return (
                <button
                  key={ch.key}
                  type="button"
                  onClick={() => toggleChannel(ch.key)}
                  aria-pressed={active}
                  className={cn(
                    'inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors',
                    active
                      ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                      : 'border-input bg-background text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {ch.label}
                </button>
              );
            })}
          </div>
          {channels.length === 0 && (
            <p className="text-xs text-destructive">
              Select at least one channel to send the message.
            </p>
          )}
        </div>

        {/* Audience selector */}
        <div className="space-y-2">
          <Label htmlFor="audience-select">Audience</Label>
          <Select value={audience} onValueChange={(v) => setAudience(v as Audience)}>
            <SelectTrigger id="audience-select" className="w-full sm:max-w-sm">
              <SelectValue placeholder="Select audience" />
            </SelectTrigger>
            <SelectContent>
              {AUDIENCES.map((a) => (
                <SelectItem key={a.value} value={a.value}>
                  {a.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Subject */}
        <div className="space-y-2">
          <Label htmlFor="subject">Subject</Label>
          <Input
            id="subject"
            placeholder="Enter message subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            maxLength={120}
          />
        </div>

        {/* Message */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="message">Message</Label>
            <span className="text-xs text-muted-foreground tabular-nums">
              {message.length} characters
            </span>
          </div>
          <Textarea
            id="message"
            placeholder="Type your message here…"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={6}
            className="resize-y"
          />
        </div>

        {/* Summary + Send */}
        <div className="flex flex-col gap-4 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-muted-foreground">
            Sending via{' '}
            <span className="font-medium text-foreground">
              {channels.length > 0 ? channels.join(' + ') : '—'}
            </span>{' '}
            to{' '}
            <span className="font-medium text-foreground">{audienceLabel}</span>
          </div>
          <Button
            type="button"
            onClick={handleSend}
            disabled={!canSend || sending}
            className="gap-2 sm:self-end"
          >
            <Send className={cn('h-4 w-4', sending && 'animate-pulse')} />
            {sending ? 'Sending…' : 'Send Message'}
          </Button>
        </div>
      </div>
    </SectionCard>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function CommunicationPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('announcements');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <PageHeader
        title="Communication"
        description="Send messages, announcements, and circulars"
      >
        <ExportButtons
          label="communication summary"
          data={announcements as unknown as Record<string, unknown>[]}
          columns={announcementExportColumns}
          filename="communication-summary"
        />
      </PageHeader>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Sent"
          value="1,240"
          icon={Send}
          change="+8% vs last month"
          changeType="positive"
          description="Messages across all channels"
          delay={0}
        />
        <StatCard
          title="Delivered"
          value="1,198"
          icon={CheckCheck}
          change="96.6% delivery rate"
          changeType="positive"
          description="Successfully delivered"
          delay={0.05}
        />
        <StatCard
          title="Read"
          value="892"
          icon={Check}
          change="71.9% read rate"
          changeType="positive"
          description="Opened / read by recipients"
          delay={0.1}
        />
        <StatCard
          title="Failed"
          value="42"
          icon={AlertCircle}
          change="3.4% failure rate"
          changeType="negative"
          description="Bounced or undelivered"
          delay={0.15}
        />
      </div>

      {/* Tab navigation */}
      <div className="overflow-x-auto">
        <nav
          aria-label="Communication sections"
          className="inline-flex min-w-full gap-1 rounded-xl border bg-card p-1 sm:min-w-0"
        >
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'inline-flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-colors sm:flex-none',
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        >
          {activeTab === 'announcements' && <AnnouncementsTab />}
          {activeTab === 'messages' && <MessagesTab />}
          {activeTab === 'compose' && <ComposeTab />}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
