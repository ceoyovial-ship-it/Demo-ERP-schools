'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileBarChart,
  FileText,
  FileSpreadsheet,
  Calendar,
  Clock,
  CheckCircle2,
  Download,
  Plus,
  BarChart3,
  Users,
  CalendarCheck,
  Wallet,
  ClipboardList,
  GraduationCap,
  type LucideIcon,
} from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '@/components/page-header';
import { StatCard } from '@/components/stat-card';
import { SectionCard } from '@/components/section-card';
import { StatusBadge } from '@/components/status-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { attendanceData, examResults, students, teachers } from '@/lib/erp-data';
import { exportData, type ExportColumn } from '@/lib/export-utils';
import { cn } from '@/lib/utils';

/* -------------------------------------------------------------------------- */
/*  Types                                                                      */
/* -------------------------------------------------------------------------- */

type TabKey =
  | 'student'
  | 'attendance'
  | 'fee'
  | 'exam'
  | 'teacher';

type ReportStatus = 'Ready' | 'Processing' | 'Pending';

interface ReportDefinition {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  lastGenerated: string;
  status: ReportStatus;
}

/* -------------------------------------------------------------------------- */
/*  Status helpers                                                             */
/* -------------------------------------------------------------------------- */

function statusVariant(status: ReportStatus) {
  if (status === 'Ready') return 'success' as const;
  if (status === 'Processing') return 'info' as const;
  return 'warning' as const;
}

/* -------------------------------------------------------------------------- */
/*  Tab configuration                                                          */
/* -------------------------------------------------------------------------- */

const tabs: { key: TabKey; label: string; icon: LucideIcon }[] = [
  { key: 'student', label: 'Student Reports', icon: Users },
  { key: 'attendance', label: 'Attendance Reports', icon: CalendarCheck },
  { key: 'fee', label: 'Fee Reports', icon: Wallet },
  { key: 'exam', label: 'Exam Reports', icon: ClipboardList },
  { key: 'teacher', label: 'Teacher Reports', icon: GraduationCap },
];

/* -------------------------------------------------------------------------- */
/*  Inline report definitions per tab                                          */
/* -------------------------------------------------------------------------- */

