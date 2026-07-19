'use client';

import { Badge } from '@/components/ui/badge';
import { SuperAdminSectionPage } from '@/components/super-admin-section-page';
import type { Column } from '@/components/data-table';
import {
  schoolData,
  studentData,
  parentData,
  teacherData,
  receptionistData,
  feeRecords,
  SuperAdminSection,
} from '@/lib/super-admin-data';

interface SuperAdminSlugPageProps {
  params: { slug: string };
}

const sectionConfigs: Record<string, { title: string; description: string; data: any[]; searchKeys: string[]; columns: Column<any>[] }> = {
  schools: {
    title: 'Schools',
    description: 'Manage all schools in the Yovial network.',
    data: schoolData,
    searchKeys: ['name', 'city', 'principal'],
    columns: [
      { key: 'id', header: 'School ID', sortable: true },
      { key: 'name', header: 'School', sortable: true },
      { key: 'city', header: 'City', sortable: true },
      { key: 'principal', header: 'Principal', sortable: true },
      { key: 'students', header: 'Students', sortable: true },
      { key: 'teachers', header: 'Teachers', sortable: true },
      { key: 'revenue', header: 'Revenue', sortable: true },
      {
        key: 'status',
        header: 'Status',
        sortable: true,
        render: (row: (typeof schoolData)[number]) => (
          <Badge variant={row.status === 'active' ? 'default' : 'secondary'}>{row.status}</Badge>
        ),
      },
    ],
  },
  students: {
    title: 'Students',
    description: 'Cross-school student directory with account status.',
    data: studentData,
    searchKeys: ['name', 'email', 'school'],
    columns: [
      { key: 'id', header: 'Student ID', sortable: true },
      { key: 'name', header: 'Name', sortable: true },
      { key: 'email', header: 'Email', sortable: true },
      { key: 'school', header: 'School', sortable: true },
      {
        key: 'status',
        header: 'Status',
        sortable: true,
        render: (row: (typeof studentData)[number]) => (
          <Badge variant={row.status === 'active' ? 'default' : row.status === 'pending' ? 'outline' : 'secondary'}>{row.status}</Badge>
        ),
      },
      { key: 'lastActive', header: 'Last Active', sortable: true },
    ],
  },
  parents: {
    title: 'Parents',
    description: 'Parent account summary across schools.',
    data: parentData,
    searchKeys: ['name', 'email', 'school'],
    columns: [
      { key: 'id', header: 'Parent ID', sortable: true },
      { key: 'name', header: 'Name', sortable: true },
      { key: 'email', header: 'Email', sortable: true },
      { key: 'school', header: 'School', sortable: true },
      { key: 'status', header: 'Status', sortable: true },
      { key: 'lastActive', header: 'Last Active', sortable: true },
    ],
  },
  teachers: {
    title: 'Teachers',
    description: 'Teacher allocation and onboarding overview.',
    data: teacherData,
    searchKeys: ['name', 'email', 'school'],
    columns: [
      { key: 'id', header: 'Teacher ID', sortable: true },
      { key: 'name', header: 'Name', sortable: true },
      { key: 'email', header: 'Email', sortable: true },
      { key: 'school', header: 'School', sortable: true },
      { key: 'status', header: 'Status', sortable: true },
      { key: 'lastActive', header: 'Last Active', sortable: true },
    ],
  },
  receptionists: {
    title: 'Receptionists',
    description: 'Front-office team visibility and roles.',
    data: receptionistData,
    searchKeys: ['name', 'email', 'school'],
    columns: [
      { key: 'id', header: 'Receptionist ID', sortable: true },
      { key: 'name', header: 'Name', sortable: true },
      { key: 'email', header: 'Email', sortable: true },
      { key: 'school', header: 'School', sortable: true },
      { key: 'status', header: 'Status', sortable: true },
      { key: 'lastActive', header: 'Last Active', sortable: true },
    ],
  },
  fees: {
    title: 'Fees',
    description: 'Collected and pending fee records across schools.',
    data: feeRecords,
    searchKeys: ['student', 'school'],
    columns: [
      { key: 'id', header: 'Fee ID', sortable: true },
      { key: 'student', header: 'Student', sortable: true },
      { key: 'school', header: 'School', sortable: true },
      { key: 'amount', header: 'Amount', sortable: true },
      {
        key: 'status',
        header: 'Status',
        sortable: true,
        render: (row: (typeof feeRecords)[number]) => (
          <Badge variant={row.status === 'paid' ? 'default' : row.status === 'pending' ? 'outline' : 'secondary'}>{row.status}</Badge>
        ),
      },
      { key: 'date', header: 'Date', sortable: true },
    ],
  },
  accounts: {
    title: 'Accounts',
    description: 'Financial account overview for the school network.',
    data: feeRecords,
    searchKeys: ['student', 'school'],
    columns: [
      { key: 'id', header: 'Account ID', sortable: true },
      { key: 'student', header: 'Student', sortable: true },
      { key: 'school', header: 'School', sortable: true },
      { key: 'amount', header: 'Amount', sortable: true },
      { key: 'status', header: 'Status', sortable: true },
      { key: 'date', header: 'Date', sortable: true },
    ],
  },
  admissions: {
    title: 'Admissions',
    description: 'Admission queue and processing summary.',
    data: studentData,
    searchKeys: ['name', 'school'],
    columns: [
      { key: 'id', header: 'Admission ID', sortable: true },
      { key: 'name', header: 'Student', sortable: true },
      { key: 'school', header: 'School', sortable: true },
      { key: 'status', header: 'Status', sortable: true },
      { key: 'lastActive', header: 'Updated', sortable: true },
    ],
  },
  attendance: {
    title: 'Attendance',
    description: 'Track daily attendance health across all schools.',
    data: studentData,
    searchKeys: ['name', 'school'],
    columns: [
      { key: 'id', header: 'Record ID', sortable: true },
      { key: 'name', header: 'Student', sortable: true },
      { key: 'school', header: 'School', sortable: true },
      { key: 'status', header: 'Status', sortable: true },
      { key: 'lastActive', header: 'Last Marked', sortable: true },
    ],
  },
  examinations: {
    title: 'Examinations',
    description: 'School-level exam schedule and oversight.',
    data: schoolData,
    searchKeys: ['name', 'city'],
    columns: [
      { key: 'id', header: 'Exam ID', sortable: true },
      { key: 'name', header: 'School', sortable: true },
      { key: 'city', header: 'City', sortable: true },
      { key: 'students', header: 'Students', sortable: true },
      { key: 'status', header: 'Status', sortable: true },
    ],
  },
  timetable: {
    title: 'Timetable',
    description: 'Section timetable visibility and schedule control.',
    data: schoolData,
    searchKeys: ['name', 'city'],
    columns: [
      { key: 'id', header: 'Schedule ID', sortable: true },
      { key: 'name', header: 'School', sortable: true },
      { key: 'city', header: 'City', sortable: true },
      { key: 'students', header: 'Classes', sortable: true },
      { key: 'status', header: 'Status', sortable: true },
    ],
  },
  transport: {
    title: 'Transport',
    description: 'Route health and fleet availability monitoring.',
    data: schoolData,
    searchKeys: ['name', 'city'],
    columns: [
      { key: 'id', header: 'Route ID', sortable: true },
      { key: 'name', header: 'School', sortable: true },
      { key: 'city', header: 'City', sortable: true },
      { key: 'students', header: 'Students', sortable: true },
      { key: 'status', header: 'Status', sortable: true },
    ],
  },
  hostel: {
    title: 'Hostel',
    description: 'Residential occupancy and welfare monitoring.',
    data: schoolData,
    searchKeys: ['name', 'city'],
    columns: [
      { key: 'id', header: 'Hostel ID', sortable: true },
      { key: 'name', header: 'School', sortable: true },
      { key: 'city', header: 'City', sortable: true },
      { key: 'students', header: 'Occupancy', sortable: true },
      { key: 'status', header: 'Status', sortable: true },
    ],
  },
  library: {
    title: 'Library',
    description: 'Network library activity and issue summary.',
    data: schoolData,
    searchKeys: ['name', 'city'],
    columns: [
      { key: 'id', header: 'Library ID', sortable: true },
      { key: 'name', header: 'School', sortable: true },
      { key: 'city', header: 'City', sortable: true },
      { key: 'teachers', header: 'Books', sortable: true },
      { key: 'status', header: 'Status', sortable: true },
    ],
  },
  'hr-payroll': {
    title: 'HR & Payroll',
    description: 'Payroll and workforce activity center.',
    data: teacherData,
    searchKeys: ['name', 'email'],
    columns: [
      { key: 'id', header: 'Payroll ID', sortable: true },
      { key: 'name', header: 'Employee', sortable: true },
      { key: 'email', header: 'Email', sortable: true },
      { key: 'school', header: 'School', sortable: true },
      { key: 'status', header: 'Status', sortable: true },
    ],
  },
  announcements: {
    title: 'Announcements',
    description: 'Central governance announcements and updates.',
    data: schoolData,
    searchKeys: ['name', 'city'],
    columns: [
      { key: 'id', header: 'Announcement ID', sortable: true },
      { key: 'name', header: 'School', sortable: true },
      { key: 'city', header: 'City', sortable: true },
      { key: 'principal', header: 'Owner', sortable: true },
      { key: 'status', header: 'Status', sortable: true },
    ],
  },
  reports: {
    title: 'Reports',
    description: 'Professional reports with PDF, Excel, and print support.',
    data: feeRecords,
    searchKeys: ['student', 'school'],
    columns: [
      { key: 'id', header: 'Report ID', sortable: true },
      { key: 'student', header: 'Student', sortable: true },
      { key: 'school', header: 'School', sortable: true },
      { key: 'amount', header: 'Amount', sortable: true },
      { key: 'status', header: 'Status', sortable: true },
    ],
  },
  analytics: {
    title: 'Analytics',
    description: 'Dashboard-level analytics and trend visibility.',
    data: schoolData,
    searchKeys: ['name', 'city'],
    columns: [
      { key: 'id', header: 'Analytics ID', sortable: true },
      { key: 'name', header: 'School', sortable: true },
      { key: 'city', header: 'City', sortable: true },
      { key: 'students', header: 'Students', sortable: true },
      { key: 'revenue', header: 'Revenue', sortable: true },
    ],
  },
  'user-management': {
    title: 'User Management',
    description: 'Centralized user access and lifecycle states.',
    data: teacherData,
    searchKeys: ['name', 'email'],
    columns: [
      { key: 'id', header: 'User ID', sortable: true },
      { key: 'name', header: 'Name', sortable: true },
      { key: 'email', header: 'Email', sortable: true },
      { key: 'role', header: 'Role', sortable: true },
      { key: 'status', header: 'Status', sortable: true },
    ],
  },
  'roles-permissions': {
    title: 'Roles & Permissions',
    description: 'Role matrix and permission policy checks.',
    data: teacherData,
    searchKeys: ['name', 'email'],
    columns: [
      { key: 'id', header: 'Permission ID', sortable: true },
      { key: 'name', header: 'Name', sortable: true },
      { key: 'role', header: 'Role', sortable: true },
      { key: 'school', header: 'School', sortable: true },
      { key: 'status', header: 'Status', sortable: true },
    ],
  },
  'backup-restore': {
    title: 'Backup & Restore',
    description: 'Operational backup and restore controls.',
    data: schoolData,
    searchKeys: ['name', 'city'],
    columns: [
      { key: 'id', header: 'Backup ID', sortable: true },
      { key: 'name', header: 'School', sortable: true },
      { key: 'city', header: 'City', sortable: true },
      { key: 'status', header: 'Status', sortable: true },
    ],
  },
  'audit-logs': {
    title: 'Audit Logs',
    description: 'Review complete operational event history.',
    data: schoolData,
    searchKeys: ['name', 'city'],
    columns: [
      { key: 'id', header: 'Log ID', sortable: true },
      { key: 'name', header: 'School', sortable: true },
      { key: 'city', header: 'City', sortable: true },
      { key: 'principal', header: 'Actor', sortable: true },
      { key: 'status', header: 'Status', sortable: true },
    ],
  },
  settings: {
    title: 'Settings',
    description: 'Global branding and ERP preferences.',
    data: schoolData,
    searchKeys: ['name', 'city'],
    columns: [
      { key: 'id', header: 'Setting ID', sortable: true },
      { key: 'name', header: 'School', sortable: true },
      { key: 'city', header: 'City', sortable: true },
      { key: 'branding', header: 'Branding', sortable: true },
      { key: 'status', header: 'Status', sortable: true },
    ],
  },
};

export default function SuperAdminSlugPage({ params }: SuperAdminSlugPageProps) {
  const sectionKey = params.slug as SuperAdminSection;
  const config = sectionConfigs[sectionKey] ?? sectionConfigs.schools;

  return (
    <SuperAdminSectionPage
      sectionKey={sectionKey}
      title={config.title}
      description={config.description}
      data={config.data}
      columns={config.columns}
      searchKeys={config.searchKeys as any}
      emptyMessage="No records found for this Super Admin section"
    />
  );
}
