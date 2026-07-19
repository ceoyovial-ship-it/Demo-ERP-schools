'use client';

import { AuthProvider } from '@/components/auth-provider';
import { DashboardLayout } from '@/components/dashboard-layout';
import { ParentChildSelector } from '@/components/parent-child-selector';

export default function ParentLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <DashboardLayout allowedRoles={['parent']}>
        <ParentChildSelector>{children}</ParentChildSelector>
      </DashboardLayout>
    </AuthProvider>
  );
}
