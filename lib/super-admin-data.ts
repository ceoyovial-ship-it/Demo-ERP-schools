export type SuperAdminSection =
  | 'schools'
  | 'academic-years'
  | 'students'
  | 'parents'
  | 'teachers'
  | 'receptionists'
  | 'accounts'
  | 'admissions'
  | 'fees'
  | 'attendance'
  | 'examinations'
  | 'timetable'
  | 'transport'
  | 'hostel'
  | 'library'
  | 'hr-payroll'
  | 'announcements'
  | 'reports'
  | 'analytics'
  | 'user-management'
  | 'roles-permissions'
  | 'backup-restore'
  | 'audit-logs'
  | 'settings';

export interface SuperAdminSchool {
  id: string;
  name: string;
  city: string;
  principal: string;
  students: number;
  teachers: number;
  revenue: number;
  status: 'active' | 'inactive';
  branding: string;
}

export interface SuperAdminPerson {
  id: string;
  name: string;
  email: string;
  role: string;
  school: string;
  status: 'active' | 'inactive' | 'pending';
  lastActive: string;
}

export interface SuperAdminFeeRecord {
  id: string;
  student: string;
  school: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  date: string;
}

export interface SuperAdminActivity {
  id: string;
  title: string;
  detail: string;
  timestamp: string;
  category: string;
}

export const superAdminMetrics = [
  { title: 'Total Schools', value: '18', icon: 'Building2', change: '+2 this quarter', changeType: 'positive' as const },
  { title: 'Total Students', value: '12,480', icon: 'Users', change: '+8.4%', changeType: 'positive' as const },
  { title: 'Total Teachers', value: '894', icon: 'GraduationCap', change: '+34 new', changeType: 'positive' as const },
  { title: 'Total Staff', value: '241', icon: 'Briefcase', change: 'Stable', changeType: 'neutral' as const },
  { title: 'Total Parents', value: '9,920', icon: 'UserCog', change: '+4.8%', changeType: 'positive' as const },
  { title: 'Total Revenue', value: '₹24.8L', icon: 'Wallet', change: '+12.3%', changeType: 'positive' as const },
  { title: 'Active Classes', value: '376', icon: 'BookOpen', change: '91% utilization', changeType: 'neutral' as const },
  { title: 'Pending Admissions', value: '128', icon: 'UserPlus', change: 'Review queue', changeType: 'negative' as const },
  { title: 'Pending Fees', value: '₹3.1L', icon: 'Wallet', change: '41 accounts', changeType: 'negative' as const },
  { title: 'Today\'s Attendance', value: '96.2%', icon: 'CalendarCheck', change: '+0.7%', changeType: 'positive' as const },
  { title: 'Transport Status', value: 'Normal', icon: 'Bus', change: '12 routes healthy', changeType: 'positive' as const },
  { title: 'Hostel Status', value: 'Stable', icon: 'Building2', change: '4 welfare alerts', changeType: 'neutral' as const },
];

export const schoolData: SuperAdminSchool[] = [
  { id: 'SCH-001', name: 'Yovial International School', city: 'Bengaluru', principal: 'Dr. Vikram Rao', students: 1840, teachers: 118, revenue: 4250000, status: 'active', branding: 'Blue / Gold' },
  { id: 'SCH-002', name: 'Yovial Academy', city: 'Hyderabad', principal: 'Ms. Shreya Nair', students: 1420, teachers: 96, revenue: 3415000, status: 'active', branding: 'Emerald / White' },
  { id: 'SCH-003', name: 'Yovial Public School', city: 'Chennai', principal: 'Mr. Arjun Menon', students: 1210, teachers: 82, revenue: 2890000, status: 'inactive', branding: 'Navy / Silver' },
  { id: 'SCH-004', name: 'Yovial Scholars Campus', city: 'Pune', principal: 'Dr. Neelam Iyer', students: 1680, teachers: 107, revenue: 3650000, status: 'active', branding: 'Indigo / Cream' },
];

export const studentData: SuperAdminPerson[] = [
  { id: 'STD-1001', name: 'Rahul Kumar', email: 'rahul10@yovialschool.edu.in', role: 'Student', school: 'Yovial International School', status: 'active', lastActive: '2 mins ago' },
  { id: 'STD-1002', name: 'Priya Sharma', email: 'priya09@yovialschool.edu.in', role: 'Student', school: 'Yovial Academy', status: 'active', lastActive: '5 mins ago' },
  { id: 'STD-1003', name: 'Arjun Reddy', email: 'arjun08@yovialschool.edu.in', role: 'Student', school: 'Yovial Public School', status: 'pending', lastActive: '1 hr ago' },
  { id: 'STD-1004', name: 'Ishita Joshi', email: 'ishita22@yovialschool.edu.in', role: 'Student', school: 'Yovial Scholars Campus', status: 'active', lastActive: '12 mins ago' },
];

