'use client';

import { AuthProvider } from '@/components/auth-provider';
import { DashboardLayout } from '@/components/dashboard-layout';

export default function PrincipalLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <DashboardLayout allowedRoles={['principal']}>{children}</DashboardLayout>
    </AuthProvider>
  );
}
