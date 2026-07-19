'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  GraduationCap,
  Wallet,
  CalendarCheck,
  Bell,
  Calendar,
  Clock,
  UserCog,
  Briefcase,
  TrendingUp,
  UserPlus,
  ClipboardList,
  BookOpen,
  Megaphone,
  Loader2,
  type LucideIcon,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { PageHeader } from '@/components/page-header';
import { StatCard } from '@/components/stat-card';
import { ChartCard } from '@/components/chart-card';
import { SectionCard } from '@/components/section-card';
import { AiInsightsPanel } from '@/components/ai-insights-panel';
import { RightSidebar } from '@/components/right-sidebar';
import { useAuth } from '@/components/auth-provider';
import { Badge } from '@/components/ui/badge';
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
import { Calendar as CalendarPicker } from '@/components/ui/calendar';
import { QuickActionModals, type QuickActionType } from '@/components/topbar/quick-action-modals';
import {
  enrollmentTrend,
  attendanceTrend,
  feeCollection,
  gradeDistribution,
  admissionAnalytics,
  classPerformance,
  teacherPerformance,
  monthlyRevenue,
  activityTimeline,
} from '@/lib/mock-data';
import { toast } from 'sonner';

const iconMap: Record<string, LucideIcon> = {
  Users,
  GraduationCap,
  UserCog,
  Briefcase,
  CalendarCheck,
  Wallet,
  TrendingUp,
  UserPlus,
  ClipboardList,
  BookOpen,
  Megaphone,
  Calendar,
};

const stats = [
  { title: 'Total Students', value: '948', icon: 'Users', change: '+2.1%', changeType: 'positive' as const },
  { title: 'Total Teachers', value: '58', icon: 'GraduationCap', change: '+3 new', changeType: 'positive' as const },
  { title: 'Total Parents', value: '892', icon: 'UserCog', change: '+18', changeType: 'positive' as const },
  { title: 'Total Staff', value: '34', icon: 'Briefcase', change: 'No change', changeType: 'neutral' as const },
  { title: "Today's Attendance", value: '94.8%', icon: 'CalendarCheck', change: '-0.3%', changeType: 'negative' as const },
  { title: 'Pending Fees', value: '₹1.5L', icon: 'Wallet', change: '42 students', changeType: 'negative' as const },
  { title: 'Monthly Revenue', value: '₹5.35L', icon: 'TrendingUp', change: '+4.5%', changeType: 'positive' as const },
  { title: 'Admissions', value: '48', icon: 'UserPlus', change: '+12 this month', changeType: 'positive' as const },
  { title: 'Upcoming Exams', value: '6', icon: 'ClipboardList', change: 'Next: Jul 20', changeType: 'neutral' as const },
  { title: 'Homework Pending', value: '23', icon: 'BookOpen', change: '8 overdue', changeType: 'negative' as const },
  { title: 'Announcements', value: '4', icon: 'Megaphone', change: '2 this week', changeType: 'neutral' as const },
  { title: 'Events', value: '7', icon: 'Calendar', change: 'Next: Jul 18', changeType: 'neutral' as const },
];

const quickActions = [
  { label: 'Add Student', icon: UserPlus, color: 'text-primary', bg: 'bg-primary/10' },
  { label: 'Add Teacher', icon: GraduationCap, color: 'text-success', bg: 'bg-success/10' },
  { label: 'Create Exam', icon: ClipboardList, color: 'text-accent', bg: 'bg-accent/10' },
  { label: 'Collect Fee', icon: Wallet, color: 'text-info', bg: 'bg-info/10' },
  { label: 'Send Announcement', icon: Megaphone, color: 'text-chart-4', bg: 'bg-chart-4/10' },
  { label: 'Generate Report', icon: ClipboardList, color: 'text-destructive', bg: 'bg-destructive/10' },
];

const activityIconMap: Record<string, LucideIcon> = {
  CalendarCheck,
  Wallet,
  UserPlus,
  ClipboardList,
  BookOpen,
  Calendar,
};

const activityColors: Record<string, string> = {
  attendance: 'bg-chart-2/10 text-chart-2',
  fee: 'bg-chart-1/10 text-chart-1',
  admission: 'bg-primary/10 text-primary',
  exam: 'bg-accent/10 text-accent',
  homework: 'bg-chart-4/10 text-chart-4',
  leave: 'bg-muted text-muted-foreground',
};

