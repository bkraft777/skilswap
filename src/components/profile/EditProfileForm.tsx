
import React, { useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Form } from '@/components/ui/form';
import { ProfileFormFields } from './ProfileFormFields';
import { useProfileForm, ProfileFormValues } from '@/hooks/useProfileForm';
import { AvailabilityStatus, Skill, Interest, SKILLS, INTERESTS } from '@/lib/constants';

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
          .eq('id', user.id)
          .single();

        if (data) {
          // Ensure availability_status is a valid enum value
          const availability = data.availability_status as AvailabilityStatus || 'messaging';
          
          // Filter and validate skills and interests arrays to ensure they match our defined types
          const validSkills = Array.isArray(data.skills) 
            ? data.skills.filter((skill): skill is Skill => 
                SKILLS.includes(skill as Skill)
              ) 
            : [];
            
          const validInterests = Array.isArray(data.interests) 
            ? data.interests.filter((interest): interest is Interest => 
                INTERESTS.includes(interest as Interest)
              ) 
            : [];
          
          form.reset({
            username: data.username || '',
            bio: data.bio || '',
            skills: validSkills,
            interests: validInterests,
            availability_status: availability,
          });
        }

        if (error) {
          toast({
            title: "Error",
            description: "Could not fetch profile",
            variant: "destructive",
          });
        }
      }
    };

    fetchUserProfile();
  }, []);

  const onSubmit = async (values: ProfileFormValues) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          username: values.username,
          bio: values.bio,
          skills: values.skills,
          interests: values.interests,
          availability_status: values.availability_status || 'messaging',
        })
        .eq('id', user.id);

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
