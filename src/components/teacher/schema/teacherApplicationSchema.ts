
import { z } from 'zod';

export const teacherApplicationSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  expertise: z.array(z.string()).min(1, 'Please select at least one area of expertise'),
  experienceYears: z.coerce.number().min(0, 'Experience years must be a positive number'),
  teachingStyle: z.string().min(15, 'Please describe your teaching style in more detail (minimum 15 characters)'),
  motivation: z.string().min(15, 'Please provide more details about your motivation (minimum 15 characters)')
});

export type TeacherApplicationForm = z.infer<typeof teacherApplicationSchema>;
