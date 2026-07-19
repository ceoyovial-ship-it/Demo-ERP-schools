'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ClipboardList, Clock, FileText, MapPin, Award } from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import { StatCard } from '@/components/stat-card';
import { SectionCard } from '@/components/section-card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/components/auth-provider';
import { getStudentKey, studentExams } from '@/lib/student-data';

const selectClassStyle = 'h-9 rounded-lg border border-input bg-background px-3 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary/20';
type StatusFilter = 'all' | 'upcoming' | 'completed';

export default function StudentExamsPage() {
  const { profile } = useAuth();
  const key = getStudentKey(profile?.email?.split('@')[0]);
  const exams = studentExams[key];
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [search, setSearch] = useState('');

  const filteredExams = useMemo(() => {
    return exams.filter((e) => {
      if (statusFilter !== 'all' && e.status !== statusFilter) return false;
      if (search && !e.name.toLowerCase().includes(search.toLowerCase()) && !e.subject.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [exams, statusFilter, search]);

  const upcomingCount = exams.filter((e) => e.status === 'upcoming').length;
  const completedCount = exams.filter((e) => e.status === 'completed').length;
  const avgScore = Math.round(exams.filter((e) => e.obtainedMarks).reduce((sum, e) => sum + (e.obtainedMarks! / e.maxMarks) * 100, 0) / (completedCount || 1));

  return (
    <div className="space-y-6">
      <PageHeader title="Exams" description="Your exam schedule and results" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Exams" value={exams.length} icon={ClipboardList} delay={0} />
        <StatCard title="Upcoming" value={upcomingCount} icon={Clock} delay={0.05} />
        <StatCard title="Completed" value={completedCount} icon={Award} delay={0.1} />
        <StatCard title="Avg Score" value={`${avgScore}%`} icon={Award} delay={0.15} />
      </div>

      <SectionCard title="Exam Schedule" description={`${filteredExams.length} exams`} delay={0.2}>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="space-y-1.5"><Label className="text-xs text-muted-foreground">Status</Label><select className={selectClassStyle} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}><option value="all">All</option><option value="upcoming">Upcoming</option><option value="completed">Completed</option></select></div>
            <div className="space-y-1.5 sm:min-w-[200px]"><Label className="text-xs text-muted-foreground">Search</Label><Input placeholder="Search exams..." value={search} onChange={(e) => setSearch(e.target.value)} className="h-9" /></div>
          </div>
        </div>
        <div className="space-y-3">
          {filteredExams.map((exam, i) => (
            <motion.div key={exam.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="rounded-xl border p-4 transition-all hover:shadow-premium">
              <div className="flex items-start gap-4">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${exam.status === 'upcoming' ? 'bg-accent/10' : 'bg-success/10'}`}>
                  <FileText className={`h-5 w-5 ${exam.status === 'upcoming' ? 'text-accent' : 'text-success'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2"><p className="text-sm font-medium">{exam.name}</p><Badge variant="secondary" className="text-xs">{exam.subject}</Badge><Badge variant={exam.status === 'upcoming' ? 'secondary' : 'default'} className="text-xs capitalize">{exam.status}</Badge></div>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{exam.date} · {exam.time}</span>
                    <span>{exam.duration}</span>
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{exam.room}</span>
                    <span>Max: {exam.maxMarks} marks</span>
                  </div>
                  {exam.obtainedMarks !== undefined && (
                    <div className="mt-3 flex items-center gap-3">
                      <div className="h-2 flex-1 max-w-[200px] overflow-hidden rounded-full bg-muted">
                        <div className="h-full rounded-full bg-success" style={{ width: `${(exam.obtainedMarks / exam.maxMarks) * 100}%` }} />
                      </div>
                      <Badge variant="secondary" className="bg-success/10 text-success text-xs">Scored: {exam.obtainedMarks}/{exam.maxMarks}</Badge>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
          {filteredExams.length === 0 && <div className="py-12 text-center text-sm text-muted-foreground">No exams found</div>}
        </div>
      </SectionCard>
    </div>
  );
}
