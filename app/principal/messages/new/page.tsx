'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import {
  ArrowLeft,
  Send,
  Save,
  Calendar,
  Upload,
  Mail,
  Smartphone,
  MessageSquare,
  Users,
  GraduationCap,
  School,
  Clock,
  Loader2,
} from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import { SectionCard } from '@/components/section-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { parents } from '@/lib/erp-data';
import { cn } from '@/lib/utils';

// ---------------------------------------------------------------------------
// Types & static config
// ---------------------------------------------------------------------------

type RecipientType = 'one' | 'multiple' | 'class' | 'school';
type Channel = 'SMS' | 'Email' | 'WhatsApp';

interface RecipientOption {
  value: RecipientType;
  label: string;
  icon: typeof Users;
  description: string;
}

interface ChannelOption {
  value: Channel;
  label: string;
  icon: typeof Mail;
}

const RECIPIENT_OPTIONS: RecipientOption[] = [
  {
    value: 'one',
    label: 'One Parent',
    icon: Users,
    description: 'Send to a single parent',
  },
  {
    value: 'multiple',
    label: 'Multiple Parents',
    icon: Users,
    description: 'Send to a selected group',
  },
  {
    value: 'class',
    label: 'Whole Class',
    icon: GraduationCap,
    description: 'Send to an entire class',
  },
  {
    value: 'school',
    label: 'Whole School',
    icon: School,
    description: 'Broadcast to everyone',
  },
];

const CHANNEL_OPTIONS: ChannelOption[] = [
  { value: 'SMS', label: 'SMS', icon: Smartphone },
  { value: 'Email', label: 'Email', icon: Mail },
  { value: 'WhatsApp', label: 'WhatsApp', icon: MessageSquare },
];

// Grades 6-10, Sections A/B
const CLASS_OPTIONS: string[] = (() => {
  const grades = [6, 7, 8, 9, 10];
  const sections = ['A', 'B'];
  return grades.flatMap((g) => sections.map((s) => `Grade ${g} - Section ${s}`));
})();

