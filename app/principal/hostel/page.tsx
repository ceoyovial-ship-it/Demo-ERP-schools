'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2,
  BedDouble,
  DoorOpen,
  Users,
  UserRound,
  Phone,
} from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '@/components/page-header';
import { StatCard } from '@/components/stat-card';
import { SectionCard } from '@/components/section-card';
import { DataTable, type Column } from '@/components/data-table';
import { ExportButtons } from '@/components/export-buttons';
import { StatusBadge } from '@/components/status-badge';
import { hostelRooms, hostelStudents } from '@/lib/erp-data';
import { type ExportColumn } from '@/lib/export-utils';
import { cn } from '@/lib/utils';

/* -------------------------------------------------------------------------- */
/*  Types & derived data                                                      */
/* -------------------------------------------------------------------------- */

type TabKey = 'rooms' | 'students' | 'wardens' | 'visitors';

interface HostelRoomRow {
  id: string;
  roomNumber: string;
  block: string;
  floor: number;
  capacity: number;
  occupied: number;
  status: string;
}

interface HostelStudentRow {
  id: string;
  studentName: string;
  admissionNumber: string;
  className: string;
  roomNumber: string;
  block: string;
  checkIn: string;
  warden: string;
  status: string;
}

interface WardenCard {
  id: string;
  name: string;
  block: string;
  roomsManaged: number;
  phone: string;
}

interface VisitorRow {
  id: string;
  visitorName: string;
  studentName: string;
  relationship: string;
  date: string;
  inTime: string;
  outTime: string | null;
  status: string;
}

/** Normalise hostelRooms into DataTable rows. */
const roomRows: HostelRoomRow[] = hostelRooms.map((r) => ({
  id: r.id,
  roomNumber: r.roomNumber,
  block: r.block,
  floor: r.floor,
  capacity: r.capacity,
  occupied: r.occupied,
  status: r.status,
}));

/** Normalise hostelStudents into DataTable rows. */
const studentRows: HostelStudentRow[] = hostelStudents.map((s) => ({
  id: s.id,
  studentName: s.studentName,
  admissionNumber: s.admissionNumber,
  className: s.class,
  roomNumber: s.roomNumber,
  block: s.block,
  checkIn: s.checkIn,
  warden: s.warden,
  status: s.status,
}));

/** Derive unique wardens from hostelRooms, counting rooms managed and assigned block. */
const wardenCards: WardenCard[] = (() => {
  const map = new Map<string, WardenCard>();
  hostelRooms.forEach((r, i) => {
    const existing = map.get(r.warden);
    if (existing) {
      existing.roomsManaged += 1;
    } else {
      map.set(r.warden, {
        id: `warden-${i}`,
        name: r.warden,
        block: r.block,
        roomsManaged: 1,
        phone: `+91 ${String(90000 + (i * 211) % 9999).slice(0, 5)} ${String((i * 3456) % 100000).slice(0, 5)}`,
      });
    }
  });
  return Array.from(map.values());
})();

/** Inline visitor log entries. */
const visitors: VisitorRow[] = [
  { id: 'vis-1', visitorName: 'Ramesh Sharma', studentName: 'Rahul Sharma', relationship: 'Father', date: '2025-07-13', inTime: '10:00 AM', outTime: '12:00 PM', status: 'checked-out' },
  { id: 'vis-2', visitorName: 'Lakshmi Nair', studentName: 'Arjun Nair', relationship: 'Mother', date: '2025-07-13', inTime: '02:00 PM', outTime: '05:00 PM', status: 'checked-out' },
  { id: 'vis-3', visitorName: 'Priya Reddy', studentName: 'Karthik Reddy', relationship: 'Sister', date: '2025-07-14', inTime: '09:00 AM', outTime: null, status: 'checked-in' },
  { id: 'vis-4', visitorName: 'Suresh Patel', studentName: 'Diya Patel', relationship: 'Father', date: '2025-07-14', inTime: '11:00 AM', outTime: null, status: 'checked-in' },
  { id: 'vis-5', visitorName: 'Geeta Singh', studentName: 'Vikram Singh', relationship: 'Aunt', date: '2025-07-12', inTime: '03:00 PM', outTime: '06:00 PM', status: 'checked-out' },
];

/** Aggregate stats computed from the dataset. */
const totalRooms = hostelRooms.length;
const occupiedRooms = hostelRooms.filter((r) => r.status === 'occupied').length;
const vacantRooms = totalRooms - occupiedRooms;
const totalHostelStudents = hostelStudents.length;

/* -------------------------------------------------------------------------- */
/*  Tab configuration                                                         */
/* -------------------------------------------------------------------------- */

