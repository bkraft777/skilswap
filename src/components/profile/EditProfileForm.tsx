import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from "@/integrations/supabase/client";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { MultiSelect } from '@/components/ui/multi-select';

// Define predefined skills and interests
const SKILLS = [
  'Web Development', 'Mobile Development', 'Data Science', 
  'Design', 'Marketing', 'Writing', 'Photography'
];

const INTERESTS = [
  'Technology', 'Art', 'Music', 'Sports', 'Travel', 
  'Entrepreneurship', 'Personal Development'
];

// Define valid availability status options
const AVAILABILITY_STATUSES = ['live', 'messaging', 'busy', 'offline'] as const;
type AvailabilityStatus = typeof AVAILABILITY_STATUSES[number];

// Helper function to validate availability status
const isValidAvailabilityStatus = (status: string): status is AvailabilityStatus => {
  return AVAILABILITY_STATUSES.includes(status as AvailabilityStatus);
};

// Profile form schema
const profileSchema = z.object({
  username: z.string().min(2, 'Username must be at least 2 characters').optional(),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  skills: z.array(z.string()).optional(),
  interests: z.array(z.string()).optional(),
  availability_status: z.enum(AVAILABILITY_STATUSES).optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const EditProfileForm = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const { toast } = useToast();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: '',
      bio: '',
      skills: [],
      interests: [],
      availability_status: 'messaging', // Updated default
    },
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        
        // Fetch profile data
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (data) {
          setProfile(data);
          
          // Ensure availability_status is valid
          let status = data.availability_status || 'messaging';
          if (!isValidAvailabilityStatus(status)) {
            status = 'messaging'; // Fallback to default if invalid
          }

          form.reset({
            username: data.username || '',
            bio: data.bio || '',
            skills: data.skills || [],
            interests: data.interests || [],
            availability_status: status as AvailabilityStatus,
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
          availability_status: values.availability_status || 'messaging', // Updated fallback
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
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="Choose a username" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Tell us about yourself" 
                    className="resize-y"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="skills"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Skills</FormLabel>
                <FormControl>
                  <MultiSelect 
                    options={SKILLS}
                    selectedOptions={field.value}
                    onChange={(selected) => field.onChange(selected)}
                    placeholder="Select your skills"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="interests"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Interests</FormLabel>
                <FormControl>
                  <MultiSelect 
                    options={INTERESTS}
                    selectedOptions={field.value}
                    onChange={(selected) => field.onChange(selected)}
                    placeholder="Select your interests"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="availability_status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Availability</FormLabel>
                <FormControl>
                  <select 
                    {...field} 
                    value={field.value || 'messaging'} // Ensure a valid value is always selected
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="live">Live</option>
                    <option value="messaging">Available for Messaging</option>
                    <option value="busy">Busy</option>
                    <option value="offline">Offline</option>
                  </select>
                </FormControl>
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">Update Profile</Button>
        </form>
      </Form>
    </div>
  );
};

export default EditProfileForm;
