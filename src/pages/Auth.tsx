
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
  const [isRedirecting, setIsRedirecting] = useState(false);

  React.useEffect(() => {
    if (!loading && user) {
      console.log('User authenticated in Auth page, checking profile and redirecting');
      setIsRedirecting(true);
      
      // Check if user has a username
      const checkUserProfile = async () => {
        try {
          const { data: profile } = await supabase
            .from('profiles')
            .select('username')
            .eq('id', user.id)
            .single();

          if (!profile?.username) {
            console.log('User needs username setup');
            setIsRedirecting(false);
            setShowUsernameSetup(true);
          } else {
            console.log('User has profile, redirecting to home');
            navigate('/', { replace: true });
          }
        } catch (error) {
          console.error('Error checking user profile:', error);
          // If there's an error, just navigate to home
          console.log('Profile check failed, redirecting to home anyway');
          navigate('/', { replace: true });
        }
      };

      checkUserProfile();
    }
  }, [user, loading, navigate]);

  // Show loading state while checking auth or redirecting
  if (loading || isRedirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">
            {loading ? 'Loading...' : 'Redirecting...'}
          </p>
        </div>
      </div>
    );
  }

  // If user is already authenticated but we're not redirecting, don't show auth form
  if (user && !showUsernameSetup) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Preparing your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full mx-4">
        {!showUsernameSetup && <AuthForm />}
      </div>
      <UsernameSetupDialog 
        isOpen={showUsernameSetup} 
        onComplete={() => {
          console.log('Username setup completed, redirecting to home');
          setShowUsernameSetup(false);
          navigate('/', { replace: true });
        }} 
      />
    </div>
  );
};

export default Auth;
