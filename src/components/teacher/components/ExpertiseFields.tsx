
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { MultiSelect } from '@/components/ui/multi-select';
import { UseFormReturn } from 'react-hook-form';
import { TeacherApplicationForm } from '../schema/teacherApplicationSchema';

interface ExpertiseFieldsProps {
  form: UseFormReturn<TeacherApplicationForm>;
  expertiseOptions: string[];
}

export const ExpertiseFields = ({ form, expertiseOptions }: ExpertiseFieldsProps) => {
  return (
    <>
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
    </>
  );
};
