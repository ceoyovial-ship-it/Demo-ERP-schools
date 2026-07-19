'use client';

import { AuthProvider } from '@/components/auth-provider';
import { DashboardLayout } from '@/components/dashboard-layout';

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <DashboardLayout allowedRoles={['student']}>{children}</DashboardLayout>
    </AuthProvider>
  );
}
