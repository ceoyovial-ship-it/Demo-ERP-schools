'use client';

import { AuthProvider } from '@/components/auth-provider';
import { DashboardLayout } from '@/components/dashboard-layout';

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <DashboardLayout allowedRoles={['teacher']}>{children}</DashboardLayout>
    </AuthProvider>
  );
}
