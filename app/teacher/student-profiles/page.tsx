'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Users, Search, Eye, Phone, Mail, Calendar } from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import { StatCard } from '@/components/stat-card';
import { SectionCard } from '@/components/section-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { classStudents, type StudentInClass } from '@/lib/teacher-data';

const selectClassStyle =
  'h-9 rounded-lg border border-input bg-background px-3 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary/20';

export default function StudentProfilesPage() {
  const [search, setSearch] = useState('');
  const [sectionFilter, setSectionFilter] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState<StudentInClass | null>(null);

  const filteredStudents = useMemo(() => {
    const q = search.trim().toLowerCase();
    return classStudents.filter((s) => {
      if (q && !s.name.toLowerCase().includes(q) && !s.parentName.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [search]);

  return (
    <div className="space-y-6">
      <PageHeader title="Student Profiles" description="View student information and academic records" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Students" value={classStudents.length} icon={Users} delay={0} />
        <StatCard title="Above 90% Attendance" value={classStudents.filter((s) => s.attendance >= 90).length} icon={Calendar} delay={0.05} />
        <StatCard title="Above 80% Marks" value={classStudents.filter((s) => s.avgMarks >= 80).length} icon={Users} delay={0.1} />
        <StatCard title="Need Attention" value={classStudents.filter((s) => s.attendance < 75 || s.avgMarks < 60).length} icon={Users} delay={0.15} />
      </div>

      <SectionCard title="Student Directory" description={`${filteredStudents.length} students in Grade 10-A`} delay={0.2}>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Section</Label>
              <select className={selectClassStyle} value={sectionFilter} onChange={(e) => setSectionFilter(e.target.value)}>
                <option value="all">All Sections</option>
                <option value="A">Section A</option>
                <option value="B">Section B</option>
              </select>
            </div>
            <div className="space-y-1.5 sm:min-w-[240px]">
              <Label className="text-xs text-muted-foreground">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search by name or parent..." value={search} onChange={(e) => setSearch(e.target.value)} className="h-9 pl-10" />
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/30 text-left text-xs font-medium text-muted-foreground">
                <th className="px-4 py-3">Roll No</th>
                <th className="px-4 py-3">Student Name</th>
                <th className="px-4 py-3">Attendance</th>
                <th className="px-4 py-3">Avg Marks</th>
                <th className="px-4 py-3">Parent</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((s, i) => (
                <motion.tr
                  key={s.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.02 }}
                  className="cursor-pointer border-b text-sm last:border-0 hover:bg-muted/30"
                  onClick={() => setSelectedStudent(s)}
                >
                  <td className="px-4 py-3 font-mono text-xs">{String(s.rollNumber).padStart(2, '0')}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                        {s.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()}
                      </div>
                      <span className="font-medium">{s.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={s.attendance >= 90 ? 'text-success' : s.attendance >= 75 ? 'text-accent' : 'text-destructive'}>
                      {s.attendance}%
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium">{s.avgMarks}%</td>
                  <td className="px-4 py-3 text-muted-foreground">{s.parentName}</td>
                  <td className="px-4 py-3 text-right">
                    <Button size="sm" variant="ghost" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); setSelectedStudent(s); }}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {filteredStudents.length === 0 && (
            <div className="py-12 text-center text-sm text-muted-foreground">No students found</div>
          )}
        </div>
      </SectionCard>

      {/* Student Detail Modal */}
      <Dialog open={!!selectedStudent} onOpenChange={(open) => { if (!open) setSelectedStudent(null); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Student Profile</DialogTitle>
            <DialogDescription>Grade {selectedStudent?.classGrade}-{selectedStudent?.section} · Roll #{selectedStudent?.rollNumber}</DialogDescription>
          </DialogHeader>
          {selectedStudent && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 py-2">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-xl font-bold text-primary">
                  {selectedStudent.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()}
                </div>
                <div>
                  <p className="text-lg font-bold">{selectedStudent.name}</p>
                  <p className="text-sm text-muted-foreground">Roll #{selectedStudent.rollNumber} · Grade {selectedStudent.classGrade}-{selectedStudent.section}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl border p-3">
                  <p className="text-xs text-muted-foreground">Attendance</p>
                  <p className={`text-xl font-bold ${selectedStudent.attendance >= 90 ? 'text-success' : selectedStudent.attendance >= 75 ? 'text-accent' : 'text-destructive'}`}>
                    {selectedStudent.attendance}%
                  </p>
                </div>
                <div className="rounded-xl border p-3">
                  <p className="text-xs text-muted-foreground">Average Marks</p>
                  <p className="text-xl font-bold">{selectedStudent.avgMarks}%</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted"><Users className="h-4 w-4 text-muted-foreground" /></div>
                  <div><p className="text-xs text-muted-foreground">Parent / Guardian</p><p className="text-sm font-medium">{selectedStudent.parentName}</p></div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted"><Phone className="h-4 w-4 text-muted-foreground" /></div>
                  <div><p className="text-xs text-muted-foreground">Parent Phone</p><p className="text-sm font-medium">{selectedStudent.parentPhone}</p></div>
                </div>
              </div>
            </motion.div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
