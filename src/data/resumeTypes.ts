export interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  location: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startYear: string;
  endYear: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  liveUrl: string;
  githubUrl: string;
}

export interface CategorizedSkills {
  technical: string[];
  soft: string[];
  tools: string[];
}

export interface ResumeLinks {
  github: string;
  linkedin: string;
}

export interface ResumeData {
  personal: PersonalInfo;
  summary: string;
  education: Education[];
  experience: Experience[];
  projects: Project[];
  skills: CategorizedSkills;
  links: ResumeLinks;
}

export const emptyResume: ResumeData = {
  personal: { name: "", email: "", phone: "", location: "" },
  summary: "",
  education: [],
  experience: [],
  projects: [],
  skills: { technical: [], soft: [], tools: [] },
  links: { github: "", linkedin: "" },
};

export const sampleResume: ResumeData = {
  personal: {
    name: "Arjun Mehta",
    email: "arjun.mehta@email.com",
    phone: "+91 98765 43210",
    location: "Bangalore, India",
  },
  summary:
    "Full-stack developer with 2+ years of experience building scalable web applications. Proficient in React, Node.js, and cloud infrastructure. Passionate about clean code and user-centric design.",
  education: [
    {
      id: "edu-1",
      institution: "Indian Institute of Technology, Bangalore",
      degree: "B.Tech",
      field: "Computer Science & Engineering",
      startYear: "2019",
      endYear: "2023",
    },
  ],
  experience: [
    {
      id: "exp-1",
      company: "TechCorp Solutions",
      role: "Software Engineer",
      startDate: "Jul 2023",
      endDate: "Present",
      description:
        "Built microservices handling 10K+ requests/sec. Led migration from monolith to event-driven architecture. Reduced API latency by 40%.",
    },
    {
      id: "exp-2",
      company: "StartupXYZ",
      role: "Frontend Intern",
      startDate: "Jan 2023",
      endDate: "Jun 2023",
      description:
        "Developed responsive dashboard with React and TypeScript. Implemented real-time data visualization using D3.js.",
    },
  ],
  projects: [
    {
      id: "proj-1",
      title: "DevConnect — Developer Social Platform",
      description:
        "A full-stack social platform for developers with real-time chat, project showcasing, and skill-based matching.",
      techStack: ["React", "Node.js", "PostgreSQL", "Socket.io"],
      liveUrl: "https://devconnect.app",
      githubUrl: "https://github.com/arjunmehta/devconnect",
    },
    {
      id: "proj-2",
      title: "SmartExpense Tracker",
      description:
        "AI-powered expense categorization app with budget forecasting and receipt scanning via OCR.",
      techStack: ["React Native", "Python", "TensorFlow Lite"],
      liveUrl: "",
      githubUrl: "https://github.com/arjunmehta/smartexpense",
    },
  ],
  skills: {
    technical: ["React", "TypeScript", "Node.js", "Python", "PostgreSQL", "GraphQL"],
    soft: ["Team Leadership", "Problem Solving", "Communication"],
    tools: ["Docker", "AWS", "Git", "REST APIs"],
  },
  links: {
    github: "https://github.com/arjunmehta",
    linkedin: "https://linkedin.com/in/arjunmehta",
  },
};

const STORAGE_KEY = "rb_resume_data";

/** Migrate old flat skills string to categorized format */
function migrateResume(data: any): ResumeData {
  // Migrate skills from comma-separated string to categorized
  if (typeof data.skills === "string") {
    const items = data.skills.split(",").map((s: string) => s.trim()).filter(Boolean);
    data.skills = { technical: items, soft: [], tools: [] };
  }
  // Ensure skills has all categories
  if (data.skills && typeof data.skills === "object") {
    if (!Array.isArray(data.skills.technical)) data.skills.technical = [];
    if (!Array.isArray(data.skills.soft)) data.skills.soft = [];
    if (!Array.isArray(data.skills.tools)) data.skills.tools = [];
  }
  // Migrate projects: techStack string → array, add missing URLs
  if (Array.isArray(data.projects)) {
    data.projects = data.projects.map((p: any) => ({
      ...p,
      techStack: typeof p.techStack === "string"
        ? p.techStack.split(",").map((s: string) => s.trim()).filter(Boolean)
        : (Array.isArray(p.techStack) ? p.techStack : []),
      liveUrl: p.liveUrl ?? "",
      githubUrl: p.githubUrl ?? "",
    }));
  }
  return data as ResumeData;
}

export function loadResumeData(): ResumeData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyResume;
    return migrateResume(JSON.parse(raw));
  } catch {
    return emptyResume;
  }
}

export function saveResumeData(data: ResumeData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
