// ============================================================
// Yovial School ERP — Student Portal Demo Data
// 3 distinct students: Rahul (10-A), Priya (9-B), Arjun (8-A)
// ============================================================

export interface StudentProfile {
  id: string;
  studentId: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  classGrade: string;
  section: string;
  rollNumber: number;
  admissionNumber: string;
  dob: string;
  gender: string;
  bloodGroup: string;
  address: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  parentOccupation: string;
  admissionDate: string;
  status: 'active' | 'inactive';
  avatar: string | null;
  bio: string;
}

export const studentProfiles: Record<string, StudentProfile> = {
  rahul: {
    id: 'stu-001',
    studentId: 'STU001',
    name: 'Rahul Kumar',
    username: 'rahul10',
    email: 'rahul.kumar@yovialschool.edu.in',
    phone: '+91 90011 22334',
    classGrade: '10',
    section: 'A',
    rollNumber: 25,
    admissionNumber: 'YS2025-0104',
    dob: '2009-05-14',
    gender: 'Male',
    bloodGroup: 'B+',
    address: '78, MG Road, Bengaluru, Karnataka 560001',
    parentName: 'Ramesh Kumar',
    parentPhone: '+91 90011 22334',
    parentEmail: 'ramesh.kumar@email.com',
    parentOccupation: 'Software Engineer',
    admissionDate: '2023-06-15',
    status: 'active',
    avatar: null,
    bio: 'Class representative and member of the Mathematics club. Interested in robotics and competitive programming.',
  },
  priya: {
    id: 'stu-002',
    studentId: 'STU002',
    name: 'Priya Sharma',
    username: 'priya09',
    email: 'priya.sharma@yovialschool.edu.in',
    phone: '+91 90022 33445',
    classGrade: '9',
    section: 'B',
    rollNumber: 12,
    admissionNumber: 'YS2025-0208',
    dob: '2010-08-22',
    gender: 'Female',
    bloodGroup: 'O+',
    address: '34, Park Street, Bengaluru, Karnataka 560034',
    parentName: 'Suresh Sharma',
    parentPhone: '+91 90022 33445',
    parentEmail: 'suresh.sharma@email.com',
    parentOccupation: 'Doctor',
    admissionDate: '2022-06-20',
    status: 'active',
    avatar: null,
    bio: 'Active member of the debate club and school choir. Loves reading and creative writing.',
  },
  arjun: {
    id: 'stu-003',
    studentId: 'STU003',
    name: 'Arjun Reddy',
    username: 'arjun08',
    email: 'arjun.reddy@yovialschool.edu.in',
    phone: '+91 90033 44556',
    classGrade: '8',
    section: 'A',
    rollNumber: 8,
    admissionNumber: 'YS2025-0312',
    dob: '2011-03-10',
    gender: 'Male',
    bloodGroup: 'A+',
    address: '56, Jayanagar, Bengaluru, Karnataka 560011',
    parentName: 'Mahesh Reddy',
    parentPhone: '+91 90033 44556',
    parentEmail: 'mahesh.reddy@email.com',
    parentOccupation: 'Business',
    admissionDate: '2021-06-18',
    status: 'active',
    avatar: null,
    bio: 'Passionate about sports — member of the school cricket and football teams. Enjoys science experiments.',
  },
};

export type StudentKey = 'rahul' | 'priya' | 'arjun';

// ============================================================
// Per-student attendance data
// ============================================================
export interface StudentAttendanceRecord {
  id: string;
  date: string;
  day: string;
  status: 'present' | 'absent' | 'late';
  subject: string;
}

function genAttendance(seed: number, totalDays: number, presentRate: number, lateRate: number): StudentAttendanceRecord[] {
  const subjects = ['Mathematics', 'Science', 'English', 'Social Studies', 'Hindi', 'Computer Science'];
  const records: StudentAttendanceRecord[] = [];
  for (let d = 0; d < totalDays; d++) {
    const date = new Date(2025, 6, 16 - d);
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
    if (dayName === 'Sun') continue;
    const rand = (seed + d * 7) % 100;
    const status: 'present' | 'absent' | 'late' = rand < presentRate ? 'present' : rand < presentRate + lateRate ? 'late' : 'absent';
    records.push({
      id: `att-${seed}-${d}`,
      date: date.toISOString().split('T')[0],
      day: dayName,
      status,
      subject: subjects[d % subjects.length],
    });
  }
  return records;
}

export const studentAttendance: Record<StudentKey, StudentAttendanceRecord[]> = {
  rahul: genAttendance(1, 30, 90, 5),
  priya: genAttendance(2, 30, 82, 8),
  arjun: genAttendance(3, 30, 68, 6),
};

export const studentAttendanceSummary: Record<StudentKey, { present: number; absent: number; late: number; percentage: number }> = {
  rahul: { present: 24, absent: 2, late: 2, percentage: 93 },
  priya: { present: 20, absent: 3, late: 3, percentage: 82 },
  arjun: { present: 16, absent: 6, late: 2, percentage: 72 },
};

// ============================================================
// Per-student marks data
// ============================================================
export interface StudentMarkRecord {
  id: string;
  subject: string;
  examName: string;
  maxMarks: number;
  obtainedMarks: number;
  grade: string;
  date: string;
}

function gradeFor(marks: number): string {
  if (marks >= 90) return 'A+';
  if (marks >= 80) return 'A';
  if (marks >= 70) return 'B';
  if (marks >= 60) return 'C';
  if (marks >= 50) return 'D';
  return 'F';
}

