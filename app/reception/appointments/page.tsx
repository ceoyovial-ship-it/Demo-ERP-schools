'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  CalendarClock,
  CheckCircle2,
  XCircle,
  Plus,
  Loader2,
  Clock,
  Calendar,
} from 'lucide-react';
import { toast } from 'sonner';

import { PageHeader } from '@/components/page-header';
import { StatCard } from '@/components/stat-card';
import { SectionCard } from '@/components/section-card';
import { DataTable, type Column } from '@/components/data-table';
import { ExportButtons } from '@/components/export-buttons';
import { StatusBadge } from '@/components/status-badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  appointments as initialAppointments,
  type Appointment,
} from '@/lib/reception-data';
import type { ExportColumn } from '@/lib/export-utils';

// Shared inline-select style (no shadcn Select component in this project)
const selectClass =
  'h-9 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary/20';

const STATUS_FILTERS = [
  'all',
  'scheduled',
  'completed',
  'pending',
  'cancelled',
] as const;
type StatusFilter = (typeof STATUS_FILTERS)[number];

const WITH_WHOM_OPTIONS = [
  'Principal',
  'Class Teacher',
  'Subject Teacher',
  'Reception',
  'Transport In-charge',
];

const DURATION_OPTIONS = ['15 min', '30 min', '45 min', '60 min'];

const emptyForm = {
  parentName: '',
  studentName: '',
  purpose: '',
  withWhom: 'Principal',
  date: '',
  time: '',
  duration: '30 min',
  phone: '',
  notes: '',
};

