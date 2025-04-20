
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from '@/components/ui/use-toast';
import { Teacher } from '@/types/teacher-stats';

// Hardcoded username mappings
const USER_NAME_MAPPINGS: Record<string, string> = {
  'userdf30febe': 'Bernie72',
  'userdf30febe': 'Peg55'
};

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
      
      // Get approved teacher applications
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
      
      // Get profiles with usernames and skills in a separate query
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
      
      // Create a map of user_id to username from profiles for quick lookups
      const userIdToUsername = new Map();
      if (profilesWithSkills && profilesWithSkills.length > 0) {
        profilesWithSkills.forEach(profile => {
          if (profile.username) {
            userIdToUsername.set(profile.id, profile.username);
          }
        });
      }
      
      // Add approved application teachers with usernames if available
      if (applicationTeachers && applicationTeachers.length > 0) {
        console.log(`Found ${applicationTeachers.length} approved teachers from applications`);
        allTeachers.push(...applicationTeachers.map(teacher => {
          // Check if there's a hardcoded username mapping, otherwise use the default logic
          const mappedUsername = USER_NAME_MAPPINGS[teacher.user_id] || 
            userIdToUsername.get(teacher.user_id) || 
            teacher.full_name || 
            `Teacher-${teacher.user_id.substring(0, 4)}`;
          
          return {
            name: mappedUsername,
            skills: teacher.expertise,
            id: teacher.user_id
          };
        }));
      } else {
        console.log('No approved teachers found in applications');
      }
      
      // Add teachers from profiles with skills
      if (profilesWithSkills && profilesWithSkills.length > 0) {
        console.log(`Found ${profilesWithSkills.length} profiles with skills`);
        // Only add profiles that have skills and a username
        allTeachers.push(...profilesWithSkills
          .filter(profile => profile.skills && profile.skills.length > 0 && profile.username)
          .map(profile => {
            // Check if there's a hardcoded username mapping
            const mappedUsername = USER_NAME_MAPPINGS[profile.id] || profile.username;
            return {
              name: mappedUsername,
              skills: profile.skills || [],
              id: profile.id
            };
          })
        );
      }
      
      console.log('Combined teachers (before deduplication):', allTeachers);
      
      // Return the combined list, with duplicates removed based on ID
      const uniqueTeachers = allTeachers.filter((teacher, index, self) =>
        index === self.findIndex(t => t.id === teacher.id)
      );
      
      console.log('Final teachers list:', uniqueTeachers);
      return uniqueTeachers;
    },
    refetchInterval: 5000
  });
};

