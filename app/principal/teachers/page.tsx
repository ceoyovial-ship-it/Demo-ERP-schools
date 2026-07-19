'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import {
  GraduationCap,
  UserCheck,
  Calendar,
  TrendingUp,
  UserPlus,
  FileUp,
  Pencil,
  Trash2,
} from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import { StatCard } from '@/components/stat-card';
import { SectionCard } from '@/components/section-card';
import { DataTable, type Column } from '@/components/data-table';
import { ExportButtons } from '@/components/export-buttons';
import { StatusBadge } from '@/components/status-badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { QuickActionModals } from '@/components/topbar/quick-action-modals';
import { teachers } from '@/lib/erp-data';
import { cn } from '@/lib/utils';

type Teacher = (typeof teachers)[number];

// Subjects available for the filter dropdown (derived from the dataset).
const SUBJECT_OPTIONS = Array.from(new Set(teachers.map((t) => t.subject))).sort();

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Statuses' },
  { value: 'active', label: 'Active' },
  { value: 'on-leave', label: 'On Leave' },
] as const;

// --- Performance badge -------------------------------------------------------

function getPerformanceVariant(p: number) {
  if (p >= 90) return 'success';
  if (p >= 80) return 'info';
  if (p >= 70) return 'warning';
  return 'destructive';
}

function PerformanceBadge({ value }: { value: number }) {
  const variant = getPerformanceVariant(value);
  return (
    <span
      className={cn(
        'inline-flex min-w-[3.25rem] items-center justify-center rounded-full border px-2.5 py-0.5 text-xs font-semibold tabular-nums',
        variant === 'success' && 'bg-success/10 text-success border-success/20',
        variant === 'info' && 'bg-info/10 text-info border-info/20',
        variant === 'warning' && 'bg-accent/10 text-accent border-accent/20',
        variant === 'destructive' &&
          'bg-destructive/10 text-destructive border-destructive/20'
      )}
    >
      {value}%
    </span>
  );
}

// --- Status helper -----------------------------------------------------------

function statusVariant(status: string) {
  return status === 'active' ? 'success' : 'warning';
}

// --- Page --------------------------------------------------------------------

