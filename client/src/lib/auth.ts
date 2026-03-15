import { supabase } from './supabase';
import type { User, Session, AuthChangeEvent } from '@supabase/supabase-js';

// =====================
// Sign In with Google
// =====================
export async function signInWithGoogle(): Promise<void> {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });

  if (error) {
    console.error('[Auth] Google sign-in error:', error.message);
    throw error;
  }
}

// =====================
// Sign Out
// =====================
export async function signOut(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('[Auth] Sign out error:', error.message);
    throw error;
  }
}

// =====================
// Get current session
// =====================
export async function getSession(): Promise<Session | null> {
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    console.error('[Auth] Get session error:', error.message);
    return null;
  }
  return data.session;
}

// =====================
// Get current user
// =====================
export async function getCurrentUser(): Promise<User | null> {
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    return null;
  }
  return data.user;
}

// =====================
// Listen to auth state changes
// =====================
export function onAuthStateChange(
  callback: (event: AuthChangeEvent, session: Session | null) => void
) {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(callback);
  return subscription;
}

// =====================
// Sign in with email/password
// =====================
export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
}

// =====================
// Sign up with email/password
// =====================
export async function signUpWithEmail(email: string, password: string, fullName?: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
    },
  });
  if (error) throw error;
  return data;
}

// =====================
// Reset password
// =====================
export async function resetPassword(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset-password`,
  });
  if (error) throw error;
}
