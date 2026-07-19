'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Clock, BookOpen, ChevronRight } from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import { StatCard } from '@/components/stat-card';
import { SectionCard } from '@/components/section-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DataTable, type Column } from '@/components/data-table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  teacherClasses,
  teacherClassTeacherResponsibility,
  classStudents,
  type StudentInClass,
} from '@/lib/teacher-data';

export default function MyClassesPage() {
  const [selectedClass, setSelectedClass] = useState<(typeof teacherClasses)[0] | null>(null);
  const [showStudents, setShowStudents] = useState(false);

  const totalStudents = teacherClasses.reduce((sum, c) => sum + c.students, 0);

  const classColumns: Column<(typeof teacherClasses)[0]>[] = [
    {
      key: 'name',
      header: 'Class Name',
      sortable: true,
      render: (c) => (
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <BookOpen className="h-4 w-4 text-primary" />
          </div>
          <span className="font-medium">{c.name}</span>
        </div>
      ),
    },
    {
      key: 'subject',
      header: 'Subject',
      sortable: true,
      render: (c) => <Badge variant="secondary" className="text-xs">{c.subject}</Badge>,
    },
    {
      key: 'time',
      header: 'Time',
      render: (c) => <span className="text-muted-foreground">{c.time}</span>,
    },
    {
      key: 'room',
      header: 'Room',
      render: (c) => <span className="text-muted-foreground">{c.room}</span>,
    },
    {
      key: 'students',
      header: 'Students',
      sortable: true,
      render: (c) => <span className="font-medium">{c.students}</span>,
    },
    {
      key: 'day',
      header: 'Day',
      sortable: true,
      render: (c) => <span className="text-muted-foreground">{c.day}</span>,
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right',
      render: (c) => (
        <Button
          size="sm"
          variant="outline"
          className="gap-1.5"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedClass(c);
            setShowStudents(true);
          }}
        >
          View Students
          <ChevronRight className="h-3.5 w-3.5" />
        </Button>
      ),
    },
  ];

  const studentColumns: Column<StudentInClass>[] = [
    {
      key: 'rollNumber',
      header: 'Roll No',
      sortable: true,
      render: (s) => <span className="font-mono text-xs">{String(s.rollNumber).padStart(2, '0')}</span>,
    },
    {
      key: 'name',
      header: 'Student Name',
      sortable: true,
      render: (s) => (
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
            {s.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()}
          </div>
          <span className="font-medium">{s.name}</span>
        </div>
      ),
    },
    {
      key: 'attendance',
      header: 'Attendance',
      sortable: true,
      render: (s) => (
        <span className={s.attendance >= 90 ? 'text-success' : s.attendance >= 75 ? 'text-accent' : 'text-destructive'}>
          {s.attendance}%
        </span>
      ),
    },
    {
      key: 'avgMarks',
      header: 'Avg Marks',
      sortable: true,
      render: (s) => <span className="font-medium">{s.avgMarks}%</span>,
    },
    {
      key: 'parentName',
      header: 'Parent',
      render: (s) => <span className="text-muted-foreground">{s.parentName}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="My Classes" description="Classes you are teaching this term" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Class Teacher" value="1 Section" icon={BookOpen} delay={0} />
        <StatCard title="Teaching Assignments" value={teacherClasses.length} icon={Users} delay={0.05} />
        <StatCard title="Students Under Care" value={totalStudents + teacherClassTeacherResponsibility.students} icon={Users} delay={0.1} />
        <StatCard title="Subjects" value={2} icon={Clock} delay={0.15} />
      </div>

      <SectionCard title="Class Teacher Responsibility" description="One assigned class teacher section only" delay={0.2}>
        <div className="rounded-xl border p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <BookOpen className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">{teacherClassTeacherResponsibility.name}</p>
              <p className="text-xs text-muted-foreground">
                {teacherClassTeacherResponsibility.subject} · Room {teacherClassTeacherResponsibility.room} · {teacherClassTeacherResponsibility.time}
              </p>
            </div>
            <Badge variant="secondary" className="text-xs">Grade {teacherClassTeacherResponsibility.grade}-{teacherClassTeacherResponsibility.section}</Badge>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Teaching Assignments" description={`${teacherClasses.length} classes assigned to you`} delay={0.25}>
        <DataTable
          data={teacherClasses}
          columns={classColumns}
          searchKeys={['name', 'subject', 'room']}
          searchPlaceholder="Search classes..."
          onRowClick={(c) => {
            setSelectedClass(c);
            setShowStudents(true);
          }}
        />
      </SectionCard>

      {/* Student List Modal */}
      <Dialog open={showStudents} onOpenChange={setShowStudents}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{selectedClass?.name}</DialogTitle>
            <DialogDescription>
              {selectedClass?.students} students · {selectedClass?.subject} · Room {selectedClass?.room}
            </DialogDescription>
          </DialogHeader>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-h-[60vh] overflow-y-auto"
          >
            <DataTable
              data={classStudents}
              columns={studentColumns}
              searchKeys={['name', 'parentName']}
              searchPlaceholder="Search students..."
              pageSize={8}
            />
          </motion.div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
