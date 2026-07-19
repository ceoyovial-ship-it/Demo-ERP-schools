'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, Clock, BookOpen } from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import { SectionCard } from '@/components/section-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { teacherTimetable } from '@/lib/teacher-data';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const PERIODS = ['1', '2', '3', '4', '5', '6', '7'];

const selectClassStyle =
  'h-9 rounded-lg border border-input bg-background px-3 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary/20';

export default function TimetablePage() {
  const [selectedDay, setSelectedDay] = useState<string>('all');

  const filteredSlots = selectedDay === 'all'
    ? teacherTimetable
    : teacherTimetable.filter((s) => s.day === selectedDay);

  const getSlot = (day: string, period: string) =>
    filteredSlots.find((s) => s.day === day && s.period === period);

  const isFree = (slot: typeof teacherTimetable[0] | undefined) => !slot || slot.subject === '—';

  return (
    <div className="space-y-6">
      <PageHeader title="Timetable" description="Your weekly teaching schedule">
        <div className="flex items-center gap-2">
          <select className={selectClassStyle} value={selectedDay} onChange={(e) => setSelectedDay(e.target.value)}>
            <option value="all">All Days</option>
            {DAYS.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
      </PageHeader>

      {selectedDay === 'all' ? (
        <SectionCard title="Weekly Timetable" description="Full week view" delay={0.1}>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="border-b bg-muted/30 text-left text-xs font-medium text-muted-foreground">
                  <th className="px-3 py-3 w-32">Time</th>
                  {DAYS.map((d) => (
                    <th key={d} className="px-3 py-3 text-center">{d}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PERIODS.map((period) => {
                  const sampleSlot = teacherTimetable.find((s) => s.period === period && s.day === 'Mon');
                  return (
                    <tr key={period} className="border-b text-sm last:border-0">
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2">
                          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-xs font-semibold text-primary">{period}</span>
                          <span className="text-xs text-muted-foreground">{sampleSlot?.time}</span>
                        </div>
                      </td>
                      {DAYS.map((day) => {
                        const slot = getSlot(day, period);
                        const free = isFree(slot);
                        return (
                          <td key={day} className="px-3 py-2">
                            {free ? (
                              <div className="flex h-full items-center justify-center rounded-lg bg-muted/30 py-3 text-xs text-muted-foreground">
                                Free
                              </div>
                            ) : (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="rounded-lg border border-primary/20 bg-primary/5 p-2 text-center"
                              >
                                <p className="text-xs font-medium">{slot!.subject}</p>
                                <p className="text-xs text-muted-foreground">{slot!.classGrade}-{slot!.section}</p>
                                <p className="text-xs text-muted-foreground">{slot!.room}</p>
                              </motion.div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </SectionCard>
      ) : (
        <SectionCard title={`${selectedDay} Schedule`} description="Day view" delay={0.1}>
          <div className="space-y-2">
            {filteredSlots.map((slot, i) => (
              <motion.div
                key={slot.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`flex items-center gap-4 rounded-xl border p-4 ${isFree(slot) ? 'bg-muted/20' : 'hover:border-primary/30'}`}
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <span className="text-sm font-semibold text-primary">{slot.period}</span>
                </div>
                <div className="flex-1 min-w-0">
                  {isFree(slot) ? (
                    <p className="text-sm text-muted-foreground">Free Period</p>
                  ) : (
                    <>
                      <p className="text-sm font-medium">{slot.subject}</p>
                      <p className="text-xs text-muted-foreground">Grade {slot.classGrade}-{slot.section} · Room {slot.room}</p>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  {slot.time}
                </div>
              </motion.div>
            ))}
          </div>
        </SectionCard>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <SectionCard title="Schedule Summary" delay={0.2}>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Periods/Week</span>
              <span className="text-lg font-bold">{teacherTimetable.filter((s) => s.subject !== '—').length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Free Periods</span>
              <span className="text-lg font-bold">{teacherTimetable.filter((s) => s.subject === '—').length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Teaching Days</span>
              <span className="text-lg font-bold">5</span>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Subjects" delay={0.25}>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10"><BookOpen className="h-4 w-4 text-primary" /></div>
              <div><p className="text-sm font-medium">Mathematics</p><p className="text-xs text-muted-foreground">4 classes</p></div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-chart-2/10"><BookOpen className="h-4 w-4 text-chart-2" /></div>
              <div><p className="text-sm font-medium">Science</p><p className="text-xs text-muted-foreground">3 classes</p></div>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Quick Info" delay={0.3}>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">First period: 08:00 AM</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Last period: 02:30 PM</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Break: 10:15 - 10:30</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Lunch: 12:00 - 01:00</span>
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
