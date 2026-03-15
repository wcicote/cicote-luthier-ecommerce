import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { supabase } from '@/lib/supabase';

/**
 * Callback page for Supabase OAuth (Google).
 * Handles the redirect after Google login and sends user to home.
 */
export default function AuthCallback() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    const handleCallback = async () => {
      const { error } = await supabase.auth.getSession();
      if (error) {
        console.error('[AuthCallback] Error handling callback:', error.message);
      }
      // Redirect to home regardless (session will be picked up by AuthContext)
      setLocation('/');
    };

    handleCallback();
  }, [setLocation]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="w-12 h-12 bg-primary rounded-sm flex items-center justify-center mx-auto mb-4 animate-pulse">
          <span className="text-primary-foreground font-display font-bold text-xl">C</span>
        </div>
        <p className="text-muted-foreground">Finalizando login...</p>
      </div>
    </div>
  );
}