const reportDefinitions: Record<TabKey, ReportDefinition[]> = {
  student: [
    {
      id: 'student-directory',
      title: 'Student Directory Report',
      description: 'All students with full details including contact and class info.',
      icon: Users,
      lastGenerated: '2025-07-13',
      status: 'Ready',
    },
    {
      id: 'class-wise-student',
      title: 'Class-wise Student Report',
      description: 'Students grouped by class and section for quick reference.',
      icon: GraduationCap,
      lastGenerated: '2025-07-12',
      status: 'Ready',
    },
    {
      id: 'admission-report',
      title: 'Admission Report',
      description: 'New admissions enrolled during the current academic year.',
      icon: FileText,
      lastGenerated: '2025-07-14',
      status: 'Processing',
    },
    {
      id: 'student-performance',
      title: 'Student Performance Report',
      description: 'Academic performance summary across all grades and subjects.',
      icon: BarChart3,
      lastGenerated: '2025-07-10',
      status: 'Ready',
    },
  ],
  attendance: [
    {
      id: 'daily-attendance',
      title: 'Daily Attendance Report',
      description: 'Day-wise attendance summary for every class and section.',
      icon: CalendarCheck,
      lastGenerated: '2025-07-14',
      status: 'Ready',
    },
    {
      id: 'monthly-attendance',
      title: 'Monthly Attendance Report',
      description: 'Month-wise attendance trends and comparison across classes.',
      icon: Calendar,
      lastGenerated: '2025-07-01',
      status: 'Ready',
    },
    {
      id: 'class-wise-attendance',
      title: 'Class-wise Attendance Report',
      description: 'Comparative attendance analysis between classes.',
      icon: BarChart3,
      lastGenerated: '2025-07-11',
      status: 'Processing',
    },
    {
      id: 'student-wise-attendance',
      title: 'Student-wise Attendance Report',
      description: 'Individual attendance records for each enrolled student.',
      icon: FileText,
      lastGenerated: '2025-07-09',
      status: 'Ready',
    },
  ],
  fee: [
    {
      id: 'fee-collection',
      title: 'Fee Collection Report',
      description: 'Monthly fee collection summary with payment method breakdown.',
      icon: Wallet,
      lastGenerated: '2025-07-14',
      status: 'Ready',
    },
    {
      id: 'pending-fees',
      title: 'Pending Fees Report',
      description: 'Defaulters list with outstanding amounts and due dates.',
      icon: FileText,
      lastGenerated: '2025-07-13',
      status: 'Ready',
    },
    {
      id: 'fee-structure',
      title: 'Fee Structure Report',
      description: 'All fee types, amounts, and applicable class categories.',
      icon: FileSpreadsheet,
      lastGenerated: '2025-06-30',
      status: 'Ready',
    },
    {
      id: 'revenue-analysis',
      title: 'Revenue Analysis Report',
      description: 'Income breakdown by tuition, transport, hostel, and lab fees.',
      icon: BarChart3,
      lastGenerated: '2025-07-08',
      status: 'Pending',
    },
  ],
  exam: [
    {
      id: 'results-summary',
      title: 'Results Summary Report',
      description: 'Overall exam results across all classes and subjects.',
      icon: ClipboardList,
      lastGenerated: '2025-07-07',
      status: 'Ready',
    },
    {
      id: 'top-performers',
      title: 'Top Performers Report',
      description: 'Rank list of the highest-scoring students school-wide.',
      icon: GraduationCap,
      lastGenerated: '2025-07-06',
      status: 'Ready',
    },
    {
      id: 'subject-analysis',
      title: 'Subject Analysis Report',
      description: 'Subject-wise performance analysis and grade distribution.',
      icon: BarChart3,
      lastGenerated: '2025-07-05',
      status: 'Processing',
    },
    {
      id: 'pass-percentage',
      title: 'Pass Percentage Report',
      description: 'Class-wise pass rates and failure breakdown.',
      icon: FileBarChart,
      lastGenerated: '2025-07-04',
      status: 'Ready',
    },
  ],
  teacher: [
    {
      id: 'teacher-directory',
      title: 'Teacher Directory Report',
      description: 'All teachers with subjects, qualifications, and contact info.',
      icon: GraduationCap,
      lastGenerated: '2025-07-12',
      status: 'Ready',
    },
    {
      id: 'teacher-performance',
      title: 'Teacher Performance Report',
      description: 'Performance scores and evaluation metrics for faculty.',
      icon: BarChart3,
      lastGenerated: '2025-07-10',
      status: 'Ready',
    },
    {
      id: 'teacher-attendance',
      title: 'Attendance Report',
      description: 'Teacher attendance records for the current term.',
      icon: CalendarCheck,
      lastGenerated: '2025-07-11',
      status: 'Ready',
    },
    {
      id: 'teacher-leave',
      title: 'Leave Report',
      description: 'Leave history and approval status for all teaching staff.',
      icon: FileText,
      lastGenerated: '2025-07-09',
      status: 'Pending',
    },
  ],
};

/* -------------------------------------------------------------------------- */
/*  Stat cards                                                                 */
/* -------------------------------------------------------------------------- */

const stats = [
  {
    title: 'Total Reports',
    value: 24,
    icon: FileBarChart,
    change: '+5 this month',
    changeType: 'positive' as const,
    description: 'Reports available across all categories',
  },
  {
    title: 'Generated Today',
    value: 3,
    icon: CheckCircle2,
    change: '2 PDF, 1 Excel',
    changeType: 'neutral' as const,
    description: 'Reports generated in the last 24 hours',
  },
  {
    title: 'Scheduled',
    value: 8,
    icon: Clock,
    change: 'Next: Jul 16',
    changeType: 'neutral' as const,
    description: 'Auto-generated reports on a recurring schedule',
  },
  {
    title: 'Pending',
    value: 2,
    icon: FileText,
    change: 'Awaiting data',
    changeType: 'negative' as const,
    description: 'Reports queued and waiting to be generated',
  },
];

/* -------------------------------------------------------------------------- */
/*  Custom Report Builder options                                             */
/* -------------------------------------------------------------------------- */

const customReportTypes = [
  { value: 'student-directory', label: 'Student Directory' },
  { value: 'attendance-summary', label: 'Attendance Summary' },
  { value: 'fee-collection', label: 'Fee Collection' },
  { value: 'exam-results', label: 'Exam Results' },
  { value: 'teacher-directory', label: 'Teacher Directory' },
  { value: 'revenue-analysis', label: 'Revenue Analysis' },
];

