import { getLoginUrl } from "@/const";
import { useCallback, useEffect, useMemo } from "react";
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";
import { useLocation } from "wouter";

type UseAuthOptions = {
  redirectOnUnauthenticated?: boolean;
  redirectPath?: string;
};

export function useAuth(options?: UseAuthOptions) {
  const { redirectOnUnauthenticated = false, redirectPath = getLoginUrl() } =
    options ?? {};
  
  const { user, session, loading, isAuthenticated, signOut } = useSupabaseAuth();
  const [, setLocation] = useLocation();

  const logout = useCallback(async () => {
    await signOut();
    setLocation(redirectPath);
  }, [signOut, setLocation, redirectPath]);

  const state = useMemo(() => {
    if (!user) return { user: null, session: null, loading, isAuthenticated: false };
    
    // Map Supabase user to a slightly more convenient format for the frontend
    const mappedUser = {
      ...user,
      name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'Usuário',
      avatar: user.user_metadata?.avatar_url,
    };

    return {
      user: mappedUser,
      session,
      loading,
      isAuthenticated,
    };
  }, [user, session, loading, isAuthenticated]);

  useEffect(() => {
    if (!redirectOnUnauthenticated) return;
    if (loading) return;
    if (state.user) return;
    if (typeof window === "undefined") return;
    
    // Convert redirectPath to a relative path for wouter if it's absolute
    const targetPath = redirectPath.startsWith('http') 
      ? new URL(redirectPath).pathname 
      : redirectPath;

    if (window.location.pathname === targetPath) return;

    setLocation(targetPath);
  }, [
    redirectOnUnauthenticated,
    redirectPath, // Use redirectPath here, targetPath is derived inside the effect or moved out
    loading,
    state.user,
    setLocation
  ]);

  return {
    ...state,
    refresh: () => {}, // Supabase handles this automatically
    logout,
  };
}
