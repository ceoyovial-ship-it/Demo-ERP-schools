'use client';

import { AuthProvider } from '@/components/auth-provider';
import { DashboardLayout } from '@/components/dashboard-layout';

export default function ReceptionLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <DashboardLayout allowedRoles={['receptionist']}>{children}</DashboardLayout>
    </AuthProvider>
  );
}
