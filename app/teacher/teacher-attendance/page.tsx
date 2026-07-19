'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CalendarCheck, Users, Check, X, Clock, Save, Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '@/components/page-header';
import { StatCard } from '@/components/stat-card';
import { SectionCard } from '@/components/section-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { classStudents, attendanceHistory } from '@/lib/teacher-data';

const selectClass =
  'h-9 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary/20';
const ATTENDANCE_DRAFT_STORAGE_KEY = 'teacher-attendance-draft-grade-10-a';
const ATTENDANCE_SUBMITTED_STORAGE_KEY = 'teacher-attendance-submitted-grade-10-a';
const AUDIT_LOG_STORAGE_KEY = 'yovial-audit-log';

type Status = 'present' | 'absent' | 'late';
type StatusFilter = 'all' | Status;

export default function TeacherAttendancePage() {
  const [entries, setEntries] = useState<Record<string, Status>>(() => {
    const initial: Record<string, Status> = {};
    classStudents.forEach((s, i) => {
      const existing = attendanceHistory.find((a) => a.studentId === s.id && a.date === '2025-07-16');
      initial[s.id] = existing?.status ?? (i % 7 === 0 ? 'absent' : i % 5 === 0 ? 'late' : 'present');
    });
    return initial;
  });
  const [selectedClass, setSelectedClass] = useState('10-A');
  const [selectedDate, setSelectedDate] = useState('2025-07-16');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [search, setSearch] = useState('');
  const [saving, setSaving] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const storedDraft = window.localStorage.getItem(ATTENDANCE_DRAFT_STORAGE_KEY);
    const storedSubmitted = window.localStorage.getItem(ATTENDANCE_SUBMITTED_STORAGE_KEY);

    if (storedDraft) {
      try {
        const draftEntries = JSON.parse(storedDraft) as Record<string, Status>;
        if (Object.keys(draftEntries).length) {
          setEntries(draftEntries);
        }
      } catch {
        // ignore invalid draft data
      }
    }

    if (storedSubmitted) {
      try {
        const parsed = JSON.parse(storedSubmitted) as { submitted?: boolean };
        setSubmitted(Boolean(parsed.submitted));
      } catch {
        // ignore invalid submitted data
      }
    }
  }, []);

  const presentCount = Object.values(entries).filter((s) => s === 'present').length;
  const absentCount = Object.values(entries).filter((s) => s === 'absent').length;
  const lateCount = Object.values(entries).filter((s) => s === 'late').length;
  const rate = Math.round((presentCount / classStudents.length) * 100);

  const filteredStudents = useMemo(() => {
    const q = search.trim().toLowerCase();
    return classStudents.filter((s) => {
      if (q && !s.name.toLowerCase().includes(q)) return false;
      if (statusFilter !== 'all' && entries[s.id] !== statusFilter) return false;
      return true;
    });
  }, [search, statusFilter, entries]);

  const handleSetStatus = (studentId: string, status: Status) => {
    if (submitted) return;
    setEntries((prev) => ({ ...prev, [studentId]: status }));
  };

  const handleMarkAllPresent = () => {
    if (submitted) return;
    const allPresent: Record<string, Status> = {};
    classStudents.forEach((s) => (allPresent[s.id] = 'present'));
    setEntries(allPresent);
    toast.success('All students marked present');
  };

  const persistAuditLog = (message: string) => {
    if (typeof window === 'undefined') return;

    const existing = window.localStorage.getItem(AUDIT_LOG_STORAGE_KEY);
    const auditLogs = existing ? (JSON.parse(existing) as string[]) : [];
    auditLogs.unshift(message);
    window.localStorage.setItem(AUDIT_LOG_STORAGE_KEY, JSON.stringify(auditLogs.slice(0, 30)));
  };

  const handleSaveDraft = () => {
    setSaving(true);
    setTimeout(() => {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(ATTENDANCE_DRAFT_STORAGE_KEY, JSON.stringify(entries));
      }

      setSaving(false);
      toast.success('Draft saved successfully', {
        description: `${presentCount} present, ${lateCount} late, ${absentCount} absent for Grade ${selectedClass} on ${selectedDate}`,
      });
    }, 600);
  };

  const handleSubmitAttendance = () => {
    const missingAttendance = classStudents.some((student) => !entries[student.id]);

    if (missingAttendance) {
      toast.error('Please mark attendance for all students before submitting.');
      return;
    }

    setSaving(true);
    setTimeout(() => {
      setSubmitted(true);

      if (typeof window !== 'undefined') {
        window.localStorage.setItem(ATTENDANCE_SUBMITTED_STORAGE_KEY, JSON.stringify({ submitted: true }));
        window.localStorage.setItem(ATTENDANCE_DRAFT_STORAGE_KEY, JSON.stringify(entries));
        window.localStorage.setItem('yovial-student-attendance-updated', JSON.stringify({
          classGrade: selectedClass,
          submittedAt: new Date().toISOString(),
        }));
        window.localStorage.setItem('yovial-parent-attendance-updated', JSON.stringify({
          classGrade: selectedClass,
          submittedAt: new Date().toISOString(),
        }));
        window.localStorage.setItem('yovial-principal-attendance-dashboard', JSON.stringify({
          classGrade: selectedClass,
          creditedBy: 'Anjali Reddy',
          submittedAt: new Date().toISOString(),
        }));
      }

      persistAuditLog(`Attendance submitted by Anjali Reddy for Grade ${selectedClass} at ${new Date().toISOString()}`);
      setSaving(false);
      toast.success('Attendance submitted successfully', {
        description: `${presentCount} present, ${lateCount} late, ${absentCount} absent for Grade ${selectedClass} on ${selectedDate}`,
      });
    }, 800);
  };

  const statusConfig: Record<Status, { icon: typeof Check; color: string; bg: string }> = {
    present: { icon: Check, color: 'text-success', bg: 'bg-success/10 border-success/30' },
    absent: { icon: X, color: 'text-destructive', bg: 'bg-destructive/10 border-destructive/30' },
    late: { icon: Clock, color: 'text-accent', bg: 'bg-accent/10 border-accent/30' },
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Attendance"
        description="Mark and manage student attendance"
      >
        <Button variant="outline" size="sm" onClick={handleMarkAllPresent} disabled={submitted}>
          <Check className="h-4 w-4 mr-1.5" />
          Mark All Present
        </Button>
        <Button variant="outline" size="sm" onClick={handleSaveDraft} disabled={saving || submitted} className="gap-2">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save Draft
        </Button>
        <Button size="sm" onClick={handleSubmitAttendance} disabled={saving || submitted} className="gap-2">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
          Submit Attendance
        </Button>
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Present" value={presentCount} icon={Check} change={`${rate}% rate`} changeType="positive" delay={0} />
        <StatCard title="Absent" value={absentCount} icon={X} changeType="negative" delay={0.05} />
        <StatCard title="Late" value={lateCount} icon={Clock} changeType="neutral" delay={0.1} />
        <StatCard title="Total" value={classStudents.length} icon={Users} delay={0.15} />
      </div>

      <SectionCard title="Mark Attendance" description={`Grade ${selectedClass} — ${selectedDate}`} delay={0.2}>
        {/* Controls */}
        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Class</Label>
              <select
                className={selectClass}
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
              >
                <option value="10-A">Grade 10-A</option>
                <option value="10-B">Grade 10-B</option>
                <option value="9-A">Grade 9-A</option>
                <option value="9-B">Grade 9-B</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Date</Label>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="h-9"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Filter</Label>
              <select
                className={selectClass}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
              >
                <option value="all">All Students</option>
                <option value="present">Present</option>
                <option value="absent">Absent</option>
                <option value="late">Late</option>
              </select>
            </div>
            <div className="space-y-1.5 sm:min-w-[200px]">
              <Label className="text-xs text-muted-foreground">Search</Label>
              <Input
                placeholder="Search student..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-9"
              />
            </div>
          </div>
        </div>

        {/* Student List */}
        <div className="space-y-2">
          {filteredStudents.map((s, i) => {
            const status = entries[s.id];
            const config = statusConfig[status];
            return (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.02 }}
                className={`flex items-center gap-4 rounded-xl border p-3 ${config.bg} transition-all`}
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-background font-mono text-xs font-semibold">
                  {String(s.rollNumber).padStart(2, '0')}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{s.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Roll #{s.rollNumber} · Parent: {s.parentName}
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  {(['present', 'late', 'absent'] as Status[]).map((st) => {
                    const stConfig = statusConfig[st];
                    const StIcon = stConfig.icon;
                    return (
                      <Button
                        key={st}
                        size="sm"
                        variant={status === st ? 'default' : 'outline'}
                        className="h-8 gap-1.5 capitalize"
                        onClick={() => handleSetStatus(s.id, st)}
                        disabled={submitted}
                      >
                        <StIcon className="h-3.5 w-3.5" />
                        {st}
                      </Button>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
          {filteredStudents.length === 0 && (
            <div className="py-12 text-center text-sm text-muted-foreground">No students match the current filters</div>
          )}
        </div>
      </SectionCard>

      {/* Recent History */}
      <SectionCard title="Recent Attendance History" description="Previous attendance records" delay={0.3}>
        <div className="overflow-x-auto rounded-xl border">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/30 text-left text-xs font-medium text-muted-foreground">
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Class</th>
                <th className="px-4 py-3">Present</th>
                <th className="px-4 py-3">Absent</th>
                <th className="px-4 py-3">Late</th>
                <th className="px-4 py-3">Rate</th>
                <th className="px-4 py-3">Marked By</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 5 }, (_, dayIdx) => {
                const date = new Date(2025, 6, 16 - dayIdx);
                const dateStr = date.toISOString().split('T')[0];
                const dayEntries = attendanceHistory.filter((a) => a.date === dateStr);
                const present = dayEntries.filter((a) => a.status === 'present').length;
                const absent = dayEntries.filter((a) => a.status === 'absent').length;
                const late = dayEntries.filter((a) => a.status === 'late').length;
                const dayRate = Math.round((present / dayEntries.length) * 100);
                return (
                  <tr key={dayIdx} className="border-b text-sm last:border-0">
                    <td className="px-4 py-3 font-medium">{dateStr}</td>
                    <td className="px-4 py-3 text-muted-foreground">Grade 10-A</td>
                    <td className="px-4 py-3"><Badge variant="secondary" className="bg-success/10 text-success">{present}</Badge></td>
                    <td className="px-4 py-3"><Badge variant="secondary" className="bg-destructive/10 text-destructive">{absent}</Badge></td>
                    <td className="px-4 py-3"><Badge variant="secondary" className="bg-accent/10 text-accent">{late}</Badge></td>
                    <td className={`px-4 py-3 font-medium ${dayRate >= 90 ? 'text-success' : dayRate >= 75 ? 'text-accent' : 'text-destructive'}`}>{dayRate}%</td>
                    <td className="px-4 py-3 text-muted-foreground">Anjali Reddy</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}
