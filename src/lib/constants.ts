
export const SKILLS = [
  'Web Development', 'Mobile Development', 'Data Science', 
  'Design', 'Marketing', 'Writing', 'Photography'
] as const;

export const INTERESTS = [
  'Technology', 'Art', 'Music', 'Sports', 'Travel', 
  'Entrepreneurship', 'Personal Development'
] as const;

export const AVAILABILITY_STATUSES = ['live', 'messaging', 'busy', 'offline'] as const;
export type AvailabilityStatus = typeof AVAILABILITY_STATUSES[number];