export default function TeachersPage() {
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'on-leave'>(
    'all'
  );
  const [teacherList, setTeacherList] = useState(teachers);
  const [showTeacherModal, setShowTeacherModal] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Record<string, string> | null>(null);

  // Aggregate stats derived from the full dataset so they stay accurate even
  // as the underlying data changes.
  const stats = useMemo(() => {
    const total = teacherList.length;
    const active = teacherList.filter((t) => t.status === 'active').length;
    const onLeave = teacherList.filter((t) => t.status === 'on-leave').length;
    const avgPerformance = Math.round(
      teacherList.reduce((sum, t) => sum + t.performance, 0) / total
    );
    return { total, active, onLeave, avgPerformance };
  }, [teacherList]);

  // Apply the subject + status filters before handing data to the DataTable.
  // The DataTable itself handles name / employee-ID search and pagination.
  const filteredTeachers = useMemo(() => {
    return teacherList.filter((t) => {
      const subjectMatch =
        subjectFilter === 'all' || t.subject === subjectFilter;
      const statusMatch =
        statusFilter === 'all' || t.status === statusFilter;
      return subjectMatch && statusMatch;
    });
  }, [teacherList, subjectFilter, statusFilter]);

  const teacherExportColumns = [
    { key: 'employeeId', label: 'Employee ID' },
    { key: 'name', label: 'Name' },
    { key: 'subject', label: 'Subject' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'status', label: 'Status' },
    { key: 'performance', label: 'Performance' },
  ];

  const columns: Column<Teacher>[] = [
    {
      key: 'employeeId',
      header: 'Employee ID',
      sortable: true,
      className: 'whitespace-nowrap font-medium',
    },
    {
      key: 'name',
      header: 'Name',
      sortable: true,
      render: (t) => (
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
            {t.name
              .split(' ')
              .map((n) => n[0])
              .slice(0, 2)
              .join('')}
          </div>
          <div className="min-w-0">
            <p className="truncate font-medium">{t.name}</p>
            <p className="truncate text-xs text-muted-foreground">{t.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'subject',
      header: 'Subject',
      sortable: true,
      render: (t) => (
        <span className="inline-flex items-center gap-1.5 text-sm">
          <GraduationCap className="h-3.5 w-3.5 text-muted-foreground" />
          {t.subject}
        </span>
      ),
    },
    {
      key: 'classes',
      header: 'Classes',
      render: (t) => (
        <div className="flex flex-wrap gap-1">
          {t.classes.map((c) => (
            <span
              key={c}
              className="inline-flex items-center rounded-md bg-muted px-1.5 py-0.5 text-xs font-medium text-muted-foreground"
            >
              {c}
            </span>
          ))}
        </div>
      ),
    },
    {
      key: 'experience',
      header: 'Exp.',
      sortable: true,
      render: (t) => (
        <span className="tabular-nums">{t.experience} yrs</span>
      ),
      className: 'whitespace-nowrap',
    },
    {
      key: 'qualification',
      header: 'Qualification',
      render: (t) => (
        <span className="text-sm text-muted-foreground">{t.qualification}</span>
      ),
      className: 'whitespace-nowrap',
    },
    {
      key: 'phone',
      header: 'Phone',
      render: (t) => (
        <span className="whitespace-nowrap text-sm text-muted-foreground tabular-nums">
          {t.phone}
        </span>
      ),
    },
    {
      key: 'performance',
      header: 'Performance',
      sortable: true,
      render: (t) => <PerformanceBadge value={t.performance} />,
      className: 'whitespace-nowrap',
    },
    {
      key: 'status',
      header: 'Status',
      render: (t) => (
        <StatusBadge
          status={t.status === 'on-leave' ? 'On Leave' : 'Active'}
          variant={statusVariant(t.status)}
        />
      ),
      className: 'whitespace-nowrap',
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (t) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={(event) => {
              event.stopPropagation();
              setEditingTeacher({
                id: t.id,
                firstName: t.name.split(' ')[0],
                lastName: t.name.split(' ')[1] ?? '',
                subject: t.subject,
                phone: t.phone,
                email: t.email,
              });
              setShowTeacherModal(true);
            }}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive"
                onClick={(event) => event.stopPropagation()}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete teacher</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to remove {t.name} from the teacher directory?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    setTeacherList((prev) => prev.filter((item) => item.id !== t.id));
                    toast.success('Teacher deleted');
                  }}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ),
      className: 'whitespace-nowrap',
    },
  ];

  const resetFilters = () => {
    setSubjectFilter('all');
    setStatusFilter('all');
    toast.info('Filters reset');
  };

  const handleTeacherSave = (form: Record<string, string>) => {
    const fullName = `${form.firstName ?? ''} ${form.lastName ?? ''}`.trim();
    const nextTeacherId = `tch-${String(teacherList.length + 1).padStart(3, '0')}`;
    const nextEmployeeId = `EMP-${String(Math.max(...teacherList.map((teacher) => Number(teacher.employeeId.replace(/\D/g, '')))) + 1).padStart(4, '0')}`;

    if (editingTeacher?.id) {
      setTeacherList((prev) =>
        prev.map((teacher) =>
          teacher.id === editingTeacher.id
            ? {
                ...teacher,
                name: fullName || teacher.name,
                subject: form.subject || teacher.subject,
                phone: form.phone || teacher.phone,
                email: form.email || teacher.email,
              }
            : teacher
        )
      );
      toast.success('Teacher updated');
    } else {
      setTeacherList((prev) => [
        {
          id: nextTeacherId,
          employeeId: nextEmployeeId,
          name: fullName || 'New Teacher',
          subject: form.subject || 'Mathematics',
          classes: ['10-A', '9-B'],
          experience: 2,
          qualification: 'B.Ed',
          phone: form.phone || '+91 90000 00000',
          email: form.email || 'teacher@yovialschool.edu.in',
          salary: 42000,
          attendance: 92,
          performance: 84,
          status: 'active',
          joinDate: '2025-07-16',
          gender: 'Female',
        },
        ...prev,
      ]);
      toast.success('Teacher added');
    }

    setShowTeacherModal(false);
    setEditingTeacher(null);
  };

  const hasActiveFilters = subjectFilter !== 'all' || statusFilter !== 'all';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <PageHeader
        title="Teacher Directory"
        description="Manage and review teaching staff, qualifications, and performance across the school."
      >
        <button
          type="button"
          onClick={() => toast.success('Import started', { description: 'Upload a CSV to bulk-add teachers' })}
          className="inline-flex h-9 items-center gap-2 rounded-md border border-input bg-background px-3 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          <FileUp className="h-4 w-4" />
          <span className="hidden sm:inline">Import</span>
        </button>
        <button
          type="button"
          onClick={() => {
            setEditingTeacher(null);
            setShowTeacherModal(true);
          }}
          className="inline-flex h-9 items-center gap-2 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
        >
          <UserPlus className="h-4 w-4" />
          <span className="hidden sm:inline">Add Teacher</span>
        </button>
      </PageHeader>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Teachers"
          value={stats.total}
          icon={GraduationCap}
          change="+2 this term"
          changeType="positive"
          description="Onboarded teaching staff"
          delay={0}
        />
        <StatCard
          title="Active"
          value={stats.active}
          icon={UserCheck}
          change={`${Math.round((stats.active / stats.total) * 100)}% of workforce`}
          changeType="positive"
          description="Currently teaching"
          delay={0.05}
        />
        <StatCard
          title="On Leave"
          value={stats.onLeave}
          icon={Calendar}
          change="Scheduled & approved"
          changeType="neutral"
          description="Temporarily unavailable"
          delay={0.1}
        />
        <StatCard
          title="Avg Performance"
          value={`${stats.avgPerformance}%`}
          icon={TrendingUp}
          change="+3% vs last term"
          changeType="positive"
          description="Across all appraisals"
          delay={0.15}
        />
      </div>

      {/* Filter bar + export */}
      <SectionCard
        title="Teacher Records"
        description={`${filteredTeachers.length} of ${teachers.length} teachers shown`}
        delay={0.1}
      >
        {/* Filter row */}
        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {/* Subject filter */}
            <div className="flex flex-col gap-1">
              <label
                htmlFor="subject-filter"
                className="text-xs font-medium text-muted-foreground"
              >
                Subject
              </label>
              <select
                id="subject-filter"
                value={subjectFilter}
                onChange={(e) => setSubjectFilter(e.target.value)}
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-ring sm:w-48"
              >
                <option value="all">All Subjects</option>
                {SUBJECT_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Status filter */}
            <div className="flex flex-col gap-1">
              <label
                htmlFor="status-filter"
                className="text-xs font-medium text-muted-foreground"
              >
                Status
              </label>
              <select
                id="status-filter"
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value as typeof statusFilter)
                }
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-ring sm:w-40"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="mt-5 h-9 self-start rounded-md px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:self-auto"
              >
                Clear filters
              </button>
            )}
          </div>

          <div className="flex items-center self-end lg:self-auto">
            <ExportButtons
              label="teacher directory"
              data={filteredTeachers as unknown as Record<string, unknown>[]}
              columns={teacherExportColumns}
              filename="teacher-directory"
            />
          </div>
        </div>

        {/* Table */}
        <DataTable
          data={filteredTeachers}
          columns={columns}
          searchKeys={['name', 'employeeId']}
          searchPlaceholder="Search by name or employee ID…"
          pageSize={10}
          onRowClick={(t) =>
            toast.info(`Opening ${t.name}`, { description: t.employeeId })
          }
          emptyMessage="No teachers match the selected filters."
          initialSort={{ key: 'name', dir: 'asc' }}
        />
      </SectionCard>

      <QuickActionModals
        openModal={showTeacherModal ? 'add-teacher' : null}
        onClose={() => {
          setShowTeacherModal(false);
          setEditingTeacher(null);
        }}
        initialData={editingTeacher ?? undefined}
        onTeacherAdded={handleTeacherSave}
      />
    </motion.div>
  );
}
