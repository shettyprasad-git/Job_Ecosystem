import type { ResumeData } from "./types";

export const initialResumeData: ResumeData = {
    personalInfo: { name: '', email: '', phone: '', location: '' },
    summary: '',
    education: [],
    experience: [],
    projects: [],
    skills: {
        technical: [],
        soft: [],
        tools: [],
    },
    links: { github: '', linkedin: '' },
};


export const sampleResumeData: ResumeData = {
    personalInfo: {
        name: 'Jane Doe',
        email: 'jane.doe@example.com',
        phone: '123-456-7890',
        location: 'San Francisco, CA'
    },
    summary: 'Driven and innovative software engineer with over 5 years of experience in developing and deploying scalable web applications. Proficient in JavaScript, React, and Node.js, with a proven track record of delivering high-quality products. I led a team that improved application performance by 30%.',
    education: [
        { id: 'edu1', school: 'Stanford University', degree: 'M.S. in Computer Science', startDate: '2017', endDate: '2019' }
    ],
    experience: [
        { id: 'exp1', company: 'Tech Solutions Inc.', role: 'Senior Software Engineer', startDate: '2021', endDate: 'Present', description: '• Led the development of a new microservices-based architecture, improving system scalability by 40%.\n• Mentored a team of 5 junior engineers.' },
        { id: 'exp2', company: 'Web Innovators', role: 'Software Engineer', startDate: '2019', endDate: '2021', description: '• Developed and maintained client-side features for a high-traffic e-commerce platform using React.\n• Achieved 95% test coverage for critical components.' }
    ],
    projects: [
        { id: 'proj1', name: 'AI Resume Builder', description: '• A web application to help users build ATS-friendly resumes with AI-powered suggestions.\n• Built with Next.js, TypeScript, and Tailwind CSS.', techStack: ['Next.js', 'TypeScript', 'Tailwind CSS'], githubUrl: 'https://github.com/janedoe/ai-resume-builder' },
        { id: 'proj2', name: 'E-commerce Analytics Dashboard', description: '• Created a real-time analytics dashboard for an e-commerce site, processing 10,000+ events per minute.', techStack: ['React', 'D3.js', 'WebSocket'], liveUrl: 'https://example-analytics.com' }
    ],
    skills: {
        technical: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Next.js', 'PostgreSQL', 'GraphQL'],
        soft: ['Team Leadership', 'Problem Solving', 'Agile Methodologies'],
        tools: ['Git', 'Docker', 'AWS', 'Firebase', 'Tailwind CSS'],
    },
    links: {
        github: 'https://github.com/janedoe',
        linkedin: 'https://linkedin.com/in/janedoe'
    }
};

const ACTION_VERBS = ['built', 'led', 'designed', 'improved', 'developed', 'managed', 'created', 'implemented', 'optimized', 'achieved', 'launched', 'drove', 'architected', 'engineered', 'mentored', 'accelerated', 'delivered'];

export const calculateAtsResult = (resume: ResumeData) => {
    let score = 0;
    const suggestions: { text: string; points: number }[] = [];

    // Name: +10
    if (resume.personalInfo.name) {
        score += 10;
    } else {
        suggestions.push({ text: "Add your full name", points: 10 });
    }

    // Email: +10
    if (resume.personalInfo.email) {
        score += 10;
    } else {
        suggestions.push({ text: "Add your email address", points: 10 });
    }

    // Summary > 50 chars: +10
    if (resume.summary && resume.summary.length > 50) {
        score += 10;
    } else {
        suggestions.push({ text: "Write a summary of at least 50 characters", points: 10 });
    }
    
    // Summary action verbs: +10
    if (resume.summary) {
        const summaryHasActionVerbs = ACTION_VERBS.some(verb => resume.summary.toLowerCase().includes(verb));
        if (summaryHasActionVerbs) {
            score += 10;
        } else {
            suggestions.push({ text: "Include action verbs in your summary (e.g., built, led)", points: 10 });
        }
    }


    // Experience: +15
    if (resume.experience.length > 0 && resume.experience.some(e => e.description)) {
        score += 15;
    } else {
        suggestions.push({ text: "Add at least one work experience entry", points: 15 });
    }

    // Education: +10
    if (resume.education.length > 0) {
        score += 10;
    } else {
        suggestions.push({ text: "Add your education history", points: 10 });
    }

    // Skills >= 5: +10
    const totalSkills = (resume.skills?.technical?.length ?? 0) + (resume.skills?.soft?.length ?? 0) + (resume.skills?.tools?.length ?? 0);
    if (totalSkills >= 5) {
        score += 10;
    } else {
        suggestions.push({ text: `Add at least ${5 - totalSkills} more skills`, points: 10 });
    }

    // Projects >= 1: +10
    if (resume.projects.length > 0) {
        score += 10;
    } else {
        suggestions.push({ text: "Add at least one project", points: 10 });
    }

    // Phone: +5
    if (resume.personalInfo.phone) {
        score += 5;
    } else {
        suggestions.push({ text: "Add your phone number", points: 5 });
    }
    
    // LinkedIn: +5
    if (resume.links.linkedin) {
        score += 5;
    } else {
        suggestions.push({ text: "Add your LinkedIn profile link", points: 5 });
    }
    
    // GitHub: +5
    if (resume.links.github) {
        score += 5;
    } else {
        suggestions.push({ text: "Add your GitHub profile link", points: 5 });
    }

    return {
        score: Math.min(score, 100),
        suggestions
    };
};

export const generatePlainTextResume = (resume: ResumeData): string => {
    const { personalInfo, summary, education, experience, projects, skills, links } = resume;
    
    let text = '';

    if (personalInfo.name) {
        text += `${personalInfo.name}\n`;
    }
    const contact = [personalInfo.email, personalInfo.phone, personalInfo.location, links.linkedin, links.github].filter(Boolean);
    if (contact.length > 0) {
        text += contact.join(' | ') + '\n\n';
    }

    if (summary) {
        text += `SUMMARY\n${summary}\n\n`;
    }

    if (experience.length > 0) {
        text += 'EXPERIENCE\n\n';
        experience.forEach(exp => {
            text += `${exp.role} | ${exp.company} | ${exp.startDate} - ${exp.endDate}\n`;
            text += `${exp.description}\n\n`;
        });
    }

    if (projects.length > 0) {
        text += 'PROJECTS\n\n';
        projects.forEach(proj => {
            text += `${proj.name}\n`;
            text += `${proj.description}\n`;
            if (proj.techStack && proj.techStack.length > 0) {
                text += `Tech: ${proj.techStack.join(', ')}\n`;
            }
            if (proj.liveUrl) text += `Live: ${proj.liveUrl}\n`;
            if (proj.githubUrl) text += `GitHub: ${proj.githubUrl}\n`;
            text += '\n';
        });
    }

    if (education.length > 0) {
        text += 'EDUCATION\n\n';
        education.forEach(edu => {
            text += `${edu.degree}, ${edu.school} (${edu.startDate} - ${edu.endDate})\n`;
        });
        text += '\n';
    }

    const allSkills = [...(resume.skills?.technical ?? []), ...(resume.skills?.soft ?? []), ...(resume.skills?.tools ?? [])];
    if (allSkills.length > 0) {
        text += `SKILLS\n${allSkills.join(', ')}\n`;
    }

    return text.trim();
};
