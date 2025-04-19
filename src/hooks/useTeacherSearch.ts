
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useTeacherSearch = (userId: string | undefined) => {
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const searchTeachers = async (selectedSkill: string, specificNeed: string) => {
    if (!userId) {
      toast({
        title: "Authentication required",
        description: "Please sign in to search for teachers",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }

    if (!selectedSkill || !specificNeed.trim()) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);

    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', userId)
        .single();

      if (profileError) throw profileError;

      const learnerName = profileData?.username || 'A learner';

      const { data: teachers, error: teachersError } = await supabase
        .from('profiles')
        .select('id, username')
        .contains('skills', [selectedSkill]);

      if (teachersError) throw teachersError;

      if (!teachers || teachers.length === 0) {
        toast({
          title: "No teachers found",
          description: `No teachers are currently available for ${selectedSkill}. Please try another skill or check back later.`,
          variant: "destructive",
        });
        return;
      }

      const { data: requestData, error: requestError } = await supabase
        .from('skill_help_requests')
        .insert({
          learner_id: userId,
          skill_category: selectedSkill,
          specific_need: specificNeed,
          status: 'pending'
        })
        .select()
        .single();

      if (requestError) throw requestError;

      const notificationPromises = teachers.map(teacher => 
        supabase
          .from('teacher_notifications')
          .insert({
            teacher_id: teacher.id,
            message: `${learnerName} is looking for help with ${specificNeed} in ${selectedSkill}`,
            request_id: requestData.id,
            status: 'unread'
          })
      );

      await Promise.all(notificationPromises);

      toast({
        title: "Request sent!",
        description: `Your request for help with ${specificNeed} has been sent to ${teachers.length} teacher${teachers.length === 1 ? '' : 's'}.`,
      });

      navigate(`/waiting-room/${requestData.id}`);
    } catch (error) {
      console.error("Error searching for teachers:", error);
      toast({
        title: "Error",
        description: "An error occurred while searching for teachers. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  return {
    isSearching,
    searchTeachers,
  };
};
