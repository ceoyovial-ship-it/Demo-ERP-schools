export type UserRole = 'principal' | 'receptionist' | 'teacher' | 'student' | 'parent' | 'superadmin';

export interface Profile {
  id: string;
  email: string;
  role: UserRole;
  full_name: string;
  avatar_url: string | null;
  phone: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Student {
  id: string;
  admission_number: string;
  profile_id: string | null;
  class_grade: string;
  section: string;
  roll_number: number | null;
  parent_id: string | null;
  admission_date: string;
  status: 'active' | 'inactive' | 'graduated' | 'transferred';
  created_at: string;
}

export interface AttendanceRecord {
  id: string;
  student_id: string;
  date: string;
  status: 'present' | 'absent' | 'late';
  marked_by: string | null;
  created_at: string;
}

export interface MarkRecord {
  id: string;
  student_id: string;
  exam_name: string;
  subject: string;
  max_marks: number;
  obtained_marks: number;
  grade: string | null;
  recorded_by: string | null;
  created_at: string;
}

export interface FeeRecord {
  id: string;
  student_id: string;
  fee_type: string;
  amount: number;
  paid_amount: number;
  status: 'pending' | 'paid' | 'overdue' | 'partial';
  due_date: string | null;
  payment_date: string | null;
  created_at: string;
}

export const ROLE_DASHBOARD_PATHS: Record<UserRole, string> = {
  principal: '/principal/dashboard',
  receptionist: '/reception/dashboard',
  teacher: '/teacher/dashboard',
  student: '/student/dashboard',
  parent: '/parent/dashboard',
  superadmin: '/superadmin/dashboard',
};

export const ROLE_ROUTE_PREFIX: Record<UserRole, string> = {
  principal: '/principal',
  receptionist: '/reception',
  teacher: '/teacher',
  student: '/student',
  parent: '/parent',
  superadmin: '/superadmin',
};

export const ROLE_LABELS: Record<UserRole, string> = {
  principal: 'Principal',
  receptionist: 'Receptionist',
  teacher: 'Teacher',
  student: 'Student',
  parent: 'Parent',
  superadmin: 'Super Admin',
};

export const DEMO_ACCOUNTS = [
  { email: 'principal@yovialschool.edu.in', password: 'Yovial@2025', role: 'principal' as UserRole, label: 'Principal', name: 'Dr. Vikram Rao' },
  { email: 'reception@yovialschool.edu.in', password: 'Yovial@2025', role: 'receptionist' as UserRole, label: 'Receptionist', name: 'Priya Nair' },
  { email: 'anjali.reddy@yovialschool.edu.in', password: 'Yovial@2025', role: 'teacher' as UserRole, label: 'Teacher', name: 'Anjali Reddy' },
  { email: 'superadmin@yovialschool.edu.in', password: 'admin123', role: 'superadmin' as UserRole, label: 'Super Admin', name: 'Neha Verma' },
  { email: 'rahul10@yovialschool.edu.in', password: 'Rahul@123', role: 'student' as UserRole, label: 'Student - Rahul', name: 'Rahul Kumar' },
  { email: 'priya09@yovialschool.edu.in', password: 'Priya@123', role: 'student' as UserRole, label: 'Student - Priya', name: 'Priya Sharma' },
  { email: 'arjun08@yovialschool.edu.in', password: 'Arjun@123', role: 'student' as UserRole, label: 'Student - Arjun', name: 'Arjun Reddy' },
  { email: 'ramesh.sharma@yovialschool.edu.in', password: 'Yovial@2025', role: 'parent' as UserRole, label: 'Parent', name: 'Ramesh Sharma' },
];
