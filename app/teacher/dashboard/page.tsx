'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  CalendarCheck,
  ClipboardList,
  BookOpen,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  Bell,
  Mail,
  TrendingUp,
  FileText,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/page-header';
import { StatCard } from '@/components/stat-card';
import { ChartCard } from '@/components/chart-card';
import { SectionCard } from '@/components/section-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/components/auth-provider';
import {
  teacherClasses,
  teacherStats,
  teacherClassPerformance,
  teacherWeeklyAttendance,
  homeworkList,
  upcomingExams,
  teacherNotifications,
} from '@/lib/teacher-data';

export default function TeacherDashboard() {
  const { profile } = useAuth();
  const router = useRouter();
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);

  const todayClasses = teacherClasses.filter((c) => c.day === 'Mon');
  const activeHomework = homeworkList.filter((h) => h.status === 'active');
  const unreadNotifs = teacherNotifications.filter((n) => !n.read);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description={`Welcome back, ${profile?.full_name ?? 'Teacher'}. You have ${todayClasses.length} classes today.`}
      >
        <Button variant="outline" size="sm" className="gap-2" onClick={() => router.push('/teacher/attendance')}>
          <CalendarCheck className="h-4 w-4" />
          Mark Attendance
        </Button>
        <Button size="sm" className="gap-2" onClick={() => router.push('/teacher/homework')}>
          <Plus className="h-4 w-4" />
          New Homework
        </Button>
      </PageHeader>

      {/* Welcome Card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6 shadow-premium"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold">Good morning, {profile?.full_name?.split(' ')[0] ?? 'Teacher'}!</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              You teach Mathematics & Science across 4 classes with 92 students total.
              {teacherStats.pendingLeaveRequests > 0 && ` ${teacherStats.pendingLeaveRequests} leave requests need your attention.`}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-xl border bg-card/80 px-4 py-2 backdrop-blur">
              <p className="text-2xl font-bold text-primary">{teacherStats.performance}%</p>
              <p className="text-xs text-muted-foreground">Performance</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Classes" value={teacherStats.totalClasses} icon={BookOpen} delay={0} />
        <StatCard title="Total Students" value={teacherStats.totalStudents} icon={Users} delay={0.05} />
        <StatCard title="Today's Attendance Pending" value={Math.max(teacherStats.totalStudents - teacherStats.todayAttendance, 0)} icon={CalendarCheck} change="Mark remaining attendance" changeType="neutral" delay={0.1} />
        <StatCard title="Assignments Pending Review" value={teacherStats.pendingHomework} icon={ClipboardList} change="3 due this week" changeType="neutral" delay={0.15} />
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Class Performance" description="Average vs top scores by class" delay={0.1}>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={teacherClassPerformance} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
              <XAxis type="number" domain={[0, 100]} stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis type="category" dataKey="subject" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} width={80} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '12px',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="avg" fill="hsl(var(--chart-1))" radius={[0, 6, 6, 0]} name="Class Average" />
              <Bar dataKey="top" fill="hsl(var(--chart-2))" radius={[0, 6, 6, 0]} name="Top Score" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Weekly Attendance" description="Present vs absent this week" delay={0.15}>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={teacherWeeklyAttendance}>
              <defs>
                <linearGradient id="colorPresent" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '12px',
                  fontSize: '12px',
                }}
              />
              <Area type="monotone" dataKey="present" stroke="hsl(var(--chart-2))" strokeWidth={2} fill="url(#colorPresent)" name="Present" />
              <Area type="monotone" dataKey="absent" stroke="hsl(var(--chart-5))" strokeWidth={2} fill="hsl(var(--chart-5))" fillOpacity={0.1} name="Absent" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Today's Classes + Notifications */}
      <div className="grid gap-4 lg:grid-cols-3">
        <SectionCard title="Today's Classes" description="Your scheduled classes" delay={0.2} className="lg:col-span-2">
          <div className="space-y-2">
            {todayClasses.map((cls, i) => (
              <motion.div
                key={cls.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 + i * 0.05 }}
                className="flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition-all hover:border-primary/30 hover:shadow-premium"
                onClick={() => router.push('/teacher/my-classes')}
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{cls.name}</p>
                  <p className="text-xs text-muted-foreground">{cls.time} · Room {cls.room} · {cls.students} students</p>
                </div>
                <Badge variant="secondary" className="text-xs">Scheduled</Badge>
              </motion.div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Notifications" description={`${unreadNotifs.length} unread`} delay={0.25}>
          <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
            {teacherNotifications.map((n, i) => (
              <motion.div
                key={n.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.05 }}
                className={`flex items-start gap-3 rounded-xl border p-3 ${!n.read ? 'border-primary/30 bg-primary/5' : ''}`}
              >
                <div className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${!n.read ? 'bg-primary/15' : 'bg-muted'}`}>
                  {n.type === 'leave' ? <ClipboardList className="h-3.5 w-3.5 text-primary" /> : n.type === 'message' ? <Mail className="h-3.5 w-3.5 text-primary" /> : n.type === 'homework' ? <BookOpen className="h-3.5 w-3.5 text-primary" /> : <Bell className="h-3.5 w-3.5 text-muted-foreground" />}
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

      {/* Pending Homework + Upcoming Exams */}
      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="Pending Homework" description="Active homework assignments" delay={0.3}>
          <div className="space-y-2">
            {activeHomework.slice(0, 4).map((hw, i) => (
              <motion.div
                key={hw.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 + i * 0.05 }}
                className="flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition-all hover:border-primary/30"
                onClick={() => router.push('/teacher/homework')}
              >
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${hw.submissions === hw.totalStudents ? 'bg-success/10' : 'bg-accent/10'}`}>
                  {hw.submissions === hw.totalStudents ? (
                    <CheckCircle2 className="h-5 w-5 text-success" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-accent" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{hw.title}</p>
                  <p className="text-xs text-muted-foreground">{hw.subject} · Grade {hw.classGrade}-{hw.section} · Due {hw.dueDate}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">{hw.submissions}/{hw.totalStudents}</p>
                  <p className="text-xs text-muted-foreground">submitted</p>
                </div>
              </motion.div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Upcoming Exams" description="Exams you need to prepare" delay={0.35}>
          <div className="space-y-2">
            {upcomingExams.map((exam, i) => (
              <motion.div
                key={exam.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.05 }}
                className="flex items-center gap-4 rounded-xl border p-4"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-chart-3/10">
                  <FileText className="h-5 w-5 text-chart-3" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{exam.name}</p>
                  <p className="text-xs text-muted-foreground">{exam.subject} · Grade {exam.classGrade} · {exam.date}</p>
                </div>
                <Button size="sm" variant="outline" onClick={() => router.push('/teacher/marks-grades')}>
                  <TrendingUp className="h-3.5 w-3.5" />
                </Button>
              </motion.div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
