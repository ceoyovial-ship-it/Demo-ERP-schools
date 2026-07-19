export const enrollmentTrend = [
  { month: 'Jan', students: 842, teachers: 48 },
  { month: 'Feb', students: 856, teachers: 49 },
  { month: 'Mar', students: 871, teachers: 51 },
  { month: 'Apr', students: 889, teachers: 52 },
  { month: 'May', students: 902, teachers: 54 },
  { month: 'Jun', students: 918, teachers: 55 },
  { month: 'Jul', students: 934, teachers: 56 },
  { month: 'Aug', students: 948, teachers: 58 },
];

export const attendanceTrend = [
  { day: 'Mon', present: 912, absent: 36 },
  { day: 'Tue', present: 928, absent: 20 },
  { day: 'Wed', present: 921, absent: 27 },
  { day: 'Thu', present: 935, absent: 13 },
  { day: 'Fri', present: 898, absent: 50 },
];

export const feeCollection = [
  { month: 'Jan', collected: 420000, pending: 38000 },
  { month: 'Feb', collected: 445000, pending: 28000 },
  { month: 'Mar', collected: 468000, pending: 32000 },
  { month: 'Apr', collected: 490000, pending: 22000 },
  { month: 'May', collected: 512000, pending: 18000 },
  { month: 'Jun', collected: 535000, pending: 15000 },
];

export const gradeDistribution = [
  { grade: 'A+', count: 142, fill: 'hsl(var(--chart-1))' },
  { grade: 'A', count: 218, fill: 'hsl(var(--chart-2))' },
  { grade: 'B', count: 186, fill: 'hsl(var(--chart-3))' },
  { grade: 'C', count: 94, fill: 'hsl(var(--chart-4))' },
  { grade: 'D', count: 38, fill: 'hsl(var(--chart-5))' },
];

export const subjectPerformance = [
  { subject: 'Math', avg: 78 },
  { subject: 'Science', avg: 82 },
  { subject: 'English', avg: 85 },
  { subject: 'Social', avg: 79 },
  { subject: 'Hindi', avg: 88 },
  { subject: 'Computer', avg: 91 },
];

export const studentAttendance = [
  { month: 'Jan', present: 18, total: 22 },
  { month: 'Feb', present: 20, total: 22 },
  { month: 'Mar', present: 19, total: 22 },
  { month: 'Apr', present: 21, total: 22 },
  { month: 'May', present: 20, total: 22 },
  { month: 'Jun', present: 22, total: 22 },
];

export const studentMarks = [
  { subject: 'Mathematics', marks: 87, grade: 'A' },
  { subject: 'Science', marks: 92, grade: 'A+' },
  { subject: 'English', marks: 85, grade: 'A' },
  { subject: 'Social Studies', marks: 78, grade: 'B' },
  { subject: 'Hindi', marks: 88, grade: 'A' },
  { subject: 'Computer Science', marks: 95, grade: 'A+' },
];

export const teacherClassPerformance = [
  { subject: 'Mathematics', avg: 78, top: 95 },
  { subject: 'Science', avg: 82, top: 98 },
  { subject: 'English', avg: 85, top: 94 },
];

export const recentActivities = [
  { id: 1, title: 'New admission: Arjun Patel (Grade 6-A)', time: '10 min ago', type: 'admission' },
  { id: 2, title: 'Fee payment received: ₹45,000 from Sharma family', time: '25 min ago', type: 'fee' },
  { id: 3, title: 'Attendance marked for Grade 10-A', time: '1 hour ago', type: 'attendance' },
  { id: 4, title: 'Exam results published: Mid-term Science', time: '2 hours ago', type: 'exam' },
  { id: 5, title: 'Parent-teacher meeting scheduled for Friday', time: '3 hours ago', type: 'event' },
];

export const upcomingEvents = [
  { id: 1, title: 'Parent-Teacher Meeting', date: 'Jul 18, 2025', time: '10:00 AM' },
  { id: 2, title: 'Annual Sports Day', date: 'Jul 25, 2025', time: '8:00 AM' },
  { id: 3, title: 'Science Exhibition', date: 'Aug 02, 2025', time: '11:00 AM' },
  { id: 4, title: 'Independence Day Celebration', date: 'Aug 15, 2025', time: '8:00 AM' },
];

