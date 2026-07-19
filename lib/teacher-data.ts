// ============================================================
// Yovial School ERP — Teacher Portal Demo Data
// Teacher: Anjali Reddy — Mathematics & Science
// ============================================================

export interface TeacherClass {
  id: string;
  name: string;
  grade: string;
  section: string;
  subject: string;
  students: number;
  time: string;
  room: string;
  day: string;
}

export const teacherClassTeacherResponsibility: TeacherClass = {
  id: 'tct-1',
  name: 'Grade 10-A',
  grade: '10',
  section: 'A',
  subject: 'Class Teacher',
  students: 32,
  time: '08:00 - 08:45',
  room: '10-A',
  day: 'Mon',
};

export const teacherClasses: TeacherClass[] = [
  { id: 'tc-1', name: 'Grade 9-A Mathematics', grade: '9', section: 'A', subject: 'Mathematics', students: 30, time: '08:00 - 08:45', room: '9-A', day: 'Tue' },
  { id: 'tc-2', name: 'Grade 9-B Mathematics', grade: '9', section: 'B', subject: 'Mathematics', students: 28, time: '09:30 - 10:15', room: '9-B', day: 'Mon' },
  { id: 'tc-3', name: 'Grade 10-A Mathematics', grade: '10', section: 'A', subject: 'Mathematics', students: 32, time: '11:15 - 12:00', room: '10-A', day: 'Mon' },
  { id: 'tc-4', name: 'Grade 10-B Mathematics', grade: '10', section: 'B', subject: 'Mathematics', students: 34, time: '08:00 - 08:45', room: '10-B', day: 'Tue' },
  { id: 'tc-5', name: 'Grade 8-A Science', grade: '8', section: 'A', subject: 'Science', students: 31, time: '09:30 - 10:15', room: 'Lab-1', day: 'Mon' },
  { id: 'tc-6', name: 'Grade 8-B Science', grade: '8', section: 'B', subject: 'Science', students: 29, time: '11:15 - 12:00', room: 'Lab-2', day: 'Tue' },
];

export interface StudentInClass {
  id: string;
  rollNumber: number;
  name: string;
  classGrade: string;
  section: string;
  attendance: number;
  avgMarks: number;
  parentName: string;
  parentPhone: string;
}

const FIRST_NAMES = ['Aarav', 'Sneha', 'Karthik', 'Ananya', 'Vikram', 'Diya', 'Rohan', 'Priya', 'Arjun', 'Meera', 'Kabir', 'Ishaan', 'Kiara', 'Aditya', 'Pooja', 'Nikhil', 'Tanvi', 'Sahil', 'Riya', 'Dhruv', 'Kavya', 'Nisha', 'Pranav', 'Sara', 'Shaurya', 'Vedika', 'Vihaan', 'Anika', 'Aryan', 'Ira', 'Yash', 'Zara'];
const LAST_NAMES = ['Sharma', 'Patel', 'Reddy', 'Nair', 'Iyer', 'Singh', 'Gupta', 'Jain', 'Kumar', 'Rao', 'Desai', 'Menon', 'Shetty', 'Bhat', 'Mehta'];

function pick<T>(arr: T[], seed: number): T {
  return arr[seed % arr.length];
}

export const classStudents: StudentInClass[] = Array.from({ length: 32 }, (_, i) => {
  const seed = i + 1;
  const fn = pick(FIRST_NAMES, seed * 7);
  const ln = pick(LAST_NAMES, seed * 13);
  return {
    id: `stu-${String(seed).padStart(3, '0')}`,
    rollNumber: seed,
    name: `${fn} ${ln}`,
    classGrade: '10',
    section: 'A',
    attendance: 75 + (seed * 7) % 25,
    avgMarks: 55 + (seed * 11) % 45,
    parentName: `${pick(['Ramesh', 'Suresh', 'Mahesh', 'Rajesh', 'Dinesh'], seed)} ${ln}`,
    parentPhone: `+91 900${String(seed).padStart(2, '0')} ${String(seed * 1234).slice(0, 5)}`,
  };
});

