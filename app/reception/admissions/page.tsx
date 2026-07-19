'use client';

import { useState, useMemo, useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  UserPlus,
  UserCheck,
  Clock,
  FileX,
  Plus,
  Pencil,
  Trash2,
  Eye,
  Loader2,
  Download,
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
import { admissions as seedAdmissions, type Admission } from '@/lib/reception-data';

// ---- Shared styles & helpers -----------------------------------------------

const selectClass =
  'h-9 rounded-lg border border-input bg-background px-3 text-sm';

const statusVariant = (
  s: Admission['status']
): 'success' | 'warning' | 'destructive' =>
  s === 'active' ? 'success' : s === 'pending' ? 'warning' : 'destructive';

const GRADES = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
const SECTIONS = ['A', 'B', 'C', 'D'];
const GENDERS = ['Male', 'Female', 'Other'];
const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

interface AdmissionForm {
  studentName: string;
  grade: string;
  section: string;
  dob: string;
  gender: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  address: string;
  previousSchool: string;
  bloodGroup: string;
}

const emptyForm: AdmissionForm = {
  studentName: '',
  grade: '',
  section: 'A',
  dob: '',
  gender: 'Male',
  parentName: '',
  parentPhone: '',
  parentEmail: '',
  address: '',
  previousSchool: '',
  bloodGroup: '',
};

const REQUIRED: (keyof AdmissionForm)[] = [
  'studentName',
  'grade',
  'parentName',
  'parentPhone',
];

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function nextAdmissionNumber(list: Admission[]): string {
  const maxSuffix = list.reduce((max, a) => {
    const suffix = parseInt(a.admissionNumber.split('-').pop() ?? '0', 10);
    return Number.isNaN(suffix) ? max : Math.max(max, suffix);
  }, 0);
  return `YS2025-ADM-${String(maxSuffix + 1).padStart(4, '0')}`;
}

/** Small label/value block used inside the View modal. */
function Detail({ label, value }: { label: string; value?: ReactNode }) {
  return (
    <div className="space-y-0.5">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="text-sm font-medium">{value || '—'}</p>
    </div>
  );
}

// ---- Page ------------------------------------------------------------------

export default function AdmissionsPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [list, setList] = useState<Admission[]>(seedAdmissions);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | Admission['status']>(
    'all'
  );
  const [gradeFilter, setGradeFilter] = useState('all');

  // Add / Edit modal
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<AdmissionForm>(emptyForm);
  const [saving, setSaving] = useState(false);

  // View modal
  const [viewing, setViewing] = useState<Admission | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 450);
    return () => clearTimeout(t);
  }, []);

  // ---- Derived data --------------------------------------------------------

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return list.filter((a) => {
      if (statusFilter !== 'all' && a.status !== statusFilter) return false;
      if (gradeFilter !== 'all' && a.grade !== gradeFilter) return false;
      if (!q) return true;
      return (
        a.studentName.toLowerCase().includes(q) ||
        a.admissionNumber.toLowerCase().includes(q) ||
        a.parentName.toLowerCase().includes(q)
      );
    });
  }, [list, search, statusFilter, gradeFilter]);

  const exportData = useMemo(
    () =>
      filtered.map((a) => ({
        admissionNumber: a.admissionNumber,
        studentName: a.studentName,
        grade: `${a.grade}-${a.section}`,
        parentName: a.parentName,
        parentPhone: a.parentPhone,
        date: a.date,
        status: a.status,
        documents: `${a.documentsSubmitted}/${a.documentsTotal}`,
      })),
    [filtered]
  );

  const exportColumns = [
    { key: 'admissionNumber', label: 'Admission No' },
    { key: 'studentName', label: 'Student Name' },
    { key: 'grade', label: 'Grade' },
    { key: 'parentName', label: 'Parent Name' },
    { key: 'parentPhone', label: 'Phone' },
    { key: 'date', label: 'Date' },
    { key: 'status', label: 'Status' },
    { key: 'documents', label: 'Documents' },
  ];

  // ---- Columns -------------------------------------------------------------

  const columns: Column<Admission>[] = [
    {
      key: 'admissionNumber',
      header: 'Admission No',
      sortable: true,
      className: 'font-medium',
    },
    { key: 'studentName', header: 'Student Name', sortable: true },
    {
      key: 'grade',
      header: 'Grade',
      sortable: true,
      render: (row) => (
        <span className="text-muted-foreground">
          {row.grade}-{row.section}
        </span>
      ),
    },
    { key: 'parentName', header: 'Parent Name' },
    { key: 'parentPhone', header: 'Phone' },
    { key: 'date', header: 'Date', sortable: true },
    {
      key: 'documents',
      header: 'Documents',
      render: (row) => {
        const pct = Math.round(
          (row.documentsSubmitted / row.documentsTotal) * 100
        );
        const complete = row.documentsSubmitted === row.documentsTotal;
        return (
          <div className="flex items-center gap-2">
            <span className="text-xs tabular-nums text-muted-foreground">
              {row.documentsSubmitted}/{row.documentsTotal}
            </span>
            <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
              <div
                className={`h-full rounded-full ${
                  complete ? 'bg-success' : 'bg-primary'
                }`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      },
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => (
        <StatusBadge status={row.status} variant={statusVariant(row.status)} />
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => (
        <div className="flex items-center justify-end gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            title="View"
            onClick={(e) => {
              e.stopPropagation();
              setViewing(row);
            }}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            title="Edit"
            onClick={(e) => {
              e.stopPropagation();
              openEdit(row);
            }}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
            title="Delete"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(row);
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  // ---- Handlers ------------------------------------------------------------

  const openAdd = () => {
    setForm(emptyForm);
    setEditingId(null);
    setFormOpen(true);
  };

  const openEdit = (row: Admission) => {
    setForm({
      studentName: row.studentName,
      grade: row.grade,
      section: row.section,
      dob: row.dob,
      gender: row.gender,
      parentName: row.parentName,
      parentPhone: row.parentPhone,
      parentEmail: row.parentEmail,
      address: row.address,
      previousSchool: row.previousSchool,
      bloodGroup: row.bloodGroup,
    });
    setEditingId(row.id);
    setFormOpen(true);
  };

  const setField = (key: keyof AdmissionForm, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSave = () => {
    const missing = REQUIRED.filter((k) => !form[k].trim());
    if (missing.length > 0) {
      toast.error('Please fill in all required fields', {
        description: 'Student Name, Grade, Parent Name and Parent Phone are required.',
      });
      return;
    }

    setSaving(true);
    setTimeout(() => {
      if (editingId) {
        setList((prev) =>
          prev.map((a) =>
            a.id === editingId
              ? {
                  ...a,
                  studentName: form.studentName.trim(),
                  grade: form.grade,
                  section: form.section,
                  dob: form.dob,
                  gender: form.gender,
                  parentName: form.parentName.trim(),
                  parentPhone: form.parentPhone.trim(),
                  parentEmail: form.parentEmail.trim(),
                  address: form.address.trim(),
                  previousSchool: form.previousSchool.trim(),
                  bloodGroup: form.bloodGroup,
                }
              : a
          )
        );
        toast.success('Admission updated', {
          description: `${form.studentName} — Grade ${form.grade}-${form.section}`,
        });
      } else {
        const newAdmission: Admission = {
          id: `adm-${Date.now()}`,
          admissionNumber: nextAdmissionNumber(list),
          studentName: form.studentName.trim(),
          grade: form.grade,
          section: form.section,
          parentName: form.parentName.trim(),
          parentPhone: form.parentPhone.trim(),
          parentEmail:
            form.parentEmail.trim() ||
            `${form.parentName.trim().toLowerCase().replace(/\s+/g, '.')}@email.com`,
          date: todayISO(),
          status: 'pending',
          documentsSubmitted: 0,
          documentsTotal: 6,
          address: form.address.trim(),
          previousSchool: form.previousSchool.trim(),
          dob: form.dob,
          gender: form.gender,
          bloodGroup: form.bloodGroup || 'O+',
        };
        setList((prev) => [newAdmission, ...prev]);
        toast.success('Admission created', {
          description: `${newAdmission.studentName} — ${newAdmission.admissionNumber}`,
        });
      }
      setSaving(false);
      setFormOpen(false);
      setForm(emptyForm);
      setEditingId(null);
    }, 1000);
  };

  const handleDelete = (row: Admission) => {
    setList((prev) => prev.filter((a) => a.id !== row.id));
    toast.success('Admission deleted', {
      description: `${row.studentName} (${row.admissionNumber})`,
      action: {
        label: 'Undo',
        onClick: () => {
          setList((prev) => [row, ...prev]);
          toast.success('Admission restored', {
            description: row.studentName,
          });
        },
      },
    });
  };

  const resetFilters = () => {
    setSearch('');
    setStatusFilter('all');
    setGradeFilter('all');
  };

  const hasFilters =
    search.trim() !== '' || statusFilter !== 'all' || gradeFilter !== 'all';

  // ---- Render --------------------------------------------------------------

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading admissions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Admissions"
        description="Manage student admissions and enquiries"
      >
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={() => router.push('/reception/dashboard')}
        >
          <Download className="h-4 w-4" />
          <span className="hidden sm:inline">Dashboard</span>
        </Button>
        <Button size="sm" className="gap-2" onClick={openAdd}>
          <Plus className="h-4 w-4" />
          New Admission
        </Button>
      </PageHeader>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Admissions"
          value={24}
          icon={UserPlus}
          change="+8 this week"
          changeType="positive"
          description="All time enrollments"
          delay={0}
        />
        <StatCard
          title="Active"
          value={18}
          icon={UserCheck}
          change="Currently enrolled"
          changeType="positive"
          delay={0.05}
        />
        <StatCard
          title="Pending"
          value={5}
          icon={Clock}
          change="Awaiting review"
          changeType="neutral"
          delay={0.1}
        />
        <StatCard
          title="Rejected"
          value={1}
          icon={FileX}
          change="This cycle"
          changeType="negative"
          delay={0.15}
        />
      </div>

      {/* Admissions table */}
      <SectionCard
        title="Admissions"
        description={`${filtered.length} of ${list.length} records`}
        delay={0.2}
      >
        {/* Filter bar */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.25 }}
          className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between"
        >
          <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
            <Input
              placeholder="Search by student, admission no, or parent..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="sm:max-w-xs"
            />
            <div className="flex items-center gap-2">
              <select
                className={`${selectClass} w-full outline-none focus:border-primary sm:w-36`}
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(
                    e.target.value as 'all' | Admission['status']
                  )
                }
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
              <select
                className={`${selectClass} w-full outline-none focus:border-primary sm:w-32`}
                value={gradeFilter}
                onChange={(e) => setGradeFilter(e.target.value)}
              >
                <option value="all">All Grades</option>
                {GRADES.map((g) => (
                  <option key={g} value={g}>
                    Grade {g}
                  </option>
                ))}
              </select>
              {hasFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground"
                  onClick={resetFilters}
                >
                  Clear
                </Button>
              )}
            </div>
          </div>

          <ExportButtons
            label="Admissions"
            data={exportData}
            columns={exportColumns}
            filename="admissions"
          />
        </motion.div>

        <DataTable
          data={filtered}
          columns={columns}
          pageSize={10}
          onRowClick={(row) => setViewing(row)}
          emptyMessage="No admissions match your filters"
          initialSort={{ key: 'date', dir: 'desc' }}
        />
      </SectionCard>

      {/* Add / Edit modal */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingId ? 'Edit Admission' : 'New Admission'}
            </DialogTitle>
            <DialogDescription>
              {editingId
                ? 'Update the student admission details below.'
                : 'Fill in the student details to create a new admission record.'}
            </DialogDescription>
          </DialogHeader>

          <div className="max-h-[60vh] overflow-y-auto pr-1">
            <div className="grid gap-4 py-2 sm:grid-cols-2">
              {/* Student Name */}
              <div className="space-y-1.5 sm:col-span-2">
                <Label>
                  Student Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  value={form.studentName}
                  onChange={(e) => setField('studentName', e.target.value)}
                  placeholder="e.g. Aarav Patel"
                />
              </div>

              {/* Grade */}
              <div className="space-y-1.5">
                <Label>
                  Grade <span className="text-destructive">*</span>
                </Label>
                <select
                  className={`${selectClass} w-full outline-none focus:border-primary`}
                  value={form.grade}
                  onChange={(e) => setField('grade', e.target.value)}
                >
                  <option value="">Select grade</option>
                  {GRADES.map((g) => (
                    <option key={g} value={g}>
                      Grade {g}
                    </option>
                  ))}
                </select>
              </div>

              {/* Section */}
              <div className="space-y-1.5">
                <Label>Section</Label>
                <select
                  className={`${selectClass} w-full outline-none focus:border-primary`}
                  value={form.section}
                  onChange={(e) => setField('section', e.target.value)}
                >
                  {SECTIONS.map((s) => (
                    <option key={s} value={s}>
                      Section {s}
                    </option>
                  ))}
                </select>
              </div>

              {/* DOB */}
              <div className="space-y-1.5">
                <Label>Date of Birth</Label>
                <Input
                  type="date"
                  value={form.dob}
                  onChange={(e) => setField('dob', e.target.value)}
                />
              </div>

              {/* Gender */}
              <div className="space-y-1.5">
                <Label>Gender</Label>
                <select
                  className={`${selectClass} w-full outline-none focus:border-primary`}
                  value={form.gender}
                  onChange={(e) => setField('gender', e.target.value)}
                >
                  {GENDERS.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>

              {/* Parent Name */}
              <div className="space-y-1.5">
                <Label>
                  Parent Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  value={form.parentName}
                  onChange={(e) => setField('parentName', e.target.value)}
                  placeholder="e.g. Manish Patel"
                />
              </div>

              {/* Parent Phone */}
              <div className="space-y-1.5">
                <Label>
                  Parent Phone <span className="text-destructive">*</span>
                </Label>
                <Input
                  value={form.parentPhone}
                  onChange={(e) => setField('parentPhone', e.target.value)}
                  placeholder="+91 90000 00000"
                />
              </div>

              {/* Parent Email */}
              <div className="space-y-1.5 sm:col-span-2">
                <Label>Parent Email</Label>
                <Input
                  type="email"
                  value={form.parentEmail}
                  onChange={(e) => setField('parentEmail', e.target.value)}
                  placeholder="parent@email.com"
                />
              </div>

              {/* Address */}
              <div className="space-y-1.5 sm:col-span-2">
                <Label>Address</Label>
                <Input
                  value={form.address}
                  onChange={(e) => setField('address', e.target.value)}
                  placeholder="House No, Street, City"
                />
              </div>

              {/* Previous School */}
              <div className="space-y-1.5">
                <Label>Previous School</Label>
                <Input
                  value={form.previousSchool}
                  onChange={(e) => setField('previousSchool', e.target.value)}
                  placeholder="e.g. Delhi Public School"
                />
              </div>

              {/* Blood Group */}
              <div className="space-y-1.5">
                <Label>Blood Group</Label>
                <select
                  className={`${selectClass} w-full outline-none focus:border-primary`}
                  value={form.bloodGroup}
                  onChange={(e) => setField('bloodGroup', e.target.value)}
                >
                  <option value="">Select</option>
                  {BLOOD_GROUPS.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setFormOpen(false)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving} className="gap-2">
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {editingId ? 'Updating...' : 'Saving...'}
                </>
              ) : (
                <>{editingId ? 'Update Admission' : 'Save Admission'}</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View modal */}
      <Dialog open={!!viewing} onOpenChange={(o) => !o && setViewing(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Admission Details</DialogTitle>
            <DialogDescription>
              Full profile for {viewing?.studentName}.
            </DialogDescription>
          </DialogHeader>

          {viewing && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="space-y-5"
            >
              {/* Header summary */}
              <div className="flex flex-col gap-3 rounded-xl border bg-muted/30 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                    {viewing.studentName
                      .split(' ')
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join('')}
                  </div>
                  <div>
                    <p className="font-semibold">{viewing.studentName}</p>
                    <p className="text-xs text-muted-foreground">
                      {viewing.admissionNumber}
                    </p>
                  </div>
                </div>
                <StatusBadge
                  status={viewing.status}
                  variant={statusVariant(viewing.status)}
                  className="self-start sm:self-auto"
                />
              </div>

              {/* Details grid */}
              <div className="grid gap-4 sm:grid-cols-2">
                <Detail label="Student Name" value={viewing.studentName} />
                <Detail
                  label="Grade & Section"
                  value={`${viewing.grade}-${viewing.section}`}
                />
                <Detail label="Date of Birth" value={viewing.dob} />
                <Detail label="Gender" value={viewing.gender} />
                <Detail label="Blood Group" value={viewing.bloodGroup} />
                <Detail label="Date Applied" value={viewing.date} />
                <Detail label="Parent Name" value={viewing.parentName} />
                <Detail label="Parent Phone" value={viewing.parentPhone} />
                <Detail
                  label="Parent Email"
                  value={viewing.parentEmail}
                />
                <Detail label="Previous School" value={viewing.previousSchool} />
                <Detail
                  label="Address"
                  value={viewing.address}
                />
                <Detail
                  label="Documents"
                  value={
                    <span className="inline-flex items-center gap-2">
                      {`${viewing.documentsSubmitted}/${viewing.documentsTotal} submitted`}
                    </span>
                  }
                />
              </div>
            </motion.div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setViewing(null)}
            >
              Close
            </Button>
            <Button
              className="gap-2"
              onClick={() => {
                const row = viewing;
                setViewing(null);
                if (row) openEdit(row);
              }}
            >
              <Pencil className="h-4 w-4" />
              Edit Admission
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