export const timetable = [
  { period: '1', time: '08:00 - 08:45', subject: 'Mathematics', teacher: 'Anjali Reddy', room: '10-A' },
  { period: '2', time: '08:45 - 09:30', subject: 'Science', teacher: 'Rajesh Kumar', room: 'Lab-1' },
  { period: '3', time: '09:30 - 10:15', subject: 'English', teacher: 'Meena Iyer', room: '10-A' },
  { period: '4', time: '10:30 - 11:15', subject: 'Social Studies', teacher: 'Suresh Babu', room: '10-A' },
  { period: '5', time: '11:15 - 12:00', subject: 'Hindi', teacher: 'Kavita Singh', room: '10-A' },
  { period: '6', time: '13:00 - 13:45', subject: 'Computer Science', teacher: 'Vikas Jain', room: 'Lab-2' },
  { period: '7', time: '13:45 - 14:30', subject: 'Physical Education', teacher: 'Arun Das', room: 'Ground' },
];

export const childrenData = [
  {
    id: 'child-1',
    name: 'Rahul Sharma',
    grade: '10-A',
    roll: 25,
    attendance: 94,
    avgMarks: 87,
    pendingFees: 12000,
  },
];

// ============ PRINCIPAL DASHBOARD DATA ============

export const admissionAnalytics = [
  { month: 'Jan', inquiries: 45, admissions: 32 },
  { month: 'Feb', inquiries: 52, admissions: 38 },
  { month: 'Mar', inquiries: 48, admissions: 35 },
  { month: 'Apr', inquiries: 61, admissions: 44 },
  { month: 'May', inquiries: 58, admissions: 41 },
  { month: 'Jun', inquiries: 72, admissions: 52 },
  { month: 'Jul', inquiries: 68, admissions: 48 },
];

export const classPerformance = [
  { class: '6-A', avg: 82, attendance: 95 },
  { class: '6-B', avg: 78, attendance: 92 },
  { class: '7-A', avg: 85, attendance: 94 },
  { class: '7-B', avg: 79, attendance: 91 },
  { class: '8-A', avg: 88, attendance: 96 },
  { class: '8-B', avg: 81, attendance: 93 },
  { class: '9-A', avg: 84, attendance: 94 },
  { class: '10-A', avg: 87, attendance: 95 },
];

export const teacherPerformance = [
  { name: 'Anjali Reddy', subject: 'Mathematics', score: 92, students: 92, attendance: 96 },
  { name: 'Rajesh Kumar', subject: 'Science', score: 88, students: 88, attendance: 94 },
  { name: 'Meena Iyer', subject: 'English', score: 90, students: 90, attendance: 95 },
  { name: 'Suresh Babu', subject: 'Social Studies', score: 79, students: 79, attendance: 91 },
  { name: 'Kavita Singh', subject: 'Hindi', score: 86, students: 86, attendance: 93 },
  { name: 'Vikas Jain', subject: 'Computer Science', score: 94, students: 94, attendance: 97 },
];

export const monthlyRevenue = [
  { month: 'Jan', tuition: 380000, transport: 45000, hostel: 32000, lab: 12000 },
  { month: 'Feb', tuition: 395000, transport: 46000, hostel: 34000, lab: 13000 },
  { month: 'Mar', tuition: 410000, transport: 48000, hostel: 35000, lab: 14000 },
  { month: 'Apr', tuition: 425000, transport: 50000, hostel: 36000, lab: 15000 },
  { month: 'May', tuition: 440000, transport: 52000, hostel: 38000, lab: 16000 },
  { month: 'Jun', tuition: 455000, transport: 54000, hostel: 40000, lab: 18000 },
];

export const aiInsights = {
  studentsAtRisk: [
    { id: 1, name: 'Karthik Rao', grade: '9-A', risk: 'High', reason: 'Attendance dropped to 71%, declining math scores', trend: -12 },
    { id: 2, name: 'Pooja Desai', grade: '8-B', risk: 'Medium', reason: 'Homework submission rate fell to 45%', trend: -8 },
    { id: 3, name: 'Aditya Verma', grade: '10-A', risk: 'High', reason: 'Two consecutive failed tests in Science', trend: -15 },
    { id: 4, name: 'Sneha Iyer', grade: '7-A', risk: 'Medium', reason: 'Sudden behavioral changes noted by 3 teachers', trend: -5 },
  ],
  attendancePrediction: {
    nextWeek: 93.2,
    trend: 'stable',
    confidence: 87,
    note: 'Attendance expected to remain stable with slight dip on Friday due to weather forecast',
  },
  feeForecast: {
    nextMonth: 548000,
    trend: 'up',
    confidence: 91,
    note: 'Fee collection projected to increase by 2.4% based on historical patterns',
  },
  topClasses: [
    { class: '8-A', avg: 88, attendance: 96, improvement: '+3.2%' },
    { class: '10-A', avg: 87, attendance: 95, improvement: '+2.8%' },
    { class: '7-A', avg: 85, attendance: 94, improvement: '+1.5%' },
  ],
  teacherSummary: {
    top: 'Vikas Jain (Computer Science) — 94% performance score',
    improvement: 'Suresh Babu (Social Studies) — recommend teaching methodology workshop',
    avgScore: 88,
  },
  recommendations: [
    { id: 1, text: 'Schedule parent-teacher conference for 4 at-risk students this week', priority: 'high' },
    { id: 2, text: 'Send fee reminder to 42 families with pending Q2 payments', priority: 'high' },
    { id: 3, text: 'Consider additional tutoring support for Grade 9-A Mathematics', priority: 'medium' },
    { id: 4, text: 'Recognize Grade 8-A for highest attendance this month', priority: 'low' },
  ],
};

