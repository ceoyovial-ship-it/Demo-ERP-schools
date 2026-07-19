'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Bell, Plus, Trash2, Pencil, Eye, Loader2, Send } from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '@/components/page-header';
import { StatCard } from '@/components/stat-card';
import { SectionCard } from '@/components/section-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { teacherAnnouncements, type TeacherAnnouncement } from '@/lib/teacher-data';

const selectClassStyle =
  'h-9 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary/20';

const emptyForm = { title: '', content: '', audience: 'Grade 10-A', channel: 'In-app' };

export default function TeacherAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<TeacherAnnouncement[]>(teacherAnnouncements);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [viewItem, setViewItem] = useState<TeacherAnnouncement | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const sentCount = announcements.filter((a) => a.status === 'sent').length;
  const draftCount = announcements.filter((a) => a.status === 'draft').length;

  const handleSave = () => {
    if (!form.title.trim() || !form.content.trim()) {
      toast.error('Please fill in title and content');
      return;
    }
    setSaving(true);
    setTimeout(() => {
      if (editingId) {
        setAnnouncements((prev) => prev.map((a) => a.id === editingId ? { ...a, ...form } : a));
        toast.success('Announcement updated');
      } else {
        const newAnn: TeacherAnnouncement = {
          id: `tann-${Date.now()}`,
          ...form,
          date: new Date().toISOString().split('T')[0],
          status: 'sent',
        };
        setAnnouncements((prev) => [newAnn, ...prev]);
        toast.success('Announcement sent successfully');
      }
      setSaving(false);
      setShowModal(false);
      setForm(emptyForm);
      setEditingId(null);
    }, 1000);
  };

  const handleEdit = (ann: TeacherAnnouncement) => {
    setEditingId(ann.id);
    setForm({ title: ann.title, content: ann.content, audience: ann.audience, channel: ann.channel });
    setShowModal(true);
  };

  const handleDelete = () => {
    if (!deleteId) return;
    setAnnouncements((prev) => prev.filter((a) => a.id !== deleteId));
    toast.success('Announcement deleted');
    setDeleteId(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Announcements" description="Send announcements to students and parents">
        <Button size="sm" className="gap-2" onClick={() => { setEditingId(null); setForm(emptyForm); setShowModal(true); }}>
          <Plus className="h-4 w-4" />
          New Announcement
        </Button>
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="Total" value={announcements.length} icon={Bell} delay={0} />
        <StatCard title="Sent" value={sentCount} icon={Send} delay={0.05} />
        <StatCard title="Drafts" value={draftCount} icon={Bell} delay={0.1} />
      </div>

      <SectionCard title="Announcements" description={`${announcements.length} announcements`} delay={0.2}>
        <div className="space-y-3">
          {announcements.map((ann, i) => (
            <motion.div
              key={ann.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="rounded-xl border p-4 transition-all hover:shadow-premium"
            >
              <div className="flex items-start gap-4">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${ann.status === 'sent' ? 'bg-success/10' : 'bg-muted'}`}>
                  <Bell className={`h-5 w-5 ${ann.status === 'sent' ? 'text-success' : 'text-muted-foreground'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-medium">{ann.title}</p>
                    <Badge variant={ann.status === 'sent' ? 'default' : 'secondary'} className="text-xs capitalize">{ann.status}</Badge>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{ann.content}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span>To: {ann.audience}</span>
                    <span>{ann.channel}</span>
                    <span>{ann.date}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setViewItem(ann)}><Eye className="h-4 w-4" /></Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleEdit(ann)}><Pencil className="h-4 w-4" /></Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => setDeleteId(ann.id)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </SectionCard>

      <Dialog open={showModal} onOpenChange={(open) => { if (!saving) { setShowModal(open); if (!open) { setForm(emptyForm); setEditingId(null); } } }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit Announcement' : 'New Announcement'}</DialogTitle>
            <DialogDescription>{editingId ? 'Update announcement' : 'Send an announcement to students and parents'}</DialogDescription>
          </DialogHeader>
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="grid gap-4 py-2">
            <div className="space-y-1.5">
              <Label>Title *</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Announcement title" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Audience</Label>
                <select className={selectClassStyle} value={form.audience} onChange={(e) => setForm({ ...form, audience: e.target.value })}>
                  <option>Grade 10-A</option><option>Grade 10-B</option><option>Grade 9-A</option><option>Grade 9-B</option><option>Grade 10-A & B</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <Label>Channel</Label>
                <select className={selectClassStyle} value={form.channel} onChange={(e) => setForm({ ...form, channel: e.target.value })}>
                  <option>In-app</option><option>In-app + SMS</option><option>In-app + Email</option><option>SMS + Email</option>
                </select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Content *</Label>
              <Textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} placeholder="Announcement content..." rows={4} />
            </div>
          </motion.div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowModal(false); setForm(emptyForm); setEditingId(null); }} disabled={saving}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving} className="gap-2">
              {saving ? <><Loader2 className="h-4 w-4 animate-spin" /> Sending...</> : <><Send className="h-4 w-4" /> {editingId ? 'Update' : 'Send'}</>}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!viewItem} onOpenChange={(open) => { if (!open) setViewItem(null); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{viewItem?.title}</DialogTitle><DialogDescription>{viewItem?.audience} · {viewItem?.date}</DialogDescription></DialogHeader>
          <div className="space-y-4 py-2">
            <p className="text-sm">{viewItem?.content}</p>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <Badge variant="secondary">Channel: {viewItem?.channel}</Badge>
              <Badge variant={viewItem?.status === 'sent' ? 'default' : 'secondary'} className="capitalize">{viewItem?.status}</Badge>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => { if (!open) setDeleteId(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Delete Announcement?</AlertDialogTitle><AlertDialogDescription>This action cannot be undone.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
