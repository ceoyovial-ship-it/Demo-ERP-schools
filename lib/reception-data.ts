// ============================================================
// Yovial School ERP — Receptionist Portal Demo Data
// ============================================================

const FIRST_NAMES = [
  'Aarav', 'Sneha', 'Karthik', 'Ananya', 'Vikram', 'Diya', 'Rohan',
  'Priya', 'Arjun', 'Meera', 'Kabir', 'Ishaan', 'Kiara', 'Aditya',
];
const LAST_NAMES = [
  'Patel', 'Reddy', 'Nair', 'Gupta', 'Singh', 'Sharma', 'Verma',
  'Iyer', 'Kumar', 'Jain', 'Rao', 'Desai', 'Menon', 'Shetty',
];
const PARENT_NAMES = [
  'Manish', 'Lakshmi', 'Deepa', 'Rohit', 'Harpreet', 'Ramesh', 'Suresh',
  'Padma', 'Geeta', 'Dinesh', 'Naresh', 'Sunita', 'Mahesh', 'Kavita',
];

function pick<T>(arr: T[], seed: number): T {
  return arr[seed % arr.length];
}

export interface Admission {
  id: string;
  admissionNumber: string;
  studentName: string;
  grade: string;
  section: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  date: string;
  status: 'active' | 'pending' | 'rejected';
  documentsSubmitted: number;
  documentsTotal: number;
  address: string;
  previousSchool: string;
  dob: string;
  gender: string;
  bloodGroup: string;
}

export const admissions: Admission[] = Array.from({ length: 24 }, (_, i) => {
  const seed = i + 1;
  const fn = pick(FIRST_NAMES, seed * 7);
  const ln = pick(LAST_NAMES, seed * 13);
  const pn = pick(PARENT_NAMES, seed * 5);
  const grade = String(1 + (seed % 10));
  const status: Admission['status'] = seed % 5 === 0 ? 'pending' : seed % 11 === 0 ? 'rejected' : 'active';
  return {
    id: `adm-${String(seed).padStart(3, '0')}`,
    admissionNumber: `YS2025-ADM-${String(seed).padStart(4, '0')}`,
    studentName: `${fn} ${ln}`,
    grade,
    section: pick(['A', 'B'], seed),
    parentName: `${pn} ${ln}`,
    parentPhone: `+91 90${String(seed).padStart(3, '0')} ${String(seed * 1234).slice(0, 5)}`,
    parentEmail: `${pn.toLowerCase()}.${ln.toLowerCase()}@email.com`,
    date: `2025-07-${String(14 - (seed % 14)).padStart(2, '0')}`,
    status,
    documentsSubmitted: 4 + (seed % 3),
    documentsTotal: 6,
    address: `${seed * 12 + 1}, ${pick(['MG Road', 'Park Street', 'Gandhi Nagar'], seed)}, Bengaluru`,
    previousSchool: pick(['Delhi Public School', 'Greenwood High', 'Bishop Cotton', 'St. Joseph\'s', 'Kendriya Vidyalaya'], seed),
    dob: `200${8 + (seed % 4)}-0${1 + (seed % 6)}-1${seed % 9}`,
    gender: seed % 2 === 0 ? 'Male' : 'Female',
    bloodGroup: pick(['A+', 'B+', 'O+', 'AB+'], seed),
  };
});

export interface Visitor {
  id: string;
  visitorName: string;
  visitorType: 'Parent' | 'Vendor' | 'Guest' | 'Official' | 'Alumni';
  purpose: string;
  visitingPerson: string;
  phone: string;
  checkInTime: string;
  checkOutTime: string | null;
  date: string;
  status: 'checked-in' | 'checked-out';
  idProof: string;
  photo: string | null;
}

