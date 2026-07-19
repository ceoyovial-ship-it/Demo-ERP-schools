'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ClipboardList, Save, Loader2, TrendingUp, Award, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '@/components/page-header';
import { StatCard } from '@/components/stat-card';
import { SectionCard } from '@/components/section-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { marksEntriesData, type MarkEntry } from '@/lib/teacher-data';

const selectClassStyle =
  'h-9 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary/20';
const MARKS_DRAFT_STORAGE_KEY = 'teacher-marks-draft-mid-term-mathematics-grade-10-a';
const MARKS_SUBMITTED_STORAGE_KEY = 'teacher-marks-submitted-mid-term-mathematics-grade-10-a';
const AUDIT_LOG_STORAGE_KEY = 'yovial-audit-log';

function gradeFor(marks: number): string {
  if (marks >= 90) return 'A+';
  if (marks >= 80) return 'A';
  if (marks >= 70) return 'B';
  if (marks >= 60) return 'C';
  if (marks >= 50) return 'D';
  return 'F';
}

export default function MarksGradesPage() {
  const [entries, setEntries] = useState<MarkEntry[]>(marksEntriesData);
  const [selectedExam, setSelectedExam] = useState('Mid-Term Examination');
  const [selectedSubject, setSelectedSubject] = useState('Mathematics');
  const [search, setSearch] = useState('');
  const [saving, setSaving] = useState(false);
  const [submittedIds, setSubmittedIds] = useState<string[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const storedDraft = window.localStorage.getItem(MARKS_DRAFT_STORAGE_KEY);
    const storedSubmitted = window.localStorage.getItem(MARKS_SUBMITTED_STORAGE_KEY);

    if (storedDraft) {
      try {
        const draftEntries = JSON.parse(storedDraft) as MarkEntry[];
        if (draftEntries.length) {
          setEntries(draftEntries);
        }
      } catch {
        // ignore invalid draft data
      }
    }

    if (storedSubmitted) {
      try {
        const parsed = JSON.parse(storedSubmitted) as { submittedIds?: string[] };
        setSubmittedIds(parsed.submittedIds ?? []);
      } catch {
        // ignore invalid submitted data
      }
    }
  }, []);

  const filteredEntries = useMemo(() => {
    const q = search.trim().toLowerCase();
    return entries.filter((e) => {
      if (q && !e.studentName.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [entries, search]);

  const avgMarks = Math.round(entries.reduce((sum, e) => sum + e.obtainedMarks, 0) / entries.length);
  const topScore = Math.max(...entries.map((e) => e.obtainedMarks));
  const passCount = entries.filter((e) => e.obtainedMarks >= 40).length;

  const handleMarkChange = (id: string, value: string) => {
    if (submittedIds.includes(id)) return;

    const numericValue = Number(value);
    const clamped = Number.isFinite(numericValue) ? Math.min(100, Math.max(0, numericValue)) : 0;

    setEntries((prev) =>
      prev.map((e) =>
        e.id === id ? { ...e, obtainedMarks: clamped, grade: gradeFor(clamped) } : e
      )
    );
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
        window.localStorage.setItem(MARKS_DRAFT_STORAGE_KEY, JSON.stringify(entries));
      }

      setSaving(false);
      toast.success('Draft saved successfully', {
        description: `${entries.length} students · ${selectedSubject} · ${selectedExam}`,
      });
    }, 600);
  };

  const handleSubmitMarks = () => {
    const hasEmptyValue = entries.some((entry) => entry.obtainedMarks === undefined || entry.obtainedMarks === null || Number.isNaN(entry.obtainedMarks));
    const exceedsMax = entries.some((entry) => entry.obtainedMarks > entry.maxMarks);

    if (hasEmptyValue) {
      toast.error('Please enter marks for all students before submitting.');
      return;
    }

    if (exceedsMax) {
      toast.error('Submitted marks cannot exceed the maximum marks for the exam.');
      return;
    }

    setSaving(true);

    setTimeout(() => {
      const nextSubmittedIds = entries.map((entry) => entry.id);
      setSubmittedIds(nextSubmittedIds);

      if (typeof window !== 'undefined') {
        window.localStorage.setItem(MARKS_SUBMITTED_STORAGE_KEY, JSON.stringify({ submittedIds: nextSubmittedIds }));
        window.localStorage.setItem(MARKS_DRAFT_STORAGE_KEY, JSON.stringify(entries));
        window.localStorage.setItem('yovial-student-marks-updated', JSON.stringify({
          exam: selectedExam,
          subject: selectedSubject,
          submittedAt: new Date().toISOString(),
        }));
        window.localStorage.setItem('yovial-parent-results-updated', JSON.stringify({
          exam: selectedExam,
          subject: selectedSubject,
          submittedAt: new Date().toISOString(),
        }));
        window.localStorage.setItem('yovial-principal-notifications', JSON.stringify([
          {
            id: `notif-${Date.now()}`,
            message: `Teacher Anjali Reddy submitted Mid-Term Mathematics marks for Grade 10-A.`,
            createdAt: new Date().toISOString(),
          },
        ]));
        window.localStorage.setItem('yovial-principal-pending-approval-count', JSON.stringify(1));
      }

      persistAuditLog(`Teacher Anjali Reddy submitted Mid-Term Mathematics marks for Grade 10-A at ${new Date().toISOString()}`);
      setSaving(false);
      toast.success('Marks submitted successfully', {
        description: `${entries.length} students · ${selectedSubject} · ${selectedExam}`,
      });
    }, 800);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Marks & Grades"
        description="Enter and manage student marks"
      >
        <Button variant="outline" size="sm" onClick={handleSaveDraft} disabled={saving} className="gap-2">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save Draft
        </Button>
        <Button size="sm" onClick={handleSubmitMarks} disabled={saving} className="gap-2">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
          Submit Marks
        </Button>
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Students" value={entries.length} icon={ClipboardList} delay={0} />
        <StatCard title="Class Average" value={`${avgMarks}%`} icon={TrendingUp} change={avgMarks >= 75 ? 'Good' : 'Needs attention'} changeType={avgMarks >= 75 ? 'positive' : 'negative'} delay={0.05} />
        <StatCard title="Top Score" value={topScore} icon={Award} change="Excellent" changeType="positive" delay={0.1} />
        <StatCard title="Pass Rate" value={`${Math.round((passCount / entries.length) * 100)}%`} icon={ClipboardList} delay={0.15} />
      </div>

      <SectionCard title="Marks Entry" description="Editable marks table — click to edit" delay={0.2}>
        {/* Controls */}
        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Exam</Label>
              <select
                className={selectClassStyle}
                value={selectedExam}
                onChange={(e) => setSelectedExam(e.target.value)}
              >
                <option>Mid-Term Examination</option>
                <option>Unit Test 1</option>
                <option>Unit Test 2</option>
                <option>Final Examination</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Subject</Label>
              <select
                className={selectClassStyle}
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
              >
                <option>Mathematics</option>
                <option>Science</option>
                <option>English</option>
                <option>Social Studies</option>
                <option>Hindi</option>
                <option>Computer Science</option>
              </select>
            </div>
            <div className="space-y-1.5 sm:min-w-[200px]">
              <Label className="text-xs text-muted-foreground">Search Student</Label>
              <Input
                placeholder="Search by name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-9"
              />
            </div>
          </div>
        </div>

        {/* Editable Marks Table */}
        <div className="overflow-x-auto rounded-xl border">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/30 text-left text-xs font-medium text-muted-foreground">
                <th className="px-4 py-3">Roll No</th>
                <th className="px-4 py-3">Student Name</th>
                <th className="px-4 py-3 text-center">Max Marks</th>
                <th className="px-4 py-3 text-center">Obtained</th>
                <th className="px-4 py-3 text-center">Grade</th>
                <th className="px-4 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredEntries.map((e, i) => (
                <motion.tr
                  key={e.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.02 }}
                  className="border-b text-sm last:border-0 hover:bg-muted/30"
                >
                  <td className="px-4 py-3 font-mono text-xs">{String(e.rollNumber).padStart(2, '0')}</td>
                  <td className="px-4 py-3 font-medium">{e.studentName}</td>
                  <td className="px-4 py-3 text-center text-muted-foreground">{e.maxMarks}</td>
                  <td className="px-4 py-3 text-center">
                    <Input
                      type="number"
                      value={e.obtainedMarks}
                      onChange={(ev) => handleMarkChange(e.id, ev.target.value)}
                      className="h-8 w-20 text-center"
                      min={0}
                      max={100}
                      disabled={submittedIds.includes(e.id)}
                    />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Badge
                      variant="secondary"
                      className={
                        e.grade.startsWith('A')
                          ? 'bg-success/10 text-success'
                          : e.grade === 'B'
                            ? 'bg-primary/10 text-primary'
                            : e.grade === 'C'
                              ? 'bg-accent/10 text-accent'
                              : 'bg-destructive/10 text-destructive'
                      }
                    >
                      {e.grade}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={e.obtainedMarks >= 40 ? 'text-success' : 'text-destructive'}>
                      {e.obtainedMarks >= 40 ? 'Pass' : 'Fail'}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {filteredEntries.length === 0 && (
            <div className="py-12 text-center text-sm text-muted-foreground">No students found</div>
          )}
        </div>
      </SectionCard>
    </div>
  );
}
