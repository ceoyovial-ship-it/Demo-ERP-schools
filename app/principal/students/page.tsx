'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  UserCheck,
  UserPlus,
  Clock,
  FileUp,
  Download,
  Search,
  Filter,
  Plus,
  Loader2,
  Upload,
  FileText,
  X,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { PageHeader } from '@/components/page-header';
import { StatCard } from '@/components/stat-card';
import { SectionCard } from '@/components/section-card';
import { DataTable, type Column } from '@/components/data-table';
import { ExportButtons } from '@/components/export-buttons';
import { StatusBadge, getFeeStatusVariant, getAttendanceVariant } from '@/components/status-badge';
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
import { students as initialStudents } from '@/lib/erp-data';
import { exportData, type ExportColumn } from '@/lib/export-utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type Student = (typeof initialStudents)[number];

const stats = [
  { title: 'Total Students', value: '948', icon: Users, change: '+2.1% this year', changeType: 'positive' as const, delay: 0 },
  { title: 'Active', value: '892', icon: UserCheck, change: '94.1% of total', changeType: 'positive' as const, delay: 0.05 },
  { title: 'New This Term', value: '48', icon: UserPlus, change: '+12 admissions', changeType: 'positive' as const, delay: 0.1 },
  { title: 'Pending Admissions', value: '12', icon: Clock, change: 'Awaiting review', changeType: 'neutral' as const, delay: 0.15 },
];

const classOptions = ['6', '7', '8', '9', '10'];
const sectionOptions = ['A', 'B'];
const statusOptions: { value: string; label: string }[] = [
  { value: 'all', label: 'All Status' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'graduated', label: 'Graduated' },
];

const selectClass =
  'h-9 rounded-lg border border-input bg-background px-3 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-primary disabled:cursor-not-allowed disabled:opacity-50';

const exportColumns: ExportColumn[] = [
  { key: 'admissionNumber', label: 'Admission No' },
  { key: 'name', label: 'Student Name' },
  { key: 'classSection', label: 'Class' },
  { key: 'rollNumber', label: 'Roll No' },
  { key: 'gender', label: 'Gender' },
  { key: 'attendance', label: 'Attendance %' },
  { key: 'avgMarks', label: 'Avg Marks' },
  { key: 'feeStatus', label: 'Fee Status' },
  { key: 'status', label: 'Status' },
  { key: 'parentName', label: 'Parent Name' },
  { key: 'parentPhone', label: 'Parent Phone' },
  { key: 'parentEmail', label: 'Parent Email' },
];