export const visitors: Visitor[] = [
  { id: 'vis-1', visitorName: 'Ramesh Sharma', visitorType: 'Parent', purpose: 'Parent-Teacher Meeting', visitingPerson: 'Anjali Reddy', phone: '+91 90011 22334', checkInTime: '10:00 AM', checkOutTime: null, date: '2025-07-15', status: 'checked-in', idProof: 'Aadhaar', photo: null },
  { id: 'vis-2', visitorName: 'Lakshmi Nair', visitorType: 'Parent', purpose: 'Fee Payment', visitingPerson: 'Reception', phone: '+91 90022 33445', checkInTime: '09:30 AM', checkOutTime: '10:15 AM', date: '2025-07-15', status: 'checked-out', idProof: 'Driving License', photo: null },
  { id: 'vis-3', visitorName: 'Suresh Babu', visitorType: 'Vendor', purpose: 'Library Books Delivery', visitingPerson: 'Librarian', phone: '+91 90033 44556', checkInTime: '11:00 AM', checkOutTime: '11:30 AM', date: '2025-07-15', status: 'checked-out', idProof: 'PAN Card', photo: null },
  { id: 'vis-4', visitorName: 'Dr. Priya Menon', visitorType: 'Guest', purpose: 'Career Guidance Session', visitingPerson: 'Principal', phone: '+91 90044 55667', checkInTime: '01:00 PM', checkOutTime: null, date: '2025-07-15', status: 'checked-in', idProof: 'Aadhaar', photo: null },
  { id: 'vis-5', visitorName: 'Rajesh Kumar', visitorType: 'Parent', purpose: 'Admission Enquiry', visitingPerson: 'Reception', phone: '+91 90055 66778', checkInTime: '02:15 PM', checkOutTime: null, date: '2025-07-15', status: 'checked-in', idProof: 'Voter ID', photo: null },
  { id: 'vis-6', visitorName: 'Geeta Sharma', visitorType: 'Parent', purpose: 'Collect Report Card', visitingPerson: 'Class Teacher', phone: '+91 90066 77889', checkInTime: '03:00 PM', checkOutTime: '03:20 PM', date: '2025-07-14', status: 'checked-out', idProof: 'Aadhaar', photo: null },
  { id: 'vis-7', visitorName: 'Vikram Singh', visitorType: 'Official', purpose: 'CBSE Inspection', visitingPerson: 'Principal', phone: '+91 90077 88990', checkInTime: '10:30 AM', checkOutTime: '04:00 PM', date: '2025-07-14', status: 'checked-out', idProof: 'Govt ID', photo: null },
  { id: 'vis-8', visitorName: 'Anjali Desai', visitorType: 'Alumni', purpose: 'Alumni Meet Planning', visitingPerson: 'Principal', phone: '+91 90088 99001', checkInTime: '04:30 PM', checkOutTime: '05:15 PM', date: '2025-07-14', status: 'checked-out', idProof: 'PAN Card', photo: null },
  { id: 'vis-9', visitorName: 'Mahesh Rao', visitorType: 'Vendor', purpose: 'Sports Equipment Delivery', visitingPerson: 'PE Teacher', phone: '+91 90099 11223', checkInTime: '09:00 AM', checkOutTime: '09:45 AM', date: '2025-07-13', status: 'checked-out', idProof: 'Driving License', photo: null },
  { id: 'vis-10', visitorName: 'Sunita Iyer', visitorType: 'Parent', purpose: 'Leave Application Submission', visitingPerson: 'Class Teacher', phone: '+91 90110 22334', checkInTime: '11:30 AM', checkOutTime: '12:00 PM', date: '2025-07-13', status: 'checked-out', idProof: 'Aadhaar', photo: null },
];

export interface FeePayment {
  id: string;
  receiptNo: string;
  studentName: string;
  admissionNumber: string;
  classSection: string;
  feeType: string;
  amount: number;
  paymentDate: string;
  paymentTime: string;
  method: 'Cash' | 'Card' | 'UPI' | 'Bank Transfer' | 'Cheque';
  collectedBy: string;
  status: 'paid' | 'pending' | 'partial';
}

export const feePayments: FeePayment[] = Array.from({ length: 30 }, (_, i) => {
  const seed = i + 1;
  const fn = pick(FIRST_NAMES, seed * 11);
  const ln = pick(LAST_NAMES, seed * 17);
  const grade = String(6 + (seed % 5));
  const methods: FeePayment['method'][] = ['Cash', 'Card', 'UPI', 'Bank Transfer', 'Cheque'];
  return {
    id: `pay-${String(seed).padStart(3, '0')}`,
    receiptNo: `RCP-${String(seed).padStart(5, '0')}`,
    studentName: `${fn} ${ln}`,
    admissionNumber: `YS2025-${String(seed).padStart(4, '0')}`,
    classSection: `${grade}-${pick(['A', 'B'], seed)}`,
    feeType: pick(['Tuition', 'Transport', 'Lab', 'Library', 'Exam', 'Hostel'], seed),
    amount: 5000 + (seed * 3500) % 40000,
    paymentDate: `2025-07-${String(15 - (seed % 15)).padStart(2, '0')}`,
    paymentTime: `${10 + (seed % 5)}:${String(seed * 7 % 60).padStart(2, '0')} ${seed % 2 === 0 ? 'AM' : 'PM'}`,
    method: pick(methods, seed),
    collectedBy: 'Priya Nair',
    status: seed % 5 === 0 ? 'partial' : seed % 7 === 0 ? 'pending' : 'paid',
  };
});

