import { ResumeData } from "@/data/resumeTypes";
import { getAllSkills } from "@/lib/resumeToText";

export interface ATSResult {
  score: number;
  suggestions: string[];
}

const ACTION_VERBS = /\b(built|led|designed|improved|developed|implemented|created|optimized|automated|managed|launched|delivered|engineered|architected|reduced|increased|scaled|migrated|integrated|deployed)\b/i;

export function computeATSScore(resume: ResumeData): ATSResult {
  let score = 0;
  const suggestions: string[] = [];

  // +10 name
  if (resume.personal.name) { score += 10; }
  else { suggestions.push("Add your full name (+10 points)"); }

  // +10 email
  if (resume.personal.email) { score += 10; }
  else { suggestions.push("Add your email address (+10 points)"); }

  // +5 phone
  if (resume.personal.phone) { score += 5; }
  else { suggestions.push("Add your phone number (+5 points)"); }

  // +10 summary > 50 chars
  if (resume.summary.length > 50) { score += 10; }
  else { suggestions.push("Add a professional summary with 50+ characters (+10 points)"); }

  // +10 summary contains action verbs
  if (ACTION_VERBS.test(resume.summary)) { score += 10; }
  else if (resume.summary.length > 0) { suggestions.push("Use action verbs in your summary like 'built', 'led', 'designed' (+10 points)"); }
  else { suggestions.push("Add a summary with action verbs like 'built', 'led', 'designed' (+10 points)"); }

  // +15 at least 1 experience with bullets (description)
  const hasExpWithBullets = resume.experience.some((e) => e.description.length > 0);
  if (hasExpWithBullets) { score += 15; }
  else { suggestions.push("Add at least 1 experience entry with description (+15 points)"); }

  // +10 at least 1 education
  if (resume.education.length >= 1) { score += 10; }
  else { suggestions.push("Add at least 1 education entry (+10 points)"); }

  // +10 at least 5 skills
  const skillCount = getAllSkills(resume.skills).length;
  if (skillCount >= 5) { score += 10; }
  else { suggestions.push(`Add at least 5 skills — you have ${skillCount} (+10 points)`); }

  // +10 at least 1 project
  if (resume.projects.length >= 1) { score += 10; }
  else { suggestions.push("Add at least 1 project (+10 points)"); }

  // +5 LinkedIn
  if (resume.links.linkedin) { score += 5; }
  else { suggestions.push("Add your LinkedIn profile (+5 points)"); }

  // +5 GitHub
  if (resume.links.github) { score += 5; }
  else { suggestions.push("Add your GitHub profile (+5 points)"); }

  return {
    score: Math.min(100, score),
    suggestions,
  };
}