export default function StudentsPage() {
  const router = useRouter();
  const [classFilter, setClassFilter] = useState('all');
  const [sectionFilter, setSectionFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [studentList, setStudentList] = useState<Student[]>(initialStudents);

  // Add Student modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState<Record<string, string>>({});
  const [savingStudent, setSavingStudent] = useState(false);

  // Import modal
  const [showImportModal, setShowImportModal] = useState(false);
  const [importData, setImportData] = useState<Record<string, string>[]>([]);
  const [importPreview, setImportPreview] = useState(false);
  const [importing, setImporting] = useState(false);

  const filteredStudents = useMemo(() => {
    return studentList.filter((s) => {
      if (classFilter !== 'all' && s.classGrade !== classFilter) return false;
      if (sectionFilter !== 'all' && s.section !== sectionFilter) return false;
      if (statusFilter !== 'all' && s.status !== statusFilter) return false;
      return true;
    });
  }, [studentList, classFilter, sectionFilter, statusFilter]);

  const activeFilterCount =
    (classFilter !== 'all' ? 1 : 0) +
    (sectionFilter !== 'all' ? 1 : 0) +
    (statusFilter !== 'all' ? 1 : 0);

  const handleResetFilters = () => {
    setClassFilter('all');
    setSectionFilter('all');
    setStatusFilter('all');
  };

  const handleAddStudent = () => {
    if (!addForm.name || !addForm.admissionNumber || !addForm.classGrade) {
      toast.error('Please fill in all required fields');
      return;
    }
    setSavingStudent(true);
    setTimeout(() => {
      const newStudent: Student = {
        ...{} as Student,
        id: `std-new-${Date.now()}`,
        admissionNumber: addForm.admissionNumber,
        name: addForm.name,
        firstName: addForm.name.split(' ')[0],
        lastName: addForm.name.split(' ').slice(1).join(' '),
        classGrade: addForm.classGrade,
        section: addForm.section || 'A',
        classSection: `${addForm.classGrade}-${addForm.section || 'A'}`,
        rollNumber: studentList.length + 1,
        gender: addForm.gender || 'Male',
        status: 'active',
        attendance: 100,
        avgMarks: 0,
        feeStatus: 'pending',
        feePending: 45000,
        parentName: addForm.parentName || '',
        parentPhone: addForm.parentPhone || '',
        parentEmail: addForm.parentEmail || '',
        admissionDate: new Date().toISOString().split('T')[0],
        address: addForm.address || '',
        bloodGroup: addForm.bloodGroup || 'O+',
        dob: addForm.dob || '',
        avatar: null,
      };
      setStudentList((prev) => [newStudent, ...prev]);
      setSavingStudent(false);
      setShowAddModal(false);
      setAddForm({});
      toast.success('Student added successfully', {
        description: `${newStudent.name} enrolled in ${newStudent.classSection}`,
      });
    }, 800);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split('\n').filter((l) => l.trim());
      if (lines.length < 2) {
        toast.error('CSV file is empty or has no data rows');
        return;
      }

      const headers = lines[0].split(',').map((h) => h.trim());
      const rows: Record<string, string>[] = [];
      let validRows = 0;
      let duplicateCount = 0;

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map((v) => v.trim());
        const row: Record<string, string> = {};
        headers.forEach((header, idx) => {
          row[header] = values[idx] || '';
        });
        if (row.admissionNumber || row.name) {
          const isDuplicate = studentList.some(
            (s) => s.admissionNumber === row.admissionNumber
          );
          if (isDuplicate) {
            duplicateCount++;
          } else {
            rows.push(row);
            validRows++;
          }
        }
      }

      if (duplicateCount > 0) {
        toast.warning(`${duplicateCount} duplicate(s) skipped`, {
          description: `${validRows} valid rows ready for import`,
        });
      }

      setImportData(rows);
      setImportPreview(true);
    };
    reader.readAsText(file);
  };

  const handleImport = () => {
    setImporting(true);
    setTimeout(() => {
      const newStudents: Student[] = importData.map((row, i) => ({
        ...{} as Student,
        id: `std-imp-${Date.now()}-${i}`,
        admissionNumber: row.admissionNumber || `YS2025-IMP${i}`,
        name: row.name || 'Unknown',
        firstName: (row.name || 'Unknown').split(' ')[0],
        lastName: (row.name || 'Unknown').split(' ').slice(1).join(' '),
        classGrade: row.class || row.classGrade || '6',
        section: row.section || 'A',
        classSection: `${row.class || row.classGrade || '6'}-${row.section || 'A'}`,
        rollNumber: studentList.length + i + 1,
        gender: row.gender || 'Male',
        status: 'active',
        attendance: 100,
        avgMarks: 0,
        feeStatus: 'pending',
        feePending: 45000,
        parentName: row.parentName || '',
        parentPhone: row.parentPhone || '',
        parentEmail: row.parentEmail || '',
        admissionDate: new Date().toISOString().split('T')[0],
        address: row.address || '',
        bloodGroup: row.bloodGroup || 'O+',
        dob: row.dob || '',
        avatar: null,
      }));
      setStudentList((prev) => [...newStudents, ...prev]);
      setImporting(false);
      setShowImportModal(false);
      setImportData([]);
      setImportPreview(false);
      toast.success('Students imported successfully', {
        description: `${newStudents.length} students added to the directory`,
      });
    }, 1000);
  };

  const handleExport = (format: 'pdf' | 'excel' | 'csv') => {
    const data = filteredStudents.map((s) => ({
      admissionNumber: s.admissionNumber,
      name: s.name,
      classSection: s.classSection,
      rollNumber: s.rollNumber,
      gender: s.gender,
      attendance: s.attendance,
      avgMarks: s.avgMarks,
      feeStatus: s.feeStatus,
      status: s.status,
      parentName: s.parentName,
      parentPhone: s.parentPhone,
      parentEmail: s.parentEmail,
    }));
    exportData(data, exportColumns, 'students', format, 'Student Directory');
    toast.success(`Students exported as ${format.toUpperCase()}`, {
      description: `${data.length} records exported`,
    });
  };

  const columns: Column<Student>[] = [
    { key: 'admissionNumber', header: 'Admission No', sortable: true, className: 'font-mono text-xs whitespace-nowrap' },
    {
      key: 'name', header: 'Student Name', sortable: true,
      render: (s) => (
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
            {s.name.charAt(0)}
          </div>
          <span className="font-medium">{s.name}</span>
        </div>
      ),
    },
    { key: 'classSection', header: 'Class', sortable: true, className: 'whitespace-nowrap' },
    { key: 'rollNumber', header: 'Roll No', sortable: true, className: 'tabular-nums' },
    { key: 'gender', header: 'Gender', className: 'whitespace-nowrap' },
    {
      key: 'attendance', header: 'Attendance %', sortable: true,
      render: (s) => <StatusBadge status={`${s.attendance}%`} variant={getAttendanceVariant(s.attendance)} />,
      className: 'whitespace-nowrap',
    },
    { key: 'avgMarks', header: 'Avg Marks', sortable: true, render: (s) => <span className="tabular-nums font-medium">{s.avgMarks}%</span>, className: 'whitespace-nowrap' },
    { key: 'feeStatus', header: 'Fee Status', render: (s) => <StatusBadge status={s.feeStatus} variant={getFeeStatusVariant(s.feeStatus)} />, className: 'whitespace-nowrap' },
    { key: 'status', header: 'Status', render: (s) => <StatusBadge status={s.status} variant={s.status === 'active' ? 'success' : s.status === 'graduated' ? 'info' : 'neutral'} />, className: 'whitespace-nowrap' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Student Management" description="Manage student records, admissions, and academic portfolios across all grades.">
        <Button variant="outline" size="sm" className="gap-2" onClick={() => setShowImportModal(true)}>
          <FileUp className="h-4 w-4" />
          <span className="hidden sm:inline">Import</span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Export</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleExport('pdf')}>Export as PDF</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExport('excel')}>Export as Excel</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExport('csv')}>Export as CSV</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button size="sm" className="gap-2" onClick={() => setShowAddModal(true)}>
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Add Student</span>
        </Button>
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <StatCard key={s.title} title={s.title} value={s.value} icon={s.icon} change={s.change} changeType={s.changeType} delay={s.delay} />
        ))}
      </div>

      <SectionCard title="Student Directory" description={`${filteredStudents.length} student${filteredStudents.length === 1 ? '' : 's'} matching filters`} delay={0.2}>
        <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
              <Filter className="h-4 w-4" />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-semibold text-primary-foreground">{activeFilterCount}</span>
              )}
            </div>
            <select value={classFilter} onChange={(e) => setClassFilter(e.target.value)} className={selectClass} aria-label="Filter by class">
              <option value="all">All Classes</option>
              {classOptions.map((c) => <option key={c} value={c}>Grade {c}</option>)}
            </select>
            <select value={sectionFilter} onChange={(e) => setSectionFilter(e.target.value)} className={selectClass} aria-label="Filter by section">
              <option value="all">All Sections</option>
              {sectionOptions.map((s) => <option key={s} value={s}>Section {s}</option>)}
            </select>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={selectClass} aria-label="Filter by status">
              {statusOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            {activeFilterCount > 0 && (
              <Button variant="ghost" size="sm" className="h-9 gap-1.5 text-muted-foreground" onClick={handleResetFilters}>Clear</Button>
            )}
          </div>
          <ExportButtons
            label="students"
            data={filteredStudents.map((s) => ({
              admissionNumber: s.admissionNumber,
              name: s.name,
              classSection: s.classSection,
              rollNumber: s.rollNumber,
              gender: s.gender,
              attendance: s.attendance,
              avgMarks: s.avgMarks,
              feeStatus: s.feeStatus,
              status: s.status,
              parentName: s.parentName,
              parentPhone: s.parentPhone,
              parentEmail: s.parentEmail,
            }))}
            columns={exportColumns}
            filename="student-directory"
          />
        </div>
        <DataTable
          data={filteredStudents}
          columns={columns}
          pageSize={10}
          searchKeys={['name', 'admissionNumber']}
          searchPlaceholder="Search by name or admission no..."
          onRowClick={(s) => router.push(`/principal/students/${s.id}`)}
          emptyMessage="No students match the selected filters."
          initialSort={{ key: 'name', dir: 'asc' }}
        />
      </SectionCard>

      {/* Add Student Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Student</DialogTitle>
            <DialogDescription>Enter student details to enroll them in the school.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Admission No *</Label>
                <Input value={addForm.admissionNumber ?? ''} onChange={(e) => setAddForm({ ...addForm, admissionNumber: e.target.value })} placeholder="YS2025-0001" />
              </div>
              <div className="space-y-1.5">
                <Label>Full Name *</Label>
                <Input value={addForm.name ?? ''} onChange={(e) => setAddForm({ ...addForm, name: e.target.value })} placeholder="Aarav Sharma" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Class *</Label>
                <select className={selectClass} value={addForm.classGrade ?? ''} onChange={(e) => setAddForm({ ...addForm, classGrade: e.target.value })}>
                  <option value="">Select class</option>
                  {classOptions.map((c) => <option key={c} value={c}>Grade {c}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label>Section</Label>
                <select className={selectClass} value={addForm.section ?? ''} onChange={(e) => setAddForm({ ...addForm, section: e.target.value })}>
                  <option value="">Select section</option>
                  {sectionOptions.map((s) => <option key={s} value={s}>Section {s}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Gender</Label>
                <select className={selectClass} value={addForm.gender ?? ''} onChange={(e) => setAddForm({ ...addForm, gender: e.target.value })}>
                  <option value="">Select gender</option>
                  <option>Male</option>
                  <option>Female</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <Label>Date of Birth</Label>
                <Input type="date" value={addForm.dob ?? ''} onChange={(e) => setAddForm({ ...addForm, dob: e.target.value })} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Parent / Guardian Name</Label>
              <Input value={addForm.parentName ?? ''} onChange={(e) => setAddForm({ ...addForm, parentName: e.target.value })} placeholder="Ramesh Sharma" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Parent Phone</Label>
                <Input value={addForm.parentPhone ?? ''} onChange={(e) => setAddForm({ ...addForm, parentPhone: e.target.value })} placeholder="+91 90000 00000" />
              </div>
              <div className="space-y-1.5">
                <Label>Parent Email</Label>
                <Input type="email" value={addForm.parentEmail ?? ''} onChange={(e) => setAddForm({ ...addForm, parentEmail: e.target.value })} placeholder="parent@email.com" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Address</Label>
              <Input value={addForm.address ?? ''} onChange={(e) => setAddForm({ ...addForm, address: e.target.value })} placeholder="123, MG Road, Bengaluru" />
            </div>
            <div className="space-y-1.5">
              <Label>Blood Group</Label>
              <select className={selectClass} value={addForm.bloodGroup ?? ''} onChange={(e) => setAddForm({ ...addForm, bloodGroup: e.target.value })}>
                <option value="">Select blood group</option>
                <option>A+</option><option>A-</option><option>B+</option><option>B-</option>
                <option>O+</option><option>O-</option><option>AB+</option><option>AB-</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddModal(false)}>Cancel</Button>
            <Button onClick={handleAddStudent} disabled={savingStudent}>
              {savingStudent ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</> : 'Save Student'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Import Modal */}
      <Dialog open={showImportModal} onOpenChange={setShowImportModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Import Students</DialogTitle>
            <DialogDescription>Upload a CSV or Excel file to bulk import students.</DialogDescription>
          </DialogHeader>
          {!importPreview ? (
            <div className="py-4">
              <label className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border p-8 transition-colors hover:border-primary hover:bg-primary/5">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <Upload className="h-6 w-6 text-primary" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium">Click to upload or drag CSV file here</p>
                  <p className="mt-1 text-xs text-muted-foreground">Supports CSV format · Max 500 rows</p>
                </div>
                <input type="file" accept=".csv,.xlsx,.xls" className="hidden" onChange={handleFileUpload} />
              </label>
              <div className="mt-4 rounded-lg border bg-muted/30 p-3">
                <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <FileText className="h-3.5 w-3.5" />
                  Required CSV columns:
                </p>
                <p className="mt-1 font-mono text-xs text-muted-foreground">
                  admissionNumber, name, class, section, gender, parentName, parentPhone, parentEmail
                </p>
              </div>
            </div>
          ) : (
            <div className="py-2">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-medium">Preview ({importData.length} rows)</span>
                <Button variant="ghost" size="sm" onClick={() => { setImportData([]); setImportPreview(false); }}>Cancel</Button>
              </div>
              <div className="max-h-60 overflow-y-auto rounded-lg border">
                <table className="w-full text-xs">
                  <thead className="sticky top-0 bg-muted/50">
                    <tr>
                      <th className="px-2 py-2 text-left font-medium">Admission No</th>
                      <th className="px-2 py-2 text-left font-medium">Name</th>
                      <th className="px-2 py-2 text-left font-medium">Class</th>
                    </tr>
                  </thead>
                  <tbody>
                    {importData.slice(0, 20).map((row, i) => (
                      <tr key={i} className="border-t">
                        <td className="px-2 py-1.5 font-mono">{row.admissionNumber || '—'}</td>
                        <td className="px-2 py-1.5">{row.name || '—'}</td>
                        <td className="px-2 py-1.5">{row.class || row.classGrade || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {importData.length > 20 && (
                  <p className="border-t p-2 text-center text-xs text-muted-foreground">
                    + {importData.length - 20} more rows
                  </p>
                )}
              </div>
            </div>
          )}
          {importPreview && (
            <DialogFooter>
              <Button variant="outline" onClick={() => { setImportData([]); setImportPreview(false); }}>Cancel</Button>
              <Button onClick={handleImport} disabled={importing}>
                {importing ? <><Loader2 className="h-4 w-4 animate-spin" /> Importing...</> : `Import ${importData.length} Students`}
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