const customFormats = [
  { value: 'pdf', label: 'PDF' },
  { value: 'excel', label: 'Excel' },
];

/* -------------------------------------------------------------------------- */
/*  Date formatting helper                                                     */
/* -------------------------------------------------------------------------- */

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

const reportListExportColumns: ExportColumn[] = [
  { key: 'title', label: 'Title' },
  { key: 'description', label: 'Description' },
  { key: 'lastGenerated', label: 'Last Generated' },
  { key: 'status', label: 'Status' },
];

const studentDirectoryExportColumns: ExportColumn[] = [
  { key: 'name', label: 'Student Name' },
  { key: 'admissionNumber', label: 'Admission Number' },
  { key: 'classSection', label: 'Class / Section' },
  { key: 'rollNumber', label: 'Roll Number' },
  { key: 'attendance', label: 'Attendance %' },
  { key: 'avgMarks', label: 'Average Marks' },
  { key: 'feeStatus', label: 'Fee Status' },
  { key: 'parentName', label: 'Parent Name' },
  { key: 'parentPhone', label: 'Parent Phone' },
];

const attendanceExportColumns: ExportColumn[] = [
  { key: 'date', label: 'Date' },
  { key: 'day', label: 'Day' },
  { key: 'present', label: 'Present' },
  { key: 'absent', label: 'Absent' },
  { key: 'late', label: 'Late' },
  { key: 'rate', label: 'Rate %' },
];

const feeExportColumns: ExportColumn[] = [
  { key: 'name', label: 'Student Name' },
  { key: 'classSection', label: 'Class / Section' },
  { key: 'feeStatus', label: 'Fee Status' },
  { key: 'feePending', label: 'Pending Amount' },
  { key: 'attendance', label: 'Attendance %' },
];

const examExportColumns: ExportColumn[] = [
  { key: 'studentName', label: 'Student Name' },
  { key: 'admissionNumber', label: 'Admission Number' },
  { key: 'class', label: 'Class / Section' },
  { key: 'totalMarks', label: 'Total Marks' },
  { key: 'percentage', label: 'Percentage' },
  { key: 'rank', label: 'Rank' },
  { key: 'grade', label: 'Grade' },
  { key: 'status', label: 'Status' },
];

const teacherDirectoryExportColumns: ExportColumn[] = [
  { key: 'name', label: 'Teacher Name' },
  { key: 'employeeId', label: 'Employee ID' },
  { key: 'subject', label: 'Subject' },
  { key: 'experience', label: 'Experience (Years)' },
  { key: 'qualification', label: 'Qualification' },
  { key: 'phone', label: 'Phone' },
  { key: 'attendance', label: 'Attendance %' },
  { key: 'performance', label: 'Performance %' },
  { key: 'status', label: 'Status' },
];

const studentDirectoryRows = students.map((student) => ({
  name: student.name,
  admissionNumber: student.admissionNumber,
  classSection: student.classSection,
  rollNumber: student.rollNumber,
  attendance: student.attendance,
  avgMarks: student.avgMarks,
  feeStatus: student.feeStatus,
  parentName: student.parentName,
  parentPhone: student.parentPhone,
}));

const attendanceSnapshotRows = attendanceData.map((entry) => ({
  date: entry.date,
  day: entry.day,
  present: entry.present,
  absent: entry.absent,
  late: entry.late,
  rate: entry.rate,
}));

const feeSnapshotRows = students.slice(0, 120).map((student) => ({
  name: student.name,
  classSection: student.classSection,
  feeStatus: student.feeStatus,
  feePending: student.feePending,
  attendance: student.attendance,
}));

const examSnapshotRows = examResults.map((entry) => ({
  studentName: entry.studentName,
  admissionNumber: entry.admissionNumber,
  class: entry.class,
  totalMarks: entry.totalMarks,
  percentage: entry.percentage,
  rank: entry.rank,
  grade: entry.grade,
  status: entry.status,
}));

const teacherDirectoryRows = teachers.map((teacher) => ({
  name: teacher.name,
  employeeId: teacher.employeeId,
  subject: teacher.subject,
  experience: teacher.experience,
  qualification: teacher.qualification,
  phone: teacher.phone,
  attendance: teacher.attendance,
  performance: teacher.performance,
  status: teacher.status,
}));

