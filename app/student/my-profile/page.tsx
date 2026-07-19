'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Calendar, BookOpen, Save, Loader2, LogOut, Award, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { PageHeader } from '@/components/page-header';
import { SectionCard } from '@/components/section-card';
import { StatCard } from '@/components/stat-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/components/auth-provider';
import { getStudentKey, studentProfiles, studentDashboardStats } from '@/lib/student-data';
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
import { Lock } from 'lucide-react';

const selectClassStyle =
  'h-9 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary/20';

export default function MyProfilePage() {
  const { profile, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const key = getStudentKey(profile?.email?.split('@')[0]);
  const studentProfile = studentProfiles[key];
  const stats = studentDashboardStats[key];
  const requestedTab = searchParams.get('tab') === 'password' ? 'password' : 'profile';

  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'password'>(requestedTab);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [profileForm, setProfileForm] = useState({
    phone: studentProfile.phone,
    address: studentProfile.address,
    bio: studentProfile.bio,
  });
  const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' });

  useEffect(() => {
    setActiveTab(requestedTab);
  }, [requestedTab]);

  const handleSaveProfile = () => {
    setSaving(true);
    setTimeout(() => { setSaving(false); toast.success('Profile updated successfully'); }, 1000);
  };

  const handleChangePassword = () => {
    if (!passwordForm.current || !passwordForm.new || !passwordForm.confirm) { toast.error('Please fill in all password fields'); return; }
    if (passwordForm.new !== passwordForm.confirm) { toast.error('New passwords do not match'); return; }
    if (passwordForm.new.length < 8) { toast.error('Password must be at least 8 characters'); return; }
    setSaving(true);
    setTimeout(() => { setSaving(false); toast.success('Password changed successfully'); setPasswordForm({ current: '', new: '', confirm: '' }); }, 1200);
  };

  const handleLogout = async () => { await signOut(); toast.success('Signed out successfully'); router.push('/sign-in'); };

  const initials = studentProfile.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();

  return (
    <div className="space-y-6">
      <PageHeader title="My Profile" description="View and manage your personal information" />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="Attendance" value={`${stats.attendance}%`} icon={Calendar} delay={0} />
        <StatCard title="Class Rank" value={`#${stats.rank}`} icon={Award} delay={0.05} />
        <StatCard title="Average Marks" value={`${stats.avgMarks}%`} icon={BookOpen} delay={0.1} />
      </div>

      <Tabs value={activeTab} onValueChange={(value) => {
        const nextTab = value as 'profile' | 'password';
        setActiveTab(nextTab);
        router.replace(`${pathname}?tab=${nextTab}`, { scroll: false });
      }}>
        <TabsList><TabsTrigger value="profile">Profile</TabsTrigger><TabsTrigger value="password">Change Password</TabsTrigger></TabsList>

        <TabsContent value="profile" className="space-y-4">
          <SectionCard title="Personal Information" description="Your academic and personal details" delay={0.1}>
            <div className="flex items-center gap-4 mb-6">
              <Avatar className="h-20 w-20"><AvatarFallback className="bg-primary/10 text-xl font-bold text-primary">{initials}</AvatarFallback></Avatar>
              <div>
                <p className="text-lg font-bold">{studentProfile.name}</p>
                <p className="text-sm text-muted-foreground">{studentProfile.studentId} · Grade {studentProfile.classGrade}-{studentProfile.section}</p>
                <div className="mt-2 flex gap-2">
                  <Badge variant="secondary" className="text-xs">Roll #{studentProfile.rollNumber}</Badge>
                  <Badge variant="secondary" className="text-xs">{studentProfile.admissionNumber}</Badge>
                  <Badge variant={studentProfile.status === 'active' ? 'default' : 'secondary'} className="text-xs capitalize">{studentProfile.status}</Badge>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-3 rounded-xl border p-3"><User className="h-4 w-4 text-muted-foreground" /><div><Label className="text-xs text-muted-foreground">Full Name</Label><p className="text-sm font-medium">{studentProfile.name}</p></div></div>
              <div className="flex items-center gap-3 rounded-xl border p-3"><Mail className="h-4 w-4 text-muted-foreground" /><div><Label className="text-xs text-muted-foreground">Email</Label><p className="text-sm font-medium">{studentProfile.email}</p></div></div>
              <div className="flex items-center gap-3 rounded-xl border p-3"><Calendar className="h-4 w-4 text-muted-foreground" /><div><Label className="text-xs text-muted-foreground">Date of Birth</Label><p className="text-sm font-medium">{studentProfile.dob}</p></div></div>
              <div className="flex items-center gap-3 rounded-xl border p-3"><User className="h-4 w-4 text-muted-foreground" /><div><Label className="text-xs text-muted-foreground">Gender</Label><p className="text-sm font-medium">{studentProfile.gender}</p></div></div>
              <div className="flex items-center gap-3 rounded-xl border p-3"><BookOpen className="h-4 w-4 text-muted-foreground" /><div><Label className="text-xs text-muted-foreground">Blood Group</Label><p className="text-sm font-medium">{studentProfile.bloodGroup}</p></div></div>
              <div className="flex items-center gap-3 rounded-xl border p-3"><Calendar className="h-4 w-4 text-muted-foreground" /><div><Label className="text-xs text-muted-foreground">Admission Date</Label><p className="text-sm font-medium">{studentProfile.admissionDate}</p></div></div>
            </div>

            <div className="mt-4 space-y-1.5"><Label>Phone</Label><Input value={profileForm.phone} onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })} /></div>
            <div className="mt-4 space-y-1.5"><Label>Address</Label><Input value={profileForm.address} onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })} /></div>
            <div className="mt-4 space-y-1.5"><Label>Bio</Label><Textarea value={profileForm.bio} onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })} rows={3} /></div>

            <div className="mt-4 rounded-xl border p-4">
              <p className="text-sm font-semibold mb-3">Parent / Guardian</p>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="flex items-center gap-3"><User className="h-4 w-4 text-muted-foreground" /><div><Label className="text-xs text-muted-foreground">Name</Label><p className="text-sm font-medium">{studentProfile.parentName}</p></div></div>
                <div className="flex items-center gap-3"><Phone className="h-4 w-4 text-muted-foreground" /><div><Label className="text-xs text-muted-foreground">Phone</Label><p className="text-sm font-medium">{studentProfile.parentPhone}</p></div></div>
                <div className="flex items-center gap-3"><Mail className="h-4 w-4 text-muted-foreground" /><div><Label className="text-xs text-muted-foreground">Email</Label><p className="text-sm font-medium">{studentProfile.parentEmail}</p></div></div>
                <div className="flex items-center gap-3"><BookOpen className="h-4 w-4 text-muted-foreground" /><div><Label className="text-xs text-muted-foreground">Occupation</Label><p className="text-sm font-medium">{studentProfile.parentOccupation}</p></div></div>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <Button onClick={handleSaveProfile} disabled={saving} className="gap-2">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}Save Changes</Button>
              <Button variant="outline" className="gap-2 text-destructive" onClick={() => setShowLogoutConfirm(true)}><LogOut className="h-4 w-4" />Sign Out</Button>
            </div>
          </SectionCard>
        </TabsContent>

        <TabsContent value="password" className="space-y-4">
          <SectionCard title="Change Password" description="Update your account password" delay={0.1}>
            <div className="grid gap-4 max-w-md">
              <div className="space-y-1.5"><Label>Current Password</Label><Input type="password" value={passwordForm.current} onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })} placeholder="Enter current password" /></div>
              <div className="space-y-1.5"><Label>New Password</Label><Input type="password" value={passwordForm.new} onChange={(e) => setPasswordForm({ ...passwordForm, new: e.target.value })} placeholder="Enter new password" /></div>
              <div className="space-y-1.5"><Label>Confirm New Password</Label><Input type="password" value={passwordForm.confirm} onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })} placeholder="Confirm new password" /></div>
              <Button onClick={handleChangePassword} disabled={saving} className="gap-2 w-fit">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}Change Password</Button>
            </div>
          </SectionCard>
        </TabsContent>
      </Tabs>

      <AlertDialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Sign out?</AlertDialogTitle><AlertDialogDescription>You will be redirected to the sign-in page.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={handleLogout}>Sign Out</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
