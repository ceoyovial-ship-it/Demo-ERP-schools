'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  BookMarked,
  Plus,
  Trash2,
  Pencil,
  Eye,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Clock,
} from 'lucide-react';
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
import { homeworkList, type HomeworkItem } from '@/lib/teacher-data';

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
};

export default function HomeworkPage() {
  const [homework, setHomework] = useState<HomeworkItem[]>(homeworkList);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [viewItem, setViewItem] = useState<HomeworkItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const filteredHomework = useMemo(() => {
    const q = search.trim().toLowerCase();
    return homework.filter((h) => {
      if (statusFilter !== 'all' && h.status !== statusFilter) return false;
      if (q && !h.title.toLowerCase().includes(q) && !h.subject.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [homework, statusFilter, search]);

  const activeCount = homework.filter((h) => h.status === 'active').length;
  const overdueCount = homework.filter((h) => h.status === 'overdue').length;
  const completedCount = homework.filter((h) => h.status === 'completed').length;

  const handleSave = () => {
    if (!form.title.trim() || !form.description.trim() || !form.dueDate) {
      toast.error('Please fill in all required fields');
      return;
    }
    setSaving(true);
    setTimeout(() => {
      if (editingId) {
        setHomework((prev) =>
          prev.map((h) =>
            h.id === editingId
              ? { ...h, title: form.title, description: form.description, subject: form.subject, classGrade: form.classGrade, section: form.section, dueDate: form.dueDate }
              : h
          )
        );
        toast.success('Homework updated successfully');
      } else {
        const newHw: HomeworkItem = {
          id: `hw-${Date.now()}`,
          title: form.title,
          description: form.description,
          subject: form.subject,
          classGrade: form.classGrade,
          section: form.section,
          assignedDate: new Date().toISOString().split('T')[0],
          dueDate: form.dueDate,
          submissions: 0,
          totalStudents: form.classGrade === '10' ? 32 : 28,
          status: 'active',
          attachments: [],
        };
        setHomework((prev) => [newHw, ...prev]);
        toast.success('Homework assigned successfully');
      }
      setSaving(false);
      setShowModal(false);
      setForm(emptyForm);
      setEditingId(null);
    }, 1000);
  };

  const handleEdit = (hw: HomeworkItem) => {
    setEditingId(hw.id);
    setForm({
      title: hw.title,
      description: hw.description,
      subject: hw.subject,
      classGrade: hw.classGrade,
      section: hw.section,
      dueDate: hw.dueDate,
    });
    setShowModal(true);
  };

  const handleDelete = () => {
    if (!deleteId) return;
    setHomework((prev) => prev.filter((h) => h.id !== deleteId));
    toast.success('Homework deleted');
    setDeleteId(null);
  };

  const statusConfig = {
    active: { icon: Clock, color: 'text-primary', bg: 'bg-primary/10', label: 'Active' },
    completed: { icon: CheckCircle2, color: 'text-success', bg: 'bg-success/10', label: 'Completed' },
    overdue: { icon: AlertCircle, color: 'text-destructive', bg: 'bg-destructive/10', label: 'Overdue' },
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Homework" description="Create and manage homework assignments">
        <Button
          size="sm"
          className="gap-2"
          onClick={() => {
            setEditingId(null);
            setForm(emptyForm);
            setShowModal(true);
          }}
        >
          <Plus className="h-4 w-4" />
          New Homework
        </Button>
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total" value={homework.length} icon={BookMarked} delay={0} />
        <StatCard title="Active" value={activeCount} icon={Clock} changeType="positive" delay={0.05} />
        <StatCard title="Overdue" value={overdueCount} icon={AlertCircle} changeType="negative" delay={0.1} />
        <StatCard title="Completed" value={completedCount} icon={CheckCircle2} changeType="neutral" delay={0.15} />
      </div>

      <SectionCard title="Homework List" description={`${filteredHomework.length} items`} delay={0.2}>
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
              <Input placeholder="Search homework..." value={search} onChange={(e) => setSearch(e.target.value)} className="h-9" />
            </div>
          </div>
        </div>

        <div className="grid gap-3">
          {filteredHomework.map((hw, i) => {
            const config = statusConfig[hw.status];
            const StatusIcon = config.icon;
            const progress = Math.round((hw.submissions / hw.totalStudents) * 100);
            return (
              <motion.div
                key={hw.id}
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
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{hw.title}</p>
                      <Badge variant="secondary" className="text-xs">{hw.subject}</Badge>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{hw.description}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      <span>Grade {hw.classGrade}-{hw.section}</span>
                      <span>Assigned: {hw.assignedDate}</span>
                      <span>Due: {hw.dueDate}</span>
                    </div>
                    <div className="mt-3 flex items-center gap-3">
                      <div className="h-2 flex-1 max-w-[200px] overflow-hidden rounded-full bg-muted">
                        <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progress}%` }} />
                      </div>
                      <span className="text-xs font-medium">{hw.submissions}/{hw.totalStudents} submitted</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setViewItem(hw)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleEdit(hw)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => setDeleteId(hw.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            );
          })}
          {filteredHomework.length === 0 && (
            <div className="py-12 text-center text-sm text-muted-foreground">No homework found</div>
          )}
        </div>
      </SectionCard>

      {/* Create/Edit Modal */}
      <Dialog open={showModal} onOpenChange={(open) => { if (!saving) { setShowModal(open); if (!open) { setForm(emptyForm); setEditingId(null); } } }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit Homework' : 'Assign New Homework'}</DialogTitle>
            <DialogDescription>{editingId ? 'Update homework details' : 'Create a homework assignment for a class'}</DialogDescription>
          </DialogHeader>
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="grid gap-4 py-2">
            <div className="space-y-1.5">
              <Label>Title *</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Algebra Worksheet #5" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label>Subject *</Label>
                <select className={selectClassStyle} value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}>
                  <option>Mathematics</option>
                  <option>Science</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <Label>Grade *</Label>
                <select className={selectClassStyle} value={form.classGrade} onChange={(e) => setForm({ ...form, classGrade: e.target.value })}>
                  <option value="10">Grade 10</option>
                  <option value="9">Grade 9</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <Label>Section *</Label>
                <select className={selectClassStyle} value={form.section} onChange={(e) => setForm({ ...form, section: e.target.value })}>
                  <option value="A">A</option>
                  <option value="B">B</option>
                </select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Description *</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Homework description..." rows={3} />
            </div>
            <div className="space-y-1.5">
              <Label>Due Date *</Label>
              <Input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
            </div>
          </motion.div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowModal(false); setForm(emptyForm); setEditingId(null); }} disabled={saving}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving} className="gap-2">
              {saving ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</> : <><Plus className="h-4 w-4" /> {editingId ? 'Update' : 'Assign'}</>}
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
            <div>
              <Label className="text-xs text-muted-foreground">Description</Label>
              <p className="mt-1 text-sm">{viewItem?.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label className="text-xs text-muted-foreground">Assigned Date</Label><p className="mt-1 text-sm">{viewItem?.assignedDate}</p></div>
              <div><Label className="text-xs text-muted-foreground">Due Date</Label><p className="mt-1 text-sm">{viewItem?.dueDate}</p></div>
              <div><Label className="text-xs text-muted-foreground">Submissions</Label><p className="mt-1 text-sm">{viewItem?.submissions}/{viewItem?.totalStudents}</p></div>
              <div><Label className="text-xs text-muted-foreground">Status</Label><p className="mt-1 text-sm capitalize">{viewItem?.status}</p></div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => { if (!open) setDeleteId(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Homework?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone. The homework assignment will be permanently removed.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
