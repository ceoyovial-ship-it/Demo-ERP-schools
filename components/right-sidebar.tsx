'use client';

import { motion } from 'framer-motion';
import {
  Clock,
  Calendar,
  MapPin,
  Users,
  Video,
  Coffee,
  CalendarCheck,
  UserRound,
} from 'lucide-react';
import { todaySchedule, upcomingMeetings } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

const typeConfig: Record<string, { icon: typeof Clock; color: string; bg: string }> = {
  event: { icon: CalendarCheck, color: 'text-primary', bg: 'bg-primary/10' },
  meeting: { icon: Video, color: 'text-chart-4', bg: 'bg-chart-4/10' },
  parent: { icon: UserRound, color: 'text-chart-2', bg: 'bg-chart-2/10' },
  break: { icon: Coffee, color: 'text-accent', bg: 'bg-accent/10' },
};

export function RightSidebar() {
  return (
    <div className="space-y-4">
      {/* Today's Schedule */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="rounded-2xl border bg-card p-5 shadow-premium"
      >
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <Clock className="h-4 w-4 text-primary" />
            </div>
            <h3 className="text-sm font-semibold">Today's Schedule</h3>
          </div>
          <span className="text-xs text-muted-foreground">Jul 14</span>
        </div>

        <div className="relative space-y-3">
          {/* Timeline line */}
          <div className="absolute left-[15px] top-2 bottom-2 w-px bg-border" />

          {todaySchedule.map((item, i) => {
            const config = typeConfig[item.type] ?? typeConfig.event;
            const Icon = config.icon;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
                className="relative flex items-start gap-3 pl-0"
              >
                <div className={cn('relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-background', config.bg)}>
                  <Icon className={cn('h-3.5 w-3.5', config.color)} />
                </div>
                <div className="flex-1 pt-0.5">
                  <p className="text-sm font-medium leading-tight">{item.title}</p>
                  <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="font-medium">{item.time}</span>
                    <span>·</span>
                    <span className="flex items-center gap-0.5">
                      <MapPin className="h-3 w-3" />
                      {item.location}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Upcoming Meetings */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        className="rounded-2xl border bg-card p-5 shadow-premium"
      >
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-chart-4/10">
            <Calendar className="h-4 w-4 text-chart-4" />
          </div>
          <h3 className="text-sm font-semibold">Upcoming Meetings</h3>
        </div>

        <div className="space-y-3">
          {upcomingMeetings.map((meeting, i) => (
            <motion.div
              key={meeting.id}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + i * 0.05 }}
              className="group rounded-xl border p-3 transition-all hover:border-primary/30 hover:shadow-premium"
            >
              <p className="text-sm font-medium leading-tight">{meeting.title}</p>
              <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {meeting.date}
                  <span>·</span>
                  <Clock className="h-3 w-3" />
                  {meeting.time}
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Users className="h-3 w-3" />
                  {meeting.attendees}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