export const studentMarks: Record<StudentKey, StudentMarkRecord[]> = {
  rahul: [
    { id: 'mk-r-1', subject: 'Mathematics', examName: 'Mid-Term', maxMarks: 100, obtainedMarks: 92, grade: 'A+', date: '2025-07-15' },
    { id: 'mk-r-2', subject: 'Science', examName: 'Mid-Term', maxMarks: 100, obtainedMarks: 88, grade: 'A', date: '2025-07-15' },
    { id: 'mk-r-3', subject: 'English', examName: 'Mid-Term', maxMarks: 100, obtainedMarks: 85, grade: 'A', date: '2025-07-15' },
    { id: 'mk-r-4', subject: 'Social Studies', examName: 'Mid-Term', maxMarks: 100, obtainedMarks: 78, grade: 'B', date: '2025-07-15' },
    { id: 'mk-r-5', subject: 'Hindi', examName: 'Mid-Term', maxMarks: 100, obtainedMarks: 90, grade: 'A+', date: '2025-07-15' },
    { id: 'mk-r-6', subject: 'Computer Science', examName: 'Mid-Term', maxMarks: 100, obtainedMarks: 95, grade: 'A+', date: '2025-07-15' },
  ],
  priya: [
    { id: 'mk-p-1', subject: 'Mathematics', examName: 'Mid-Term', maxMarks: 100, obtainedMarks: 72, grade: 'B', date: '2025-07-15' },
    { id: 'mk-p-2', subject: 'Science', examName: 'Mid-Term', maxMarks: 100, obtainedMarks: 80, grade: 'A', date: '2025-07-15' },
    { id: 'mk-p-3', subject: 'English', examName: 'Mid-Term', maxMarks: 100, obtainedMarks: 88, grade: 'A', date: '2025-07-15' },
    { id: 'mk-p-4', subject: 'Social Studies', examName: 'Mid-Term', maxMarks: 100, obtainedMarks: 85, grade: 'A', date: '2025-07-15' },
    { id: 'mk-p-5', subject: 'Hindi', examName: 'Mid-Term', maxMarks: 100, obtainedMarks: 76, grade: 'B', date: '2025-07-15' },
    { id: 'mk-p-6', subject: 'Computer Science', examName: 'Mid-Term', maxMarks: 100, obtainedMarks: 82, grade: 'A', date: '2025-07-15' },
  ],
  arjun: [
    { id: 'mk-a-1', subject: 'Mathematics', examName: 'Mid-Term', maxMarks: 100, obtainedMarks: 55, grade: 'D', date: '2025-07-15' },
    { id: 'mk-a-2', subject: 'Science', examName: 'Mid-Term', maxMarks: 100, obtainedMarks: 68, grade: 'C', date: '2025-07-15' },
    { id: 'mk-a-3', subject: 'English', examName: 'Mid-Term', maxMarks: 100, obtainedMarks: 62, grade: 'C', date: '2025-07-15' },
    { id: 'mk-a-4', subject: 'Social Studies', examName: 'Mid-Term', maxMarks: 100, obtainedMarks: 58, grade: 'D', date: '2025-07-15' },
    { id: 'mk-a-5', subject: 'Hindi', examName: 'Mid-Term', maxMarks: 100, obtainedMarks: 70, grade: 'B', date: '2025-07-15' },
    { id: 'mk-a-6', subject: 'Computer Science', examName: 'Mid-Term', maxMarks: 100, obtainedMarks: 75, grade: 'B', date: '2025-07-15' },
  ],
};

export const studentMarksTrend: Record<StudentKey, { month: string; marks: number }[]> = {
  rahul: [
    { month: 'Feb', marks: 85 }, { month: 'Mar', marks: 88 }, { month: 'Apr', marks: 87 },
    { month: 'May', marks: 90 }, { month: 'Jun', marks: 89 }, { month: 'Jul', marks: 92 },
  ],
  priya: [
    { month: 'Feb', marks: 72 }, { month: 'Mar', marks: 75 }, { month: 'Apr', marks: 78 },
    { month: 'May', marks: 80 }, { month: 'Jun', marks: 79 }, { month: 'Jul', marks: 82 },
  ],
  arjun: [
    { month: 'Feb', marks: 48 }, { month: 'Mar', marks: 52 }, { month: 'Apr', marks: 55 },
    { month: 'May', marks: 58 }, { month: 'Jun', marks: 60 }, { month: 'Jul', marks: 63 },
  ],
};

// ============================================================
// Per-student homework data
// ============================================================
export interface StudentHomework {
  id: string;
  title: string;
  subject: string;
  description: string;
  assignedDate: string;
  dueDate: string;
  status: 'pending' | 'submitted' | 'graded' | 'overdue';
  grade?: string;
  teacherName: string;
}

