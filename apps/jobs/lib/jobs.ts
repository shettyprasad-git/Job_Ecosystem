import type { Job } from './types';

const COMPANIES = [
  "Infosys", "TCS", "Wipro", "Accenture", "Capgemini", "Cognizant", "IBM", "Oracle", "SAP", "Dell",
  "Amazon", "Flipkart", "Swiggy", "Razorpay", "PhonePe", "Paytm", "Zoho", "Freshworks", "Juspay", "CRED",
  "Zomato", "Groww", "Paytm", "Lenskart", "Nykaa", "InMobi", "Dream11", "Postman", "Unacademy", "Udaan"
];

const LOCATIONS = ["Bengaluru", "Hyderabad", "Pune", "Gurgaon", "Chennai", "Mumbai", "Noida", "Remote"];
const MODES: ('Remote' | 'Hybrid' | 'Onsite')[] = ["Remote", "Hybrid", "Onsite"];
const SOURCES = ["LinkedIn", "Naukri", "Indeed"];

const ROLES = [
  { title: "SDE Intern", exp: "Fresher", sal: "₹25k–₹40k/month Internship" },
  { title: "Graduate Engineer Trainee", exp: "Fresher", sal: "3.5–6 LPA" },
  { title: "Junior Backend Developer", exp: "0-1", sal: "6–10 LPA" },
  { title: "Frontend Intern", exp: "Fresher", sal: "₹15k–₹30k/month Internship" },
  { title: "QA Intern", exp: "Fresher", sal: "₹20k–₹35k/month Internship" },
  { title: "Data Analyst Intern", exp: "Fresher", sal: "₹25k–₹45k/month Internship" },
  { title: "Java Developer (0-1)", exp: "0-1", sal: "6–12 LPA" },
  { title: "Python Developer (Fresher)", exp: "Fresher", sal: "5–8 LPA" },
  { title: "React Developer (1-3)", exp: "1-3", sal: "10–18 LPA" },
  { title: "DevOps Associate", exp: "1-3", sal: "12–20 LPA" },
  { title: "Node.js Developer", exp: "3-5", sal: "15–25 LPA" },
  { title: "UI/UX Designer", exp: "1-3", sal: "8–15 LPA" }
] as const;

const SKILLS_LIST = ["React", "Node.js", "Java", "Python", "AWS", "SQL", "Docker", "Go", "TypeScript", "Tailwind CSS", "Spring Boot", "Kotlin"];

const generateJobs = (): Job[] => {
  return Array.from({ length: 60 }).map((_, i) => {
    const role = ROLES[i % ROLES.length];
    const company = COMPANIES[i % COMPANIES.length];
    const location = LOCATIONS[i % LOCATIONS.length];
    const skillsCount = 3 + (i % 3);
    
    // Deterministic skill selection to avoid hydration mismatch
    const start = i % SKILLS_LIST.length;
    const deterministicSkills = [...SKILLS_LIST.slice(start), ...SKILLS_LIST.slice(0, start)].slice(0, skillsCount);

    return {
      id: `job-${i}`,
      title: role.title,
      company: company,
      location: location,
      mode: MODES[i % MODES.length],
      experience: role.exp,
      skills: deterministicSkills,
      source: SOURCES[i % SOURCES.length],
      postedDaysAgo: i % 11, // Deterministic value
      salaryRange: role.sal,
      applyUrl: `https://${company.toLowerCase().replace(/\s/g, '').replace('.', '')}.com/careers/jobs/${i}`,
      description: `We are looking for a highly motivated ${role.title} to join our engineering team at ${company}. 
You will be responsible for building scalable components and working closely with product managers. 
Candidates should have a strong grasp of fundamentals and be ready to work in a fast-paced environment. 
This is a great opportunity to kickstart your career at one of India's leading tech organizations.`
    };
  });
};

export const jobs: Job[] = generateJobs();
export const allLocations = [...new Set(jobs.map(job => job.location))];
export const allModes = [...new Set(jobs.map(job => job.mode))];
export const allSources = [...new Set(jobs.map(job => job.source))];
export const allExperienceLevels = [...new Set(jobs.map(job => job.experience))];
