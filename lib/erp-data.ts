// ============================================================
// Yovial School ERP — Comprehensive Demo Data
// Generated programmatically for realistic interconnection
// ============================================================

const FIRST_NAMES = [
  'Aarav', 'Aditya', 'Advik', 'Ananya', 'Arjun', 'Arnav', 'Aryan', 'Atharv',
  'Diya', 'Ishaan', 'Kabir', 'Kiara', 'Krishna', 'Myra', 'Navya', 'Reyansh',
  'Riya', 'Rohan', 'Saanvi', 'Sara', 'Shaurya', 'Vedika', 'Vihaan', 'Anika',
  'Dhruv', 'Kavya', 'Nisha', 'Pranav', 'Sneha', 'Varun', 'Aisha', 'Karan',
  'Pooja', 'Rahul', 'Sonia', 'Vikram', 'Priya', 'Nikhil', 'Tanvi', 'Aryan',
  'Meera', 'Siddharth', 'Ira', 'Yash', 'Zara', 'Reyansh', 'Mahi', 'Aditi',
  'Karthik', 'Lakshmi', 'Naina', 'Pavan', 'Ritu', 'Sahil', 'Trisha', 'Vivek',
];
const LAST_NAMES = [
  'Sharma', 'Verma', 'Patel', 'Reddy', 'Nair', 'Iyer', 'Singh', 'Gupta',
  'Jain', 'Kumar', 'Rao', 'Desai', 'Bose', 'Menon', 'Pillai', 'Shetty',
  'Bhat', 'Kapoor', 'Mehta', 'Agarwal', 'Chopra', 'Banerjee', 'Das', 'Ghosh',
];

function pick<T>(arr: T[], seed: number): T {
  return arr[seed % arr.length];
}

function generateStudents(count: number) {
  const classes = ['6', '7', '8', '9', '10'];
  const sections = ['A', 'B'];
  const statuses: ('active' | 'inactive' | 'graduated')[] = ['active', 'active', 'active', 'active', 'inactive'];

  return Array.from({ length: count }, (_, i) => {
    const seed = i + 1;
    const fn = pick(FIRST_NAMES, seed * 7 + 3);
    const ln = pick(LAST_NAMES, seed * 13 + 5);
    const cls = pick(classes, seed);
    const sec = pick(sections, seed);
    const roll = (seed % 40) + 1;
    const attendance = 75 + (seed * 7) % 25;
    const avgMarks = 55 + (seed * 11) % 45;
    const feeStatus = seed % 4 === 0 ? 'pending' : seed % 7 === 0 ? 'partial' : 'paid';
    const gender = seed % 2 === 0 ? 'Male' : 'Female';

    return {
      id: `std-${String(seed).padStart(4, '0')}`,
      admissionNumber: `YS2025-${String(seed).padStart(4, '0')}`,
      name: `${fn} ${ln}`,
      firstName: fn,
      lastName: ln,
      classGrade: cls,
      section: sec,
      classSection: `${cls}-${sec}`,
      rollNumber: roll,
      gender,
      status: pick(statuses, seed),
      attendance,
      avgMarks,
      feeStatus,
      feePending: feeStatus !== 'paid' ? 5000 + (seed * 1000) % 30000 : 0,
      parentName: `${pick(['Ramesh', 'Suresh', 'Mahesh', 'Rajesh', 'Dinesh', 'Naresh'], seed)} ${ln}`,
      parentPhone: `+91 ${String(90000 + (seed * 137) % 9999).slice(0, 5)} ${String((seed * 5678) % 100000).slice(0, 5)}`,
      parentEmail: `${pick(['ramesh', 'suresh', 'mahesh', 'rajesh', 'dinesh'], seed)}.${ln.toLowerCase()}@email.com`,
      admissionDate: `202${3 + (seed % 2)}-0${1 + (seed % 6)}-1${seed % 9}`,
      address: `${seed * 12 + 1}, ${pick(['MG Road', 'Park Street', 'Gandhi Nagar', 'Jawahar Marg', 'Station Road'], seed)}, ${pick(['Bengaluru', 'Mysuru', 'Hubli', 'Mangaluru', 'Belagavi'], seed)}`,
      bloodGroup: pick(['A+', 'B+', 'O+', 'AB+', 'A-', 'B-', 'O-'], seed),
      dob: `200${8 + (seed % 4)}-0${1 + (seed % 6)}-1${seed % 9}`,
      avatar: null,
    };
  });
}

