
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

export interface SkillOffering {
  id: string;
  teacher_id: string;
  skill: string;
  description: string;
  experience_level: string;
  availability: string[];
  points_cost: number;
  created_at: string;
  is_active: boolean;
}

export const useSkillOfferings = () => {
  return useQuery({
    queryKey: ['skillOfferings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('skill_offerings')
        .select('*')
        .eq('is_active', true as any)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []) as unknown as SkillOffering[];
    }
  });
};
