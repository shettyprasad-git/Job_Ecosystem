import { ExtractedSkills, Round, DayPlan } from './types';

export function generateReadinessScore(
  jdText: string,
  company: string,
  role: string,
  skills: ExtractedSkills
): number {
  let score = 35;
  const detectedCategories = Object.values(skills).filter(s => s.length > 0).length;
  score += Math.min(detectedCategories * 5, 30);
  if (company) score += 10;
  if (role) score += 10;
  if (jdText.length > 800) score += 10;
  return Math.min(score, 100);
}

export function generateRoundWiseChecklist(skills: ExtractedSkills): Round[] {
    const checklist: Round[] = [];

    checklist.push({
        roundTitle: 'Round 1: Aptitude & CS Basics',
        items: [
            'Practice quantitative aptitude problems (Time, Speed, Distance).',
            'Solve logical reasoning puzzles.',
            'Revise fundamental concepts of Data Structures.',
            'Go through basic principles of Object-Oriented Programming (OOP).',
            'Brush up on Database Management Systems (DBMS) basics.',
            'Review key concepts of Operating Systems (OS) and Computer Networks.',
        ],
    });

    const dsaItems = [
        'Solve 5 medium-level problems on arrays and strings.',
        'Practice 3 problems related to linked lists.',
        'Implement tree traversal algorithms (In-order, Pre-order, Post-order).',
        'Solve 2 graph problems (BFS, DFS).',
        'Review complexity analysis for common algorithms.',
    ];
    if (skills.coreCS?.includes('DBMS')) {
        dsaItems.push('Review normalization and basic SQL queries.');
    }
    checklist.push({ roundTitle: 'Round 2: DSA & Core CS Deep Dive', items: dsaItems });

    const techItems = [
        'Prepare a 2-minute summary of each of your key projects.',
        'Be ready to explain your role and contributions in each project.',
        'Revise the tech stack used in your projects.',
        'Anticipate questions about design choices and trade-offs.',
    ];
     if (skills.web?.length) {
        techItems.push(`Deep dive into ${skills.web.join(', ')} concepts.`);
    }
     if (skills.languages?.length) {
        techItems.push(`Practice coding in ${skills.languages[0]} as it's mentioned in the JD.`);
    }
    checklist.push({ roundTitle: 'Round 3: Technical Interview (Projects & Stack)', items: techItems });

    checklist.push({
        roundTitle: 'Round 4: Managerial & HR',
        items: [
            'Prepare answers for "Tell me about yourself".',
            'Research the company, its products, and recent news.',
            'Prepare 2-3 questions to ask the interviewer.',
            'Think about your strengths and weaknesses with examples.',
            'Be ready to discuss your career goals and why you want this role.',
        ],
    });
    
    return checklist;
}

export function generateSevenDayPlan(skills: ExtractedSkills): DayPlan[] {
    const plan: DayPlan[] = [];

    plan.push({
        day: 'Day 1',
        focus: 'Core CS Fundamentals',
        tasks: ['Revise OOP concepts.', 'Study DBMS basics and normalization.', 'Review OS concepts like processes and threads.'],
    });

    const day2Tasks = ['Strengthen Computer Networks knowledge (TCP/IP, HTTP).'];
    if (skills.languages?.length) {
        day2Tasks.push(`Quickly revise syntax and features of ${skills.languages.join(', ')}.`);
    }
    plan.push({ day: 'Day 2', focus: 'Languages & Networks', tasks: day2Tasks });

    plan.push({
        day: 'Day 3',
        focus: 'Data Structures Practice',
        tasks: ['Solve 5 problems on arrays and strings.', 'Practice linked list manipulation.', 'Implement stacks and queues.'],
    });

    plan.push({
        day: 'Day 4',
        focus: 'Advanced DSA',
        tasks: ['Practice tree-based problems (BST, Traversals).', 'Solve graph algorithm problems (BFS, DFS).', 'Review dynamic programming concepts with 2-3 simple problems.'],
    });

    const day5Tasks = ['Align your resume with the job description, highlighting key skills.', 'Prepare detailed explanations for 2 of your main projects.'];
     if (skills.web?.includes('React')) {
        day5Tasks.push('Revise React hooks and state management.');
    }
    plan.push({ day: 'Day 5', focus: 'Projects & Resume', tasks: day5Tasks });

    plan.push({
        day: 'Day 6',
        focus: 'Mock Interviews',
        tasks: ['Take a mock DSA coding interview.', 'Practice explaining your projects to a friend.', 'Answer common HR questions out loud.'],
    });

    plan.push({
        day: 'Day 7',
        focus: 'Revision & Weak Areas',
        tasks: ['Quickly revise all topics from Day 1-6.', 'Focus on 1-2 topics you feel least confident about.', 'Relax and get a good night\'s sleep.'],
    });
    
    return plan;
}

