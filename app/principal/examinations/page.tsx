'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import {
  ClipboardList,
  Calendar,
  Trophy,
  BarChart3,
  Award,
  TrendingUp,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { PageHeader } from '@/components/page-header';
import { StatCard } from '@/components/stat-card';
import { SectionCard } from '@/components/section-card';
import { ChartCard } from '@/components/chart-card';
import { DataTable, type Column } from '@/components/data-table';
import { ExportButtons } from '@/components/export-buttons';
import { StatusBadge } from '@/components/status-badge';
import { exams, examResults, subjectAnalysis } from '@/lib/erp-data';
import { cn } from '@/lib/utils';

// --- Types -------------------------------------------------------------------

type Exam = (typeof exams)[number];
type ExamResult = (typeof examResults)[number];

type TabKey = 'schedule' | 'results' | 'performers' | 'analysis';

interface TabDef {
  key: TabKey;
  label: string;
  icon: typeof Calendar;
}

const TABS: TabDef[] = [
  { key: 'schedule', label: 'Exam Schedule', icon: Calendar },
  { key: 'results', label: 'Results', icon: ClipboardList },
  { key: 'performers', label: 'Top Performers', icon: Trophy },
  { key: 'analysis', label: 'Analysis', icon: BarChart3 },
];

// --- Helpers -----------------------------------------------------------------

function examStatusVariant(status: string) {
  if (status === 'completed') return 'success' as const;
  if (status === 'scheduled') return 'info' as const;
  if (status === 'upcoming') return 'warning' as const;
  return 'neutral' as const;
}

function resultStatusVariant(status: string) {
  return status === 'pass' ? ('success' as const) : ('destructive' as const);
}