function generateTeachers(count: number) {
  const subjects = ['Mathematics', 'Science', 'English', 'Social Studies', 'Hindi', 'Computer Science', 'Physical Education', 'Art', 'Music'];
  return Array.from({ length: count }, (_, i) => {
    const seed = i + 1;
    const fn = pick(FIRST_NAMES, seed * 11 + 7);
    const ln = pick(LAST_NAMES, seed * 17 + 9);
    return {
      id: `tch-${String(seed).padStart(3, '0')}`,
      employeeId: `EMP-${String(seed).padStart(4, '0')}`,
      name: `${fn} ${ln}`,
      subject: pick(subjects, seed),
      classes: [`${6 + (seed % 5)}-${pick(['A', 'B'], seed)}`, `${6 + ((seed + 1) % 5)}-${pick(['A', 'B'], seed + 1)}`],
      experience: 2 + (seed * 3) % 18,
      qualification: pick(['B.Ed', 'M.Ed', 'M.Sc B.Ed', 'M.A B.Ed', 'B.Tech B.Ed', 'Ph.D'], seed),
      phone: `+91 ${String(90000 + (seed * 211) % 9999).slice(0, 5)} ${String((seed * 3456) % 100000).slice(0, 5)}`,
      email: `${fn.toLowerCase()}.${ln.toLowerCase()}@yovialschool.edu.in`,
      salary: 35000 + (seed * 2500) % 45000,
      attendance: 88 + (seed * 3) % 12,
      performance: 70 + (seed * 7) % 30,
      status: seed % 10 === 0 ? 'on-leave' : 'active',
      joinDate: `201${5 + (seed % 4)}-0${1 + (seed % 6)}-1${seed % 9}`,
      gender: seed % 2 === 0 ? 'Male' : 'Female',
    };
  });
}

function generateParents(count: number) {
  return Array.from({ length: count }, (_, i) => {
    const seed = i + 1;
    const ln = pick(LAST_NAMES, seed * 19 + 11);
    const fn = pick(['Ramesh', 'Suresh', 'Mahesh', 'Rajesh', 'Dinesh', 'Naresh', 'Lakshmi', 'Padma', 'Geeta', 'Sunita'], seed);
    return {
      id: `par-${String(seed).padStart(4, '0')}`,
      name: `${fn} ${ln}`,
      occupation: pick(['Engineer', 'Doctor', 'Business', 'Teacher', 'Government', 'Banking', 'Agriculture', 'Lawyer'], seed),
      phone: `+91 ${String(90000 + (seed * 167) % 9999).slice(0, 5)} ${String((seed * 4321) % 100000).slice(0, 5)}`,
      email: `${fn.toLowerCase()}.${ln.toLowerCase()}@email.com`,
      children: [generateStudents(1)[0].name, seed % 3 === 0 ? generateStudents(2)[1].name : null].filter(Boolean) as string[],
      address: `${seed * 15 + 1}, ${pick(['MG Road', 'Park Street', 'Gandhi Nagar', 'Jawahar Marg'], seed)}, ${pick(['Bengaluru', 'Mysuru', 'Hubli'], seed)}`,
      feeStatus: seed % 4 === 0 ? 'pending' : 'paid',
      totalPaid: 45000 + (seed * 5000) % 80000,
      pendingAmount: seed % 4 === 0 ? 5000 + (seed * 1000) % 20000 : 0,
    };
  });
}

export const students = generateStudents(500);
export const teachers = generateTeachers(40);
export const parents = generateParents(500);

// Classes & Sections
export const classes = Array.from({ length: 12 }, (_, i) => {
  const grade = i + 1;
  return {
    id: `cls-${grade}`,
    grade: String(grade),
    sections: ['A', 'B'],
    students: 70 + (i * 7) % 30,
    classTeacher: teachers[i % teachers.length].name,
    room: `Room ${100 + i}`,
  };
});

