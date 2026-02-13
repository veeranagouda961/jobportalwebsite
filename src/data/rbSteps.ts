export interface RBStep {
  number: number;
  path: string;
  title: string;
  headline: string;
  subtext: string;
  explanation: string;
  prompt: string;
}

export const rbSteps: RBStep[] = [
  {
    number: 1,
    path: "/rb/01-problem",
    title: "Problem Definition",
    headline: "Define the Problem",
    subtext: "Identify the core problem your AI Resume Builder solves. Who is the user? What pain point does it address?",
    explanation: "A strong product starts with a clearly defined problem. Document who the target user is, what frustrates them about existing solutions, and what success looks like.",
    prompt: "Create a problem statement page for an AI Resume Builder. Include target user persona, pain points with current resume tools, and a clear value proposition statement.",
  },
  {
    number: 2,
    path: "/rb/02-market",
    title: "Market Research",
    headline: "Research the Market",
    subtext: "Analyze existing resume builders, identify gaps, and position your product uniquely.",
    explanation: "Study 3-5 existing resume builders. Note their strengths, weaknesses, and pricing. Identify the gap your AI-powered approach fills.",
    prompt: "Create a competitive analysis section comparing 5 popular resume builders (Canva, Zety, Resume.io, Novoresume, LinkedIn). Highlight gaps an AI-first approach can fill.",
  },
  {
    number: 3,
    path: "/rb/03-architecture",
    title: "System Architecture",
    headline: "Design the Architecture",
    subtext: "Plan the technical architecture — frontend, backend, AI layer, and data flow.",
    explanation: "Map out the system components: React frontend, AI text generation, template engine, PDF export, and data persistence layer.",
    prompt: "Design a system architecture diagram for an AI Resume Builder with: React frontend, AI content generation, template rendering engine, PDF export, and localStorage persistence.",
  },
  {
    number: 4,
    path: "/rb/04-hld",
    title: "High-Level Design",
    headline: "High-Level Design",
    subtext: "Define modules, page flow, component hierarchy, and state management strategy.",
    explanation: "Break the system into modules: Input Form, AI Generator, Template Previewer, Export Engine. Define how data flows between them.",
    prompt: "Create a high-level design for an AI Resume Builder with these modules: Profile Input, AI Content Generator, Template Selector, Live Preview, and PDF Export. Show component hierarchy and data flow.",
  },
  {
    number: 5,
    path: "/rb/05-lld",
    title: "Low-Level Design",
    headline: "Low-Level Design",
    subtext: "Specify component interfaces, data schemas, utility functions, and edge cases.",
    explanation: "Define TypeScript interfaces for resume data, component props, AI prompt templates, and PDF generation utilities.",
    prompt: "Create TypeScript interfaces and data schemas for: ResumeData (personal info, experience, education, skills, projects), TemplateConfig, AIPromptPayload, and ExportOptions.",
  },
  {
    number: 6,
    path: "/rb/06-build",
    title: "Build Phase",
    headline: "Build the Product",
    subtext: "Implement the core features — input forms, AI generation, templates, and export.",
    explanation: "Build incrementally: start with the resume input form, add AI content suggestions, implement template rendering, then add PDF export.",
    prompt: "Build an AI Resume Builder with: multi-section input form (personal, experience, education, skills), live preview with 3 template options, and a download as PDF button.",
  },
  {
    number: 7,
    path: "/rb/07-test",
    title: "Testing",
    headline: "Test Everything",
    subtext: "Verify all features work correctly, handle edge cases, and ensure data persistence.",
    explanation: "Test each feature systematically: form validation, AI generation quality, template switching, PDF output, and data persistence across sessions.",
    prompt: "Add comprehensive testing: validate all form fields, test template switching with live preview updates, verify PDF export contains all sections, and confirm localStorage persistence.",
  },
  {
    number: 8,
    path: "/rb/08-ship",
    title: "Ship It",
    headline: "Ship Your Product",
    subtext: "Deploy, document, and prepare your submission artifacts.",
    explanation: "Deploy to a live URL, push to GitHub, and prepare your final submission with all required links.",
    prompt: "Finalize the AI Resume Builder: add meta tags, ensure mobile responsiveness, optimize performance, and prepare for deployment.",
  },
];
