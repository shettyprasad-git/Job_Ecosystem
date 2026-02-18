import { ExtractedSkills, CompanyIntel, CompanySize, DynamicRound } from './types';

const ENTERPRISE_COMPANIES = ['amazon', 'google', 'microsoft', 'apple', 'facebook', 'meta', 'infosys', 'tcs', 'wipro', 'accenture', 'cognizant', 'ibm', 'oracle', 'cisco', 'intel', 'samsung', 'goldman sachs', 'jpmorgan chase'];

function getCompanySize(companyName: string): CompanySize {
    if (!companyName) return 'Unknown';
    const lowerCaseName = companyName.toLowerCase();
    if (ENTERPRISE_COMPANIES.includes(lowerCaseName)) {
        return 'Enterprise';
    }
    // Simple heuristic for now, could be expanded
    if (lowerCaseName.includes('university') || lowerCaseName.includes('college')) {
        return 'Enterprise';
    }
    if (lowerCaseName.includes('solutions') || lowerCaseName.includes('tech')) {
        return 'Mid-size';
    }
    return 'Startup';
}

export function generateCompanyIntel(companyName: string): CompanyIntel | undefined {
    if (!companyName) return undefined;

    const size = getCompanySize(companyName);
    let hiringFocus = '';
    let hiringFocusDescription = '';

    switch (size) {
        case 'Enterprise':
            hiringFocus = 'Structured Problem-Solving';
            hiringFocusDescription = 'Large companies often use standardized, multi-stage interviews focusing on strong DSA, core CS fundamentals, and system design principles to assess candidates at scale.';
            break;
        case 'Mid-size':
             hiringFocus = 'Practical Skills & Scalability';
            hiringFocusDescription = 'Mid-size firms look for a balance of strong fundamentals and practical skills that can help them scale their products and teams effectively.';
            break;
        case 'Startup':
        default:
            hiringFocus = 'Stack Versatility & Impact';
            hiringFocusDescription = 'Startups prioritize candidates who are proficient in their specific tech stack and can quickly build features, solve problems independently, and make an immediate impact.';
            break;
    }
    
    // A simple industry guess
    const industry = 'Technology Services';

    return {
        name: companyName,
        industry,
        size,
        hiringFocus,
        hiringFocusDescription
    };
}


export function generateDynamicRoundMapping(skills: ExtractedSkills, companyIntel?: CompanyIntel): DynamicRound[] {
    const size = companyIntel?.size || 'Startup';
    const hasDsa = skills.coreCS?.some(skill => skill.toLowerCase() === 'dsa');
    const hasWebSkills = skills.web && skills.web.length > 0;


    const mapping: DynamicRound[] = [];

    if (size === 'Enterprise') {
        mapping.push({
            round: 1,
            title: 'Online Assessment',
            focus: 'DSA & Aptitude',
            whyItMatters: 'This is a screening round to filter candidates based on fundamental coding and problem-solving abilities at scale. A high score is crucial to proceed.'
        });
        mapping.push({
            round: 2,
            title: 'Technical Round 1',
            focus: 'Data Structures & Algorithms',
            whyItMatters: 'Expect an in-depth evaluation of your DSA knowledge. Interviewers will test your ability to write clean, optimal code for complex problems.'
        });
        mapping.push({
            round: 3,
            title: 'Technical Round 2',
            focus: 'Core CS & System Design (Basics)',
            whyItMatters: 'This round verifies your understanding of computer science fundamentals (OS, DBMS, Networks) and introduces basic system design concepts to check for well-rounded knowledge.'
        });
         mapping.push({
            round: 4,
            title: 'Hiring Manager / HR Round',
            focus: 'Project Discussion & Behavioral Fit',
            whyItMatters: 'Assesses your project contributions, team collaboration skills, and alignment with the company\'s values. It\'s the final check for your overall suitability.'
        });
    } else { // Startup or Mid-size
        mapping.push({
            round: 1,
            title: 'Screening Task / Call',
            focus: hasWebSkills ? 'Practical Coding Challenge' : 'Problem-Solving',
            whyItMatters: 'This round checks if you have the immediate, practical skills needed for the role. It could be a take-home assignment or a live coding session on a relevant problem.'
        });
         mapping.push({
            round: 2,
            title: 'Technical Deep Dive',
            focus: hasWebSkills ? 'Stack-Specific Implementation' : 'Advanced DSA',
            whyItMatters: 'Here, they evaluate your expertise in their specific tech stack or your ability to handle more complex algorithmic challenges relevant to their domain.'
        });
        mapping.push({
            round: 3,
            title: 'System Design & Architecture',
            focus: 'Product-centric System Discussion',
            whyItMatters: 'This round assesses your ability to think about the bigger picture, make design trade-offs, and architect a scalable and maintainable solution for their product.'
        });
        mapping.push({
            round: 4,
            title: 'Founder / Team-Fit Round',
            focus: 'Cultural Fit & Vision Alignment',
            whyItMatters: 'Crucial for smaller teams. This final round ensures you align with the company\'s culture, work ethic, and long-term vision.'
        });
    }
    
    return mapping;
}