export const subjects = [
  { id: 'sub-1', name: 'Mathematics', code: 'MATH', classes: ['6', '7', '8', '9', '10'], teacher: 'Anjali Reddy' },
  { id: 'sub-2', name: 'Science', code: 'SCI', classes: ['6', '7', '8', '9', '10'], teacher: 'Rajesh Kumar' },
  { id: 'sub-3', name: 'English', code: 'ENG', classes: ['6', '7', '8', '9', '10'], teacher: 'Meena Iyer' },
  { id: 'sub-4', name: 'Social Studies', code: 'SOC', classes: ['6', '7', '8', '9', '10'], teacher: 'Suresh Babu' },
  { id: 'sub-5', name: 'Hindi', code: 'HIN', classes: ['6', '7', '8', '9', '10'], teacher: 'Kavita Singh' },
  { id: 'sub-6', name: 'Computer Science', code: 'CS', classes: ['6', '7', '8', '9', '10'], teacher: 'Vikas Jain' },
  { id: 'sub-7', name: 'Physical Education', code: 'PE', classes: ['6', '7', '8', '9', '10'], teacher: 'Arun Das' },
  { id: 'sub-8', name: 'Art', code: 'ART', classes: ['6', '7', '8'], teacher: 'Lakshmi Pillai' },
  { id: 'sub-9', name: 'Music', code: 'MUS', classes: ['6', '7', '8'], teacher: 'Gita Sharma' },
];

// Attendance
export const attendanceData = Array.from({ length: 30 }, (_, i) => {
  const date = new Date(2025, 6, i + 1);
  return {
    date: date.toISOString().split('T')[0],
    day: date.toLocaleDateString('en-US', { weekday: 'short' }),
    present: 880 + (i * 7) % 60,
    absent: 20 + (i * 3) % 30,
    late: 5 + (i * 2) % 15,
    rate: Math.round((880 + (i * 7) % 60) / 948 * 100),
  };
});

export const classAttendance = classes.slice(0, 8).map((cls, i) => ({
  class: `${cls.grade}-${cls.sections[0]}`,
  present: 28 + (i * 3) % 5,
  absent: 2 + (i % 3),
  late: 1 + (i % 2),
  rate: 90 + (i * 2) % 10,
}));

// Examinations
export const exams = [
  { id: 'exam-1', name: 'Mid-Term Examination', term: 'Term 1', startDate: '2025-07-20', endDate: '2025-07-28', status: 'scheduled', subjects: 6, totalStudents: 948 },
  { id: 'exam-2', name: 'Unit Test 1', term: 'Term 1', startDate: '2025-06-15', endDate: '2025-06-18', status: 'completed', subjects: 5, totalStudents: 920 },
  { id: 'exam-3', name: 'Final Examination', term: 'Term 2', startDate: '2025-11-15', endDate: '2025-11-25', status: 'upcoming', subjects: 8, totalStudents: 948 },
  { id: 'exam-4', name: 'Unit Test 2', term: 'Term 2', startDate: '2025-09-10', endDate: '2025-09-13', status: 'upcoming', subjects: 5, totalStudents: 940 },
];

export const examResults = Array.from({ length: 20 }, (_, i) => {
  const seed = i + 1;
  const student = students[seed * 23];
  return {
    id: `res-${seed}`,
    studentName: student?.name ?? `Student ${seed}`,
    admissionNumber: student?.admissionNumber ?? `YS2025-${seed}`,
    class: student?.classSection ?? '10-A',
    totalMarks: 350 + (seed * 17) % 150,
    percentage: 35 + (seed * 4) % 60,
    rank: seed,
    grade: seed < 5 ? 'A+' : seed < 12 ? 'A' : seed < 18 ? 'B' : 'C',
    status: seed < 18 ? 'pass' : 'fail',
  };
});

export const subjectAnalysis = subjects.slice(0, 6).map((sub, i) => ({
  subject: sub.name,
  avgMarks: 65 + (i * 7) % 30,
  passPercentage: 80 + (i * 3) % 20,
  topScore: 95 + (i * 2) % 5,
  appeared: 948,
}));

