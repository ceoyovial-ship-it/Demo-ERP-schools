'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  CalendarCheck,
  TrendingUp,
  Wallet,
  MessageSquare,
  Award,
  Clock,
  ArrowUpRight,
  CheckCircle2,
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
} from 'recharts';
import { PageHeader } from '@/components/page-header';
import { StatCard } from '@/components/stat-card';
import { ChartCard } from '@/components/chart-card';
import { SectionCard } from '@/components/section-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/auth-provider';
import { studentAttendance, studentMarks, childrenData } from '@/lib/mock-data';

const attendanceData = studentAttendance.map((d) => ({
  month: d.month,
  rate: Math.round((d.present / d.total) * 100),
}));

const marksData = studentMarks.map((m) => ({
  subject: m.subject.split(' ')[0],
  marks: m.marks,
}));

const messages = [
  { id: 1, from: 'Anjali Reddy (Mathematics)', preview: 'Rahul is performing excellently in algebra...', time: '2 hours ago', unread: true },
  { id: 2, from: 'School Office', preview: 'Parent-teacher meeting scheduled for July 18...', time: '5 hours ago', unread: true },
  { id: 3, from: 'Rajesh Kumar (Science)', preview: 'Science exhibition participation confirmed...', time: '1 day ago', unread: false },
];

const feeRecords = [
  { id: 1, type: 'Tuition Fee - Q2', amount: 45000, status: 'paid', dueDate: 'Jul 01, 2025' },
  { id: 2, type: 'Lab Fee', amount: 5000, status: 'pending', dueDate: 'Jul 31, 2025' },
  { id: 3, type: 'Transport Fee', amount: 8000, status: 'pending', dueDate: 'Aug 01, 2025' },
];

export default function ParentDashboard() {
  const { profile } = useAuth();
  const router = useRouter();
  const child = childrenData[0];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description={`Welcome, ${profile?.full_name}. Here's an overview of ${child.name}'s progress.`}
      >
        <Button variant="outline" size="sm" className="gap-2" onClick={() => router.push('/parent/messages')}>
          <MessageSquare className="h-4 w-4" />
          Message Teacher
        </Button>
      </PageHeader>

      {/* Child overview card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="rounded-2xl border bg-card p-6 shadow-premium"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-lg font-bold text-primary">
              {child.name.split(' ').map((n) => n[0]).join('')}
            </div>
            <div>
              <p className="text-lg font-semibold">{child.name}</p>
              <p className="text-sm text-muted-foreground">Grade {child.grade} · Roll No. {child.roll}</p>
            </div>
          </div>
          <div className="flex gap-6">
            <div>
              <p className="text-xs text-muted-foreground">Attendance</p>
              <p className="text-lg font-bold text-success">{child.attendance}%</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Avg Marks</p>
              <p className="text-lg font-bold text-primary">{child.avgMarks}%</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Pending Fees</p>
              <p className="text-lg font-bold text-accent">₹{child.pendingFees.toLocaleString('en-IN')}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Attendance" value="94.6%" icon={CalendarCheck} change="Above average" changeType="positive" delay={0} />
        <StatCard title="Average Marks" value="87.5%" icon={TrendingUp} change="+3.2% improvement" changeType="positive" delay={0.05} />
        <StatCard title="Class Rank" value="12th" icon={Award} change="Out of 32 students" changeType="positive" delay={0.1} />
        <StatCard title="Pending Fees" value="₹13K" icon={Wallet} change="Due Jul 31" changeType="negative" delay={0.15} />
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Attendance Trend" description="Monthly attendance rate" delay={0.1}>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={attendanceData}>
              <defs>
                <linearGradient id="colorAtt" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis domain={[80, 100]} stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '12px',
                  fontSize: '12px',
                }}
              />
              <Area type="monotone" dataKey="rate" stroke="hsl(var(--chart-2))" strokeWidth={2} fill="url(#colorAtt)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Subject Performance" description="Marks across subjects" delay={0.15}>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={marksData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="subject" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis domain={[0, 100]} stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '12px',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="marks" fill="hsl(var(--chart-1))" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Messages + Fees */}
      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="Recent Messages" description="Communication from teachers" delay={0.2}>
          <div className="space-y-2">
            {messages.map((msg, i) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 + i * 0.05 }}
                className="flex items-start gap-3 rounded-xl border p-3 transition-all hover:border-primary/30"
              >
                <div className="relative mt-0.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                    <MessageSquare className="h-4 w-4 text-primary" />
                  </div>
                  {msg.unread && <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-primary border-2 border-card" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{msg.from}</p>
                  <p className="text-xs text-muted-foreground line-clamp-1">{msg.preview}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{msg.time}</p>
                </div>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
              </motion.div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Fee Status" description="Payment records" delay={0.25}>
          <div className="space-y-2">
            {feeRecords.map((fee, i) => (
              <motion.div
                key={fee.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.05 }}
                className="flex items-center gap-3 rounded-xl border p-3"
              >
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                  fee.status === 'paid' ? 'bg-success/10 text-success' : 'bg-accent/10 text-accent'
                }`}>
                  {fee.status === 'paid' ? <CheckCircle2 className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{fee.type}</p>
                  <p className="text-xs text-muted-foreground">Due {fee.dueDate}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">₹{fee.amount.toLocaleString('en-IN')}</p>
                  <Badge variant={fee.status === 'paid' ? 'default' : 'secondary'} className="text-xs">
                    {fee.status}
                  </Badge>
                </div>
              </motion.div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