export interface AttendanceEntry {
  id: string;
  studentId: string;
  studentName: string;
  rollNumber: number;
  date: string;
  status: 'present' | 'absent' | 'late';
  classGrade: string;
  section: string;
  markedBy: string;
}

export const attendanceHistory: AttendanceEntry[] = Array.from({ length: 5 }, (_, dayIdx) => {
  const date = new Date(2025, 6, 16 - dayIdx);
  const dateStr = date.toISOString().split('T')[0];
  return classStudents.slice(0, 32).map((s, i) => ({
    id: `att-${dayIdx}-${i}`,
    studentId: s.id,
    studentName: s.name,
    rollNumber: s.rollNumber,
    date: dateStr,
    status: (i + dayIdx) % 7 === 0 ? 'absent' as const : (i + dayIdx) % 5 === 0 ? 'late' as const : 'present' as const,
    classGrade: '10',
    section: 'A',
    markedBy: 'Anjali Reddy',
  }));
}).flat();

export interface HomeworkItem {
  id: string;
  title: string;
  description: string;
  subject: string;
  classGrade: string;
  section: string;
  assignedDate: string;
  dueDate: string;
  submissions: number;
  totalStudents: number;
  status: 'active' | 'completed' | 'overdue';
  attachments: string[];
}

export const homeworkList: HomeworkItem[] = [
  { id: 'hw-1', title: 'Algebra Worksheet #5', description: 'Solve all problems from Exercise 5.2 — Linear equations in one variable.', subject: 'Mathematics', classGrade: '10', section: 'A', assignedDate: '2025-07-14', dueDate: '2025-07-16', submissions: 28, totalStudents: 32, status: 'active', attachments: ['algebra-worksheet-5.pdf'] },
  { id: 'hw-2', title: 'Chemistry Lab Report', description: 'Write a detailed lab report on the acid-base titration experiment conducted in Lab-1.', subject: 'Science', classGrade: '10', section: 'A', assignedDate: '2025-07-12', dueDate: '2025-07-18', submissions: 25, totalStudents: 32, status: 'active', attachments: ['lab-report-template.docx'] },
  { id: 'hw-3', title: 'Trigonometry Problems', description: 'Solve problems 1-20 from Chapter 8 — Introduction to Trigonometry.', subject: 'Mathematics', classGrade: '10', section: 'A', assignedDate: '2025-07-15', dueDate: '2025-07-20', submissions: 30, totalStudents: 32, status: 'active', attachments: [] },
  { id: 'hw-4', title: 'Geometry Proofs', description: 'Complete the proof exercises for triangles and circles from Chapter 6.', subject: 'Mathematics', classGrade: '9', section: 'B', assignedDate: '2025-07-10', dueDate: '2025-07-14', submissions: 28, totalStudents: 28, status: 'completed', attachments: ['geometry-proofs.pdf'] },
  { id: 'hw-5', title: 'Periodic Table Study', description: 'Memorize first 20 elements with atomic numbers and symbols.', subject: 'Science', classGrade: '9', section: 'B', assignedDate: '2025-07-13', dueDate: '2025-07-15', submissions: 20, totalStudents: 28, status: 'overdue', attachments: [] },
  { id: 'hw-6', title: 'Quadratic Equations', description: 'Solve all problems from Exercise 4.3 — Quadratic equations by factorization.', subject: 'Mathematics', classGrade: '10', section: 'B', assignedDate: '2025-07-11', dueDate: '2025-07-17', submissions: 22, totalStudents: 34, status: 'active', attachments: [] },
];

export interface Assignment {
  id: string;
  title: string;
  description: string;
  subject: string;
  classGrade: string;
  section: string;
  dueDate: string;
  maxMarks: number;
  fileName: string;
  fileSize: string;
  uploadDate: string;
  submissions: number;
  totalStudents: number;
  status: 'active' | 'completed' | 'overdue';
}

