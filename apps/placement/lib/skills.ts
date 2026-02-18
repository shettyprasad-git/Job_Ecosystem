import { SkillCategory, ExtractedSkills } from './types';

export const SKILL_CATEGORIES: Record<Exclude<SkillCategory, 'other'>, string[]> = {
  'coreCS': ['dsa', 'data structures', 'algorithms', 'oop', 'object oriented', 'dbms', 'database management', 'os', 'operating systems', 'networks', 'computer networks'],
  'languages': ['java', 'python', 'javascript', 'typescript', 'c#', 'c++', 'c', 'go', 'golang'],
  'web': ['react', 'next.js', 'nextjs', 'node.js', 'nodejs', 'express', 'rest', 'graphql', 'api', 'html', 'css', 'frontend', 'backend'],
  'data': ['sql', 'mongodb', 'postgresql', 'mysql', 'redis', 'database'],
  'cloud': ['aws', 'azure', 'gcp', 'docker', 'kubernetes', 'ci/cd', 'ci-cd', 'linux', 'devops'],
  'testing': ['selenium', 'cypress', 'playwright', 'junit', 'pytest', 'testing', 'qa'],
};

const DEFAULT_SKILLS: ExtractedSkills = {
  coreCS: [],
  languages: [],
  web: [],
  data: [],
  cloud: [],
  testing: [],
  other: ["Communication", "Problem Solving", "Basic Coding", "Projects"]
};

function normalizeKeyword(keyword: string): string {
    if (keyword.toLowerCase() === 'c#') return 'C#';
    if (keyword.toLowerCase() === 'c++') return 'C++';
    if (keyword.toLowerCase() === 'c') return 'C';
    if (keyword.toLowerCase().includes('next')) return 'Next.js';
    if (keyword.toLowerCase().includes('node')) return 'Node.js';
    return keyword.charAt(0).toUpperCase() + keyword.slice(1);
}

export function extractSkills(jdText: string): ExtractedSkills {
  const extracted: ExtractedSkills = {
    coreCS: [],
    languages: [],
    web: [],
    data: [],
    cloud: [],
    testing: [],
    other: []
  };
  const lowerJd = jdText.toLowerCase();
  let skillsFound = false;

  for (const category in SKILL_CATEGORIES) {
    const cat = category as Exclude<SkillCategory, 'other'>;
    const keywords = SKILL_CATEGORIES[cat];
    
    keywords.forEach(keyword => {
      if (lowerJd.includes(keyword.toLowerCase())) {
        const normalizedSkill = normalizeKeyword(keyword);
        if (!extracted[cat]?.includes(normalizedSkill)) {
          extracted[cat]?.push(normalizedSkill);
          skillsFound = true;
        }
      }
    });
  }

  if (!skillsFound) {
    return DEFAULT_SKILLS;
  }

  return extracted;
}
