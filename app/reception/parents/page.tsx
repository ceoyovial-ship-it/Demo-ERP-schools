'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Eye,
  Filter,
  Pencil,
  Trash2,
  UserCheck,
  UserCog,
  UserPlus,
  Users,
} from 'lucide-react';
import { toast } from 'sonner';

import { PageHeader } from '@/components/page-header';
import { StatCard } from '@/components/stat-card';
import { SectionCard } from '@/components/section-card';
import { DataTable, type Column } from '@/components/data-table';
import { ExportButtons } from '@/components/export-buttons';
import { StatusBadge } from '@/components/status-badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { parents as parentSeed, students as studentSeed } from '@/lib/erp-data';

type ParentRow = {
  id: string;
  parentName: string;
  studentName: string;
  classSection: string;
  phone: string;
  email: string;
  address: string;
  status: 'active' | 'inactive' | 'new';
};

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Status' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'new', label: 'New' },
] as const;

const CLASS_OPTIONS = ['6', '7', '8', '9', '10'] as const;
const SECTION_OPTIONS = ['A', 'B'] as const;

const selectClass =
  'h-9 rounded-lg border border-input bg-background px-3 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-primary disabled:cursor-not-allowed disabled:opacity-50';

const statusVariant = (status: ParentRow['status']) => {
  if (status === 'active') return 'success';
  if (status === 'new') return 'info';
  return 'neutral';
};

const initialParentRows: ParentRow[] = parentSeed.slice(0, 24).map((parent, index) => {
  const student = studentSeed[(index * 7) % studentSeed.length];
  const status: ParentRow['status'] = index % 5 === 0 ? 'inactive' : index % 3 === 0 ? 'new' : 'active';

  return {
    id: parent.id,
    parentName: parent.name,
    studentName: student.name,
    classSection: `${student.classGrade}-${student.section}`,
    phone: parent.phone,
    email: parent.email,
    address: parent.address,
    status,
  };
});

const exportColumns = [
  { key: 'id', label: 'Parent ID' },
  { key: 'parentName', label: 'Parent Name' },
  { key: 'studentName', label: 'Student Name' },
  { key: 'classSection', label: 'Class' },
  { key: 'phone', label: 'Phone' },
  { key: 'email', label: 'Email' },
  { key: 'address', label: 'Address' },
  { key: 'status', label: 'Status' },
] as const;