export const assignmentList: Assignment[] = [
  { id: 'asg-1', title: 'Math Project: Real-world Applications of Trigonometry', description: 'Create a project showing how trigonometry is used in architecture, navigation, and astronomy.', subject: 'Mathematics', classGrade: '10', section: 'A', dueDate: '2025-07-25', maxMarks: 50, fileName: 'trig-project-guide.pdf', fileSize: '2.4 MB', uploadDate: '2025-07-10', submissions: 12, totalStudents: 32, status: 'active' },
  { id: 'asg-2', title: 'Science Fair Project Proposal', description: 'Submit a 2-page proposal for the upcoming science exhibition. Include hypothesis, methodology, and expected results.', subject: 'Science', classGrade: '10', section: 'A', dueDate: '2025-07-22', maxMarks: 30, fileName: 'science-fair-rubric.pdf', fileSize: '1.1 MB', uploadDate: '2025-07-08', submissions: 18, totalStudents: 32, status: 'active' },
  { id: 'asg-3', title: 'Statistics Data Analysis Report', description: 'Analyze the provided dataset and create a report with charts and conclusions.', subject: 'Mathematics', classGrade: '9', section: 'B', dueDate: '2025-07-19', maxMarks: 40, fileName: 'statistics-dataset.xlsx', fileSize: '340 KB', uploadDate: '2025-07-12', submissions: 26, totalStudents: 28, status: 'active' },
  { id: 'asg-4', title: 'Chemical Reactions Model', description: 'Build a 3D model demonstrating any chemical reaction of your choice.', subject: 'Science', classGrade: '9', section: 'B', dueDate: '2025-07-05', maxMarks: 50, fileName: 'model-guidelines.pdf', fileSize: '1.8 MB', uploadDate: '2025-06-20', submissions: 28, totalStudents: 28, status: 'completed' },
];

export interface TimetableSlot {
  id: string;
  period: string;
  time: string;
  subject: string;
  classGrade: string;
  section: string;
  room: string;
  day: string;
}

const periods = [
  { period: '1', time: '08:00 - 08:45' },
  { period: '2', time: '08:45 - 09:30' },
  { period: '3', time: '09:30 - 10:15' },
  { period: '4', time: '10:30 - 11:15' },
  { period: '5', time: '11:15 - 12:00' },
  { period: '6', time: '13:00 - 13:45' },
  { period: '7', time: '13:45 - 14:30' },
];
const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

const scheduleMap: Record<string, { subject: string; grade: string; section: string; room: string } | null> = {
  'Mon-1': { subject: 'Mathematics', grade: '10', section: 'A', room: '10-A' },
  'Mon-2': { subject: 'Mathematics', grade: '9', section: 'B', room: '9-B' },
  'Mon-3': null,
  'Mon-4': null,
  'Mon-5': { subject: 'Science', grade: '10', section: 'A', room: 'Lab-1' },
  'Mon-6': { subject: 'Mathematics', grade: '10', section: 'B', room: '10-B' },
  'Mon-7': null,
  'Tue-1': { subject: 'Mathematics', grade: '9', section: 'A', room: '9-A' },
  'Tue-2': { subject: 'Mathematics', grade: '10', section: 'B', room: '10-B' },
  'Tue-3': { subject: 'Science', grade: '9', section: 'B', room: 'Lab-2' },
  'Tue-4': null,
  'Tue-5': { subject: 'Mathematics', grade: '10', section: 'A', room: '10-A' },
  'Tue-6': null,
  'Tue-7': null,
  'Wed-1': { subject: 'Mathematics', grade: '10', section: 'A', room: '10-A' },
  'Wed-2': null,
  'Wed-3': { subject: 'Science', grade: '10', section: 'A', room: 'Lab-1' },
  'Wed-4': { subject: 'Mathematics', grade: '9', section: 'B', room: '9-B' },
  'Wed-5': null,
  'Wed-6': { subject: 'Mathematics', grade: '10', section: 'B', room: '10-B' },
  'Wed-7': null,
  'Thu-1': { subject: 'Mathematics', grade: '9', section: 'A', room: '9-A' },
  'Thu-2': { subject: 'Mathematics', grade: '10', section: 'A', room: '10-A' },
  'Thu-3': null,
  'Thu-4': { subject: 'Science', grade: '9', section: 'B', room: 'Lab-2' },
  'Thu-5': { subject: 'Mathematics', grade: '10', section: 'B', room: '10-B' },
  'Thu-6': null,
  'Thu-7': null,
  'Fri-1': { subject: 'Mathematics', grade: '10', section: 'A', room: '10-A' },
  'Fri-2': { subject: 'Science', grade: '10', section: 'A', room: 'Lab-1' },
  'Fri-3': { subject: 'Mathematics', grade: '9', section: 'B', room: '9-B' },
  'Fri-4': { subject: 'Mathematics', grade: '10', section: 'B', room: '10-B' },
  'Fri-5': null,
  'Fri-6': null,
  'Fri-7': null,
};