export interface Appointment {
  id: string;
  parentName: string;
  studentName: string;
  purpose: string;
  withWhom: string;
  date: string;
  time: string;
  duration: string;
  phone: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'pending';
  notes: string;
}

export const appointments: Appointment[] = [
  { id: 'apt-1', parentName: 'Ramesh Sharma', studentName: 'Rahul Sharma', purpose: 'Discuss Mathematics Performance', withWhom: 'Anjali Reddy', date: '2025-07-16', time: '11:00 AM', duration: '30 min', phone: '+91 90011 22334', status: 'scheduled', notes: 'Parent requested meeting about declining math scores' },
  { id: 'apt-2', parentName: 'Lakshmi Nair', studentName: 'Arjun Nair', purpose: 'Admission Discussion', withWhom: 'Principal', date: '2025-07-16', time: '02:00 PM', duration: '45 min', phone: '+91 90022 33445', status: 'scheduled', notes: 'Grade 6 admission for next academic year' },
  { id: 'apt-3', parentName: 'Suresh Babu', studentName: 'Karthik Babu', purpose: 'Fee Structure Query', withWhom: 'Reception', date: '2025-07-15', time: '10:00 AM', duration: '20 min', phone: '+91 90033 44556', status: 'completed', notes: 'Discussed Q3 fee payment options' },
  { id: 'apt-4', parentName: 'Geeta Sharma', studentName: 'Diya Sharma', purpose: 'Leave Request Discussion', withWhom: 'Class Teacher', date: '2025-07-15', time: '03:30 PM', duration: '15 min', phone: '+91 90066 77889', status: 'completed', notes: '5-day leave for family function approved' },
  { id: 'apt-5', parentName: 'Rajesh Kumar', studentName: 'Priya Kumar', purpose: 'Transport Route Change', withWhom: 'Transport In-charge', date: '2025-07-17', time: '09:30 AM', duration: '20 min', phone: '+91 90055 66778', status: 'pending', notes: 'Requesting change from Route 3 to Route 7' },
  { id: 'apt-6', parentName: 'Sunita Iyer', studentName: 'Vikram Iyer', purpose: 'Health Issue Discussion', withWhom: 'Class Teacher', date: '2025-07-17', time: '01:00 PM', duration: '30 min', phone: '+91 90110 22334', status: 'pending', notes: 'Asthma management during PE classes' },
  { id: 'apt-7', parentName: 'Mahesh Rao', studentName: 'Sneha Rao', purpose: 'Academic Performance Review', withWhom: 'Principal', date: '2025-07-18', time: '11:30 AM', duration: '45 min', phone: '+91 90099 11223', status: 'pending', notes: 'Quarterly performance review' },
  { id: 'apt-8', parentName: 'Kavita Jain', studentName: 'Aarav Jain', purpose: 'Library Book Issue', withWhom: 'Librarian', date: '2025-07-14', time: '10:30 AM', duration: '15 min', phone: '+91 90077 88990', status: 'cancelled', notes: 'Parent cancelled due to emergency' },
];

export const visitorStats = {
  today: visitors.filter((v) => v.date === '2025-07-15').length,
  checkedIn: visitors.filter((v) => v.status === 'checked-in').length,
  thisWeek: 42,
  thisMonth: 168,
};

export const admissionStats = {
  total: admissions.length,
  active: admissions.filter((a) => a.status === 'active').length,
  pending: admissions.filter((a) => a.status === 'pending').length,
  rejected: admissions.filter((a) => a.status === 'rejected').length,
  thisMonth: 24,
};

export const feeStats = {
  collectedToday: 125000,
  totalThisMonth: 535000,
  pendingCount: 42,
  pendingAmount: 150000,
  receiptsToday: 18,
};

export const appointmentStats = {
  total: appointments.length,
  scheduled: appointments.filter((a) => a.status === 'scheduled').length,
  completed: appointments.filter((a) => a.status === 'completed').length,
  pending: appointments.filter((a) => a.status === 'pending').length,
  today: 3,
};

export const enquiryStats = {
  total: 56,
  today: 8,
  converted: 24,
  pending: 12,
};

// Students data for reception (reuse from erp-data but re-export for convenience)
export { students } from '@/lib/erp-data';
