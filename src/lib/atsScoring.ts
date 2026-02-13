import { ResumeData } from "@/data/resumeTypes";

export interface ATSResult {
  score: number;
  suggestions: string[];
}

function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function hasMetric(text: string): boolean {
  return /\d+%|\d+x|\d+k|\d+\+|\d+K|\$\d+|\d+ (users|requests|clients|customers|projects|months|years)/i.test(text);
}

export function computeATSScore(resume: ResumeData): ATSResult {
  let score = 0;
  const suggestions: string[] = [];

  // +15 if summary 40–120 words
  const summaryWords = wordCount(resume.summary);
  if (summaryWords >= 40 && summaryWords <= 120) {
    score += 15;
  } else if (summaryWords > 0) {
    score += 5; // partial credit
    if (summaryWords < 40) {
      suggestions.push("Write a stronger summary (target 40–120 words).");
    } else {
      suggestions.push("Shorten your summary to under 120 words for better ATS parsing.");
    }
  } else {
    suggestions.push("Add a professional summary (40–120 words).");
  }

  // +10 if ≥2 projects
  if (resume.projects.length >= 2) {
    score += 10;
  } else {
    suggestions.push(`Add at least 2 projects (you have ${resume.projects.length}).`);
  }

  // +10 if ≥1 experience
  if (resume.experience.length >= 1) {
    score += 10;
  } else {
    suggestions.push("Add at least 1 work experience entry.");
  }

  // +10 if ≥8 skills
  const skillList = resume.skills.split(",").map((s) => s.trim()).filter(Boolean);
  if (skillList.length >= 8) {
    score += 10;
  } else {
    suggestions.push(`Add more skills (target 8+, you have ${skillList.length}).`);
  }

  // +10 if GitHub or LinkedIn
  if (resume.links.github || resume.links.linkedin) {
    score += 10;
  } else {
    suggestions.push("Add a GitHub or LinkedIn link.");
  }

  // +15 if any bullet contains metrics
  const allBullets = [
    ...resume.experience.map((e) => e.description),
    ...resume.projects.map((p) => p.description),
  ];
  if (allBullets.some(hasMetric)) {
    score += 15;
  } else if (allBullets.length > 0) {
    suggestions.push("Add measurable impact (numbers, %, X) in your bullets.");
  }

  // +10 if education has complete fields
  const hasCompleteEdu = resume.education.some(
    (e) => e.institution && e.degree && e.field && e.startYear && e.endYear
  );
  if (hasCompleteEdu) {
    score += 10;
  } else if (resume.education.length > 0) {
    suggestions.push("Complete all education fields (institution, degree, field, years).");
  } else {
    suggestions.push("Add your education details.");
  }

  // +20 bonus for having name + email + phone (basic completeness)
  let basicScore = 0;
  if (resume.personal.name) basicScore += 7;
  if (resume.personal.email) basicScore += 7;
  if (resume.personal.phone) basicScore += 6;
  score += basicScore;

  return {
    score: Math.min(100, score),
    suggestions: suggestions.slice(0, 3),
  };
}
