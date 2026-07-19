'use client';

import { motion } from 'framer-motion';
import { ShieldX, ArrowLeft, GraduationCap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';

export default function AccessDeniedPage() {
  const router = useRouter();

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/4 top-1/4 h-[500px] w-[500px] rounded-full bg-destructive/10 blur-[120px]" />
        <div className="absolute right-1/4 bottom-1/4 h-[400px] w-[400px] rounded-full bg-accent/10 blur-[100px]" />
      </div>

      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col items-center px-6 text-center"
      >
        <div className="relative mb-8">
          <div className="absolute inset-0 rounded-full bg-destructive/20 blur-xl" />
          <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-destructive/10">
            <ShieldX className="h-10 w-10 text-destructive" />
          </div>
        </div>

        <h1 className="text-3xl font-bold tracking-tight">Access Denied</h1>
        <p className="mt-2 max-w-md text-base text-muted-foreground">
          You don't have permission to access this page. Your role does not include
          the required privileges. Please contact your administrator if you believe
          this is an error.
        </p>

        <div className="mt-8 flex items-center gap-3">
          <Button variant="outline" onClick={() => router.push('/sign-in')} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Sign In
          </Button>
          <Button onClick={() => router.push('/')} className="gap-2">
            <GraduationCap className="h-4 w-4" />
            Go Home
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
