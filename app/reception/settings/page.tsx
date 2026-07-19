'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Building2,
  CalendarRange,
  Mail,
  Phone,
  Save,
  RefreshCcw,
  Bell,
  Palette,
  Globe,
  Clock3,
} from 'lucide-react';
import { toast } from 'sonner';

import { PageHeader } from '@/components/page-header';
import { SectionCard } from '@/components/section-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { schoolInfo } from '@/lib/erp-data';

const selectClass =
  'h-10 rounded-lg border border-input bg-background px-3 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-primary';

export default function ReceptionSettingsPage() {
  const [schoolForm, setSchoolForm] = useState({
    schoolName: schoolInfo.name,
    academicYear: schoolInfo.academicYear,
    address: schoolInfo.address,
    phone: schoolInfo.phone,
    email: schoolInfo.email,
  });

  const [receptionSettings, setReceptionSettings] = useState({
    officeHours: '8:30 AM - 4:30 PM',
    admissionSettings: 'Auto verify new admission forms',
    appointmentSettings: 'Allow parent walk-ins every afternoon',
  });

  const [notificationSettings, setNotificationSettings] = useState({
    sms: true,
    email: true,
    whatsapp: true,
  });

  const [userPreferences, setUserPreferences] = useState({
    theme: 'system',
    language: 'English',
    timeZone: 'Asia/Kolkata',
  });

  const handleSave = () => {
    toast.success('School settings saved', {
      description: 'Reception settings and preferences have been updated successfully.',
    });
  };

  const handleReset = () => {
    setSchoolForm({
      schoolName: schoolInfo.name,
      academicYear: schoolInfo.academicYear,
      address: schoolInfo.address,
      phone: schoolInfo.phone,
      email: schoolInfo.email,
    });
    setReceptionSettings({
      officeHours: '8:30 AM - 4:30 PM',
      admissionSettings: 'Auto verify new admission forms',
      appointmentSettings: 'Allow parent walk-ins every afternoon',
    });
    setNotificationSettings({
      sms: true,
      email: true,
      whatsapp: true,
    });
    setUserPreferences({
      theme: 'system',
      language: 'English',
      timeZone: 'Asia/Kolkata',
    });
    toast.info('Changes reset', {
      description: 'All school settings have been restored to their defaults.',
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="School Settings"
        description="Manage school information, reception preferences, notifications, and user preferences"
      />

      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        <SectionCard
          title="School Information"
          description="Core institutional details visible to the receptionist portal"
          delay={0.05}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="schoolName" className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                School Name
              </Label>
              <Input
                id="schoolName"
                value={schoolForm.schoolName}
                onChange={(e) =>
                  setSchoolForm((prev) => ({ ...prev, schoolName: e.target.value }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="academicYear" className="flex items-center gap-2">
                <CalendarRange className="h-4 w-4 text-muted-foreground" />
                Academic Year
              </Label>
              <Input
                id="academicYear"
                value={schoolForm.academicYear}
                onChange={(e) =>
                  setSchoolForm((prev) => ({ ...prev, academicYear: e.target.value }))
                }
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={schoolForm.address}
                onChange={(e) =>
                  setSchoolForm((prev) => ({ ...prev, address: e.target.value }))
                }
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                Phone
              </Label>
              <Input
                id="phone"
                value={schoolForm.phone}
                onChange={(e) =>
                  setSchoolForm((prev) => ({ ...prev, phone: e.target.value }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                Email
              </Label>
              <Input
                id="email"
                value={schoolForm.email}
                onChange={(e) =>
                  setSchoolForm((prev) => ({ ...prev, email: e.target.value }))
                }
              />
            </div>
          </div>
        </SectionCard>

        <SectionCard
          title="Reception Settings"
          description="Configure daily front-office operations"
          delay={0.1}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="officeHours" className="flex items-center gap-2">
                <Clock3 className="h-4 w-4 text-muted-foreground" />
                Office Hours
              </Label>
              <Input
                id="officeHours"
                value={receptionSettings.officeHours}
                onChange={(e) =>
                  setReceptionSettings((prev) => ({ ...prev, officeHours: e.target.value }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="admissionSettings">Admission Settings</Label>
              <Input
                id="admissionSettings"
                value={receptionSettings.admissionSettings}
                onChange={(e) =>
                  setReceptionSettings((prev) => ({ ...prev, admissionSettings: e.target.value }))
                }
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="appointmentSettings">Appointment Settings</Label>
              <Input
                id="appointmentSettings"
                value={receptionSettings.appointmentSettings}
                onChange={(e) =>
                  setReceptionSettings((prev) => ({ ...prev, appointmentSettings: e.target.value }))
                }
              />
            </div>
          </div>
        </SectionCard>

        <SectionCard
          title="Notification Settings"
          description="Choose how alerts should be delivered"
          delay={0.15}
        >
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { key: 'sms', label: 'SMS' },
              { key: 'email', label: 'Email' },
              { key: 'whatsapp', label: 'WhatsApp' },
            ].map((item) => (
              <label
                key={item.key}
                className="flex items-center justify-between rounded-lg border bg-background px-4 py-3"
              >
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
                <input
                  type="checkbox"
                  checked={notificationSettings[item.key as keyof typeof notificationSettings]}
                  onChange={(e) =>
                    setNotificationSettings((prev) => ({
                      ...prev,
                      [item.key]: e.target.checked,
                    }))
                  }
                  className="h-4 w-4 rounded border-input"
                />
              </label>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title="User Preferences"
          description="Customize portal appearance and regional settings"
          delay={0.2}
        >
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="theme" className="flex items-center gap-2">
                <Palette className="h-4 w-4 text-muted-foreground" />
                Theme
              </Label>
              <select
                id="theme"
                className={selectClass}
                value={userPreferences.theme}
                onChange={(e) =>
                  setUserPreferences((prev) => ({ ...prev, theme: e.target.value }))
                }
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="language" className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
                Language
              </Label>
              <select
                id="language"
                className={selectClass}
                value={userPreferences.language}
                onChange={(e) =>
                  setUserPreferences((prev) => ({ ...prev, language: e.target.value }))
                }
              >
                <option value="English">English</option>
                <option value="Hindi">Hindi</option>
                <option value="Kannada">Kannada</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timeZone" className="flex items-center gap-2">
                <Clock3 className="h-4 w-4 text-muted-foreground" />
                Time Zone
              </Label>
              <select
                id="timeZone"
                className={selectClass}
                value={userPreferences.timeZone}
                onChange={(e) =>
                  setUserPreferences((prev) => ({ ...prev, timeZone: e.target.value }))
                }
              >
                <option value="Asia/Kolkata">Asia/Kolkata</option>
                <option value="UTC">UTC</option>
                <option value="Asia/Singapore">Asia/Singapore</option>
              </select>
            </div>
          </div>
        </SectionCard>

        <div className="flex flex-wrap items-center gap-3">
          <Button onClick={handleSave} className="gap-2">
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
          <Button variant="outline" onClick={handleReset} className="gap-2">
            <RefreshCcw className="h-4 w-4" />
            Reset
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
