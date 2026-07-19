'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings,
  Building2,
  Palette,
  Calendar,
  Shield,
  Lock,
  Plug,
  Save,
  Upload,
  Check,
  X,
  Plus,
  Database,
  CreditCard,
  MessageSquare,
  Mail,
  FileText,
  Sun,
  Moon,
  Monitor,
  type LucideIcon,
} from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '@/components/page-header';
import { SectionCard } from '@/components/section-card';
import { StatusBadge } from '@/components/status-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { schoolInfo } from '@/lib/erp-data';
import { cn } from '@/lib/utils';

/* -------------------------------------------------------------------------- */
/*  Types                                                                      */
/* -------------------------------------------------------------------------- */

type TabKey =
  | 'school-info'
  | 'branding'
  | 'academic-year'
  | 'roles'
  | 'security'
  | 'integrations';

type ThemePreference = 'light' | 'dark' | 'system';

interface AcademicYear {
  id: string;
  year: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'previous';
}

interface Role {
  id: string;
  role: string;
  permissions: number;
  users: number;
  description: string;
}

interface Integration {
  id: string;
  name: string;
  description: string;
  status: 'connected' | 'disconnected';
  icon: LucideIcon;
}

/* -------------------------------------------------------------------------- */
/*  Inline data                                                                */
/* -------------------------------------------------------------------------- */

const academicYears: AcademicYear[] = [
  {
    id: 'ay-1',
    year: '2025-26',
    startDate: '2025-06-01',
    endDate: '2026-04-30',
    status: 'active',
  },
  {
    id: 'ay-2',
    year: '2024-25',
    startDate: '2024-06-01',
    endDate: '2025-04-30',
    status: 'previous',
  },
  {
    id: 'ay-3',
    year: '2023-24',
    startDate: '2023-06-01',
    endDate: '2024-04-30',
    status: 'previous',
  },
];

const roles: Role[] = [
  {
    id: 'r-1',
    role: 'Principal',
    permissions: 48,
    users: 1,
    description: 'Full system access',
  },
  {
    id: 'r-2',
    role: 'Receptionist',
    permissions: 24,
    users: 2,
    description: 'Admissions, fees, students',
  },
  {
    id: 'r-3',
    role: 'Teacher',
    permissions: 18,
    users: 40,
    description: 'Attendance, marks, homework',
  },
  {
    id: 'r-4',
    role: 'Student',
    permissions: 8,
    users: 948,
    description: 'View own data',
  },
  {
    id: 'r-5',
    role: 'Parent',
    permissions: 10,
    users: 500,
    description: 'View child data',
  },
];

const integrations: Integration[] = [
  {
    id: 'int-1',
    name: 'Supabase',
    description: 'Database & Authentication',
    status: 'connected',
    icon: Database,
  },
  {
    id: 'int-2',
    name: 'Stripe',
    description: 'Online Fee Payments',
    status: 'connected',
    icon: CreditCard,
  },
  {
    id: 'int-3',
    name: 'SMS Gateway',
    description: 'Bulk SMS Service',
    status: 'disconnected',
    icon: MessageSquare,
  },
  {
    id: 'int-4',
    name: 'Email Service',
    description: 'Transactional Emails',
    status: 'connected',
    icon: Mail,
  },
  {
    id: 'int-5',
    name: 'Google Workspace',
    description: 'Calendar & Email',
    status: 'disconnected',
    icon: Calendar,
  },
  {
    id: 'int-6',
    name: 'Microsoft 365',
    description: 'Office Suite Integration',
    status: 'disconnected',
    icon: FileText,
  },
];

/* -------------------------------------------------------------------------- */
/*  Tab configuration                                                          */
/* -------------------------------------------------------------------------- */

const tabs: { key: TabKey; label: string; icon: LucideIcon }[] = [
  { key: 'school-info', label: 'School Info', icon: Building2 },
  { key: 'branding', label: 'Branding', icon: Palette },
  { key: 'academic-year', label: 'Academic Year', icon: Calendar },
  { key: 'roles', label: 'Roles & Permissions', icon: Shield },
  { key: 'security', label: 'Security', icon: Lock },
  { key: 'integrations', label: 'Integrations', icon: Plug },
];

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                    */
/* -------------------------------------------------------------------------- */

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

/** Brand color swatches tied to the theme tokens. */
const brandColors: { name: string; token: string }[] = [
  { name: 'Primary', token: 'bg-primary' },
  { name: 'Accent', token: 'bg-accent' },
  { name: 'Success', token: 'bg-success' },
  { name: 'Warning', token: 'bg-warning' },
  { name: 'Destructive', token: 'bg-destructive' },
];

