'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Menu,
  LogOut,
  User as UserIcon,
  Settings,
  ChevronDown,
  Plus,
  UserPlus,
  GraduationCap,
  UserCog,
  Wallet,
  Megaphone,
  Calendar,
  Users,
  CalendarClock,
  BookMarked,
  CalendarCheck,
  Building2,
  Database,
} from 'lucide-react';
import { useAuth } from '@/components/auth-provider';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { ROLE_LABELS, ROLE_ROUTE_PREFIX } from '@/lib/types';
import { toast } from 'sonner';
import { GlobalSearch } from '@/components/topbar/global-search';
import { AIAssistant } from '@/components/topbar/ai-assistant';
import { CalendarPopover } from '@/components/topbar/calendar-popover';
import { MessagesPanel } from '@/components/topbar/messages-panel';
import { NotificationsPanel } from '@/components/topbar/notifications-panel';
import { QuickActionModals, type QuickActionType } from '@/components/topbar/quick-action-modals';

interface TopbarProps {
  onOpenMobileSidebar: () => void;
}

const principalActions: { label: string; type: QuickActionType; icon: typeof Plus; color: string }[] = [
  { label: 'Add Student', type: 'add-student', icon: UserPlus, color: 'text-primary' },
  { label: 'Add Teacher', type: 'add-teacher', icon: GraduationCap, color: 'text-success' },
  { label: 'Add Parent', type: 'add-parent', icon: UserCog, color: 'text-info' },
  { label: 'Create Announcement', type: 'create-announcement', icon: Megaphone, color: 'text-chart-4' },
  { label: 'Add Event', type: 'add-event', icon: Calendar, color: 'text-accent' },
  { label: 'Record Fee Payment', type: 'record-fee', icon: Wallet, color: 'text-destructive' },
];

const superAdminActions: { label: string; type: QuickActionType; icon: typeof Plus; color: string }[] = [
  { label: 'Add School', type: 'add-student', icon: Building2, color: 'text-primary' },
  { label: 'Add Principal', type: 'add-teacher', icon: UserCog, color: 'text-success' },
  { label: 'Add Teacher', type: 'add-teacher', icon: GraduationCap, color: 'text-info' },
  { label: 'Add Student', type: 'add-student', icon: UserPlus, color: 'text-chart-4' },
  { label: 'Create Announcement', type: 'create-announcement', icon: Megaphone, color: 'text-accent' },
  { label: 'Backup Database', type: 'record-fee', icon: Database, color: 'text-destructive' },
];

const receptionActions: { label: string; type: QuickActionType; icon: typeof Plus; color: string }[] = [
  { label: 'Add Student', type: 'add-student', icon: UserPlus, color: 'text-primary' },
  { label: 'Add Visitor', type: 'add-visitor', icon: Users, color: 'text-info' },
  { label: 'Collect Fee', type: 'collect-fee', icon: Wallet, color: 'text-success' },
  { label: 'Schedule Appointment', type: 'schedule-appointment', icon: CalendarClock, color: 'text-accent' },
];

const teacherActions: { label: string; type: QuickActionType; icon: typeof Plus; color: string }[] = [
  { label: 'Assign Homework', type: 'assign-homework', icon: BookMarked, color: 'text-primary' },
  { label: 'Mark Attendance', type: 'mark-attendance', icon: CalendarCheck, color: 'text-success' },
  { label: 'Create Announcement', type: 'create-announcement', icon: Megaphone, color: 'text-info' },
];

function getQuickActions(role: string | undefined) {
  if (role === 'receptionist') return receptionActions;
  if (role === 'principal') return principalActions;
  if (role === 'superadmin') return superAdminActions;
  return [];
}

