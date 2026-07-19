'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CalendarCheck,
  TrendingUp,
  Users,
  CheckCircle2,
  LayoutGrid,
  Table2,
  CalendarDays,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { toast } from 'sonner';
import { PageHeader } from '@/components/page-header';
import { StatCard } from '@/components/stat-card';
import { SectionCard } from '@/components/section-card';
import { ChartCard } from '@/components/chart-card';
import { DataTable, type Column } from '@/components/data-table';
import { ExportButtons } from '@/components/export-buttons';
import { StatusBadge, getAttendanceVariant } from '@/components/status-badge';
import { attendanceData, classAttendance } from '@/lib/erp-data';
import { cn } from '@/lib/utils';

/* -------------------------------------------------------------------------- */
/*  Types & derived data                                                      */
/* -------------------------------------------------------------------------- */

type TabKey = 'overview' | 'class-wise' | 'calendar';

interface ClassRow {
  id: string;
  class: string;
  present: number;
  absent: number;
  late: number;
  rate: number;
}

/** Normalise classAttendance into rows that satisfy DataTable's `{ id }` constraint. */
const classRows: ClassRow[] = classAttendance.map((c, i) => ({
  id: `cls-${i + 1}`,
  class: c.class,
  present: c.present,
  absent: c.absent,
  late: c.late,
  rate: c.rate,
}));

/** Attendance trend summary computed from the 30-day dataset. */
const totalSchoolDays = attendanceData.length;
const avgAttendance = (
  attendanceData.reduce((acc, d) => acc + d.rate, 0) / attendanceData.length
).toFixed(1);
const bestDayEntry = [...attendanceData].sort((a, b) => b.rate - a.rate)[0];

/** Calendar heatmap helpers -------------------------------------------------- */
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

interface HeatCell {
  day: number | null;
  rate: number | null;
}

/** Build a 7-col × 5-row (35-cell) grid aligned to weekday columns. */
const heatCells: HeatCell[] = (() => {
  const firstDate = new Date(attendanceData[0].date);
  const firstCol = firstDate.getDay(); // 0 = Sun
  const cells: HeatCell[] = [];
  for (let i = 0; i < firstCol; i++) cells.push({ day: null, rate: null });
  attendanceData.forEach((d, i) => {
    cells.push({ day: i + 1, rate: d.rate });
  });
  while (cells.length % 7 !== 0) cells.push({ day: null, rate: null });
  return cells;
})();

function heatColor(rate: number | null): string {
  if (rate === null) return 'bg-muted/30';
  if (rate > 95) return 'bg-success/80 text-success-foreground';
  if (rate >= 90) return 'bg-teal-500/80 text-white';
  if (rate >= 85) return 'bg-accent/80 text-accent-foreground';
  return 'bg-destructive/80 text-destructive-foreground';
}

/* -------------------------------------------------------------------------- */
/*  Tab configuration                                                         */
/* -------------------------------------------------------------------------- */

const tabs: { key: TabKey; label: string; icon: typeof LayoutGrid }[] = [
  { key: 'overview', label: 'Overview', icon: LayoutGrid },
  { key: 'class-wise', label: 'Class-wise', icon: Table2 },
  { key: 'calendar', label: 'Calendar', icon: CalendarDays },
];

/* -------------------------------------------------------------------------- */
/*  Recharts tooltip                                                          */
/* -------------------------------------------------------------------------- */

interface TooltipPayloadItem {
  name: string;
  value: number;
  color: string;
}
interface TrendTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
}

