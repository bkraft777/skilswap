
import React, { useEffect } from 'react';
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
  const { toast } = useToast();
  const form = useProfileForm();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id as any)
          .single<Profile>();

        if (error) {
          toast({
            title: "Error",
            description: "Could not fetch profile",
            variant: "destructive",
          });
          return;
        }

        // Add null check to ensure data is not undefined
        if (data) {
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
        }
      }
    };

    fetchUserProfile();
  }, []);

  const onSubmit = async (values: ProfileFormValues) => {
    if (!user) return;

    try {
      // Create an object with the correct shape first, then cast to ProfileUpdate
      const updateData: {
        username: string | null;
        bio: string | null;
        skills: string[] | null;
        interests: string[] | null;
        availability_status: string;
      } = {
        username: values.username || null,
        bio: values.bio || null,
        skills: values.skills || null,
        interests: values.interests || null,
        availability_status: values.availability_status || 'messaging',
      };

      const { error } = await supabase
        .from('profiles')
        .update(updateData as unknown as ProfileUpdate)
        .eq('id', user.id as any);

      if (error) throw error;

      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Edit Profile</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <ProfileFormFields form={form} />
          <Button type="submit" className="w-full">Update Profile</Button>
        </form>
      </Form>
    </div>
  );
};

export default EditProfileForm;
