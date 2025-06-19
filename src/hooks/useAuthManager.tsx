
import { useEffect, useState, useRef } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from '@supabase/supabase-js';

export const useAuthManager = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const authListenerRef = useRef<any>(null);
  const isInitialized = useRef(false);
  const initPromiseRef = useRef<Promise<void> | null>(null);

  useEffect(() => {
    // Prevent multiple initializations
    if (isInitialized.current || initPromiseRef.current) {
      console.log('Auth manager already initialized or initializing, skipping');
      return;
    }
    
    console.log('Initializing centralized auth manager');
    isInitialized.current = true;
    
    // Cleanup any existing listener
    if (authListenerRef.current) {
      console.log('Cleaning up existing auth listener');
      authListenerRef.current.subscription.unsubscribe();
    }

    const initializeAuth = async () => {
      try {
        // Set up auth state listener FIRST
        console.log('Setting up auth state listener');
        authListenerRef.current = supabase.auth.onAuthStateChange((event, newSession) => {
          console.log('Auth state changed:', event, newSession ? 'Session present' : 'No session');
          
          setSession(newSession);
          setUser(newSession?.user ?? null);
          
          // Handle specific auth events
          if (event === 'SIGNED_OUT') {
            console.log('User signed out, clearing auth state');
          } else if (event === 'SIGNED_IN') {
            console.log('User signed in successfully');
          } else if (event === 'TOKEN_REFRESHED') {
            console.log('Auth token refreshed');
          } else if (event === 'PASSWORD_RECOVERY') {
            console.log('Password recovery initiated');
          }
          
          setLoading(false);
        });

        // THEN get initial session
        console.log('Getting initial session');
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting initial session:', error);
        } else {
          console.log('Initial session:', initialSession ? 'Found' : 'Not found');
          setSession(initialSession);
          setUser(initialSession?.user ?? null);
        }
      } catch (error) {
        console.error('Error in auth initialization:', error);
      } finally {
        setLoading(false);
      }
    };

    // Store the initialization promise
    initPromiseRef.current = initializeAuth();

    // Cleanup function
    return () => {
      if (authListenerRef.current) {
        console.log('Cleaning up auth listener on unmount');
        authListenerRef.current.subscription.unsubscribe();
        authListenerRef.current = null;
      }
      isInitialized.current = false;
      initPromiseRef.current = null;
    };
  }, []);

  const signOut = async () => {
    console.log('Signing out user');
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Sign out error:', error);
        throw error;
      }
      console.log('User signed out successfully');
    } catch (error) {
      console.error('Error during sign out:', error);
      throw error;
    }
  };

  return { 
    user, 
    session, 
    loading,
    signOut
  };
};
