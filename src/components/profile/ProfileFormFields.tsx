
import { UseFormReturn } from 'react-hook-form';
import { ProfileFormValues } from '@/hooks/useProfileForm';
import { SKILLS, INTERESTS, AVAILABILITY_STATUSES } from '@/lib/constants';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MultiSelect } from '@/components/ui/multi-select';
import { AvailabilityStatusIndicator } from './AvailabilityStatusIndicator';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';

interface ProfileFormFieldsProps {
  form: UseFormReturn<ProfileFormValues>;
}

export const ProfileFormFields = ({ form }: ProfileFormFieldsProps) => {
  return (
    <>
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
                selectedOptions={field.value || []}
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
                selectedOptions={field.value || []}
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
                value={field.value || 'messaging'}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="live">Available for Live Session</option>
                <option value="messaging">Available for Messaging</option>
                <option value="busy">Busy</option>
                <option value="offline">Offline</option>
              </select>
            </FormControl>
          </FormItem>
        )}
      />

      <AvailabilityStatusIndicator status={form.watch('availability_status') || 'messaging'} />
    </>
  );
};