export function generateInterviewQuestions(skills: ExtractedSkills): string[] {
    const questions: string[] = [];
    const addedQuestions = new Set<string>();

    const questionBank = {
        'dsa': [
            'How would you find a cycle in a linked list?',
            'Explain the difference between BFS and DFS for graph traversal.',
            'What is dynamic programming and when would you use it?',
            'How do you handle collisions in a hash map?',
            'Describe a situation where you would use a priority queue.'
        ],
        'oop': [
            'What are the four main principles of Object-Oriented Programming?',
            'Explain method overriding and method overloading with an example.',
            'What is an abstract class and when would you use it?',
        ],
        'dbms': [
            'What is database normalization? Explain 1NF, 2NF, and 3NF.',
            'Explain the difference between SQL and NoSQL databases.',
            'What is an index in a database and how does it improve performance?',
        ],
        'os': [
            'What is the difference between a process and a thread?',
            'Explain what a deadlock is and how it can be prevented.',
            'What is virtual memory?',
        ],
        'networks': [
            'Explain the TCP/IP model.',
            'What happens when you type a URL into your browser and press Enter?',
        ],
        'java': ['Explain the difference between JDK, JRE, and JVM.'],
        'python': ['What are decorators in Python?'],
        'javascript': ['Explain event delegation in JavaScript.'],
        'typescript': ['What are the benefits of using TypeScript over plain JavaScript?'],
        'react': [
            'What is the virtual DOM and how does it work?',
            'Explain the difference between state and props in React.',
            'What are React Hooks? Give an example of `useState` and `useEffect`.',
        ],
        'node.js': ['What is the event loop in Node.js?'],
        'sql': ['What is the difference between `JOIN` and `UNION` in SQL?'],
        'mongodb': ['What are the advantages of MongoDB over SQL databases?'],
        'aws': ['What is the difference between an EC2 instance and a Lambda function?'],
        'docker': ['What is a Docker container, and how is it different from a virtual machine?'],
        'communication': ['How do you handle disagreements within your team?', 'Describe a complex technical concept to a non-technical person.'],
    };

    ['What are your biggest strengths and weaknesses?', 'Why do you want to work for this company?'].forEach(q => {
        if (questions.length < 10) {
            questions.push(q);
            addedQuestions.add(q);
        }
    });

    const allSkills = Object.values(skills).flat();

    for (const skill of allSkills) {
        const skillKey = Object.keys(questionBank).find(key => skill.toLowerCase().includes(key));
        if (skillKey && questionBank[skillKey as keyof typeof questionBank]) {
            questionBank[skillKey as keyof typeof questionBank].forEach(q => {
                if (questions.length < 10 && !addedQuestions.has(q)) {
                    questions.push(q);
                    addedQuestions.add(q);
                }
            });
        }
    }
    
    const fallback = [...questionBank['dsa'], ...questionBank['oop'], ...questionBank['dbms']];
    let i = 0;
    while(questions.length < 10 && i < fallback.length) {
        if (!addedQuestions.has(fallback[i])) {
            questions.push(fallback[i]);
            addedQuestions.add(fallback[i]);
        }
        i++;
    }

    return questions.slice(0, 10);
}
