'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  UserCheck,
  Calendar,
  Plus,
  LogOut,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';

import { PageHeader } from '@/components/page-header';
import { StatCard } from '@/components/stat-card';
import { SectionCard } from '@/components/section-card';
import { DataTable, type Column } from '@/components/data-table';
import { ExportButtons } from '@/components/export-buttons';
import { StatusBadge } from '@/components/status-badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { visitors as initialVisitors, visitorStats, type Visitor } from '@/lib/reception-data';
import type { ExportColumn } from '@/lib/export-utils';

// Shared inline-select style (no shadcn Select component in this project)
const selectClass =
  'h-9 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary/20';

const VISITOR_TYPES: Visitor['visitorType'][] = ['Parent', 'Vendor', 'Guest', 'Official', 'Alumni'];
const ID_PROOFS = ['Aadhaar', 'PAN Card', 'Driving License', 'Voter ID', 'Govt ID'];

type StatusFilter = 'all' | 'checked-in' | 'checked-out';
type TypeFilter = 'all' | Visitor['visitorType'];

const emptyForm = {
  visitorName: '',
  visitorType: 'Parent' as Visitor['visitorType'],
  purpose: '',
  visitingPerson: '',
  phone: '',
  idProof: 'Aadhaar',
};

export default function VisitorRegisterPage() {
  const [visitorList, setVisitorList] = useState<Visitor[]>(initialVisitors);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');
  const [search, setSearch] = useState('');

  const [showAddModal, setShowAddModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm);

  // ---------- Filtering ----------
  const filteredVisitors = useMemo(() => {
    const q = search.trim().toLowerCase();
    return visitorList.filter((v) => {
      if (statusFilter !== 'all' && v.status !== statusFilter) return false;
      if (typeFilter !== 'all' && v.visitorType !== typeFilter) return false;
      if (q) {
        const haystack =
          `${v.visitorName} ${v.purpose} ${v.visitingPerson}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [visitorList, statusFilter, typeFilter, search]);

  // ---------- Stats (recompute from current list) ----------
  const checkedInCount = visitorList.filter((v) => v.status === 'checked-in').length;

  const stats = [
    {
      title: "Today's Visitors",
      value: visitorStats.today,
      icon: Users,
      change: `${checkedInCount} currently in`,
      changeType: 'positive' as const,
      delay: 0,
    },
    {
      title: 'Checked In',
      value: checkedInCount,
      icon: UserCheck,
      change: 'Active now',
      changeType: 'positive' as const,
      delay: 0.05,
    },
    {
      title: 'This Week',
      value: visitorStats.thisWeek,
      icon: Calendar,
      change: '+12% vs last week',
      changeType: 'positive' as const,
      delay: 0.1,
    },
    {
      title: 'This Month',
      value: visitorStats.thisMonth,
      icon: Users,
      change: 'Across all visits',
      changeType: 'neutral' as const,
      delay: 0.15,
    },
  ];

  // ---------- Export config ----------
  const exportColumns: ExportColumn[] = [
    { key: 'visitorName', label: 'Visitor Name' },
    { key: 'visitorType', label: 'Type' },
    { key: 'purpose', label: 'Purpose' },
    { key: 'visitingPerson', label: 'Visiting' },
    { key: 'phone', label: 'Phone' },
    { key: 'checkInTime', label: 'Check-In Time' },
    { key: 'checkOutTime', label: 'Check-Out Time' },
    { key: 'status', label: 'Status' },
    { key: 'idProof', label: 'ID Proof' },
  ];
  const exportData = filteredVisitors.map((v) => ({
    visitorName: v.visitorName,
    visitorType: v.visitorType,
    purpose: v.purpose,
    visitingPerson: v.visitingPerson,
    phone: v.phone,
    checkInTime: v.checkInTime,
    checkOutTime: v.checkOutTime ?? '—',
    status: v.status === 'checked-in' ? 'Checked In' : 'Checked Out',
    idProof: v.idProof,
  }));

  // ---------- Table columns ----------
  const columns: Column<Visitor>[] = [
    {
      key: 'visitorName',
      header: 'Visitor Name',
      sortable: true,
      render: (v) => (
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
            {v.visitorName
              .split(' ')
              .map((n) => n[0])
              .slice(0, 2)
              .join('')
              .toUpperCase()}
          </div>
          <span className="font-medium">{v.visitorName}</span>
        </div>
      ),
    },
    {
      key: 'visitorType',
      header: 'Type',
      sortable: true,
      render: (v) => (
        <span className="text-muted-foreground">{v.visitorType}</span>
      ),
    },
    {
      key: 'purpose',
      header: 'Purpose',
      render: (v) => (
        <span className="max-w-[180px] truncate text-muted-foreground" title={v.purpose}>
          {v.purpose}
        </span>
      ),
    },
    {
      key: 'visitingPerson',
      header: 'Visiting',
      render: (v) => (
        <span className="text-muted-foreground">{v.visitingPerson}</span>
      ),
    },
    {
      key: 'phone',
      header: 'Phone',
      render: (v) => (
        <span className="font-mono text-xs text-muted-foreground">{v.phone}</span>
      ),
    },
    {
      key: 'checkInTime',
      header: 'Check-In Time',
      sortable: true,
      render: (v) => (
        <span className="text-muted-foreground">{v.checkInTime}</span>
      ),
    },
    {
      key: 'checkOutTime',
      header: 'Check-Out Time',
      render: (v) => (
        <span className="text-muted-foreground">
          {v.checkOutTime ?? '—'}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (v) => (
        <StatusBadge
          status={v.status === 'checked-in' ? 'Checked In' : 'Checked Out'}
          variant={v.status === 'checked-in' ? 'success' : 'neutral'}
        />
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right',
      render: (v) =>
        v.status === 'checked-in' ? (
          <Button
            size="sm"
            variant="outline"
            className="gap-1.5"
            onClick={(e) => {
              e.stopPropagation();
              handleCheckOut(v.id);
            }}
          >
            <LogOut className="h-3.5 w-3.5" />
            Check Out
          </Button>
        ) : (
          <span className="text-xs text-muted-foreground">Completed</span>
        ),
    },
  ];

  // ---------- Actions ----------
  const handleCheckOut = (id: string) => {
    setVisitorList((prev) =>
      prev.map((v) =>
        v.id === id
          ? {
              ...v,
              status: 'checked-out',
              checkOutTime: new Date().toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              }),
            }
          : v,
      ),
    );
    toast.success('Visitor checked out successfully');
  };

  const handleAddVisitor = () => {
    if (!form.visitorName.trim() || !form.purpose.trim() || !form.visitingPerson.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }
    setSaving(true);
    setTimeout(() => {
      const newVisitor: Visitor = {
        id: `vis-${Date.now()}`,
        visitorName: form.visitorName.trim(),
        visitorType: form.visitorType,
        purpose: form.purpose.trim(),
        visitingPerson: form.visitingPerson.trim(),
        phone: form.phone.trim() || '—',
        checkInTime: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        checkOutTime: null,
        date: new Date().toISOString().slice(0, 10),
        status: 'checked-in',
        idProof: form.idProof,
        photo: null,
      };
      setVisitorList((prev) => [newVisitor, ...prev]);
      setSaving(false);
      setShowAddModal(false);
      setForm(emptyForm);
      toast.success('Visitor added successfully');
    }, 1000);
  };

  const handleModalChange = (open: boolean) => {
    if (!saving) {
      setShowAddModal(open);
      if (!open) setForm(emptyForm);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Visitor Register"
        description="Track and manage all visitors to the school"
      >
        <Button className="gap-2" onClick={() => setShowAddModal(true)}>
          <Plus className="h-4 w-4" />
          Add Visitor
        </Button>
      </PageHeader>

      {/* Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <StatCard
            key={s.title}
            title={s.title}
            value={s.value}
            icon={s.icon}
            change={s.change}
            changeType={s.changeType}
            delay={s.delay}
          />
        ))}
      </div>

      {/* Visitor Table */}
      <SectionCard
        title="Visitor Log"
        description={`${filteredVisitors.length} visitor${filteredVisitors.length === 1 ? '' : 's'} shown`}
        delay={0.2}
      >
        {/* Filter bar */}
        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {/* Status filter */}
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Status</Label>
              <select
                className={selectClass}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
              >
                <option value="all">All Status</option>
                <option value="checked-in">Checked In</option>
                <option value="checked-out">Checked Out</option>
              </select>
            </div>

            {/* Type filter */}
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Type</Label>
              <select
                className={selectClass}
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as TypeFilter)}
              >
                <option value="all">All Types</option>
                {VISITOR_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            {/* Search */}
            <div className="space-y-1.5 sm:min-w-[240px]">
              <Label className="text-xs text-muted-foreground">Search</Label>
              <Input
                placeholder="Name, purpose, visiting person..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-9"
              />
            </div>
          </div>

          {/* Export */}
          <div className="flex items-end">
            <ExportButtons
              label="visitors"
              data={exportData}
              columns={exportColumns}
              filename="visitor-register"
            />
          </div>
        </div>

        {/* Table — search handled in our filter bar, so suppress built-in search */}
        <DataTable
          data={filteredVisitors}
          columns={columns}
          searchKeys={[]}
          searchPlaceholder="Search visitors..."
          emptyMessage="No visitors match the current filters"
          initialSort={{ key: 'checkInTime', dir: 'desc' }}
        />
      </SectionCard>

      {/* Add Visitor Modal */}
      <Dialog open={showAddModal} onOpenChange={handleModalChange}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add New Visitor</DialogTitle>
            <DialogDescription>
              Register a new visitor entering the school premises.
            </DialogDescription>
          </DialogHeader>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="grid gap-4 py-2"
          >
            <div className="space-y-1.5">
              <Label>Visitor Name *</Label>
              <Input
                value={form.visitorName}
                onChange={(e) => setForm({ ...form, visitorName: e.target.value })}
                placeholder="e.g. Ramesh Sharma"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Type *</Label>
                <select
                  className={selectClass}
                  value={form.visitorType}
                  onChange={(e) =>
                    setForm({ ...form, visitorType: e.target.value as Visitor['visitorType'] })
                  }
                >
                  {VISITOR_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label>ID Proof *</Label>
                <select
                  className={selectClass}
                  value={form.idProof}
                  onChange={(e) => setForm({ ...form, idProof: e.target.value })}
                >
                  {ID_PROOFS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Purpose *</Label>
              <Input
                value={form.purpose}
                onChange={(e) => setForm({ ...form, purpose: e.target.value })}
                placeholder="e.g. Parent-Teacher Meeting"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Visiting Person *</Label>
                <Input
                  value={form.visitingPerson}
                  onChange={(e) => setForm({ ...form, visitingPerson: e.target.value })}
                  placeholder="e.g. Principal / Class Teacher"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Phone</Label>
                <Input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+91 90000 00000"
                />
              </div>
            </div>
          </motion.div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => handleModalChange(false)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button onClick={handleAddVisitor} disabled={saving} className="gap-2">
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Add Visitor
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
