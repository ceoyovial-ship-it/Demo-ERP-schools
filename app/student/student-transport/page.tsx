'use client';

import { motion } from 'framer-motion';
import { Bus, Clock, MapPin, User, Phone, Wallet } from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import { SectionCard } from '@/components/section-card';
import { StatCard } from '@/components/stat-card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/components/auth-provider';
import { getStudentKey, studentTransport } from '@/lib/student-data';

export default function StudentTransportPage() {
  const { profile } = useAuth();
  const key = getStudentKey(profile?.email?.split('@')[0]);
  const transport = studentTransport[key];

  return (
    <div className="space-y-6">
      <PageHeader title="Transport" description="Your bus route and transport details" />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="Route" value={transport.routeNumber} icon={Bus} delay={0} />
        <StatCard title="Pickup Time" value={transport.pickupTime} icon={Clock} delay={0.05} />
        <StatCard title="Fare" value={`₹${transport.fare.toLocaleString('en-IN')}`} icon={Wallet} delay={0.1} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="Route Details" description="Your assigned bus route" delay={0.1}>
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="rounded-xl border p-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10"><Bus className="h-6 w-6 text-primary" /></div>
                <div><p className="text-lg font-bold">{transport.routeName}</p><p className="text-sm text-muted-foreground">Route {transport.routeNumber} · {transport.vehicleNumber}</p></div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="flex items-center gap-3"><MapPin className="h-4 w-4 text-muted-foreground" /><div><p className="text-xs text-muted-foreground">Pickup Point</p><p className="text-sm font-medium">{transport.pickupPoint}</p></div></div>
                <div className="flex items-center gap-3"><Clock className="h-4 w-4 text-muted-foreground" /><div><p className="text-xs text-muted-foreground">Pickup Time</p><p className="text-sm font-medium">{transport.pickupTime}</p></div></div>
                <div className="flex items-center gap-3"><Clock className="h-4 w-4 text-muted-foreground" /><div><p className="text-xs text-muted-foreground">Drop Time</p><p className="text-sm font-medium">{transport.dropTime}</p></div></div>
                <div className="flex items-center gap-3"><Wallet className="h-4 w-4 text-muted-foreground" /><div><p className="text-xs text-muted-foreground">Quarterly Fare</p><p className="text-sm font-medium">₹{transport.fare.toLocaleString('en-IN')}</p></div></div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={transport.status === 'active' ? 'default' : 'secondary'} className="capitalize">{transport.status}</Badge>
              <span className="text-xs text-muted-foreground">Transport service is {transport.status}</span>
            </div>
          </motion.div>
        </SectionCard>

        <SectionCard title="Driver & Contact" description="Bus driver information" delay={0.15}>
          <div className="space-y-4">
            <div className="flex items-center gap-4 rounded-xl border p-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">{transport.driver.split(' ').map((n) => n[0]).join('').toUpperCase()}</div>
              <div><p className="text-base font-bold">{transport.driver}</p><p className="text-sm text-muted-foreground">Bus Driver · Route {transport.routeNumber}</p></div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3 rounded-xl border p-3"><User className="h-4 w-4 text-muted-foreground" /><div><p className="text-xs text-muted-foreground">Driver Name</p><p className="text-sm font-medium">{transport.driver}</p></div></div>
              <div className="flex items-center gap-3 rounded-xl border p-3"><Phone className="h-4 w-4 text-muted-foreground" /><div><p className="text-xs text-muted-foreground">Driver Phone</p><p className="text-sm font-medium">{transport.driverPhone}</p></div></div>
              <div className="flex items-center gap-3 rounded-xl border p-3"><Bus className="h-4 w-4 text-muted-foreground" /><div><p className="text-xs text-muted-foreground">Vehicle Number</p><p className="text-sm font-medium">{transport.vehicleNumber}</p></div></div>
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