export const studentHomework: Record<StudentKey, StudentHomework[]> = {
  rahul: [
    { id: 'shw-r-1', title: 'Algebra Worksheet #5', subject: 'Mathematics', description: 'Solve all problems from Exercise 5.2.', assignedDate: '2025-07-14', dueDate: '2025-07-16', status: 'submitted', teacherName: 'Anjali Reddy' },
    { id: 'shw-r-2', title: 'Chemistry Lab Report', subject: 'Science', description: 'Write lab report on acid-base titration.', assignedDate: '2025-07-12', dueDate: '2025-07-18', status: 'pending', teacherName: 'Anjali Reddy' },
    { id: 'shw-r-3', title: 'Essay: Climate Change', subject: 'English', description: 'Write a 500-word essay on climate change.', assignedDate: '2025-07-13', dueDate: '2025-07-17', status: 'graded', grade: 'A', teacherName: 'Meena Iyer' },
    { id: 'shw-r-4', title: 'Trigonometry Problems', subject: 'Mathematics', description: 'Solve problems 1-20 from Chapter 8.', assignedDate: '2025-07-15', dueDate: '2025-07-20', status: 'pending', teacherName: 'Anjali Reddy' },
    { id: 'shw-r-5', title: 'Map Work: Indian Rivers', subject: 'Social Studies', description: 'Mark all major rivers on the map.', assignedDate: '2025-07-10', dueDate: '2025-07-14', status: 'graded', grade: 'B', teacherName: 'Suresh Babu' },
  ],
  priya: [
    { id: 'shw-p-1', title: 'Geometry Proofs', subject: 'Mathematics', description: 'Complete proof exercises for triangles.', assignedDate: '2025-07-10', dueDate: '2025-07-14', status: 'graded', grade: 'B', teacherName: 'Anjali Reddy' },
    { id: 'shw-p-2', title: 'Periodic Table Study', subject: 'Science', description: 'Memorize first 20 elements.', assignedDate: '2025-07-13', dueDate: '2025-07-15', status: 'overdue', teacherName: 'Anjali Reddy' },
    { id: 'shw-p-3', title: 'Letter Writing Practice', subject: 'English', description: 'Write formal and informal letters.', assignedDate: '2025-07-14', dueDate: '2025-07-17', status: 'pending', teacherName: 'Meena Iyer' },
    { id: 'shw-p-4', title: 'Hindi Grammar Exercise', subject: 'Hindi', description: 'Complete sandhi and samas exercises.', assignedDate: '2025-07-15', dueDate: '2025-07-19', status: 'pending', teacherName: 'Kavita Singh' },
  ],
  arjun: [
    { id: 'shw-a-1', title: 'Fractions Worksheet', subject: 'Mathematics', description: 'Solve all fraction problems from Exercise 3.1.', assignedDate: '2025-07-14', dueDate: '2025-07-16', status: 'overdue', teacherName: 'Rajesh Kumar' },
    { id: 'shw-a-2', title: 'Plant Cell Diagram', subject: 'Science', description: 'Draw and label a plant cell diagram.', assignedDate: '2025-07-12', dueDate: '2025-07-15', status: 'submitted', teacherName: 'Rajesh Kumar' },
    { id: 'shw-a-3', title: 'Reading Comprehension', subject: 'English', description: 'Read the passage and answer questions.', assignedDate: '2025-07-13', dueDate: '2025-07-17', status: 'pending', teacherName: 'Meena Iyer' },
    { id: 'shw-a-4', title: 'Maps and Globes', subject: 'Social Studies', description: 'Complete the map reading exercise.', assignedDate: '2025-07-10', dueDate: '2025-07-14', status: 'overdue', teacherName: 'Suresh Babu' },
    { id: 'shw-a-5', title: 'Programming Basics', subject: 'Computer Science', description: 'Write a simple Python program.', assignedDate: '2025-07-15', dueDate: '2025-07-20', status: 'pending', teacherName: 'Vikas Jain' },
  ],
};

// ============================================================
// Per-student assignments
// ============================================================
export interface StudentAssignment {
  id: string;
  title: string;
  subject: string;
  description: string;
  dueDate: string;
  maxMarks: number;
  obtainedMarks: number | null;
  status: 'pending' | 'submitted' | 'graded' | 'overdue';
  fileName: string | null;
  submittedDate: string | null;
  teacherName: string;
}

export const studentAssignments: Record<StudentKey, StudentAssignment[]> = {
  rahul: [
    { id: 'sa-r-1', title: 'Math Project: Trigonometry in Real Life', subject: 'Mathematics', description: 'Create a project on real-world applications of trigonometry.', dueDate: '2025-07-25', maxMarks: 50, obtainedMarks: null, status: 'pending', fileName: null, submittedDate: null, teacherName: 'Anjali Reddy' },
    { id: 'sa-r-2', title: 'Science Fair Project Proposal', subject: 'Science', description: 'Submit a 2-page proposal for the science exhibition.', dueDate: '2025-07-22', maxMarks: 30, obtainedMarks: null, status: 'submitted', fileName: 'rahul-science-proposal.pdf', submittedDate: '2025-07-14', teacherName: 'Anjali Reddy' },
    { id: 'sa-r-3', title: 'English: Character Analysis', subject: 'English', description: 'Analyze the main character from the prescribed novel.', dueDate: '2025-07-12', maxMarks: 40, obtainedMarks: 36, status: 'graded', fileName: 'rahul-char-analysis.pdf', submittedDate: '2025-07-10', teacherName: 'Meena Iyer' },
  ],
  priya: [
    { id: 'sa-p-1', title: 'Statistics Data Analysis', subject: 'Mathematics', description: 'Analyze the dataset and create a report.', dueDate: '2025-07-19', maxMarks: 40, obtainedMarks: null, status: 'submitted', fileName: 'priya-stats-report.pdf', submittedDate: '2025-07-15', teacherName: 'Anjali Reddy' },
    { id: 'sa-p-2', title: 'Hindi Poetry Recitation', subject: 'Hindi', description: 'Memorize and recite a poem from the textbook.', dueDate: '2025-07-18', maxMarks: 20, obtainedMarks: null, status: 'pending', fileName: null, submittedDate: null, teacherName: 'Kavita Singh' },
  ],
  arjun: [
    { id: 'sa-a-1', title: 'Simple Python Game', subject: 'Computer Science', description: 'Create a simple number guessing game in Python.', dueDate: '2025-07-21', maxMarks: 30, obtainedMarks: null, status: 'pending', fileName: null, submittedDate: null, teacherName: 'Vikas Jain' },
    { id: 'sa-a-2', title: 'Solar System Model', subject: 'Science', description: 'Build a 3D model of the solar system.', dueDate: '2025-07-10', maxMarks: 50, obtainedMarks: 35, status: 'graded', fileName: 'arjun-solar-system.zip', submittedDate: '2025-07-08', teacherName: 'Rajesh Kumar' },
    { id: 'sa-a-3', title: 'Current Events Report', subject: 'Social Studies', description: 'Write a report on a current national event.', dueDate: '2025-07-16', maxMarks: 30, obtainedMarks: null, status: 'overdue', fileName: null, submittedDate: null, teacherName: 'Suresh Babu' },
  ],
};

// ============================================================
// Per-student timetable
// ============================================================
export interface StudentTimetableSlot {
  id: string;
  period: string;
  time: string;
  subject: string;
  teacher: string;
  room: string;
  day: string;
}