function TrendTooltip({ active, payload, label }: TrendTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border bg-popover p-3 text-xs shadow-md">
      <p className="mb-1.5 font-medium">{label}</p>
      {payload.map((p) => (
        <p key={p.name} className="flex items-center gap-2 capitalize text-muted-foreground">
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{ backgroundColor: p.color }}
          />
          <span className="font-medium text-foreground">{p.name}</span>: {p.value}
        </p>
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function AttendancePage() {
  const [activeTab, setActiveTab] = useState<TabKey>('overview');

  const columns: Column<ClassRow>[] = [
    {
      key: 'class',
      header: 'Class',
      sortable: true,
      render: (row) => (
        <span className="font-medium">{row.class}</span>
      ),
      className: 'whitespace-nowrap',
    },
    {
      key: 'present',
      header: 'Present',
      sortable: true,
      render: (row) => (
        <span className="tabular-nums font-medium text-success">{row.present}</span>
      ),
      className: 'tabular-nums',
    },
    {
      key: 'absent',
      header: 'Absent',
      sortable: true,
      render: (row) => (
        <span className="tabular-nums font-medium text-destructive">{row.absent}</span>
      ),
      className: 'tabular-nums',
    },
    {
      key: 'late',
      header: 'Late',
      sortable: true,
      render: (row) => (
        <span className="tabular-nums font-medium text-accent-foreground">{row.late}</span>
      ),
      className: 'tabular-nums',
    },
    {
      key: 'rate',
      header: 'Rate %',
      sortable: true,
      render: (row) => (
        <span className="tabular-nums font-semibold">{row.rate}%</span>
      ),
      className: 'tabular-nums',
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => (
        <StatusBadge
          status={row.rate >= 90 ? 'Good' : row.rate >= 75 ? 'Warning' : 'Critical'}
          variant={getAttendanceVariant(row.rate)}
        />
      ),
      className: 'whitespace-nowrap',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader title="Attendance Management" description="Track and analyze attendance across the school">
        <ExportButtons
          label="attendance"
          data={attendanceData as unknown as Record<string, unknown>[]}
          columns={[
            { key: 'date', label: 'Date' },
            { key: 'day', label: 'Day' },
            { key: 'present', label: 'Present' },
            { key: 'absent', label: 'Absent' },
            { key: 'late', label: 'Late' },
            { key: 'rate', label: 'Rate %' },
          ]}
          filename="attendance-report"
        />
      </PageHeader>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Today's Rate"
          value="94.8%"
          icon={CalendarCheck}
          change="+1.2% vs yesterday"
          changeType="positive"
          delay={0}
        />
        <StatCard
          title="This Week Avg"
          value="93.2%"
          icon={TrendingUp}
          change="-0.4% vs last week"
          changeType="negative"
          delay={0.05}
        />
        <StatCard
          title="Monthly Avg"
          value="94.1%"
          icon={CheckCircle2}
          change="+0.6% vs last month"
          changeType="positive"
          delay={0.1}
        />
        <StatCard
          title="Total Present Today"
          value="898"
          icon={Users}
          change="50 absent · 12 late"
          changeType="neutral"
          delay={0.15}
        />
      </div>

      {/* Tab navigation */}
      <div className="flex flex-wrap items-center gap-2 rounded-xl border bg-card p-1.5 shadow-premium">
        {tabs.map((tab) => {
          const TabIcon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => {
                setActiveTab(tab.key);
                toast.info(`Switched to ${tab.label} view`);
              }}
              className={cn(
                'relative flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {isActive && (
                <motion.span
                  layoutId="attendance-tab-indicator"
                  className="absolute inset-0 rounded-lg bg-primary"
                  transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                />
              )}
              <TabIcon className="relative z-10 h-4 w-4" />
              <span className="relative z-10">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            {/* Trend chart */}
            <ChartCard
              title="Attendance Trend"
              description="Daily present vs absent over the last 30 days"
            >
              <div className="h-[340px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={attendanceData} margin={{ top: 8, right: 12, left: -12, bottom: 0 }}>
                    <defs>
                      <linearGradient id="presentGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="absentGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                      tickLine={false}
                      axisLine={false}
                      minTickGap={24}
                      tickFormatter={(v: string) => {
                        const d = new Date(v);
                        return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
                      }}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                      tickLine={false}
                      axisLine={false}
                      width={44}
                    />
                    <Tooltip content={<TrendTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="present"
                      stroke="hsl(var(--success))"
                      strokeWidth={2}
                      fill="url(#presentGrad)"
                      name="Present"
                    />
                    <Area
                      type="monotone"
                      dataKey="absent"
                      stroke="hsl(var(--destructive))"
                      strokeWidth={2}
                      fill="url(#absentGrad)"
                      name="Absent"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>

            {/* Summary cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <SectionCard title="Total School Days" delay={0}>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold tracking-tight">{totalSchoolDays}</span>
                  <span className="text-sm text-muted-foreground">days</span>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Tracked during the current reporting period
                </p>
              </SectionCard>

              <SectionCard title="Avg Attendance" delay={0.05}>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold tracking-tight text-success">{avgAttendance}%</span>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Across all classes for the period
                </p>
              </SectionCard>

              <SectionCard title="Best Day" delay={0.1}>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold tracking-tight">
                    {bestDayEntry?.day ?? '—'}
                  </span>
                  <span className="text-sm font-medium text-success">
                    {bestDayEntry?.rate ?? 0}%
                  </span>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Highest attendance day this period
                </p>
              </SectionCard>
            </div>
          </motion.div>
        )}

        {activeTab === 'class-wise' && (
          <motion.div
            key="class-wise"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            <SectionCard
              title="Class-wise Attendance"
              description="Breakdown of present, absent and late per class for today"
            >
              <DataTable
                data={classRows}
                columns={columns}
                pageSize={10}
                searchKeys={['class']}
                searchPlaceholder="Search class..."
                initialSort={{ key: 'rate', dir: 'desc' }}
              />
            </SectionCard>
          </motion.div>
        )}

        {activeTab === 'calendar' && (
          <motion.div
            key="calendar"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            <SectionCard
              title="Attendance Calendar"
              description="Daily attendance intensity for the current month"
            >
              {/* Weekday header */}
              <div className="grid grid-cols-7 gap-2">
                {WEEKDAYS.map((d) => (
                  <div
                    key={d}
                    className="pb-2 text-center text-xs font-medium text-muted-foreground"
                  >
                    {d}
                  </div>
                ))}

                {/* Heatmap cells */}
                {heatCells.map((cell, i) => (
                  <div
                    key={i}
                    className={cn(
                      'flex aspect-square flex-col items-center justify-center rounded-lg border text-xs font-medium transition-colors',
                      cell.day === null
                        ? 'border-transparent bg-transparent'
                        : cn(heatColor(cell.rate), 'border-transparent')
                    )}
                    title={
                      cell.day !== null && cell.rate !== null
                        ? `Day ${cell.day}: ${cell.rate}% attendance`
                        : undefined
                    }
                  >
                    {cell.day !== null && (
                      <>
                        <span className="text-sm font-semibold leading-none">{cell.day}</span>
                        {cell.rate !== null && (
                          <span className="mt-0.5 text-[10px] opacity-90">{cell.rate}%</span>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>

              {/* Legend */}
              <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                <span className="font-medium text-foreground">Intensity:</span>
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded bg-success/80" />
                  <span>&gt; 95%</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded bg-teal-500/80" />
                  <span>90–95%</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded bg-accent/80" />
                  <span>85–90%</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded bg-destructive/80" />
                  <span>&lt; 85%</span>
                </div>
              </div>
            </SectionCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
