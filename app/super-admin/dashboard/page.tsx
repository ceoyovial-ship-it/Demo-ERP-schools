'use client';

import { useMemo, useState } from 'react';
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
  Building2,
  Bus,
  BadgeCheck,
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
import { DataTable } from '@/components/data-table';
import { useAuth } from '@/components/auth-provider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar as CalendarPicker } from '@/components/ui/calendar';
import { ExportButtons } from '@/components/export-buttons';
import { toast } from 'sonner';
import { superAdminMetrics, activityFeed, analyticsData, schoolData } from '@/lib/super-admin-data';

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
  Building2,
  Bus,
};

const quickActions = [
  { label: 'Add School', icon: Building2 },
  { label: 'Add Principal', icon: UserCog },
  { label: 'Add Teacher', icon: GraduationCap },
  { label: 'Add Student', icon: UserPlus },
  { label: 'Create Announcement', icon: Megaphone },
  { label: 'Backup Database', icon: CalendarCheck },
];

const tooltipStyle = {
  backgroundColor: 'hsl(var(--popover))',
  border: '1px solid hsl(var(--border))',
  borderRadius: '12px',
  fontSize: '12px',
};

const pieData = [
  { name: 'Active', value: 72 },
  { name: 'Pending', value: 18 },
  { name: 'Inactive', value: 10 },
];

const pieColors = ['#4F46E5', '#F59E0B', '#EF4444'];

