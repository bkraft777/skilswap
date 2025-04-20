
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import AuthForm from '@/components/auth/AuthForm';
import { useToast } from '@/components/ui/use-toast';
import { UsernameSetupDialog } from '@/components/auth/UsernameSetupDialog';

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showUsernameSetup, setShowUsernameSetup] = useState(false);

  React.useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN') {
        // Check if user has a username
        const { data: profile } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', session?.user?.id)
          .single();

        if (!profile?.username) {
          setShowUsernameSetup(true);
        } else {
          navigate('/');
        }
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full mx-4">
        <AuthForm />
      </div>
      <UsernameSetupDialog 
        isOpen={showUsernameSetup} 
        onComplete={() => {
          setShowUsernameSetup(false);
          navigate('/');
        }} 
      />
    </div>
  );
};

export default Auth;
