
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const useUsername = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const updateUsername = async (newUsername: string) => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('profiles')
        .update({ username: newUsername })
        .eq('id', (await supabase.auth.getUser()).data.user?.id);

      if (error) {
        if (error.code === '23505') {
          throw new Error('This username is already taken');
        }
        throw error;
      }

      toast({
        title: "Username updated",
        description: "Your profile has been updated successfully.",
      });
      
      return true;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    updateUsername,
    isLoading
  };
};
