import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { formatDistanceToNowStrict, subDays } from 'date-fns';
import type { Job, Preferences } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPostedDate(daysAgo: number): string {
  if (daysAgo < 0) return '';
  if (daysAgo === 0) return 'Today';
  const date = subDays(new Date(), daysAgo);
  const distance = formatDistanceToNowStrict(date);
  // formatDistanceToNowStrict returns "X days", "X months", etc. We want "Xd" for days.
  // This is a simplification. For more accuracy, you'd parse the string.
  if (distance.includes('day')) {
    return `${distance.split(' ')[0]}d ago`;
  }
  return `${distance} ago`;
}

export const calculateMatchScore = (job: Job, preferences: Preferences): number => {
  if (!preferences || !preferences.roleKeywords) {
    return 0;
  }
  
  let score = 0;
  
  const keywords = preferences.roleKeywords.toLowerCase().split(',').map(k => k.trim()).filter(Boolean);
  const prefSkills = preferences.skills.toLowerCase().split(',').map(s => s.trim()).filter(Boolean);
  const jobTitleLower = job.title.toLowerCase();
  const jobDescriptionLower = job.description.toLowerCase();

  // +25 if any roleKeyword appears in job.title (case-insensitive)
  if (keywords.length > 0 && keywords.some(k => jobTitleLower.includes(k))) {
    score += 25;
  }

  // +15 if any roleKeyword appears in job.description
  if (keywords.length > 0 && keywords.some(k => jobDescriptionLower.includes(k))) {
    score += 15;
  }

  // +15 if job.location matches preferredLocations
  if (preferences.preferredLocations.length > 0 && preferences.preferredLocations.includes(job.location)) {
    score += 15;
  }

  // +10 if job.mode matches preferredMode
  if (preferences.preferredMode.length > 0 && preferences.preferredMode.includes(job.mode)) {
    score += 10;
  }

  // +10 if job.experience matches experienceLevel
  if (preferences.experienceLevel && preferences.experienceLevel !== "All" && preferences.experienceLevel === job.experience) {
    score += 10;
  }

  // +15 if overlap between job.skills and user.skills (any match)
  const jobSkillsLower = job.skills.map(s => s.toLowerCase());
  if (prefSkills.length > 0 && prefSkills.some(s => jobSkillsLower.includes(s))) {
    score += 15;
  }

  // +5 if postedDaysAgo <= 2
  if (job.postedDaysAgo <= 2) {
    score += 5;
  }

  // +5 if source is LinkedIn
  if (job.source === 'LinkedIn') {
    score += 5;
  }

  return Math.min(score, 100);
};

export const extractSalaryValue = (sal: string): number => {
  if (!sal) return 0;
  const perMonthMatch = sal.match(/₹(\d+)k/);
  if (perMonthMatch) {
    return parseInt(perMonthMatch[1]) * 12 * 1000;
  }
  
  const lpaMatch = sal.match(/(\d+\.?\d*)/);
  if (lpaMatch) {
    return parseFloat(lpaMatch[0]) * 100000;
  }

  return 0;
};