const tabs: { key: TabKey; label: string; icon: typeof Building2 }[] = [
  { key: 'rooms', label: 'Rooms', icon: BedDouble },
  { key: 'students', label: 'Students', icon: Users },
  { key: 'wardens', label: 'Wardens', icon: UserRound },
  { key: 'visitors', label: 'Visitors', icon: DoorOpen },
];

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
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

function roomStatusVariant(status: string) {
  return status === 'occupied' ? 'default' : ('success' as const);
}

function studentStatusVariant(status: string) {
  if (status === 'present') return 'success' as const;
  if (status === 'on-leave') return 'warning' as const;
  return 'neutral' as const;
}

function visitorStatusVariant(status: string) {
  return status === 'checked-in' ? 'success' : ('neutral' as const);
}

const roomExportColumns: ExportColumn[] = [
  { key: 'roomNumber', label: 'Room Number' },
  { key: 'block', label: 'Block' },
  { key: 'floor', label: 'Floor' },
  { key: 'capacity', label: 'Capacity' },
  { key: 'occupied', label: 'Occupied' },
  { key: 'status', label: 'Status' },
];

const studentExportColumns: ExportColumn[] = [
  { key: 'studentName', label: 'Student Name' },
  { key: 'admissionNumber', label: 'Admission No' },
  { key: 'className', label: 'Class' },
  { key: 'roomNumber', label: 'Room Number' },
  { key: 'block', label: 'Block' },
  { key: 'checkIn', label: 'Check-in Date' },
  { key: 'warden', label: 'Warden' },
  { key: 'status', label: 'Status' },
];

const wardenExportColumns: ExportColumn[] = [
  { key: 'name', label: 'Warden Name' },
  { key: 'block', label: 'Block' },
  { key: 'roomsManaged', label: 'Rooms Managed' },
  { key: 'phone', label: 'Phone' },
];

const visitorExportColumns: ExportColumn[] = [
  { key: 'visitorName', label: 'Visitor Name' },
  { key: 'studentName', label: 'Visiting Student' },
  { key: 'relationship', label: 'Relationship' },
  { key: 'date', label: 'Date' },
  { key: 'inTime', label: 'In-Time' },
  { key: 'outTime', label: 'Out-Time' },
  { key: 'status', label: 'Status' },
];

