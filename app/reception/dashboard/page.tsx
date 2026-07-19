'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Users,
  UserPlus,
  Wallet,
  CalendarClock,
  FileText,
  ArrowUpRight,
  Clock,
  Calendar,
  Loader2,
  Megaphone,
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
import { PageHeader } from '@/components/page-header';
import { StatCard } from '@/components/stat-card';
import { ChartCard } from '@/components/chart-card';
import { SectionCard } from '@/components/section-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/components/auth-provider';
import { feeCollection } from '@/lib/mock-data';
import { admissions, visitors, feePayments, appointments } from '@/lib/reception-data';
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
import { toast } from 'sonner';

export default function ReceptionDashboard() {
  const { profile } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [showAnnounceModal, setShowAnnounceModal] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [announceForm, setAnnounceForm] = useState<Record<string, string>>({});

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  const stats = [
    { title: "Today's Visitors", value: '5', icon: Users, change: '3 checked in', changeType: 'positive' as const, delay: 0, href: '/reception/visitors' },
    { title: 'New Admissions', value: '24', icon: UserPlus, change: '+8 this week', changeType: 'positive' as const, delay: 0.05, href: '/reception/admissions' },
    { title: 'Pending Admissions', value: '5', icon: Clock, change: 'Awaiting review', changeType: 'neutral' as const, delay: 0.1, href: '/reception/admissions' },
    { title: 'Fee Collection Today', value: '₹1.25L', icon: Wallet, change: '18 receipts', changeType: 'positive' as const, delay: 0.15, href: '/reception/fee-collection' },
    { title: 'Student Enquiries', value: '56', icon: FileText, change: '+8 today', changeType: 'positive' as const, delay: 0.2, href: '/reception/admissions' },
    { title: 'Parent Appointments', value: '8', icon: CalendarClock, change: '3 today', changeType: 'neutral' as const, delay: 0.25, href: '/reception/appointments' },
  ];

  const recentAdmissions = admissions.slice(0, 5);
  const todayVisitors = visitors.filter((v) => v.date === '2025-07-15');
  const upcomingAppointments = appointments.filter((a) => a.status === 'scheduled' || a.status === 'pending').slice(0, 4);

  const quickActions = [
    { label: 'New Admission', icon: UserPlus, color: 'text-primary', href: '/reception/admissions' },
    { label: 'Collect Fee', icon: Wallet, color: 'text-success', href: '/reception/fee-collection' },
    { label: 'Add Visitor', icon: Users, color: 'text-info', href: '/reception/visitors' },
    { label: 'Schedule Appointment', icon: CalendarClock, color: 'text-accent', href: '/reception/appointments' },
  ];

  const handlePublish = () => {
    if (!announceForm.title || !announceForm.description) {
      toast.error('Please fill in title and description');
      return;
    }
    setPublishing(true);
    setTimeout(() => {
      setPublishing(false);
      setShowAnnounceModal(false);
      setAnnounceForm({});
      toast.success('Announcement Published Successfully');
    }, 1000);
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description={`Welcome, ${profile?.full_name}. Manage admissions, visitors, and fees.`}
      >
        <Button variant="outline" size="sm" className="gap-2" onClick={() => router.push('/reception/appointments')}>
          <Calendar className="h-4 w-4" />
          Calendar
        </Button>
        <Button size="sm" className="gap-2" onClick={() => setShowAnnounceModal(true)}>
          <Megaphone className="h-4 w-4" />
          Announce
        </Button>
      </PageHeader>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <motion.button
              key={s.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: s.delay }}
              onClick={() => router.push(s.href)}
              className="group text-left"
            >
              <div className="rounded-xl border bg-card p-4 shadow-premium transition-all hover:shadow-premium-lg hover:border-primary/30">
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
                <p className="mt-3 text-2xl font-bold tabular-nums">{s.value}</p>
                <p className="text-xs font-medium text-muted-foreground">{s.title}</p>
                <p className={`mt-1 text-xs ${s.changeType === 'positive' ? 'text-success' : 'text-muted-foreground'}`}>{s.change}</p>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Chart + Quick Actions */}
      <div className="grid gap-4 lg:grid-cols-3">
        <ChartCard
          title="Fee Collection"
          description="Monthly collection trend"
          className="lg:col-span-2"
          delay={0.1}
        >
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={feeCollection}>
              <defs>
                <linearGradient id="colorCollected" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${v / 1000}K`} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '12px',
                  fontSize: '12px',
                }}
                formatter={(value: number) => [`₹${value.toLocaleString('en-IN')}`, '']}
              />
              <Area type="monotone" dataKey="collected" stroke="hsl(var(--chart-1))" strokeWidth={2} fill="url(#colorCollected)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <SectionCard title="Quick Actions" delay={0.15}>
          <div className="grid gap-2">
            {quickActions.map((action, i) => {
              const Icon = action.icon;
              return (
                <motion.button
                  key={action.label}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.05 }}
                  onClick={() => router.push(action.href)}
                  className="flex items-center gap-3 rounded-lg border p-3 text-left transition-all hover:border-primary/30 hover:bg-primary/5"
                >
                  <div className={`flex h-9 w-9 items-center justify-center rounded-lg bg-muted ${action.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="flex-1 text-sm font-medium">{action.label}</span>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                </motion.button>
              );
            })}
          </div>
        </SectionCard>
      </div>

      {/* Recent Admissions + Today's Visitors */}
      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="Recent Admissions" description="Latest student enrollments" delay={0.2}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left text-xs text-muted-foreground">
                  <th className="pb-3 font-medium">Student Name</th>
                  <th className="pb-3 font-medium">Grade</th>
                  <th className="pb-3 font-medium">Date</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentAdmissions.map((student, i) => (
                  <motion.tr
                    key={student.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.25 + i * 0.03 }}
                    onClick={() => router.push(`/reception/admissions`)}
                    className="cursor-pointer border-b transition-colors hover:bg-muted/30"
                  >
                    <td className="py-3 text-sm font-medium">{student.studentName}</td>
                    <td className="py-3 text-sm text-muted-foreground">{student.grade}-{student.section}</td>
                    <td className="py-3 text-sm text-muted-foreground">{student.date}</td>
                    <td className="py-3">
                      <Badge variant={student.status === 'active' ? 'default' : student.status === 'pending' ? 'secondary' : 'destructive'} className="text-xs capitalize">
                        {student.status}
                      </Badge>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>

        <SectionCard title="Today's Visitors" description={`${todayVisitors.length} visitors today`} delay={0.25}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left text-xs text-muted-foreground">
                  <th className="pb-3 font-medium">Visitor</th>
                  <th className="pb-3 font-medium">Purpose</th>
                  <th className="pb-3 font-medium">Time</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {todayVisitors.map((visitor, i) => (
                  <motion.tr
                    key={visitor.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 + i * 0.03 }}
                    onClick={() => router.push('/reception/visitors')}
                    className="cursor-pointer border-b transition-colors hover:bg-muted/30"
                  >
                    <td className="py-3 text-sm font-medium">{visitor.visitorName}</td>
                    <td className="py-3 text-sm text-muted-foreground">{visitor.purpose}</td>
                    <td className="py-3 text-sm text-muted-foreground">{visitor.checkInTime}</td>
                    <td className="py-3">
                      <Badge variant={visitor.status === 'checked-in' ? 'default' : 'secondary'} className="text-xs">
                        {visitor.status === 'checked-in' ? 'Checked In' : 'Checked Out'}
                      </Badge>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
      </div>

      {/* Upcoming Appointments */}
      <SectionCard title="Upcoming Appointments" description="Scheduled parent meetings" delay={0.3}>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {upcomingAppointments.map((apt, i) => (
            <motion.div
              key={apt.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 + i * 0.05 }}
              onClick={() => router.push('/reception/appointments')}
              className="cursor-pointer rounded-xl border p-3 transition-all hover:border-primary/30 hover:bg-primary/5"
            >
              <div className="flex items-center gap-2">
                <CalendarClock className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">{apt.date}</span>
                <span className="text-xs text-muted-foreground">{apt.time}</span>
              </div>
              <p className="mt-2 text-sm font-medium">{apt.parentName}</p>
              <p className="text-xs text-muted-foreground">{apt.purpose}</p>
              <div className="mt-2">
                <Badge variant={apt.status === 'scheduled' ? 'default' : 'secondary'} className="text-xs capitalize">
                  {apt.status}
                </Badge>
              </div>
            </motion.div>
          ))}
        </div>
      </SectionCard>

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