export const teacherTimetable: TimetableSlot[] = days.flatMap((day) =>
  periods.map((p) => {
    const key = `${day}-${p.period}`;
    const slot = scheduleMap[key];
    return {
      id: `tt-${day}-${p.period}`,
      period: p.period,
      time: p.time,
      subject: slot?.subject ?? '—',
      classGrade: slot?.grade ?? '',
      section: slot?.section ?? '',
      room: slot?.room ?? '',
      day,
    };
  })
);

export interface MarkEntry {
  id: string;
  studentId: string;
  studentName: string;
  rollNumber: number;
  examName: string;
  subject: string;
  maxMarks: number;
  obtainedMarks: number;
  grade: string;
}

export const marksEntriesData: MarkEntry[] = classStudents.slice(0, 32).map((s, i) => {
  const obtained = 45 + (i * 13) % 55;
  const grade = obtained >= 90 ? 'A+' : obtained >= 80 ? 'A' : obtained >= 70 ? 'B' : obtained >= 60 ? 'C' : 'D';
  return {
    id: `mk-${i + 1}`,
    studentId: s.id,
    studentName: s.name,
    rollNumber: s.rollNumber,
    examName: 'Mid-Term Examination',
    subject: 'Mathematics',
    maxMarks: 100,
    obtainedMarks: obtained,
    grade,
  };
});

export interface TeacherAnnouncement {
  id: string;
  title: string;
  content: string;
  audience: string;
  date: string;
  status: 'sent' | 'draft';
  channel: string;
}

export const teacherAnnouncements: TeacherAnnouncement[] = [
  { id: 'tann-1', title: 'Math Test on Chapter 8 — Trigonometry', content: 'Dear students, there will be a surprise test on Chapter 8 (Trigonometry) this Friday. Please prepare thoroughly.', audience: 'Grade 10-A', date: '2025-07-15', status: 'sent', channel: 'In-app + SMS' },
  { id: 'tann-2', title: 'Science Lab Report Submission', content: 'All Grade 10-A students must submit their chemistry lab reports by July 18. Late submissions will be penalized.', audience: 'Grade 10-A', date: '2025-07-12', status: 'sent', channel: 'In-app' },
  { id: 'tann-3', title: 'Extra Classes for Grade 9-B', content: 'Extra remedial classes will be held on Saturdays from 9 AM to 11 AM for students who scored below 60% in the last test.', audience: 'Grade 9-B', date: '2025-07-10', status: 'sent', channel: 'In-app + Email' },
  { id: 'tann-4', title: 'Parent-Teacher Meeting Reminder', content: 'Draft announcement for PTM on July 18.', audience: 'Grade 10-A & B', date: '2025-07-14', status: 'draft', channel: 'SMS + Email' },
];

