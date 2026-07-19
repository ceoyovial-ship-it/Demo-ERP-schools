'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FileText, Upload, Eye, Download, Loader2, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
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
import { getStudentKey, studentAssignments, type StudentAssignment } from '@/lib/student-data';

const selectClassStyle = 'h-9 rounded-lg border border-input bg-background px-3 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary/20';
type StatusFilter = 'all' | 'pending' | 'submitted' | 'graded' | 'overdue';

export default function StudentAssignmentsPage() {
  const { profile } = useAuth();
  const key = getStudentKey(profile?.email?.split('@')[0]);
  const [assignments, setAssignments] = useState<StudentAssignment[]>(studentAssignments[key]);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [submitItem, setSubmitItem] = useState<StudentAssignment | null>(null);
  const [viewItem, setViewItem] = useState<StudentAssignment | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const filteredAssignments = useMemo(() => {
    return assignments.filter((a) => statusFilter === 'all' || a.status === statusFilter);
  }, [assignments, statusFilter]);

  const pendingCount = assignments.filter((a) => a.status === 'pending').length;
  const submittedCount = assignments.filter((a) => a.status === 'submitted').length;
  const gradedCount = assignments.filter((a) => a.status === 'graded').length;

  const handleSubmit = () => {
    if (!submitItem) return;
    setSubmitting(true);
    setTimeout(() => {
      setAssignments((prev) => prev.map((a) => a.id === submitItem.id ? { ...a, status: 'submitted', fileName: 'my-submission.pdf', submittedDate: new Date().toISOString().split('T')[0] } : a));
      setSubmitting(false);
      toast.success('Assignment submitted successfully', { description: submitItem.title });
      setSubmitItem(null);
    }, 1200);
  };

  const statusConfig = {
    pending: { icon: Clock, color: 'text-accent', bg: 'bg-accent/10' },
    submitted: { icon: Upload, color: 'text-primary', bg: 'bg-primary/10' },
    graded: { icon: CheckCircle2, color: 'text-success', bg: 'bg-success/10' },
    overdue: { icon: AlertCircle, color: 'text-destructive', bg: 'bg-destructive/10' },
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Assignments" description="Submit and track your assignments" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total" value={assignments.length} icon={FileText} delay={0} />
        <StatCard title="Pending" value={pendingCount} icon={Clock} delay={0.05} />
        <StatCard title="Submitted" value={submittedCount} icon={Upload} delay={0.1} />
        <StatCard title="Graded" value={gradedCount} icon={CheckCircle2} delay={0.15} />
      </div>

      <SectionCard title="Assignment List" description={`${filteredAssignments.length} assignments`} delay={0.2}>
        <div className="mb-4 flex items-end gap-3">
          <div className="space-y-1.5"><Label className="text-xs text-muted-foreground">Status</Label><select className={selectClassStyle} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}><option value="all">All</option><option value="pending">Pending</option><option value="submitted">Submitted</option><option value="graded">Graded</option><option value="overdue">Overdue</option></select></div>
        </div>
        <div className="space-y-3">
          {filteredAssignments.map((asg, i) => {
            const config = statusConfig[asg.status];
            const StatusIcon = config.icon;
            return (
              <motion.div key={asg.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className={`rounded-xl border p-4 ${asg.status === 'overdue' ? 'border-destructive/30' : ''} transition-all hover:shadow-premium`}>
                <div className="flex items-start gap-4">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${config.bg}`}><StatusIcon className={`h-5 w-5 ${config.color}`} /></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2"><p className="text-sm font-medium">{asg.title}</p><Badge variant="secondary" className="text-xs">{asg.subject}</Badge><Badge variant="secondary" className={`text-xs capitalize ${config.bg} ${config.color}`}>{asg.status}</Badge></div>
                    <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{asg.description}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      <span>Due: {asg.dueDate}</span><span>Max: {asg.maxMarks}</span><span>By: {asg.teacherName}</span>
                      {asg.obtainedMarks !== null && <Badge variant="secondary" className="bg-success/10 text-success text-xs">Scored: {asg.obtainedMarks}/{asg.maxMarks}</Badge>}
                      {asg.fileName && <button onClick={() => toast.success(`Downloading ${asg.fileName}`)} className="flex items-center gap-1 text-primary hover:underline"><Download className="h-3 w-3" />{asg.fileName}</button>}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setViewItem(asg)}><Eye className="h-4 w-4" /></Button>
                    {(asg.status === 'pending' || asg.status === 'overdue') && <Button size="sm" variant="outline" className="h-8 gap-1.5" onClick={() => setSubmitItem(asg)}><Upload className="h-3.5 w-3.5" />Submit</Button>}
                  </div>
                </div>
              </motion.div>
            );
          })}
          {filteredAssignments.length === 0 && <div className="py-12 text-center text-sm text-muted-foreground">No assignments found</div>}
        </div>
      </SectionCard>

      <Dialog open={!!submitItem} onOpenChange={(open) => { if (!submitting) setSubmitItem(open ? submitItem : null); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Submit Assignment</DialogTitle><DialogDescription>{submitItem?.title}</DialogDescription></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="rounded-xl border-2 border-dashed border-border p-6 text-center transition-colors hover:border-primary/40">
              <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">Upload your assignment file</p>
              <p className="text-xs text-muted-foreground mt-1">PDF, DOCX, ZIP, images up to 20MB</p>
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
              <div><Label className="text-xs text-muted-foreground">Due Date</Label><p className="mt-1 text-sm">{viewItem?.dueDate}</p></div>
              <div><Label className="text-xs text-muted-foreground">Max Marks</Label><p className="mt-1 text-sm">{viewItem?.maxMarks}</p></div>
              <div><Label className="text-xs text-muted-foreground">Status</Label><p className="mt-1 text-sm capitalize">{viewItem?.status}</p></div>
              {viewItem?.obtainedMarks !== null && viewItem?.obtainedMarks !== undefined && <div><Label className="text-xs text-muted-foreground">Marks</Label><p className="mt-1 text-sm font-semibold text-success">{viewItem.obtainedMarks}/{viewItem.maxMarks}</p></div>}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