export const parentData: SuperAdminPerson[] = [
  { id: 'PAR-2001', name: 'Ramesh Sharma', email: 'ramesh.sharma@yovialschool.edu.in', role: 'Parent', school: 'Yovial International School', status: 'active', lastActive: '7 mins ago' },
  { id: 'PAR-2002', name: 'Anusha Reddy', email: 'anusha.reddy@yovialschool.edu.in', role: 'Parent', school: 'Yovial Academy', status: 'active', lastActive: '14 mins ago' },
  { id: 'PAR-2003', name: 'Nikhil Shah', email: 'nikhil.shah@yovialschool.edu.in', role: 'Parent', school: 'Yovial Public School', status: 'pending', lastActive: '1 day ago' },
  { id: 'PAR-2004', name: 'Kavya Menon', email: 'kavya.menon@yovialschool.edu.in', role: 'Parent', school: 'Yovial Scholars Campus', status: 'active', lastActive: '25 mins ago' },
];

export const teacherData: SuperAdminPerson[] = [
  { id: 'TCH-3001', name: 'Anjali Reddy', email: 'anjali.reddy@yovialschool.edu.in', role: 'Teacher', school: 'Yovial International School', status: 'active', lastActive: 'Now' },
  { id: 'TCH-3002', name: 'Bhavya Pillai', email: 'bhavya.pillai@yovialschool.edu.in', role: 'Teacher', school: 'Yovial Academy', status: 'active', lastActive: '12 mins ago' },
  { id: 'TCH-3003', name: 'Michael George', email: 'michael.george@yovialschool.edu.in', role: 'Teacher', school: 'Yovial Public School', status: 'inactive', lastActive: '4 days ago' },
  { id: 'TCH-3004', name: 'Karthik Nair', email: 'karthik.nair@yovialschool.edu.in', role: 'Teacher', school: 'Yovial Scholars Campus', status: 'active', lastActive: '26 mins ago' },
];

export const receptionistData: SuperAdminPerson[] = [
  { id: 'REC-4001', name: 'Priya Nair', email: 'reception@yovialschool.edu.in', role: 'Receptionist', school: 'Yovial International School', status: 'active', lastActive: '4 mins ago' },
  { id: 'REC-4002', name: 'Sanjana Shah', email: 'sanjana.shah@yovialschool.edu.in', role: 'Receptionist', school: 'Yovial Academy', status: 'active', lastActive: '9 mins ago' },
  { id: 'REC-4003', name: 'Naren Das', email: 'naren.das@yovialschool.edu.in', role: 'Receptionist', school: 'Yovial Public School', status: 'pending', lastActive: '6 hrs ago' },
];

export const feeRecords: SuperAdminFeeRecord[] = [
  { id: 'FEE-001', student: 'Rahul Kumar', school: 'Yovial International School', amount: 42000, status: 'paid', date: '2026-07-18' },
  { id: 'FEE-002', student: 'Priya Sharma', school: 'Yovial Academy', amount: 38000, status: 'pending', date: '2026-07-20' },
  { id: 'FEE-003', student: 'Arjun Reddy', school: 'Yovial Public School', amount: 29500, status: 'overdue', date: '2026-07-12' },
  { id: 'FEE-004', student: 'Ishita Joshi', school: 'Yovial Scholars Campus', amount: 41000, status: 'paid', date: '2026-07-16' },
];

export const activityFeed = [
  { id: 'ACT-001', title: 'Latest Admission', detail: 'Aarav Sharma enrolled in Grade 9 at Yovial Academy', timestamp: '2 mins ago', category: 'admission' },
  { id: 'ACT-002', title: 'Teacher Joined', detail: 'Bhavya Pillai joined Yovial Academy faculty', timestamp: '14 mins ago', category: 'teacher' },
  { id: 'ACT-003', title: 'Fee Payment', detail: '₹42,000 paid by Rahul Kumar via UPI', timestamp: '26 mins ago', category: 'fee' },
  { id: 'ACT-004', title: 'Announcement', detail: 'Parent-Teacher Meeting scheduled for 27 Jul', timestamp: '43 mins ago', category: 'announcement' },
  { id: 'ACT-005', title: 'Leave Request', detail: '3 teachers requested leave this week', timestamp: '1 hr ago', category: 'leave' },
];

