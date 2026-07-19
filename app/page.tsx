'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, GraduationCap } from 'lucide-react';
import { AuthProvider, useAuth } from '@/components/auth-provider';
import { ROLE_DASHBOARD_PATHS } from '@/lib/types';

function RootRedirect() {
  const { profile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (profile) {
      router.replace(ROLE_DASHBOARD_PATHS[profile.role]);
    } else {
      router.replace('/sign-in');
    }
  }, [profile, loading, router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background">
      <div className="flex items-center gap-2.5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
          <GraduationCap className="h-5 w-5 text-primary-foreground" />
        </div>
        <span className="text-lg font-bold tracking-tight">Yovial School ERP</span>
      </div>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading...
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <AuthProvider>
      <RootRedirect />
    </AuthProvider>
  );
}
