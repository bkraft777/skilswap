
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MultiSelect } from '@/components/ui/multi-select';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { useAuth } from '@/hooks/useAuth';

type TeacherApplicationInsert = Database['public']['Tables']['teacher_applications']['Insert'];

const teacherApplicationSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  expertise: z.array(z.string()).min(1, 'Please select at least one area of expertise'),
  experienceYears: z.coerce.number().min(0, 'Experience years must be a positive number'),
  teachingStyle: z.string().min(20, 'Please describe your teaching style in more detail'),
  motivation: z.string().min(50, 'Please provide more details about your motivation')
});

type TeacherApplicationForm = z.infer<typeof teacherApplicationSchema>;

const expertiseOptions = [
  'Programming',
  'Design',
  'Business',
  'Marketing',
  'Language',
  'Music',
  'Cooking',
  'Photography',
  'Writing',
  'Fitness'
];

const TeacherApplicationForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const form = useForm<TeacherApplicationForm>({
    resolver: zodResolver(teacherApplicationSchema),
    defaultValues: {
      fullName: '',
      email: '',
      expertise: [],
      experienceYears: 0,
      teachingStyle: '',
      motivation: ''
    }
  });

  const onSubmit = async (data: TeacherApplicationForm) => {
    try {
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "You must be logged in to submit a teacher application.",
          variant: "destructive",
        });
        navigate('/auth');
        return;
      }

      console.log("Current user ID:", user.id);
      console.log("Submitting teacher application with data:", data);

      const applicationData: TeacherApplicationInsert = {
        full_name: data.fullName,
        email: data.email,
        expertise: data.expertise,
        experience_years: data.experienceYears,
        teaching_style: data.teachingStyle,
        motivation: data.motivation,
        user_id: user.id  // Explicitly link the application to the current user
      };

      const { data: result, error } = await supabase
        .from('teacher_applications')
        .insert(applicationData)
        .select();

      if (error) {
        console.error("Error submitting application:", error);
        throw error;
      }

      console.log("Application submitted successfully:", result);

      // Also update the user's profile with teaching skills
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ 
          skills: data.expertise 
        })
        .eq('id', user.id);

      if (profileError) {
        console.warn("Error updating profile skills:", profileError);
        // Continue with success message even if profile update fails
      }

      toast({
        title: "Application Submitted!",
        description: "We'll review your application and get back to you soon.",
      });

      navigate('/');
    } catch (error: any) {
      console.error("Full error details:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="john@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="expertise"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Areas of Expertise</FormLabel>
              <FormControl>
                <MultiSelect
                  options={expertiseOptions}
                  selectedOptions={field.value}
                  onChange={field.onChange}
                  placeholder="Select your areas of expertise"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="experienceYears"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Years of Experience</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  min="0" 
                  placeholder="5"
                  {...field}
                  onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  value={field.value}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="teachingStyle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Teaching Style</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Describe your teaching approach and methodology..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="motivation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Why do you want to teach?</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Share your motivation for becoming a teacher..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">Submit Application</Button>
      </form>
    </Form>
  );
};

export default TeacherApplicationForm;
