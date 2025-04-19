
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://qavxzwmkjpjbpbtxtoqb.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhdnh6d21ranBqYnBidHh0b3FiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5MjgwNzcsImV4cCI6MjA2MDUwNDA3N30.pT8vgleBdC-mBDi2CowLi0je1zOAjjE4QRA7-gU9BrM";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storage: window.localStorage,
    // Set the default redirect path after authentication
    redirectTo: window.location.origin + '/dashboard'
  }
});

