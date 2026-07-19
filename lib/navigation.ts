import {
  LayoutDashboard,
  Users,
  GraduationCap,
  UserCog,
  BookOpen,
  CalendarCheck,
  ClipboardList,
  Wallet,
  Library,
  Bus,
  Building2,
  Briefcase,
  MessageSquare,
  Brain,
  FileBarChart,
  Settings,
  UserPlus,
  CalendarClock,
  Calendar,
  User,
  FileText,
  Download,
  ClipboardCheck,
  Bell,
  Mail,
  CalendarDays,
  BookMarked,
  Shield,
  Database,
  KeyRound,
  Castle,
  type LucideIcon,
} from 'lucide-react';
import type { UserRole } from '@/lib/types';

export interface NavItem {
  label: string;
  icon: LucideIcon;
  href: string;
  roles: UserRole[];
  badge?: string;
}

export const ALL_NAV_ITEMS: NavItem[] = [
  // Shared
  { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard', roles: ['principal', 'receptionist', 'teacher', 'student', 'parent', 'superadmin'] },

  // Super Admin
  { label: 'Schools', icon: Castle, href: '/schools', roles: ['superadmin'] },
  { label: 'Academic Years', icon: BookOpen, href: '/academic-years', roles: ['superadmin'] },
  { label: 'Students', icon: Users, href: '/students', roles: ['superadmin'] },
  { label: 'Parents', icon: UserCog, href: '/parents', roles: ['superadmin'] },
  { label: 'Teachers', icon: GraduationCap, href: '/teachers', roles: ['superadmin'] },
  { label: 'Receptionists', icon: UserPlus, href: '/receptionists', roles: ['superadmin'] },
  { label: 'Accounts', icon: Wallet, href: '/accounts', roles: ['superadmin'] },
  { label: 'Admissions', icon: UserPlus, href: '/admissions', roles: ['superadmin'] },
  { label: 'Fees', icon: Wallet, href: '/fees', roles: ['superadmin'] },
  { label: 'Attendance', icon: CalendarCheck, href: '/attendance', roles: ['superadmin'] },
  { label: 'Examinations', icon: ClipboardList, href: '/examinations', roles: ['superadmin'] },
  { label: 'Timetable', icon: CalendarDays, href: '/timetable', roles: ['superadmin'] },
  { label: 'Transport', icon: Bus, href: '/transport', roles: ['superadmin'] },
  { label: 'Hostel', icon: Building2, href: '/hostel', roles: ['superadmin'] },
  { label: 'Library', icon: Library, href: '/library', roles: ['superadmin'] },
  { label: 'HR & Payroll', icon: Briefcase, href: '/hr-payroll', roles: ['superadmin'] },
  { label: 'Announcements', icon: Bell, href: '/announcements', roles: ['superadmin'] },
  { label: 'Reports', icon: FileBarChart, href: '/reports', roles: ['superadmin'] },
  { label: 'Analytics', icon: Brain, href: '/analytics', roles: ['superadmin'] },
  { label: 'User Management', icon: Users, href: '/user-management', roles: ['superadmin'] },
  { label: 'Roles & Permissions', icon: Shield, href: '/roles-permissions', roles: ['superadmin'] },
  { label: 'Backup & Restore', icon: Database, href: '/backup-restore', roles: ['superadmin'] },
  { label: 'Audit Logs', icon: FileText, href: '/audit-logs', roles: ['superadmin'] },
  { label: 'Settings', icon: Settings, href: '/settings', roles: ['superadmin'] },

  // Receptionist
  { label: 'Admissions', icon: UserPlus, href: '/admissions', roles: ['receptionist'] },
  { label: 'Fee Collection', icon: Wallet, href: '/fee-collection', roles: ['receptionist'] },
  { label: 'Visitors', icon: Users, href: '/visitors', roles: ['receptionist'] },
  { label: 'Appointments', icon: CalendarClock, href: '/appointments', roles: ['receptionist'] },

  // Principal
  { label: 'Students', icon: Users, href: '/students', roles: ['principal', 'receptionist'] },
  { label: 'Teachers', icon: GraduationCap, href: '/teachers', roles: ['principal'] },
  { label: 'Parents', icon: UserCog, href: '/parents', roles: ['principal', 'receptionist'] },
  { label: 'Academics', icon: BookOpen, href: '/academics', roles: ['principal'] },
  { label: 'Attendance', icon: CalendarCheck, href: '/attendance', roles: ['principal'] },
  { label: 'Examinations', icon: ClipboardList, href: '/examinations', roles: ['principal'] },
  { label: 'Fees', icon: Wallet, href: '/fees', roles: ['principal'] },
  { label: 'Library', icon: Library, href: '/library', roles: ['principal'] },
  { label: 'Transport', icon: Bus, href: '/transport', roles: ['principal'] },
  { label: 'Hostel', icon: Building2, href: '/hostel', roles: ['principal'] },
  { label: 'HR & Payroll', icon: Briefcase, href: '/hr-payroll', roles: ['principal'] },
  { label: 'Communication', icon: MessageSquare, href: '/communication', roles: ['principal'] },
  { label: 'AI Analytics', icon: Brain, href: '/ai-analytics', roles: ['principal'] },
  { label: 'Reports', icon: FileBarChart, href: '/reports', roles: ['principal'] },
  { label: 'Settings', icon: Settings, href: '/settings', roles: ['principal', 'teacher', 'student'] },

  // Teacher
  { label: 'My Classes', icon: BookOpen, href: '/my-classes', roles: ['teacher'] },
  { label: 'Attendance', icon: CalendarCheck, href: '/attendance', roles: ['teacher'] },
  { label: 'Marks Entry', icon: ClipboardList, href: '/marks-entry', roles: ['teacher'] },
  { label: 'Assignments', icon: FileText, href: '/assignments', roles: ['teacher', 'student'] },
  { label: 'Lesson Plans', icon: BookMarked, href: '/lesson-plans', roles: ['teacher'] },
  { label: 'Timetable', icon: CalendarDays, href: '/timetable', roles: ['teacher', 'student'] },
  { label: 'Announcements', icon: Bell, href: '/announcements', roles: ['teacher'] },
  { label: 'Messages', icon: Mail, href: '/messages', roles: ['teacher'] },
  { label: 'Profile', icon: User, href: '/profile', roles: ['teacher'] },
  { label: 'Settings', icon: Settings, href: '/settings', roles: ['teacher'] },

  // Student
  { label: 'My Profile', icon: User, href: '/my-profile', roles: ['student'] },
  { label: 'Student Attendance', icon: CalendarCheck, href: '/student-attendance', roles: ['student'] },
  { label: 'Student Marks', icon: ClipboardList, href: '/student-marks', roles: ['student'] },
  { label: 'Exams', icon: ClipboardList, href: '/student-exams', roles: ['student'] },
  { label: 'Student Fees', icon: Wallet, href: '/student-fees', roles: ['student'] },
  { label: 'Student Library', icon: Library, href: '/student-library', roles: ['student'] },
  { label: 'Student Transport', icon: Bus, href: '/student-transport', roles: ['student'] },
  { label: 'Student Announcements', icon: Bell, href: '/student-announcements', roles: ['student'] },
  { label: 'Student Messages', icon: Mail, href: '/student-messages', roles: ['student'] },
  { label: 'Downloads', icon: Download, href: '/downloads', roles: ['student'] },

  // Parent
  { label: 'Attendance', icon: CalendarCheck, href: '/attendance', roles: ['parent'] },
  { label: 'Academics', icon: BookOpen, href: '/academics', roles: ['parent'] },
  { label: 'Homework', icon: BookMarked, href: '/homework', roles: ['parent'] },
  { label: 'Assignments', icon: FileText, href: '/assignments', roles: ['parent'] },
  { label: 'Examination Results', icon: ClipboardList, href: '/examinations', roles: ['parent'] },
  { label: 'Fee Details', icon: Wallet, href: '/fees', roles: ['parent'] },
  { label: 'Transport', icon: Bus, href: '/transport', roles: ['parent'] },
  { label: 'Notifications', icon: Bell, href: '/notifications', roles: ['parent'] },
  { label: 'Message Teacher', icon: Mail, href: '/messages', roles: ['parent'] },
  { label: 'Profile', icon: User, href: '/my-profile', roles: ['parent'] },
  { label: 'Settings', icon: Settings, href: '/settings', roles: ['parent'] },
  { label: 'Change Password', icon: Settings, href: '/change-password', roles: ['parent'] },
];

export function getNavItemsForRole(role: UserRole): NavItem[] {
  return ALL_NAV_ITEMS.filter((item) => item.roles.includes(role));
}