/* -------------------------------------------------------------------------- */
/*  Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function HostelPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('rooms');

  const activeExportConfig = useMemo(() => {
    if (activeTab === 'students') {
      return {
        label: 'hostel students',
        data: studentRows as unknown as Record<string, unknown>[],
        columns: studentExportColumns,
        filename: 'hostel-students',
      };
    }

    if (activeTab === 'wardens') {
      return {
        label: 'hostel wardens',
        data: wardenCards as unknown as Record<string, unknown>[],
        columns: wardenExportColumns,
        filename: 'hostel-wardens',
      };
    }

    if (activeTab === 'visitors') {
      return {
        label: 'hostel visitors',
        data: visitors as unknown as Record<string, unknown>[],
        columns: visitorExportColumns,
        filename: 'hostel-visitors',
      };
    }

    return {
      label: 'hostel rooms',
      data: roomRows as unknown as Record<string, unknown>[],
      columns: roomExportColumns,
      filename: 'hostel-rooms',
    };
  }, [activeTab]);

  /* ------------------------------ Rooms columns ---------------------------- */
  const roomColumns: Column<HostelRoomRow>[] = useMemo(
    () => [
      {
        key: 'roomNumber',
        header: 'Room Number',
        sortable: true,
        render: (row) => (
          <span className="font-mono text-xs font-semibold text-primary">
            {row.roomNumber}
          </span>
        ),
        className: 'whitespace-nowrap',
      },
      {
        key: 'block',
        header: 'Block',
        sortable: true,
        render: (row) => (
          <span className="inline-flex items-center gap-1.5">
            <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="font-medium">{row.block}</span>
          </span>
        ),
        className: 'whitespace-nowrap',
      },
      {
        key: 'floor',
        header: 'Floor',
        sortable: true,
        render: (row) => (
          <span className="tabular-nums text-muted-foreground">{row.floor}</span>
        ),
        className: 'tabular-nums whitespace-nowrap',
      },
      {
        key: 'capacity',
        header: 'Capacity',
        sortable: true,
        render: (row) => (
          <span className="tabular-nums font-medium">{row.capacity}</span>
        ),
        className: 'tabular-nums whitespace-nowrap',
      },
      {
        key: 'occupied',
        header: 'Occupied',
        sortable: true,
        render: (row) => (
          <span
            className={cn(
              'tabular-nums font-medium',
              row.occupied >= row.capacity ? 'text-destructive' : 'text-primary'
            )}
          >
            {row.occupied}
          </span>
        ),
        className: 'tabular-nums whitespace-nowrap',
      },
      {
        key: 'status',
        header: 'Status',
        render: (row) => (
          <StatusBadge
            status={row.status === 'occupied' ? 'Occupied' : 'Vacant'}
            variant={roomStatusVariant(row.status)}
          />
        ),
        className: 'whitespace-nowrap',
      },
    ],
    []
  );

  /* ---------------------------- Students columns --------------------------- */
  const studentColumns: Column<HostelStudentRow>[] = useMemo(
    () => [
      {
        key: 'studentName',
        header: 'Student Name',
        sortable: true,
        render: (row) => <span className="font-medium">{row.studentName}</span>,
        className: 'min-w-[160px] whitespace-nowrap',
      },
      {
        key: 'admissionNumber',
        header: 'Admission No',
        sortable: true,
        render: (row) => (
          <span className="font-mono text-xs text-muted-foreground">
            {row.admissionNumber}
          </span>
        ),
        className: 'whitespace-nowrap',
      },
      {
        key: 'className',
        header: 'Class',
        sortable: true,
        render: (row) => (
          <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs font-medium">
            {row.className}
          </span>
        ),
        className: 'whitespace-nowrap',
      },
      {
        key: 'roomNumber',
        header: 'Room Number',
        sortable: true,
        render: (row) => (
          <span className="font-mono text-xs font-semibold text-primary">
            {row.roomNumber}
          </span>
        ),
        className: 'whitespace-nowrap',
      },
      {
        key: 'block',
        header: 'Block',
        sortable: true,
        render: (row) => (
          <span className="inline-flex items-center gap-1.5">
            <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="font-medium">{row.block}</span>
          </span>
        ),
        className: 'whitespace-nowrap',
      },
      {
        key: 'checkIn',
        header: 'Check-in Date',
        sortable: true,
        render: (row) => (
          <span className="tabular-nums text-muted-foreground">
            {formatDate(row.checkIn)}
          </span>
        ),
        className: 'whitespace-nowrap tabular-nums',
      },
      {
        key: 'warden',
        header: 'Warden',
        sortable: true,
        render: (row) => (
          <span className="text-muted-foreground">{row.warden}</span>
        ),
        className: 'whitespace-nowrap',
      },
      {
        key: 'status',
        header: 'Status',
        sortable: true,
        render: (row) => (
          <StatusBadge
            status={row.status === 'present' ? 'Present' : 'On Leave'}
            variant={studentStatusVariant(row.status)}
          />
        ),
        className: 'whitespace-nowrap',
      },
    ],
    []
  );

  /* ---------------------------- Visitors columns --------------------------- */
  const visitorColumns: Column<VisitorRow>[] = useMemo(
    () => [
      {
        key: 'visitorName',
        header: 'Visitor Name',
        sortable: true,
        render: (row) => <span className="font-medium">{row.visitorName}</span>,
        className: 'min-w-[150px] whitespace-nowrap',
      },
      {
        key: 'studentName',
        header: 'Visiting Student',
        sortable: true,
        render: (row) => (
          <span className="text-muted-foreground">{row.studentName}</span>
        ),
        className: 'whitespace-nowrap',
      },
      {
        key: 'relationship',
        header: 'Relationship',
        sortable: true,
        render: (row) => (
          <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
            {row.relationship}
          </span>
        ),
        className: 'whitespace-nowrap',
      },
      {
        key: 'date',
        header: 'Date',
        sortable: true,
        render: (row) => (
          <span className="tabular-nums text-muted-foreground">
            {formatDate(row.date)}
          </span>
        ),
        className: 'whitespace-nowrap tabular-nums',
      },
      {
        key: 'inTime',
        header: 'In-Time',
        sortable: true,
        render: (row) => (
          <span className="tabular-nums font-medium">{row.inTime}</span>
        ),
        className: 'whitespace-nowrap tabular-nums',
      },
      {
        key: 'outTime',
        header: 'Out-Time',
        sortable: true,
        render: (row) =>
          row.outTime ? (
            <span className="tabular-nums font-medium">{row.outTime}</span>
          ) : (
            <span className="text-muted-foreground">—</span>
          ),
        className: 'whitespace-nowrap tabular-nums',
      },
      {
        key: 'status',
        header: 'Status',
        sortable: true,
        render: (row) => (
          <StatusBadge
            status={row.status === 'checked-in' ? 'Checked In' : 'Checked Out'}
            variant={visitorStatusVariant(row.status)}
          />
        ),
        className: 'whitespace-nowrap',
      },
    ],
    []
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Hostel Management"
        description="Manage rooms, students, wardens, and visitors"
      >
        <ExportButtons
          label={activeExportConfig.label}
          data={activeExportConfig.data}
          columns={activeExportConfig.columns}
          filename={activeExportConfig.filename}
        />
      </PageHeader>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Rooms"
          value={totalRooms}
          icon={BedDouble}
          change={`${occupiedRooms} currently occupied`}
          changeType="neutral"
          description="All hostel rooms across blocks"
          delay={0}
        />
        <StatCard
          title="Occupied"
          value={occupiedRooms}
          icon={Building2}
          change={`${Math.round((occupiedRooms / totalRooms) * 100)}% occupancy`}
          changeType="positive"
          description="Rooms currently in use"
          delay={0.05}
        />
        <StatCard
          title="Vacant"
          value={vacantRooms}
          icon={DoorOpen}
          change={`${Math.round((vacantRooms / totalRooms) * 100)}% available`}
          changeType="neutral"
          description="Rooms ready for allocation"
          delay={0.1}
        />
        <StatCard
          title="Hostel Students"
          value={totalHostelStudents}
          icon={Users}
          change={`${wardenCards.length} wardens on duty`}
          changeType="positive"
          description="Students residing in hostel"
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
        {/* Rooms tab */}
        {activeTab === 'rooms' && (
          <motion.div
            key="rooms"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            <SectionCard
              title="Hostel Rooms"
              description="Complete room inventory with capacity and occupancy across blocks"
            >
              <DataTable
                data={roomRows}
                columns={roomColumns}
                pageSize={10}
                searchKeys={['roomNumber', 'block', 'status']}
                searchPlaceholder="Search rooms, blocks, status..."
                initialSort={{ key: 'roomNumber', dir: 'asc' }}
                onRowClick={(row) =>
                  toast.info(`Room ${row.roomNumber}`, {
                    description: `${row.block} · Floor ${row.floor} · ${row.occupied}/${row.capacity} occupied`,
                  })
                }
              />
            </SectionCard>
          </motion.div>
        )}

        {/* Students tab */}
        {activeTab === 'students' && (
          <motion.div
            key="students"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            <SectionCard
              title="Hostel Students"
              description="Students residing in the hostel with room assignments and wardens"
            >
              <DataTable
                data={studentRows}
                columns={studentColumns}
                pageSize={10}
                searchKeys={['studentName', 'admissionNumber', 'roomNumber', 'block', 'warden']}
                searchPlaceholder="Search students, rooms, wardens..."
                initialSort={{ key: 'studentName', dir: 'asc' }}
                onRowClick={(row) =>
                  toast.info(`${row.studentName}`, {
                    description: `Room ${row.roomNumber} · ${row.block} · Warden: ${row.warden}`,
                  })
                }
              />
            </SectionCard>
          </motion.div>
        )}

        {/* Wardens tab */}
        {activeTab === 'wardens' && (
          <motion.div
            key="wardens"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            <SectionCard
              title="Hostel Wardens"
              description="Wardens assigned to manage hostel blocks and rooms"
            >
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {wardenCards.map((warden, i) => (
                  <motion.div
                    key={warden.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.3,
                      delay: i * 0.05,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="rounded-xl border bg-card p-5 shadow-sm transition-colors hover:border-primary/40 hover:shadow-premium"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                          <UserRound className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold">{warden.name}</p>
                          <p className="text-xs text-muted-foreground">
                            Hostel Warden
                          </p>
                        </div>
                      </div>
                      <StatusBadge status="Active" variant="success" />
                    </div>

                    {/* Assignment details */}
                    <div className="mt-4 space-y-2.5 text-sm">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Block:</span>
                        <span className="font-medium">{warden.block}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BedDouble className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Rooms:</span>
                        <span className="font-medium tabular-nums">
                          {warden.roomsManaged}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          rooms managed
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Phone:</span>
                        <span className="font-medium tabular-nums">
                          {warden.phone}
                        </span>
                      </div>
                    </div>

                    {/* Contact button */}
                    <div className="mt-4 border-t pt-4">
                      <button
                        onClick={() =>
                          toast.success(`Calling ${warden.name}...`, {
                            description: `Connecting to ${warden.phone}`,
                          })
                        }
                        className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-input bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                      >
                        <Phone className="h-4 w-4" />
                        Contact Warden
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </SectionCard>
          </motion.div>
        )}

        {/* Visitors tab */}
        {activeTab === 'visitors' && (
          <motion.div
            key="visitors"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            <SectionCard
              title="Visitor Log"
              description="Recent visitor entries with check-in and check-out times"
            >
              <DataTable
                data={visitors}
                columns={visitorColumns}
                pageSize={10}
                searchKeys={['visitorName', 'studentName', 'relationship', 'status']}
                searchPlaceholder="Search visitors, students, relationship..."
                initialSort={{ key: 'date', dir: 'desc' }}
                onRowClick={(row) =>
                  toast.info(`${row.visitorName} → ${row.studentName}`, {
                    description: `${row.relationship} · ${formatDate(row.date)} · ${row.status === 'checked-in' ? 'Currently inside' : 'Checked out'}`,
                  })
                }
              />
            </SectionCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
