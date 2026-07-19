'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import {
  BookOpen,
  Layers,
  FileText,
  ClipboardList,
  GraduationCap,
} from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import { StatCard } from '@/components/stat-card';
import { SectionCard } from '@/components/section-card';
import { DataTable, type Column } from '@/components/data-table';
import { ExportButtons } from '@/components/export-buttons';
import { StatusBadge } from '@/components/status-badge';
import { classes, subjects, teachers } from '@/lib/erp-data';
import { cn } from '@/lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ClassRow = (typeof classes)[number];
type SubjectRow = (typeof subjects)[number];

type ClassSectionRow = {
  id: string;
  grade: string;
  section: string;
  students: number;
  classTeacher: string;
  room: string;
};

type TabKey = 'classes' | 'subjects' | 'syllabus' | 'assignments';

interface TabDef {
  key: TabKey;
  label: string;
  icon: typeof BookOpen;
}

// ---------------------------------------------------------------------------
// Inline datasets (Syllabus + Assignments are not in erp-data)
// ---------------------------------------------------------------------------

const syllabusData = [
  { id: 'syl-1', subject: 'Mathematics', completion: 85, teacher: 'Anjali Reddy', units: 12, completed: 10 },
  { id: 'syl-2', subject: 'Science', completion: 78, teacher: 'Rajesh Kumar', units: 14, completed: 11 },
  { id: 'syl-3', subject: 'English', completion: 92, teacher: 'Meena Iyer', units: 10, completed: 9 },
  { id: 'syl-4', subject: 'Social Studies', completion: 64, teacher: 'Suresh Babu', units: 11, completed: 7 },
  { id: 'syl-5', subject: 'Hindi', completion: 71, teacher: 'Kavita Singh', units: 9, completed: 6 },
  { id: 'syl-6', subject: 'Computer Science', completion: 88, teacher: 'Vikas Jain', units: 8, completed: 7 },
  { id: 'syl-7', subject: 'Physical Education', completion: 55, teacher: 'Arun Das', units: 6, completed: 3 },
  { id: 'syl-8', subject: 'Art', completion: 81, teacher: 'Lakshmi Pillai', units: 7, completed: 6 },
  { id: 'syl-9', subject: 'Music', completion: 47, teacher: 'Gita Sharma', units: 6, completed: 3 },
];

type AssignmentStatus = 'pending' | 'completed' | 'graded';

interface Assignment {
  id: string;
  title: string;
  subject: string;
  className: string;
  dueDate: string;
  status: AssignmentStatus;
}

const assignmentsData: Assignment[] = [
  { id: 'asg-1', title: 'Algebra Worksheet – Quadratic Equations', subject: 'Mathematics', className: '10-A', dueDate: '2025-07-22', status: 'pending' },
  { id: 'asg-2', title: 'Lab Report: Plant Cell Observation', subject: 'Science', className: '9-B', dueDate: '2025-07-19', status: 'graded' },
  { id: 'asg-3', title: 'Essay: The Theme of Courage in “To Kill a Mockingbird”', subject: 'English', className: '10-B', dueDate: '2025-07-25', status: 'pending' },
  { id: 'asg-4', title: 'Map Work: Rivers of India', subject: 'Social Studies', className: '8-A', dueDate: '2025-07-18', status: 'completed' },
  { id: 'asg-5', title: 'Python Program: Student Grade Calculator', subject: 'Computer Science', className: '9-A', dueDate: '2025-07-24', status: 'pending' },
  { id: 'asg-6', title: 'Hindi Comprehension – Chapter 4', subject: 'Hindi', className: '7-A', dueDate: '2025-07-16', status: 'graded' },
];

// ---------------------------------------------------------------------------
// Tab configuration
// ---------------------------------------------------------------------------

const TABS: TabDef[] = [
  { key: 'classes', label: 'Classes', icon: Layers },
  { key: 'subjects', label: 'Subjects', icon: BookOpen },
  { key: 'syllabus', label: 'Syllabus', icon: FileText },
  { key: 'assignments', label: 'Assignments', icon: ClipboardList },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
}

