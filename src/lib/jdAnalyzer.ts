export interface SkillCategory {
  name: string;
  keywords: string[];
}

export interface ExtractedSkills {
  [category: string]: string[];
}

export interface ChecklistRound {
  title: string;
  items: string[];
}

export interface DayPlan {
  day: string;
  focus: string;
  tasks: string[];
}

export interface AnalysisResult {
  id: string;
  createdAt: string;
  company: string;
  role: string;
  jdText: string;
  extractedSkills: ExtractedSkills;
  plan: DayPlan[];
  checklist: ChecklistRound[];
  questions: string[];
  readinessScore: number;
}

const SKILL_CATEGORIES: SkillCategory[] = [
  { name: "Core CS", keywords: ["dsa", "data structures", "algorithms", "oop", "object oriented", "dbms", "database management", "os", "operating system", "networks", "networking", "computer networks"] },
  { name: "Languages", keywords: ["java", "python", "javascript", "typescript", "c++", "c#", "golang", "go lang"] },
  { name: "Web", keywords: ["react", "next.js", "nextjs", "node.js", "nodejs", "express", "rest", "restful", "graphql", "angular", "vue", "html", "css", "tailwind"] },
  { name: "Data", keywords: ["sql", "mongodb", "postgresql", "mysql", "redis", "nosql", "database"] },
  { name: "Cloud/DevOps", keywords: ["aws", "azure", "gcp", "docker", "kubernetes", "ci/cd", "cicd", "linux", "devops", "terraform", "jenkins"] },
  { name: "Testing", keywords: ["selenium", "cypress", "playwright", "junit", "pytest", "testing", "unit test", "integration test"] },
];

export function extractSkills(jdText: string): ExtractedSkills {
  const lower = jdText.toLowerCase();
  const result: ExtractedSkills = {};

  for (const cat of SKILL_CATEGORIES) {
    const found: string[] = [];
    for (const kw of cat.keywords) {
      if (lower.includes(kw) && !found.includes(kw)) {
        // Use the display-friendly version
        const display = cat.keywords.indexOf(kw) === cat.keywords.findIndex(k => lower.includes(k) && k === kw) ? formatKeyword(kw) : formatKeyword(kw);
        if (!found.some(f => f.toLowerCase() === display.toLowerCase())) {
          found.push(display);
        }
      }
    }
    if (found.length > 0) {
      result[cat.name] = found;
    }
  }

  if (Object.keys(result).length === 0) {
    result["General"] = ["General fresher stack"];
  }

  return result;
}

function formatKeyword(kw: string): string {
  const map: Record<string, string> = {
    "dsa": "DSA", "data structures": "Data Structures", "algorithms": "Algorithms",
    "oop": "OOP", "object oriented": "OOP", "dbms": "DBMS",
    "database management": "DBMS", "os": "OS", "operating system": "OS",
    "networks": "Networks", "networking": "Networks", "computer networks": "Networks",
    "java": "Java", "python": "Python", "javascript": "JavaScript",
    "typescript": "TypeScript", "c++": "C++", "c#": "C#",
    "golang": "Go", "go lang": "Go",
    "react": "React", "next.js": "Next.js", "nextjs": "Next.js",
    "node.js": "Node.js", "nodejs": "Node.js", "express": "Express",
    "rest": "REST", "restful": "REST", "graphql": "GraphQL",
    "angular": "Angular", "vue": "Vue", "html": "HTML", "css": "CSS", "tailwind": "Tailwind",
    "sql": "SQL", "mongodb": "MongoDB", "postgresql": "PostgreSQL",
    "mysql": "MySQL", "redis": "Redis", "nosql": "NoSQL", "database": "Database",
    "aws": "AWS", "azure": "Azure", "gcp": "GCP",
    "docker": "Docker", "kubernetes": "Kubernetes",
    "ci/cd": "CI/CD", "cicd": "CI/CD", "linux": "Linux",
    "devops": "DevOps", "terraform": "Terraform", "jenkins": "Jenkins",
    "selenium": "Selenium", "cypress": "Cypress", "playwright": "Playwright",
    "junit": "JUnit", "pytest": "PyTest",
    "testing": "Testing", "unit test": "Unit Testing", "integration test": "Integration Testing",
  };
  return map[kw] || kw;
}

export function calculateReadinessScore(company: string, role: string, jdText: string, skills: ExtractedSkills): number {
  let score = 35;
  const categoryCount = Object.keys(skills).filter(k => k !== "General").length;
  score += Math.min(categoryCount * 5, 30);
  if (company.trim().length > 0) score += 10;
  if (role.trim().length > 0) score += 10;
  if (jdText.length > 800) score += 10;
  return Math.min(score, 100);
}