function formatTime(time24: string): string {
  const [hStr, m] = time24.split(':');
  let h = Number(hStr);
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${String(h).padStart(2, '0')}:${m} ${ampm}`;
}

export default function AppointmentsPage() {
  const [appointmentList, setAppointmentList] =
    useState<Appointment[]>(initialAppointments);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [dateFilter, setDateFilter] = useState('');
  const [search, setSearch] = useState('');

  const [showAddModal, setShowAddModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm);

  // ---------- Filtering ----------
  const filteredAppointments = useMemo(() => {
    const q = search.trim().toLowerCase();
    return appointmentList.filter((a) => {
      if (statusFilter !== 'all' && a.status !== statusFilter) return false;
      if (dateFilter && a.date !== dateFilter) return false;
      if (q) {
        const haystack =
          `${a.parentName} ${a.studentName} ${a.purpose}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [appointmentList, statusFilter, dateFilter, search]);

  // ---------- Stats (recompute from current list) ----------
  const scheduledCount = appointmentList.filter(
    (a) => a.status === 'scheduled',
  ).length;
  const completedCount = appointmentList.filter(
    (a) => a.status === 'completed',
  ).length;
  const pendingCount = appointmentList.filter(
    (a) => a.status === 'pending',
  ).length;

  const stats = [
    {
      title: 'Total Appointments',
      value: appointmentList.length,
      icon: CalendarClock,
      change: `${scheduledCount} upcoming`,
      changeType: 'neutral' as const,
      delay: 0,
    },
    {
      title: 'Scheduled',
      value: scheduledCount,
      icon: Calendar,
      change: 'Confirmed & upcoming',
      changeType: 'positive' as const,
      delay: 0.05,
    },
    {
      title: 'Completed',
      value: completedCount,
      icon: CheckCircle2,
      change: 'Successfully concluded',
      changeType: 'positive' as const,
      delay: 0.1,
    },
    {
      title: 'Pending',
      value: pendingCount,
      icon: Clock,
      change: 'Awaiting confirmation',
      changeType: 'neutral' as const,
      delay: 0.15,
    },
  ];

  // ---------- Status helpers ----------
  const statusVariant = (
    status: Appointment['status'],
  ): 'info' | 'success' | 'warning' | 'destructive' => {
    switch (status) {
      case 'scheduled':
        return 'info';
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'destructive';
    }
  };

  const statusLabel = (status: Appointment['status']): string =>
    status.charAt(0).toUpperCase() + status.slice(1);

  // ---------- Export config ----------
  const exportColumns: ExportColumn[] = [
    { key: 'parentName', label: 'Parent Name' },
    { key: 'studentName', label: 'Student Name' },
    { key: 'purpose', label: 'Purpose' },
    { key: 'withWhom', label: 'With' },
    { key: 'date', label: 'Date' },
    { key: 'time', label: 'Time' },
    { key: 'duration', label: 'Duration' },
    { key: 'phone', label: 'Phone' },
    { key: 'status', label: 'Status' },
    { key: 'notes', label: 'Notes' },
  ];
  const exportData = filteredAppointments.map((a) => ({
    parentName: a.parentName,
    studentName: a.studentName,
    purpose: a.purpose,
    withWhom: a.withWhom,
    date: a.date,
    time: a.time,
    duration: a.duration,
    phone: a.phone,
    status: statusLabel(a.status),
    notes: a.notes,
  }));

  // ---------- Table columns ----------
  const columns: Column<Appointment>[] = [
    {
      key: 'parentName',
      header: 'Parent Name',
      sortable: true,
      render: (a) => (
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
            {a.parentName
              .split(' ')
              .map((n) => n[0])
              .slice(0, 2)
              .join('')
              .toUpperCase()}
          </div>
          <span className="font-medium">{a.parentName}</span>
        </div>
      ),
    },
    {
      key: 'studentName',
      header: 'Student Name',
      sortable: true,
      render: (a) => (
        <span className="text-muted-foreground">{a.studentName}</span>
      ),
    },
    {
      key: 'purpose',
      header: 'Purpose',
      render: (a) => (
        <span
          className="max-w-[200px] truncate text-muted-foreground"
          title={a.purpose}
        >
          {a.purpose}
        </span>
      ),
    },
    {
      key: 'withWhom',
      header: 'With',
      sortable: true,
      render: (a) => (
        <span className="text-muted-foreground">{a.withWhom}</span>
      ),
    },
    {
      key: 'date',
      header: 'Date',
      sortable: true,
      render: (a) => (
        <span className="whitespace-nowrap text-muted-foreground">{a.date}</span>
      ),
    },
    {
      key: 'time',
      header: 'Time',
      render: (a) => (
        <span className="whitespace-nowrap text-muted-foreground">{a.time}</span>
      ),
    },
    {
      key: 'duration',
      header: 'Duration',
      render: (a) => (
        <span className="inline-flex items-center gap-1 text-muted-foreground">
          <Clock className="h-3 w-3" />
          {a.duration}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (a) => (
        <StatusBadge
          status={statusLabel(a.status)}
          variant={statusVariant(a.status)}
        />
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right',
      render: (a) =>
        a.status === 'scheduled' || a.status === 'pending' ? (
          <div className="flex items-center justify-end gap-2">
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5 border-success/30 text-success hover:bg-success/10 hover:text-success"
              onClick={(e) => {
                e.stopPropagation();
                handleComplete(a.id);
              }}
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              Complete
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5 border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={(e) => {
                e.stopPropagation();
                handleCancel(a.id);
              }}
            >
              <XCircle className="h-3.5 w-3.5" />
              Cancel
            </Button>
          </div>
        ) : (
          <span className="text-xs text-muted-foreground">
            {a.status === 'completed' ? 'Completed' : 'Cancelled'}
          </span>
        ),
    },
  ];

  // ---------- Actions ----------
  const handleComplete = (id: string) => {
    setAppointmentList((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'completed' } : a)),
    );
    toast.success('Appointment marked as completed');
  };

  const handleCancel = (id: string) => {
    setAppointmentList((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'cancelled' } : a)),
    );
    toast.success('Appointment cancelled');
  };

  const handleSchedule = () => {
    if (
      !form.parentName.trim() ||
      !form.studentName.trim() ||
      !form.purpose.trim() ||
      !form.date ||
      !form.time
    ) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSaving(true);
    setTimeout(() => {
      const newAppointment: Appointment = {
        id: `apt-${Date.now()}`,
        parentName: form.parentName.trim(),
        studentName: form.studentName.trim(),
        purpose: form.purpose.trim(),
        withWhom: form.withWhom,
        date: form.date,
        time: formatTime(form.time),
        duration: form.duration,
        phone: form.phone.trim() || '—',
        status: 'scheduled',
        notes: form.notes.trim(),
      };
      setAppointmentList((prev) => [newAppointment, ...prev]);
      setSaving(false);
      setShowAddModal(false);
      setForm(emptyForm);
      toast.success('Appointment scheduled successfully');
    }, 1000);
  };

  const handleModalChange = (open: boolean) => {
    if (!saving) {
      setShowAddModal(open);
      if (!open) setForm(emptyForm);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Appointments"
        description="Schedule and manage parent appointments"
      >
        <Button className="gap-2" onClick={() => setShowAddModal(true)}>
          <Plus className="h-4 w-4" />
          Schedule Appointment
        </Button>
      </PageHeader>

      {/* Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <StatCard
            key={s.title}
            title={s.title}
            value={s.value}
            icon={s.icon}
            change={s.change}
            changeType={s.changeType}
            delay={s.delay}
          />
        ))}
      </div>

      {/* Appointments Table */}
      <SectionCard
        title="All Appointments"
        description={`${filteredAppointments.length} appointment${filteredAppointments.length === 1 ? '' : 's'} shown`}
        delay={0.2}
      >
        {/* Filter bar */}
        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {/* Status filter */}
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Status</Label>
              <select
                className={selectClass}
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value as StatusFilter)
                }
              >
                {STATUS_FILTERS.map((s) => (
                  <option key={s} value={s}>
                    {s === 'all' ? 'All Status' : statusLabel(s)}
                  </option>
                ))}
              </select>
            </div>

            {/* Date filter */}
            <div className="space-y-1.5 sm:min-w-[180px]">
              <Label className="text-xs text-muted-foreground">Date</Label>
              <Input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="h-9"
              />
            </div>

            {/* Search */}
            <div className="space-y-1.5 sm:min-w-[240px]">
              <Label className="text-xs text-muted-foreground">Search</Label>
              <Input
                placeholder="Parent, student, purpose..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-9"
              />
            </div>
          </div>

          {/* Export */}
          <div className="flex items-end">
            <ExportButtons
              label="appointments"
              data={exportData}
              columns={exportColumns}
              filename="appointments"
            />
          </div>
        </div>

        {/* Table — search handled in our filter bar, so suppress built-in search */}
        <DataTable
          data={filteredAppointments}
          columns={columns}
          searchKeys={[]}
          searchPlaceholder="Search appointments..."
          emptyMessage="No appointments match the current filters"
          initialSort={{ key: 'date', dir: 'asc' }}
        />
      </SectionCard>

      {/* Schedule Appointment Modal */}
      <Dialog open={showAddModal} onOpenChange={handleModalChange}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Schedule Appointment</DialogTitle>
            <DialogDescription>
              Book a new appointment between a parent and school staff.
            </DialogDescription>
          </DialogHeader>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="grid gap-4 py-2"
          >
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Parent Name *</Label>
                <Input
                  value={form.parentName}
                  onChange={(e) =>
                    setForm({ ...form, parentName: e.target.value })
                  }
                  placeholder="e.g. Ramesh Sharma"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Student Name *</Label>
                <Input
                  value={form.studentName}
                  onChange={(e) =>
                    setForm({ ...form, studentName: e.target.value })
                  }
                  placeholder="e.g. Rahul Sharma"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Purpose *</Label>
              <Input
                value={form.purpose}
                onChange={(e) => setForm({ ...form, purpose: e.target.value })}
                placeholder="e.g. Discuss Mathematics Performance"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>With Whom *</Label>
                <select
                  className={selectClass}
                  value={form.withWhom}
                  onChange={(e) =>
                    setForm({ ...form, withWhom: e.target.value })
                  }
                >
                  {WITH_WHOM_OPTIONS.map((w) => (
                    <option key={w} value={w}>
                      {w}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label>Duration *</Label>
                <select
                  className={selectClass}
                  value={form.duration}
                  onChange={(e) =>
                    setForm({ ...form, duration: e.target.value })
                  }
                >
                  {DURATION_OPTIONS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Date *</Label>
                <Input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Time *</Label>
                <Input
                  type="time"
                  value={form.time}
                  onChange={(e) => setForm({ ...form, time: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Phone</Label>
              <Input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+91 90000 00000"
              />
            </div>

            <div className="space-y-1.5">
              <Label>Notes</Label>
              <Textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Additional context or agenda for the appointment..."
                className="resize-none"
                rows={3}
              />
            </div>
          </motion.div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => handleModalChange(false)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button onClick={handleSchedule} disabled={saving} className="gap-2">
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Scheduling...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Schedule
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
