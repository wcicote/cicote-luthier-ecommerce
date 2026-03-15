import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { signInWithGoogle, signOut as authSignOut } from '@/lib/auth';

// =====================
// Types
// =====================
interface AuthContextValue {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAuthenticated: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

// =====================
// Context
// =====================
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// =====================
// Provider
// =====================
export function SupabaseAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async () => {
    await signInWithGoogle();
  };

  const signOut = async () => {
    await authSignOut();
    setUser(null);
    setSession(null);
  };

  const value: AuthContextValue = {
    user,
    session,
    loading,
    isAuthenticated: !!user,
    signIn,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// =====================
// Hook
// =====================
export function useSupabaseAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useSupabaseAuth must be used within a SupabaseAuthProvider');
  }
  return context;
}
