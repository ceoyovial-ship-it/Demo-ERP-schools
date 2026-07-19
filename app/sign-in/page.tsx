'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, GraduationCap, Loader2, Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/components/auth-provider';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { DEMO_ACCOUNTS, ROLE_DASHBOARD_PATHS } from '@/lib/types';
import type { UserRole } from '@/lib/types';

const signInSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type SignInValues = z.infer<typeof signInSchema>;

export default function SignInPage() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: SignInValues) => {
    setLoading(true);
    const { error, role } = await signIn(data.email, data.password);
    if (error) {
      toast.error(error);
      setLoading(false);
      return;
    }
    toast.success('Welcome back to Yovial School ERP');
    if (role) {
      router.replace(ROLE_DASHBOARD_PATHS[role as UserRole]);
    } else {
      toast.error('Could not determine your role. Please contact an administrator.');
      setLoading(false);
    }
  };

  const fillDemoAccount = (email: string, password: string) => {
    setValue('email', email);
    setValue('password', password);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Animated gradient background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute -left-1/4 top-0 h-[600px] w-[600px] rounded-full bg-primary/15 blur-[120px]" />
        <div className="absolute right-0 top-1/4 h-[500px] w-[500px] rounded-full bg-chart-2/10 blur-[120px]" />
        <div className="absolute bottom-0 left-1/3 h-[400px] w-[400px] rounded-full bg-chart-3/10 blur-[100px]" />
      </div>

      {/* Grid overlay */}
      <div
        className="absolute inset-0 -z-10 opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage:
            'linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <div className="flex min-h-screen items-center justify-center px-4 py-8">
        <div className="w-full max-w-5xl">
          {/* Top bar */}
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
                <GraduationCap className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold tracking-tight">Yovial</span>
            </div>
            <ThemeToggle />
          </div>

          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            {/* Left: Branding & illustration */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="hidden lg:flex lg:flex-col lg:justify-center"
            >
              <div className="mb-6">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Enterprise School Management
                </span>
              </div>
              <h1 className="text-4xl font-bold leading-tight tracking-tight">
                Manage your entire school
                <br />
                <span className="gradient-text">from one platform</span>
              </h1>
              <p className="mt-4 max-w-md text-base text-muted-foreground">
                A unified ERP for admissions, attendance, academics, fees, and
                communication — built for principals, teachers, students, and
                parents.
              </p>

              {/* Feature highlights */}
              <div className="mt-8 grid grid-cols-2 gap-4">
                {[
                  { label: 'Role-based access', value: '5 roles' },
                  { label: 'Real-time analytics', value: 'Live data' },
                  { label: 'Fee management', value: 'Built-in' },
                  { label: 'Academic tracking', value: 'Full suite' },
                ].map((f) => (
                  <div
                    key={f.label}
                    className="rounded-xl border bg-card/50 p-4 backdrop-blur-sm"
                  >
                    <p className="text-sm font-medium">{f.label}</p>
                    <p className="text-xs text-muted-foreground">{f.value}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right: Sign-in card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="rounded-2xl border bg-card/80 p-8 shadow-premium-lg backdrop-blur-xl">
                {/* Mobile logo */}
                <div className="mb-6 flex items-center gap-2.5 lg:hidden">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
                    <GraduationCap className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <span className="text-lg font-bold tracking-tight">Yovial School ERP</span>
                </div>

                <div className="mb-6">
                  <h2 className="text-xl font-bold">Sign in to your account</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Enter your credentials to access the dashboard
                  </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  {/* Email */}
                  <div className="space-y-1.5">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@yovialschool.edu.in"
                        className="h-11 pl-10"
                        {...register('email')}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-xs text-destructive">{errors.email.message}</p>
                    )}
                  </div>

                  {/* Password */}
                  <div className="space-y-1.5">
                    <label htmlFor="password" className="text-sm font-medium">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        className="h-11 pl-10 pr-10"
                        {...register('password')}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-xs text-destructive">{errors.password.message}</p>
                    )}
                  </div>

                  {/* Remember + Forgot */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Checkbox id="remember" />
                      <label htmlFor="remember" className="text-sm text-muted-foreground">
                        Remember me
                      </label>
                    </div>
                    <button
                      type="button"
                      onClick={() => toast.info('Contact your administrator to reset your password.')}
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>

                  {/* Submit */}
                  <Button
                    type="submit"
                    disabled={loading}
                    className="h-11 w-full text-sm font-medium"
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        Sign In
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>

                {/* Demo accounts */}
                <div className="mt-6 border-t pt-5">
                  <p className="mb-3 text-xs font-medium text-muted-foreground">
                    Quick demo login — click to fill credentials
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {DEMO_ACCOUNTS.map((acc) => (
                      <button
                        key={acc.email}
                        onClick={() => fillDemoAccount(acc.email, acc.password)}
                        className="group rounded-lg border bg-background px-3 py-1.5 text-xs font-medium transition-all hover:border-primary hover:bg-primary/5"
                      >
                        <span className="text-foreground">{acc.label}</span>
                      </button>
                    ))}
                  </div>
                  <p className="mt-3 text-xs text-muted-foreground">
                    Click any account to autofill its credentials. Student accounts have individual passwords.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
