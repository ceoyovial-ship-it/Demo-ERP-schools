'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  UserCog,
  UserCheck,
  Wallet,
  TrendingUp,
  UserPlus,
  MessageSquare,
} from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import { StatCard } from '@/components/stat-card';
import { SectionCard } from '@/components/section-card';
import { DataTable, type Column } from '@/components/data-table';
import { ExportButtons } from '@/components/export-buttons';
import { StatusBadge, getFeeStatusVariant } from '@/components/status-badge';
import { parents } from '@/lib/erp-data';

type Parent = (typeof parents)[number];

// Occupation options for the filter dropdown.
const OCCUPATION_OPTIONS = [
  'Engineer',
  'Doctor',
  'Business',
  'Teacher',
  'Government',
  'Banking',
  'Agriculture',
  'Lawyer',
] as const;

const FEE_STATUS_OPTIONS = [
  { value: 'all', label: 'All Fee Statuses' },
  { value: 'paid', label: 'Paid' },
  { value: 'pending', label: 'Pending' },
] as const;

// --- Helpers -----------------------------------------------------------------

function formatINR(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}

// --- Page --------------------------------------------------------------------

export default function ParentsPage() {
  const router = useRouter();

  const [feeStatusFilter, setFeeStatusFilter] = useState<string>('all');
  const [occupationFilter, setOccupationFilter] = useState<string>('all');
  const [parentList, setParentList] = useState(parents);

  // Aggregate stats derived from the full dataset so they stay accurate even
  // as the underlying data changes.
  const stats = useMemo(() => {
    const total = parentList.length;
    const active = parentList.filter((p) => p.feeStatus === 'paid').length;
    const withPendingFees = parentList.filter(
      (p) => p.feeStatus === 'pending' && p.pendingAmount > 0
    ).length;
    const totalCollected = parentList.reduce((sum, p) => sum + p.totalPaid, 0);
    return { total, active, withPendingFees, totalCollected };
  }, [parentList]);

  // Apply the fee-status + occupation filters before handing data to the
  // DataTable. The DataTable itself handles name / phone / email search and
  // pagination.
  const filteredParents = useMemo(() => {
    return parentList.filter((p) => {
      const feeMatch =
        feeStatusFilter === 'all' || p.feeStatus === feeStatusFilter;
      const occupationMatch =
        occupationFilter === 'all' || p.occupation === occupationFilter;
      return feeMatch && occupationMatch;
    });
  }, [parentList, feeStatusFilter, occupationFilter]);

  const parentExportColumns = [
    { key: 'name', label: 'Name' },
    { key: 'occupation', label: 'Occupation' },
    { key: 'phone', label: 'Phone' },
    { key: 'email', label: 'Email' },
    { key: 'feeStatus', label: 'Fee Status' },
    { key: 'totalPaid', label: 'Total Paid' },
    { key: 'pendingAmount', label: 'Pending Amount' },
  ];

  const columns: Column<Parent>[] = [
    {
      key: 'name',
      header: 'Name',
      sortable: true,
      render: (p) => (
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
            {p.name
              .split(' ')
              .map((n) => n[0])
              .slice(0, 2)
              .join('')}
          </div>
          <div className="min-w-0">
            <p className="truncate font-medium">{p.name}</p>
            <p className="truncate text-xs text-muted-foreground">{p.address}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'occupation',
      header: 'Occupation',
      sortable: true,
      render: (p) => (
        <span className="inline-flex items-center gap-1.5 text-sm">
          <UserCog className="h-3.5 w-3.5 text-muted-foreground" />
          {p.occupation}
        </span>
      ),
    },
    {
      key: 'phone',
      header: 'Phone',
      render: (p) => (
        <span className="whitespace-nowrap text-sm text-muted-foreground tabular-nums">
          {p.phone}
        </span>
      ),
    },
    {
      key: 'email',
      header: 'Email',
      render: (p) => (
        <span className="whitespace-nowrap text-sm text-muted-foreground">
          {p.email}
        </span>
      ),
    },
    {
      key: 'children',
      header: 'Children',
      render: (p) => (
        <span className="text-sm text-muted-foreground">
          {p.children.join(', ')}
        </span>
      ),
    },
    {
      key: 'feeStatus',
      header: 'Fee Status',
      sortable: true,
      render: (p) => (
        <StatusBadge
          status={p.feeStatus}
          variant={getFeeStatusVariant(p.feeStatus)}
        />
      ),
      className: 'whitespace-nowrap',
    },
    {
      key: 'totalPaid',
      header: 'Total Paid',
      sortable: true,
      render: (p) => (
        <span className="whitespace-nowrap font-medium tabular-nums text-foreground">
          {formatINR(p.totalPaid)}
        </span>
      ),
      className: 'whitespace-nowrap',
    },
    {
      key: 'pendingAmount',
      header: 'Pending Amount',
      sortable: true,
      render: (p) => (
        <span
          className={
            p.pendingAmount > 0
              ? 'whitespace-nowrap font-medium tabular-nums text-accent'
              : 'whitespace-nowrap tabular-nums text-muted-foreground'
          }
        >
          {formatINR(p.pendingAmount)}
        </span>
      ),
      className: 'whitespace-nowrap',
    },
  ];

  const resetFilters = () => {
    setFeeStatusFilter('all');
    setOccupationFilter('all');
    toast.info('Filters reset');
  };

  const hasActiveFilters =
    feeStatusFilter !== 'all' || occupationFilter !== 'all';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <PageHeader
        title="Parent Directory"
        description="Manage parent records and guardian contacts"
      >
        <button
          type="button"
          onClick={() => {
            toast.success('Send Message', {
              description: 'Opening the broadcast composer…',
            });
            router.push('/principal/messages/new');
          }}
          className="inline-flex h-9 items-center gap-2 rounded-md border border-input bg-background px-3 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          <MessageSquare className="h-4 w-4" />
          <span className="hidden sm:inline">Send Message</span>
        </button>
        <button
          type="button"
          onClick={() => {
            toast.success('Add Parent', {
              description: 'Opening the new parent form…',
            });
            toast.info('Add Parent', { description: 'Use the Quick Add (+) button in the top bar to add a parent.' });
          }}
          className="inline-flex h-9 items-center gap-2 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
        >
          <UserPlus className="h-4 w-4" />
          <span className="hidden sm:inline">Add Parent</span>
        </button>
      </PageHeader>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Parents"
          value={stats.total}
          icon={UserCog}
          change="+18 this term"
          changeType="positive"
          description="Registered guardians"
          delay={0}
        />
        <StatCard
          title="Active"
          value={stats.active}
          icon={UserCheck}
          change={`${Math.round((stats.active / stats.total) * 100)}% up to date`}
          changeType="positive"
          description="Fees fully settled"
          delay={0.05}
        />
        <StatCard
          title="With Pending Fees"
          value={stats.withPendingFees}
          icon={Wallet}
          change="Follow-up needed"
          changeType="negative"
          description="Outstanding balances"
          delay={0.1}
        />
        <StatCard
          title="Total Collected"
          value={`₹${(stats.totalCollected / 100000).toFixed(1)}L`}
          icon={TrendingUp}
          change="+₹3.2L vs last term"
          changeType="positive"
          description="Across all parent accounts"
          delay={0.15}
        />
      </div>

      {/* Filter bar + export */}
      <SectionCard
        title="Parent Records"
        description={`${filteredParents.length} of ${parents.length} parents shown`}
        delay={0.1}
      >
        {/* Filter row */}
        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {/* Fee status filter */}
            <div className="flex flex-col gap-1">
              <label
                htmlFor="fee-status-filter"
                className="text-xs font-medium text-muted-foreground"
              >
                Fee Status
              </label>
              <select
                id="fee-status-filter"
                value={feeStatusFilter}
                onChange={(e) => setFeeStatusFilter(e.target.value)}
                className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-ring sm:w-44"
              >
                {FEE_STATUS_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Occupation filter */}
            <div className="flex flex-col gap-1">
              <label
                htmlFor="occupation-filter"
                className="text-xs font-medium text-muted-foreground"
              >
                Occupation
              </label>
              <select
                id="occupation-filter"
                value={occupationFilter}
                onChange={(e) => setOccupationFilter(e.target.value)}
                className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-ring sm:w-44"
              >
                <option value="all">All Occupations</option>
                {OCCUPATION_OPTIONS.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="mt-5 h-9 self-start rounded-md px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:self-auto"
              >
                Clear filters
              </button>
            )}
          </div>

          <div className="flex items-center self-end lg:self-auto">
            <ExportButtons
              label="parent directory"
              data={filteredParents as unknown as Record<string, unknown>[]}
              columns={parentExportColumns}
              filename="parent-directory"
            />
          </div>
        </div>

        {/* Table */}
        <DataTable
          data={filteredParents}
          columns={columns}
          searchKeys={['name', 'phone', 'email']}
          searchPlaceholder="Search by name, phone, or email…"
          pageSize={10}
          onRowClick={(p) =>
            toast.info(`Opening ${p.name}`, {
              description: `${p.children.length} child${p.children.length > 1 ? 'ren' : ''} • ${p.occupation}`,
            })
          }
          emptyMessage="No parents match the selected filters."
          initialSort={{ key: 'name', dir: 'asc' }}
        />
      </SectionCard>
    </motion.div>
  );
}
