'use client';

import { useState } from 'react';
import { CalendarDays, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { upcomingEvents } from '@/lib/mock-data';

export function CalendarPopover() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg">
          <CalendarDays className="h-5 w-5" />
          <span className="sr-only">Open calendar</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          className="rounded-md border-0"
        />
        <Separator />
        <div className="p-3">
          <div className="flex items-center gap-2 px-1 pb-2">
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
            <h4 className="text-sm font-medium">Upcoming Events</h4>
          </div>
          <div className="max-h-48 overflow-y-auto">
            <ul className="space-y-1">
              {upcomingEvents.map((event) => (
                <li
                  key={event.id}
                  className="flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-muted/50"
                >
                  <div className="flex h-9 w-9 shrink-0 flex-col items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <span className="text-[10px] font-medium uppercase leading-none">
                      {event.date.split(' ')[0]}
                    </span>
                    <span className="text-sm font-bold leading-none">
                      {event.date.split(' ')[1].replace(',', '')}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {event.title}
                    </p>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3 shrink-0" />
                      <span>{event.time}</span>
                      <span aria-hidden>·</span>
                      <span className="truncate">{event.date}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
