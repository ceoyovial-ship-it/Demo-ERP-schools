'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  UserPlus,
  Wallet,
  CalendarCheck,
  ClipboardList,
  Calendar,
  Library,
  BookOpen,
  PartyPopper,
  CheckCheck,
  type LucideIcon,
} from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '@/components/page-header';
import { StatCard } from '@/components/stat-card';
import { SectionCard } from '@/components/section-card';
import { ExportButtons } from '@/components/export-buttons';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/* -------------------------------------------------------------------------- */
/*  Types                                                                      */
/* -------------------------------------------------------------------------- */

type NotificationType =
  | 'admission'
  | 'fee'
  | 'attendance'
  | 'exam'
  | 'leave'
  | 'library'
  | 'homework'
  | 'event';

type NotificationFilter = 'all' | NotificationType;

interface Notification {
  id: number;
  title: string;
  description: string;
  time: string;
  type: NotificationType;
  read: boolean;
}

/* -------------------------------------------------------------------------- */
/*  Type configuration — icon + color per notification type                    */
/* -------------------------------------------------------------------------- */

interface TypeConfig {
  icon: LucideIcon;
  iconClass: string;
}

const typeConfig: Record<NotificationType, TypeConfig> = {
  admission: { icon: UserPlus, iconClass: 'text-primary bg-primary/10' },
  fee: { icon: Wallet, iconClass: 'text-success bg-success/10' },
  attendance: { icon: CalendarCheck, iconClass: 'text-accent bg-accent/10' },
  exam: { icon: ClipboardList, iconClass: 'text-info bg-info/10' },
  leave: { icon: Calendar, iconClass: 'text-chart-4 bg-chart-4/10' },
  library: { icon: Library, iconClass: 'text-destructive bg-destructive/10' },
  homework: { icon: BookOpen, iconClass: 'text-chart-2 bg-chart-2/10' },
  event: { icon: PartyPopper, iconClass: 'text-chart-3 bg-chart-3/10' },
};

const filters: { key: NotificationFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'admission', label: 'Admission' },
  { key: 'fee', label: 'Fee' },
  { key: 'attendance', label: 'Attendance' },
  { key: 'exam', label: 'Exam' },
  { key: 'leave', label: 'Leave' },
  { key: 'library', label: 'Library' },
  { key: 'homework', label: 'Homework' },
  { key: 'event', label: 'Events' },
];

/* -------------------------------------------------------------------------- */
/*  Notification data                                                          */
/* -------------------------------------------------------------------------- */

const initialNotifications: Notification[] = [
  {
    id: 1,
    title: 'New Admission Application',
    description: 'Priya Sharma applied for admission to Grade 8-A',
    time: '2 min ago',
    type: 'admission',
    read: false,
  },
  {
    id: 2,
    title: 'Fee Payment Received',
    description: '₹45,000 received from Arjun Mehta (Grade 10-B)',
    time: '15 min ago',
    type: 'fee',
    read: true,
  },
  {
    id: 3,
    title: 'Low Attendance Alert',
    description: 'Grade 9-C attendance dropped below 75% monthly average',
    time: '1 hour ago',
    type: 'attendance',
    read: true,
  },
  {
    id: 4,
    title: 'Exam Schedule Published',
    description: 'Mid-term examination timetable published for all classes',
    time: '2 hours ago',
    type: 'exam',
    read: false,
  },
  {
    id: 5,
    title: 'Leave Application',
    description: 'Teacher Rajesh Kumar requested 2 days casual leave',
    time: '3 hours ago',
    type: 'leave',
    read: true,
  },
  {
    id: 6,
    title: 'Book Return Overdue',
    description: '5 books are overdue in the library management system',
    time: '5 hours ago',
    type: 'library',
    read: true,
  },
  {
    id: 7,
    title: 'Homework Submission',
    description: 'Grade 7-A submitted 28 science assignments today',
    time: '6 hours ago',
    type: 'homework',
    read: true,
  },
  {
    id: 8,
    title: 'Annual Day Planning',
    description: 'Committee meeting scheduled for Annual Day preparation',
    time: '8 hours ago',
    type: 'event',
    read: true,
  },
  {
    id: 9,
    title: 'Admission Approved',
    description: 'Karan Verma admitted to Grade 6-A after entrance test',
    time: 'Today, 10:30 AM',
    type: 'admission',
    read: true,
  },
  {
    id: 10,
    title: 'Pending Fee Reminder',
    description: '12 students have pending fee payments for this quarter',
    time: 'Today, 9:15 AM',
    type: 'fee',
    read: true,
  },
  {
    id: 11,
    title: 'Attendance Marked',
    description: 'All classes attendance successfully marked for today',
    time: 'Today, 8:45 AM',
    type: 'attendance',
    read: true,
  },
  {
    id: 12,
    title: 'Result Published',
    description: 'Grade 10 pre-board examination results are now available',
    time: 'Yesterday, 4:00 PM',
    type: 'exam',
    read: true,
  },
  {
    id: 13,
    title: 'Leave Approved',
    description: "Anita Desai's leave request approved for tomorrow",
    time: 'Yesterday, 2:00 PM',
    type: 'leave',
    read: true,
  },
  {
    id: 14,
    title: 'New Books Added',
    description: '120 new books added to the library catalog this week',
    time: 'Yesterday, 11:00 AM',
    type: 'library',
    read: true,
  },
  {
    id: 15,
    title: 'Homework Overdue',
    description: 'Grade 8-B has 6 overdue mathematics homework submissions',
    time: '2 days ago',
    type: 'homework',
    read: true,
  },
  {
    id: 16,
    title: 'Sports Day Registration',
    description: 'Registration opened for the Annual Sports Day event',
    time: '3 days ago',
    type: 'event',
    read: false,
  },
  {
    id: 17,
    title: 'Admission Inquiry',
    description: '5 new admission inquiries received through the website',
    time: '4 days ago',
    type: 'admission',
    read: true,
  },
  {
    id: 18,
    title: 'Scholarship Approved',
    description: '3 students approved for merit-based scholarship program',
    time: '5 days ago',
    type: 'fee',
    read: true,
  },
];

