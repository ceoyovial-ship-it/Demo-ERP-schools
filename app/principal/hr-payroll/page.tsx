'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase,
  UserCheck,
  Calendar,
  Wallet,
  Check,
  X,
  Users,
  Receipt,
  CalendarClock,
} from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '@/components/page-header';
import { StatCard } from '@/components/stat-card';
import { SectionCard } from '@/components/section-card';
import { DataTable, type Column } from '@/components/data-table';
import { ExportButtons } from '@/components/export-buttons';
import { StatusBadge } from '@/components/status-badge';
import { Button } from '@/components/ui/button';
import { staffMembers, payrollData } from '@/lib/erp-data';
import { type ExportColumn } from '@/lib/export-utils';
import { cn } from '@/lib/utils';

/* -------------------------------------------------------------------------- */
/*  Types                                                                      */
/* -------------------------------------------------------------------------- */

type TabKey = 'employees' | 'payroll' | 'leave';

interface StaffMember {
  id: string;
  employeeId: string;
  name: string;
  role: string;
  department: string;
  salary: number;
  phone: string;
  email: string;
  joinDate: string;
  status: string;
  attendance: number;
}

interface PayrollRow {
  id: string;
  employeeId: string;
  name: string;
  role: string;
  basicSalary: number;
  hra: number;
  da: number;
  pf: number;
  netSalary: number;
  month: string;
  status: string;
}

interface LeaveRequest {
  id: string;
  employeeName: string;
  type: string;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
}

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                    */
/* -------------------------------------------------------------------------- */

/** Format a number as Indian Rupees with en-IN grouping. */
function formatINR(value: number): string {
  return `₹${value.toLocaleString('en-IN')}`;
}

/** Format a date string (YYYY-MM-DD) into a readable en-IN date. */
function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

/** Map a staff/payroll status string to a StatusBadge variant. */
function getStaffStatusVariant(
  status: string
): 'success' | 'warning' | 'destructive' | 'neutral' {
  if (status === 'active') return 'success';
  if (status === 'on-leave' || status === 'pending') return 'warning';
  if (status === 'rejected') return 'destructive';
  return 'neutral';
}

/* -------------------------------------------------------------------------- */
/*  Inline leave requests                                                      */
/* -------------------------------------------------------------------------- */

const leaveRequests: LeaveRequest[] = [
  {
    id: 'lv-1',
    employeeName: 'Priya Nair',
    type: 'Casual',
    startDate: '2025-07-18',
    endDate: '2025-07-19',
    days: 2,
    reason: 'Personal work',
    status: 'pending',
  },
  {
    id: 'lv-2',
    employeeName: 'Rajesh Kumar',
    type: 'Sick',
    startDate: '2025-07-15',
    endDate: '2025-07-16',
    days: 2,
    reason: 'Fever',
    status: 'approved',
  },
  {
    id: 'lv-3',
    employeeName: 'Meena Iyer',
    type: 'Personal',
    startDate: '2025-07-19',
    endDate: '2025-07-19',
    days: 1,
    reason: 'Family function',
    status: 'pending',
  },
  {
    id: 'lv-4',
    employeeName: 'Suresh Babu',
    type: 'Casual',
    startDate: '2025-07-22',
    endDate: '2025-07-23',
    days: 2,
    reason: 'Travel',
    status: 'pending',
  },
  {
    id: 'lv-5',
    employeeName: 'Kavita Singh',
    type: 'Sick',
    startDate: '2025-07-10',
    endDate: '2025-07-12',
    days: 3,
    reason: 'Medical procedure',
    status: 'approved',
  },
  {
    id: 'lv-6',
    employeeName: 'Arun Das',
    type: 'Earned',
    startDate: '2025-08-01',
    endDate: '2025-08-05',
    days: 5,
    reason: 'Vacation',
    status: 'rejected',
  },
];

/* -------------------------------------------------------------------------- */
/*  Tab configuration                                                          */
/* -------------------------------------------------------------------------- */

const tabs: { key: TabKey; label: string; icon: typeof Users }[] = [
  { key: 'employees', label: 'Employees', icon: Users },
  { key: 'payroll', label: 'Payroll', icon: Receipt },
  { key: 'leave', label: 'Leave Management', icon: CalendarClock },
];