/* -------------------------------------------------------------------------- */
/*  Page                                                                        */
/* -------------------------------------------------------------------------- */

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('school-info');

  /* --------------------------- School Info form -------------------------- */
  const [schoolForm, setSchoolForm] = useState({
    name: schoolInfo.name,
    established: schoolInfo.established,
    affiliation: schoolInfo.affiliation,
    address: schoolInfo.address,
    phone: schoolInfo.phone,
    email: schoolInfo.email,
    website: schoolInfo.website,
    principal: schoolInfo.principal,
  });

  const handleSchoolInfoSave = () => {
    toast.success('School information saved', {
      description: 'Your changes have been applied to the school profile.',
    });
  };

  /* ------------------------------ Branding -------------------------------- */
  const [theme, setTheme] = useState<ThemePreference>('system');

  const handleBrandingSave = () => {
    toast.success('Branding saved', {
      description: `Theme set to ${theme}. Logo and color preferences updated.`,
    });
  };

  /* --------------------------- Academic Year ----------------------------- */
  const handleAddAcademicYear = () => {
    toast.info('Add Academic Year', {
      description: 'A form to configure a new academic year will open here.',
    });
  };

  /* -------------------------------- Roles --------------------------------- */
  const handleManageRole = (role: Role) => {
    toast.info(`Manage ${role.role}`, {
      description: `${role.permissions} permissions • ${role.users} user${role.users > 1 ? 's' : ''} assigned`,
    });
  };

  /* ------------------------------ Security -------------------------------- */
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [requireUppercase, setRequireUppercase] = useState(true);
  const [requireNumbers, setRequireNumbers] = useState(true);
  const [requireSymbols, setRequireSymbols] = useState(true);
  const [passwordMinLength, setPasswordMinLength] = useState('8');
  const [sessionTimeout, setSessionTimeout] = useState('30');
  const [ipWhitelist, setIpWhitelist] = useState('');

  const handleSecuritySave = () => {
    toast.success('Security settings saved', {
      description: 'Password policy, 2FA, and session rules updated.',
    });
  };

  /* ---------------------------- Integrations ------------------------------ */
  const [integrationState, setIntegrationState] =
    useState<Integration[]>(integrations);

  const handleToggleIntegration = (integration: Integration) => {
    const nextStatus =
      integration.status === 'connected' ? 'disconnected' : 'connected';
    setIntegrationState((prev) =>
      prev.map((i) =>
        i.id === integration.id ? { ...i, status: nextStatus } : i
      )
    );
    if (nextStatus === 'connected') {
      toast.success(`${integration.name} connected`, {
        description: integration.description,
      });
    } else {
      toast.error(`${integration.name} disconnected`, {
        description: 'The integration has been disabled.',
      });
    }
  };

  /* ------------------------------------------------------------------------ */
  /*  Render                                                                    */
  /* ------------------------------------------------------------------------ */

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Settings"
        description="Configure school information, branding, and system preferences"
      />

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
        {/* ------------------------------ School Info ------------------------------ */}
        {activeTab === 'school-info' && (
          <motion.div
            key="school-info"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            <SectionCard
              title="School Information"
              description="Basic details about your institution shown across the portal"
            >
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label
                    htmlFor="school-name"
                    className="text-sm font-medium text-foreground"
                  >
                    School Name
                  </label>
                  <Input
                    id="school-name"
                    value={schoolForm.name}
                    onChange={(e) =>
                      setSchoolForm((s) => ({ ...s, name: e.target.value }))
                    }
                    placeholder="Enter school name"
                  />
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="established"
                    className="text-sm font-medium text-foreground"
                  >
                    Established Year
                  </label>
                  <Input
                    id="established"
                    value={schoolForm.established}
                    onChange={(e) =>
                      setSchoolForm((s) => ({
                        ...s,
                        established: e.target.value,
                      }))
                    }
                    placeholder="e.g. 2005"
                  />
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="affiliation"
                    className="text-sm font-medium text-foreground"
                  >
                    Affiliation
                  </label>
                  <Input
                    id="affiliation"
                    value={schoolForm.affiliation}
                    onChange={(e) =>
                      setSchoolForm((s) => ({
                        ...s,
                        affiliation: e.target.value,
                      }))
                    }
                    placeholder="e.g. CBSE"
                  />
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="principal"
                    className="text-sm font-medium text-foreground"
                  >
                    Principal Name
                  </label>
                  <Input
                    id="principal"
                    value={schoolForm.principal}
                    onChange={(e) =>
                      setSchoolForm((s) => ({
                        ...s,
                        principal: e.target.value,
                      }))
                    }
                    placeholder="Enter principal name"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label
                    htmlFor="address"
                    className="text-sm font-medium text-foreground"
                  >
                    Address
                  </label>
                  <Textarea
                    id="address"
                    value={schoolForm.address}
                    onChange={(e) =>
                      setSchoolForm((s) => ({ ...s, address: e.target.value }))
                    }
                    placeholder="Enter full school address"
                    className="min-h-[72px]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="phone"
                    className="text-sm font-medium text-foreground"
                  >
                    Phone
                  </label>
                  <Input
                    id="phone"
                    value={schoolForm.phone}
                    onChange={(e) =>
                      setSchoolForm((s) => ({ ...s, phone: e.target.value }))
                    }
                    placeholder="Enter phone number"
                  />
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="email"
                    className="text-sm font-medium text-foreground"
                  >
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={schoolForm.email}
                    onChange={(e) =>
                      setSchoolForm((s) => ({ ...s, email: e.target.value }))
                    }
                    placeholder="Enter email address"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label
                    htmlFor="website"
                    className="text-sm font-medium text-foreground"
                  >
                    Website
                  </label>
                  <Input
                    id="website"
                    value={schoolForm.website}
                    onChange={(e) =>
                      setSchoolForm((s) => ({ ...s, website: e.target.value }))
                    }
                    placeholder="Enter website URL"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <Button onClick={handleSchoolInfoSave}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </SectionCard>
          </motion.div>
        )}

        {/* ------------------------------- Branding ------------------------------- */}
        {activeTab === 'branding' && (
          <motion.div
            key="branding"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            <SectionCard
              title="Branding"
              description="Customize your school logo, colors, and theme preference"
            >
              <div className="space-y-8">
                {/* Logo upload */}
                <div>
                  <h3 className="text-sm font-semibold text-foreground">
                    School Logo
                  </h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Upload a PNG or SVG up to 1MB. Recommended size 240×240px.
                  </p>
                  <div className="mt-3">
                    <button
                      type="button"
                      onClick={() =>
                        toast.info('Logo upload', {
                          description:
                            'File picker would open here to select a logo image.',
                        })
                      }
                      className="flex h-40 w-full max-w-xs flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-input bg-muted/40 text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                    >
                      <Upload className="h-8 w-8" />
                      <span className="text-sm font-medium">
                        Click to upload logo
                      </span>
                      <span className="text-xs">PNG or SVG, max 1MB</span>
                    </button>
                  </div>
                </div>

                {/* School colors */}
                <div>
                  <h3 className="text-sm font-semibold text-foreground">
                    School Colors
                  </h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Current theme palette applied across the portal.
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-4">
                    {brandColors.map((color) => (
                      <div
                        key={color.name}
                        className="flex flex-col items-center gap-1.5"
                      >
                        <div
                          className={cn(
                            'h-12 w-12 rounded-lg border border-border shadow-sm',
                            color.token
                          )}
                        />
                        <span className="text-xs font-medium text-muted-foreground">
                          {color.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Theme options */}
                <div>
                  <h3 className="text-sm font-semibold text-foreground">
                    Theme
                  </h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Choose how the portal appears to users.
                  </p>
                  <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {(
                      [
                        { value: 'light', label: 'Light', icon: Sun },
                        { value: 'dark', label: 'Dark', icon: Moon },
                        { value: 'system', label: 'System', icon: Monitor },
                      ] as {
                        value: ThemePreference;
                        label: string;
                        icon: LucideIcon;
                      }[]
                    ).map((option) => {
                      const OptionIcon = option.icon;
                      const isActive = theme === option.value;
                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setTheme(option.value)}
                          className={cn(
                            'flex items-center gap-3 rounded-xl border p-4 text-left transition-colors',
                            isActive
                              ? 'border-primary bg-primary/5 ring-1 ring-primary'
                              : 'border-input hover:bg-muted/40'
                          )}
                        >
                          <div
                            className={cn(
                              'flex h-9 w-9 items-center justify-center rounded-full border',
                              isActive
                                ? 'border-primary bg-primary text-primary-foreground'
                                : 'border-border bg-muted text-muted-foreground'
                            )}
                          >
                            {isActive ? (
                              <Check className="h-4 w-4" />
                            ) : (
                              <OptionIcon className="h-4 w-4" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">
                              {option.label}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {option.value === 'system'
                                ? 'Match device setting'
                                : `${option.label} appearance`}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleBrandingSave}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Branding
                  </Button>
                </div>
              </div>
            </SectionCard>
          </motion.div>
        )}

        {/* ----------------------------- Academic Year ---------------------------- */}
        {activeTab === 'academic-year' && (
          <motion.div
            key="academic-year"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            <SectionCard
              title="Academic Years"
              description="Manage academic sessions and set the active year"
            >
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {academicYears.length} academic years configured
                </p>
                <Button onClick={handleAddAcademicYear}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Academic Year
                </Button>
              </div>

              <div className="overflow-x-auto rounded-lg border">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr className="border-b text-left">
                      <th className="px-4 py-3 font-medium text-muted-foreground">
                        Year
                      </th>
                      <th className="px-4 py-3 font-medium text-muted-foreground">
                        Start Date
                      </th>
                      <th className="px-4 py-3 font-medium text-muted-foreground">
                        End Date
                      </th>
                      <th className="px-4 py-3 font-medium text-muted-foreground">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {academicYears.map((ay) => (
                      <tr
                        key={ay.id}
                        className="border-b last:border-0 transition-colors hover:bg-muted/30"
                      >
                        <td className="whitespace-nowrap px-4 py-3 font-medium">
                          {ay.year}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                          {formatDate(ay.startDate)}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                          {formatDate(ay.endDate)}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3">
                          <StatusBadge
                            status={ay.status}
                            variant={
                              ay.status === 'active' ? 'success' : 'neutral'
                            }
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </SectionCard>
          </motion.div>
        )}

        {/* -------------------------- Roles & Permissions ------------------------- */}
        {activeTab === 'roles' && (
          <motion.div
            key="roles"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            <SectionCard
              title="Roles & Permissions"
              description="Define what each role can access and manage within the portal"
            >
              <div className="overflow-x-auto rounded-lg border">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr className="border-b text-left">
                      <th className="px-4 py-3 font-medium text-muted-foreground">
                        Role
                      </th>
                      <th className="px-4 py-3 font-medium text-muted-foreground">
                        Description
                      </th>
                      <th className="px-4 py-3 font-medium text-muted-foreground">
                        Permissions
                      </th>
                      <th className="px-4 py-3 font-medium text-muted-foreground">
                        Users
                      </th>
                      <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {roles.map((role) => (
                      <tr
                        key={role.id}
                        className="border-b last:border-0 transition-colors hover:bg-muted/30"
                      >
                        <td className="whitespace-nowrap px-4 py-3 font-medium">
                          {role.role}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {role.description}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3">
                          <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                            {role.permissions} permissions
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 tabular-nums text-muted-foreground">
                          {role.users.toLocaleString('en-IN')}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleManageRole(role)}
                          >
                            Manage
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </SectionCard>
          </motion.div>
        )}

        {/* ------------------------------- Security ------------------------------- */}
        {activeTab === 'security' && (
          <motion.div
            key="security"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            {/* Password Policy */}
            <SectionCard
              title="Password Policy"
              description="Define minimum requirements for user passwords"
              delay={0}
            >
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label
                    htmlFor="password-min-length"
                    className="text-sm font-medium text-foreground"
                  >
                    Minimum Length
                  </label>
                  <Input
                    id="password-min-length"
                    type="number"
                    min={6}
                    max={32}
                    value={passwordMinLength}
                    onChange={(e) => setPasswordMinLength(e.target.value)}
                  />
                </div>
                <div className="space-y-2 sm:pt-6">
                  <p className="text-sm font-medium text-foreground">
                    Complexity Requirements
                  </p>
                  {[
                    {
                      label: 'Require uppercase letter',
                      value: requireUppercase,
                      set: setRequireUppercase,
                    },
                    {
                      label: 'Require numbers',
                      value: requireNumbers,
                      set: setRequireNumbers,
                    },
                    {
                      label: 'Require symbols',
                      value: requireSymbols,
                      set: setRequireSymbols,
                    },
                  ].map((req) => (
                    <button
                      key={req.label}
                      type="button"
                      onClick={() => req.set(!req.value)}
                      className="flex w-full items-center justify-between rounded-lg border border-input px-3 py-2 text-sm transition-colors hover:bg-muted/40"
                    >
                      <span className="text-muted-foreground">{req.label}</span>
                      <span
                        className={cn(
                          'flex h-5 w-9 items-center rounded-full p-0.5 transition-colors',
                          req.value ? 'bg-primary' : 'bg-muted'
                        )}
                      >
                        <span
                          className={cn(
                            'h-4 w-4 rounded-full bg-white shadow-sm transition-transform',
                            req.value ? 'translate-x-4' : 'translate-x-0'
                          )}
                        />
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </SectionCard>

            {/* Two-Factor Authentication */}
            <SectionCard
              title="Two-Factor Authentication"
              description="Add an extra layer of security for staff logins"
              delay={0.05}
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Lock className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Require 2FA for staff
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Force all staff accounts to enable two-factor
                      authentication on next sign-in.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setTwoFactorEnabled((v) => !v)}
                  className={cn(
                    'flex h-7 w-12 shrink-0 items-center rounded-full p-1 transition-colors',
                    twoFactorEnabled ? 'bg-primary' : 'bg-muted'
                  )}
                  aria-pressed={twoFactorEnabled}
                  aria-label="Toggle two-factor authentication"
                >
                  <span
                    className={cn(
                      'h-5 w-5 rounded-full bg-white shadow-sm transition-transform',
                      twoFactorEnabled ? 'translate-x-5' : 'translate-x-0'
                    )}
                  />
                </button>
              </div>
              <div className="mt-3">
                <StatusBadge
                  status={twoFactorEnabled ? 'Enabled' : 'Disabled'}
                  variant={twoFactorEnabled ? 'success' : 'neutral'}
                />
              </div>
            </SectionCard>

            {/* Session Timeout */}
            <SectionCard
              title="Session Timeout"
              description="Automatically sign out idle users after a period of inactivity"
              delay={0.1}
            >
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label
                    htmlFor="session-timeout"
                    className="text-sm font-medium text-foreground"
                  >
                    Timeout (minutes)
                  </label>
                  <Input
                    id="session-timeout"
                    type="number"
                    min={5}
                    max={240}
                    value={sessionTimeout}
                    onChange={(e) => setSessionTimeout(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Users will be signed out after {sessionTimeout} minutes of
                    inactivity.
                  </p>
                </div>
              </div>
            </SectionCard>

            {/* IP Whitelist */}
            <SectionCard
              title="IP Whitelist"
              description="Restrict portal access to approved IP addresses"
              delay={0.15}
            >
              <div className="space-y-1.5">
                <label
                  htmlFor="ip-whitelist"
                  className="text-sm font-medium text-foreground"
                >
                  Allowed IP Addresses
                </label>
                <Textarea
                  id="ip-whitelist"
                  value={ipWhitelist}
                  onChange={(e) => setIpWhitelist(e.target.value)}
                  placeholder="Enter one IP per line, e.g. 192.168.1.1"
                  className="min-h-[96px] font-mono text-xs"
                />
                <p className="text-xs text-muted-foreground">
                  Leave empty to allow access from any IP address.
                </p>
              </div>
            </SectionCard>

            <div className="flex justify-end">
              <Button onClick={handleSecuritySave}>
                <Save className="mr-2 h-4 w-4" />
                Save Security Settings
              </Button>
            </div>
          </motion.div>
        )}

        {/* ----------------------------- Integrations ------------------------------ */}
        {activeTab === 'integrations' && (
          <motion.div
            key="integrations"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            <SectionCard
              title="Integrations"
              description="Connect third-party services to extend the portal's capabilities"
            >
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {integrationState.map((integration, idx) => {
                  const Icon = integration.icon;
                  const isConnected = integration.status === 'connected';
                  return (
                    <motion.div
                      key={integration.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25, delay: idx * 0.04 }}
                      className="flex flex-col rounded-xl border bg-card p-5 shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <Icon className="h-5 w-5" />
                        </div>
                        <StatusBadge
                          status={integration.status}
                          variant={isConnected ? 'success' : 'neutral'}
                        />
                      </div>

                      <div className="mt-4 flex-1">
                        <h3 className="text-sm font-semibold text-foreground">
                          {integration.name}
                        </h3>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {integration.description}
                        </p>
                      </div>

                      <div className="mt-4">
                        {isConnected ? (
                          <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => handleToggleIntegration(integration)}
                          >
                            <X className="mr-2 h-4 w-4" />
                            Disconnect
                          </Button>
                        ) : (
                          <Button
                            className="w-full"
                            onClick={() => handleToggleIntegration(integration)}
                          >
                            <Plug className="mr-2 h-4 w-4" />
                            Connect
                          </Button>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </SectionCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
