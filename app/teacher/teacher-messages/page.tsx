'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Send, Reply, Inbox, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '@/components/page-header';
import { SectionCard } from '@/components/section-card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { teacherMessages, type TeacherMessage } from '@/lib/teacher-data';

export default function TeacherMessagesPage() {
  const [messages, setMessages] = useState<TeacherMessage[]>(teacherMessages);
  const [selectedId, setSelectedId] = useState<string | null>(teacherMessages[0]?.id ?? null);
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);

  const selectedMessage = messages.find((m) => m.id === selectedId);
  const unreadCount = messages.filter((m) => !m.read).length;

  const handleSelect = (msg: TeacherMessage) => {
    setSelectedId(msg.id);
    if (!msg.read) {
      setMessages((prev) => prev.map((m) => m.id === msg.id ? { ...m, read: true } : m));
    }
  };

  const handleReply = () => {
    if (!replyText.trim() || !selectedMessage) {
      toast.error('Please enter a reply message');
      return;
    }
    setSending(true);
    setTimeout(() => {
      toast.success('Reply sent successfully', { description: `To: ${selectedMessage.senderName}` });
      setReplyText('');
      setSending(false);
    }, 1000);
  };

  const handleDelete = (id: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
    if (selectedId === id) {
      setSelectedId(messages[0]?.id ?? null);
    }
    toast.success('Message deleted');
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Messages" description={`${unreadCount} unread messages`} />

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Message List */}
        <SectionCard title="Inbox" description={`${messages.length} messages`} delay={0.1} className="lg:col-span-1">
          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {messages.map((msg, i) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => handleSelect(msg)}
                className={`cursor-pointer rounded-xl border p-3 transition-all ${selectedId === msg.id ? 'border-primary bg-primary/5' : !msg.read ? 'border-primary/20' : 'hover:bg-muted/30'}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${msg.read ? 'bg-muted' : 'bg-primary/10'}`}>
                    <Mail className={`h-4 w-4 ${msg.read ? 'text-muted-foreground' : 'text-primary'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium truncate">{msg.senderName}</p>
                      {!msg.read && <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{msg.subject}</p>
                    <p className="text-xs text-muted-foreground mt-1 truncate">{msg.preview}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">{msg.senderRole}</Badge>
                      <span className="text-xs text-muted-foreground">{msg.date}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </SectionCard>

        {/* Message Detail + Reply */}
        <SectionCard title="Conversation" delay={0.15} className="lg:col-span-2">
          {selectedMessage ? (
            <div className="flex h-full flex-col">
              <div className="border-b pb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-semibold">{selectedMessage.subject}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">From: {selectedMessage.senderName} ({selectedMessage.senderRole})</p>
                    <p className="text-xs text-muted-foreground">{selectedMessage.date}</p>
                  </div>
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => handleDelete(selectedMessage.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex-1 py-4">
                <p className="text-sm whitespace-pre-wrap">{selectedMessage.content}</p>
              </div>
              <div className="border-t pt-4">
                <div className="flex items-center gap-2 mb-2">
                  <Reply className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Reply to {selectedMessage.senderName}</span>
                </div>
                <Textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your reply..."
                  rows={3}
                />
                <div className="mt-3 flex justify-end">
                  <Button size="sm" className="gap-2" onClick={handleReply} disabled={sending || !replyText.trim()}>
                    <Send className="h-4 w-4" />
                    {sending ? 'Sending...' : 'Send Reply'}
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center py-16 text-center">
              <Inbox className="h-12 w-12 text-muted-foreground/50" />
              <p className="mt-4 text-sm text-muted-foreground">Select a message to view</p>
            </div>
          )}
        </SectionCard>
      </div>
    </div>
  );
}