function getReportExportBundle(reportId: string) {
  switch (reportId) {
    case 'student-directory':
    case 'class-wise-student':
    case 'student-performance':
      return {
        data: studentDirectoryRows,
        columns: studentDirectoryExportColumns,
        filename: 'student-directory-report',
        title: 'Student Directory Report',
      };
    case 'daily-attendance':
    case 'monthly-attendance':
    case 'class-wise-attendance':
    case 'student-wise-attendance':
      return {
        data: attendanceSnapshotRows,
        columns: attendanceExportColumns,
        filename: 'attendance-report',
        title: 'Attendance Report',
      };
    case 'fee-collection':
    case 'pending-fees':
    case 'fee-structure':
    case 'revenue-analysis':
      return {
        data: feeSnapshotRows,
        columns: feeExportColumns,
        filename: 'fee-report',
        title: 'Fee Report',
      };
    case 'results-summary':
    case 'top-performers':
    case 'subject-analysis':
    case 'pass-percentage':
      return {
        data: examSnapshotRows,
        columns: examExportColumns,
        filename: 'exam-results-report',
        title: 'Exam Results Report',
      };
    case 'teacher-directory':
    case 'teacher-performance':
    case 'teacher-attendance':
    case 'teacher-leave':
      return {
        data: teacherDirectoryRows,
        columns: teacherDirectoryExportColumns,
        filename: 'teacher-directory-report',
        title: 'Teacher Directory Report',
      };
    default:
      return {
        data: studentDirectoryRows,
        columns: studentDirectoryExportColumns,
        filename: 'report-export',
        title: 'Report Export',
      };
  }
}

function getCustomReportExportBundle(type: string) {
  switch (type) {
    case 'attendance-summary':
      return {
        data: attendanceSnapshotRows,
        columns: attendanceExportColumns,
        filename: 'attendance-summary',
        title: 'Attendance Summary',
      };
    case 'fee-collection':
      return {
        data: feeSnapshotRows,
        columns: feeExportColumns,
        filename: 'fee-collection',
        title: 'Fee Collection',
      };
    case 'exam-results':
      return {
        data: examSnapshotRows,
        columns: examExportColumns,
        filename: 'exam-results',
        title: 'Exam Results',
      };
    case 'teacher-directory':
      return {
        data: teacherDirectoryRows,
        columns: teacherDirectoryExportColumns,
        filename: 'teacher-directory',
        title: 'Teacher Directory',
      };
    case 'revenue-analysis':
      return {
        data: feeSnapshotRows,
        columns: feeExportColumns,
        filename: 'revenue-analysis',
        title: 'Revenue Analysis',
      };
    case 'student-directory':
    default:
      return {
        data: studentDirectoryRows,
        columns: studentDirectoryExportColumns,
        filename: 'student-directory',
        title: 'Student Directory',
      };
  }
}

/* -------------------------------------------------------------------------- */
/*  Report card                                                                */
/* -------------------------------------------------------------------------- */

interface ReportCardProps {
  report: ReportDefinition;
  index: number;
}