function daysUntil(iso: string): number {
  const today = new Date('2025-07-15T00:00:00');
  const due = new Date(iso);
  return Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

function assignmentStatusVariant(status: AssignmentStatus) {
  if (status === 'completed') return 'info' as const;
  if (status === 'graded') return 'success' as const;
  return 'warning' as const;
}

function syllabusBarColor(pct: number): string {
  if (pct >= 85) return 'bg-success';
  if (pct >= 70) return 'bg-primary';
  if (pct >= 50) return 'bg-accent';
  return 'bg-destructive';
}

function syllabusLabelColor(pct: number): string {
  if (pct >= 85) return 'text-success';
  if (pct >= 70) return 'text-primary';
  if (pct >= 50) return 'text-accent';
  return 'text-destructive';
}

// ---------------------------------------------------------------------------
// Column definitions
// ---------------------------------------------------------------------------

const classSectionRows: ClassSectionRow[] = classes.flatMap((row, gradeIndex) =>
  row.sections.map((section, sectionIndex) => {
    const teacher = teachers[(gradeIndex * 2 + sectionIndex) % teachers.length]?.name ?? 'Class Teacher';
    return {
      id: `${row.grade}-${section}`,
      grade: `Grade ${row.grade}`,
      section,
      students: 31 + (gradeIndex * 3 + sectionIndex * 2) + (gradeIndex % 2 === 0 ? 2 : 1),
      classTeacher: teacher,
      room: `Room ${100 + gradeIndex * 10 + sectionIndex}`,
    };
  })
);

const classColumns: Column<ClassSectionRow>[] = [
  {
    key: 'grade',
    header: 'Grade',
    sortable: true,
    className: 'whitespace-nowrap font-medium',
    render: (c) => (
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
          {c.grade.replace('Grade ', '')}
        </div>
        <span>{c.grade}</span>
      </div>
    ),
  },
  {
    key: 'section',
    header: 'Section',
    sortable: true,
    render: (c) => (
      <span className="inline-flex items-center rounded-md bg-muted px-1.5 py-0.5 text-xs font-medium text-muted-foreground">
        {c.section}
      </span>
    ),
    className: 'whitespace-nowrap',
  },
  {
    key: 'students',
    header: 'Students',
    sortable: true,
    render: (c) => <span className="tabular-nums">{c.students}</span>,
    className: 'whitespace-nowrap',
  },
  {
    key: 'classTeacher',
    header: 'Class Teacher',
    sortable: true,
    render: (c) => (
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
          {c.classTeacher
            .split(' ')
            .map((n) => n[0])
            .slice(0, 2)
            .join('')}
        </div>
        <span className="whitespace-nowrap text-sm">{c.classTeacher}</span>
      </div>
    ),
  },
  {
    key: 'room',
    header: 'Room',
    render: (c) => (
      <span className="whitespace-nowrap text-sm text-muted-foreground">{c.room}</span>
    ),
  },
];

const subjectColumns: Column<SubjectRow>[] = [
  {
    key: 'name',
    header: 'Subject Name',
    sortable: true,
    className: 'font-medium',
    render: (s) => (
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
          <BookOpen className="h-4 w-4 text-primary" />
        </div>
        <span>{s.name}</span>
      </div>
    ),
  },
  {
    key: 'code',
    header: 'Code',
    sortable: true,
    render: (s) => (
      <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 font-mono text-xs font-medium text-muted-foreground">
        {s.code}
      </span>
    ),
    className: 'whitespace-nowrap',
  },
  {
    key: 'classes',
    header: 'Classes',
    render: (s) => (
      <div className="flex flex-wrap gap-1">
        {s.classes.map((c) => (
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
    key: 'teacher',
    header: 'Assigned Teacher',
    sortable: true,
    render: (s) => (
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
          {s.teacher
            .split(' ')
            .map((n) => n[0])
            .slice(0, 2)
            .join('')}
        </div>
        <span className="whitespace-nowrap text-sm">{s.teacher}</span>
      </div>
    ),
  },
];

// ---------------------------------------------------------------------------
// Tab content components
// ---------------------------------------------------------------------------

function ClassesTab() {
  return (
    <SectionCard
      title="Classes & Sections"
      description={`${classSectionRows.length} sections across ${classes.length} grades`}
    >
      <div className="mb-4 flex justify-end">
        <ExportButtons
          label="classes"
          data={classSectionRows as unknown as Record<string, unknown>[]}
          columns={[
            { key: 'grade', label: 'Grade' },
            { key: 'section', label: 'Section' },
            { key: 'students', label: 'Students' },
            { key: 'classTeacher', label: 'Class Teacher' },
            { key: 'room', label: 'Room' },
          ]}
          filename="classes-report"
        />
      </div>
      <DataTable
        data={classSectionRows}
        columns={classColumns}
        searchKeys={['grade', 'section', 'classTeacher', 'room']}
        searchPlaceholder="Search by grade, section, teacher, or room…"
        pageSize={10}
        onRowClick={(c) =>
          toast.info(`${c.grade} · Section ${c.section}`, { description: `Class teacher: ${c.classTeacher}` })
        }
        initialSort={{ key: 'grade', dir: 'asc' }}
      />
    </SectionCard>
  );
}

function SubjectsTab() {
  return (
    <SectionCard
      title="Subjects"
      description={`${subjects.length} subjects offered across the curriculum`}
    >
      <div className="mb-4 flex justify-end">
        <ExportButtons label="subjects" />
      </div>
      <DataTable
        data={subjects}
        columns={subjectColumns}
        searchKeys={['name', 'code', 'teacher']}
        searchPlaceholder="Search by name, code, or teacher…"
        pageSize={10}
        onRowClick={(s) =>
          toast.info(s.name, { description: `Code: ${s.code} · Teacher: ${s.teacher}` })
        }
        initialSort={{ key: 'name', dir: 'asc' }}
      />
    </SectionCard>
  );
}

function SyllabusTab() {
  const avg = Math.round(
    syllabusData.reduce((sum, s) => sum + s.completion, 0) / syllabusData.length
  );

  return (
    <SectionCard
      title="Syllabus Completion"
      description={`Average completion across ${syllabusData.length} subjects: ${avg}%`}
    >
      <div className="mb-4 flex justify-end">
        <ExportButtons label="syllabus progress" />
      </div>
      <div className="space-y-4">
        {syllabusData.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: i * 0.04 }}
            className="rounded-xl border bg-card p-4"
          >
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <FileText className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold leading-tight">{item.subject}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.teacher} · {item.completed}/{item.units} units
                  </p>
                </div>
              </div>
              <span
                className={cn(
                  'text-sm font-bold tabular-nums',
                  syllabusLabelColor(item.completion)
                )}
              >
                {item.completion}%
              </span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
              <motion.div
                className={cn('h-full rounded-full', syllabusBarColor(item.completion))}
                initial={{ width: 0 }}
                animate={{ width: `${item.completion}%` }}
                transition={{ duration: 0.6, delay: 0.1 + i * 0.04, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </SectionCard>
  );
}

function AssignmentsTab() {
  return (
    <SectionCard
      title="Recent Assignments"
      description={`${assignmentsData.length} assignments across all classes`}
    >
      <div className="mb-4 flex justify-end">
        <ExportButtons label="assignments" />
      </div>
      <div className="overflow-x-auto rounded-xl border">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/30 text-left text-xs font-medium text-muted-foreground">
              <th className="px-4 py-3">Assignment</th>
              <th className="px-4 py-3 whitespace-nowrap">Subject</th>
              <th className="px-4 py-3 whitespace-nowrap">Class</th>
              <th className="px-4 py-3 whitespace-nowrap">Due Date</th>
              <th className="px-4 py-3 whitespace-nowrap">Status</th>
            </tr>
          </thead>
          <tbody>
            {assignmentsData.map((a, i) => {
              const remaining = daysUntil(a.dueDate);
              const overdue = remaining < 0 && a.status === 'pending';
              return (
                <motion.tr
                  key={a.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                  className="border-b transition-colors last:border-0 hover:bg-muted/40"
                >
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium leading-tight">{a.title}</p>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 text-sm">
                      <BookOpen className="h-3.5 w-3.5 text-muted-foreground" />
                      {a.subject}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="inline-flex items-center rounded-md bg-muted px-1.5 py-0.5 text-xs font-medium text-muted-foreground">
                      {a.className}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="text-sm tabular-nums">{formatDate(a.dueDate)}</span>
                      {a.status === 'pending' && (
                        <span
                          className={cn(
                            'text-xs',
                            overdue ? 'text-destructive' : 'text-muted-foreground'
                          )}
                        >
                          {overdue
                            ? `${Math.abs(remaining)} day${Math.abs(remaining) === 1 ? '' : 's'} overdue`
                            : remaining === 0
                              ? 'Due today'
                              : `in ${remaining} day${remaining === 1 ? '' : 's'}`}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <StatusBadge
                      status={a.status}
                      variant={assignmentStatusVariant(a.status)}
                    />
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </SectionCard>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function AcademicsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabKey>('classes');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <PageHeader
        title="Academics"
        description="Manage classes, subjects, syllabus, and lesson plans"
      >
        <button
          type="button"
          onClick={() => router.push('/principal/academics/lesson-plans/new')}
          className="inline-flex h-9 items-center gap-2 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
        >
          <FileText className="h-4 w-4" />
          <span className="hidden sm:inline">New Lesson Plan</span>
        </button>
      </PageHeader>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Classes"
          value={12}
          icon={GraduationCap}
          change="Grades 1–12"
          changeType="neutral"
          description="Across all grade levels"
          delay={0}
        />
        <StatCard
          title="Total Sections"
          value={24}
          icon={Layers}
          change="2 sections per grade"
          changeType="neutral"
          description="A & B sections"
          delay={0.05}
        />
        <StatCard
          title="Total Subjects"
          value={9}
          icon={BookOpen}
          change="Core + electives"
          changeType="neutral"
          description="Taught this term"
          delay={0.1}
        />
        <StatCard
          title="Syllabus Completion"
          value="78%"
          icon={FileText}
          change="+6% vs last month"
          changeType="positive"
          description="Average across subjects"
          delay={0.15}
        />
      </div>

      {/* Tab navigation */}
      <div className="overflow-x-auto">
        <nav
          aria-label="Academics sections"
          className="inline-flex min-w-full gap-1 rounded-xl border bg-card p-1 sm:min-w-0"
        >
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'inline-flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-colors sm:flex-none',
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        >
          {activeTab === 'classes' && <ClassesTab />}
          {activeTab === 'subjects' && <SubjectsTab />}
          {activeTab === 'syllabus' && <SyllabusTab />}
          {activeTab === 'assignments' && <AssignmentsTab />}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
