
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import AuthForm from '@/components/auth/AuthForm';
import { useToast } from '@/hooks/use-toast';
import { UsernameSetupDialog } from '@/components/auth/UsernameSetupDialog';

const Auth = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const [showUsernameSetup, setShowUsernameSetup] = useState(false);

  React.useEffect(() => {
    if (!loading && user) {
      console.log('User authenticated, checking profile');
      
      // Check if user has a username
      const checkUserProfile = async () => {
        try {
          const { data: profile } = await supabase
            .from('profiles')
            .select('username')
            .eq('id', user.id)
            .single();

          if (!profile?.username) {
            setShowUsernameSetup(true);
          } else {
            navigate('/', { replace: true });
          }
        } catch (error) {
          console.error('Error checking user profile:', error);
          // If there's an error, just navigate to home
          navigate('/', { replace: true });
        }
      };

      checkUserProfile();
    }
  }, [user, loading, navigate]);

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is already authenticated, don't show the form
  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full mx-4">
        <AuthForm />
      </div>
      <UsernameSetupDialog 
        isOpen={showUsernameSetup} 
        onComplete={() => {
          setShowUsernameSetup(false);
          navigate('/', { replace: true });
        }} 
      />
    </div>
  );
};

export default Auth;
