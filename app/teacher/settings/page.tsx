'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Bell, Globe, Moon, Sun, Save, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '@/components/page-header';
import { SectionCard } from '@/components/section-card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useTheme } from 'next-themes';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

const selectClassStyle =
  'h-9 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary/20';

export default function TeacherSettingsPage() {
  const { theme, setTheme } = useTheme();
  const [saving, setSaving] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
    homeworkSubmissions: true,
    leaveRequests: true,
    messages: true,
    announcements: true,
  });
  const [language, setLanguage] = useState('en');
  const [timezone, setTimezone] = useState('IST');

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success('Settings saved successfully');
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Manage your preferences" />

      <Tabs defaultValue="notifications">
        <TabsList>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>

        <TabsContent value="notifications" className="space-y-4">
          <SectionCard title="Notification Preferences" description="Choose how you want to be notified" delay={0.1}>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted"><Bell className="h-4 w-4 text-muted-foreground" /></div>
                  <div><p className="text-sm font-medium">Email Notifications</p><p className="text-xs text-muted-foreground">Receive updates via email</p></div>
                </div>
                <Switch checked={notifications.email} onCheckedChange={(v) => setNotifications({ ...notifications, email: v })} />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted"><Bell className="h-4 w-4 text-muted-foreground" /></div>
                  <div><p className="text-sm font-medium">SMS Notifications</p><p className="text-xs text-muted-foreground">Receive updates via SMS</p></div>
                </div>
                <Switch checked={notifications.sms} onCheckedChange={(v) => setNotifications({ ...notifications, sms: v })} />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted"><Bell className="h-4 w-4 text-muted-foreground" /></div>
                  <div><p className="text-sm font-medium">Push Notifications</p><p className="text-xs text-muted-foreground">In-app push alerts</p></div>
                </div>
                <Switch checked={notifications.push} onCheckedChange={(v) => setNotifications({ ...notifications, push: v })} />
              </div>
              <div className="border-t pt-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div><p className="text-sm font-medium">Homework Submissions</p><p className="text-xs text-muted-foreground">Notify when students submit homework</p></div>
                  <Switch checked={notifications.homeworkSubmissions} onCheckedChange={(v) => setNotifications({ ...notifications, homeworkSubmissions: v })} />
                </div>
                <div className="flex items-center justify-between">
                  <div><p className="text-sm font-medium">Leave Requests</p><p className="text-xs text-muted-foreground">Notify when leave requests are submitted</p></div>
                  <Switch checked={notifications.leaveRequests} onCheckedChange={(v) => setNotifications({ ...notifications, leaveRequests: v })} />
                </div>
                <div className="flex items-center justify-between">
                  <div><p className="text-sm font-medium">Messages</p><p className="text-xs text-muted-foreground">Notify when you receive a message</p></div>
                  <Switch checked={notifications.messages} onCheckedChange={(v) => setNotifications({ ...notifications, messages: v })} />
                </div>
                <div className="flex items-center justify-between">
                  <div><p className="text-sm font-medium">Announcements</p><p className="text-xs text-muted-foreground">Notify about school announcements</p></div>
                  <Switch checked={notifications.announcements} onCheckedChange={(v) => setNotifications({ ...notifications, announcements: v })} />
                </div>
              </div>
            </div>
            <div className="mt-6">
              <Button onClick={handleSave} disabled={saving} className="gap-2">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save Settings
              </Button>
            </div>
          </SectionCard>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-4">
          <SectionCard title="Appearance" description="Customize your visual experience" delay={0.1}>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {theme === 'dark' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                  <div><p className="text-sm font-medium">Dark Mode</p><p className="text-xs text-muted-foreground">Switch between light and dark themes</p></div>
                </div>
                <Switch checked={theme === 'dark'} onCheckedChange={(v) => setTheme(v ? 'dark' : 'light')} />
              </div>
            </div>
          </SectionCard>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-4">
          <SectionCard title="Preferences" description="Regional and display settings" delay={0.1}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Language</Label>
                <select className={selectClassStyle} value={language} onChange={(e) => setLanguage(e.target.value)}>
                  <option value="en">English</option><option value="hi">Hindi</option><option value="kn">Kannada</option><option value="ta">Tamil</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <Label>Timezone</Label>
                <select className={selectClassStyle} value={timezone} onChange={(e) => setTimezone(e.target.value)}>
                  <option value="IST">India Standard Time (IST)</option><option value="GMT">Greenwich Mean Time (GMT)</option><option value="EST">Eastern Standard Time (EST)</option>
                </select>
              </div>
            </div>
            <div className="mt-6">
              <Button onClick={handleSave} disabled={saving} className="gap-2">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save Preferences
              </Button>
            </div>
          </SectionCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}