export default function SuperAdminDashboardPage() {
  const { profile } = useAuth();
  const [announcementTitle, setAnnouncementTitle] = useState('');
  const [announcementBody, setAnnouncementBody] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSchool, setSelectedSchool] = useState('All Schools');

  const schoolColumns = useMemo(
    () => [
      { key: 'name', header: 'School', sortable: true },
      { key: 'city', header: 'City', sortable: true },
      { key: 'principal', header: 'Principal', sortable: true },
      { key: 'students', header: 'Students', sortable: true },
      { key: 'revenue', header: 'Revenue', sortable: true },
      {
        key: 'status',
        header: 'Status',
        sortable: true,
        render: (row: (typeof schoolData)[number]) => (
          <Badge variant={row.status === 'active' ? 'default' : 'secondary'}>
            {row.status}
          </Badge>
        ),
      },
    ],
    []
  );

  const handlePublishAnnouncement = () => {
    if (!announcementTitle.trim() || !announcementBody.trim()) {
      toast.error('Please enter the announcement title and message.');
      return;
    }

    toast.success('Announcement scheduled successfully', {
      description: `Audience: ${selectedSchool} · Title: ${announcementTitle}`,
    });
    setAnnouncementTitle('');
    setAnnouncementBody('');
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Super Admin Dashboard" description={`Welcome back, ${profile?.full_name}. Overview of all schools and network operations.`}>
        <Button variant="outline" size="sm" className="gap-2">
          <Calendar className="h-4 w-4" />
          {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </Button>
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {superAdminMetrics.map((stat, index) => {
          const Icon = iconMap[stat.icon] ?? Users;
          return (
            <StatCard
              key={stat.title}
              title={stat.title}
              value={stat.value}
              icon={Icon}
              change={stat.change}
              changeType={stat.changeType}
              delay={index * 0.03}
            />
          );
        })}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.35fr_0.9fr]">
        <ChartCard title="Student Growth Chart" description="Monthly growth across the connected school network" delay={0.06}>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analyticsData.studentGrowth}>
                <defs>
                  <linearGradient id="studentGrowthFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.45} />
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="students" stroke="#4F46E5" fill="url(#studentGrowthFill)" strokeWidth={2.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Revenue Chart" description="Monthly revenue performance by school network" delay={0.08}>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analyticsData.revenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="revenue" radius={[8, 8, 0, 0]} fill="#22C55E" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <ChartCard title="Attendance Chart" description="Network attendance coverage trend" delay={0.1}>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analyticsData.attendance}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip contentStyle={tooltipStyle} />
                <Line type="monotone" dataKey="attendance" stroke="#0EA5E9" strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Fee Collection Chart" description="Collected fees across the network" delay={0.12}>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analyticsData.feeCollection}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="collected" radius={[8, 8, 0, 0]} fill="#F59E0B" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Admissions Chart" description="Admissions received by month" delay={0.14}>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analyticsData.admissions}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="admissions" radius={[8, 8, 0, 0]} fill="#8B5CF6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <SectionCard title="Recent Activities" description="Latest admissions, teacher onboarding, fee activity, announcements, and leave requests" delay={0.16}>
          <div className="space-y-3">
            {activityFeed.map((item) => (
              <div key={item.id} className="flex items-start gap-3 rounded-xl border bg-muted/20 p-3">
                <div className="mt-0.5 rounded-lg bg-primary/10 p-2 text-primary">
                  <Bell className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold">{item.title}</p>
                    <span className="text-xs text-muted-foreground">{item.timestamp}</span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Quick Actions" description="Command center for network-wide operations" delay={0.18}>
          <div className="grid gap-3 sm:grid-cols-2">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <button key={action.label} className="rounded-xl border bg-muted/20 p-3 text-left transition-colors hover:bg-muted/40">
                  <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-4 w-4" />
                  </div>
                  <p className="text-sm font-medium">{action.label}</p>
                </button>
              );
            })}
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <SectionCard title="Notifications" description="Priority alerts across operating schools" delay={0.2}>
          <div className="space-y-2">
            {['3 fee follow-ups pending', '1 school branding change requires review', '2 urgent transport route checks'].map((note) => (
              <div key={note} className="rounded-lg border bg-background px-3 py-2 text-sm text-muted-foreground">{note}</div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Calendar" description="Operation dates for the network" delay={0.22}>
          <div className="grid gap-3 lg:grid-cols-[1fr_280px]">
            <CalendarPicker mode="single" selected={selectedDate} onSelect={(date) => date instanceof Date && setSelectedDate(date)} className="rounded-md border-0" />
            <div className="rounded-xl border bg-muted/20 p-3 text-sm text-muted-foreground">
              <p className="font-semibold text-foreground">Agenda</p>
              <div className="mt-2 space-y-2">
                <div className="rounded-lg border bg-background p-2">Board meeting · 10:00 AM</div>
                <div className="rounded-lg border bg-background p-2">Principal sync · 2:30 PM</div>
              </div>
            </div>
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Recent Logs" description="Latest activity records across the ERP" delay={0.24}>
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl border bg-muted/20 p-3">
            <p className="mb-2 text-sm font-semibold">Latest System Events</p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="rounded-lg border bg-background px-3 py-2">Backup completed successfully at 03:12 AM</div>
              <div className="rounded-lg border bg-background px-3 py-2">New school onboarding approved for Pune branch</div>
            </div>
          </div>
          <div className="rounded-xl border bg-muted/20 p-3">
            <p className="mb-2 text-sm font-semibold">Network Health</p>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={42} outerRadius={72} paddingAngle={3}>
                    {pieData.map((entry, index) => (
                      <Cell key={entry.name} fill={pieColors[index]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Network School Overview" description="Live school summary table" delay={0.26}>
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Label className="text-sm font-medium">School</Label>
            <select value={selectedSchool} onChange={(e) => setSelectedSchool(e.target.value)} className="h-9 rounded-lg border border-input bg-background px-3 text-sm">
              <option>All Schools</option>
              <option>Yovial International School</option>
              <option>Yovial Academy</option>
            </select>
            <ExportButtons label="Schools" data={schoolData as unknown as Record<string, unknown>[]} columns={schoolColumns as unknown as any[]} filename="super-admin-schools" />
          </div>
          <DataTable
            data={schoolData}
            columns={schoolColumns}
            pageSize={4}
            searchKeys={['name', 'city', 'principal']}
            searchPlaceholder="Search schools"
            emptyMessage="No schools found"
          />
        </div>
      </SectionCard>

      <SectionCard title="Create Announcement" description="Publish a network-wide message" delay={0.28}>
        <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input value={announcementTitle} onChange={(e) => setAnnouncementTitle(e.target.value)} placeholder="Quarterly network briefing" />
          </div>
          <div className="space-y-2">
            <Label>Audience</Label>
            <select value={selectedSchool} onChange={(e) => setSelectedSchool(e.target.value)} className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm">
              <option>All Schools</option>
              <option>Principals</option>
              <option>Teachers</option>
              <option>Parents</option>
            </select>
          </div>
          <div className="space-y-2 lg:col-span-2">
            <Label>Message</Label>
            <Textarea rows={4} value={announcementBody} onChange={(e) => setAnnouncementBody(e.target.value)} placeholder="Enter the announcement content here" />
          </div>
          <div className="lg:col-span-2 flex justify-end">
            <Button onClick={handlePublishAnnouncement}>Publish Announcement</Button>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
