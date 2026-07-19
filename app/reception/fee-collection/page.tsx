'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wallet,
  TrendingUp,
  Clock,
  Receipt,
  Loader2,
  IndianRupee,
  CheckCircle2,
  History,
  CreditCard,
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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { feePayments, students, type FeePayment } from '@/lib/reception-data';
import type { ExportColumn } from '@/lib/export-utils';
import { cn } from '@/lib/utils';

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

/** Format a number into a compact lakh-style label (e.g. ₹5.35L). */
function formatLakh(value: number): string {
  const lakh = value / 100000;
  return `₹${lakh.toFixed(2)}L`;
}

/* -------------------------------------------------------------------------- */
/*  Static configuration                                                       */
/* -------------------------------------------------------------------------- */

type TabKey = 'history' | 'collect';

const tabs: { key: TabKey; label: string; icon: typeof History }[] = [
  { key: 'history', label: 'Payment History', icon: History },
  { key: 'collect', label: 'Collect Fee', icon: CreditCard },
];

const FEE_TYPES = ['Tuition', 'Transport', 'Lab', 'Library', 'Exam', 'Hostel'];

const PAYMENT_METHODS: FeePayment['method'][] = [
  'Cash',
  'Card',
  'UPI',
  'Bank Transfer',
  'Cheque',
];

/** Receptionist name shown as the collector on new receipts. */
const COLLECTED_BY = 'Priya Nair';

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
          className="flex items-center gap-2 text-muted-foreground"
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

