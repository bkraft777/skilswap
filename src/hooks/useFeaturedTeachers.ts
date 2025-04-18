
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type FeaturedTeacher = Database['public']['Tables']['featured_teachers']['Row'];

export const useFeaturedTeachers = () => {
  return useQuery({
    queryKey: ['featuredTeachers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('featured_teachers')
        .select('*')
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as FeaturedTeacher[];
    }
  });
};
