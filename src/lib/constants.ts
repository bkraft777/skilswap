import { SKILLS } from '@/lib/constants';

export const SKILLS = [
  'Web Development', 'Mobile Development', 'Data Science', 
  'Design', 'Marketing', 'Writing', 'Photography'
] as const;

export type Skill = typeof SKILLS[number];

export const SKILL_CATEGORIES = [
  'Programming', 'Design', 'Music', 'Languages', 'Math', 
  'Science', 'Art', 'Writing', 'Business', 'Fitness'
];

export const INTERESTS = [
  'Technology', 'Art', 'Music', 'Sports', 'Travel', 
  'Entrepreneurship', 'Personal Development'
] as const;

export type Interest = typeof INTERESTS[number];

export const AVAILABILITY_STATUSES = ['live', 'messaging', 'busy', 'offline'] as const;
export type AvailabilityStatus = typeof AVAILABILITY_STATUSES[number];