export default function ReceptionParentsPage() {
  const [parentList, setParentList] = useState<ParentRow[]>(initialParentRows);
  const [classFilter, setClassFilter] = useState('all');
  const [sectionFilter, setSectionFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<(typeof STATUS_OPTIONS)[number]['value']>('all');
  const [viewing, setViewing] = useState<ParentRow | null>(null);
  const [editing, setEditing] = useState<ParentRow | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ParentRow | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    parentName: '',
    studentName: '',
    classGrade: '6',
    section: 'A',
    phone: '',
    email: '',
    address: '',
    status: 'new' as ParentRow['status'],
  });

  const filteredParents = useMemo(() => {
    return parentList.filter((parent) => {
      const [grade, section] = parent.classSection.split('-');
      if (classFilter !== 'all' && grade !== classFilter) return false;
      if (sectionFilter !== 'all' && section !== sectionFilter) return false;
      if (statusFilter !== 'all' && parent.status !== statusFilter) return false;
      return true;
    });
  }, [parentList, classFilter, sectionFilter, statusFilter]);

  const stats = useMemo(() => {
    const totalParents = parentList.length;
    const activeParents = parentList.filter((item) => item.status === 'active').length;
    const newRegistrations = parentList.filter((item) => item.status === 'new').length;
    const linkedStudents = parentList.reduce((sum, item) => sum + (item.studentName ? 1 : 0), 0);

    return {
      totalParents,
      activeParents,
      newRegistrations,
      linkedStudents,
    };
  }, [parentList]);

  const activeFilterCount =
    (classFilter !== 'all' ? 1 : 0) +
    (sectionFilter !== 'all' ? 1 : 0) +
    (statusFilter !== 'all' ? 1 : 0);

  const handleResetFilters = () => {
    setClassFilter('all');
    setSectionFilter('all');
    setStatusFilter('all');
    toast.info('Filters reset');
  };

  const handleSaveEdit = () => {
    if (!editing) return;

    setParentList((current) =>
      current.map((item) => (item.id === editing.id ? editing : item))
    );
    toast.success('Parent updated', {
      description: `${editing.parentName} was updated successfully.`,
    });
    setEditing(null);
  };

  const handleDeleteParent = () => {
    if (!deleteTarget) return;

    setParentList((current) => current.filter((item) => item.id !== deleteTarget.id));
    toast.success('Parent deleted', {
      description: `${deleteTarget.parentName} was removed from the directory.`,
    });
    setDeleteTarget(null);
  };

  const handleAddParent = () => {
    const nextParent: ParentRow = {
      id: `par-${String(parentList.length + 1).padStart(4, '0')}`,
      parentName: formData.parentName.trim(),
      studentName: formData.studentName.trim(),
      classSection: `${formData.classGrade}-${formData.section}`,
      phone: formData.phone.trim(),
      email: formData.email.trim(),
      address: formData.address.trim(),
      status: formData.status,
    };

    if (!nextParent.parentName || !nextParent.studentName || !nextParent.phone || !nextParent.email) {
      toast.error('Missing required fields', {
        description: 'Please complete the parent name, student name, phone, and email.',
      });
      return;
    }

    setParentList((current) => [nextParent, ...current]);
    toast.success('Parent added', {
      description: `${nextParent.parentName} was added to the parent directory.`,
    });
    setIsAddDialogOpen(false);
    setFormData({
      parentName: '',
      studentName: '',
      classGrade: '6',
      section: 'A',
      phone: '',
      email: '',
      address: '',
      status: 'new',
    });
  };

  const columns: Column<ParentRow>[] = [
    {
      key: 'id',
      header: 'Parent ID',
      sortable: true,
      className: 'font-mono text-xs whitespace-nowrap',
    },
    {
      key: 'parentName',
      header: 'Parent Name',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
            {row.parentName.charAt(0)}
          </div>
          <span className="font-medium">{row.parentName}</span>
        </div>
      ),
    },
    {
      key: 'studentName',
      header: 'Student Name',
      sortable: true,
      render: (row) => <span className="text-sm">{row.studentName}</span>,
    },
    {
      key: 'classSection',
      header: 'Class',
      sortable: true,
      className: 'whitespace-nowrap',
    },
    {
      key: 'phone',
      header: 'Phone',
      render: (row) => (
        <span className="font-mono text-xs whitespace-nowrap">{row.phone}</span>
      ),
    },
    {
      key: 'email',
      header: 'Email',
      render: (row) => <span className="whitespace-nowrap text-sm">{row.email}</span>,
    },
    {
      key: 'address',
      header: 'Address',
      render: (row) => <span className="text-sm">{row.address}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => (
        <StatusBadge status={row.status} variant={statusVariant(row.status)} />
      ),
      className: 'whitespace-nowrap',
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => (
        <div className="flex items-center justify-end gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-1.5"
            title="View Parent"
            onClick={(e) => {
              e.stopPropagation();
              setViewing(row);
            }}
          >
            <Eye className="h-4 w-4" />
            <span className="hidden lg:inline">View</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-1.5"
            title="Edit Parent"
            onClick={(e) => {
              e.stopPropagation();
              setEditing(row);
            }}
          >
            <Pencil className="h-4 w-4" />
            <span className="hidden lg:inline">Edit</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-1.5 text-destructive"
            title="Delete Parent"
            onClick={(e) => {
              e.stopPropagation();
              setDeleteTarget(row);
            }}
          >
            <Trash2 className="h-4 w-4" />
            <span className="hidden lg:inline">Delete</span>
          </Button>
        </div>
      ),
      className: 'text-right',
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Parent Directory"
        description="Search, filter, and manage parent records"
      >
        <Button
          variant="outline"
          className="gap-2"
          onClick={() => {
            toast.info('Add Parent', {
              description: 'Use the quick add form to register a new parent record.',
            });
            setIsAddDialogOpen(true);
          }}
        >
          <UserPlus className="h-4 w-4" />
          <span className="hidden sm:inline">Add Parent</span>
        </Button>
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Parents"
          value={stats.totalParents}
          icon={UserCog}
          change="Registered guardians"
          changeType="positive"
          delay={0}
        />
        <StatCard
          title="Active Parents"
          value={stats.activeParents}
          icon={UserCheck}
          change="Currently linked"
          changeType="positive"
          delay={0.05}
        />
        <StatCard
          title="New Registrations"
          value={stats.newRegistrations}
          icon={UserPlus}
          change="Need follow-up"
          changeType="neutral"
          delay={0.1}
        />
        <StatCard
          title="Linked Students"
          value={stats.linkedStudents}
          icon={Users}
          change="Across all profiles"
          changeType="positive"
          delay={0.15}
        />
      </div>

      <SectionCard
        title="Parent Directory"
        description={`${filteredParents.length} parent${filteredParents.length === 1 ? '' : 's'} matching filters`}
        delay={0.2}
      >
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.25 }}
          className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between"
        >
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
              <Filter className="h-4 w-4" />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-semibold text-primary-foreground">
                  {activeFilterCount}
                </span>
              )}
            </div>
            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className={selectClass}
              aria-label="Filter by class"
            >
              <option value="all">All Classes</option>
              {CLASS_OPTIONS.map((grade) => (
                <option key={grade} value={grade}>
                  Grade {grade}
                </option>
              ))}
            </select>
            <select
              value={sectionFilter}
              onChange={(e) => setSectionFilter(e.target.value)}
              className={selectClass}
              aria-label="Filter by section"
            >
              <option value="all">All Sections</option>
              {SECTION_OPTIONS.map((section) => (
                <option key={section} value={section}>
                  Section {section}
                </option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as (typeof STATUS_OPTIONS)[number]['value'])}
              className={selectClass}
              aria-label="Filter by status"
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {activeFilterCount > 0 && (
              <Button variant="ghost" size="sm" className="h-9 gap-1.5 text-muted-foreground" onClick={handleResetFilters}>
                Clear
              </Button>
            )}
          </div>

          <ExportButtons
            label="Parent Directory"
            data={filteredParents.map((row) => ({ ...row }))}
            columns={exportColumns.map((column) => ({ key: column.key, label: column.label }))}
            filename="reception-parent-directory"
          />
        </motion.div>

        <DataTable
          data={filteredParents}
          columns={columns}
          pageSize={10}
          searchKeys={['parentName', 'studentName', 'phone', 'email']}
          searchPlaceholder="Search by parent, student, phone, or email..."
          onRowClick={(row) => setViewing(row)}
          emptyMessage="No parents match the selected filters."
          initialSort={{ key: 'parentName', dir: 'asc' }}
        />
      </SectionCard>

      <Dialog open={!!viewing} onOpenChange={(open) => !open && setViewing(null)}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Parent Details</DialogTitle>
          </DialogHeader>

          {viewing && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">Parent ID</p>
                <p className="text-sm font-medium">{viewing.id}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">Status</p>
                <StatusBadge status={viewing.status} variant={statusVariant(viewing.status)} />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">Parent Name</p>
                <p className="text-sm font-medium">{viewing.parentName}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">Student Name</p>
                <p className="text-sm font-medium">{viewing.studentName}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">Class</p>
                <p className="text-sm font-medium">{viewing.classSection}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">Phone</p>
                <p className="text-sm font-medium">{viewing.phone}</p>
              </div>
              <div className="space-y-1 sm:col-span-2">
                <p className="text-xs font-medium text-muted-foreground">Email</p>
                <p className="text-sm font-medium">{viewing.email}</p>
              </div>
              <div className="space-y-1 sm:col-span-2">
                <p className="text-xs font-medium text-muted-foreground">Address</p>
                <p className="text-sm font-medium">{viewing.address}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Edit Parent</DialogTitle>
          </DialogHeader>

          {editing && (
            <div className="grid gap-4">
              <div className="grid gap-2 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="edit-parent-name">Parent Name</Label>
                  <Input
                    id="edit-parent-name"
                    value={editing.parentName}
                    onChange={(e) => setEditing({ ...editing, parentName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-student-name">Student Name</Label>
                  <Input
                    id="edit-student-name"
                    value={editing.studentName}
                    onChange={(e) => setEditing({ ...editing, studentName: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="edit-phone">Phone</Label>
                  <Input
                    id="edit-phone"
                    value={editing.phone}
                    onChange={(e) => setEditing({ ...editing, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-email">Email</Label>
                  <Input
                    id="edit-email"
                    value={editing.email}
                    onChange={(e) => setEditing({ ...editing, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="edit-class">Class</Label>
                  <Input
                    id="edit-class"
                    value={editing.classSection}
                    onChange={(e) => setEditing({ ...editing, classSection: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <select
                    id="edit-status"
                    className={selectClass}
                    value={editing.status}
                    onChange={(e) => setEditing({ ...editing, status: e.target.value as ParentRow['status'] })}
                  >
                    {STATUS_OPTIONS.filter((option) => option.value !== 'all').map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-address">Address</Label>
                <Input
                  id="edit-address"
                  value={editing.address}
                  onChange={(e) => setEditing({ ...editing, address: e.target.value })}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isAddDialogOpen} onOpenChange={(open) => !open && setIsAddDialogOpen(false)}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Add Parent</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="new-parent-name">Parent Name</Label>
                <Input
                  id="new-parent-name"
                  value={formData.parentName}
                  onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-student-name">Student Name</Label>
                <Input
                  id="new-student-name"
                  value={formData.studentName}
                  onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                />
              </div>
            </div>

            <div className="grid gap-2 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="new-class">Class</Label>
                <select
                  id="new-class"
                  className={selectClass}
                  value={formData.classGrade}
                  onChange={(e) => setFormData({ ...formData, classGrade: e.target.value })}
                >
                  {CLASS_OPTIONS.map((grade) => (
                    <option key={grade} value={grade}>
                      {grade}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-section">Section</Label>
                <select
                  id="new-section"
                  className={selectClass}
                  value={formData.section}
                  onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                >
                  {SECTION_OPTIONS.map((section) => (
                    <option key={section} value={section}>
                      {section}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-status">Status</Label>
                <select
                  id="new-status"
                  className={selectClass}
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as ParentRow['status'] })}
                >
                  {STATUS_OPTIONS.filter((option) => option.value !== 'all').map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="new-phone">Phone</Label>
                <Input
                  id="new-phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-email">Email</Label>
                <Input
                  id="new-email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-address">Address</Label>
              <Input
                id="new-address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddParent}>Add Parent</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Parent?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove {deleteTarget?.parentName} from the parent directory.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteParent}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
