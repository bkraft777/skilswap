
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { UseFormReturn } from 'react-hook-form';
import { TeacherApplicationForm } from '../schema/teacherApplicationSchema';

interface TeachingDetailsFieldsProps {
  form: UseFormReturn<TeacherApplicationForm>;
  teachingStyleLength: number;
  motivationLength: number;
}

export const TeachingDetailsFields = ({ 
  form, 
  teachingStyleLength, 
  motivationLength 
}: TeachingDetailsFieldsProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="teachingStyle"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Teaching Style</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Describe your teaching approach and methodology... (minimum 15 characters)"
                {...field}
              />
            </FormControl>
            <FormDescription className="flex justify-between">
              <span>Describe how you approach teaching and your methodology</span>
              <span className={`text-sm ${teachingStyleLength < 15 ? 'text-destructive' : 'text-muted-foreground'}`}>
                {teachingStyleLength}/15 characters minimum
              </span>
            </FormDescription>
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
                placeholder="Share your motivation for becoming a teacher... (minimum 15 characters)"
                {...field}
              />
            </FormControl>
            <FormDescription className="flex justify-between">
              <span>Share your passion and reasons for wanting to teach</span>
              <span className={`text-sm ${motivationLength < 15 ? 'text-destructive' : 'text-muted-foreground'}`}>
                {motivationLength}/15 characters minimum
              </span>
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
