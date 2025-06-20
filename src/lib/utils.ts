import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format seconds into a human-readable duration string (HH:MM:SS)
 */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  
  const parts = [];
  
  if (hours > 0) {
    parts.push(hours.toString().padStart(2, '0'));
  }
  
  parts.push(minutes.toString().padStart(2, '0'));
  parts.push(remainingSeconds.toString().padStart(2, '0'));
  
  return parts.join(':');
}

/**
 * Format user name for display in notifications
 */
export function formatUserName(username: string | null | undefined): string {
  if (!username) return 'A learner';
  
  // If the username contains a space, use the first name
  if (username.includes(' ')) {
    return username.split(' ')[0];
  }
  
  // Otherwise just use the username
  return username;
}
