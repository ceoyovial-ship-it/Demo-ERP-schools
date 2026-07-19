'use client';

import * as React from 'react';
import {
  Bell,
  UserPlus,
  Wallet,
  CalendarCheck,
  ClipboardList,
  Calendar,
  Library,
  CheckCheck,
} from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

type NotificationType =
  | 'admission'
  | 'fee'
  | 'attendance'
  | 'exam'
  | 'leave'
  | 'library';

interface Notification {
  id: number;
  title: string;
  description: string;
  time: string;
  type: NotificationType;
  read: boolean;
}

const initialNotifications: Notification[] = [
  {
    id: 1,
    title: 'New Admission',
    description: 'Arjun Patel enrolled in Grade 6-A',
    time: '10 min ago',
    type: 'admission',
    read: false,
  },
  {
    id: 2,
    title: 'Fee Payment Received',
    description: '₹45,000 from Sharma family',
    time: '25 min ago',
    type: 'fee',
    read: false,
  },
  {
    id: 3,
    title: 'Attendance Alert',
    description: 'Grade 9-A attendance below 75%',
    time: '1 hour ago',
    type: 'attendance',
    read: false,
  },
  {
    id: 4,
    title: 'Exam Scheduled',
    description: 'Mid-term exam on July 20',
    time: '2 hours ago',
    type: 'exam',
    read: true,
  },
  {
    id: 5,
    title: 'Leave Request',
    description: 'Meena Iyer requested leave',
    time: '3 hours ago',
    type: 'leave',
    read: true,
  },
  {
    id: 6,
    title: 'Library Overdue',
    description: '12 books overdue for return',
    time: '5 hours ago',
    type: 'library',
    read: true,
  },
];

const iconConfig: Record<
  NotificationType,
  { icon: React.ElementType; iconClass: string }
> = {
  admission: { icon: UserPlus, iconClass: 'text-primary bg-primary/10' },
  fee: { icon: Wallet, iconClass: 'text-success bg-success/10' },
  attendance: {
    icon: CalendarCheck,
    iconClass: 'text-accent bg-accent/10',
  },
  exam: { icon: ClipboardList, iconClass: 'text-info bg-info/10' },
  leave: { icon: Calendar, iconClass: 'text-chart-4 bg-chart-4/10' },
  library: { icon: Library, iconClass: 'text-destructive bg-destructive/10' },
};

export function NotificationsPanel() {
  const [notifications, setNotifications] =
    React.useState<Notification[]>(initialNotifications);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = React.useCallback((id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllAsRead = React.useCallback(() => {
    setNotifications((prev) =>
      prev.every((n) => n.read) ? prev : prev.map((n) => ({ ...n, read: true }))
    );
    toast.success('All notifications marked as read');
  }, []);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9 rounded-lg"
          aria-label="Open notifications"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">Notifications</span>
            {unreadCount > 0 && (
              <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary px-1.5 text-xs font-medium text-primary-foreground">
                {unreadCount}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
            className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-50"
          >
            <CheckCheck className="h-3.5 w-3.5" />
            Mark all as read
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 px-4 py-10 text-center">
              <Bell className="h-8 w-8 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">
                You&apos;re all caught up
              </p>
            </div>
          ) : (
            <ul className="divide-y">
              {notifications.map((notification) => {
                const { icon: Icon, iconClass } = iconConfig[notification.type];
                return (
                  <li key={notification.id}>
                    <button
                      type="button"
                      onClick={() => markAsRead(notification.id)}
                      className="flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/50"
                    >
                      <span
                        className={cn(
                          'flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full',
                          iconClass
                        )}
                      >
                        <Icon className="h-5 w-5" />
                      </span>
                      <div className="flex-1 space-y-0.5">
                        <p className="text-sm font-medium leading-tight">
                          {notification.title}
                        </p>
                        <p className="text-xs text-muted-foreground leading-snug">
                          {notification.description}
                        </p>
                        <p className="text-[11px] text-muted-foreground/70">
                          {notification.time}
                        </p>
                      </div>
                      {!notification.read && (
                        <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-blue-500" />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="border-t px-4 py-2">
          <button
            type="button"
            className="w-full text-center text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            View all notifications
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default NotificationsPanel;
