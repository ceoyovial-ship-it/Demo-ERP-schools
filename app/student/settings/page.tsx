'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Globe, Moon, Sun, Save, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useTheme } from 'next-themes';
import { PageHeader } from '@/components/page-header';
import { SectionCard } from '@/components/section-card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Tabs, TabsContent, TabsList, TabsTrigger,
} from '@/components/ui/tabs';

const selectClassStyle = 'h-9 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary/20';

export default function StudentSettingsPage() {
  const { theme, setTheme } = useTheme();
  const [saving, setSaving] = useState(false);
  const [notifications, setNotifications] = useState({ email: true, push: true, homework: true, exams: true, announcements: true, fees: true });
  const [language, setLanguage] = useState('en');

  const handleSave = () => { setSaving(true); setTimeout(() => { setSaving(false); toast.success('Settings saved successfully'); }, 1000); };

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Manage your preferences" />

      <Tabs defaultValue="notifications">
        <TabsList><TabsTrigger value="notifications">Notifications</TabsTrigger><TabsTrigger value="appearance">Appearance</TabsTrigger><TabsTrigger value="preferences">Preferences</TabsTrigger></TabsList>

        <TabsContent value="notifications" className="space-y-4">
          <SectionCard title="Notification Preferences" description="Choose how you want to be notified" delay={0.1}>
            <div className="space-y-4">
              {[
                { key: 'email', label: 'Email Notifications', desc: 'Receive updates via email' },
                { key: 'push', label: 'Push Notifications', desc: 'In-app push alerts' },
                { key: 'homework', label: 'Homework Reminders', desc: 'Notify about homework due dates' },
                { key: 'exams', label: 'Exam Alerts', desc: 'Notify about upcoming exams' },
                { key: 'announcements', label: 'Announcements', desc: 'School and class announcements' },
                { key: 'fees', label: 'Fee Reminders', desc: 'Notify about fee due dates' },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between">
                  <div className="flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted"><Bell className="h-4 w-4 text-muted-foreground" /></div><div><p className="text-sm font-medium">{item.label}</p><p className="text-xs text-muted-foreground">{item.desc}</p></div></div>
                  <Switch checked={notifications[item.key as keyof typeof notifications]} onCheckedChange={(v) => setNotifications({ ...notifications, [item.key]: v })} />
                </div>
              ))}
            </div>
            <div className="mt-6"><Button onClick={handleSave} disabled={saving} className="gap-2">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}Save Settings</Button></div>
          </SectionCard>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-4">
          <SectionCard title="Appearance" description="Customize your visual experience" delay={0.1}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">{theme === 'dark' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}<div><p className="text-sm font-medium">Dark Mode</p><p className="text-xs text-muted-foreground">Switch between light and dark themes</p></div></div>
              <Switch checked={theme === 'dark'} onCheckedChange={(v) => setTheme(v ? 'dark' : 'light')} />
            </div>
          </SectionCard>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-4">
          <SectionCard title="Preferences" description="Regional settings" delay={0.1}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5"><Label>Language</Label><select className={selectClassStyle} value={language} onChange={(e) => setLanguage(e.target.value)}><option value="en">English</option><option value="hi">Hindi</option><option value="kn">Kannada</option><option value="ta">Tamil</option></select></div>
              <div className="space-y-1.5"><Label>Timezone</Label><select className={selectClassStyle}><option>India Standard Time (IST)</option><option>Greenwich Mean Time (GMT)</option></select></div>
            </div>
            <div className="mt-6"><Button onClick={handleSave} disabled={saving} className="gap-2">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}Save Preferences</Button></div>
          </SectionCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}
