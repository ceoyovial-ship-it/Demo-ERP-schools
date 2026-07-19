'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wallet,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Receipt,
  LayoutGrid,
  ArrowLeftRight,
  ListChecks,
  AlertTriangle,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { toast } from 'sonner';
import { PageHeader } from '@/components/page-header';
import { StatCard } from '@/components/stat-card';
import { SectionCard } from '@/components/section-card';
import { ChartCard } from '@/components/chart-card';
import { DataTable, type Column } from '@/components/data-table';
import { ExportButtons } from '@/components/export-buttons';
import { StatusBadge, getFeeStatusVariant } from '@/components/status-badge';
import { feeTransactions, feeStructure, feeDefaulters } from '@/lib/erp-data';
import { feeCollection } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

/* -------------------------------------------------------------------------- */
/*  Types                                                                      */
/* -------------------------------------------------------------------------- */

type TabKey = 'overview' | 'transactions' | 'fee-structure' | 'defaulters';

interface FeeTransaction {
  id: string;
  receiptNo: string;
  studentName: string;
  admissionNumber: string;
  class: string;
  feeType: string;
  amount: number;
  paymentDate: string;
  method: string;
  status: string;
}

interface FeeStructureRow {
  id: string;
  type: string;
  amount: number;
  frequency: string;
  applicableTo: string;
}

interface FeeDefaulter {
  id: string;
  studentName: string;
  admissionNumber: string;
  class: string;
  pendingAmount: number;
  dueDate: string;
  daysOverdue: number;
}

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                    */
/* -------------------------------------------------------------------------- */

/** Format a number as Indian Rupees with en-IN grouping. */
function formatINR(value: number): string {
  return `₹${value.toLocaleString('en-IN')}`;
}

/** Format a number into a compact lakh-style label (e.g. ₹5.35L). */
function formatLakh(value: number): string {
  const lakh = value / 100000;
  return `₹${lakh.toFixed(2)}L`;
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

/* -------------------------------------------------------------------------- */
/*  Tab configuration                                                          */
/* -------------------------------------------------------------------------- */

const tabs: { key: TabKey; label: string; icon: typeof LayoutGrid }[] = [
  { key: 'overview', label: 'Overview', icon: LayoutGrid },
  { key: 'transactions', label: 'Transactions', icon: ArrowLeftRight },
  { key: 'fee-structure', label: 'Fee Structure', icon: ListChecks },
  { key: 'defaulters', label: 'Defaulters', icon: AlertTriangle },
];

/* -------------------------------------------------------------------------- */
/*  Recharts tooltip                                                           */
/* -------------------------------------------------------------------------- */

interface TooltipPayloadItem {
  name: string;
  value: number;
  color: string;
}
interface CollectionTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
}