export interface LeaveRequest {
  id: string;
  studentName: string;
  rollNumber: number;
  classGrade: string;
  section: string;
  reason: string;
  fromDate: string;
  toDate: string;
  days: number;
  status: 'pending' | 'approved' | 'rejected';
  appliedDate: string;
  parentName: string;
}

export const leaveRequests: LeaveRequest[] = [
  { id: 'lv-1', studentName: 'Aarav Sharma', rollNumber: 3, classGrade: '10', section: 'A', reason: 'Family function out of town', fromDate: '2025-07-20', toDate: '2025-07-22', days: 3, status: 'pending', appliedDate: '2025-07-15', parentName: 'Ramesh Sharma' },
  { id: 'lv-2', studentName: 'Sneha Patel', rollNumber: 7, classGrade: '10', section: 'A', reason: 'Medical checkup', fromDate: '2025-07-18', toDate: '2025-07-18', days: 1, status: 'pending', appliedDate: '2025-07-14', parentName: 'Suresh Patel' },
  { id: 'lv-3', studentName: 'Karthik Reddy', rollNumber: 11, classGrade: '10', section: 'A', reason: 'Fever and cold', fromDate: '2025-07-16', toDate: '2025-07-17', days: 2, status: 'approved', appliedDate: '2025-07-15', parentName: 'Mahesh Reddy' },
  { id: 'lv-4', studentName: 'Ananya Nair', rollNumber: 15, classGrade: '10', section: 'A', reason: 'Religious ceremony', fromDate: '2025-07-19', toDate: '2025-07-19', days: 1, status: 'approved', appliedDate: '2025-07-12', parentName: 'Rajesh Nair' },
  { id: 'lv-5', studentName: 'Vikram Iyer', rollNumber: 19, classGrade: '10', section: 'A', reason: 'Out of state for sports tournament', fromDate: '2025-07-22', toDate: '2025-07-26', days: 5, status: 'rejected', appliedDate: '2025-07-13', parentName: 'Dinesh Iyer' },
  { id: 'lv-6', studentName: 'Diya Singh', rollNumber: 22, classGrade: '10', section: 'A', reason: 'Eye surgery follow-up', fromDate: '2025-07-21', toDate: '2025-07-21', days: 1, status: 'pending', appliedDate: '2025-07-16', parentName: 'Naresh Singh' },
];

export interface TeacherMessage {
  id: string;
  senderName: string;
  senderRole: string;
  subject: string;
  preview: string;
  content: string;
  date: string;
  read: boolean;
}

export const teacherMessages: TeacherMessage[] = [
  { id: 'tm-1', senderName: 'Dr. Vikram Rao', senderRole: 'Principal', subject: 'Mid-Term Exam Question Paper', preview: 'Please submit the Mathematics question paper for the mid-term by July 18...', content: 'Dear Anjali,\n\nPlease submit the Mathematics question paper for the mid-term examination by July 18. Ensure it covers all chapters from Term 1 and includes a mix of objective and subjective questions.\n\nBest regards,\nDr. Vikram Rao', date: '2025-07-15', read: false },
  { id: 'tm-2', senderName: 'Ramesh Sharma', senderRole: 'Parent', subject: 'Regarding Aarav\'s performance', preview: 'I wanted to discuss Aarav\'s recent math test results and how we can...', content: 'Dear Ms. Anjali,\n\nI wanted to discuss Aarav\'s recent math test results. He scored 72% which is below his usual performance. Could we schedule a meeting to discuss strategies?\n\nRegards,\nRamesh Sharma', date: '2025-07-14', read: false },
  { id: 'tm-3', senderName: 'Rajesh Kumar', senderRole: 'Teacher', subject: 'Lab Schedule for Next Week', preview: 'Hi Anjali, I wanted to coordinate the lab schedule for next week...', content: 'Hi Anjali,\n\nI wanted to coordinate the lab schedule for next week. Are you using Lab-1 on Monday and Wednesday as usual? I need to book Lab-2 for the science exhibition prep.\n\nThanks,\nRajesh', date: '2025-07-13', read: true },
  { id: 'tm-4', senderName: 'Kavita Singh', senderRole: 'Teacher', subject: 'Cross-subject Project Collaboration', preview: 'I\'m planning a cross-subject project for Grade 9 combining Hindi and...', content: 'Hi Anjali,\n\nI\'m planning a cross-subject project for Grade 9 combining Hindi literature with Mathematics (statistics on literary themes). Would you be interested in collaborating?\n\nBest,\nKavita', date: '2025-07-12', read: true },
  { id: 'tm-5', senderName: 'Suresh Patel', senderRole: 'Parent', subject: 'Sneha\'s Leave Application', preview: 'My daughter Sneha has a medical checkup scheduled for July 18...', content: 'Dear Ms. Anjali,\n\nMy daughter Sneha has a medical checkup scheduled for July 18. I have submitted the leave request through the portal. Kindly approve.\n\nThank you,\nSuresh Patel', date: '2025-07-14', read: true },
];

