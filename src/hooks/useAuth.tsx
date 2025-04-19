
import { useEffect, useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from '@supabase/supabase-js';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const initializeSession = async () => {
      console.log('Initializing auth session');
      const { data: { session: initialSession } } = await supabase.auth.getSession();
      console.log('Initial session:', initialSession ? 'Found' : 'Not found');
      setSession(initialSession);
      setUser(initialSession?.user ?? null);
      setLoading(false);
    };

    initializeSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
      console.log('Auth state changed:', event);
      setSession(newSession);
      setUser(newSession?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { 
    user, 
    session, 
    loading,
    signOut: async () => {
      await supabase.auth.signOut();
    }
  };
};
