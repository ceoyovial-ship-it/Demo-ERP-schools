'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, BookOpen, Calendar, Award, Lock, Save, Loader2, LogOut } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/page-header';
import { SectionCard } from '@/components/section-card';
import { StatCard } from '@/components/stat-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/components/auth-provider';
import { teacherProfile } from '@/lib/teacher-data';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
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

const selectClassStyle =
  'h-9 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary/20';

export default function TeacherProfilePage() {
  const { profile, signOut } = useAuth();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: teacherProfile.name,
    email: teacherProfile.email,
    phone: teacherProfile.phone,
    address: teacherProfile.address,
    qualification: teacherProfile.qualification,
  });
  const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' });

  const handleSaveProfile = () => {
    if (!profileForm.name.trim() || !profileForm.email.trim()) {
      toast.error('Name and email are required');
      return;
    }
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success('Profile updated successfully');
    }, 1000);
  };

  const handleChangePassword = () => {
    if (!passwordForm.current || !passwordForm.new || !passwordForm.confirm) {
      toast.error('Please fill in all password fields');
      return;
    }
    if (passwordForm.new !== passwordForm.confirm) {
      toast.error('New passwords do not match');
      return;
    }
    if (passwordForm.new.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success('Password changed successfully');
      setPasswordForm({ current: '', new: '', confirm: '' });
    }, 1200);
  };

  const handleLogout = async () => {
    await signOut();
    toast.success('Signed out successfully');
    router.push('/sign-in');
  };

  const initials = profile?.full_name?.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase() ?? 'AR';

  return (
    <div className="space-y-6">
      <PageHeader title="My Profile" description="Manage your account and preferences" />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="Performance" value={`${teacherProfile.performance}%`} icon={Award} delay={0} />
        <StatCard title="Attendance" value={`${teacherProfile.attendance}%`} icon={Calendar} delay={0.05} />
        <StatCard title="Experience" value={`${teacherProfile.experience} yrs`} icon={BookOpen} delay={0.1} />
      </div>

      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="password">Change Password</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <SectionCard title="Profile Information" description="Update your personal details" delay={0.1}>
            <div className="flex items-center gap-4 mb-6">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="bg-primary/10 text-xl font-bold text-primary">{initials}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-lg font-bold">{profile?.full_name ?? teacherProfile.name}</p>
                <p className="text-sm text-muted-foreground">{teacherProfile.employeeId} · {teacherProfile.subjects.join(', ')}</p>
                <div className="mt-2 flex gap-2">
                  {teacherProfile.classes.map((c) => (
                    <Badge key={c} variant="secondary" className="text-xs">Grade {c}</Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Full Name</Label>
                <Input value={profileForm.name} onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Email</Label>
                <Input type="email" value={profileForm.email} onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Phone</Label>
                <Input value={profileForm.phone} onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Qualification</Label>
                <Input value={profileForm.qualification} onChange={(e) => setProfileForm({ ...profileForm, qualification: e.target.value })} />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label>Address</Label>
                <Input value={profileForm.address} onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })} />
              </div>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <div className="flex items-center gap-3 rounded-xl border p-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted"><BookOpen className="h-4 w-4 text-muted-foreground" /></div>
                <div><p className="text-xs text-muted-foreground">Subjects</p><p className="text-sm font-medium">{teacherProfile.subjects.join(', ')}</p></div>
              </div>
              <div className="flex items-center gap-3 rounded-xl border p-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted"><Calendar className="h-4 w-4 text-muted-foreground" /></div>
                <div><p className="text-xs text-muted-foreground">Join Date</p><p className="text-sm font-medium">{teacherProfile.joinDate}</p></div>
              </div>
              <div className="flex items-center gap-3 rounded-xl border p-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted"><User className="h-4 w-4 text-muted-foreground" /></div>
                <div><p className="text-xs text-muted-foreground">Gender</p><p className="text-sm font-medium">{teacherProfile.gender}</p></div>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <Button onClick={handleSaveProfile} disabled={saving} className="gap-2">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save Changes
              </Button>
              <Button variant="outline" className="gap-2 text-destructive" onClick={() => setShowLogoutConfirm(true)}>
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </SectionCard>
        </TabsContent>

        <TabsContent value="password" className="space-y-4">
          <SectionCard title="Change Password" description="Update your account password" delay={0.1}>
            <div className="grid gap-4 max-w-md">
              <div className="space-y-1.5">
                <Label>Current Password</Label>
                <Input type="password" value={passwordForm.current} onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })} placeholder="Enter current password" />
              </div>
              <div className="space-y-1.5">
                <Label>New Password</Label>
                <Input type="password" value={passwordForm.new} onChange={(e) => setPasswordForm({ ...passwordForm, new: e.target.value })} placeholder="Enter new password" />
              </div>
              <div className="space-y-1.5">
                <Label>Confirm New Password</Label>
                <Input type="password" value={passwordForm.confirm} onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })} placeholder="Confirm new password" />
              </div>
              <Button onClick={handleChangePassword} disabled={saving} className="gap-2 w-fit">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
                Change Password
              </Button>
            </div>
          </SectionCard>
        </TabsContent>
      </Tabs>

      <AlertDialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sign out?</AlertDialogTitle>
            <AlertDialogDescription>You will be redirected to the sign-in page.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout}>Sign Out</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
