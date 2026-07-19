'use client';

import { motion } from 'framer-motion';
import {
  CalendarCheck,
  ClipboardList,
  Wallet,
  Clock,
  TrendingUp,
  AlertCircle,
  BookOpen,
  Award,
  Bell,
  Mail,
  FileText,
} from 'lucide-react';
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
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from 'recharts';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/page-header';
import { StatCard } from '@/components/stat-card';
import { ChartCard } from '@/components/chart-card';
import { SectionCard } from '@/components/section-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/auth-provider';
import {
  getStudentKey,
  studentDashboardStats,
  studentAttendanceSummary,
  studentSubjectComparison,
  studentMarksTrend,
  studentHomework,
  studentExams,
  studentNotifications,
  studentTimetable,
} from '@/lib/student-data';

export default function StudentDashboard() {
  const { profile } = useAuth();
  const router = useRouter();
  const key = getStudentKey(profile?.email?.split('@')[0]);
  const stats = studentDashboardStats[key];
  const attendanceSummary = studentAttendanceSummary[key];
  const subjectComparison = studentSubjectComparison[key];
  const marksTrend = studentMarksTrend[key];
  const homework = studentHomework[key];
  const exams = studentExams[key];
  const notifications = studentNotifications[key];
  const timetable = studentTimetable[key];

  const todayTimetable = timetable.filter((t) => t.day === 'Mon' && t.subject !== 'Free');
  const pendingHomework = homework.filter((h) => h.status === 'pending' || h.status === 'overdue');
  const upcomingExams = exams.filter((e) => e.status === 'upcoming');
  const unreadNotifications = notifications.filter((n) => !n.read);

  const attendanceData = [
    { name: 'Present', value: attendanceSummary.present, fill: 'hsl(var(--chart-2))' },
    { name: 'Absent', value: attendanceSummary.absent, fill: 'hsl(var(--chart-5))' },
    { name: 'Late', value: attendanceSummary.late, fill: 'hsl(var(--chart-3))' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description={`Hello, ${profile?.full_name ?? 'Student'}. Here's your academic overview.`}
      />

      {/* Welcome Card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6 shadow-premium"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold">Welcome back, {profile?.full_name?.split(' ')[0] ?? 'Student'}!</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Grade {key === 'rahul' ? '10-A' : key === 'priya' ? '9-B' : '8-A'} · Roll #{key === 'rahul' ? 25 : key === 'priya' ? 12 : 8}
              {stats.upcomingExams > 0 && ` · ${stats.upcomingExams} upcoming exams`}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-xl border bg-card/80 px-4 py-2 backdrop-blur">
              <p className="text-2xl font-bold text-primary">#{stats.rank}</p>
              <p className="text-xs text-muted-foreground">Class Rank</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Attendance" value={`${stats.attendance}%`} icon={CalendarCheck} change={stats.attendance >= 90 ? 'Excellent' : stats.attendance >= 75 ? 'Good' : 'Needs attention'} changeType={stats.attendance >= 90 ? 'positive' : stats.attendance >= 75 ? 'neutral' : 'negative'} delay={0} />
        <StatCard title="Average Marks" value={`${stats.avgMarks}%`} icon={TrendingUp} change={stats.avgMarks >= 80 ? 'Very good' : stats.avgMarks >= 60 ? 'Average' : 'Below average'} changeType={stats.avgMarks >= 80 ? 'positive' : stats.avgMarks >= 60 ? 'neutral' : 'negative'} delay={0.05} />
        <StatCard title="Homework Due" value={stats.homeworkDue} icon={ClipboardList} change={pendingHomework.filter((h) => h.status === 'overdue').length > 0 ? `${pendingHomework.filter((h) => h.status === 'overdue').length} overdue` : 'On track'} changeType={pendingHomework.filter((h) => h.status === 'overdue').length > 0 ? 'negative' : 'neutral'} delay={0.1} />
        <StatCard title="Fee Status" value={stats.feeStatus} icon={Wallet} change={stats.feePending > 0 ? `₹${stats.feePending.toLocaleString('en-IN')} pending` : 'All paid'} changeType={stats.feePending > 0 ? 'negative' : 'positive'} delay={0.15} />
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Marks Trend" description="Monthly average marks" delay={0.1}>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={marksTrend}>
              <defs>
                <linearGradient id="colorMarks" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis domain={[0, 100]} stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: '12px', fontSize: '12px' }} />
              <Area type="monotone" dataKey="marks" stroke="hsl(var(--chart-1))" strokeWidth={2} fill="url(#colorMarks)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Subject Performance" description="Your marks vs class average" delay={0.15}>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={subjectComparison}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="subject" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis domain={[0, 100]} stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: '12px', fontSize: '12px' }} />
              <Bar dataKey="marks" fill="hsl(var(--chart-1))" radius={[6, 6, 0, 0]} name="Your Marks" />
              <Bar dataKey="avg" fill="hsl(var(--chart-4))" radius={[6, 6, 0, 0]} name="Class Avg" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Today's Timetable + Notifications */}
      <div className="grid gap-4 lg:grid-cols-3">
        <SectionCard title="Today's Timetable" description="Your class schedule" delay={0.2} className="lg:col-span-2">
          <div className="space-y-2">
            {todayTimetable.slice(0, 6).map((period, i) => (
              <motion.div
                key={period.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 + i * 0.04 }}
                className="flex items-center gap-4 rounded-xl border p-3 transition-all hover:border-primary/30"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-sm font-semibold text-primary">
                  {period.period}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{period.subject}</p>
                  <p className="text-xs text-muted-foreground">Room {period.room} · {period.teacher}</p>
                </div>
                <span className="text-xs text-muted-foreground">{period.time}</span>
              </motion.div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Notifications" description={`${unreadNotifications.length} unread`} delay={0.25}>
          <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
            {notifications.map((n, i) => (
              <motion.div
                key={n.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.05 }}
                className={`flex items-start gap-3 rounded-xl border p-3 ${!n.read ? 'border-primary/30 bg-primary/5' : ''}`}
              >
                <div className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${!n.read ? 'bg-primary/15' : 'bg-muted'}`}>
                  {n.type === 'exam' ? <FileText className="h-3.5 w-3.5 text-primary" /> : n.type === 'fee' ? <Wallet className="h-3.5 w-3.5 text-primary" /> : n.type === 'homework' ? <BookOpen className="h-3.5 w-3.5 text-primary" /> : <Bell className="h-3.5 w-3.5 text-muted-foreground" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium leading-snug">{n.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{n.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* Homework + Exams */}
      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="Homework Due" description="Pending and overdue assignments" delay={0.3}>
          <div className="space-y-2">
            {pendingHomework.map((hw, i) => (
              <motion.div
                key={hw.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 + i * 0.05 }}
                className={`flex items-center gap-3 rounded-xl border p-3 ${hw.status === 'overdue' ? 'border-destructive/30 bg-destructive/5' : ''}`}
              >
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${hw.status === 'overdue' ? 'bg-destructive/10 text-destructive' : 'bg-accent/10 text-accent'}`}>
                  <AlertCircle className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{hw.title}</p>
                  <p className="text-xs text-muted-foreground">{hw.subject} · Due {hw.dueDate}</p>
                </div>
                <Badge variant={hw.status === 'overdue' ? 'destructive' : 'secondary'} className="text-xs capitalize">{hw.status}</Badge>
              </motion.div>
            ))}
            {pendingHomework.length === 0 && (
              <div className="py-8 text-center text-sm text-muted-foreground">No pending homework. Great job!</div>
            )}
          </div>
        </SectionCard>

        <SectionCard title="Upcoming Exams" description="Exam schedule" delay={0.35}>
          <div className="space-y-2">
            {upcomingExams.map((exam, i) => (
              <motion.div
                key={exam.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.05 }}
                className="flex items-center gap-3 rounded-xl border p-3"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-chart-3/10">
                  <FileText className="h-4 w-4 text-chart-3" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{exam.name}</p>
                  <p className="text-xs text-muted-foreground">{exam.subject} · {exam.date} · {exam.time}</p>
                </div>
                <Badge variant="outline" className="text-xs">{exam.maxMarks} marks</Badge>
              </motion.div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
