'use client';

import Link from 'next/link';
import { GraduationCap, ArrowLeft, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6">
      <div className="flex max-w-md flex-col items-center gap-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary">
          <GraduationCap className="h-8 w-8 text-primary-foreground" />
        </div>
        <div>
          <p className="text-6xl font-bold tracking-tight text-primary">404</p>
          <h1 className="mt-2 text-xl font-semibold">Page Not Found</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            The page you are looking for doesn&apos;t exist or has been moved.
            Let&apos;s get you back on track.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
          <Link href="/sign-in">
            <Button>
              <Home className="h-4 w-4" />
              Back to Login
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