export function Topbar({ onOpenMobileSidebar }: TopbarProps) {
  const { profile, signOut } = useAuth();
  const router = useRouter();
  const [aiOpen, setAiOpen] = useState(false);
  const [quickActionModal, setQuickActionModal] = useState<QuickActionType | null>(null);

  const rolePrefix = ROLE_ROUTE_PREFIX[profile?.role ?? 'principal'];
  const canShowQuickActions = profile?.role === 'principal' || profile?.role === 'receptionist' || profile?.role === 'superadmin';
  const quickActions = canShowQuickActions ? getQuickActions(profile?.role) : [];

  const handleSignOut = async () => {
    await signOut();
    toast.success('Signed out successfully');
    router.push('/sign-in');
  };

  const handleOpenProfile = () => {
    if (profile?.role === 'student') {
      router.push('/student/my-profile');
      return;
    }

    if (profile?.role === 'parent') {
      router.push('/parent/my-profile');
      return;
    }

    if (profile?.role === 'teacher') {
      router.push('/teacher/profile');
      return;
    }

    if (profile?.role === 'superadmin') {
      router.push('/superadmin/settings');
      return;
    }

    toast.info('Profile page is not available for this role yet');
  };

  const handleOpenPassword = () => {
    if (profile?.role === 'student') {
      router.push('/student/my-profile?tab=password');
      return;
    }

    if (profile?.role === 'parent') {
      router.push('/parent/change-password');
      return;
    }

    toast.info('Password form is not available for this role yet');
  };

  const initials = profile?.full_name
    ? profile.full_name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'U';

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-2 border-b bg-background/80 px-3 backdrop-blur-xl lg:px-5">
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={onOpenMobileSidebar}
      >
        <Menu className="h-5 w-5" />
      </Button>

      <div className="hidden items-center gap-3 lg:flex">
        <div>
          <p className="text-sm font-semibold leading-tight">Yovial School</p>
          <p className="text-xs text-muted-foreground">Academic Year 2025–26</p>
        </div>
      </div>

      <div className="mx-1 hidden h-8 w-px bg-border lg:block" />

      <GlobalSearch rolePrefix={rolePrefix} />

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          className="hidden gap-2 rounded-lg sm:flex"
          onClick={() => setAiOpen(true)}
        >
          <Plus className="hidden" />
          <svg className="h-4 w-4 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 3L13.09 9.26L20 10L14.5 14.5L16 21L12 17.5L8 21L9.5 14.5L4 10L10.91 9.26L12 3Z" />
          </svg>
          <span className="text-sm font-medium">AI</span>
        </Button>

        <CalendarPopover />
        <MessagesPanel />
        <NotificationsPanel />

        <div className="mx-1 h-6 w-px bg-border" />

        {canShowQuickActions && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" className="h-9 w-9 rounded-lg">
                <Plus className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                Quick Actions
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <DropdownMenuItem
                    key={action.label}
                    className="cursor-pointer gap-2.5"
                    onClick={() => setQuickActionModal(action.type)}
                  >
                    <Icon className={`h-4 w-4 ${action.color}`} />
                    {action.label}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        <ThemeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-muted">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="hidden text-left sm:block">
                <p className="text-sm font-medium leading-tight">{profile?.full_name}</p>
                <p className="text-xs text-muted-foreground">
                  {profile ? ROLE_LABELS[profile.role] : ''}
                </p>
              </div>
              <ChevronDown className="hidden h-4 w-4 text-muted-foreground sm:block" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium">{profile?.full_name}</p>
              <p className="text-xs text-muted-foreground">{profile?.email}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={handleOpenProfile}
            >
              <UserIcon className="mr-2 h-4 w-4" />
              My Profile
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => router.push(`${rolePrefix}/settings`)}
            >
              <Settings className="mr-2 h-4 w-4" />
              School Settings
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={handleOpenPassword}
            >
              <Settings className="mr-2 h-4 w-4" />
              Change Password
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer text-destructive focus:text-destructive"
              onClick={handleSignOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <AIAssistant open={aiOpen} onOpenChange={setAiOpen} />
      <QuickActionModals openModal={quickActionModal} onClose={() => setQuickActionModal(null)} />
    </header>
  );
}
