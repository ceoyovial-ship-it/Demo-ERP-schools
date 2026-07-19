'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { CalendarCheck, Check, X, Clock } from 'lucide-react';
import { PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { PageHeader } from '@/components/page-header';
import { StatCard } from '@/components/stat-card';
import { ChartCard } from '@/components/chart-card';
import { SectionCard } from '@/components/section-card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/components/auth-provider';
import { getStudentKey, studentAttendance, studentAttendanceSummary } from '@/lib/student-data';

const selectClassStyle = 'h-9 rounded-lg border border-input bg-background px-3 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary/20';
type StatusFilter = 'all' | 'present' | 'absent' | 'late';

export default function StudentAttendancePage() {
  const { profile } = useAuth();
  const key = getStudentKey(profile?.email?.split('@')[0]);
  const records = studentAttendance[key];
  const summary = studentAttendanceSummary[key];
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [search, setSearch] = useState('');

  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      if (statusFilter !== 'all' && r.status !== statusFilter) return false;
      if (search && !r.subject.toLowerCase().includes(search.toLowerCase()) && !r.date.includes(search)) return false;
      return true;
    });
  }, [records, statusFilter, search]);

  const monthlyData = [
    { month: 'Feb', present: 20, total: 22 },
    { month: 'Mar', present: 19, total: 22 },
    { month: 'Apr', present: 21, total: 22 },
    { month: 'May', present: 20, total: 22 },
    { month: 'Jun', present: 22, total: 22 },
    { month: 'Jul', present: summary.present, total: summary.present + summary.absent + summary.late },
  ];

  const pieData = [
    { name: 'Present', value: summary.present, fill: 'hsl(var(--chart-2))' },
    { name: 'Absent', value: summary.absent, fill: 'hsl(var(--chart-5))' },
    { name: 'Late', value: summary.late, fill: 'hsl(var(--chart-3))' },
  ];

  const statusConfig = {
    present: { icon: Check, color: 'text-success', bg: 'bg-success/10', variant: 'default' as const },
    absent: { icon: X, color: 'text-destructive', bg: 'bg-destructive/10', variant: 'secondary' as const },
    late: { icon: Clock, color: 'text-accent', bg: 'bg-accent/10', variant: 'secondary' as const },
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Attendance" description="Your attendance history and statistics" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Attendance Rate" value={`${summary.percentage}%`} icon={CalendarCheck} change={summary.percentage >= 90 ? 'Excellent' : summary.percentage >= 75 ? 'Good' : 'Low'} changeType={summary.percentage >= 90 ? 'positive' : summary.percentage >= 75 ? 'neutral' : 'negative'} delay={0} />
        <StatCard title="Present" value={summary.present} icon={Check} changeType="positive" delay={0.05} />
        <StatCard title="Absent" value={summary.absent} icon={X} delay={0.1} />
        <StatCard title="Late" value={summary.late} icon={Clock} delay={0.15} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Attendance Distribution" description="This term breakdown" delay={0.1}>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label={(entry) => `${entry.name}: ${entry.value}`}>
                {pieData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: '12px', fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Monthly Attendance" description="Present vs total days" delay={0.15}>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: '12px', fontSize: '12px' }} />
              <Bar dataKey="present" fill="hsl(var(--chart-2))" radius={[6, 6, 0, 0]} name="Present" />
              <Bar dataKey="total" fill="hsl(var(--chart-4))" radius={[6, 6, 0, 0]} name="Total Days" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <SectionCard title="Attendance History" description={`${filteredRecords.length} records`} delay={0.2}>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="space-y-1.5"><Label className="text-xs text-muted-foreground">Status</Label><select className={selectClassStyle} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}><option value="all">All</option><option value="present">Present</option><option value="absent">Absent</option><option value="late">Late</option></select></div>
            <div className="space-y-1.5 sm:min-w-[200px]"><Label className="text-xs text-muted-foreground">Search</Label><Input placeholder="Search by subject or date..." value={search} onChange={(e) => setSearch(e.target.value)} className="h-9" /></div>
          </div>
        </div>
        <div className="overflow-x-auto rounded-xl border">
          <table className="w-full">
            <thead><tr className="border-b bg-muted/30 text-left text-xs font-medium text-muted-foreground"><th className="px-4 py-3">Date</th><th className="px-4 py-3">Day</th><th className="px-4 py-3">Subject</th><th className="px-4 py-3">Status</th></tr></thead>
            <tbody>
              {filteredRecords.slice(0, 20).map((r, i) => {
                const config = statusConfig[r.status];
                const StatusIcon = config.icon;
                return (
                  <motion.tr key={r.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }} className="border-b text-sm last:border-0">
                    <td className="px-4 py-3 font-medium">{r.date}</td>
                    <td className="px-4 py-3 text-muted-foreground">{r.day}</td>
                    <td className="px-4 py-3">{r.subject}</td>
                    <td className="px-4 py-3"><Badge variant={config.variant} className={`capitalize ${config.bg} ${config.color} gap-1`}><StatusIcon className="h-3 w-3" />{r.status}</Badge></td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
          {filteredRecords.length === 0 && <div className="py-12 text-center text-sm text-muted-foreground">No records found</div>}
        </div>
      </SectionCard>
    </div>
  );
}