function ReportCard({ report, index }: ReportCardProps) {
  const Icon = report.icon;

  const handleGenerate = (format: 'PDF' | 'Excel') => {
    const exportBundle = getReportExportBundle(report.id);

    if (exportBundle.data.length === 0) {
      toast.info('No data available to export.');
      return;
    }

    const selectedFormat = format === 'PDF' ? 'pdf' : 'excel';
    const fileLabel = `${exportBundle.filename}-${selectedFormat}`;

    exportData(
      exportBundle.data,
      exportBundle.columns,
      fileLabel,
      selectedFormat,
      exportBundle.title
    );

    toast.success(`${report.title} (${format}) generated`, {
      description: `${exportBundle.data.length} records exported`,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
      className="flex h-full flex-col rounded-2xl border bg-card p-5 shadow-premium transition-shadow hover:shadow-premium-lg"
    >
      {/* Header: icon + status */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <StatusBadge
          status={report.status}
          variant={statusVariant(report.status)}
        />
      </div>

      {/* Title + description */}
      <div className="mt-4 flex-1">
        <h3 className="text-base font-semibold leading-tight">{report.title}</h3>
        <p className="mt-1.5 text-sm text-muted-foreground">
          {report.description}
        </p>
      </div>

      {/* Last generated */}
      <div className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
        <Clock className="h-3.5 w-3.5" />
        <span>Last generated: {formatDate(report.lastGenerated)}</span>
      </div>

      {/* Action buttons */}
      <div className="mt-4 grid grid-cols-2 gap-2">
        <Button
          size="sm"
          variant="outline"
          className="gap-1.5"
          onClick={() => handleGenerate('PDF')}
        >
          <FileText className="h-4 w-4" />
          Generate PDF
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="gap-1.5"
          onClick={() => handleGenerate('Excel')}
        >
          <FileSpreadsheet className="h-4 w-4" />
          Generate Excel
        </Button>
      </div>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function PrincipalReportsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('student');
  const [customReportType, setCustomReportType] = useState<string>('');
  const [customFormat, setCustomFormat] = useState<string>('pdf');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const activeReports = reportDefinitions[activeTab];

  const handleExportAll = () => {
    const exportBundle = {
      data: activeReports.map((report) => ({
        title: report.title,
        description: report.description,
        lastGenerated: report.lastGenerated,
        status: report.status,
      })),
      columns: reportListExportColumns,
      filename: `${activeTab}-reports-summary`,
      title: `${activeTab.replace('-', ' ')} reports summary`,
    };

    exportData(
      exportBundle.data,
      exportBundle.columns,
      exportBundle.filename,
      'pdf',
      exportBundle.title
    );

    toast.success('Report summary exported', {
      description: `${exportBundle.data.length} report definitions exported`,
    });
  };

  const handleGenerateCustom = () => {
    if (!customReportType) {
      toast.error('Please select a report type');
      return;
    }
    if (!startDate || !endDate) {
      toast.error('Please select both start and end dates');
      return;
    }
    if (new Date(endDate) < new Date(startDate)) {
      toast.error('End date cannot be before the start date');
      return;
    }

    const reportLabel =
      customReportTypes.find((r) => r.value === customReportType)?.label ??
      'Report';
    const formatLabel =
      customFormats.find((f) => f.value === customFormat)?.label ?? 'PDF';
    const exportBundle = getCustomReportExportBundle(customReportType);

    if (exportBundle.data.length === 0) {
      toast.info('No data available to export.');
      return;
    }

    exportData(
      exportBundle.data,
      exportBundle.columns,
      `${exportBundle.filename}-${customFormat}`,
      customFormat as 'pdf' | 'excel',
      `${reportLabel} (${formatLabel})`
    );

    toast.success(`${reportLabel} (${formatLabel}) exported`, {
      description: `Date range: ${formatDate(startDate)} – ${formatDate(endDate)}`,
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports"
        description="Generate and export comprehensive school reports"
      >
        <Button variant="outline" size="sm" className="gap-2">
          <Calendar className="h-4 w-4" />
          Jul 14, 2025
        </Button>
        <Button size="sm" className="gap-2" onClick={handleExportAll}>
          <Download className="h-4 w-4" />
          Export All
        </Button>
      </PageHeader>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            change={stat.change}
            changeType={stat.changeType}
            description={stat.description}
            delay={i * 0.05}
          />
        ))}
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

      {/* Tab content — report grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {activeReports.map((report, i) => (
            <ReportCard key={report.id} report={report} index={i} />
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Custom Report Builder */}
      <SectionCard
        title="Custom Report Builder"
        description="Configure parameters and generate a tailored report for any date range"
        delay={0.1}
      >
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 lg:items-end">
          {/* Report type */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Report Type
            </label>
            <Select value={customReportType} onValueChange={setCustomReportType}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select report type" />
              </SelectTrigger>
              <SelectContent>
                {customReportTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Start date */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Start Date
            </label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full"
            />
          </div>

          {/* End date */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              End Date
            </label>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Format */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Format
            </label>
            <Select value={customFormat} onValueChange={setCustomFormat}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                {customFormats.map((format) => (
                  <SelectItem key={format.value} value={format.value}>
                    {format.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Generate button */}
          <Button
            size="lg"
            className="gap-2"
            onClick={handleGenerateCustom}
          >
            <Plus className="h-4 w-4" />
            Generate Report
          </Button>
        </div>

        {/* Hint */}
        <p className="mt-4 text-xs text-muted-foreground">
          Custom reports are generated on demand using live data from{' '}
          {students.length} students and {teachers.length} teachers. Larger date
          ranges may take a few moments to process.
        </p>
      </SectionCard>
    </div>
  );
}
