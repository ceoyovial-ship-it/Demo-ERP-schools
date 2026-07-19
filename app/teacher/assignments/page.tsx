'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FileText, Plus, Eye, Upload, Download, Loader2, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
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
import { assignmentList, type Assignment } from '@/lib/teacher-data';

const selectClassStyle =
  'h-9 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary/20';

type StatusFilter = 'all' | 'active' | 'completed' | 'overdue';

const emptyForm = {
  title: '',
  description: '',
  subject: 'Mathematics',
  classGrade: '10',
  section: 'A',
  dueDate: '',
  maxMarks: '50',
};

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>(assignmentList);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [viewItem, setViewItem] = useState<Assignment | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const filteredAssignments = useMemo(() => {
    const q = search.trim().toLowerCase();
    return assignments.filter((a) => {
      if (statusFilter !== 'all' && a.status !== statusFilter) return false;
      if (q && !a.title.toLowerCase().includes(q) && !a.subject.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [assignments, statusFilter, search]);

  const activeCount = assignments.filter((a) => a.status === 'active').length;
  const completedCount = assignments.filter((a) => a.status === 'completed').length;
  const totalSubmissions = assignments.reduce((sum, a) => sum + a.submissions, 0);

  const handleSave = () => {
    if (!form.title.trim() || !form.description.trim() || !form.dueDate) {
      toast.error('Please fill in all required fields');
      return;
    }
    setSaving(true);
    setUploading(true);
    setTimeout(() => {
      const newAsg: Assignment = {
        id: `asg-${Date.now()}`,
        title: form.title,
        description: form.description,
        subject: form.subject,
        classGrade: form.classGrade,
        section: form.section,
        dueDate: form.dueDate,
        maxMarks: parseInt(form.maxMarks) || 50,
        fileName: 'assignment-guide.pdf',
        fileSize: '1.2 MB',
        uploadDate: new Date().toISOString().split('T')[0],
        submissions: 0,
        totalStudents: form.classGrade === '10' ? 32 : 28,
        status: 'active',
      };
      setAssignments((prev) => [newAsg, ...prev]);
      setSaving(false);
      setUploading(false);
      setShowModal(false);
      setForm(emptyForm);
      toast.success('Assignment created and uploaded successfully');
    }, 1500);
  };

  const handleDownload = (asg: Assignment) => {
    toast.success(`Downloading ${asg.fileName}`, { description: `${asg.fileSize} · ${asg.subject}` });
  };

  const statusConfig = {
    active: { icon: Clock, color: 'text-primary', bg: 'bg-primary/10', label: 'Active' },
    completed: { icon: CheckCircle2, color: 'text-success', bg: 'bg-success/10', label: 'Completed' },
    overdue: { icon: AlertCircle, color: 'text-destructive', bg: 'bg-destructive/10', label: 'Overdue' },
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Assignments" description="Upload and manage student assignments">
        <Button
          size="sm"
          className="gap-2"
          onClick={() => { setForm(emptyForm); setShowModal(true); }}
        >
          <Plus className="h-4 w-4" />
          New Assignment
        </Button>
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total" value={assignments.length} icon={FileText} delay={0} />
        <StatCard title="Active" value={activeCount} icon={Clock} delay={0.05} />
        <StatCard title="Submissions" value={totalSubmissions} icon={Upload} delay={0.1} />
        <StatCard title="Completed" value={completedCount} icon={CheckCircle2} delay={0.15} />
      </div>

      <SectionCard title="Assignment List" description={`${filteredAssignments.length} assignments`} delay={0.2}>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Status</Label>
              <select className={selectClassStyle} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}>
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
            <div className="space-y-1.5 sm:min-w-[240px]">
              <Label className="text-xs text-muted-foreground">Search</Label>
              <Input placeholder="Search assignments..." value={search} onChange={(e) => setSearch(e.target.value)} className="h-9" />
            </div>
          </div>
        </div>

        <div className="grid gap-3">
          {filteredAssignments.map((asg, i) => {
            const config = statusConfig[asg.status];
            const StatusIcon = config.icon;
            const progress = Math.round((asg.submissions / asg.totalStudents) * 100);
            return (
              <motion.div
                key={asg.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="rounded-xl border p-4 transition-all hover:shadow-premium"
              >
                <div className="flex items-start gap-4">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${config.bg}`}>
                    <StatusIcon className={`h-5 w-5 ${config.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-medium">{asg.title}</p>
                      <Badge variant="secondary" className="text-xs">{asg.subject}</Badge>
                      <Badge variant="outline" className="text-xs">Max: {asg.maxMarks}</Badge>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{asg.description}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      <span>Grade {asg.classGrade}-{asg.section}</span>
                      <span>Due: {asg.dueDate}</span>
                      <button onClick={() => handleDownload(asg)} className="flex items-center gap-1 text-primary hover:underline">
                        <Download className="h-3 w-3" />
                        {asg.fileName}
                      </button>
                    </div>
                    <div className="mt-3 flex items-center gap-3">
                      <div className="h-2 flex-1 max-w-[200px] overflow-hidden rounded-full bg-muted">
                        <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progress}%` }} />
                      </div>
                      <span className="text-xs font-medium">{asg.submissions}/{asg.totalStudents} submitted</span>
                    </div>
                  </div>
                  <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setViewItem(asg)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            );
          })}
          {filteredAssignments.length === 0 && (
            <div className="py-12 text-center text-sm text-muted-foreground">No assignments found</div>
          )}
        </div>
      </SectionCard>

      {/* Create Modal with Upload UI */}
      <Dialog open={showModal} onOpenChange={(open) => { if (!saving) setShowModal(open); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>New Assignment</DialogTitle>
            <DialogDescription>Create an assignment and upload supporting files</DialogDescription>
          </DialogHeader>
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="grid gap-4 py-2">
            <div className="space-y-1.5">
              <Label>Title *</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Math Project: Trigonometry" />
            </div>
            <div className="grid grid-cols-4 gap-3">
              <div className="space-y-1.5">
                <Label>Subject</Label>
                <select className={selectClassStyle} value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}>
                  <option>Mathematics</option>
                  <option>Science</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <Label>Grade</Label>
                <select className={selectClassStyle} value={form.classGrade} onChange={(e) => setForm({ ...form, classGrade: e.target.value })}>
                  <option value="10">10</option>
                  <option value="9">9</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <Label>Section</Label>
                <select className={selectClassStyle} value={form.section} onChange={(e) => setForm({ ...form, section: e.target.value })}>
                  <option value="A">A</option>
                  <option value="B">B</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <Label>Max Marks</Label>
                <Input type="number" value={form.maxMarks} onChange={(e) => setForm({ ...form, maxMarks: e.target.value })} className="h-9" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Description *</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Assignment description..." rows={3} />
            </div>
            <div className="space-y-1.5">
              <Label>Due Date *</Label>
              <Input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
            </div>
            {/* Upload UI */}
            <div className="space-y-1.5">
              <Label>Attachment</Label>
              <div className="flex items-center justify-center rounded-xl border-2 border-dashed border-border p-6 text-center transition-colors hover:border-primary/40">
                <div>
                  <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    {uploading ? 'Uploading...' : 'Drag & drop or click to upload'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">PDF, DOCX, XLSX up to 10MB</p>
                </div>
              </div>
            </div>
          </motion.div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowModal(false)} disabled={saving}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving} className="gap-2">
              {saving ? <><Loader2 className="h-4 w-4 animate-spin" /> Uploading...</> : <><Upload className="h-4 w-4" /> Create & Upload</>}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Modal */}
      <Dialog open={!!viewItem} onOpenChange={(open) => { if (!open) setViewItem(null); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{viewItem?.title}</DialogTitle>
            <DialogDescription>{viewItem?.subject} · Grade {viewItem?.classGrade}-{viewItem?.section}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div><Label className="text-xs text-muted-foreground">Description</Label><p className="mt-1 text-sm">{viewItem?.description}</p></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label className="text-xs text-muted-foreground">Due Date</Label><p className="mt-1 text-sm">{viewItem?.dueDate}</p></div>
              <div><Label className="text-xs text-muted-foreground">Max Marks</Label><p className="mt-1 text-sm">{viewItem?.maxMarks}</p></div>
              <div><Label className="text-xs text-muted-foreground">Submissions</Label><p className="mt-1 text-sm">{viewItem?.submissions}/{viewItem?.totalStudents}</p></div>
              <div><Label className="text-xs text-muted-foreground">Status</Label><p className="mt-1 text-sm capitalize">{viewItem?.status}</p></div>
            </div>
            {viewItem && (
              <Button variant="outline" className="w-full gap-2" onClick={() => handleDownload(viewItem)}>
                <Download className="h-4 w-4" />
                Download {viewItem.fileName} ({viewItem.fileSize})
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
