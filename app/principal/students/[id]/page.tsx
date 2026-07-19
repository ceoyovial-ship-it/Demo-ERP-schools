'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { toast } from 'sonner';
import {
  ArrowLeft,
  GraduationCap,
  Phone,
  Mail,
  MapPin,
  Droplet,
  Calendar,
  Award,
  FileText,
  Download,
  Activity,
  BookOpen,
  Bus,
  Library,
  Wallet,
  Heart,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import { SectionCard } from '@/components/section-card';
import { ChartCard } from '@/components/chart-card';
import { StatusBadge, getFeeStatusVariant } from '@/components/status-badge';
import {
  students,
  studentActivityLog,
  studentAchievements,
  studentDocuments,
  studentMedical,
} from '@/lib/erp-data';
import { studentAttendance, studentMarks } from '@/lib/mock-data';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type TabKey = 'overview' | 'attendance' | 'academics' | 'fees' | 'documents' | 'activity';

interface TabDef {
  key: TabKey;
  label: string;
  icon: LucideIcon;
}

// ---------------------------------------------------------------------------
// Static config
// ---------------------------------------------------------------------------

const TABS: TabDef[] = [
  { key: 'overview', label: 'Overview', icon: GraduationCap },
  { key: 'attendance', label: 'Attendance', icon: Calendar },
  { key: 'academics', label: 'Academics', icon: BookOpen },
  { key: 'fees', label: 'Fees', icon: Wallet },
  { key: 'documents', label: 'Documents', icon: FileText },
  { key: 'activity', label: 'Activity Log', icon: Activity },
];

const ACTIVITY_TYPE_STYLES: Record<string, { color: string; bg: string }> = {
  admission: { color: 'text-info', bg: 'bg-info/10' },
  milestone: { color: 'text-primary', bg: 'bg-primary/10' },
  achievement: { color: 'text-success', bg: 'bg-success/10' },
  alert: { color: 'text-destructive', bg: 'bg-destructive/10' },
  fee: { color: 'text-accent', bg: 'bg-accent/10' },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? '')
    .join('');
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

export default function StudentPortfolioPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabKey>('overview');

  const student = useMemo(
    () => students.find((s) => s.id === params.id),
    [params.id]
  );

  // -------------------------------------------------------------------------
  // Not found state
  // -------------------------------------------------------------------------
  if (!student) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
          <GraduationCap className="h-10 w-10 text-muted-foreground" />
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight">Student not found</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            The student you are looking for does not exist or may have been
            removed.
          </p>
        </div>
        <button
          onClick={() => router.push('/principal/dashboard')}
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium shadow-premium transition-colors hover:bg-muted"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </button>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // Derived data
  // -------------------------------------------------------------------------
  const attendanceStats = useMemo(() => {
    const totalDays = studentAttendance.reduce((sum, m) => sum + m.total, 0);
    const presentDays = studentAttendance.reduce(
      (sum, m) => sum + m.present,
      0
    );
    const absentDays = totalDays - presentDays;
    // Roughly 5% of present days are late arrivals
    const lateDays = Math.round(presentDays * 0.05);
    const rate = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;
    return { totalDays, presentDays, absentDays, lateDays, rate };
  }, []);

  const attendanceChartData = useMemo(
    () =>
      studentAttendance.map((m) => ({
        month: m.month,
        present: m.present,
        absent: m.total - m.present,
        rate: Math.round((m.present / m.total) * 100),
      })),
    []
  );

  const marksChartData = useMemo(
    () =>
      studentMarks.map((m) => ({
        subject: m.subject.length > 10 ? m.subject.slice(0, 8) + '…' : m.subject,
        fullSubject: m.subject,
        marks: m.marks,
        grade: m.grade,
      })),
    []
  );

  const feeHistory = useMemo(() => {
    // Build a representative fee history from the student's fee status
    const base = [
      {
        id: 'fee-q1',
        term: 'Q1 — Tuition',
        amount: 11250,
        dueDate: '2025-04-30',
        paidDate: '2025-04-05',
        method: 'UPI',
        status: 'paid',
      },
      {
        id: 'fee-q2',
        term: 'Q2 — Tuition',
        amount: 11250,
        dueDate: '2025-07-31',
        paidDate: '2025-07-01',
        method: 'Bank Transfer',
        status: 'paid',
      },
      {
        id: 'fee-q3',
        term: 'Q3 — Tuition',
        amount: 11250,
        dueDate: '2025-10-31',
        paidDate: null,
        method: null,
        status: student.feeStatus === 'paid' ? 'paid' : student.feeStatus,
      },
      {
        id: 'fee-transport',
        term: 'Transport — Annual',
        amount: 8000,
        dueDate: '2025-07-15',
        paidDate: '2025-06-20',
        method: 'Card',
        status: 'paid',
      },
      {
        id: 'fee-lab',
        term: 'Lab Fee — Annual',
        amount: 5000,
        dueDate: '2025-08-15',
        paidDate: null,
        method: null,
        status: student.feeStatus === 'overdue' ? 'overdue' : 'pending',
      },
    ];
    return base;
  }, [student.feeStatus]);

  const totalFees = feeHistory.reduce((sum, f) => sum + f.amount, 0);
  const paidFees = feeHistory
    .filter((f) => f.status === 'paid')
    .reduce((sum, f) => sum + f.amount, 0);
  const pendingFees = totalFees - paidFees;

  // -------------------------------------------------------------------------
  // Handlers
  // -------------------------------------------------------------------------
  const handleBack = () => router.push('/principal/dashboard');

  const handleDownload = (docName: string) => {
    toast.success(`Downloading ${docName}…`, {
      description: 'Your file will be saved to your downloads folder.',
    });
  };

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------
  return (
    <div className="space-y-6">
      {/* Back button */}
      <motion.button
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.25 }}
        onClick={handleBack}
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Students
      </motion.button>

      <PageHeader
        title="Student Portfolio"
        description="Comprehensive profile, academic and administrative overview"
      />

      {/* ----------------------------------------------------------------- */}
      {/* Profile header — cover + avatar + identity                         */}
      {/* ----------------------------------------------------------------- */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="overflow-hidden rounded-2xl border bg-card shadow-premium"
      >
        {/* Cover photo */}
        <div className="relative h-40 w-full bg-gradient-to-br from-primary/20 via-chart-2/10 to-chart-4/10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.15),transparent_60%)]" />
          {/* Subtle decorative dots */}
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                'radial-gradient(hsl(var(--primary)/0.4) 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />
        </div>

        {/* Avatar + identity */}
        <div className="px-6 pb-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
              {/* Circular profile photo with initials, overlapping cover */}
              <div className="-mt-12 flex-shrink-0">
                <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-card bg-gradient-to-br from-primary to-chart-2 text-2xl font-bold text-primary-foreground shadow-lg">
                  {getInitials(student.name)}
                </div>
              </div>

              <div className="pb-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-2xl font-bold tracking-tight">
                    {student.name}
                  </h2>
                  <StatusBadge
                    status={student.status}
                    variant={
                      student.status === 'active'
                        ? 'success'
                        : student.status === 'graduated'
                          ? 'info'
                          : 'neutral'
                    }
                  />
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <GraduationCap className="h-3.5 w-3.5" />
                    Class {student.classSection}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <BookOpen className="h-3.5 w-3.5" />
                    Roll No. {student.rollNumber}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <FileText className="h-3.5 w-3.5" />
                    {student.admissionNumber}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick stats */}
            <div className="flex gap-3 pb-1">
              <div className="rounded-xl border bg-muted/40 px-4 py-2 text-center">
                <div className="text-lg font-bold text-primary">
                  {student.attendance}%
                </div>
                <div className="text-[11px] uppercase tracking-wide text-muted-foreground">
                  Attendance
                </div>
              </div>
              <div className="rounded-xl border bg-muted/40 px-4 py-2 text-center">
                <div className="text-lg font-bold text-chart-2">
                  {student.avgMarks}%
                </div>
                <div className="text-[11px] uppercase tracking-wide text-muted-foreground">
                  Avg Marks
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ----------------------------------------------------------------- */}
      {/* Tab navigation                                                     */}
      {/* ----------------------------------------------------------------- */}
      <div className="sticky top-0 z-10 -mx-4 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="inline-flex min-w-full items-center gap-1 rounded-xl border bg-card p-1 shadow-premium sm:min-w-0">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`relative inline-flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors sm:px-4 ${
                  isActive
                    ? 'text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTabBg"
                    className="absolute inset-0 rounded-lg bg-primary"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10 inline-flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.label}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* Tab content                                                        */}
      {/* ----------------------------------------------------------------- */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        >
          {activeTab === 'overview' && (
            <OverviewTab student={student} />
          )}
          {activeTab === 'attendance' && (
            <AttendanceTab
              chartData={attendanceChartData}
              stats={attendanceStats}
            />
          )}
          {activeTab === 'academics' && (
            <AcademicsTab
              marksChartData={marksChartData}
              marksTable={studentMarks}
            />
          )}
          {activeTab === 'fees' && (
            <FeesTab
              feeHistory={feeHistory}
              totalFees={totalFees}
              paidFees={paidFees}
              pendingFees={pendingFees}
            />
          )}
          {activeTab === 'documents' && (
            <DocumentsTab onDownload={handleDownload} />
          )}
          {activeTab === 'activity' && <ActivityTab />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ===========================================================================
// Overview Tab
// ===========================================================================

function OverviewTab({
  student,
}: {
  student: (typeof students)[number];
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Admission details */}
      <SectionCard title="Admission Details" delay={0}>
        <dl className="space-y-3">
          <DetailRow
            icon={FileText}
            label="Admission Number"
            value={student.admissionNumber}
          />
          <DetailRow
            icon={Calendar}
            label="Admission Date"
            value={formatDate(student.admissionDate)}
          />
          <DetailRow
            icon={GraduationCap}
            label="Class & Section"
            value={`Grade ${student.classGrade} — Section ${student.section}`}
          />
          <DetailRow
            icon={BookOpen}
            label="Roll Number"
            value={String(student.rollNumber)}
          />
          <DetailRow
            icon={Calendar}
            label="Date of Birth"
            value={formatDate(student.dob)}
          />
          <DetailRow
            icon={Heart}
            label="Gender"
            value={student.gender}
          />
          <DetailRow
            icon={MapPin}
            label="Address"
            value={student.address}
          />
        </dl>
      </SectionCard>

      {/* Parent details */}
      <SectionCard title="Parent / Guardian" delay={0.05}>
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div>
            <div className="font-semibold">{student.parentName}</div>
            <div className="text-sm text-muted-foreground">Guardian</div>
          </div>
        </div>
        <dl className="space-y-3">
          <DetailRow icon={Phone} label="Phone" value={student.parentPhone} />
          <DetailRow icon={Mail} label="Email" value={student.parentEmail} />
        </dl>
      </SectionCard>

      {/* Medical record */}
      <SectionCard title="Medical Record" delay={0.1}>
        <dl className="space-y-3">
          <DetailRow
            icon={Droplet}
            label="Blood Group"
            value={studentMedical.bloodGroup}
          />
          <DetailRow
            icon={Heart}
            label="Height / Weight"
            value={`${studentMedical.height} / ${studentMedical.weight}`}
          />
          <DetailRow
            icon={Activity}
            label="Vision"
            value={studentMedical.vision}
          />
          <DetailRow
            icon={Heart}
            label="Allergies"
            value={
              studentMedical.allergies.length > 0
                ? studentMedical.allergies.join(', ')
                : 'None'
            }
          />
          <DetailRow
            icon={FileText}
            label="Conditions"
            value={studentMedical.conditions}
          />
          <DetailRow
            icon={Phone}
            label="Emergency Contact"
            value={studentMedical.emergencyContact}
          />
          <DetailRow
            icon={Calendar}
            label="Last Checkup"
            value={formatDate(studentMedical.lastCheckup)}
          />
        </dl>
        <div className="mt-4 border-t pt-3">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Vaccinations
          </div>
          <div className="flex flex-wrap gap-1.5">
            {studentMedical.vaccinations.map((v) => (
              <span
                key={v}
                className="rounded-md bg-success/10 px-2 py-0.5 text-xs font-medium text-success"
              >
                {v}
              </span>
            ))}
          </div>
        </div>
      </SectionCard>

      {/* Achievements */}
      <SectionCard
        title="Achievements"
        description="Awards and recognitions earned"
        delay={0.15}
      >
        <ul className="space-y-3">
          {studentAchievements.map((a) => (
            <li key={a.id} className="flex items-start gap-3">
              <div className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                <Award className="h-4.5 w-4.5" />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-medium leading-snug">
                  {a.title}
                </div>
                <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{formatDate(a.date)}</span>
                  <span className="text-border">•</span>
                  <StatusBadge status={a.level} variant="info" />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </SectionCard>

      {/* Transport info */}
      <SectionCard title="Transport Info" delay={0.2}>
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-chart-4/10 text-chart-4">
            <Bus className="h-6 w-6" />
          </div>
          <div>
            <div className="font-semibold">Route R3 — Indiranagar</div>
            <div className="text-sm text-muted-foreground">
              Vehicle KA01 AB-1234
            </div>
          </div>
        </div>
        <dl className="space-y-3">
          <DetailRow icon={MapPin} label="Pickup Point" value="Stop 5 — CMH Road" />
          <DetailRow icon={Calendar} label="Pickup Time" value="07:15 AM" />
          <DetailRow icon={Calendar} label="Drop Time" value="04:45 PM" />
          <DetailRow icon={Wallet} label="Quarterly Fare" value="₹3,500" />
        </dl>
      </SectionCard>

      {/* Library info */}
      <SectionCard title="Library Info" delay={0.25}>
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-info/10 text-info">
            <Library className="h-6 w-6" />
          </div>
          <div>
            <div className="font-semibold">Member ID: LIB-1029</div>
            <div className="text-sm text-muted-foreground">
              Active member since 2023
            </div>
          </div>
        </div>
        <dl className="space-y-3">
          <DetailRow icon={BookOpen} label="Books Issued" value="3 current" />
          <DetailRow
            icon={Calendar}
            label="Next Due Date"
            value="Jul 25, 2025"
          />
          <DetailRow icon={Wallet} label="Outstanding Fine" value="₹0" />
        </dl>
      </SectionCard>
    </div>
  );
}

// ===========================================================================
// Attendance Tab
// ===========================================================================

function AttendanceTab({
  chartData,
  stats,
}: {
  chartData: { month: string; present: number; absent: number; rate: number }[];
  stats: {
    totalDays: number;
    presentDays: number;
    absentDays: number;
    lateDays: number;
    rate: number;
  };
}) {
  const statCards = [
    {
      label: 'Present Days',
      value: stats.presentDays,
      icon: Calendar,
      color: 'text-success',
      bg: 'bg-success/10',
    },
    {
      label: 'Absent Days',
      value: stats.absentDays,
      icon: Calendar,
      color: 'text-destructive',
      bg: 'bg-destructive/10',
    },
    {
      label: 'Late Days',
      value: stats.lateDays,
      icon: Activity,
      color: 'text-accent',
      bg: 'bg-accent/10',
    },
    {
      label: 'Attendance Rate',
      value: `${stats.rate}%`,
      icon: TrendingUp,
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statCards.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
              className="rounded-2xl border bg-card p-5 shadow-premium"
            >
              <div className="flex items-center justify-between">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${s.bg}`}>
                  <Icon className={`h-5 w-5 ${s.color}`} />
                </div>
              </div>
              <div className="mt-3 text-2xl font-bold">{s.value}</div>
              <div className="text-sm text-muted-foreground">{s.label}</div>
            </motion.div>
          );
        })}
      </div>

      {/* Attendance area chart */}
      <ChartCard
        title="Monthly Attendance Trend"
        description="Present vs absent days over the academic year"
      >
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData} margin={{ left: -16, right: 8, top: 8 }}>
            <defs>
              <linearGradient id="presentGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.4} />
                <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="absentGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-5))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--chart-5))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '12px',
                fontSize: '13px',
              }}
              labelStyle={{ fontWeight: 600 }}
            />
            <Area
              type="monotone"
              dataKey="present"
              name="Present"
              stroke="hsl(var(--chart-2))"
              strokeWidth={2}
              fill="url(#presentGrad)"
            />
            <Area
              type="monotone"
              dataKey="absent"
              name="Absent"
              stroke="hsl(var(--chart-5))"
              strokeWidth={2}
              fill="url(#absentGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}

// ===========================================================================
// Academics Tab
// ===========================================================================

function AcademicsTab({
  marksChartData,
  marksTable,
}: {
  marksChartData: { subject: string; fullSubject: string; marks: number; grade: string }[];
  marksTable: { subject: string; marks: number; grade: string }[];
}) {
  const avgMarks = Math.round(
    marksTable.reduce((s, m) => s + m.marks, 0) / marksTable.length
  );

  return (
    <div className="space-y-6">
      {/* Marks bar chart */}
      <ChartCard
        title="Subject-wise Marks"
        description="Latest examination scores across all subjects"
      >
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={marksChartData} margin={{ left: -16, right: 8, top: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis
              dataKey="subject"
              tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              cursor={{ fill: 'hsl(var(--muted))' }}
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '12px',
                fontSize: '13px',
              }}
              labelStyle={{ fontWeight: 600 }}
              formatter={(value: number, _name, props) => [
                `${value} / 100 (Grade ${props.payload.grade})`,
                props.payload.fullSubject,
              ]}
            />
            <Bar dataKey="marks" radius={[6, 6, 0, 0]} maxBarSize={48}>
              {marksChartData.map((entry, i) => (
                <Cell
                  key={`cell-${i}`}
                  fill={
                    entry.marks >= 90
                      ? 'hsl(var(--chart-2))'
                      : entry.marks >= 80
                        ? 'hsl(var(--chart-1))'
                        : entry.marks >= 70
                          ? 'hsl(var(--chart-3))'
                          : 'hsl(var(--chart-5))'
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Subject-wise marks table + exam results summary */}
      <div className="grid gap-6 lg:grid-cols-3">
        <SectionCard
          title="Subject-wise Marks"
          description="Detailed breakdown with grades"
          className="lg:col-span-2"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="pb-2 pr-4 font-medium">Subject</th>
                  <th className="pb-2 pr-4 font-medium">Marks</th>
                  <th className="pb-2 pr-4 font-medium">Grade</th>
                  <th className="pb-2 font-medium">Result</th>
                </tr>
              </thead>
              <tbody>
                {marksTable.map((m) => (
                  <tr key={m.subject} className="border-b last:border-0">
                    <td className="py-3 pr-4 font-medium">{m.subject}</td>
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{m.marks}</span>
                        <span className="text-muted-foreground">/ 100</span>
                      </div>
                    </td>
                    <td className="py-3 pr-4">
                      <span
                        className={`inline-flex h-7 min-w-7 items-center justify-center rounded-md px-2 text-xs font-bold ${
                          m.grade === 'A+'
                            ? 'bg-success/10 text-success'
                            : m.grade === 'A'
                              ? 'bg-primary/10 text-primary'
                              : 'bg-accent/10 text-accent'
                        }`}
                      >
                        {m.grade}
                      </span>
                    </td>
                    <td className="py-3">
                      <StatusBadge status="pass" variant="success" />
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2">
                  <td className="pt-3 font-semibold">Overall Average</td>
                  <td className="pt-3 font-bold text-primary">{avgMarks}/100</td>
                  <td className="pt-3">
                    <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-md bg-success/10 px-2 text-xs font-bold text-success">
                      {avgMarks >= 90 ? 'A+' : avgMarks >= 80 ? 'A' : 'B'}
                    </span>
                  </td>
                  <td className="pt-3">
                    <StatusBadge status="pass" variant="success" />
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </SectionCard>

        {/* Exam results summary */}
        <SectionCard title="Exam Results" description="Recent examinations">
          <ul className="space-y-3">
            {[
              {
                name: 'Unit Test 1',
                term: 'Term 1',
                score: `${avgMarks}%`,
                grade: avgMarks >= 90 ? 'A+' : avgMarks >= 80 ? 'A' : 'B',
                status: 'completed',
              },
              {
                name: 'Mid-Term',
                term: 'Term 1',
                score: `${Math.max(avgMarks - 3, 60)}%`,
                grade: 'A',
                status: 'completed',
              },
              {
                name: 'Unit Test 2',
                term: 'Term 2',
                score: '—',
                grade: '—',
                status: 'upcoming',
              },
              {
                name: 'Final Exam',
                term: 'Term 2',
                score: '—',
                grade: '—',
                status: 'upcoming',
              },
            ].map((e) => (
              <li
                key={e.name}
                className="flex items-center justify-between rounded-lg border bg-muted/30 px-3 py-2.5"
              >
                <div>
                  <div className="text-sm font-medium">{e.name}</div>
                  <div className="text-xs text-muted-foreground">{e.term}</div>
                </div>
                <div className="flex items-center gap-2">
                  {e.score !== '—' && (
                    <span className="text-sm font-bold text-primary">
                      {e.score}
                    </span>
                  )}
                  <StatusBadge
                    status={e.status}
                    variant={e.status === 'completed' ? 'success' : 'neutral'}
                  />
                </div>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>
    </div>
  );
}

// ===========================================================================
// Fees Tab
// ===========================================================================

function FeesTab({
  feeHistory,
  totalFees,
  paidFees,
  pendingFees,
}: {
  feeHistory: {
    id: string;
    term: string;
    amount: number;
    dueDate: string;
    paidDate: string | null;
    method: string | null;
    status: string;
  }[];
  totalFees: number;
  paidFees: number;
  pendingFees: number;
}) {
  const summaryCards = [
    {
      label: 'Total Fees',
      value: `₹${totalFees.toLocaleString('en-IN')}`,
      icon: Wallet,
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      label: 'Paid',
      value: `₹${paidFees.toLocaleString('en-IN')}`,
      icon: TrendingUp,
      color: 'text-success',
      bg: 'bg-success/10',
    },
    {
      label: 'Pending',
      value: `₹${pendingFees.toLocaleString('en-IN')}`,
      icon: Wallet,
      color: 'text-accent',
      bg: 'bg-accent/10',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {summaryCards.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
              className="flex items-center gap-4 rounded-2xl border bg-card p-5 shadow-premium"
            >
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${s.bg}`}>
                <Icon className={`h-6 w-6 ${s.color}`} />
              </div>
              <div>
                <div className="text-xl font-bold">{s.value}</div>
                <div className="text-sm text-muted-foreground">{s.label}</div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Fee history table */}
      <SectionCard
        title="Fee History"
        description="Complete payment records with status"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="pb-2 pr-4 font-medium">Fee Term</th>
                <th className="pb-2 pr-4 font-medium">Amount</th>
                <th className="pb-2 pr-4 font-medium">Due Date</th>
                <th className="pb-2 pr-4 font-medium">Paid Date</th>
                <th className="pb-2 pr-4 font-medium">Method</th>
                <th className="pb-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {feeHistory.map((f) => (
                <tr key={f.id} className="border-b last:border-0">
                  <td className="py-3 pr-4 font-medium">{f.term}</td>
                  <td className="py-3 pr-4 font-semibold">
                    ₹{f.amount.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 pr-4 text-muted-foreground">
                    {formatDate(f.dueDate)}
                  </td>
                  <td className="py-3 pr-4 text-muted-foreground">
                    {f.paidDate ? formatDate(f.paidDate) : '—'}
                  </td>
                  <td className="py-3 pr-4 text-muted-foreground">
                    {f.method ?? '—'}
                  </td>
                  <td className="py-3">
                    <StatusBadge
                      status={f.status}
                      variant={getFeeStatusVariant(f.status)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}

// ===========================================================================
// Documents Tab
// ===========================================================================

function DocumentsTab({
  onDownload,
}: {
  onDownload: (name: string) => void;
}) {
  return (
    <SectionCard
      title="Student Documents"
      description="Uploaded records and certificates"
    >
      <ul className="divide-y">
        {studentDocuments.map((doc) => (
          <li
            key={doc.id}
            className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
          >
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <FileText className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <div className="truncate text-sm font-medium">{doc.name}</div>
                <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="rounded bg-muted px-1.5 py-0.5 font-medium">
                    {doc.type}
                  </span>
                  <span>{doc.size}</span>
                  <span className="text-border">•</span>
                  <span>Uploaded {formatDate(doc.uploaded)}</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => onDownload(doc.name)}
              className="inline-flex flex-shrink-0 items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted"
            >
              <Download className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Download</span>
            </button>
          </li>
        ))}
      </ul>
    </SectionCard>
  );
}

// ===========================================================================
// Activity Log Tab
// ===========================================================================

function ActivityTab() {
  return (
    <SectionCard
      title="Activity Timeline"
      description="Chronological log of student milestones and events"
    >
      <ol className="relative space-y-6 pl-6">
        {/* Vertical line */}
        <div className="absolute left-2 top-2 bottom-2 w-px bg-border" />
        {studentActivityLog.map((item, i) => {
          const style =
            ACTIVITY_TYPE_STYLES[item.type] ?? ACTIVITY_TYPE_STYLES.milestone;
          return (
            <motion.li
              key={item.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: i * 0.06 }}
              className="relative"
            >
              {/* Dot */}
              <div
                className={`absolute -left-[18px] top-1 flex h-4 w-4 items-center justify-center rounded-full ring-4 ring-card ${style.bg}`}
              >
                <div className={`h-1.5 w-1.5 rounded-full ${style.color.replace('text-', 'bg-')}`} />
              </div>
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{item.event}</span>
                  <span
                    className={`rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${style.bg} ${style.color}`}
                  >
                    {item.type}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {formatDate(item.date)}
                </span>
              </div>
            </motion.li>
          );
        })}
      </ol>
    </SectionCard>
  );
}

// ===========================================================================
// Shared: DetailRow
// ===========================================================================

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </dt>
        <dd className="mt-0.5 break-words text-sm font-medium">{value}</dd>
      </div>
    </div>
  );
}