// Fees
export const feeStructure = [
  { id: 'fee-1', type: 'Tuition Fee', amount: 45000, frequency: 'Quarterly', applicableTo: 'All Classes' },
  { id: 'fee-2', type: 'Transport Fee', amount: 8000, frequency: 'Quarterly', applicableTo: 'Optional' },
  { id: 'fee-3', type: 'Lab Fee', amount: 5000, frequency: 'Annual', applicableTo: 'Grade 8-10' },
  { id: 'fee-4', type: 'Library Fee', amount: 2000, frequency: 'Annual', applicableTo: 'All Classes' },
  { id: 'fee-5', type: 'Hostel Fee', amount: 35000, frequency: 'Quarterly', applicableTo: 'Hostel Students' },
  { id: 'fee-6', type: 'Exam Fee', amount: 3000, frequency: 'Per Exam', applicableTo: 'All Classes' },
];

export const feeTransactions = Array.from({ length: 50 }, (_, i) => {
  const seed = i + 1;
  const student = students[seed * 9];
  return {
    id: `txn-${seed}`,
    receiptNo: `RCP-${String(seed).padStart(5, '0')}`,
    studentName: student?.name ?? `Student ${seed}`,
    admissionNumber: student?.admissionNumber ?? `YS2025-${seed}`,
    class: student?.classSection ?? '8-A',
    feeType: pick(['Tuition', 'Transport', 'Lab', 'Library', 'Hostel', 'Exam'], seed),
    amount: 5000 + (seed * 3500) % 40000,
    paymentDate: `2025-0${1 + (seed % 6)}-1${seed % 9}`,
    method: pick(['Cash', 'Card', 'UPI', 'Bank Transfer', 'Cheque'], seed),
    status: seed % 5 === 0 ? 'pending' : 'paid',
  };
});

export const feeDefaulters = students.filter(s => s.feeStatus !== 'paid').slice(0, 30).map((s, i) => ({
  id: `def-${i}`,
  studentName: s.name,
  admissionNumber: s.admissionNumber,
  class: s.classSection,
  pendingAmount: s.feePending,
  dueDate: '2025-07-31',
  daysOverdue: 5 + (i * 3) % 30,
}));

// Library
export const libraryBooks = Array.from({ length: 300 }, (_, i) => {
  const seed = i + 1;
  const titles = ['The Great Gatsby', 'To Kill a Mockingbird', '1984', 'Pride and Prejudice', 'The Hobbit', 'Dune', 'The Alchemist', 'Sapiens', 'Atomic Habits', 'The Wingfeather Saga'];
  const authors = ['F. Scott Fitzgerald', 'Harper Lee', 'George Orwell', 'Jane Austen', 'J.R.R. Tolkien', 'Frank Herbert', 'Paulo Coelho', 'Yuval Noah Harari', 'James Clear', 'Andrew Peterson'];
  const categories = ['Fiction', 'Science', 'History', 'Biography', 'Reference', 'Children', 'Philosophy', 'Mathematics'];
  return {
    id: `bk-${String(seed).padStart(4, '0')}`,
    isbn: `978-${String(10000 + seed * 137).slice(0, 5)}-${seed}`,
    title: `${pick(titles, seed)}${seed > titles.length ? ' Vol. ' + Math.ceil(seed / titles.length) : ''}`,
    author: pick(authors, seed),
    category: pick(categories, seed),
    copies: 1 + (seed % 5),
    available: seed % 3 !== 0,
    shelf: `Shelf ${pick(['A', 'B', 'C', 'D'], seed)}-${seed % 20}`,
    status: seed % 3 === 0 ? 'issued' : 'available',
  };
});

export const issuedBooks = Array.from({ length: 30 }, (_, i) => {
  const seed = i + 1;
  const book = libraryBooks[seed * 10];
  const student = students[seed * 31];
  return {
    id: `iss-${seed}`,
    bookTitle: book?.title ?? `Book ${seed}`,
    isbn: book?.isbn ?? `978-${seed}`,
    studentName: student?.name ?? `Student ${seed}`,
    admissionNumber: student?.admissionNumber ?? `YS2025-${seed}`,
    class: student?.classSection ?? '7-A',
    issueDate: `2025-0${1 + (seed % 6)}-0${1 + (seed % 9)}`,
    dueDate: `2025-0${2 + (seed % 5)}-1${seed % 9}`,
    status: seed % 4 === 0 ? 'overdue' : 'issued',
    fine: seed % 4 === 0 ? 50 + (seed * 10) % 200 : 0,
  };
});

