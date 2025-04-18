
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useBookSession = () => {
  const [error, setError] = useState<string | null>(null);

  const { mutate: bookSession, isPending } = useMutation({
    mutationFn: async ({ offeringId, scheduledTime }: { offeringId: string, scheduledTime: string }) => {
      const { data, error } = await supabase.rpc('book_skill_session', {
        p_offering_id: offeringId,
        p_scheduled_time: scheduledTime,
      });

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  return {
    bookSession,
    isPending,
    error,
    setError,
  };
};