/* -------------------------------------------------------------------------- */
/*  Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function NotificationsPage() {
  const [notifications, setNotifications] =
    useState<Notification[]>(initialNotifications);
  const [filter, setFilter] = useState<NotificationFilter>('all');

  const unreadCount = notifications.filter((n) => !n.read).length;
  const filteredNotifications =
    filter === 'all'
      ? notifications
      : notifications.filter((n) => n.type === filter);

  const handleMarkAllRead = () => {
    if (unreadCount === 0) {
      toast.info('All notifications are already read');
      return;
    }
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    toast.success('All notifications marked as read');
  };

  const handleMarkRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Notifications"
        description="View and manage all your notifications"
      >
        <ExportButtons label="notifications" />
      </PageHeader>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Notifications"
          value={18}
          icon={Bell}
          description="All-time notifications"
          delay={0}
        />
        <StatCard
          title="Unread"
          value={unreadCount}
          icon={Bell}
          description="Awaiting your attention"
          delay={0.05}
        />
        <StatCard
          title="Today"
          value={6}
          icon={CalendarCheck}
          change="+2 vs yesterday"
          changeType="positive"
          delay={0.1}
        />
        <StatCard
          title="This Week"
          value={12}
          icon={Calendar}
          change="+4 vs last week"
          changeType="positive"
          delay={0.15}
        />
      </div>

      {/* Filter bar + actions */}
      <SectionCard
        title="All Notifications"
        description={`${filteredNotifications.length} notification${
          filteredNotifications.length === 1 ? '' : 's'
        }${filter === 'all' ? '' : ` in ${filters.find((f) => f.key === filter)?.label}`}`}
        delay={0.1}
      >
        <div className="flex flex-col gap-4">
          {/* Filter pills + mark all read */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              {filters.map((f) => {
                const isActive = filter === f.key;
                return (
                  <button
                    key={f.key}
                    onClick={() => setFilter(f.key)}
                    className={cn(
                      'rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'border border-border bg-background text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                    )}
                  >
                    {f.label}
                  </button>
                );
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              className="gap-2 shrink-0"
              onClick={handleMarkAllRead}
            >
              <CheckCheck className="h-4 w-4" />
              <span>Mark All As Read</span>
            </Button>
          </div>

          {/* Scrollable notification list */}
          <div className="max-h-[640px] space-y-2 overflow-y-auto pr-1">
            <AnimatePresence initial={false} mode="popLayout">
              {filteredNotifications.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center gap-2 py-16 text-center"
                >
                  <Bell className="h-10 w-10 text-muted-foreground/40" />
                  <p className="text-sm font-medium text-muted-foreground">
                    No notifications in this category
                  </p>
                </motion.div>
              ) : (
                filteredNotifications.map((notification, index) => {
                  const config = typeConfig[notification.type];
                  const Icon = config.icon;
                  return (
                    <motion.button
                      key={notification.id}
                      layout
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{
                        duration: 0.3,
                        delay: index * 0.03,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      onClick={() => handleMarkRead(notification.id)}
                      className={cn(
                        'flex w-full items-start gap-4 rounded-xl border p-4 text-left transition-colors',
                        notification.read
                          ? 'border-border bg-background hover:border-primary/30 hover:bg-accent/40'
                          : 'border-primary/20 bg-primary/5 hover:bg-primary/10'
                      )}
                    >
                      {/* Icon */}
                      <div
                        className={cn(
                          'flex h-10 w-10 shrink-0 items-center justify-center rounded-full',
                          config.iconClass
                        )}
                      >
                        <Icon className="h-5 w-5" />
                      </div>

                      {/* Content */}
                      <div className="min-w-0 flex-1 space-y-0.5">
                        <div className="flex items-start justify-between gap-3">
                          <p
                            className={cn(
                              'truncate text-sm font-semibold',
                              !notification.read && 'text-foreground'
                            )}
                          >
                            {notification.title}
                          </p>
                          <div className="flex shrink-0 items-center gap-2">
                            {!notification.read && (
                              <span
                                className="h-2.5 w-2.5 rounded-full bg-info"
                                aria-label="Unread"
                                title="Unread"
                              />
                            )}
                            <span className="whitespace-nowrap text-xs text-muted-foreground">
                              {notification.time}
                            </span>
                          </div>
                        </div>
                        <p className="line-clamp-2 text-sm text-muted-foreground">
                          {notification.description}
                        </p>
                      </div>
                    </motion.button>
                  );
                })
              )}
            </AnimatePresence>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
