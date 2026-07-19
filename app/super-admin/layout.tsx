'use client';

import { AuthProvider } from '@/components/auth-provider';
import { DashboardLayout } from '@/components/dashboard-layout';

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <DashboardLayout allowedRoles={['superadmin']}>{children}</DashboardLayout>
    </AuthProvider>
  );
}
