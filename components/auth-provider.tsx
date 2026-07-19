'use client';

import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase-client';
import type { Database } from '@/lib/database-types';
import type { Profile, UserRole } from '@/lib/types';
import { ROLE_DASHBOARD_PATHS } from '@/lib/types';

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null; role?: UserRole }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const normalizeRole = (role?: string | null): UserRole | null => {
  if (!role) return null;
  if (role === 'super-admin' || role === 'superadmin') return 'superadmin';
  if (['principal', 'receptionist', 'teacher', 'student', 'parent'].includes(role)) {
    return role as UserRole;
  }
  return null;
};

const ensureSuperAdminSeed = async (email: string, password: string) => {
  const normalizedEmail = email.trim().toLowerCase();

  if (normalizedEmail !== 'superadmin@yovialschool.edu.in' || password !== 'admin123') {
    return { created: false };
  }

  try {
    const { error: functionError } = await supabase.functions.invoke('seed-demo-users');
    if (!functionError) {
      return { created: true };
    }
  } catch {
    // Fall through to the direct sign-up path if the function is unavailable.
  }

  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email: normalizedEmail,
    password,
  });

  if (signUpError) {
    return { created: false, error: signUpError.message };
  }

  const userId = signUpData.user?.id;
  if (!userId) {
    return { created: false, error: 'Unable to create Super Admin account.' };
  }

  const profilePayload: Database['public']['Tables']['profiles']['Insert'] = {
    id: userId,
    email: normalizedEmail,
    role: 'superadmin',
    full_name: 'Neha Verma',
    avatar_url: null,
    phone: null,
    active: true,
  };

  const profilesTable = supabase.from('profiles') as any;
  const { error: insertError } = await profilesTable.insert(profilePayload);

  if (insertError) {
    const isDuplicate = insertError.code === '23505' || insertError.message.includes('duplicate');
    if (!isDuplicate) {
      return { created: false, error: insertError.message };
    }

    const { error: updateError } = await profilesTable
      .update(profilePayload)
      .eq('id', userId);

    if (updateError) {
      return { created: false, error: updateError.message };
    }
  }

  return { created: true, userId };
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const profileFetchedFor = useRef<string | null>(null);

  const fetchProfile = useCallback(async (userId: string): Promise<Profile | null> => {
    try {
      const profilesTable = supabase.from('profiles') as any;
      const { data, error } = await profilesTable
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error.message);
        return null;
      }

      if (!data) return null;
      return {
        ...data,
        role: normalizeRole(data.role) ?? 'student',
      } as Profile;
    } catch (err) {
      console.error('Profile fetch exception:', err);
      return null;
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    if (user) {
      const p = await fetchProfile(user.id);
      setProfile(p);
    }
  }, [user, fetchProfile]);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!mounted) return;

        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          profileFetchedFor.current = session.user.id;
          const p = await fetchProfile(session.user.id);
          if (mounted) setProfile(p);
        }
      } catch (err) {
        console.error('Auth init error:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        (async () => {
          if (!mounted) return;
          setSession(session);
          setUser(session?.user ?? null);

          if (session?.user) {
            if (profileFetchedFor.current !== session.user.id) {
              profileFetchedFor.current = session.user.id;
              const p = await fetchProfile(session.user.id);
              if (mounted) setProfile(p);
            }
          } else {
            profileFetchedFor.current = null;
            if (mounted) setProfile(null);
          }

          if (mounted) setLoading(false);
        })();
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const normalizedEmail = email.trim().toLowerCase();
      const isSuperAdminDemoLogin = normalizedEmail === 'superadmin@yovialschool.edu.in' && password === 'admin123';

      if (isSuperAdminDemoLogin) {
        await ensureSuperAdminSeed(normalizedEmail, password);
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      });

      if (error) {
        if (isSuperAdminDemoLogin) {
          const seedResult = await ensureSuperAdminSeed(normalizedEmail, password);
          if (seedResult.created) {
            const retry = await supabase.auth.signInWithPassword({
              email: normalizedEmail,
              password,
            });
            if (retry.error) return { error: retry.error.message };

            if (retry.data.user) {
              profileFetchedFor.current = retry.data.user.id;
              const p = await fetchProfile(retry.data.user.id);
              setProfile(p);
              setSession(retry.data.session);
              setUser(retry.data.user);

              if (!p) {
                return { error: 'Profile not found. Please contact your administrator.' };
              }

              return { error: null, role: p.role };
            }
          }
        }

        return { error: error.message };
      }

      if (data.user) {
        profileFetchedFor.current = data.user.id;
        const p = await fetchProfile(data.user.id);
        setProfile(p);
        setSession(data.session);
        setUser(data.user);

        if (!p) {
          return { error: 'Profile not found. Please contact your administrator.' };
        }

        return { error: null, role: p.role };
      }

      return { error: 'Failed to sign in — no user returned.' };
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Sign in failed. Please try again.';
      return { error: msg };
    }
  }, [fetchProfile]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    profileFetchedFor.current = null;
    setSession(null);
    setUser(null);
    setProfile(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ session, user, profile, loading, signIn, signOut, refreshProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export function getDashboardPath(role: UserRole): string {
  return ROLE_DASHBOARD_PATHS[role];
}