export function generateChecklist(skills: ExtractedSkills): ChecklistRound[] {
  const allSkills = Object.values(skills).flat();
  const has = (kw: string) => allSkills.some(s => s.toLowerCase().includes(kw.toLowerCase()));

  const round1: string[] = [
    "Review quantitative aptitude basics",
    "Practice logical reasoning (15 questions)",
    "Verbal ability — reading comprehension",
    "Review basic probability & statistics",
    "Time management strategy for aptitude rounds",
  ];

  const round2: string[] = [
    "Revise arrays, strings, and hashing",
    "Practice 5 medium-level DSA problems",
    "Review time & space complexity analysis",
  ];
  if (has("OOP")) round2.push("Revise OOP principles: encapsulation, inheritance, polymorphism");
  if (has("DBMS") || has("SQL")) round2.push("Review normalization, joins, and indexing");
  if (has("OS")) round2.push("Revise process scheduling, deadlocks, and memory management");
  if (has("Networks")) round2.push("Review OSI model, TCP/IP, and HTTP");
  if (round2.length < 7) round2.push("Practice 2 hard-level coding problems", "Review recursion and backtracking");

  const round3: string[] = [
    "Prepare 2-minute project walkthrough",
    "Be ready to explain architecture decisions",
  ];
  if (has("React") || has("Next.js") || has("Angular") || has("Vue")) round3.push("Review component lifecycle and state management");
  if (has("Node.js") || has("Express")) round3.push("Review REST API design and middleware patterns");
  if (has("Docker") || has("Kubernetes")) round3.push("Explain containerization and orchestration concepts");
  if (has("AWS") || has("Azure") || has("GCP")) round3.push("Review cloud services you've used in projects");
  if (has("SQL") || has("MongoDB") || has("PostgreSQL")) round3.push("Be ready to write queries and explain schema design");
  if (has("Python")) round3.push("Review Python-specific patterns and libraries");
  if (has("Java")) round3.push("Review Java collections, multithreading basics");
  if (round3.length < 7) round3.push("Prepare to discuss your strongest project in depth", "Review system design basics");

  const round4: string[] = [
    "Prepare 'Tell me about yourself' (90 seconds)",
    "Research the company's mission and recent news",
    "Prepare 'Why this company?' with specific reasons",
    "Prepare strengths & weaknesses with examples",
    "Practice behavioral questions using STAR method",
    "Prepare salary expectation response",
    "Have 2–3 thoughtful questions for the interviewer",
  ];

  return [
    { title: "Round 1 — Aptitude & Basics", items: round1 },
    { title: "Round 2 — DSA & Core CS", items: round2.slice(0, 8) },
    { title: "Round 3 — Technical Interview", items: round3.slice(0, 8) },
    { title: "Round 4 — HR & Managerial", items: round4 },
  ];
}

export function generatePlan(skills: ExtractedSkills): DayPlan[] {
  const allSkills = Object.values(skills).flat();
  const has = (kw: string) => allSkills.some(s => s.toLowerCase().includes(kw.toLowerCase()));

  const plan: DayPlan[] = [
    {
      day: "Day 1–2",
      focus: "Basics & Core CS",
      tasks: [
        "Review OOP fundamentals with examples",
        "Revise DBMS: normalization, ACID properties",
        "OS: process management, scheduling algorithms",
        has("Networks") ? "Networks: OSI layers, TCP vs UDP" : "Review basic networking concepts",
        "Practice 10 aptitude questions",
      ],
    },
    {
      day: "Day 3–4",
      focus: "DSA & Coding Practice",
      tasks: [
        "Arrays & strings: sliding window, two pointers",
        "Trees & graphs: BFS, DFS, shortest path",
        "Dynamic programming: top 10 patterns",
        has("Java") ? "Practice coding in Java" : has("Python") ? "Practice coding in Python" : "Practice in your preferred language",
        "Solve 3 medium problems on each topic",
      ],
    },
    {
      day: "Day 5",
      focus: "Project & Resume Alignment",
      tasks: [
        "Review all projects on your resume",
        "Prepare architecture explanations for each project",
        has("React") || has("Next.js") ? "Review React/frontend patterns used in projects" : "Align tech stack with JD requirements",
        has("Node.js") || has("Express") ? "Review backend APIs you've built" : "Prepare to discuss any backend experience",
        "Ensure resume matches JD keywords",
      ],
    },
    {
      day: "Day 6",
      focus: "Mock Interview Questions",
      tasks: [
        "Practice 'Tell me about yourself'",
        "Answer 5 behavioral questions (STAR method)",
        has("SQL") ? "Practice SQL query-based interview questions" : "Review database concepts for interviews",
        has("Docker") || has("AWS") ? "Prepare DevOps/cloud interview talking points" : "Review system design basics",
        "Do one full mock interview (45 min)",
      ],
    },
    {
      day: "Day 7",
      focus: "Revision & Weak Areas",
      tasks: [
        "Revisit problems you got wrong",
        "Review all checklist items marked incomplete",
        "Quick-revise core CS formulas and definitions",
        "Relax — avoid cramming, trust your preparation",
        "Prepare logistics: interview time, documents, setup",
      ],
    },
  ];

  return plan;
}

