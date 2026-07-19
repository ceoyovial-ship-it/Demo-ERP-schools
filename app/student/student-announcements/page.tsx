'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Eye, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '@/components/page-header';
import { StatCard } from '@/components/stat-card';
import { SectionCard } from '@/components/section-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import { useAuth } from '@/components/auth-provider';
import { getStudentKey, studentAnnouncements, type StudentAnnouncement } from '@/lib/student-data';

const selectClassStyle = 'h-9 rounded-lg border border-input bg-background px-3 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary/20';

export default function StudentAnnouncementsPage() {
  const { profile } = useAuth();
  const key = getStudentKey(profile?.email?.split('@')[0]);
  const [announcements, setAnnouncements] = useState<StudentAnnouncement[]>(studentAnnouncements[key]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [viewItem, setViewItem] = useState<StudentAnnouncement | null>(null);

  const filteredAnnouncements = announcements.filter((a) => {
    if (categoryFilter !== 'all' && a.category !== categoryFilter) return false;
    if (search && !a.title.toLowerCase().includes(search.toLowerCase()) && !a.content.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const categories = Array.from(new Set(announcements.map((a) => a.category)));
  const unreadCount = announcements.filter((a) => !a.read).length;

  const handleRead = (ann: StudentAnnouncement) => {
    setViewItem(ann);
    if (!ann.read) {
      setAnnouncements((prev) => prev.map((a) => a.id === ann.id ? { ...a, read: true } : a));
    }
  };

  const handleMarkAllRead = () => {
    setAnnouncements((prev) => prev.map((a) => ({ ...a, read: true })));
    toast.success('All announcements marked as read');
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Announcements" description={`${unreadCount} unread announcements`}>
        <Button size="sm" variant="outline" onClick={handleMarkAllRead}>Mark All Read</Button>
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="Total" value={announcements.length} icon={Bell} delay={0} />
        <StatCard title="Unread" value={unreadCount} icon={Mail} delay={0.05} />
        <StatCard title="Categories" value={categories.length} icon={Bell} delay={0.1} />
      </div>

      <SectionCard title="All Announcements" description={`${filteredAnnouncements.length} announcements`} delay={0.2}>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="space-y-1.5"><Label className="text-xs text-muted-foreground">Category</Label><select className={selectClassStyle} value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}><option value="all">All Categories</option>{categories.map((c) => <option key={c} value={c}>{c}</option>)}</select></div>
            <div className="space-y-1.5 sm:min-w-[200px]"><Label className="text-xs text-muted-foreground">Search</Label><Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="h-9" /></div>
          </div>
        </div>
        <div className="space-y-3">
          {filteredAnnouncements.map((ann, i) => (
            <motion.div key={ann.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className={`cursor-pointer rounded-xl border p-4 transition-all hover:shadow-premium ${!ann.read ? 'border-primary/30 bg-primary/5' : ''}`} onClick={() => handleRead(ann)}>
              <div className="flex items-start gap-4">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${!ann.read ? 'bg-primary/10' : 'bg-muted'}`}><Bell className={`h-5 w-5 ${!ann.read ? 'text-primary' : 'text-muted-foreground'}`} /></div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2"><p className="text-sm font-medium">{ann.title}</p><Badge variant="secondary" className="text-xs">{ann.category}</Badge>{!ann.read && <span className="h-2 w-2 rounded-full bg-primary" />}</div>
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{ann.content}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground"><span>From: {ann.from}</span><span>{ann.date}</span></div>
                </div>
                <Button size="icon" variant="ghost" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); handleRead(ann); }}><Eye className="h-4 w-4" /></Button>
              </div>
            </motion.div>
          ))}
          {filteredAnnouncements.length === 0 && <div className="py-12 text-center text-sm text-muted-foreground">No announcements found</div>}
        </div>
      </SectionCard>

      <Dialog open={!!viewItem} onOpenChange={(open) => { if (!open) setViewItem(null); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{viewItem?.title}</DialogTitle><DialogDescription>{viewItem?.from} · {viewItem?.date}</DialogDescription></DialogHeader>
          <div className="space-y-4 py-2">
            <p className="text-sm">{viewItem?.content}</p>
            <div className="flex items-center gap-2"><Badge variant="secondary">{viewItem?.category}</Badge><Badge variant={viewItem?.read ? 'secondary' : 'default'}>{viewItem?.read ? 'Read' : 'New'}</Badge></div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
