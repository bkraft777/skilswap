
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { AVAILABILITY_STATUSES, SKILLS, INTERESTS } from '@/lib/constants';

// Profile form schema
const profileSchema = z.object({
  username: z.string().min(2, 'Username must be at least 2 characters').optional(),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  skills: z.array(z.enum(SKILLS)).optional(),
  interests: z.array(z.enum(INTERESTS)).optional(),
  availability_status: z.enum(AVAILABILITY_STATUSES).optional(),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;

export const useProfileForm = (defaultValues: Partial<ProfileFormValues> = {}) => {
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: '',
      bio: '',
      skills: [],
      interests: [],
      availability_status: 'messaging',
      ...defaultValues,
    },
  });

  return form;
};