export const activityTimeline = [
  { id: 1, title: 'Teacher marked attendance', detail: 'Anjali Reddy marked Grade 10-A — 30/32 present', time: '10 min ago', type: 'attendance', icon: 'CalendarCheck' },
  { id: 2, title: 'Fee received', detail: '₹45,000 from Sharma family — Tuition Q2', time: '25 min ago', type: 'fee', icon: 'Wallet' },
  { id: 3, title: 'Student admitted', detail: 'Arjun Patel enrolled in Grade 6-A', time: '1 hour ago', type: 'admission', icon: 'UserPlus' },
  { id: 4, title: 'Exam created', detail: 'Mid-term Mathematics exam scheduled for Jul 20', time: '2 hours ago', type: 'exam', icon: 'ClipboardList' },
  { id: 5, title: 'Homework assigned', detail: 'Science lab report due Jul 18 for Grade 10-A', time: '3 hours ago', type: 'homework', icon: 'BookOpen' },
  { id: 6, title: 'Leave approved', detail: 'Meena Iyer — personal leave approved for Jul 19', time: '5 hours ago', type: 'leave', icon: 'Calendar' },
];

export const todaySchedule = [
  { id: 1, title: 'Morning Assembly', time: '08:00 AM', location: 'Main Ground', type: 'event' },
  { id: 2, title: 'Staff Meeting', time: '09:30 AM', location: 'Conference Room', type: 'meeting' },
  { id: 3, title: 'Parent Visit — Sharma', time: '11:00 AM', location: 'Principal Office', type: 'parent' },
  { id: 4, title: 'Lunch Break', time: '12:30 PM', location: 'Staff Lounge', type: 'break' },
  { id: 5, title: 'Budget Review', time: '02:00 PM', location: 'Accounts Office', type: 'meeting' },
  { id: 6, title: 'Sports Day Prep', time: '04:00 PM', location: 'Sports Ground', type: 'event' },
];

export const upcomingMeetings = [
  { id: 1, title: 'PTA Executive Committee', date: 'Jul 18', time: '10:00 AM', attendees: 12 },
  { id: 2, title: 'District Education Officer Visit', date: 'Jul 22', time: '11:00 AM', attendees: 5 },
  { id: 3, title: 'Quarterly Board Meeting', date: 'Jul 28', time: '03:00 PM', attendees: 8 },
];

export const principalStats = [
  { title: 'Total Students', value: '948', icon: 'Users', change: '+2.1%', changeType: 'positive' },
  { title: 'Total Teachers', value: '58', icon: 'GraduationCap', change: '+3 new', changeType: 'positive' },
  { title: 'Total Parents', value: '892', icon: 'UserCog', change: '+18 this term', changeType: 'positive' },
  { title: 'Total Staff', value: '34', icon: 'Briefcase', change: 'No change', changeType: 'neutral' },
  { title: "Today's Attendance", value: '94.8%', icon: 'CalendarCheck', change: '-0.3%', changeType: 'negative' },
  { title: 'Pending Fees', value: '₹1.5L', icon: 'Wallet', change: '42 students', changeType: 'negative' },
  { title: 'Monthly Revenue', value: '₹5.35L', icon: 'TrendingUp', change: '+4.5%', changeType: 'positive' },
  { title: 'Admissions', value: '48', icon: 'UserPlus', change: '+12 this month', changeType: 'positive' },
  { title: 'Upcoming Exams', value: '6', icon: 'ClipboardList', change: 'Next: Jul 20', changeType: 'neutral' },
  { title: 'Homework Pending', value: '23', icon: 'BookOpen', change: '8 overdue', changeType: 'negative' },
  { title: 'Announcements', value: '4', icon: 'Megaphone', change: '2 this week', changeType: 'neutral' },
  { title: 'Events', value: '7', icon: 'Calendar', change: 'Next: Jul 18', changeType: 'neutral' },
];
