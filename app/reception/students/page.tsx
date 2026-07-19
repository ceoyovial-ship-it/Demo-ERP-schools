'use client';

import { useMemo, useState, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  UserCheck,
  UserPlus,
  GraduationCap,
  Eye,
  Filter,
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
  DialogFooter,
} from '@/components/ui/dialog';
import { students as initialStudents } from '@/lib/reception-data';
import { type ExportColumn } from '@/lib/export-utils';

// ---- Types -----------------------------------------------------------------

type Student = (typeof initialStudents)[number];

// ---- Static config ---------------------------------------------------------

const classOptions = ['6', '7', '8', '9', '10'];
const sectionOptions = ['A', 'B'];
const statusOptions: { value: string; label: string }[] = [
  { value: 'all', label: 'All Status' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'graduated', label: 'Graduated' },
];

const selectClass =
  'h-9 rounded-lg border border-input bg-background px-3 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-primary disabled:cursor-not-allowed disabled:opacity-50';

const stats = [
  {
    title: 'Total Students',
    value: '948',
    icon: Users,
    change: '+2.1% this year',
    changeType: 'positive' as const,
    delay: 0,
  },
  {
    title: 'Active',
    value: '892',
    icon: UserCheck,
    change: '94.1% of total',
    changeType: 'positive' as const,
    delay: 0.05,
  },
  {
    title: 'New This Term',
    value: '48',
    icon: UserPlus,
    change: '+12 admissions',
    changeType: 'positive' as const,
    delay: 0.1,
  },
  {
    title: 'By Grade 6-10',
    value: '580',
    icon: GraduationCap,
    change: 'Secondary section',
    changeType: 'neutral' as const,
    delay: 0.15,
  },
];

const exportColumns: ExportColumn[] = [
  { key: 'admissionNumber', label: 'Admission No' },
  { key: 'name', label: 'Student Name' },
  { key: 'classSection', label: 'Class' },
  { key: 'rollNumber', label: 'Roll No' },
  { key: 'gender', label: 'Gender' },
  { key: 'parentName', label: 'Parent Name' },
  { key: 'parentPhone', label: 'Parent Phone' },
  { key: 'parentEmail', label: 'Parent Email' },
  { key: 'status', label: 'Status' },
];

const statusVariant = (
  status: Student['status']
): 'success' | 'info' | 'neutral' =>
  status === 'active' ? 'success' : status === 'graduated' ? 'info' : 'neutral';

// ---- Helpers ----------------------------------------------------------------

/** Small label/value block used inside the View dialog. */
function Detail({ label, value }: { label: string; value?: ReactNode }) {
  return (
    <div className="space-y-0.5">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="text-sm font-medium break-words">{value || '—'}</p>
    </div>
  );
}

/** Format an ISO date string (YYYY-MM-DD) into a readable form. */
function formatDate(iso?: string): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

// ---- Page ------------------------------------------------------------------

