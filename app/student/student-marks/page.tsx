'use client';

import { motion } from 'framer-motion';
import { ClipboardList, TrendingUp, Award } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { PageHeader } from '@/components/page-header';
import { StatCard } from '@/components/stat-card';
import { ChartCard } from '@/components/chart-card';
import { SectionCard } from '@/components/section-card';
import { Badge } from '@/components/ui/badge';
import { ExportButtons } from '@/components/export-buttons';
import { useAuth } from '@/components/auth-provider';
import { getStudentKey, studentMarks, studentSubjectComparison, studentMarksTrend } from '@/lib/student-data';
import type { ExportColumn } from '@/lib/export-utils';

export default function StudentMarksPage() {
  const { profile } = useAuth();
  const key = getStudentKey(profile?.email?.split('@')[0]);
  const marks = studentMarks[key];
  const comparison = studentSubjectComparison[key];
  const trend = studentMarksTrend[key];

  const avgMarks = Math.round(marks.reduce((sum, m) => sum + m.obtainedMarks, 0) / marks.length);
  const topScore = Math.max(...marks.map((m) => m.obtainedMarks));
  const topSubject = marks.find((m) => m.obtainedMarks === topScore)?.subject ?? '—';

  const exportColumns: ExportColumn[] = [
    { key: 'subject', label: 'Subject' },
    { key: 'examName', label: 'Exam' },
    { key: 'obtainedMarks', label: 'Marks' },
    { key: 'maxMarks', label: 'Max Marks' },
    { key: 'grade', label: 'Grade' },
    { key: 'date', label: 'Date' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Marks & Grades" description="Your academic performance across subjects">
        <ExportButtons label="marks" data={marks as unknown as Record<string, unknown>[]} columns={exportColumns} filename="my-marks" />
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Average" value={`${avgMarks}%`} icon={TrendingUp} change={avgMarks >= 80 ? 'Very good' : avgMarks >= 60 ? 'Average' : 'Below average'} changeType={avgMarks >= 80 ? 'positive' : avgMarks >= 60 ? 'neutral' : 'negative'} delay={0} />
        <StatCard title="Top Score" value={topScore} icon={Award} change={topSubject} changeType="positive" delay={0.05} />
        <StatCard title="Subjects" value={marks.length} icon={ClipboardList} delay={0.1} />
        <StatCard title="Best Grade" value={marks.find((m) => m.grade === 'A+') ? 'A+' : marks.find((m) => m.grade === 'A') ? 'A' : 'B'} icon={Award} delay={0.15} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Subject-wise Marks" description="Your marks vs class average" delay={0.1}>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={comparison}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="subject" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis domain={[0, 100]} stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: '12px', fontSize: '12px' }} />
              <Bar dataKey="marks" fill="hsl(var(--chart-1))" radius={[6, 6, 0, 0]} name="Your Marks" />
              <Bar dataKey="avg" fill="hsl(var(--chart-4))" radius={[6, 6, 0, 0]} name="Class Average" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Marks Trend" description="Monthly progress" delay={0.15}>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={trend}>
              <defs>
                <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis domain={[0, 100]} stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: '12px', fontSize: '12px' }} />
              <Area type="monotone" dataKey="marks" stroke="hsl(var(--chart-1))" strokeWidth={2} fill="url(#colorTrend)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <SectionCard title="Subject-wise Marks" description="Detailed marks breakdown" delay={0.2}>
        <div className="overflow-x-auto rounded-xl border">
          <table className="w-full">
            <thead><tr className="border-b bg-muted/30 text-left text-xs font-medium text-muted-foreground"><th className="px-4 py-3">Subject</th><th className="px-4 py-3">Exam</th><th className="px-4 py-3 text-center">Marks</th><th className="px-4 py-3 text-center">Max</th><th className="px-4 py-3 text-center">Grade</th><th className="px-4 py-3">Date</th></tr></thead>
            <tbody>
              {marks.map((m, i) => (
                <motion.tr key={m.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="border-b text-sm last:border-0">
                  <td className="px-4 py-3 font-medium">{m.subject}</td>
                  <td className="px-4 py-3 text-muted-foreground">{m.examName}</td>
                  <td className="px-4 py-3 text-center font-semibold">{m.obtainedMarks}</td>
                  <td className="px-4 py-3 text-center text-muted-foreground">{m.maxMarks}</td>
                  <td className="px-4 py-3 text-center"><Badge variant="secondary" className={m.grade.startsWith('A') ? 'bg-success/10 text-success' : m.grade === 'B' ? 'bg-primary/10 text-primary' : m.grade === 'C' ? 'bg-accent/10 text-accent' : 'bg-destructive/10 text-destructive'}>{m.grade}</Badge></td>
                  <td className="px-4 py-3 text-muted-foreground">{m.date}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}
