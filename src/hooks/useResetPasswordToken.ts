
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from '@/hooks/use-toast';

export const useResetPasswordToken = () => {
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);
  const { toast } = useToast();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const validateResetToken = async () => {
      console.log('Validating password reset token');
      
      // Check if we have the required parameters for password reset
      const accessToken = searchParams.get('access_token');
      const refreshToken = searchParams.get('refresh_token');
      const type = searchParams.get('type');

      if (!accessToken || !refreshToken || type !== 'recovery') {
        console.log('Missing or invalid reset parameters');
        setIsValidToken(false);
        return;
      }

      try {
        // Set the session with the tokens from the URL
        const { data, error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (error) {
          console.error('Token validation error:', error);
          setIsValidToken(false);
          toast({
            title: "Invalid Reset Link",
            description: "This password reset link is invalid or has expired.",
            variant: "destructive",
          });
        } else {
          console.log('Token validated successfully');
          setIsValidToken(true);
        }
      } catch (error) {
        console.error('Error validating reset token:', error);
        setIsValidToken(false);
        toast({
          title: "Error",
          description: "An error occurred while validating the reset link.",
          variant: "destructive",
        });
      }
    };

    validateResetToken();
  }, [searchParams, toast]);

  return { isValidToken };
};
