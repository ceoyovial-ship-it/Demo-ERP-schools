'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { BookMarked, CheckCircle2, AlertCircle, Clock, Eye, Upload, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '@/components/page-header';
import { StatCard } from '@/components/stat-card';
import { SectionCard } from '@/components/section-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
import { useAuth } from '@/components/auth-provider';
import { getStudentKey, studentHomework, type StudentHomework } from '@/lib/student-data';

const selectClassStyle = 'h-9 rounded-lg border border-input bg-background px-3 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary/20';
type StatusFilter = 'all' | 'pending' | 'submitted' | 'graded' | 'overdue';

export default function StudentHomeworkPage() {
  const { profile } = useAuth();
  const key = getStudentKey(profile?.email?.split('@')[0]);
  const [homework, setHomework] = useState<StudentHomework[]>(studentHomework[key]);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [search, setSearch] = useState('');
  const [submitItem, setSubmitItem] = useState<StudentHomework | null>(null);
  const [viewItem, setViewItem] = useState<StudentHomework | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const filteredHomework = useMemo(() => {
    return homework.filter((h) => {
      if (statusFilter !== 'all' && h.status !== statusFilter) return false;
      if (search && !h.title.toLowerCase().includes(search.toLowerCase()) && !h.subject.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [homework, statusFilter, search]);

  const pendingCount = homework.filter((h) => h.status === 'pending').length;
  const overdueCount = homework.filter((h) => h.status === 'overdue').length;
  const submittedCount = homework.filter((h) => h.status === 'submitted' || h.status === 'graded').length;

  const handleSubmit = () => {
    if (!submitItem) return;
    setSubmitting(true);
    setTimeout(() => {
      setHomework((prev) => prev.map((h) => h.id === submitItem.id ? { ...h, status: 'submitted' } : h));
      setSubmitting(false);
      toast.success('Homework submitted successfully', { description: submitItem.title });
      setSubmitItem(null);
    }, 1200);
  };

  const statusConfig = {
    pending: { icon: Clock, color: 'text-accent', bg: 'bg-accent/10', label: 'Pending' },
    submitted: { icon: CheckCircle2, color: 'text-primary', bg: 'bg-primary/10', label: 'Submitted' },
    graded: { icon: CheckCircle2, color: 'text-success', bg: 'bg-success/10', label: 'Graded' },
    overdue: { icon: AlertCircle, color: 'text-destructive', bg: 'bg-destructive/10', label: 'Overdue' },
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Homework" description="Your homework assignments and submissions" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total" value={homework.length} icon={BookMarked} delay={0} />
        <StatCard title="Pending" value={pendingCount} icon={Clock} delay={0.05} />
        <StatCard title="Overdue" value={overdueCount} icon={AlertCircle} changeType="negative" delay={0.1} />
        <StatCard title="Submitted" value={submittedCount} icon={CheckCircle2} changeType="positive" delay={0.15} />
      </div>

      <SectionCard title="Homework List" description={`${filteredHomework.length} assignments`} delay={0.2}>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="space-y-1.5"><Label className="text-xs text-muted-foreground">Status</Label><select className={selectClassStyle} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}><option value="all">All</option><option value="pending">Pending</option><option value="submitted">Submitted</option><option value="graded">Graded</option><option value="overdue">Overdue</option></select></div>
            <div className="space-y-1.5 sm:min-w-[200px]"><Label className="text-xs text-muted-foreground">Search</Label><Input placeholder="Search homework..." value={search} onChange={(e) => setSearch(e.target.value)} className="h-9" /></div>
          </div>
        </div>

        <div className="space-y-3">
          {filteredHomework.map((hw, i) => {
            const config = statusConfig[hw.status];
            const StatusIcon = config.icon;
            return (
              <motion.div key={hw.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className={`rounded-xl border p-4 ${hw.status === 'overdue' ? 'border-destructive/30' : ''} transition-all hover:shadow-premium`}>
                <div className="flex items-start gap-4">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${config.bg}`}><StatusIcon className={`h-5 w-5 ${config.color}`} /></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2"><p className="text-sm font-medium">{hw.title}</p><Badge variant="secondary" className="text-xs">{hw.subject}</Badge><Badge variant="secondary" className={`text-xs capitalize ${config.bg} ${config.color}`}>{hw.status}</Badge></div>
                    <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{hw.description}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground"><span>By: {hw.teacherName}</span><span>Assigned: {hw.assignedDate}</span><span>Due: {hw.dueDate}</span>{hw.grade && <Badge variant="secondary" className="bg-success/10 text-success text-xs">Grade: {hw.grade}</Badge>}</div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setViewItem(hw)}><Eye className="h-4 w-4" /></Button>
                    {(hw.status === 'pending' || hw.status === 'overdue') && (
                      <Button size="sm" variant="outline" className="h-8 gap-1.5" onClick={() => setSubmitItem(hw)}><Upload className="h-3.5 w-3.5" />Submit</Button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
          {filteredHomework.length === 0 && <div className="py-12 text-center text-sm text-muted-foreground">No homework found</div>}
        </div>
      </SectionCard>

      <Dialog open={!!submitItem} onOpenChange={(open) => { if (!submitting) setSubmitItem(open ? submitItem : null); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Submit Homework</DialogTitle><DialogDescription>{submitItem?.title}</DialogDescription></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="rounded-xl border-2 border-dashed border-border p-6 text-center transition-colors hover:border-primary/40">
              <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">Upload your homework file</p>
              <p className="text-xs text-muted-foreground mt-1">PDF, DOCX, images up to 10MB</p>
              <Input type="file" className="mt-3 h-9" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSubmitItem(null)} disabled={submitting}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={submitting} className="gap-2">{submitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Submitting...</> : <><Upload className="h-4 w-4" /> Submit</>}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!viewItem} onOpenChange={(open) => { if (!open) setViewItem(null); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{viewItem?.title}</DialogTitle><DialogDescription>{viewItem?.subject} · {viewItem?.teacherName}</DialogDescription></DialogHeader>
          <div className="space-y-4 py-2">
            <div><Label className="text-xs text-muted-foreground">Description</Label><p className="mt-1 text-sm">{viewItem?.description}</p></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label className="text-xs text-muted-foreground">Assigned</Label><p className="mt-1 text-sm">{viewItem?.assignedDate}</p></div>
              <div><Label className="text-xs text-muted-foreground">Due Date</Label><p className="mt-1 text-sm">{viewItem?.dueDate}</p></div>
              <div><Label className="text-xs text-muted-foreground">Status</Label><p className="mt-1 text-sm capitalize">{viewItem?.status}</p></div>
              {viewItem?.grade && <div><Label className="text-xs text-muted-foreground">Grade</Label><p className="mt-1 text-sm font-semibold text-success">{viewItem.grade}</p></div>}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