const employeeExportColumns: ExportColumn[] = [
  { key: 'employeeId', label: 'Employee ID' },
  { key: 'name', label: 'Name' },
  { key: 'role', label: 'Role' },
  { key: 'department', label: 'Department' },
  { key: 'phone', label: 'Phone' },
  { key: 'salary', label: 'Salary' },
  { key: 'joinDate', label: 'Join Date' },
  { key: 'status', label: 'Status' },
];

const payrollExportColumns: ExportColumn[] = [
  { key: 'employeeId', label: 'Employee ID' },
  { key: 'name', label: 'Name' },
  { key: 'role', label: 'Role' },
  { key: 'basicSalary', label: 'Basic Salary' },
  { key: 'hra', label: 'HRA' },
  { key: 'da', label: 'DA' },
  { key: 'pf', label: 'PF' },
  { key: 'netSalary', label: 'Net Salary' },
  { key: 'month', label: 'Month' },
  { key: 'status', label: 'Status' },
];

const leaveExportColumns: ExportColumn[] = [
  { key: 'employeeName', label: 'Employee Name' },
  { key: 'type', label: 'Type' },
  { key: 'startDate', label: 'Start Date' },
  { key: 'endDate', label: 'End Date' },
  { key: 'days', label: 'Days' },
  { key: 'reason', label: 'Reason' },
  { key: 'status', label: 'Status' },
];

/* -------------------------------------------------------------------------- */
/*  Page                                                                        */
/* -------------------------------------------------------------------------- */