const PARENT_LIST = parents.slice(0, 50);
const PARENT_CHECKBOX_LIST = parents.slice(0, 20);

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function ComposeMessagePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [recipientType, setRecipientType] = useState<RecipientType>('one');
  const [selectedParent, setSelectedParent] = useState<string>('');
  const [selectedParents, setSelectedParents] = useState<string[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [subject, setSubject] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [channels, setChannels] = useState<Channel[]>(['Email']);
  const [attachmentNames, setAttachmentNames] = useState<string[]>([]);

  const [isSending, setIsSending] = useState<boolean>(false);
  const [showSchedule, setShowSchedule] = useState<boolean>(false);
  const [scheduledAt, setScheduledAt] = useState<string>('');

  const canSend = subject.trim().length > 0 && message.trim().length > 0 && !isSending;

  // --- handlers -----------------------------------------------------------

  function toggleChannel(channel: Channel) {
    setChannels((prev) =>
      prev.includes(channel)
        ? prev.filter((c) => c !== channel)
        : [...prev, channel]
    );
  }

  function toggleParent(parentId: string) {
    setSelectedParents((prev) =>
      prev.includes(parentId)
        ? prev.filter((id) => id !== parentId)
        : [...prev, parentId]
    );
  }

  function handleFilePick(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length > 0) {
      setAttachmentNames((prev) => [...prev, ...files.map((f) => f.name)]);
      toast.success(`${files.length} file${files.length > 1 ? 's' : ''} attached`);
    }
    // reset so the same file can be picked again later
    e.target.value = '';
  }

  function handleSaveDraft() {
    toast.success('Draft saved');
    router.push('/principal/messages');
  }

  function handleSchedule() {
    toast.success(
      scheduledAt
        ? `Message scheduled for ${new Date(scheduledAt).toLocaleString('en-US', {
            dateStyle: 'medium',
            timeStyle: 'short',
          })}`
        : 'Message scheduled'
    );
    router.push('/principal/messages');
  }

  function handleSend() {
    if (!canSend) return;
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      toast.success('Message Sent Successfully');
      router.push('/principal/messages');
    }, 1000);
  }

  // --- derived ------------------------------------------------------------

  const recipientSummary = (() => {
    switch (recipientType) {
      case 'one':
        return selectedParent
          ? PARENT_LIST.find((p) => p.id === selectedParent)?.name ?? '—'
          : 'No parent selected';
      case 'multiple':
        return selectedParents.length
          ? `${selectedParents.length} parent${selectedParents.length > 1 ? 's' : ''} selected`
          : 'No parents selected';
      case 'class':
        return selectedClass || 'No class selected';
      case 'school':
        return 'Entire school';
    }
  })();

  // --- render -------------------------------------------------------------

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 p-4 md:p-8">
      <PageHeader
        title="Compose Message"
        description="Send a message to parents, teachers, or the entire school"
      >
        <Button
          variant="outline"
          onClick={() => router.push('/principal/messages')}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Messages
        </Button>
      </PageHeader>

      {/* Recipient selection */}
      <SectionCard
        title="Recipients"
        description="Choose who should receive this message"
        delay={0.05}
      >
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {RECIPIENT_OPTIONS.map((opt) => {
            const Icon = opt.icon;
            const active = recipientType === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setRecipientType(opt.value)}
                className={cn(
                  'group flex flex-col items-start gap-2 rounded-xl border p-4 text-left transition-all',
                  active
                    ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                    : 'border-border bg-background hover:border-primary/40 hover:bg-accent'
                )}
              >
                <Icon
                  className={cn(
                    'h-5 w-5 transition-colors',
                    active ? 'text-primary-foreground' : 'text-muted-foreground'
                  )}
                />
                <span className="text-sm font-semibold leading-tight">
                  {opt.label}
                </span>
                <span
                  className={cn(
                    'text-xs leading-tight',
                    active ? 'text-primary-foreground/80' : 'text-muted-foreground'
                  )}
                >
                  {opt.description}
                </span>
              </button>
            );
          })}
        </div>

        {/* Recipient-specific field */}
        <AnimatePresence mode="wait">
          <motion.div
            key={recipientType}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="mt-5">
              {/* One Parent */}
              {recipientType === 'one' && (
                <div className="space-y-2">
                  <Label htmlFor="parent-select">Select Parent</Label>
                  <Select value={selectedParent} onValueChange={setSelectedParent}>
                    <SelectTrigger id="parent-select" className="w-full">
                      <SelectValue placeholder="Choose a parent" />
                    </SelectTrigger>
                    <SelectContent>
                      {PARENT_LIST.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.name}{' '}
                          <span className="text-muted-foreground">
                            · {p.children.join(', ')}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Multiple Parents */}
              {recipientType === 'multiple' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Select Parents</Label>
                    <span className="text-xs text-muted-foreground">
                      {selectedParents.length} selected
                    </span>
                  </div>
                  <div className="max-h-64 space-y-1 overflow-y-auto rounded-xl border border-border p-3">
                    {PARENT_CHECKBOX_LIST.map((p) => {
                      const checked = selectedParents.includes(p.id);
                      return (
                        <label
                          key={p.id}
                          htmlFor={`parent-${p.id}`}
                          className={cn(
                            'flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 transition-colors',
                            checked ? 'bg-accent' : 'hover:bg-accent/60'
                          )}
                        >
                          <Checkbox
                            id={`parent-${p.id}`}
                            checked={checked}
                            onCheckedChange={() => toggleParent(p.id)}
                          />
                          <span className="flex flex-col">
                            <span className="text-sm font-medium leading-tight">
                              {p.name}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {p.email}
                            </span>
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Whole Class */}
              {recipientType === 'class' && (
                <div className="space-y-2">
                  <Label htmlFor="class-select">Select Class</Label>
                  <Select value={selectedClass} onValueChange={setSelectedClass}>
                    <SelectTrigger id="class-select" className="w-full">
                      <SelectValue placeholder="Choose a class" />
                    </SelectTrigger>
                    <SelectContent>
                      {CLASS_OPTIONS.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Whole School */}
              {recipientType === 'school' && (
                <div className="flex items-center gap-3 rounded-xl border border-dashed border-border bg-muted/30 p-4">
                  <School className="h-5 w-5 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    This message will be sent to every parent and teacher in the
                    school. No additional selection needed.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </SectionCard>

      {/* Message content */}
      <SectionCard
        title="Message"
        description="Write the subject and body of your message"
        delay={0.1}
      >
        <div className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Parent-Teacher Meeting Reminder"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              rows={6}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message here…"
              className="resize-none"
            />
            <p className="text-right text-xs text-muted-foreground">
              {message.length} characters
            </p>
          </div>

          {/* Attachments */}
          <div className="space-y-2">
            <Label>Attachments</Label>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-muted/20 px-6 py-8 text-center transition-colors hover:border-primary/50 hover:bg-accent/40"
            >
              <Upload className="h-6 w-6 text-muted-foreground" />
              <span className="text-sm font-medium">Click to upload or drag files here</span>
              <span className="text-xs text-muted-foreground">
                PDF, DOCX, images up to 10MB
              </span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={handleFilePick}
            />
            <AnimatePresence>
              {attachmentNames.length > 0 && (
                <motion.ul
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="space-y-1"
                >
                  {attachmentNames.map((name, i) => (
                    <li
                      key={`${name}-${i}`}
                      className="flex items-center gap-2 rounded-lg bg-muted/40 px-3 py-2 text-sm"
                    >
                      <Upload className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="truncate">{name}</span>
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
        </div>
      </SectionCard>

      {/* Channel selection */}
      <SectionCard
        title="Delivery Channels"
        description="Pick one or more channels to send through"
        delay={0.15}
      >
        <div className="flex flex-wrap gap-3">
          {CHANNEL_OPTIONS.map((opt) => {
            const Icon = opt.icon;
            const active = channels.includes(opt.value);
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => toggleChannel(opt.value)}
                className={cn(
                  'inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-all',
                  active
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border bg-background text-muted-foreground hover:border-primary/40 hover:bg-accent'
                )}
              >
                <Icon className="h-4 w-4" />
                {opt.label}
                {active && (
                  <span className="ml-1 h-1.5 w-1.5 rounded-full bg-primary" />
                )}
              </button>
            );
          })}
        </div>
      </SectionCard>

      {/* Summary */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.2 }}
        className="flex flex-col gap-3 rounded-xl border bg-muted/20 p-4 text-sm sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <span className="text-muted-foreground">
            To: <span className="font-medium text-foreground">{recipientSummary}</span>
          </span>
          <span className="text-muted-foreground">
            Channel: <span className="font-medium text-foreground">
              {channels.length ? channels.join(' · ') : 'None selected'}
            </span>
          </span>
        </div>
      </motion.div>

      {/* Schedule row */}
      <AnimatePresence>
        {showSchedule && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-3 rounded-xl border bg-card p-4 sm:flex-row sm:items-end">
              <div className="flex-1 space-y-2">
                <Label htmlFor="schedule-at" className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Schedule for
                </Label>
                <Input
                  id="schedule-at"
                  type="datetime-local"
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action buttons */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.25 }}
        className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end"
      >
        <Button variant="outline" onClick={handleSaveDraft} className="gap-2">
          <Save className="h-4 w-4" />
          Save Draft
        </Button>

        <Button
          variant="outline"
          onClick={() => {
            if (!showSchedule) {
              setShowSchedule(true);
            } else {
              handleSchedule();
            }
          }}
          className="gap-2"
        >
          <Calendar className="h-4 w-4" />
          {showSchedule ? 'Confirm Schedule' : 'Schedule'}
        </Button>

        <Button
          onClick={handleSend}
          disabled={!canSend}
          className="gap-2"
        >
          {isSending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Sending…
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              Send
            </>
          )}
        </Button>
      </motion.div>
    </div>
  );
}
