export type SkillCategory = 'coreCS' | 'languages' | 'web' | 'data' | 'cloud' | 'testing' | 'other';

export type ExtractedSkills = {
  [key in SkillCategory]: string[];
};

export interface Round {
  roundTitle: string;
  items: string[];
}

export interface DayPlan {
  day: string;
  focus: string;
  tasks: string[];
}

export type SkillConfidence = 'know' | 'practice';

export type CompanySize = 'Startup' | 'Mid-size' | 'Enterprise' | 'Unknown';

export interface CompanyIntel {
  name: string;
  industry: string;
  size: CompanySize;
  hiringFocus: string;
  hiringFocusDescription: string;
}

export interface DynamicRound {
  round: number;
  title: string;
  focus: string;
  whyItMatters: string;
}

export interface AnalysisResult {
  id: string;
  createdAt: string;
  updatedAt: string;
  company: string;
  role: string;
  jdText: string;
  extractedSkills: ExtractedSkills;
  checklist: Round[];
  plan7Days: DayPlan[];
  questions: string[];
  baseScore: number;
  skillConfidenceMap: { [key: string]: SkillConfidence };
  finalScore: number;
  companyIntel?: CompanyIntel;
  roundMapping: DynamicRound[];
}