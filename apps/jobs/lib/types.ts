export type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  mode: 'Remote' | 'Hybrid' | 'Onsite';
  experience: 'Fresher' | '0-1' | '1-3' | '3-5';
  skills: string[];
  source: string;
  postedDaysAgo: number;
  salaryRange: string;
  applyUrl: string;
  description: string;
};

export type JobWithScore = Job & {
  matchScore: number;
};

export type Preferences = {
  roleKeywords: string;
  preferredLocations: string[];
  preferredMode: string[];
  experienceLevel: string;
  skills: string;
  minMatchScore: number;
};

export type JobStatus = 'Not Applied' | 'Applied' | 'Rejected' | 'Selected';

export type JobStatusMap = {
  [jobId: string]: JobStatus;
};

export type StatusUpdate = {
  jobId: string;
  title: string;
  company: string;
  status: JobStatus;
  changedAt: string; // ISO date string
};
