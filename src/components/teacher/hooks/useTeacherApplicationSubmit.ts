
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { TeacherApplicationForm } from '../schema/teacherApplicationSchema';
import { Database } from '@/integrations/supabase/types';

type TeacherApplicationInsert = Database['public']['Tables']['teacher_applications']['Insert'];

export const useTeacherApplicationSubmit = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSubmit = async (data: TeacherApplicationForm) => {
    try {
      if (!user) {
        console.error("No authenticated user found");
        toast({
          title: "Authentication Required",
          description: "You must be logged in to submit a teacher application.",
          variant: "destructive",
        });
        navigate('/auth');
        return;
      }

      console.log("Current user ID:", user.id);
      console.log("Current user email:", user.email);
      console.log("Submitting teacher application with data:", data);

      if (!user.id) {
        console.error("User ID is missing or invalid");
        toast({
          title: "Authentication Error",
          description: "Your user account appears to be invalid. Please try logging out and back in.",
          variant: "destructive",
        });
        return;
      }

      const applicationData: TeacherApplicationInsert = {
        full_name: data.fullName,
        email: data.email,
        expertise: data.expertise,
        experience_years: data.experienceYears,
        teaching_style: data.teachingStyle,
        motivation: data.motivation,
        user_id: user.id,
        status: 'pending'
      };

      const { data: result, error } = await supabase
        .from('teacher_applications')
        .insert(applicationData)
        .select();

      if (error) {
        throw error;
      }

      const { error: profileError } = await supabase
        .from('profiles')
        .update({ skills: data.expertise })
        .eq('id', user.id);

      if (profileError) {
        console.warn("Error updating profile skills:", profileError);
      }

      toast({
        title: "Application Submitted!",
        description: "We'll review your application and get back to you soon.",
      });

      navigate('/');
    } catch (error: any) {
      let errorMessage = "Failed to submit application. Please try again.";
      
      if (error.message) {
        errorMessage = error.message;
        
        if (error.code === '23505') {
          errorMessage = "You have already submitted an application. Please wait for a response.";
        } else if (error.code === '23503') {
          errorMessage = "There was an issue linking your application to your account. Please try logging out and back in.";
        }
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  return { handleSubmit };
};