export const teacherProfile = {
  name: 'Anjali Reddy',
  employeeId: 'EMP-0001',
  email: 'anjali.reddy@yovialschool.edu.in',
  phone: '+91 90011 22334',
  subjects: ['Mathematics', 'Science'],
  classes: ['Grade 10-A'],
  qualification: 'M.Sc, B.Ed',
  experience: 12,
  joinDate: '2013-06-15',
  gender: 'Female',
  bloodGroup: 'B+',
  address: '45, Indiranagar, Bengaluru, Karnataka 560038',
  performance: 92,
  attendance: 96,
  totalStudents: 92,
};

export const teacherStats = {
  totalClasses: 6,
  totalStudents: 92,
  todayAttendance: 87,
  pendingHomework: 5,
  upcomingExams: 2,
  pendingLeaveRequests: 3,
  unreadMessages: 2,
  performance: 92,
};

export const teacherClassPerformance = [
  { subject: 'Math 10-A', avg: 78, top: 95 },
  { subject: 'Math 10-B', avg: 74, top: 91 },
  { subject: 'Math 9-A', avg: 81, top: 96 },
  { subject: 'Math 9-B', avg: 69, top: 88 },
  { subject: 'Sci 10-A', avg: 82, top: 98 },
  { subject: 'Sci 9-B', avg: 75, top: 89 },
];

export const teacherWeeklyAttendance = [
  { day: 'Mon', present: 88, absent: 4 },
  { day: 'Tue', present: 90, absent: 2 },
  { day: 'Wed', present: 85, absent: 7 },
  { day: 'Thu', present: 91, absent: 1 },
  { day: 'Fri', present: 84, absent: 8 },
];

export const upcomingExams = [
  { id: 'ex-1', name: 'Mid-Term Mathematics', date: '2025-07-20', subject: 'Mathematics', classGrade: '10-A', maxMarks: 100, status: 'scheduled' },
  { id: 'ex-2', name: 'Mid-Term Science', date: '2025-07-23', subject: 'Science', classGrade: '10-A', maxMarks: 100, status: 'scheduled' },
  { id: 'ex-3', name: 'Unit Test - Algebra', date: '2025-07-28', subject: 'Mathematics', classGrade: '9-B', maxMarks: 50, status: 'scheduled' },
];

export const teacherNotifications = [
  { id: 'tn-1', title: 'New leave request from Diya Singh', time: '10 min ago', type: 'leave', read: false },
  { id: 'tn-2', title: 'Principal: Submit exam question paper by July 18', time: '1 hour ago', type: 'message', read: false },
  { id: 'tn-3', title: '28/32 students submitted Algebra Worksheet #5', time: '2 hours ago', type: 'homework', read: false },
  { id: 'tn-4', title: 'PTM scheduled for July 18 at 10:00 AM', time: '5 hours ago', type: 'event', read: true },
  { id: 'tn-5', title: 'Science exhibition registration closes July 20', time: '1 day ago', type: 'event', read: true },
];