// Transport
export const transportRoutes = Array.from({ length: 10 }, (_, i) => {
  const seed = i + 1;
  const areas = ['Indiranagar', 'Koramangala', 'Whitefield', 'Jayanagar', 'Malleshwaram', 'HSR Layout', 'BTM Layout', 'Electronic City', 'Marathahalli', 'Hebbal'];
  return {
    id: `route-${seed}`,
    routeNumber: `R${seed}`,
    routeName: `${pick(areas, seed)} Route`,
    driver: teachers[seed % teachers.length]?.name ?? `Driver ${seed}`,
    vehicleNumber: `KA01 ${String(1000 + seed * 111).slice(-4)}`,
    capacity: 40 + (seed % 10),
    allocated: 30 + (seed * 3) % 15,
    stops: 8 + (seed % 5),
    fare: 3000 + (seed * 500) % 2000,
    status: 'active',
  };
});

// Hostel
export const hostelRooms = Array.from({ length: 48 }, (_, i) => {
  const seed = i + 1;
  return {
    id: `room-${seed}`,
    roomNumber: `${seed <= 24 ? 'A' : 'B'}-${String(seed).padStart(3, '0')}`,
    block: seed <= 24 ? 'Block A' : 'Block B',
    floor: Math.ceil(seed / 12),
    capacity: seed % 3 === 0 ? 3 : 2,
    occupied: seed % 4 === 0 ? 1 : seed % 3 === 0 ? 2 : 2,
    status: seed % 5 === 0 ? 'vacant' : 'occupied',
    warden: pick(['Ramesh Kumar', 'Suresh Nair', 'Mahesh Rao'], seed),
  };
});

export const hostelStudents = students.slice(0, 80).map((s, i) => ({
  id: `hs-${i}`,
  studentName: s.name,
  admissionNumber: s.admissionNumber,
  class: s.classSection,
  roomNumber: `${i < 40 ? 'A' : 'B'}-${String((i % 24) + 1).padStart(3, '0')}`,
  block: i < 40 ? 'Block A' : 'Block B',
  checkIn: `2025-06-0${1 + (i % 9)}`,
  warden: pick(['Ramesh Kumar', 'Suresh Nair', 'Mahesh Rao'], i),
  status: i % 10 === 0 ? 'on-leave' : 'present',
}));

// HR & Payroll
export const staffMembers = Array.from({ length: 50 }, (_, i) => {
  const seed = i + 1;
  const fn = pick(FIRST_NAMES, seed * 23 + 17);
  const ln = pick(LAST_NAMES, seed * 29 + 19);
  const roles = ['Accountant', 'Librarian', 'Lab Assistant', 'Security', 'Driver', 'Cook', 'Cleaner', 'Receptionist', 'Warden', 'Gardener'];
  return {
    id: `staff-${seed}`,
    employeeId: `STF-${String(seed).padStart(4, '0')}`,
    name: `${fn} ${ln}`,
    role: pick(roles, seed),
    department: pick(['Administration', 'Maintenance', 'Transport', 'Kitchen', 'Security', 'Library'], seed),
    salary: 18000 + (seed * 2000) % 32000,
    phone: `+91 ${String(90000 + (seed * 143) % 9999).slice(0, 5)} ${String((seed * 6789) % 100000).slice(0, 5)}`,
    email: `${fn.toLowerCase()}.${ln.toLowerCase()}@yovialschool.edu.in`,
    joinDate: `201${6 + (seed % 3)}-0${1 + (seed % 6)}-1${seed % 9}`,
    status: seed % 8 === 0 ? 'on-leave' : 'active',
    attendance: 85 + (seed * 5) % 15,
  };
});

export const payrollData = staffMembers.slice(0, 12).map((s, i) => ({
  id: `pay-${i}`,
  employeeId: s.employeeId,
  name: s.name,
  role: s.role,
  basicSalary: s.salary,
  hra: Math.round(s.salary * 0.2),
  da: Math.round(s.salary * 0.1),
  pf: Math.round(s.salary * 0.12),
  netSalary: Math.round(s.salary * 1.3 - s.salary * 0.12),
  month: 'July 2025',
  status: i % 4 === 0 ? 'pending' : 'paid',
}));