const stdPeriods = [
  { period: '1', time: '08:00 - 08:45' },
  { period: '2', time: '08:45 - 09:30' },
  { period: '3', time: '09:30 - 10:15' },
  { period: '4', time: '10:30 - 11:15' },
  { period: '5', time: '11:15 - 12:00' },
  { period: '6', time: '13:00 - 13:45' },
  { period: '7', time: '13:45 - 14:30' },
];

const rahulSchedule: Record<string, { subject: string; teacher: string; room: string }> = {
  '1': { subject: 'Mathematics', teacher: 'Anjali Reddy', room: '10-A' },
  '2': { subject: 'Science', teacher: 'Anjali Reddy', room: 'Lab-1' },
  '3': { subject: 'English', teacher: 'Meena Iyer', room: '10-A' },
  '4': { subject: 'Social Studies', teacher: 'Suresh Babu', room: '10-A' },
  '5': { subject: 'Hindi', teacher: 'Kavita Singh', room: '10-A' },
  '6': { subject: 'Computer Science', teacher: 'Vikas Jain', room: 'Lab-2' },
  '7': { subject: 'Physical Education', teacher: 'Arun Das', room: 'Ground' },
};

const priyaSchedule: Record<string, { subject: string; teacher: string; room: string }> = {
  '1': { subject: 'English', teacher: 'Meena Iyer', room: '9-B' },
  '2': { subject: 'Mathematics', teacher: 'Anjali Reddy', room: '9-B' },
  '3': { subject: 'Hindi', teacher: 'Kavita Singh', room: '9-B' },
  '4': { subject: 'Science', teacher: 'Rajesh Kumar', room: 'Lab-2' },
  '5': { subject: 'Social Studies', teacher: 'Suresh Babu', room: '9-B' },
  '6': { subject: 'Computer Science', teacher: 'Vikas Jain', room: 'Lab-2' },
  '7': { subject: 'Art', teacher: 'Lakshmi Pillai', room: 'Art Room' },
};

const arjunSchedule: Record<string, { subject: string; teacher: string; room: string }> = {
  '1': { subject: 'Mathematics', teacher: 'Rajesh Kumar', room: '8-A' },
  '2': { subject: 'English', teacher: 'Meena Iyer', room: '8-A' },
  '3': { subject: 'Science', teacher: 'Rajesh Kumar', room: 'Lab-2' },
  '4': { subject: 'Social Studies', teacher: 'Suresh Babu', room: '8-A' },
  '5': { subject: 'Hindi', teacher: 'Kavita Singh', room: '8-A' },
  '6': { subject: 'Computer Science', teacher: 'Vikas Jain', room: 'Lab-2' },
  '7': { subject: 'Physical Education', teacher: 'Arun Das', room: 'Ground' },
};

function genTimetable(schedule: Record<string, { subject: string; teacher: string; room: string }>, studentId: string): StudentTimetableSlot[] {
  const dayList = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  // vary slightly by day
  return dayList.flatMap((day) =>
    stdPeriods.map((p) => {
      const base = schedule[p.period];
      const shuffleKey = `${day}-${p.period}`;
      // Free period on some slots
      const isFree = (day === 'Wed' && p.period === '7') || (day === 'Fri' && p.period === '6');
      return {
        id: `tt-${studentId}-${shuffleKey}`,
        period: p.period,
        time: p.time,
        subject: isFree ? 'Free' : base.subject,
        teacher: isFree ? '—' : base.teacher,
        room: isFree ? '—' : base.room,
        day,
      };
    })
  );
}

export const studentTimetable: Record<StudentKey, StudentTimetableSlot[]> = {
  rahul: genTimetable(rahulSchedule, 'rahul'),
  priya: genTimetable(priyaSchedule, 'priya'),
  arjun: genTimetable(arjunSchedule, 'arjun'),
};

// ============================================================
// Per-student exams
// ============================================================
export interface StudentExam {
  id: string;
  name: string;
  subject: string;
  date: string;
  time: string;
  duration: string;
  maxMarks: number;
  room: string;
  status: 'upcoming' | 'completed';
  obtainedMarks?: number;
}

export const studentExams: Record<StudentKey, StudentExam[]> = {
  rahul: [
    { id: 'se-r-1', name: 'Mid-Term Mathematics', subject: 'Mathematics', date: '2025-07-20', time: '09:00 AM', duration: '3 hours', maxMarks: 100, room: 'Hall A', status: 'upcoming' },
    { id: 'se-r-2', name: 'Mid-Term Science', subject: 'Science', date: '2025-07-23', time: '09:00 AM', duration: '3 hours', maxMarks: 100, room: 'Hall A', status: 'upcoming' },
    { id: 'se-r-3', name: 'Mid-Term English', subject: 'English', date: '2025-07-25', time: '09:00 AM', duration: '3 hours', maxMarks: 100, room: 'Hall B', status: 'upcoming' },
    { id: 'se-r-4', name: 'Unit Test 1 - Mathematics', subject: 'Mathematics', date: '2025-06-15', time: '09:00 AM', duration: '1 hour', maxMarks: 50, room: '10-A', status: 'completed', obtainedMarks: 46 },
  ],
  priya: [
    { id: 'se-p-1', name: 'Mid-Term Mathematics', subject: 'Mathematics', date: '2025-07-20', time: '09:00 AM', duration: '3 hours', maxMarks: 100, room: 'Hall C', status: 'upcoming' },
    { id: 'se-p-2', name: 'Mid-Term Science', subject: 'Science', date: '2025-07-22', time: '09:00 AM', duration: '3 hours', maxMarks: 100, room: 'Hall C', status: 'upcoming' },
    { id: 'se-p-3', name: 'Unit Test 1 - English', subject: 'English', date: '2025-06-15', time: '09:00 AM', duration: '1 hour', maxMarks: 50, room: '9-B', status: 'completed', obtainedMarks: 42 },
  ],
  arjun: [
    { id: 'se-a-1', name: 'Mid-Term Mathematics', subject: 'Mathematics', date: '2025-07-21', time: '09:00 AM', duration: '3 hours', maxMarks: 100, room: 'Hall D', status: 'upcoming' },
    { id: 'se-a-2', name: 'Mid-Term Science', subject: 'Science', date: '2025-07-24', time: '09:00 AM', duration: '3 hours', maxMarks: 100, room: 'Hall D', status: 'upcoming' },
    { id: 'se-a-3', name: 'Unit Test 1 - Science', subject: 'Science', date: '2025-06-15', time: '09:00 AM', duration: '1 hour', maxMarks: 50, room: '8-A', status: 'completed', obtainedMarks: 30 },
  ],
};

