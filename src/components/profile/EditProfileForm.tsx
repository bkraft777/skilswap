
import React, { useEffect, useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Form } from '@/components/ui/form';
import { ProfileFormFields } from './ProfileFormFields';
import { useProfileForm, ProfileFormValues } from '@/hooks/useProfileForm';
import { AvailabilityStatus, Skill, Interest, SKILLS, INTERESTS } from '@/lib/constants';
import { Database } from '@/integrations/supabase/types';

type Profile = Database['public']['Tables']['profiles']['Row'];
type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

const EditProfileForm = () => {
  const [user, setUser] = React.useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const form = useProfileForm();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          console.log("Fetched user:", user.id);
          setUser(user);
          
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single<Profile>();

          if (error) {
            console.error("Error fetching profile:", error);
            toast({
              title: "Error",
              description: "Could not fetch profile: " + error.message,
              variant: "destructive",
            });
            return;
          }

          // Add null check to ensure data is not undefined
          if (data) {
            console.log("Fetched profile data:", data);
            const profileData = data;
            
            const availability = (profileData.availability_status as AvailabilityStatus) || 'messaging';
            
            const validSkills = Array.isArray(profileData.skills) 
              ? profileData.skills.filter((skill): skill is Skill => 
                  SKILLS.includes(skill as Skill)
                ) 
              : [];
              
            const validInterests = Array.isArray(profileData.interests) 
              ? profileData.interests.filter((interest): interest is Interest => 
                  INTERESTS.includes(interest as Interest)
                ) 
              : [];
            
            form.reset({
              username: profileData.username || '',
              bio: profileData.bio || '',
              skills: validSkills,
              interests: validInterests,
              availability_status: availability,
            });
          } else {
            console.log("No profile data found for user");
          }
        }
      } catch (err) {
        console.error("Unexpected error in fetchUserProfile:", err);
      }
    };

    fetchUserProfile();
  }, []);

  const onSubmit = async (values: ProfileFormValues) => {
    if (!user) {
      toast({
        title: "Error",
        description: "User not authenticated. Please login again.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    console.log("Submitting profile update with values:", values);

    try {
      const updateData: ProfileUpdate = {
        username: values.username || null,
        bio: values.bio || null,
        skills: values.skills || null,
        interests: values.interests || null,
        availability_status: values.availability_status || 'messaging',
        updated_at: new Date().toISOString(),
      };

      console.log("Update data being sent to Supabase:", updateData);

      const { data, error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id)
        .select();

      if (error) {
        console.error("Error updating profile:", error);
        throw error;
      }

      console.log("Profile update response:", data);
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error: any) {
      console.error("Profile update failed:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Edit Profile</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <ProfileFormFields form={form} />
          <Button 
            type="submit" 
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Updating..." : "Update Profile"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default EditProfileForm;