// Communication
export const announcements = [
  { id: 'ann-1', title: 'Parent-Teacher Meeting on July 18', category: 'Event', audience: 'All Parents', date: '2025-07-12', status: 'sent', channel: 'SMS + Email', reach: 892 },
  { id: 'ann-2', title: 'Fee Payment Reminder — Q2 Due', category: 'Fees', audience: 'Defaulters', date: '2025-07-10', status: 'sent', channel: 'SMS', reach: 42 },
  { id: 'ann-3', title: 'Annual Sports Day Registration', category: 'Event', audience: 'Grades 6-10', date: '2025-07-08', status: 'sent', channel: 'Email', reach: 580 },
  { id: 'ann-4', title: 'Mid-Term Exam Schedule Released', category: 'Academics', audience: 'All Students', date: '2025-07-05', status: 'sent', channel: 'SMS + Email + WhatsApp', reach: 948 },
  { id: 'ann-5', title: 'Science Exhibition — Call for Projects', category: 'Event', audience: 'Grades 8-10', date: '2025-07-14', status: 'draft', channel: 'Email', reach: 0 },
];

export const messagesLog = Array.from({ length: 20 }, (_, i) => {
  const seed = i + 1;
  return {
    id: `msg-${seed}`,
    recipient: students[seed * 47]?.parentName ?? `Parent ${seed}`,
    channel: pick(['SMS', 'WhatsApp', 'Email'], seed),
    subject: pick(['Fee Reminder', 'Attendance Alert', 'Exam Schedule', 'Holiday Notice', 'Meeting Invite'], seed),
    status: pick(['delivered', 'read', 'failed', 'pending'], seed),
    sentAt: `2025-07-${String(14 - seed % 14).padStart(2, '0')} ${String(10 + seed % 10)}:${String(seed * 3 % 60).padStart(2, '0')}`,
  };
});

// AI Analytics
export const aiAnalyticsData = {
  schoolHealthScore: 87,
  healthTrend: '+2.3%',
  riskDistribution: [
    { level: 'Low Risk', count: 782, fill: 'hsl(var(--chart-2))' },
    { level: 'Medium Risk', count: 124, fill: 'hsl(var(--chart-3))' },
    { level: 'High Risk', count: 42, fill: 'hsl(var(--chart-5))' },
  ],
  attendancePrediction: Array.from({ length: 7 }, (_, i) => ({
    day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
    predicted: 92 + (i * 3) % 6,
    actual: i < 5 ? 91 + (i * 2) % 5 : null,
  })),
  feeForecast: Array.from({ length: 6 }, (_, i) => ({
    month: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'][i],
    actual: 420000 + (i * 25000),
    predicted: 430000 + (i * 27000),
  })),
  classPerformanceRadar: [
    { subject: 'Math', '6-A': 82, '8-A': 88, '10-A': 87 },
    { subject: 'Science', '6-A': 85, '8-A': 90, '10-A': 89 },
    { subject: 'English', '6-A': 80, '8-A': 85, '10-A': 86 },
    { subject: 'Social', '6-A': 78, '8-A': 82, '10-A': 84 },
    { subject: 'Hindi', '6-A': 84, '8-A': 88, '10-A': 90 },
    { subject: 'Computer', '6-A': 88, '8-A': 92, '10-A': 94 },
  ],
  aiSuggestions: [
    { id: 1, text: 'Schedule remedial classes for Grade 9-A Mathematics — 12 students scoring below 40%', priority: 'high', category: 'Academics', impact: 'High' },
    { id: 2, text: 'Send fee reminders to 42 families with pending Q2 payments before July 31', priority: 'high', category: 'Finance', impact: 'High' },
    { id: 3, text: 'Recognize Grade 8-A for 96% attendance — highest in school this term', priority: 'low', category: 'Engagement', impact: 'Medium' },
    { id: 4, text: 'Arrange teaching methodology workshop for Social Studies department', priority: 'medium', category: 'Faculty', impact: 'Medium' },
    { id: 5, text: 'Parent-teacher conference recommended for 4 at-risk students this week', priority: 'high', category: 'Student Welfare', impact: 'High' },
    { id: 6, text: 'Library utilization at 68% — consider promoting reading week initiative', priority: 'low', category: 'Library', impact: 'Low' },
  ],
  aiInsights: [
    { id: 1, title: 'Enrollment Trend', insight: 'Student enrollment up 12.6% year-over-year. Projected to reach 1,020 by next academic year.', trend: 'positive' },
    { id: 2, title: 'Attendance Pattern', insight: 'Friday attendance consistently 3-4% lower than other weekdays. Consider engagement activities.', trend: 'neutral' },
    { id: 3, title: 'Fee Collection', insight: 'Collection rate improved from 91% to 95% this quarter. UPI payments now account for 42% of transactions.', trend: 'positive' },
    { id: 4, title: 'Academic Performance', insight: 'Grade 8-A showing strongest improvement (+3.2%). Grade 9-A needs attention in Mathematics.', trend: 'mixed' },
    { id: 5, title: 'Teacher Performance', insight: 'Average faculty performance at 88%. Computer Science department leading at 94%.', trend: 'positive' },
  ],
};