// ============================================================
// Per-student fees
// ============================================================
export interface StudentFee {
  id: string;
  feeType: string;
  amount: number;
  paidAmount: number;
  dueDate: string;
  paymentDate: string | null;
  status: 'paid' | 'pending' | 'partial' | 'overdue';
  method: string | null;
  receiptNo: string | null;
}

export const studentFees: Record<StudentKey, StudentFee[]> = {
  rahul: [
    { id: 'sf-r-1', feeType: 'Tuition Fee Q1', amount: 45000, paidAmount: 45000, dueDate: '2025-04-15', paymentDate: '2025-04-10', status: 'paid', method: 'UPI', receiptNo: 'RCP-00123' },
    { id: 'sf-r-2', feeType: 'Tuition Fee Q2', amount: 45000, paidAmount: 45000, dueDate: '2025-07-15', paymentDate: '2025-07-01', status: 'paid', method: 'Bank Transfer', receiptNo: 'RCP-00187' },
    { id: 'sf-r-3', feeType: 'Transport Fee Q2', amount: 8000, paidAmount: 8000, dueDate: '2025-07-15', paymentDate: '2025-07-01', status: 'paid', method: 'UPI', receiptNo: 'RCP-00188' },
    { id: 'sf-r-4', feeType: 'Lab Fee', amount: 5000, paidAmount: 0, dueDate: '2025-08-15', paymentDate: null, status: 'pending', method: null, receiptNo: null },
  ],
  priya: [
    { id: 'sf-p-1', feeType: 'Tuition Fee Q1', amount: 45000, paidAmount: 45000, dueDate: '2025-04-15', paymentDate: '2025-04-12', status: 'paid', method: 'Card', receiptNo: 'RCP-00210' },
    { id: 'sf-p-2', feeType: 'Tuition Fee Q2', amount: 45000, paidAmount: 30000, dueDate: '2025-07-15', paymentDate: '2025-07-10', status: 'partial', method: 'Cash', receiptNo: 'RCP-00256' },
    { id: 'sf-p-3', feeType: 'Transport Fee Q2', amount: 8000, paidAmount: 0, dueDate: '2025-07-15', paymentDate: null, status: 'overdue', method: null, receiptNo: null },
    { id: 'sf-p-4', feeType: 'Library Fee', amount: 2000, paidAmount: 2000, dueDate: '2025-06-30', paymentDate: '2025-06-15', status: 'paid', method: 'UPI', receiptNo: 'RCP-00198' },
  ],
  arjun: [
    { id: 'sf-a-1', feeType: 'Tuition Fee Q1', amount: 45000, paidAmount: 45000, dueDate: '2025-04-15', paymentDate: '2025-04-08', status: 'paid', method: 'Bank Transfer', receiptNo: 'RCP-00301' },
    { id: 'sf-a-2', feeType: 'Tuition Fee Q2', amount: 45000, paidAmount: 0, dueDate: '2025-07-15', paymentDate: null, status: 'overdue', method: null, receiptNo: null },
    { id: 'sf-a-3', feeType: 'Transport Fee Q2', amount: 8000, paidAmount: 0, dueDate: '2025-07-15', paymentDate: null, status: 'overdue', method: null, receiptNo: null },
    { id: 'sf-a-4', feeType: 'Exam Fee', amount: 3000, paidAmount: 0, dueDate: '2025-08-01', paymentDate: null, status: 'pending', method: null, receiptNo: null },
  ],
};

export const studentFeeSummary: Record<StudentKey, { totalDue: number; totalPaid: number; pending: number; status: string }> = {
  rahul: { totalDue: 103000, totalPaid: 98000, pending: 5000, status: 'Up to date' },
  priya: { totalDue: 100000, totalPaid: 77000, pending: 23000, status: 'Partial payment' },
  arjun: { totalDue: 101000, totalPaid: 45000, pending: 56000, status: 'Overdue' },
};

// ============================================================
// Per-student library
// ============================================================
export interface StudentLibraryBook {
  id: string;
  title: string;
  author: string;
  isbn: string;
  issueDate: string;
  dueDate: string;
  returnDate: string | null;
  status: 'borrowed' | 'returned' | 'overdue';
  fine: number;
}

