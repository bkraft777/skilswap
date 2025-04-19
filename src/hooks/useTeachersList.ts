
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from '@/components/ui/use-toast';
import { Teacher } from '@/types/teacher-stats';

export const useTeachersList = () => {
  const { toast } = useToast();

  return useQuery({
    queryKey: ['availableTeachers'],
    queryFn: async () => {
      console.log('Fetching available teachers');
      
      // First try to get from featured_teachers table
      let { data: featuredTeachers, error: featuredError } = await supabase
        .from('featured_teachers')
        .select('name, skills, id')
        .eq('is_active', true);
      
      console.log('Featured teachers:', featuredTeachers);
      
      if (featuredError) {
        console.error('Error fetching featured teachers:', featuredError);
        toast({
          title: "Error",
          description: "Failed to load featured teachers. Please try again.",
          variant: "destructive",
        });
      }
      
      // Get from teacher_applications table where status is approved
      const { data: applicationTeachers, error: appError } = await supabase
        .from('teacher_applications')
        .select('id, full_name, expertise, user_id, status')
        .eq('status', 'approved');
      
      console.log('Approved application teachers query result:', applicationTeachers);
      
      if (appError) {
        console.error('Error fetching approved teachers:', appError);
        toast({
          title: "Error",
          description: "Failed to load approved teachers. Please try again.",
          variant: "destructive",
        });
        throw appError;
      }
      
      // Get profiles with skills
      const { data: profilesWithSkills, error: profilesError } = await supabase
        .from('profiles')
        .select('id, username, skills')
        .not('skills', 'is', null);
        
      console.log('Profiles with skills:', profilesWithSkills);
      
      if (profilesError) {
        console.error('Error fetching profiles with skills:', profilesError);
      }
      
      // Combine all sources of teachers
      const allTeachers: Teacher[] = [];
      
      // Add featured teachers if any
      if (featuredTeachers && featuredTeachers.length > 0) {
        allTeachers.push(...featuredTeachers.map(teacher => ({
          name: teacher.name,
          skills: teacher.skills,
          id: teacher.id
        })));
      }
      
      // Add approved application teachers
      if (applicationTeachers && applicationTeachers.length > 0) {
        console.log(`Found ${applicationTeachers.length} approved teachers from applications`);
        allTeachers.push(...applicationTeachers.map(teacher => ({
          name: teacher.full_name,
          skills: teacher.expertise,
          id: teacher.user_id
        })));
      } else {
        console.log('No approved teachers found in applications');
      }
      
      // Add teachers from profiles with skills
      if (profilesWithSkills && profilesWithSkills.length > 0) {
        console.log(`Found ${profilesWithSkills.length} profiles with skills`);
        allTeachers.push(...profilesWithSkills
          .filter(profile => profile.skills && profile.skills.length > 0)
          .map(profile => ({
            name: profile.username || 
                   (applicationTeachers?.find(t => t.user_id === profile.id)?.full_name) || 
                   `Teacher ${profile.id.substring(0, 4)}`,
            skills: profile.skills || [],
            id: profile.id
          }))
        );
      }
      
      console.log('Combined teachers (before deduplication):', allTeachers);
      
      // Return the combined list, with duplicates removed based on name
      const uniqueTeachers = allTeachers.filter((teacher, index, self) =>
        index === self.findIndex(t => t.name === teacher.name)
      );
      
      console.log('Final teachers list:', uniqueTeachers);
      return uniqueTeachers;
    },
    refetchInterval: 5000
  });
};
