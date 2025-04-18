
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface Session {
  id: string;
  scheduled_time: string;
  status: string;
  points_amount: number;
  offering: {
    skill: string;
    description: string;
  };
  teacher_id: string;
  learner_id: string;
  cancelled_at?: string;
  cancelled_by?: string;
  cancellation_reason?: string;
  rating?: number;
  feedback?: string;
}

export const useUserSessions = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['userSessions', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('skill_sessions')
        .select(`
          *,
          offering:skill_offerings(skill, description)
        `)
        .or(`teacher_id.eq.${user?.id},learner_id.eq.${user?.id}`)
        .order('scheduled_time', { ascending: true });

      if (error) throw error;
      return (data || []) as unknown as Session[];
    },
    enabled: !!user,
  });
};
