
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useTeacherApplications = () => {
  const { toast } = useToast();
  const [processingId, setProcessingId] = useState<string | null>(null);

  const { data: applications, isLoading, error, refetch } = useQuery({
    queryKey: ['teacherApplications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('teacher_applications')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const handleApplicationUpdate = async (id: string, status: 'approved' | 'rejected') => {
    try {
      setProcessingId(id);
      console.log(`Starting approval process for application ${id}, setting status to ${status}`);
      
      // Update the application status in the database
      const { error: updateError } = await supabase
        .from('teacher_applications')
        .update({ status })
        .eq('id', id);

      if (updateError) {
        console.error('Error updating application status:', updateError);
        throw updateError;
      }
      
      console.log(`Successfully updated application ${id} status to ${status}`);

      // Also add user to profiles table if they don't exist already
      if (status === 'approved') {
        const application = applications?.find(app => app.id === id);
        if (application && application.user_id) {
          console.log('Updating profile for user:', application.user_id);
          
          // Get the profile first to check if it exists
          const { data: profileExists, error: profileCheckError } = await supabase
            .from('profiles')
            .select('id')
            .eq('id', application.user_id);
            
          if (profileCheckError) {
            console.error('Error checking if profile exists:', profileCheckError);
          }
          
          console.log('Profile check result:', profileExists);
          
          // Update or insert profile with expertise
          if (profileExists && profileExists.length > 0) {
            console.log('Updating existing profile with skills:', application.expertise);
            const { data: updatedProfile, error: profileUpdateError } = await supabase
              .from('profiles')
              .update({ 
                skills: application.expertise 
              })
              .eq('id', application.user_id)
              .select();
              
            if (profileUpdateError) {
              console.error('Error updating profile skills:', profileUpdateError);
            } else {
              console.log('Profile updated successfully:', updatedProfile);
            }
          } else {
            console.log('Creating new profile with skills:', application.expertise);
            const { data: newProfile, error: profileInsertError } = await supabase
              .from('profiles')
              .insert({ 
                id: application.user_id,
                skills: application.expertise 
              })
              .select();
              
            if (profileInsertError) {
              console.error('Error creating profile:', profileInsertError);
            } else {
              console.log('New profile created successfully:', newProfile);
            }
          }
        }
      }

      toast({
        title: "Application Updated",
        description: `Teacher application ${status} successfully.`,
      });
      
      // Immediately refetch to update the UI with fresh data
      await refetch();
      
      // Force a component update by triggering a state change
      setProcessingId(null);
    } catch (error: any) {
      setProcessingId(null);
      console.error('Error in handleApplicationUpdate:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return {
    applications,
    isLoading,
    error,
    processingId,
    handleApplicationUpdate
  };
};
