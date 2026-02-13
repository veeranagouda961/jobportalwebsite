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
  techStack: string;
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
  skills: string;
  links: ResumeLinks;
}

export const emptyResume: ResumeData = {
  personal: { name: "", email: "", phone: "", location: "" },
  summary: "",
  education: [],
  experience: [],
  projects: [],
  skills: "",
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
      techStack: "React, Node.js, PostgreSQL, Socket.io",
    },
    {
      id: "proj-2",
      title: "SmartExpense Tracker",
      description:
        "AI-powered expense categorization app with budget forecasting and receipt scanning via OCR.",
      techStack: "React Native, Python, TensorFlow Lite",
    },
  ],
  skills: "React, TypeScript, Node.js, Python, PostgreSQL, Docker, AWS, Git, REST APIs, GraphQL",
  links: {
    github: "https://github.com/arjunmehta",
    linkedin: "https://linkedin.com/in/arjunmehta",
  },
};

const STORAGE_KEY = "rb_resume_data";

export function loadResumeData(): ResumeData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : emptyResume;
  } catch {
    return emptyResume;
  }
}

export function saveResumeData(data: ResumeData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