export default function HrPayrollPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('employees');
  const [leaves, setLeaves] = useState<LeaveRequest[]>(leaveRequests);

  /* ----------------------------- Employees -------------------------------- */
  const employeeColumns: Column<StaffMember>[] = [
    {
      key: 'employeeId',
      header: 'Employee ID',
      sortable: true,
      render: (row) => (
        <span className="font-mono text-xs font-medium">{row.employeeId}</span>
      ),
      className: 'whitespace-nowrap',
    },
    {
      key: 'name',
      header: 'Name',
      sortable: true,
      render: (row) => <span className="font-medium">{row.name}</span>,
      className: 'whitespace-nowrap',
    },
    {
      key: 'role',
      header: 'Role',
      sortable: true,
      render: (row) => <span>{row.role}</span>,
      className: 'whitespace-nowrap',
    },
    {
      key: 'department',
      header: 'Department',
      sortable: true,
      render: (row) => (
        <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs font-medium">
          {row.department}
        </span>
      ),
      className: 'whitespace-nowrap',
    },
    {
      key: 'phone',
      header: 'Phone',
      sortable: false,
      render: (row) => (
        <span className="font-mono text-xs text-muted-foreground">{row.phone}</span>
      ),
      className: 'whitespace-nowrap',
    },
    {
      key: 'salary',
      header: 'Salary',
      sortable: true,
      render: (row) => (
        <span className="tabular-nums font-semibold">{formatINR(row.salary)}</span>
      ),
      className: 'tabular-nums whitespace-nowrap',
    },
    {
      key: 'joinDate',
      header: 'Join Date',
      sortable: true,
      render: (row) => (
        <span className="text-muted-foreground">{formatDate(row.joinDate)}</span>
      ),
      className: 'whitespace-nowrap',
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (row) => (
        <StatusBadge
          status={row.status}
          variant={getStaffStatusVariant(row.status)}
        />
      ),
      className: 'whitespace-nowrap',
    },
  ];

  /* ------------------------------ Payroll --------------------------------- */
  const payrollColumns: Column<PayrollRow>[] = [
    {
      key: 'employeeId',
      header: 'Employee ID',
      sortable: true,
      render: (row) => (
        <span className="font-mono text-xs font-medium">{row.employeeId}</span>
      ),
      className: 'whitespace-nowrap',
    },
    {
      key: 'name',
      header: 'Name',
      sortable: true,
      render: (row) => <span className="font-medium">{row.name}</span>,
      className: 'whitespace-nowrap',
    },
    {
      key: 'role',
      header: 'Role',
      sortable: true,
      render: (row) => <span>{row.role}</span>,
      className: 'whitespace-nowrap',
    },
    {
      key: 'basicSalary',
      header: 'Basic Salary',
      sortable: true,
      render: (row) => (
        <span className="tabular-nums">{formatINR(row.basicSalary)}</span>
      ),
      className: 'tabular-nums whitespace-nowrap',
    },
    {
      key: 'hra',
      header: 'HRA',
      sortable: true,
      render: (row) => (
        <span className="tabular-nums text-muted-foreground">
          {formatINR(row.hra)}
        </span>
      ),
      className: 'tabular-nums whitespace-nowrap',
    },
    {
      key: 'da',
      header: 'DA',
      sortable: true,
      render: (row) => (
        <span className="tabular-nums text-muted-foreground">
          {formatINR(row.da)}
        </span>
      ),
      className: 'tabular-nums whitespace-nowrap',
    },
    {
      key: 'pf',
      header: 'PF',
      sortable: true,
      render: (row) => (
        <span className="tabular-nums text-destructive">{formatINR(row.pf)}</span>
      ),
      className: 'tabular-nums whitespace-nowrap',
    },
    {
      key: 'netSalary',
      header: 'Net Salary',
      sortable: true,
      render: (row) => (
        <span className="tabular-nums font-semibold">{formatINR(row.netSalary)}</span>
      ),
      className: 'tabular-nums whitespace-nowrap',
    },
    {
      key: 'month',
      header: 'Month',
      sortable: true,
      render: (row) => (
        <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs font-medium">
          {row.month}
        </span>
      ),
      className: 'whitespace-nowrap',
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (row) => (
        <StatusBadge
          status={row.status}
          variant={getStaffStatusVariant(row.status)}
        />
      ),
      className: 'whitespace-nowrap',
    },
  ];

  /* -------------------------- Leave Management ---------------------------- */
  const handleApprove = (leave: LeaveRequest) => {
    setLeaves((prev) =>
      prev.map((l) => (l.id === leave.id ? { ...l, status: 'approved' } : l))
    );
    toast.success(`Leave approved for ${leave.employeeName}`, {
      description: `${leave.days} day${leave.days > 1 ? 's' : ''} • ${leave.type} leave`,
    });
  };

  const handleReject = (leave: LeaveRequest) => {
    setLeaves((prev) =>
      prev.map((l) => (l.id === leave.id ? { ...l, status: 'rejected' } : l))
    );
    toast.error(`Leave rejected for ${leave.employeeName}`, {
      description: `${leave.type} leave request declined`,
    });
  };

  const leaveColumns: Column<LeaveRequest>[] = [
    {
      key: 'employeeName',
      header: 'Employee Name',
      sortable: true,
      render: (row) => <span className="font-medium">{row.employeeName}</span>,
      className: 'whitespace-nowrap',
    },
    {
      key: 'type',
      header: 'Type',
      sortable: true,
      render: (row) => (
        <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs font-medium">
          {row.type}
        </span>
      ),
      className: 'whitespace-nowrap',
    },
    {
      key: 'startDate',
      header: 'Start Date',
      sortable: true,
      render: (row) => (
        <span className="text-muted-foreground">{formatDate(row.startDate)}</span>
      ),
      className: 'whitespace-nowrap',
    },
    {
      key: 'endDate',
      header: 'End Date',
      sortable: true,
      render: (row) => (
        <span className="text-muted-foreground">{formatDate(row.endDate)}</span>
      ),
      className: 'whitespace-nowrap',
    },
    {
      key: 'days',
      header: 'Days',
      sortable: true,
      render: (row) => (
        <span className="tabular-nums font-medium">{row.days}</span>
      ),
      className: 'tabular-nums whitespace-nowrap',
    },
    {
      key: 'reason',
      header: 'Reason',
      sortable: false,
      render: (row) => (
        <span className="text-muted-foreground">{row.reason}</span>
      ),
      className: 'whitespace-nowrap',
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (row) => (
        <StatusBadge
          status={row.status}
          variant={getStaffStatusVariant(row.status)}
        />
      ),
      className: 'whitespace-nowrap',
    },
    {
      key: 'actions',
      header: 'Actions',
      sortable: false,
      render: (row) =>
        row.status === 'pending' ? (
          <div className="flex items-center gap-2">
            <Button
              size="icon"
              className="h-8 w-8 bg-success text-success-foreground hover:bg-success/90"
              onClick={(e) => {
                e.stopPropagation();
                handleApprove(row);
              }}
              title="Approve leave"
            >
              <Check className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="destructive"
              className="h-8 w-8"
              onClick={(e) => {
                e.stopPropagation();
                handleReject(row);
              }}
              title="Reject leave"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <span className="text-xs text-muted-foreground">—</span>
        ),
      className: 'whitespace-nowrap',
    },
  ];

  /* ------------------------------ Derived stats -------------------------- */
  const totalStaff = staffMembers.length;
  const activeStaff = staffMembers.filter((s) => s.status === 'active').length;
  const onLeaveStaff = staffMembers.filter((s) => s.status === 'on-leave').length;
  const pendingLeaves = leaves.filter((l) => l.status === 'pending').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="HR & Payroll"
        description="Manage employees, payroll, leaves, and performance"
      >
        <ExportButtons
          label="HR & payroll"
          data={staffMembers as unknown as Record<string, unknown>[]}
          columns={employeeExportColumns}
          filename="hr-payroll-directory"
        />
      </PageHeader>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Staff"
          value={totalStaff}
          icon={Briefcase}
          change={`${activeStaff} active`}
          changeType="neutral"
          description="Across all departments"
          delay={0}
        />
        <StatCard
          title="Active"
          value={activeStaff}
          icon={UserCheck}
          change={`${Math.round((activeStaff / totalStaff) * 100)}% of workforce`}
          changeType="positive"
          description="Currently on duty"
          delay={0.05}
        />
        <StatCard
          title="On Leave"
          value={onLeaveStaff}
          icon={Calendar}
          change={`${pendingLeaves} requests pending`}
          changeType="neutral"
          description="Awaiting approval or on leave"
          delay={0.1}
        />
        <StatCard
          title="Monthly Payroll"
          value="₹18.2L"
          icon={Wallet}
          change="+₹42K vs last month"
          changeType="positive"
          description="July 2025 disbursement"
          delay={0.15}
        />
      </div>

      {/* Tab navigation */}
      <div className="flex flex-wrap items-center gap-2 rounded-xl border bg-card p-1.5 shadow-premium">
        {tabs.map((tab) => {
          const TabIcon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                'relative flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <TabIcon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        {/* ----------------------------- Employees ----------------------------- */}
        {activeTab === 'employees' && (
          <motion.div
            key="employees"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            <SectionCard
              title="All Employees"
              description="Complete staff directory with roles, departments, and salaries"
            >
              <DataTable
                data={staffMembers}
                columns={employeeColumns}
                pageSize={10}
                searchKeys={['name', 'employeeId', 'role', 'department']}
                searchPlaceholder="Search by name, ID, role, or department..."
                initialSort={{ key: 'employeeId', dir: 'asc' }}
              />
            </SectionCard>
          </motion.div>
        )}

        {/* ------------------------------ Payroll ------------------------------ */}
        {activeTab === 'payroll' && (
          <motion.div
            key="payroll"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            <SectionCard
              title="Payroll — July 2025"
              description="Salary breakdown with basic, HRA, DA, PF deductions, and net pay"
            >
              <DataTable
                data={payrollData}
                columns={payrollColumns}
                pageSize={10}
                searchKeys={['name', 'employeeId', 'role']}
                searchPlaceholder="Search by name, ID, or role..."
                initialSort={{ key: 'employeeId', dir: 'asc' }}
              />
            </SectionCard>
          </motion.div>
        )}

        {/* -------------------------- Leave Management ------------------------ */}
        {activeTab === 'leave' && (
          <motion.div
            key="leave"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            {/* Leave summary */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <SectionCard title="Pending" delay={0}>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold tracking-tight text-accent-foreground">
                    {pendingLeaves}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    awaiting review
                  </span>
                </div>
              </SectionCard>
              <SectionCard title="Approved" delay={0.05}>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold tracking-tight text-success">
                    {leaves.filter((l) => l.status === 'approved').length}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    this month
                  </span>
                </div>
              </SectionCard>
              <SectionCard title="Rejected" delay={0.1}>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold tracking-tight text-destructive">
                    {leaves.filter((l) => l.status === 'rejected').length}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    this month
                  </span>
                </div>
              </SectionCard>
            </div>

            {/* Leave requests table */}
            <SectionCard
              title="Leave Requests"
              description="Review and act on pending leave applications from staff"
            >
              <DataTable
                data={leaves}
                columns={leaveColumns}
                pageSize={10}
                searchKeys={['employeeName', 'type', 'reason']}
                searchPlaceholder="Search by employee, type, or reason..."
                initialSort={{ key: 'startDate', dir: 'asc' }}
              />
            </SectionCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