function CollectionTooltip({ active, payload, label }: CollectionTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border bg-popover p-3 text-xs shadow-md">
      <p className="mb-1.5 font-medium">{label}</p>
      {payload.map((p) => (
        <p
          key={p.name}
          className="flex items-center gap-2 capitalize text-muted-foreground"
        >
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{ backgroundColor: p.color }}
          />
          <span className="font-medium text-foreground">{p.name}</span>:{' '}
          {formatINR(p.value)}
        </p>
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                        */
/* -------------------------------------------------------------------------- */

export default function FeesPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('overview');

  /* ----------------------------- Transactions ----------------------------- */
  const transactionColumns: Column<FeeTransaction>[] = [
    {
      key: 'receiptNo',
      header: 'Receipt No',
      sortable: true,
      render: (row) => (
        <span className="font-mono text-xs font-medium">{row.receiptNo}</span>
      ),
      className: 'whitespace-nowrap',
    },
    {
      key: 'studentName',
      header: 'Student Name',
      sortable: true,
      render: (row) => <span className="font-medium">{row.studentName}</span>,
      className: 'whitespace-nowrap',
    },
    {
      key: 'admissionNumber',
      header: 'Admission No',
      sortable: true,
      render: (row) => (
        <span className="font-mono text-xs">{row.admissionNumber}</span>
      ),
      className: 'whitespace-nowrap',
    },
    {
      key: 'class',
      header: 'Class',
      sortable: true,
      render: (row) => (
        <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs font-medium">
          {row.class}
        </span>
      ),
      className: 'whitespace-nowrap',
    },
    {
      key: 'feeType',
      header: 'Fee Type',
      sortable: true,
      render: (row) => <span>{row.feeType}</span>,
      className: 'whitespace-nowrap',
    },
    {
      key: 'amount',
      header: 'Amount',
      sortable: true,
      render: (row) => (
        <span className="tabular-nums font-semibold">
          {formatINR(row.amount)}
        </span>
      ),
      className: 'tabular-nums whitespace-nowrap',
    },
    {
      key: 'paymentDate',
      header: 'Payment Date',
      sortable: true,
      render: (row) => (
        <span className="text-muted-foreground">{formatDate(row.paymentDate)}</span>
      ),
      className: 'whitespace-nowrap',
    },
    {
      key: 'method',
      header: 'Method',
      sortable: true,
      render: (row) => <span>{row.method}</span>,
      className: 'whitespace-nowrap',
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (row) => (
        <StatusBadge
          status={row.status}
          variant={getFeeStatusVariant(row.status)}
        />
      ),
      className: 'whitespace-nowrap',
    },
  ];

  /* ----------------------------- Fee Structure ----------------------------- */
  const structureColumns: Column<FeeStructureRow>[] = [
    {
      key: 'type',
      header: 'Fee Type',
      sortable: true,
      render: (row) => <span className="font-medium">{row.type}</span>,
      className: 'whitespace-nowrap',
    },
    {
      key: 'amount',
      header: 'Amount',
      sortable: true,
      render: (row) => (
        <span className="tabular-nums font-semibold">{formatINR(row.amount)}</span>
      ),
      className: 'tabular-nums whitespace-nowrap',
    },
    {
      key: 'frequency',
      header: 'Frequency',
      sortable: true,
      render: (row) => (
        <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs font-medium">
          {row.frequency}
        </span>
      ),
      className: 'whitespace-nowrap',
    },
    {
      key: 'applicableTo',
      header: 'Applicable To',
      sortable: true,
      render: (row) => (
        <span className="text-muted-foreground">{row.applicableTo}</span>
      ),
      className: 'whitespace-nowrap',
    },
  ];

  /* ----------------------------- Defaulters -------------------------------- */
  const defaulterColumns: Column<FeeDefaulter>[] = [
    {
      key: 'studentName',
      header: 'Student Name',
      sortable: true,
      render: (row) => <span className="font-medium">{row.studentName}</span>,
      className: 'whitespace-nowrap',
    },
    {
      key: 'admissionNumber',
      header: 'Admission No',
      sortable: true,
      render: (row) => (
        <span className="font-mono text-xs">{row.admissionNumber}</span>
      ),
      className: 'whitespace-nowrap',
    },
    {
      key: 'class',
      header: 'Class',
      sortable: true,
      render: (row) => (
        <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs font-medium">
          {row.class}
        </span>
      ),
      className: 'whitespace-nowrap',
    },
    {
      key: 'pendingAmount',
      header: 'Pending Amount',
      sortable: true,
      render: (row) => (
        <span className="tabular-nums font-semibold text-destructive">
          {formatINR(row.pendingAmount)}
        </span>
      ),
      className: 'tabular-nums whitespace-nowrap',
    },
    {
      key: 'dueDate',
      header: 'Due Date',
      sortable: true,
      render: (row) => (
        <span className="text-muted-foreground">{formatDate(row.dueDate)}</span>
      ),
      className: 'whitespace-nowrap',
    },
    {
      key: 'daysOverdue',
      header: 'Days Overdue',
      sortable: true,
      render: (row) => (
        <span
          className={cn(
            'tabular-nums font-semibold',
            row.daysOverdue > 15
              ? 'text-destructive'
              : 'text-accent-foreground'
          )}
        >
          {row.daysOverdue} days
        </span>
      ),
      className: 'tabular-nums whitespace-nowrap',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Fees Management"
        description="Manage fee structure, invoices, and collections"
      >
        <ExportButtons
          label="fees"
          data={feeTransactions as unknown as Record<string, unknown>[]}
          columns={[
            { key: 'receiptNo', label: 'Receipt No' },
            { key: 'studentName', label: 'Student Name' },
            { key: 'admissionNumber', label: 'Admission No' },
            { key: 'class', label: 'Class' },
            { key: 'feeType', label: 'Fee Type' },
            { key: 'amount', label: 'Amount' },
            { key: 'paymentDate', label: 'Payment Date' },
            { key: 'method', label: 'Method' },
            { key: 'status', label: 'Status' },
          ]}
          filename="fees-report"
        />
      </PageHeader>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Collected"
          value="₹5.35L"
          icon={Wallet}
          change="+₹23K vs last month"
          changeType="positive"
          description="Current academic year"
          delay={0}
        />
        <StatCard
          title="Pending"
          value="₹1.5L"
          icon={TrendingUp}
          change="42 students"
          changeType="negative"
          description="Outstanding dues"
          delay={0.05}
        />
        <StatCard
          title="Defaulters"
          value={42}
          icon={AlertCircle}
          change="8 new this month"
          changeType="negative"
          description="Overdue > 15 days"
          delay={0.1}
        />
        <StatCard
          title="Collection Rate"
          value="95%"
          icon={CheckCircle2}
          change="+4.5% vs last month"
          changeType="positive"
          description="On-time collection"
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
              onClick={() => {
                setActiveTab(tab.key);
                toast.info(`Switched to ${tab.label} view`);
              }}
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
        {/* ----------------------------- Overview ----------------------------- */}
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            <ChartCard
              title="Fee Collection Trend"
              description="Monthly collected vs pending fees (in ₹)"
            >
              <div className="h-[340px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={feeCollection}
                    margin={{ top: 8, right: 12, left: -12, bottom: 0 }}
                    barGap={4}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="hsl(var(--border))"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                      tickLine={false}
                      axisLine={false}
                      width={56}
                      tickFormatter={(v: number) => formatLakh(v)}
                    />
                    <Tooltip
                      content={<CollectionTooltip />}
                      cursor={{ fill: 'hsl(var(--muted))', opacity: 0.4 }}
                    />
                    <Bar
                      dataKey="collected"
                      fill="hsl(var(--success))"
                      radius={[4, 4, 0, 0]}
                      name="Collected"
                    />
                    <Bar
                      dataKey="pending"
                      fill="hsl(var(--destructive))"
                      radius={[4, 4, 0, 0]}
                      name="Pending"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Legend */}
              <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded bg-[hsl(var(--success))]" />
                  <span>Collected</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded bg-[hsl(var(--destructive))]" />
                  <span>Pending</span>
                </div>
              </div>
            </ChartCard>

            {/* Summary cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <SectionCard title="This Month" delay={0}>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold tracking-tight">
                    {formatLakh(535000)}
                  </span>
                </div>
                <p className="mt-2 flex items-center gap-1 text-xs text-success">
                  <TrendingUp className="h-3.5 w-3.5" />
                  Collected in June
                </p>
              </SectionCard>

              <SectionCard title="Last Month" delay={0.05}>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold tracking-tight text-muted-foreground">
                    {formatLakh(512000)}
                  </span>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Collected in May
                </p>
              </SectionCard>

              <SectionCard title="Growth" delay={0.1}>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold tracking-tight text-success">
                    +4.5%
                  </span>
                </div>
                <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                  <TrendingUp className="h-3.5 w-3.5 text-success" />
                  Month-over-month
                </p>
              </SectionCard>
            </div>
          </motion.div>
        )}

        {/* --------------------------- Transactions --------------------------- */}
        {activeTab === 'transactions' && (
          <motion.div
            key="transactions"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            <SectionCard
              title="Fee Transactions"
              description="All fee receipts collected across the school"
            >
              <DataTable
                data={feeTransactions}
                columns={transactionColumns}
                pageSize={10}
                searchKeys={['studentName', 'receiptNo', 'admissionNumber', 'feeType']}
                searchPlaceholder="Search by receipt, student, or fee type..."
                initialSort={{ key: 'paymentDate', dir: 'desc' }}
              />
            </SectionCard>
          </motion.div>
        )}

        {/* --------------------------- Fee Structure -------------------------- */}
        {activeTab === 'fee-structure' && (
          <motion.div
            key="fee-structure"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            <SectionCard
              title="Fee Structure"
              description="Configured fee types and their applicability"
            >
              <DataTable
                data={feeStructure}
                columns={structureColumns}
                pageSize={10}
                searchKeys={['type', 'frequency', 'applicableTo']}
                searchPlaceholder="Search fee types..."
              />
            </SectionCard>
          </motion.div>
        )}

        {/* ----------------------------- Defaulters --------------------------- */}
        {activeTab === 'defaulters' && (
          <motion.div
            key="defaulters"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            <SectionCard
              title="Fee Defaulters"
              description="Students with outstanding fee dues past the due date"
            >
              <DataTable
                data={feeDefaulters}
                columns={defaulterColumns}
                pageSize={10}
                searchKeys={['studentName', 'admissionNumber', 'class']}
                searchPlaceholder="Search defaulters..."
                initialSort={{ key: 'daysOverdue', dir: 'desc' }}
              />
            </SectionCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
