
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

type Teacher = {
  name: string;
  skills: string[];
  id?: string; // Add ID for navigation
};

const TeacherStats = () => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const { data: teachers, isLoading, error, refetch } = useQuery({
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
          id: teacher.user_id // Use user_id as the teacher's ID
        })));
      } else {
        console.log('No approved teachers found in applications');
      }
      
      // Add teachers from profiles with skills - ensure we use usernames
      if (profilesWithSkills && profilesWithSkills.length > 0) {
        console.log(`Found ${profilesWithSkills.length} profiles with skills`);
        allTeachers.push(...profilesWithSkills
          .filter(profile => profile.skills && profile.skills.length > 0)
          .map(profile => ({
            name: profile.username || 
                   (applicationTeachers?.find(t => t.user_id === profile.id)?.full_name) || 
                   `Teacher ${profile.id.substring(0, 4)}`,
            skills: profile.skills || [],
            id: profile.id // Add profile ID for navigation
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
    // Refresh every 5 seconds to ensure fresh data
    refetchInterval: 5000
  });

  // Force an initial refetch on component mount to ensure data is fresh
  useEffect(() => {
    const initialFetch = async () => {
      console.log('Forcing initial refresh of teacher data');
      await refetch();
    };
    
    initialFetch();
  }, [refetch]);

  // Handle teacher click to start a session
  const handleTeacherClick = async (teacher: Teacher) => {
    console.log('Teacher clicked:', teacher.name);
    
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to connect with a teacher",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }

    if (!teacher.id) {
      toast({
        title: "Connection error",
        description: "Unable to connect with this teacher. Please try another teacher.",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log('Starting connection process with teacher:', teacher.name, 'ID:', teacher.id);

      // Create a help request
      const { data: requestData, error: requestError } = await supabase
        .from('skill_help_requests')
        .insert({
          learner_id: user.id,
          skill_category: teacher.skills[0] || 'General',
          specific_need: 'Live help session',
          status: 'pending'
        })
        .select()
        .single();

      if (requestError) {
        console.error('Error creating help request:', requestError);
        throw requestError;
      }

      console.log('Help request created:', requestData);

      // Create a teacher connection
      const { data: connectionData, error: connectionError } = await supabase
        .from('teacher_connections')
        .insert({
          teacher_id: teacher.id,
          request_id: requestData.id,
          status: 'connected'
        })
        .select();

      if (connectionError) {
        console.error('Error creating teacher connection:', connectionError);
        throw connectionError;
      }

      console.log('Teacher connection created:', connectionData);

      // Navigate to waiting room
      toast({
        title: "Connection initiated",
        description: `Connecting you with ${teacher.name}`,
      });
      
      console.log('Navigating to waiting room with request ID:', requestData.id);
      navigate(`/waiting-room/${requestData.id}`);
    } catch (error) {
      console.error('Error connecting with teacher:', error);
      toast({
        title: "Connection failed",
        description: "Failed to connect with teacher. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) return <TeacherListSkeleton />;
  if (error) return <div className="text-red-500">Error loading teachers</div>;

  return (
    <div className={`p-4 bg-white rounded-lg shadow-sm ${isMobile ? 'w-full' : ''}`}>
      <h2 className="text-xl font-bold mb-4">Available Teachers ({teachers?.length || 0})</h2>
      
      {!teachers || teachers.length === 0 ? (
        <p className="text-gray-500">
          No approved teachers are currently available. Check back soon!
        </p>
      ) : (
        <div className="space-y-3">
          {teachers.map((teacher, index) => (
            <div 
              key={index} 
              className="p-3 border rounded-md hover:bg-gray-50 cursor-pointer transition-colors active:bg-gray-100"
              onClick={() => handleTeacherClick(teacher)}
              onTouchStart={() => console.log('Touch start on teacher:', teacher.name)}
              onTouchEnd={() => console.log('Touch end on teacher:', teacher.name)}
              role="button"
              aria-label={`Connect with ${teacher.name}`}
              tabIndex={0}
            >
              <p className="font-medium break-words">{teacher.name}</p>
              {teacher.skills && teacher.skills.length > 0 ? (
                <div className="mt-1 flex flex-wrap gap-1">
                  {teacher.skills.map((skill, skillIndex) => (
                    <Badge key={skillIndex} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-500 mt-1">No skills specified</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const TeacherListSkeleton = () => (
  <div className="p-4 bg-white rounded-lg shadow-sm">
    <Skeleton className="h-7 w-48 mb-4" />
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="p-3 border rounded-md">
          <Skeleton className="h-5 w-32 mb-2" />
          <div className="flex gap-1">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default TeacherStats;