const tooltipStyle = {
  backgroundColor: 'hsl(var(--popover))',
  border: '1px solid hsl(var(--border))',
  borderRadius: '12px',
  fontSize: '12px',
};

export default function PrincipalDashboard() {
  const { profile } = useAuth();
  const [showAnnounceModal, setShowAnnounceModal] = useState(false);
  const [announceForm, setAnnounceForm] = useState<Record<string, string>>({});
  const [publishing, setPublishing] = useState(false);
  const [announcementCount, setAnnouncementCount] = useState(4);
  const [quickActionModal, setQuickActionModal] = useState<QuickActionType | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [schoolEvents, setSchoolEvents] = useState<Record<string, string[]>>({
    '2025-07-18': ['Parent-Teacher Meeting · 10:00 AM · Main Hall'],
    '2025-07-25': ['Annual Sports Day · 8:00 AM · School Ground'],
    '2025-08-02': ['Science Exhibition · 11:00 AM · Science Lab'],
  });

  const handlePublish = () => {
    if (!announceForm.title || !announceForm.description) {
      toast.error('Please fill in title and description');
      return;
    }
    setPublishing(true);
    setTimeout(() => {
      setPublishing(false);
      setShowAnnounceModal(false);
      setAnnouncementCount((c) => c + 1);
      setAnnounceForm({});
      toast.success('Announcement Published Successfully', {
        description: `Sent to ${announceForm.target || 'All'} · ${announceForm.priority || 'Normal'} priority`,
      });
    }, 1000);
  };

  const selectedDateKey = selectedDate.toISOString().split('T')[0];
  const selectedDateEvents = schoolEvents[selectedDateKey] ?? [];

  const handleAddEvent = (event: Record<string, string>) => {
    const date = event.date ? new Date(event.date).toISOString().split('T')[0] : selectedDateKey;
    const label = `${event.title} · ${event.time || 'All day'} · ${event.location || 'School'}`;
    setSchoolEvents((prev) => ({
      ...prev,
      [date]: [...(prev[date] ?? []), label],
    }));
    setSelectedDate(new Date(date));
    toast.success('Event added to the calendar');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description={`Welcome back, ${profile?.full_name}. Here's what's happening at Yovial School today.`}
      >
        <Button variant="outline" size="sm" className="gap-2">
          <Calendar className="h-4 w-4" />
          Jul 14, 2025
        </Button>
        <Button size="sm" className="gap-2" onClick={() => setShowAnnounceModal(true)}>
          <Megaphone className="h-4 w-4" />
          Announce
        </Button>
      </PageHeader>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {stats.map((stat, i) => {
          const Icon = iconMap[stat.icon];
          return (
            <StatCard
              key={stat.title}
              title={stat.title}
              value={stat.value}
              icon={Icon}
              change={stat.change}
              changeType={stat.changeType}
              delay={i * 0.03}
            />
          );
        })}
      </div>

      <SectionCard title="School Calendar" description="Review key dates and manage demo events" delay={0.08}>
        <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
          <div className="rounded-xl border p-3">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setSelectedDate(new Date())}>Today</Button>
              <Button variant="outline" size="sm" onClick={() => setQuickActionModal('add-event')}>Add Event</Button>
            </div>
            <CalendarPicker
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date instanceof Date && setSelectedDate(date)}
              className="rounded-md border-0"
            />
          </div>
          <div className="rounded-xl border bg-muted/20 p-3">
            <p className="mb-2 text-sm font-semibold">Events for {selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
            <div className="space-y-2">
              {selectedDateEvents.length === 0 ? (
                <p className="text-sm text-muted-foreground">No demo events scheduled for this date.</p>
              ) : (
                selectedDateEvents.map((event) => (
                  <div key={event} className="rounded-lg border bg-background px-3 py-2 text-sm text-muted-foreground">
                    {event}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </SectionCard>

      <QuickActionModals
        openModal={quickActionModal}
        onClose={() => setQuickActionModal(null)}
        onEventAdded={handleAddEvent}
      />

      {/* Quick Actions */}
      <SectionCard title="Quick Actions" description="Common administrative tasks" delay={0.1}>
        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {quickActions.map((action, i) => {
            const Icon = action.icon;
            return (
              <motion.button
                key={action.label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.04 }}
                onClick={() => toast.success(`${action.label} — opening form...`)}
                className="group flex flex-col items-center gap-2 rounded-xl border p-4 transition-all hover:border-primary/30 hover:shadow-premium"
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${action.bg} transition-transform group-hover:scale-110`}>
                  <Icon className={`h-5 w-5 ${action.color}`} />
                </div>
                <span className="text-xs font-medium">{action.label}</span>
              </motion.button>
            );
          })}
        </div>
      </SectionCard>

      {/* Charts row 1: Student Growth + Attendance Trend */}
      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard
          title="Student Growth"
          description="Enrollment trend over the academic year"
          delay={0.1}
        >
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={enrollmentTrend}>
              <defs>
                <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorTeachers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-3))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--chart-3))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px' }} />
              <Area type="monotone" dataKey="students" stroke="hsl(var(--chart-1))" strokeWidth={2} fill="url(#colorStudents)" name="Students" />
              <Area type="monotone" dataKey="teachers" stroke="hsl(var(--chart-3))" strokeWidth={2} fill="url(#colorTeachers)" name="Teachers" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Attendance Trend"
          description="Present vs absent this week"
          delay={0.15}
        >
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={attendanceTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px' }} />
              <Bar dataKey="present" stackId="a" fill="hsl(var(--chart-2))" radius={[0, 0, 0, 0]} name="Present" />
              <Bar dataKey="absent" stackId="a" fill="hsl(var(--chart-5))" radius={[6, 6, 0, 0]} name="Absent" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Charts row 2: Fee Collection + Admission Analytics */}
      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard
          title="Fee Collection"
          description="Collected vs pending (in ₹)"
          delay={0.1}
        >
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={feeCollection}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${v / 1000}K`} />
              <Tooltip contentStyle={tooltipStyle} formatter={(value: number) => [`₹${value.toLocaleString('en-IN')}`, '']} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px' }} />
              <Bar dataKey="collected" fill="hsl(var(--chart-1))" radius={[6, 6, 0, 0]} name="Collected" />
              <Bar dataKey="pending" fill="hsl(var(--chart-5))" radius={[6, 6, 0, 0]} name="Pending" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Admission Analytics"
          description="Inquiries vs admissions over time"
          delay={0.15}
        >
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={admissionAnalytics}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px' }} />
              <Line type="monotone" dataKey="inquiries" stroke="hsl(var(--chart-4))" strokeWidth={2} dot={{ r: 4 }} name="Inquiries" />
              <Line type="monotone" dataKey="admissions" stroke="hsl(var(--chart-1))" strokeWidth={2} dot={{ r: 4 }} name="Admissions" />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Charts row 3: Class Performance + Teacher Performance */}
      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard
          title="Class Performance"
          description="Average marks by class"
          delay={0.1}
        >
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={classPerformance} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
              <XAxis type="number" domain={[70, 100]} stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis type="category" dataKey="class" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} width={40} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="avg" fill="hsl(var(--chart-1))" radius={[0, 6, 6, 0]} name="Avg Marks" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Teacher Performance"
          description="Performance scores across faculty"
          delay={0.15}
        >
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={teacherPerformance} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
              <XAxis type="number" domain={[70, 100]} stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis type="category" dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} width={90} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="score" radius={[0, 6, 6, 0]} name="Performance Score">
                {teacherPerformance.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.score >= 90 ? 'hsl(var(--chart-2))' : entry.score >= 85 ? 'hsl(var(--chart-1))' : 'hsl(var(--chart-3))'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Revenue breakdown */}
      <ChartCard
        title="Monthly Revenue Breakdown"
        description="Revenue by category over time (in ₹)"
        delay={0.1}
      >
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={monthlyRevenue}>
            <defs>
              <linearGradient id="colorTuition" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorTransport" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-3))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--chart-3))" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorHostel" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-4))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--chart-4))" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorLab" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-5))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--chart-5))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${v / 1000}K`} />
            <Tooltip contentStyle={tooltipStyle} formatter={(value: number) => [`₹${value.toLocaleString('en-IN')}`, '']} />
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px' }} />
            <Area type="monotone" dataKey="tuition" stroke="hsl(var(--chart-1))" strokeWidth={2} fill="url(#colorTuition)" name="Tuition" />
            <Area type="monotone" dataKey="transport" stroke="hsl(var(--chart-3))" strokeWidth={2} fill="url(#colorTransport)" name="Transport" />
            <Area type="monotone" dataKey="hostel" stroke="hsl(var(--chart-4))" strokeWidth={2} fill="url(#colorHostel)" name="Hostel" />
            <Area type="monotone" dataKey="lab" stroke="hsl(var(--chart-5))" strokeWidth={2} fill="url(#colorLab)" name="Lab" />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Grade Distribution + Recent Activity Timeline */}
      <div className="grid gap-4 lg:grid-cols-3">
        <ChartCard
          title="Grade Distribution"
          description="Current term results"
          delay={0.1}
        >
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={gradeDistribution}
                dataKey="count"
                nameKey="grade"
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={80}
                paddingAngle={3}
              >
                {gradeDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-3 flex flex-wrap justify-center gap-3">
            {gradeDistribution.map((g) => (
              <div key={g.grade} className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: g.fill }} />
                <span className="text-xs text-muted-foreground">{g.grade} ({g.count})</span>
              </div>
            ))}
          </div>
        </ChartCard>

        {/* Recent Activity Timeline */}
        <SectionCard
          title="Recent Activity"
          description="Latest events across the school"
          className="lg:col-span-2"
          delay={0.15}
        >
          <div className="relative space-y-1">
            {/* Timeline line */}
            <div className="absolute left-[15px] top-3 bottom-3 w-px bg-border" />

            {activityTimeline.map((activity, i) => {
              const Icon = activityIconMap[activity.icon] ?? Bell;
              const colorClass = activityColors[activity.type] ?? 'bg-muted text-muted-foreground';
              return (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.05 }}
                  className="relative flex items-start gap-3 py-2"
                >
                  <div className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-background ${colorClass}`}>
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex-1 min-w-0 pt-0.5">
                    <p className="text-sm font-medium leading-tight">{activity.title}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{activity.detail}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </SectionCard>
      </div>

      {/* AI Insights + Right Sidebar */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AiInsightsPanel />
        </div>
        <div className="lg:col-span-1">
          <RightSidebar />
        </div>
      </div>

      {/* Announcement Modal */}
      <Dialog open={showAnnounceModal} onOpenChange={setShowAnnounceModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create Announcement</DialogTitle>
            <DialogDescription>Publish an announcement to your school community.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="space-y-1.5">
              <Label>Title</Label>
              <Input
                value={announceForm.title ?? ''}
                onChange={(e) => setAnnounceForm({ ...announceForm, title: e.target.value })}
                placeholder="e.g. Parent-Teacher Meeting on Friday"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Textarea
                value={announceForm.description ?? ''}
                onChange={(e) => setAnnounceForm({ ...announceForm, description: e.target.value })}
                placeholder="Enter announcement details..."
                rows={4}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Target Audience</Label>
                <select
                  className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-primary"
                  value={announceForm.target ?? 'All'}
                  onChange={(e) => setAnnounceForm({ ...announceForm, target: e.target.value })}
                >
                  <option>All</option>
                  <option>Students</option>
                  <option>Teachers</option>
                  <option>Parents</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <Label>Priority</Label>
                <select
                  className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-primary"
                  value={announceForm.priority ?? 'Normal'}
                  onChange={(e) => setAnnounceForm({ ...announceForm, priority: e.target.value })}
                >
                  <option>Normal</option>
                  <option>Important</option>
                  <option>Emergency</option>
                </select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Schedule (Optional)</Label>
              <Input
                type="datetime-local"
                value={announceForm.schedule ?? ''}
                onChange={(e) => setAnnounceForm({ ...announceForm, schedule: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAnnounceModal(false)}>Cancel</Button>
            <Button onClick={handlePublish} disabled={publishing}>
              {publishing ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Publishing...</>
              ) : (
                'Publish'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
