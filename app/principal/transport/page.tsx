'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bus,
  Route as RouteIcon,
  Users,
  Wallet,
  MapPin,
  Phone,
  Car,
  UserRound,
} from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '@/components/page-header';
import { StatCard } from '@/components/stat-card';
import { SectionCard } from '@/components/section-card';
import { DataTable, type Column } from '@/components/data-table';
import { ExportButtons } from '@/components/export-buttons';
import { StatusBadge } from '@/components/status-badge';
import { transportRoutes } from '@/lib/erp-data';
import { type ExportColumn } from '@/lib/export-utils';
import { cn } from '@/lib/utils';

/* -------------------------------------------------------------------------- */
/*  Types & derived data                                                      */
/* -------------------------------------------------------------------------- */

type TabKey = 'routes' | 'vehicles' | 'drivers';

interface TransportRoute {
  id: string;
  routeNumber: string;
  routeName: string;
  driver: string;
  vehicleNumber: string;
  capacity: number;
  allocated: number;
  stops: number;
  fare: number;
  status: string;
}

interface VehicleCard {
  id: string;
  vehicleNumber: string;
  routeName: string;
  routeNumber: string;
  capacity: number;
  allocated: number;
  utilization: number;
  status: string;
}

interface DriverCard {
  id: string;
  name: string;
  routeName: string;
  routeNumber: string;
  vehicleNumber: string;
  phone: string;
  status: string;
}

/** Normalise transportRoutes into DataTable rows. */
const routeRows: TransportRoute[] = transportRoutes.map((r) => ({
  id: r.id,
  routeNumber: r.routeNumber,
  routeName: r.routeName,
  driver: r.driver,
  vehicleNumber: r.vehicleNumber,
  capacity: r.capacity,
  allocated: r.allocated,
  stops: r.stops,
  fare: r.fare,
  status: r.status,
}));

/** Derive vehicle data from transportRoutes (one vehicle per route). */
const vehicleCards: VehicleCard[] = transportRoutes.map((r) => {
  const utilization = Math.round((r.allocated / r.capacity) * 100);
  return {
    id: `veh-${r.id}`,
    vehicleNumber: r.vehicleNumber,
    routeName: r.routeName,
    routeNumber: r.routeNumber,
    capacity: r.capacity,
    allocated: r.allocated,
    utilization,
    status: r.status,
  };
});

/** Derive driver data from transportRoutes (one driver per route). */
const driverCards: DriverCard[] = transportRoutes.map((r, i) => {
  const seed = i + 1;
  return {
    id: `drv-${r.id}`,
    name: r.driver,
    routeName: r.routeName,
    routeNumber: r.routeNumber,
    vehicleNumber: r.vehicleNumber,
    phone: `+91 ${String(90000 + (seed * 211) % 9999).slice(0, 5)} ${String((seed * 3456) % 100000).slice(0, 5)}`,
    status: seed % 9 === 0 ? 'on-leave' : 'active',
  };
});

/** Aggregate stats computed from the dataset. */
const totalAllocated = transportRoutes.reduce((acc, r) => acc + r.allocated, 0);
const monthlyRevenue = transportRoutes.reduce((acc, r) => acc + r.fare * r.allocated, 0);

/* -------------------------------------------------------------------------- */
/*  Tab configuration                                                         */
/* -------------------------------------------------------------------------- */

const tabs: { key: TabKey; label: string; icon: typeof RouteIcon }[] = [
  { key: 'routes', label: 'Routes', icon: RouteIcon },
  { key: 'vehicles', label: 'Vehicles', icon: Car },
  { key: 'drivers', label: 'Drivers', icon: UserRound },
];

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