export default function ReceptionStudentsPage() {
  const [studentList] = useState<Student[]>(initialStudents);
  const [classFilter, setClassFilter] = useState('all');
  const [sectionFilter, setSectionFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewing, setViewing] = useState<Student | null>(null);

  // ---- Derived data --------------------------------------------------------

  const filteredStudents = useMemo(() => {
    return studentList.filter((s) => {
      if (classFilter !== 'all' && s.classGrade !== classFilter) return false;
      if (sectionFilter !== 'all' && s.section !== sectionFilter) return false;
      if (statusFilter !== 'all' && s.status !== statusFilter) return false;
      return true;
    });
  }, [studentList, classFilter, sectionFilter, statusFilter]);

  const activeFilterCount =
    (classFilter !== 'all' ? 1 : 0) +
    (sectionFilter !== 'all' ? 1 : 0) +
    (statusFilter !== 'all' ? 1 : 0);

  const handleResetFilters = () => {
    setClassFilter('all');
    setSectionFilter('all');
    setStatusFilter('all');
  };

  const exportData = useMemo(
    () =>
      filteredStudents.map((s) => ({
        admissionNumber: s.admissionNumber,
        name: s.name,
        classSection: s.classSection,
        rollNumber: s.rollNumber,
        gender: s.gender,
        parentName: s.parentName,
        parentPhone: s.parentPhone,
        parentEmail: s.parentEmail,
        status: s.status,
      })),
    [filteredStudents]
  );

  // ---- Columns -------------------------------------------------------------

  const columns: Column<Student>[] = [
    {
      key: 'admissionNumber',
      header: 'Admission No',
      sortable: true,
      className: 'font-mono text-xs whitespace-nowrap',
    },
    {
      key: 'name',
      header: 'Student Name',
      sortable: true,
      render: (s) => (
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
            {s.name.charAt(0)}
          </div>
          <span className="font-medium">{s.name}</span>
        </div>
      ),
    },
    {
      key: 'classSection',
      header: 'Class',
      sortable: true,
      className: 'whitespace-nowrap',
    },
    {
      key: 'rollNumber',
      header: 'Roll No',
      sortable: true,
      className: 'tabular-nums',
    },
    { key: 'gender', header: 'Gender', className: 'whitespace-nowrap' },
    { key: 'parentName', header: 'Parent Name' },
    {
      key: 'parentPhone',
      header: 'Parent Phone',
      render: (s) => (
        <span className="font-mono text-xs whitespace-nowrap">
          {s.parentPhone}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (s) => (
        <StatusBadge status={s.status} variant={statusVariant(s.status)} />
      ),
      className: 'whitespace-nowrap',
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (s) => (
        <div className="flex items-center justify-end">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-1.5"
            title="View Student"
            onClick={(e) => {
              e.stopPropagation();
              setViewing(s);
            }}
          >
            <Eye className="h-4 w-4" />
            <span className="hidden lg:inline">View</span>
          </Button>
        </div>
      ),
      className: 'text-right',
    },
  ];

  // ---- Render --------------------------------------------------------------

  return (
    <div className="space-y-6">
      <PageHeader
        title="Student Directory"
        description="Search and view student records"
      />

      {/* Stat cards */}
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

      {/* Student directory table */}
      <SectionCard
        title="Student Directory"
        description={`${filteredStudents.length} student${
          filteredStudents.length === 1 ? '' : 's'
        } matching filters`}
        delay={0.2}
      >
        {/* Filter bar */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.25 }}
          className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between"
        >
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
              <Filter className="h-4 w-4" />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-semibold text-primary-foreground">
                  {activeFilterCount}
                </span>
              )}
            </div>
            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className={selectClass}
              aria-label="Filter by class"
            >
              <option value="all">All Classes</option>
              {classOptions.map((c) => (
                <option key={c} value={c}>
                  Grade {c}
                </option>
              ))}
            </select>
            <select
              value={sectionFilter}
              onChange={(e) => setSectionFilter(e.target.value)}
              className={selectClass}
              aria-label="Filter by section"
            >
              <option value="all">All Sections</option>
              {sectionOptions.map((s) => (
                <option key={s} value={s}>
                  Section {s}
                </option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={selectClass}
              aria-label="Filter by status"
            >
              {statusOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            {activeFilterCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-9 gap-1.5 text-muted-foreground"
                onClick={handleResetFilters}
              >
                Clear
              </Button>
            )}
          </div>

          <ExportButtons
            label="Students"
            data={exportData}
            columns={exportColumns}
            filename="student-directory"
          />
        </motion.div>

        <DataTable
          data={filteredStudents}
          columns={columns}
          pageSize={10}
          searchKeys={['name', 'admissionNumber', 'parentName']}
          searchPlaceholder="Search by name, admission no, or parent..."
          onRowClick={(s) => setViewing(s)}
          emptyMessage="No students match the selected filters."
          initialSort={{ key: 'name', dir: 'asc' }}
        />
      </SectionCard>

      {/* View Student dialog */}
      <Dialog
        open={!!viewing}
        onOpenChange={(open) => !open && setViewing(null)}
      >
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Student Details</DialogTitle>
          </DialogHeader>

          {viewing && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="space-y-5"
            >
              {/* Header summary */}
              <div className="flex flex-col gap-3 rounded-xl border bg-muted/30 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                    {viewing.name
                      .split(' ')
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join('')}
                  </div>
                  <div>
                    <p className="font-semibold">{viewing.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {viewing.admissionNumber}
                    </p>
                  </div>
                </div>
                <StatusBadge
                  status={viewing.status}
                  variant={statusVariant(viewing.status)}
                  className="self-start sm:self-auto"
                />
              </div>

              {/* Details grid */}
              <div className="grid gap-4 sm:grid-cols-2">
                <Detail label="Admission No" value={viewing.admissionNumber} />
                <Detail label="Full Name" value={viewing.name} />
                <Detail
                  label="Class & Section"
                  value={viewing.classSection}
                />
                <Detail
                  label="Roll No"
                  value={
                    <span className="tabular-nums">{viewing.rollNumber}</span>
                  }
                />
                <Detail label="Gender" value={viewing.gender} />
                <Detail
                  label="Date of Birth"
                  value={formatDate(viewing.dob)}
                />
                <Detail label="Blood Group" value={viewing.bloodGroup} />
                <Detail
                  label="Parent Name"
                  value={viewing.parentName}
                />
                <Detail
                  label="Parent Phone"
                  value={
                    <span className="font-mono text-xs">
                      {viewing.parentPhone}
                    </span>
                  }
                />
                <Detail
                  label="Parent Email"
                  value={viewing.parentEmail}
                />
                <Detail
                  label="Address"
                  value={viewing.address}
                />
                <Detail
                  label="Admission Date"
                  value={formatDate(viewing.admissionDate)}
                />
                <Detail
                  label="Status"
                  value={
                    <StatusBadge
                      status={viewing.status}
                      variant={statusVariant(viewing.status)}
                    />
                  }
                />
              </div>
            </motion.div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setViewing(null)}>
              Close
            </Button>
            <Button
              className="gap-2"
              onClick={() => {
                if (viewing) {
                  navigator.clipboard
                    .writeText(viewing.parentPhone)
                    .then(() =>
                      toast.success('Parent phone copied', {
                        description: viewing.parentPhone,
                      })
                    )
                    .catch(() => toast.error('Could not copy phone number'));
                }
              }}
            >
              Copy Parent Phone
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
