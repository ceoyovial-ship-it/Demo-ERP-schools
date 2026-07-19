'use client';

import { motion } from 'framer-motion';
import { FileBarChart, TrendingUp, Users, Award, Download } from 'lucide-react';
import {
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
import { toast } from 'sonner';
import { PageHeader } from '@/components/page-header';
import { StatCard } from '@/components/stat-card';
import { ChartCard } from '@/components/chart-card';
import { SectionCard } from '@/components/section-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExportButtons } from '@/components/export-buttons';
import { teacherClassPerformance, teacherWeeklyAttendance, marksEntriesData, classStudents } from '@/lib/teacher-data';
import type { ExportColumn } from '@/lib/export-utils';

const gradeDistribution = [
  { grade: 'A+', count: 8, fill: 'hsl(var(--chart-2))' },
  { grade: 'A', count: 12, fill: 'hsl(var(--chart-1))' },
  { grade: 'B', count: 7, fill: 'hsl(var(--chart-3))' },
  { grade: 'C', count: 3, fill: 'hsl(var(--chart-4))' },
  { grade: 'D', count: 2, fill: 'hsl(var(--chart-5))' },
];

const marksTrend = [
  { month: 'Feb', avg: 72 }, { month: 'Mar', avg: 75 }, { month: 'Apr', avg: 78 },
  { month: 'May', avg: 76 }, { month: 'Jun', avg: 80 }, { month: 'Jul', avg: 82 },
];

const exportColumns: ExportColumn[] = [
  { key: 'studentName', label: 'Student Name' },
  { key: 'rollNumber', label: 'Roll No' },
  { key: 'obtainedMarks', label: 'Marks' },
  { key: 'grade', label: 'Grade' },
  { key: 'attendance', label: 'Attendance %' },
  { key: 'avgMarks', label: 'Avg Marks %' },
];

const exportData = marksEntriesData.map((e) => {
  const student = classStudents.find((s) => s.id === e.studentId);
  return {
    studentName: e.studentName,
    rollNumber: e.rollNumber,
    obtainedMarks: e.obtainedMarks,
    grade: e.grade,
    attendance: student?.attendance ?? 0,
    avgMarks: student?.avgMarks ?? 0,
  };
});

export default function TeacherReportsPage() {
  const avgMarks = Math.round(marksEntriesData.reduce((sum, e) => sum + e.obtainedMarks, 0) / marksEntriesData.length);
  const topStudent = marksEntriesData.reduce((max, e) => (e.obtainedMarks > max.obtainedMarks ? e : max));

  return (
    <div className="space-y-6">
      <PageHeader title="Reports" description="Class performance and academic analytics">
        <ExportButtons label="marks" data={exportData} columns={exportColumns} filename="class-performance-report" />
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Class Average" value={`${avgMarks}%`} icon={TrendingUp} change="+4% vs last term" changeType="positive" delay={0} />
        <StatCard title="Total Students" value={marksEntriesData.length} icon={Users} delay={0.05} />
        <StatCard title="Top Score" value={topStudent.obtainedMarks} icon={Award} change={topStudent.studentName} changeType="positive" delay={0.1} />
        <StatCard title="Pass Rate" value={`${Math.round((marksEntriesData.filter((e) => e.obtainedMarks >= 40).length / marksEntriesData.length) * 100)}%`} icon={FileBarChart} delay={0.15} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Class Performance" description="Average vs top scores by class" delay={0.1}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={teacherClassPerformance} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
              <XAxis type="number" domain={[0, 100]} stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis type="category" dataKey="subject" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} width={80} />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: '12px', fontSize: '12px' }} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Bar dataKey="avg" fill="hsl(var(--chart-1))" radius={[0, 6, 6, 0]} name="Average" />
              <Bar dataKey="top" fill="hsl(var(--chart-2))" radius={[0, 6, 6, 0]} name="Top Score" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Marks Trend" description="Monthly class average" delay={0.15}>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={marksTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis domain={[60, 100]} stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: '12px', fontSize: '12px' }} />
              <Line type="monotone" dataKey="avg" stroke="hsl(var(--chart-1))" strokeWidth={2} dot={{ r: 4 }} name="Class Average" />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Grade Distribution" description="Student count by grade" delay={0.2}>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={gradeDistribution} dataKey="count" nameKey="grade" cx="50%" cy="50%" outerRadius={100} label={(entry) => `${entry.grade}: ${entry.count}`}>
                {gradeDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: '12px', fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Weekly Attendance" description="Present vs absent" delay={0.25}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={teacherWeeklyAttendance}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: '12px', fontSize: '12px' }} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Bar dataKey="present" stackId="a" fill="hsl(var(--chart-2))" name="Present" radius={[0, 0, 0, 0]} />
              <Bar dataKey="absent" stackId="a" fill="hsl(var(--chart-5))" name="Absent" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <SectionCard title="Top Performers" description="Students with highest marks" delay={0.3}>
        <div className="overflow-x-auto rounded-xl border">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/30 text-left text-xs font-medium text-muted-foreground">
                <th className="px-4 py-3">Rank</th>
                <th className="px-4 py-3">Student</th>
                <th className="px-4 py-3">Marks</th>
                <th className="px-4 py-3">Grade</th>
                <th className="px-4 py-3">Attendance</th>
              </tr>
            </thead>
            <tbody>
              {[...marksEntriesData].sort((a, b) => b.obtainedMarks - a.obtainedMarks).slice(0, 10).map((e, i) => {
                const student = classStudents.find((s) => s.id === e.studentId);
                return (
                  <motion.tr
                    key={e.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b text-sm last:border-0"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {i < 3 && (
                          <div className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${i === 0 ? 'bg-accent/20 text-accent' : i === 1 ? 'bg-muted text-muted-foreground' : 'bg-chart-4/20 text-chart-4'}`}>
                            {i + 1}
                          </div>
                        )}
                        {i >= 3 && <span className="text-muted-foreground">{i + 1}</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium">{e.studentName}</td>
                    <td className="px-4 py-3 font-semibold">{e.obtainedMarks}/100</td>
                    <td className="px-4 py-3"><Badge variant="secondary" className={e.grade.startsWith('A') ? 'bg-success/10 text-success' : ''}>{e.grade}</Badge></td>
                    <td className="px-4 py-3">{student?.attendance ?? '—'}%</td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}