const QUESTION_BANK: Record<string, string[]> = {
  "DSA": [
    "How would you optimize search in a sorted array?",
    "Explain the difference between BFS and DFS with use cases.",
    "What is dynamic programming? Walk through a classic example.",
  ],
  "Data Structures": [
    "Compare arrays vs linked lists for different operations.",
    "When would you use a hash map over a tree map?",
  ],
  "Algorithms": [
    "Explain time complexity of merge sort vs quick sort.",
    "How does Dijkstra's algorithm work?",
  ],
  "OOP": [
    "Explain SOLID principles with examples.",
    "What is the difference between composition and inheritance?",
  ],
  "DBMS": [
    "Explain normalization up to 3NF with an example.",
    "What are ACID properties in a database?",
  ],
  "SQL": [
    "Explain indexing and when it helps query performance.",
    "Write a query to find the second highest salary.",
  ],
  "OS": [
    "Explain deadlock: conditions and prevention strategies.",
    "What is virtual memory and how does paging work?",
  ],
  "Networks": [
    "Explain the TCP 3-way handshake.",
    "What happens when you type a URL in the browser?",
  ],
  "React": [
    "Explain state management options in React.",
    "What are React hooks? When would you use useEffect vs useMemo?",
  ],
  "Next.js": [
    "Explain SSR vs SSG in Next.js.",
    "How does Next.js handle routing differently from React Router?",
  ],
  "Node.js": [
    "Explain the event loop in Node.js.",
    "How would you handle errors in an Express middleware chain?",
  ],
  "Java": [
    "Explain the difference between HashMap and ConcurrentHashMap.",
    "What is the Java Memory Model?",
  ],
  "Python": [
    "Explain list comprehensions and generator expressions.",
    "What is the GIL and how does it affect multithreading?",
  ],
  "JavaScript": [
    "Explain closures with a practical example.",
    "What is the difference between var, let, and const?",
  ],
  "TypeScript": [
    "How do generics improve type safety in TypeScript?",
    "Explain the difference between interface and type.",
  ],
  "Docker": [
    "Explain Docker layers and how caching works.",
    "What is the difference between CMD and ENTRYPOINT?",
  ],
  "Kubernetes": [
    "Explain Pods, Services, and Deployments in Kubernetes.",
  ],
  "AWS": [
    "Compare EC2, Lambda, and ECS for deploying applications.",
    "What is the difference between S3 and EBS?",
  ],
  "MongoDB": [
    "When would you choose MongoDB over a relational database?",
    "Explain MongoDB indexing strategies.",
  ],
  "REST": [
    "Explain RESTful API design principles.",
    "What is the difference between PUT and PATCH?",
  ],
  "GraphQL": [
    "How does GraphQL differ from REST? What are its trade-offs?",
  ],
  "CI/CD": [
    "Describe a CI/CD pipeline you would set up for a web app.",
  ],
  "Testing": [
    "What is the testing pyramid? Explain each level.",
    "How do you decide what to unit test vs integration test?",
  ],
  "General fresher stack": [
    "What programming languages are you most comfortable with?",
    "Describe a project you've built from scratch.",
    "How do you approach debugging a problem you've never seen before?",
    "What is version control and why is it important?",
    "Explain the difference between stack and heap memory.",
  ],
};

export function generateQuestions(skills: ExtractedSkills): string[] {
  const questions: string[] = [];
  const allSkills = Object.values(skills).flat();

  for (const skill of allSkills) {
    const bank = QUESTION_BANK[skill];
    if (bank) {
      for (const q of bank) {
        if (!questions.includes(q)) questions.push(q);
        if (questions.length >= 10) return questions;
      }
    }
  }

  // Fill remaining from general
  const general = QUESTION_BANK["General fresher stack"] || [];
  for (const q of general) {
    if (!questions.includes(q)) questions.push(q);
    if (questions.length >= 10) break;
  }

  return questions.slice(0, 10);
}

export function analyzeJD(company: string, role: string, jdText: string): AnalysisResult {
  const extractedSkills = extractSkills(jdText);
  const readinessScore = calculateReadinessScore(company, role, jdText, extractedSkills);
  const checklist = generateChecklist(extractedSkills);
  const plan = generatePlan(extractedSkills);
  const questions = generateQuestions(extractedSkills);

  return {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    company,
    role,
    jdText,
    extractedSkills,
    plan,
    checklist,
    questions,
    readinessScore,
  };
}

// localStorage helpers
const HISTORY_KEY = "jd-analysis-history";

export function saveAnalysis(result: AnalysisResult): void {
  const history = getHistory();
  history.unshift(result);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

export function getHistory(): AnalysisResult[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function getAnalysisById(id: string): AnalysisResult | undefined {
  return getHistory().find(h => h.id === id);
}
