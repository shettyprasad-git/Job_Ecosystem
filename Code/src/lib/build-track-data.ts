export type Step = {
  id: string;
  name: string;
  path: string;
};

export type StepContent = {
  title: string;
  description: string;
  lovablePrompt: string;
};

export const STEPS: Step[] = [
  { id: '01-problem', name: 'Problem Definition', path: '/rb/01-problem' },
  { id: '02-market', name: 'Market Research', path: '/rb/02-market' },
  { id: '03-architecture', name: 'System Architecture', path: '/rb/03-architecture' },
  { id: '04-hld', name: 'High-Level Design', path: '/rb/04-hld' },
  { id: '05-lld', name: 'Low-Level Design', path: '/rb/05-lld' },
  { id: '06-build', name: 'Build & Develop', path: '/rb/06-build' },
  { id: '07-test', name: 'Testing & QA', path: '/rb/07-test' },
  { id: '08-ship', name: 'Ship & Deploy', path: '/rb/08-ship' },
];

export const STEP_CONTENT: Record<string, StepContent> = {
  '01-problem': {
    title: 'Step 1: Define the Problem',
    description: "Clearly articulate the problem your AI Resume Builder aims to solve. Who is your target user? What are their pain points with current resume-building methods? A solid problem definition is the foundation of a successful project.",
    lovablePrompt: "Example Prompt for Lovable:\n\nFlesh out the core problem. I'm building an AI resume builder for junior developers. Their main struggles are: 1) not knowing what to include, 2) poor wording, 3) formatting issues. My solution will use AI to suggest content, rephrase bullets, and provide professional templates.",
  },
  '02-market': {
    title: 'Step 2: Market Research',
    description: "Analyze the existing market. Who are the main competitors? What are their strengths and weaknesses? Identify your unique value proposition (UVP) that will make your product stand out.",
    lovablePrompt: "Example Prompt for Lovable:\n\nAnalyze the top 3 resume builders (e.g., Zety, Resume.io, Kickresume). Identify a gap in the market. My AI resume builder will differentiate by focusing specifically on tech roles and integrating with platforms like GitHub and LinkedIn to automatically generate project descriptions.",
  },
  '03-architecture': {
    title: 'Step 3: System Architecture',
    description: "Outline the high-level system architecture. What are the main components (e.g., frontend, backend, database, AI service)? How do they interact? A simple diagram can be very effective here.",
    lovablePrompt: "Example Prompt for Lovable:\n\nDesign a system architecture diagram. It should include a Next.js frontend, a Firebase backend for user data and resume storage, and a connection to Google's Gemini API for the AI features. Show the data flow for generating a resume suggestion.",
  },
  '04-hld': {
    title: 'Step 4: High-Level Design (HLD)',
    description: "Define the major components and their responsibilities. Detail the API endpoints, data models, and the overall structure of your application. This bridges the gap between architecture and the actual code.",
    lovablePrompt: "Example Prompt for Lovable:\n\nCreate the High-Level Design. Define the data schema for 'Users' and 'Resumes' in Firestore. List the key API endpoints, such as POST /api/resumes, GET /api/resumes/{id}, and POST /api/generate-bullet.",
  },
  '05-lld': {
    title: 'Step 5: Low-Level Design (LLD)',
    description: "Detail the internal logic of specific components. This could include designing a particular class, function, or React component. How will you manage state in your frontend? What algorithm will you use for a specific feature?",
    lovablePrompt: "Example Prompt for Lovable:\n\nDesign the Low-Level Design for the 'ResumeEditor' React component. What state will it manage (e.g., resumeData, selectedTemplate, loading state)? What will its key functions be (e.g., handleInputChange, saveResume, downloadPDF)?",
  },
  '06-build': {
    title: 'Step 6: Build & Develop',
    description: "It's time to write code. Focus on building a Minimum Viable Product (MVP) based on your designs. Implement the core features and get a working version of your application up and running.",
    lovablePrompt: "Example Prompt for Lovable:\n\nWrite the code for the basic resume form in Next.js using shadcn/ui components. Create input fields for personal details, work experience, and education. Implement state management with React hooks.",
  },
  '07-test': {
    title: 'Step 7: Testing & QA',
    description: "Thoroughly test your application. This includes unit tests for individual functions, integration tests for components, and end-to-end (E2E) tests for user flows. Ensure your app is robust and bug-free.",
    lovablePrompt: "Example Prompt for Lovable:\n\nWrite a test plan. What are the 5 most critical user flows to test? For example: 1) User sign-up, 2) Create a new resume, 3) Add a work experience entry, 4) Use the AI suggestion feature, 5) Download the resume as a PDF. Write a sample E2E test script using a tool like Playwright or Cypress.",
  },
  '08-ship': {
    title: 'Step 8: Ship & Deploy',
    description: "Deploy your application to a hosting provider. Set up a CI/CD pipeline for automated deployments. Monitor your application for errors and performance issues. Congratulations, you've shipped your project!",
    lovablePrompt: "Example Prompt for Lovable:\n\nCreate a deployment checklist. Include steps like: 1) Build the Next.js app, 2) Configure Firebase Hosting, 3) Set up environment variables for the production API keys, 4) Run the `firebase deploy` command, 5) Verify the deployment at the live URL.",
  },
};