function formatINR(amount: number): string {
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)}L`;
  }
  return `₹${amount.toLocaleString('en-IN')}`;
}

function utilizationVariant(util: number) {
  if (util >= 90) return 'destructive' as const;
  if (util >= 75) return 'warning' as const;
  return 'success' as const;
}

function utilizationBarColor(util: number): string {
  if (util >= 90) return 'bg-destructive';
  if (util >= 75) return 'bg-accent';
  return 'bg-success';
}

function driverStatusVariant(status: string) {
  if (status === 'active') return 'success' as const;
  if (status === 'on-leave') return 'warning' as const;
  return 'neutral' as const;
}

const routeExportColumns: ExportColumn[] = [
  { key: 'routeNumber', label: 'Route Number' },
  { key: 'routeName', label: 'Route Name' },
  { key: 'driver', label: 'Driver' },
  { key: 'vehicleNumber', label: 'Vehicle Number' },
  { key: 'capacity', label: 'Capacity' },
  { key: 'allocated', label: 'Allocated' },
  { key: 'stops', label: 'Stops' },
  { key: 'fare', label: 'Fare' },
  { key: 'status', label: 'Status' },
];

/* -------------------------------------------------------------------------- */
/*  Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function TransportPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('routes');

  const columns: Column<TransportRoute>[] = useMemo(
    () => [
      {
        key: 'routeNumber',
        header: 'Route Number',
        sortable: true,
        render: (row) => (
          <span className="font-semibold text-primary">{row.routeNumber}</span>
        ),
        className: 'whitespace-nowrap',
      },
      {
        key: 'routeName',
        header: 'Route Name',
        sortable: true,
        render: (row) => (
          <div className="flex items-center gap-2">
            <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="font-medium">{row.routeName}</span>
          </div>
        ),
        className: 'whitespace-nowrap',
      },
      {
        key: 'driver',
        header: 'Driver',
        sortable: true,
        render: (row) => <span className="text-muted-foreground">{row.driver}</span>,
        className: 'whitespace-nowrap',
      },
      {
        key: 'vehicleNumber',
        header: 'Vehicle Number',
        sortable: true,
        render: (row) => (
          <span className="font-mono text-xs font-medium">{row.vehicleNumber}</span>
        ),
        className: 'whitespace-nowrap',
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
        key: 'allocated',
        header: 'Allocated',
        sortable: true,
        render: (row) => (
          <span className="tabular-nums font-medium text-primary">{row.allocated}</span>
        ),
        className: 'tabular-nums whitespace-nowrap',
      },
      {
        key: 'stops',
        header: 'Stops',
        sortable: true,
        render: (row) => (
          <span className="tabular-nums text-muted-foreground">{row.stops}</span>
        ),
        className: 'tabular-nums whitespace-nowrap',
      },
      {
        key: 'fare',
        header: 'Fare',
        sortable: true,
        render: (row) => (
          <span className="tabular-nums font-medium">{formatINR(row.fare)}</span>
        ),
        className: 'tabular-nums whitespace-nowrap',
      },
      {
        key: 'status',
        header: 'Status',
        render: (row) => (
          <StatusBadge
            status={row.status === 'active' ? 'Active' : 'Inactive'}
            variant={row.status === 'active' ? 'success' : 'neutral'}
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
        title="Transport Management"
        description="Manage vehicles, routes, drivers, and student allocation"
      >
        <ExportButtons
          label="transport data"
          data={routeRows as unknown as Record<string, unknown>[]}
          columns={routeExportColumns}
          filename="transport-routes"
        />
      </PageHeader>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Routes"
          value={transportRoutes.length}
          icon={RouteIcon}
          change="All active"
          changeType="positive"
          description="Operational transport routes"
          delay={0}
        />
        <StatCard
          title="Total Vehicles"
          value={vehicleCards.length}
          icon={Bus}
          change="100% operational"
          changeType="positive"
          description="Buses in the fleet"
          delay={0.05}
        />
        <StatCard
          title="Students Allocated"
          value={totalAllocated}
          icon={Users}
          change={`${transportRoutes.length} routes covered`}
          changeType="neutral"
          description="Students using transport"
          delay={0.1}
        />
        <StatCard
          title="Monthly Revenue"
          value={formatINR(monthlyRevenue)}
          icon={Wallet}
          change="+8.2% vs last month"
          changeType="positive"
          description="From transport fees"
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
                  ? 'text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {isActive && (
                <motion.span
                  layoutId="transport-tab-indicator"
                  className="absolute inset-0 rounded-lg bg-primary"
                  transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                />
              )}
              <TabIcon className="relative z-10 h-4 w-4" />
              <span className="relative z-10">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        {/* Routes tab */}
        {activeTab === 'routes' && (
          <motion.div
            key="routes"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            <SectionCard
              title="Transport Routes"
              description="Complete list of routes with driver, vehicle, capacity and fare details"
            >
              <DataTable
                data={routeRows}
                columns={columns}
                pageSize={10}
                searchKeys={['routeNumber', 'routeName', 'driver', 'vehicleNumber']}
                searchPlaceholder="Search routes, drivers, vehicles..."
                initialSort={{ key: 'routeNumber', dir: 'asc' }}
                onRowClick={(row) =>
                  toast.info(`Route ${row.routeNumber} — ${row.routeName}`, {
                    description: `${row.allocated}/${row.capacity} seats allocated · ${row.stops} stops`,
                  })
                }
              />
            </SectionCard>
          </motion.div>
        )}

        {/* Vehicles tab */}
        {activeTab === 'vehicles' && (
          <motion.div
            key="vehicles"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            <SectionCard
              title="Vehicle Fleet"
              description="Capacity utilization across all transport vehicles"
            >
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {vehicleCards.map((vehicle, i) => (
                  <motion.div
                    key={vehicle.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.3,
                      delay: i * 0.04,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="rounded-xl border bg-card p-5 shadow-sm transition-colors hover:border-primary/40 hover:shadow-premium"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                          <Bus className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-mono text-sm font-semibold tracking-tight">
                            {vehicle.vehicleNumber}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {vehicle.routeName}
                          </p>
                        </div>
                      </div>
                      <StatusBadge
                        status={vehicle.status === 'active' ? 'Active' : 'Inactive'}
                        variant={vehicle.status === 'active' ? 'success' : 'neutral'}
                      />
                    </div>

                    {/* Capacity utilization */}
                    <div className="mt-5 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-muted-foreground">
                          Capacity Utilization
                        </span>
                        <span className="font-semibold tabular-nums">
                          {vehicle.allocated}/{vehicle.capacity}
                        </span>
                      </div>
                      <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${vehicle.utilization}%` }}
                          transition={{
                            duration: 0.6,
                            delay: i * 0.04 + 0.15,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                          className={cn(
                            'h-full rounded-full',
                            utilizationBarColor(vehicle.utilization)
                          )}
                        />
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">
                          Route {vehicle.routeNumber}
                        </span>
                        <span
                          className={cn(
                            'font-medium tabular-nums',
                            vehicle.utilization >= 90
                              ? 'text-destructive'
                              : vehicle.utilization >= 75
                                ? 'text-accent-foreground'
                                : 'text-success'
                          )}
                        >
                          {vehicle.utilization}% utilized
                        </span>
                      </div>
                    </div>

                    {/* Footer stats */}
                    <div className="mt-4 grid grid-cols-2 gap-3 border-t pt-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Total Seats</p>
                        <p className="text-sm font-semibold tabular-nums">
                          {vehicle.capacity}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Available</p>
                        <p className="text-sm font-semibold tabular-nums text-success">
                          {vehicle.capacity - vehicle.allocated}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </SectionCard>
          </motion.div>
        )}

        {/* Drivers tab */}
        {activeTab === 'drivers' && (
          <motion.div
            key="drivers"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            <SectionCard
              title="Drivers"
              description="Driver assignments across routes and vehicles"
            >
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {driverCards.map((driver, i) => (
                  <motion.div
                    key={driver.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.3,
                      delay: i * 0.04,
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
                          <p className="text-sm font-semibold">{driver.name}</p>
                          <p className="text-xs text-muted-foreground">
                            Driver ID: {driver.id.toUpperCase()}
                          </p>
                        </div>
                      </div>
                      <StatusBadge
                        status={driver.status === 'active' ? 'Active' : 'On Leave'}
                        variant={driverStatusVariant(driver.status)}
                      />
                    </div>

                    {/* Assignment details */}
                    <div className="mt-4 space-y-2.5 text-sm">
                      <div className="flex items-center gap-2">
                        <RouteIcon className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Route:</span>
                        <span className="font-medium">
                          {driver.routeNumber} — {driver.routeName}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Car className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Vehicle:</span>
                        <span className="font-mono text-xs font-medium">
                          {driver.vehicleNumber}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Phone:</span>
                        <span className="font-medium tabular-nums">
                          {driver.phone}
                        </span>
                      </div>
                    </div>

                    {/* Contact button */}
                    <div className="mt-4 border-t pt-4">
                      <button
                        onClick={() =>
                          toast.success(`Calling ${driver.name}...`, {
                            description: `Connecting to ${driver.phone}`,
                          })
                        }
                        disabled={driver.status !== 'active'}
                        className={cn(
                          'inline-flex w-full items-center justify-center gap-2 rounded-lg border border-input bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
                          driver.status !== 'active' &&
                            'cursor-not-allowed opacity-50 hover:bg-transparent hover:text-current'
                        )}
                      >
                        <Phone className="h-4 w-4" />
                        Contact Driver
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </SectionCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