export const studentLibrary: Record<StudentKey, StudentLibraryBook[]> = {
  rahul: [
    { id: 'lib-r-1', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', isbn: '978-07432-7356', issueDate: '2025-07-01', dueDate: '2025-07-15', returnDate: '2025-07-14', status: 'returned', fine: 0 },
    { id: 'lib-r-2', title: 'Sapiens', author: 'Yuval Noah Harari', isbn: '978-00623-1609', issueDate: '2025-07-10', dueDate: '2025-07-24', returnDate: null, status: 'borrowed', fine: 0 },
    { id: 'lib-r-3', title: 'Atomic Habits', author: 'James Clear', isbn: '978-07394-1055', issueDate: '2025-06-20', dueDate: '2025-07-04', returnDate: null, status: 'overdue', fine: 120 },
  ],
  priya: [
    { id: 'lib-p-1', title: 'To Kill a Mockingbird', author: 'Harper Lee', isbn: '978-04463-1076', issueDate: '2025-07-05', dueDate: '2025-07-19', returnDate: null, status: 'borrowed', fine: 0 },
    { id: 'lib-p-2', title: 'Pride and Prejudice', author: 'Jane Austen', isbn: '978-01414-3951', issueDate: '2025-06-28', dueDate: '2025-07-12', returnDate: '2025-07-11', status: 'returned', fine: 0 },
  ],
  arjun: [
    { id: 'lib-a-1', title: 'The Hobbit', author: 'J.R.R. Tolkien', isbn: '978-05479-2827', issueDate: '2025-07-08', dueDate: '2025-07-22', returnDate: null, status: 'borrowed', fine: 0 },
    { id: 'lib-a-2', title: 'Dune', author: 'Frank Herbert', isbn: '978-04410-1269', issueDate: '2025-06-15', dueDate: '2025-06-29', returnDate: null, status: 'overdue', fine: 320 },
    { id: 'lib-a-3', title: 'The Alchemist', author: 'Paulo Coelho', isbn: '978-00611-2391', issueDate: '2025-05-20', dueDate: '2025-06-03', returnDate: '2025-06-01', status: 'returned', fine: 0 },
  ],
};

// ============================================================
// Per-student transport
// ============================================================
export interface StudentTransport {
  routeNumber: string;
  routeName: string;
  driver: string;
  driverPhone: string;
  vehicleNumber: string;
  pickupPoint: string;
  pickupTime: string;
  dropTime: string;
  fare: number;
  status: 'active' | 'inactive';
}

export const studentTransport: Record<StudentKey, StudentTransport> = {
  rahul: {
    routeNumber: 'R3',
    routeName: 'Indiranagar Route',
    driver: 'Manjunath K',
    driverPhone: '+91 90123 45678',
    vehicleNumber: 'KA01 3456',
    pickupPoint: 'CMH Road, Indiranagar',
    pickupTime: '07:15 AM',
    dropTime: '03:45 PM',
    fare: 8000,
    status: 'active',
  },
  priya: {
    routeNumber: 'R5',
    routeName: 'Jayanagar Route',
    driver: 'Suresh N',
    driverPhone: '+91 90234 56789',
    vehicleNumber: 'KA01 5678',
    pickupPoint: 'Jayanagar 4th Block',
    pickupTime: '07:25 AM',
    dropTime: '03:35 PM',
    fare: 7500,
    status: 'active',
  },
  arjun: {
    routeNumber: 'R1',
    routeName: 'Whitefield Route',
    driver: 'Ravi Kumar',
    driverPhone: '+91 90345 67890',
    vehicleNumber: 'KA01 1234',
    pickupPoint: 'Hope Farm Circle, Whitefield',
    pickupTime: '07:00 AM',
    dropTime: '04:00 PM',
    fare: 9000,
    status: 'active',
  },
};

// ============================================================
// Per-student announcements
// ============================================================
export interface StudentAnnouncement {
  id: string;
  title: string;
  content: string;
  from: string;
  date: string;
  category: string;
  read: boolean;
}

export const studentAnnouncements: Record<StudentKey, StudentAnnouncement[]> = {
  rahul: [
    { id: 'san-r-1', title: 'Math Test on Trigonometry', content: 'Surprise test on Chapter 8 this Friday. Prepare thoroughly.', from: 'Ms. Anjali Reddy', date: '2025-07-15', category: 'Academics', read: false },
    { id: 'san-r-2', title: 'PTM on July 18', content: 'Parent-teacher meeting on July 18 at 10:00 AM. Parents are requested to attend.', from: 'Principal Office', date: '2025-07-14', category: 'Event', read: false },
    { id: 'san-r-3', title: 'Science Exhibition Registration', content: 'Science exhibition on Aug 2. Register your projects by July 20.', from: 'Science Department', date: '2025-07-13', category: 'Event', read: true },
    { id: 'san-r-4', title: 'Robotics Club Meeting', content: 'Robotics club meeting on Wednesday at 3:45 PM in Lab-2.', from: 'Mr. Vikas Jain', date: '2025-07-12', category: 'Club', read: true },
  ],
  priya: [
    { id: 'san-p-1', title: 'Debate Competition Selection', content: 'Selection for inter-school debate on July 25. Interested students contact Ms. Iyer.', from: 'Ms. Meena Iyer', date: '2025-07-15', category: 'Competition', read: false },
    { id: 'san-p-2', title: 'PTM on July 18', content: 'Parent-teacher meeting on July 18 at 10:00 AM.', from: 'Principal Office', date: '2025-07-14', category: 'Event', read: true },
    { id: 'san-p-3', title: 'Choir Practice Cancelled', content: 'Choir practice on Friday is cancelled. Next practice on Monday.', from: 'Ms. Gita Sharma', date: '2025-07-11', category: 'Club', read: true },
  ],
  arjun: [
    { id: 'san-a-1', title: 'Cricket Team Selection', content: 'Cricket team selection trials on July 19 at 4:00 PM on the school ground.', from: 'Mr. Arun Das', date: '2025-07-15', category: 'Sports', read: false },
    { id: 'san-a-2', title: 'Overdue Library Books', content: 'You have overdue library books. Please return them and clear fines immediately.', from: 'Librarian', date: '2025-07-14', category: 'Library', read: false },
    { id: 'san-a-3', title: 'Fee Payment Overdue', content: 'Your Q2 tuition and transport fees are overdue. Please clear them at the earliest.', from: 'Accounts Office', date: '2025-07-13', category: 'Fees', read: false },
    { id: 'san-a-4', title: 'PTM on July 18', content: 'Parent-teacher meeting on July 18 at 10:00 AM.', from: 'Principal Office', date: '2025-07-12', category: 'Event', read: true },
  ],
};

// ============================================================
// Per-student messages
// ============================================================
export interface StudentMessage {
  id: string;
  senderName: string;
  senderRole: string;
  subject: string;
  preview: string;
  content: string;
  date: string;
  read: boolean;
}

export const studentMessages: Record<StudentKey, StudentMessage[]> = {
  rahul: [
    { id: 'sm-r-1', senderName: 'Anjali Reddy', senderRole: 'Teacher', subject: 'Excellent work on Algebra!', preview: 'Great job on the algebra worksheet. You scored full marks!', content: 'Dear Rahul,\n\nExcellent work on the algebra worksheet! You scored full marks. Keep up the great effort.\n\nBest,\nMs. Anjali', date: '2025-07-15', read: false },
    { id: 'sm-r-2', senderName: 'Dr. Vikram Rao', senderRole: 'Principal', subject: 'Robotics Club Selection', preview: 'Congratulations on being selected for the robotics club...', content: 'Dear Rahul,\n\nCongratulations on being selected for the school robotics club. The first meeting is on Wednesday.\n\nBest regards,\nDr. Vikram Rao', date: '2025-07-13', read: true },
  ],
  priya: [
    { id: 'sm-p-1', senderName: 'Meena Iyer', senderRole: 'Teacher', subject: 'Debate Competition', preview: 'You\'ve been selected to represent the school...', content: 'Dear Priya,\n\nYou have been selected to represent the school at the inter-school debate competition. Practice sessions start next week.\n\nBest,\nMs. Meena', date: '2025-07-14', read: false },
    { id: 'sm-p-2', senderName: 'Accounts Office', senderRole: 'Staff', subject: 'Partial Fee Payment', preview: 'Your Q2 tuition fee is partially paid. Balance of ₹15,000...', content: 'Dear Priya,\n\nYour Q2 tuition fee is partially paid. The balance of ₹15,000 is due. Please clear it at the earliest.\n\nAccounts Office', date: '2025-07-12', read: true },
  ],
  arjun: [
    { id: 'sm-a-1', senderName: 'Rajesh Kumar', senderRole: 'Teacher', subject: 'Homework Overdue', preview: 'Your fractions worksheet is overdue. Please submit immediately...', content: 'Dear Arjun,\n\nYour fractions worksheet is overdue. Please submit it immediately. If you need help, I am available after school.\n\nMr. Rajesh', date: '2025-07-15', read: false },
    { id: 'sm-a-2', senderName: 'Librarian', senderRole: 'Staff', subject: 'Overdue Book Fine', preview: 'You have an overdue book with a fine of ₹320...', content: 'Dear Arjun,\n\nYou have an overdue book (Dune) with a fine of ₹320. Please return the book and clear the fine.\n\nLibrarian', date: '2025-07-14', read: false },
    { id: 'sm-a-3', senderName: 'Arun Das', senderRole: 'Teacher', subject: 'Cricket Trials', preview: 'Cricket team selection trials on July 19...', content: 'Dear Arjun,\n\nCricket team selection trials are on July 19 at 4:00 PM. Make sure you attend with your sports kit.\n\nMr. Arun', date: '2025-07-13', read: true },
  ],
};

// ============================================================
// Per-student notifications
// ============================================================
export interface StudentNotification {
  id: string;
  title: string;
  time: string;
  type: string;
  read: boolean;
}

export const studentNotifications: Record<StudentKey, StudentNotification[]> = {
  rahul: [
    { id: 'sn-r-1', title: 'Math test on Friday — Trigonometry', time: '5 min ago', type: 'exam', read: false },
    { id: 'sn-r-2', title: 'Chemistry lab report due in 2 days', time: '1 hour ago', type: 'homework', read: false },
    { id: 'sn-r-3', title: 'Robotics club meeting tomorrow at 3:45 PM', time: '3 hours ago', type: 'event', read: false },
    { id: 'sn-r-4', title: 'PTM on July 18 at 10:00 AM', time: '1 day ago', type: 'event', read: true },
  ],
  priya: [
    { id: 'sn-p-1', title: 'Debate competition selection on July 25', time: '10 min ago', type: 'event', read: false },
    { id: 'sn-p-2', title: 'Overdue: Periodic Table homework', time: '2 hours ago', type: 'homework', read: false },
    { id: 'sn-p-3', title: 'Transport fee overdue — please pay', time: '5 hours ago', type: 'fee', read: false },
    { id: 'sn-p-4', title: 'Choir practice cancelled on Friday', time: '1 day ago', type: 'event', read: true },
  ],
  arjun: [
    { id: 'sn-a-1', title: 'Cricket team trials on July 19', time: '5 min ago', type: 'sports', read: false },
    { id: 'sn-a-2', title: 'Overdue library book: Dune — Fine ₹320', time: '30 min ago', type: 'library', read: false },
    { id: 'sn-a-3', title: 'Q2 tuition fee overdue — ₹45,000', time: '2 hours ago', type: 'fee', read: false },
    { id: 'sn-a-4', title: 'Overdue homework: Fractions Worksheet', time: '5 hours ago', type: 'homework', read: false },
    { id: 'sn-a-5', title: 'PTM on July 18 at 10:00 AM', time: '1 day ago', type: 'event', read: true },
  ],
};

// ============================================================
// Per-student downloads
// ============================================================
export interface StudentDownload {
  id: string;
  name: string;
  type: string;
  subject: string;
  uploadedDate: string;
  fileSize: string;
  category: 'Notes' | 'Worksheet' | 'Past Paper' | 'Schedule' | 'Report Card';
}

export const studentDownloads: Record<StudentKey, StudentDownload[]> = {
  rahul: [
    { id: 'dl-r-1', name: 'Trigonometry Notes Ch.8', type: 'PDF', subject: 'Mathematics', uploadedDate: '2025-07-14', fileSize: '2.4 MB', category: 'Notes' },
    { id: 'dl-r-2', name: 'Acid-Base Titration Lab Guide', type: 'PDF', subject: 'Science', uploadedDate: '2025-07-12', fileSize: '1.1 MB', category: 'Notes' },
    { id: 'dl-r-3', name: 'Mid-Term Exam Schedule', type: 'PDF', subject: 'General', uploadedDate: '2025-07-05', fileSize: '320 KB', category: 'Schedule' },
    { id: 'dl-r-4', name: 'Unit Test 1 — Mathematics (Past Paper)', type: 'PDF', subject: 'Mathematics', uploadedDate: '2025-06-16', fileSize: '480 KB', category: 'Past Paper' },
    { id: 'dl-r-5', name: 'Q1 Report Card', type: 'PDF', subject: 'General', uploadedDate: '2025-06-20', fileSize: '850 KB', category: 'Report Card' },
    { id: 'dl-r-6', name: 'Algebra Worksheet #5', type: 'PDF', subject: 'Mathematics', uploadedDate: '2025-07-14', fileSize: '180 KB', category: 'Worksheet' },
  ],
  priya: [
    { id: 'dl-p-1', name: 'Geometry Proofs Handout', type: 'PDF', subject: 'Mathematics', uploadedDate: '2025-07-10', fileSize: '1.8 MB', category: 'Notes' },
    { id: 'dl-p-2', name: 'Letter Writing Examples', type: 'PDF', subject: 'English', uploadedDate: '2025-07-14', fileSize: '640 KB', category: 'Notes' },
    { id: 'dl-p-3', name: 'Hindi Sandhi Exercise Sheet', type: 'PDF', subject: 'Hindi', uploadedDate: '2025-07-15', fileSize: '220 KB', category: 'Worksheet' },
    { id: 'dl-p-4', name: 'Mid-Term Exam Schedule', type: 'PDF', subject: 'General', uploadedDate: '2025-07-05', fileSize: '320 KB', category: 'Schedule' },
    { id: 'dl-p-5', name: 'Q1 Report Card', type: 'PDF', subject: 'General', uploadedDate: '2025-06-20', fileSize: '850 KB', category: 'Report Card' },
  ],
  arjun: [
    { id: 'dl-a-1', name: 'Fractions Worksheet', type: 'PDF', subject: 'Mathematics', uploadedDate: '2025-07-14', fileSize: '340 KB', category: 'Worksheet' },
    { id: 'dl-a-2', name: 'Plant Cell Diagram Reference', type: 'PDF', subject: 'Science', uploadedDate: '2025-07-12', fileSize: '1.2 MB', category: 'Notes' },
    { id: 'dl-a-3', name: 'Python Programming Basics', type: 'PDF', subject: 'Computer Science', uploadedDate: '2025-07-15', fileSize: '2.8 MB', category: 'Notes' },
    { id: 'dl-a-4', name: 'Mid-Term Exam Schedule', type: 'PDF', subject: 'General', uploadedDate: '2025-07-05', fileSize: '320 KB', category: 'Schedule' },
    { id: 'dl-a-5', name: 'Q1 Report Card', type: 'PDF', subject: 'General', uploadedDate: '2025-06-20', fileSize: '850 KB', category: 'Report Card' },
    { id: 'dl-a-6', name: 'Map Reading Worksheet', type: 'PDF', subject: 'Social Studies', uploadedDate: '2025-07-10', fileSize: '440 KB', category: 'Worksheet' },
  ],
};

// ============================================================
// Per-student dashboard stats
// ============================================================
export interface StudentDashboardStats {
  attendance: number;
  avgMarks: number;
  homeworkDue: number;
  upcomingExams: number;
  feeStatus: string;
  feePending: number;
  unreadMessages: number;
  unreadAnnouncements: number;
  rank: number;
  totalStudents: number;
}

export const studentDashboardStats: Record<StudentKey, StudentDashboardStats> = {
  rahul: { attendance: 93, avgMarks: 88, homeworkDue: 2, upcomingExams: 3, feeStatus: 'Paid', feePending: 5000, unreadMessages: 1, unreadAnnouncements: 2, rank: 3, totalStudents: 32 },
  priya: { attendance: 82, avgMarks: 79, homeworkDue: 2, upcomingExams: 2, feeStatus: 'Partial', feePending: 23000, unreadMessages: 1, unreadAnnouncements: 1, rank: 14, totalStudents: 28 },
  arjun: { attendance: 72, avgMarks: 64, homeworkDue: 3, upcomingExams: 2, feeStatus: 'Overdue', feePending: 56000, unreadMessages: 2, unreadAnnouncements: 3, rank: 26, totalStudents: 30 },
};

// ============================================================
// Subject-wise marks comparison for charts
// ============================================================
export const studentSubjectComparison: Record<StudentKey, { subject: string; marks: number; avg: number }[]> = {
  rahul: [
    { subject: 'Math', marks: 92, avg: 78 },
    { subject: 'Science', marks: 88, avg: 82 },
    { subject: 'English', marks: 85, avg: 85 },
    { subject: 'Social', marks: 78, avg: 79 },
    { subject: 'Hindi', marks: 90, avg: 88 },
    { subject: 'CS', marks: 95, avg: 91 },
  ],
  priya: [
    { subject: 'Math', marks: 72, avg: 75 },
    { subject: 'Science', marks: 80, avg: 78 },
    { subject: 'English', marks: 88, avg: 82 },
    { subject: 'Social', marks: 85, avg: 80 },
    { subject: 'Hindi', marks: 76, avg: 84 },
    { subject: 'CS', marks: 82, avg: 88 },
  ],
  arjun: [
    { subject: 'Math', marks: 55, avg: 72 },
    { subject: 'Science', marks: 68, avg: 76 },
    { subject: 'English', marks: 62, avg: 80 },
    { subject: 'Social', marks: 58, avg: 77 },
    { subject: 'Hindi', marks: 70, avg: 82 },
    { subject: 'CS', marks: 75, avg: 86 },
  ],
};

// Default student key for when auth profile is loaded
export function getStudentKey(username: string | undefined): StudentKey {
  if (username === 'rahul10') return 'rahul';
  if (username === 'priya09') return 'priya';
  if (username === 'arjun08') return 'arjun';

  if (typeof window !== 'undefined' && username === 'ramesh.sharma') {
    const storedKey = window.localStorage.getItem('yovial-parent-selected-child-ramesh.sharma');
    if (storedKey === 'rahul' || storedKey === 'priya' || storedKey === 'arjun') {
      return storedKey;
    }
  }

  return 'rahul';
}