// Settings
export const schoolInfo = {
  name: 'Yovial International School',
  established: '2005',
  affiliation: 'CBSE',
  address: '123 Education Lane, Bengaluru, Karnataka 560001',
  phone: '+91 80 2345 6789',
  email: 'info@yovialschool.edu.in',
  website: 'www.yovialschool.edu.in',
  principal: 'Dr. Vikram Rao',
  academicYear: '2025-26',
  totalStudents: 948,
  totalStaff: 92,
};

// Activity Log for Student Portfolio
export const studentActivityLog = [
  { id: 1, event: 'Admission Confirmed', date: '2023-06-15', type: 'admission' },
  { id: 2, event: 'First Day of School', date: '2023-06-20', type: 'milestone' },
  { id: 3, event: 'Selected for Science Exhibition', date: '2024-01-15', type: 'achievement' },
  { id: 4, event: 'Won 2nd Place — Inter-School Quiz', date: '2024-03-22', type: 'achievement' },
  { id: 5, event: 'Promoted to Grade 10-A', date: '2025-04-01', type: 'milestone' },
  { id: 6, event: 'Attendance Warning Issued', date: '2025-05-10', type: 'alert' },
  { id: 7, event: 'Fee Payment Received — Q1', date: '2025-04-05', type: 'fee' },
  { id: 8, event: 'Fee Payment Received — Q2', date: '2025-07-01', type: 'fee' },
];

// Student Achievements
export const studentAchievements = [
  { id: 1, title: '2nd Place — Inter-School Quiz Competition', date: '2024-03-22', level: 'State' },
  { id: 2, title: 'Best Science Project — Annual Exhibition', date: '2024-02-10', level: 'School' },
  { id: 3, title: 'Excellence in Mathematics — Grade 9', date: '2024-04-15', level: 'School' },
  { id: 4, title: 'Selected for National Olympiad — Mathematics', date: '2025-01-20', level: 'National' },
];

// Student Documents
export const studentDocuments = [
  { id: 1, name: 'Birth Certificate', type: 'PDF', uploaded: '2023-06-15', size: '1.2 MB' },
  { id: 2, name: 'Transfer Certificate', type: 'PDF', uploaded: '2023-06-15', size: '0.8 MB' },
  { id: 3, name: 'Previous Report Card', type: 'PDF', uploaded: '2023-06-15', size: '2.1 MB' },
  { id: 4, name: 'Medical Record', type: 'PDF', uploaded: '2023-06-18', size: '0.5 MB' },
  { id: 5, name: 'Aadhaar Card', type: 'PDF', uploaded: '2023-06-20', size: '0.3 MB' },
  { id: 6, name: 'Passport Photo', type: 'JPG', uploaded: '2023-06-20', size: '0.8 MB' },
];

// Student Medical Record
export const studentMedical = {
  bloodGroup: 'B+',
  height: '165 cm',
  weight: '52 kg',
  vision: 'Normal (6/6)',
  allergies: ['Dust', 'Pollen'],
  conditions: 'None',
  emergencyContact: 'Ramesh Sharma — +91 90000 12345',
  lastCheckup: '2025-03-15',
  vaccinations: ['BCG', 'DPT', 'Polio', 'MMR', 'Hepatitis B'],
};