export const analyticsData = {
  studentGrowth: [
    { month: 'Jan', students: 7400 },
    { month: 'Feb', students: 7650 },
    { month: 'Mar', students: 7940 },
    { month: 'Apr', students: 8210 },
    { month: 'May', students: 8520 },
    { month: 'Jun', students: 8870 },
    { month: 'Jul', students: 9240 },
  ],
  revenue: [
    { month: 'Jan', revenue: 420000 },
    { month: 'Feb', revenue: 470000 },
    { month: 'Mar', revenue: 438000 },
    { month: 'Apr', revenue: 510000 },
    { month: 'May', revenue: 535000 },
    { month: 'Jun', revenue: 590000 },
    { month: 'Jul', revenue: 620000 },
  ],
  attendance: [
    { month: 'Jan', attendance: 92 },
    { month: 'Feb', attendance: 93 },
    { month: 'Mar', attendance: 94 },
    { month: 'Apr', attendance: 95 },
    { month: 'May', attendance: 96 },
    { month: 'Jun', attendance: 96.5 },
    { month: 'Jul', attendance: 96.2 },
  ],
  feeCollection: [
    { month: 'Jan', collected: 320000 },
    { month: 'Feb', collected: 345000 },
    { month: 'Mar', collected: 360000 },
    { month: 'Apr', collected: 380000 },
    { month: 'May', collected: 405000 },
    { month: 'Jun', collected: 420000 },
    { month: 'Jul', collected: 438000 },
  ],
  admissions: [
    { month: 'Jan', admissions: 48 },
    { month: 'Feb', admissions: 54 },
    { month: 'Mar', admissions: 60 },
    { month: 'Apr', admissions: 67 },
    { month: 'May', admissions: 72 },
    { month: 'Jun', admissions: 78 },
    { month: 'Jul', admissions: 82 },
  ],
};

export const superAdminSections = {
  schools: { title: 'Schools', description: 'Manage all active and inactive school entities in the ERP network.' },
  'academic-years': { title: 'Academic Years', description: 'Track academic planning windows, terms, and board-year rollouts.' },
  students: { title: 'Students', description: 'Review all school-wide student profiles and status updates.' },
  parents: { title: 'Parents', description: 'Manage parent access, child links, and communication status.' },
  teachers: { title: 'Teachers', description: 'View teacher assignments, onboarding state, and school allocation.' },
  receptionists: { title: 'Receptionists', description: 'Monitor front-desk staff coverage and service state.' },
  accounts: { title: 'Accounts', description: 'Review financial account summaries and institution-level revenue health.' },
  admissions: { title: 'Admissions', description: 'Monitor the full admission funnel across all schools.' },
  fees: { title: 'Fees', description: 'Track outstanding collections and payment behavior at scale.' },
  attendance: { title: 'Attendance', description: 'Access network-wide attendance performance monitors.' },
  examinations: { title: 'Examinations', description: 'View exam operations, academic planning, and results readiness.' },
  timetable: { title: 'Timetable', description: 'Coordinate section-wise schedules and class planning.' },
  transport: { title: 'Transport', description: 'Review route health, buses, and runs across the network.' },
  hostel: { title: 'Hostel', description: 'Monitor occupancy, hostel admin, and welfare alerts.' },
  library: { title: 'Library', description: 'Review issuance, activity, inventory, and usage.' },
  'hr-payroll': { title: 'HR & Payroll', description: 'Review payroll cases, staffing, and approvals.' },
  announcements: { title: 'Announcements', description: 'Create and monitor central school announcements.' },
  reports: { title: 'Reports', description: 'Generate and export network-level operational reports.' },
  analytics: { title: 'Analytics', description: 'Review cross-school trend data and growth indicators.' },
  'user-management': { title: 'User Management', description: 'Manage user access, account states, and profile lifecycle.' },
  'roles-permissions': { title: 'Roles & Permissions', description: 'Manage access matrices and approval policies.' },
  'backup-restore': { title: 'Backup & Restore', description: 'Run restore checks and manage data continuity for the ERP instance.' },
  'audit-logs': { title: 'Audit Logs', description: 'Inspect supervision, configuration changes, and security review history.' },
  settings: { title: 'Settings', description: 'Configure branding, preferred defaults, and operational policies.' },
};