export default function FeeCollectionPage() {
  /* ------------------------------- State -------------------------------- */
  const [activeTab, setActiveTab] = useState<TabKey>('history');
  const [payments, setPayments] = useState<FeePayment[]>(feePayments);
  const [isCollecting, setIsCollecting] = useState(false);
  const [lastReceipt, setLastReceipt] = useState<FeePayment | null>(null);

  // Form fields
  const [studentId, setStudentId] = useState('');
  const [feeType, setFeeType] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<FeePayment['method'] | ''>('');

  /* --------------------------- Derived data ----------------------------- */
  const studentList = useMemo(() => students.slice(0, 50), []);

  const collectionByType = useMemo(() => {
    return FEE_TYPES.map((type) => ({
      type,
      amount: payments
        .filter((p) => p.feeType === type)
        .reduce((sum, p) => sum + p.amount, 0),
    }));
  }, [payments]);

  const exportColumns: ExportColumn[] = [
    { key: 'receiptNo', label: 'Receipt No' },
    { key: 'studentName', label: 'Student Name' },
    { key: 'admissionNumber', label: 'Admission No' },
    { key: 'classSection', label: 'Class' },
    { key: 'feeType', label: 'Fee Type' },
    { key: 'amount', label: 'Amount' },
    { key: 'paymentDate', label: 'Date' },
    { key: 'method', label: 'Method' },
    { key: 'status', label: 'Status' },
  ];

  const exportData = useMemo(
    () =>
      payments.map((p) => ({
        receiptNo: p.receiptNo,
        studentName: p.studentName,
        admissionNumber: p.admissionNumber,
        classSection: p.classSection,
        feeType: p.feeType,
        amount: formatINR(p.amount),
        paymentDate: p.paymentDate,
        method: p.method,
        status: p.status,
      })),
    [payments]
  );

  /* --------------------------- Table columns ---------------------------- */
  const paymentColumns: Column<FeePayment>[] = [
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
      key: 'classSection',
      header: 'Class',
      sortable: true,
      render: (row) => (
        <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs font-medium">
          {row.classSection}
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
      header: 'Date',
      sortable: true,
      render: (row) => (
        <span className="text-muted-foreground">
          {formatDate(row.paymentDate)}
        </span>
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

  /* ------------------------- Collect fee handler ------------------------ */
  const handleCollectPayment = () => {
    if (!studentId || !feeType || !amount || !paymentMethod) {
      toast.error('Please fill in all fields');
      return;
    }

    const numericAmount = Number(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    setIsCollecting(true);

    setTimeout(() => {
      const student = students.find((s) => s.id === studentId);
      const receiptNo = `RCP-${String(Math.floor(Math.random() * 90000) + 10000)}`;
      const today = new Date().toISOString().split('T')[0];
      const now = new Date().toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
      });

      const newPayment: FeePayment = {
        id: `pay-${Date.now()}`,
        receiptNo,
        studentName: student?.name ?? 'Unknown Student',
        admissionNumber: student?.admissionNumber ?? 'N/A',
        classSection: student?.classSection ?? 'N/A',
        feeType,
        amount: numericAmount,
        paymentDate: today,
        paymentTime: now,
        method: paymentMethod as FeePayment['method'],
        collectedBy: COLLECTED_BY,
        status: 'paid',
      };

      setPayments((prev) => [newPayment, ...prev]);
      setLastReceipt(newPayment);
      setIsCollecting(false);

      // Reset form
      setStudentId('');
      setFeeType('');
      setAmount('');
      setPaymentMethod('');

      toast.success('Fee collected successfully', {
        description: `Receipt ${receiptNo} generated`,
      });
    }, 1000);
  };

  /* ------------------------------ Render -------------------------------- */
  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Fee Collection"
        description="Collect and manage fee payments"
      >
        <ExportButtons
          label="fee payments"
          data={exportData}
          columns={exportColumns}
          filename="fee-payments"
        />
      </PageHeader>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Collected Today"
          value="₹1.25L"
          icon={Wallet}
          change="+₹15K vs yesterday"
          changeType="positive"
          description="Today's fee collections"
          delay={0}
        />
        <StatCard
          title="This Month"
          value="₹5.35L"
          icon={TrendingUp}
          change="+₹23K vs last month"
          changeType="positive"
          description="Total collected in June"
          delay={0.05}
        />
        <StatCard
          title="Pending"
          value="₹1.5L"
          icon={Clock}
          change="42 students"
          changeType="negative"
          description="Outstanding dues"
          delay={0.1}
        />
        <StatCard
          title="Receipts Today"
          value={18}
          icon={Receipt}
          change="12 paid · 6 partial"
          changeType="neutral"
          description="Receipts issued today"
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
        {/* --------------------------- Payment History -------------------------- */}
        {activeTab === 'history' && (
          <motion.div
            key="history"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            <ChartCard
              title="Collection by Fee Type"
              description="Total amount collected per fee category (in ₹)"
            >
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={collectionByType}
                    margin={{ top: 8, right: 12, left: -12, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="hsl(var(--border))"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="type"
                      tick={{
                        fontSize: 11,
                        fill: 'hsl(var(--muted-foreground))',
                      }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      tick={{
                        fontSize: 11,
                        fill: 'hsl(var(--muted-foreground))',
                      }}
                      tickLine={false}
                      axisLine={false}
                      width={64}
                      tickFormatter={(v: number) => formatLakh(v)}
                    />
                    <Tooltip
                      content={<CollectionTooltip />}
                      cursor={{ fill: 'hsl(var(--muted))', opacity: 0.4 }}
                    />
                    <Bar
                      dataKey="amount"
                      fill="hsl(var(--chart-1))"
                      radius={[4, 4, 0, 0]}
                      name="Collected"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>

            <SectionCard
              title="Payment History"
              description="All fee receipts collected at the reception"
            >
              <DataTable
                data={payments}
                columns={paymentColumns}
                pageSize={10}
                searchKeys={['receiptNo', 'studentName', 'admissionNumber']}
                searchPlaceholder="Search by receipt no, student name, or admission no..."
                initialSort={{ key: 'paymentDate', dir: 'desc' }}
              />
            </SectionCard>
          </motion.div>
        )}

        {/* ----------------------------- Collect Fee ---------------------------- */}
        {activeTab === 'collect' && (
          <motion.div
            key="collect"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="grid gap-6 lg:grid-cols-5"
          >
            {/* Form */}
            <div className="lg:col-span-3">
              <SectionCard
                title="Collect Fee Payment"
                description="Record a new fee payment and generate a receipt"
              >
                <div className="grid gap-5">
                  {/* Student */}
                  <div className="space-y-2">
                    <Label htmlFor="student">Student</Label>
                    <Select value={studentId} onValueChange={setStudentId}>
                      <SelectTrigger id="student" className="w-full">
                        <SelectValue placeholder="Select a student" />
                      </SelectTrigger>
                      <SelectContent>
                        {studentList.map((s) => (
                          <SelectItem key={s.id} value={s.id}>
                            {s.name} ({s.admissionNumber}) — {s.classSection}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Showing first 50 students · {students.length} total
                    </p>
                  </div>

                  {/* Fee Type + Amount */}
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="feeType">Fee Type</Label>
                      <Select value={feeType} onValueChange={setFeeType}>
                        <SelectTrigger id="feeType" className="w-full">
                          <SelectValue placeholder="Select fee type" />
                        </SelectTrigger>
                        <SelectContent>
                          {FEE_TYPES.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="amount">Amount (₹)</Label>
                      <div className="relative">
                        <IndianRupee className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="amount"
                          type="number"
                          inputMode="numeric"
                          placeholder="0"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          className="pl-9"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="space-y-2">
                    <Label htmlFor="method">Payment Method</Label>
                    <Select
                      value={paymentMethod}
                      onValueChange={(v) =>
                        setPaymentMethod(v as FeePayment['method'])
                      }
                    >
                      <SelectTrigger id="method" className="w-full">
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                      <SelectContent>
                        {PAYMENT_METHODS.map((method) => (
                          <SelectItem key={method} value={method}>
                            {method}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Receipt note */}
                  <div className="flex items-center gap-2 rounded-lg border border-dashed bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
                    <Receipt className="h-4 w-4 shrink-0" />
                    <span>
                      Receipt number will be auto-generated upon collection
                    </span>
                  </div>

                  {/* Submit */}
                  <div className="flex items-center justify-end gap-3 pt-1">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setStudentId('');
                        setFeeType('');
                        setAmount('');
                        setPaymentMethod('');
                      }}
                      disabled={isCollecting}
                    >
                      Reset
                    </Button>
                    <Button
                      onClick={handleCollectPayment}
                      disabled={isCollecting}
                      className="min-w-[160px]"
                    >
                      {isCollecting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Collecting...
                        </>
                      ) : (
                        <>
                          <Wallet className="h-4 w-4" />
                          Collect Payment
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </SectionCard>
            </div>

            {/* Receipt preview / placeholder */}
            <div className="lg:col-span-2">
              <AnimatePresence mode="wait">
                {lastReceipt ? (
                  <motion.div
                    key="receipt"
                    initial={{ opacity: 0, scale: 0.96, y: 12 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96, y: -12 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div className="rounded-2xl border bg-card p-6 shadow-premium">
                      {/* Header */}
                      <div className="flex items-center gap-3 border-b pb-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success/10">
                          <CheckCircle2 className="h-5 w-5 text-success" />
                        </div>
                        <div>
                          <h3 className="text-base font-semibold">
                            Receipt Generated
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            Payment collected successfully
                          </p>
                        </div>
                      </div>

                      {/* Receipt body */}
                      <div className="space-y-3 py-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            Receipt No
                          </span>
                          <span className="font-mono text-sm font-semibold">
                            {lastReceipt.receiptNo}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            Student Name
                          </span>
                          <span className="text-sm font-medium">
                            {lastReceipt.studentName}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            Fee Type
                          </span>
                          <span className="text-sm font-medium">
                            {lastReceipt.feeType}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            Amount
                          </span>
                          <span className="text-base font-bold tabular-nums text-success">
                            {formatINR(lastReceipt.amount)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            Method
                          </span>
                          <span className="text-sm font-medium">
                            {lastReceipt.method}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            Date
                          </span>
                          <span className="text-sm font-medium">
                            {formatDate(lastReceipt.paymentDate)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            Collected By
                          </span>
                          <span className="text-sm font-medium">
                            {lastReceipt.collectedBy}
                          </span>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="border-t pt-4">
                        <div className="flex items-center justify-between">
                          <StatusBadge
                            status={lastReceipt.status}
                            variant={getFeeStatusVariant(lastReceipt.status)}
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-2"
                            onClick={() => {
                              setActiveTab('history');
                              toast.info('Viewing payment history');
                            }}
                          >
                            <History className="h-3.5 w-3.5" />
                            View in History
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="placeholder"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-dashed bg-muted/20 p-6 text-center">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                        <Receipt className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <h3 className="mt-4 text-sm font-semibold">
                        No receipt yet
                      </h3>
                      <p className="mt-1 max-w-[220px] text-xs text-muted-foreground">
                        Fill in the fee details and click &ldquo;Collect
                        Payment&rdquo; to generate a receipt preview here.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