function gradeVariant(grade: string) {
  if (grade === 'A+') return 'success' as const;
  if (grade === 'A') return 'info' as const;
  if (grade === 'B') return 'warning' as const;
  return 'destructive' as const;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

// Rank badge styling — gold / silver / bronze for the podium, muted for the rest.
const RANK_STYLES: Record<number, string> = {
  1: 'bg-gradient-to-br from-amber-300 to-amber-500 text-amber-950 shadow-amber-500/30',
  2: 'bg-gradient-to-br from-slate-300 to-slate-400 text-slate-900 shadow-slate-400/30',
  3: 'bg-gradient-to-br from-orange-300 to-orange-500 text-orange-950 shadow-orange-500/30',
};

function rankBadgeClass(rank: number) {
  return RANK_STYLES[rank] ?? 'bg-muted text-muted-foreground shadow-sm';
}

// Bar color palette for the analysis charts — cycles through brand-friendly hues.
const BAR_COLORS = [
  '#6366f1',
  '#8b5cf6',
  '#ec4899',
  '#f59e0b',
  '#10b981',
  '#06b6d4',
];

// --- Page --------------------------------------------------------------------

export default function ExaminationsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('schedule');

  // --- Exam Schedule columns -----------------------------------------------
  const examColumns: Column<Exam>[] = [
    {
      key: 'name',
      header: 'Exam Name',
      sortable: true,
      render: (e) => (
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <ClipboardList className="h-4 w-4 text-primary" />
          </div>
          <span className="font-medium">{e.name}</span>
        </div>
      ),
    },
    {
      key: 'term',
      header: 'Term',
      sortable: true,
      render: (e) => (
        <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
          {e.term}
        </span>
      ),
      className: 'whitespace-nowrap',
    },
    {
      key: 'startDate',
      header: 'Start Date',
      sortable: true,
      render: (e) => (
        <span className="whitespace-nowrap tabular-nums text-muted-foreground">
          {formatDate(e.startDate)}
        </span>
      ),
    },
    {
      key: 'endDate',
      header: 'End Date',
      sortable: true,
      render: (e) => (
        <span className="whitespace-nowrap tabular-nums text-muted-foreground">
          {formatDate(e.endDate)}
        </span>
      ),
    },
    {
      key: 'subjects',
      header: 'Subjects',
      sortable: true,
      render: (e) => (
        <span className="tabular-nums">{e.subjects}</span>
      ),
      className: 'whitespace-nowrap',
    },
    {
      key: 'totalStudents',
      header: 'Total Students',
      sortable: true,
      render: (e) => (
        <span className="tabular-nums">{e.totalStudents.toLocaleString()}</span>
      ),
      className: 'whitespace-nowrap',
    },
    {
      key: 'status',
      header: 'Status',
      render: (e) => (
        <StatusBadge
          status={e.status}
          variant={examStatusVariant(e.status)}
        />
      ),
      className: 'whitespace-nowrap',
    },
  ];

  // --- Results columns -----------------------------------------------------
  const resultColumns: Column<ExamResult>[] = [
    {
      key: 'rank',
      header: 'Rank',
      sortable: true,
      render: (r) => (
        <span
          className={cn(
            'inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold tabular-nums',
            r.rank <= 3
              ? rankBadgeClass(r.rank)
              : 'bg-muted text-muted-foreground'
          )}
        >
          {r.rank}
        </span>
      ),
      className: 'whitespace-nowrap',
    },
    {
      key: 'studentName',
      header: 'Student Name',
      sortable: true,
      render: (r) => (
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
            {r.studentName
              .split(' ')
              .map((n) => n[0])
              .slice(0, 2)
              .join('')}
          </div>
          <span className="font-medium">{r.studentName}</span>
        </div>
      ),
    },
    {
      key: 'admissionNumber',
      header: 'Admission No',
      sortable: true,
      render: (r) => (
        <span className="whitespace-nowrap font-mono text-xs text-muted-foreground">
          {r.admissionNumber}
        </span>
      ),
    },
    {
      key: 'class',
      header: 'Class',
      sortable: true,
      render: (r) => (
        <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
          {r.class}
        </span>
      ),
      className: 'whitespace-nowrap',
    },
    {
      key: 'totalMarks',
      header: 'Total Marks',
      sortable: true,
      render: (r) => <span className="tabular-nums">{r.totalMarks}</span>,
      className: 'whitespace-nowrap',
    },
    {
      key: 'percentage',
      header: 'Percentage',
      sortable: true,
      render: (r) => (
        <span
          className={cn(
            'tabular-nums font-medium',
            r.percentage >= 75
              ? 'text-success'
              : r.percentage >= 50
                ? 'text-info'
                : r.percentage >= 35
                  ? 'text-accent'
                  : 'text-destructive'
          )}
        >
          {r.percentage}%
        </span>
      ),
      className: 'whitespace-nowrap',
    },
    {
      key: 'grade',
      header: 'Grade',
      sortable: true,
      render: (r) => (
        <span
          className={cn(
            'inline-flex min-w-[2.5rem] items-center justify-center rounded-md border px-2 py-0.5 text-xs font-bold',
            gradeVariant(r.grade) === 'success' &&
              'border-success/20 bg-success/10 text-success',
            gradeVariant(r.grade) === 'info' &&
              'border-info/20 bg-info/10 text-info',
            gradeVariant(r.grade) === 'warning' &&
              'border-accent/20 bg-accent/10 text-accent',
            gradeVariant(r.grade) === 'destructive' &&
              'border-destructive/20 bg-destructive/10 text-destructive'
          )}
        >
          {r.grade}
        </span>
      ),
      className: 'whitespace-nowrap',
    },
    {
      key: 'status',
      header: 'Status',
      render: (r) => (
        <StatusBadge
          status={r.status}
          variant={resultStatusVariant(r.status)}
        />
      ),
      className: 'whitespace-nowrap',
    },
  ];

  // --- Analysis-derived summary -------------------------------------------
  const topPerformers = examResults.slice(0, 5);

  const analysisStats = (() => {
    const highest = Math.max(...subjectAnalysis.map((s) => s.topScore));
    const lowest = Math.min(...subjectAnalysis.map((s) => s.avgMarks));
    // Most improved = subject with the highest average marks (proxy for improvement).
    const mostImproved = [...subjectAnalysis].sort(
      (a, b) => b.avgMarks - a.avgMarks
    )[0];
    return { highest, lowest, mostImproved: mostImproved.subject };
  })();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <PageHeader
        title="Examinations"
        description="Manage exams, marks entry, and results"
      >
        <ExportButtons
          label="examinations data"
          data={exams as unknown as Record<string, unknown>[]}
          columns={[
            { key: 'name', label: 'Exam Name' },
            { key: 'term', label: 'Term' },
            { key: 'startDate', label: 'Start Date' },
            { key: 'endDate', label: 'End Date' },
            { key: 'subjects', label: 'Subjects' },
            { key: 'totalStudents', label: 'Total Students' },
            { key: 'status', label: 'Status' },
          ]}
          filename="examinations-report"
        />
      </PageHeader>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Exams"
          value={4}
          icon={ClipboardList}
          change="Across 2 terms"
          changeType="neutral"
          description="Scheduled & completed"
          delay={0}
        />
        <StatCard
          title="Upcoming"
          value={2}
          icon={Calendar}
          change="Next: Final Examination"
          changeType="positive"
          description="Exams yet to begin"
          delay={0.05}
        />
        <StatCard
          title="Completed"
          value={1}
          icon={Award}
          change="Unit Test 1 finished"
          changeType="neutral"
          description="Results published"
          delay={0.1}
        />
        <StatCard
          title="Avg Pass Rate"
          value="87.3%"
          icon={TrendingUp}
          change="+2.1% vs last term"
          changeType="positive"
          description="Across all subjects"
          delay={0.15}
        />
      </div>

      {/* Tab navigation */}
      <div className="flex flex-wrap gap-1.5 rounded-xl border bg-card p-1.5 shadow-premium">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => {
                setActiveTab(tab.key);
                toast.info(`Switched to ${tab.label}`, {
                  description: 'View updated',
                });
              }}
              className={cn(
                'inline-flex h-9 items-center gap-2 rounded-lg px-3.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* --- Exam Schedule --- */}
          {activeTab === 'schedule' && (
            <SectionCard
              title="Exam Schedule"
              description={`${exams.length} examinations across all terms`}
              delay={0}
            >
              <DataTable
                data={exams}
                columns={examColumns}
                searchKeys={['name', 'term']}
                searchPlaceholder="Search by exam name or term…"
                pageSize={10}
                onRowClick={(e) =>
                  toast.info(`Opening ${e.name}`, {
                    description: `${e.term} • ${e.subjects} subjects`,
                  })
                }
                emptyMessage="No exams found."
                initialSort={{ key: 'startDate', dir: 'asc' }}
              />
            </SectionCard>
          )}

          {/* --- Results --- */}
          {activeTab === 'results' && (
            <SectionCard
              title="Exam Results"
              description={`${examResults.length} students ranked by total marks`}
              delay={0}
            >
              <DataTable
                data={examResults}
                columns={resultColumns}
                searchKeys={['studentName', 'admissionNumber', 'class']}
                searchPlaceholder="Search by name, admission no, or class…"
                pageSize={10}
                onRowClick={(r) =>
                  toast.info(`Opening ${r.studentName}`, {
                    description: `${r.admissionNumber} • Rank ${r.rank}`,
                  })
                }
                emptyMessage="No results found."
                initialSort={{ key: 'rank', dir: 'asc' }}
              />
            </SectionCard>
          )}

          {/* --- Top Performers --- */}
          {activeTab === 'performers' && (
            <SectionCard
              title="Top Performers"
              description="The 5 highest-scoring students this term"
              delay={0}
            >
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                {topPerformers.map((student, i) => (
                  <motion.div
                    key={student.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.35,
                      delay: i * 0.06,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className={cn(
                      'relative flex flex-col items-center overflow-hidden rounded-2xl border bg-card p-5 text-center shadow-premium transition-shadow hover:shadow-premium-lg',
                      student.rank === 1 && 'border-amber-300/40',
                      student.rank === 2 && 'border-slate-300/40',
                      student.rank === 3 && 'border-orange-300/40'
                    )}
                  >
                    {/* Decorative top accent for podium ranks */}
                    {student.rank <= 3 && (
                      <div
                        className={cn(
                          'absolute inset-x-0 top-0 h-1',
                          student.rank === 1 && 'bg-amber-400',
                          student.rank === 2 && 'bg-slate-400',
                          student.rank === 3 && 'bg-orange-400'
                        )}
                      />
                    )}

                    {/* Rank badge */}
                    <div
                      className={cn(
                        'mb-3 flex h-12 w-12 items-center justify-center rounded-full text-lg font-extrabold shadow-md',
                        rankBadgeClass(student.rank)
                      )}
                    >
                      {student.rank}
                    </div>

                    {/* Avatar */}
                    <div className="mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-base font-bold text-primary">
                      {student.studentName
                        .split(' ')
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join('')}
                    </div>

                    {/* Name & class */}
                    <h3 className="truncate text-sm font-semibold">
                      {student.studentName}
                    </h3>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {student.class}
                    </p>

                    {/* Marks & grade */}
                    <div className="mt-3 flex w-full items-center justify-between rounded-lg bg-muted/50 px-3 py-2">
                      <div className="text-left">
                        <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                          Marks
                        </p>
                        <p className="text-sm font-bold tabular-nums">
                          {student.totalMarks}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                          Grade
                        </p>
                        <p
                          className={cn(
                            'text-sm font-bold',
                            gradeVariant(student.grade) === 'success' &&
                              'text-success',
                            gradeVariant(student.grade) === 'info' &&
                              'text-info',
                            gradeVariant(student.grade) === 'warning' &&
                              'text-accent',
                            gradeVariant(student.grade) === 'destructive' &&
                              'text-destructive'
                          )}
                        >
                          {student.grade}
                        </p>
                      </div>
                    </div>

                    {/* Percentage bar */}
                    <div className="mt-3 w-full">
                      <div className="mb-1 flex items-center justify-between text-[10px] text-muted-foreground">
                        <span>Score</span>
                        <span className="font-semibold tabular-nums">
                          {student.percentage}%
                        </span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${student.percentage}%` }}
                          transition={{
                            duration: 0.6,
                            delay: 0.2 + i * 0.06,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                          className={cn(
                            'h-full rounded-full',
                            student.percentage >= 75
                              ? 'bg-success'
                              : student.percentage >= 50
                                ? 'bg-info'
                                : 'bg-accent'
                          )}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </SectionCard>
          )}

          {/* --- Analysis --- */}
          {activeTab === 'analysis' && (
            <div className="space-y-6">
              {/* Summary cards */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <StatCard
                  title="Highest Score"
                  value={`${analysisStats.highest}`}
                  icon={Trophy}
                  change="Across all subjects"
                  changeType="positive"
                  description="Top mark recorded"
                  delay={0}
                />
                <StatCard
                  title="Lowest Score"
                  value={`${analysisStats.lowest}`}
                  icon={BarChart3}
                  change="Subject average"
                  changeType="neutral"
                  description="Lowest subject average"
                  delay={0.05}
                />
                <StatCard
                  title="Most Improved Subject"
                  value={analysisStats.mostImproved}
                  icon={TrendingUp}
                  change="Highest avg marks"
                  changeType="positive"
                  description="Leading subject this term"
                  delay={0.1}
                />
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <ChartCard
                  title="Subject-wise Average Marks"
                  description="Average marks scored per subject"
                  delay={0.05}
                >
                  <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={subjectAnalysis}
                        margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          vertical={false}
                          stroke="hsl(var(--border))"
                          opacity={0.4}
                        />
                        <XAxis
                          dataKey="subject"
                          tick={{ fontSize: 11 }}
                          stroke="hsl(var(--muted-foreground))"
                          interval={0}
                          angle={-15}
                          textAnchor="end"
                          height={50}
                        />
                        <YAxis
                          domain={[0, 100]}
                          tick={{ fontSize: 11 }}
                          stroke="hsl(var(--muted-foreground))"
                        />
                        <Tooltip
                          cursor={{ fill: 'hsl(var(--muted))', opacity: 0.3 }}
                          contentStyle={{
                            borderRadius: '0.5rem',
                            border: '1px solid hsl(var(--border))',
                            background: 'hsl(var(--popover))',
                            color: 'hsl(var(--popover-foreground))',
                            fontSize: '0.8rem',
                          }}
                          formatter={(value: number) => [
                            `${value} marks`,
                            'Avg Marks',
                          ]}
                        />
                        <Bar
                          dataKey="avgMarks"
                          radius={[6, 6, 0, 0]}
                          maxBarSize={56}
                        >
                          {subjectAnalysis.map((_, i) => (
                            <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </ChartCard>

                <ChartCard
                  title="Pass Percentage by Subject"
                  description="Percentage of students who passed each subject"
                  delay={0.1}
                >
                  <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={subjectAnalysis}
                        margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          vertical={false}
                          stroke="hsl(var(--border))"
                          opacity={0.4}
                        />
                        <XAxis
                          dataKey="subject"
                          tick={{ fontSize: 11 }}
                          stroke="hsl(var(--muted-foreground))"
                          interval={0}
                          angle={-15}
                          textAnchor="end"
                          height={50}
                        />
                        <YAxis
                          domain={[0, 100]}
                          tick={{ fontSize: 11 }}
                          stroke="hsl(var(--muted-foreground))"
                          tickFormatter={(v) => `${v}%`}
                        />
                        <Tooltip
                          cursor={{ fill: 'hsl(var(--muted))', opacity: 0.3 }}
                          contentStyle={{
                            borderRadius: '0.5rem',
                            border: '1px solid hsl(var(--border))',
                            background: 'hsl(var(--popover))',
                            color: 'hsl(var(--popover-foreground))',
                            fontSize: '0.8rem',
                          }}
                          formatter={(value: number) => [`${value}%`, 'Pass Rate']}
                        />
                        <Bar
                          dataKey="passPercentage"
                          radius={[6, 6, 0, 0]}
                          maxBarSize={56}
                        >
                          {subjectAnalysis.map((_, i) => (
                            <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </ChartCard>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
