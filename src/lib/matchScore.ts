import type { Job } from "@/data/jobs";
import type { Preferences } from "@/hooks/usePreferences";

function parseCSV(s: string): string[] {
  return s
    .split(",")
    .map((x) => x.trim().toLowerCase())
    .filter(Boolean);
}

export function computeMatchScore(job: Job, prefs: Preferences): number {
  let score = 0;

  const keywords = parseCSV(prefs.roleKeywords);
  const userSkills = parseCSV(prefs.skills);
  const titleLower = job.title.toLowerCase();
  const descLower = job.description.toLowerCase();

  // +25 if any roleKeyword appears in job.title
  if (keywords.some((kw) => titleLower.includes(kw))) score += 25;

  // +15 if any roleKeyword appears in job.description
  if (keywords.some((kw) => descLower.includes(kw))) score += 15;

  // +15 if job.location matches preferredLocations
  if (prefs.preferredLocations.includes(job.location)) score += 15;

  // +10 if job.mode matches preferredMode
  if (prefs.preferredMode.includes(job.mode)) score += 10;

  // +10 if job.experience matches experienceLevel
  if (prefs.experienceLevel && job.experience === prefs.experienceLevel) score += 10;

  // +15 if overlap between job.skills and user.skills
  const jobSkillsLower = job.skills.map((s) => s.toLowerCase());
  if (userSkills.some((s) => jobSkillsLower.includes(s))) score += 15;

  // +5 if postedDaysAgo <= 2
  if (job.postedDaysAgo <= 2) score += 5;

  // +5 if source is LinkedIn
  if (job.source === "LinkedIn") score += 5;

  return Math.min(score, 100);
}

export type ScoreTier = "high" | "good" | "neutral" | "low";

export function getScoreTier(score: number): ScoreTier {
  if (score >= 80) return "high";
  if (score >= 60) return "good";
  if (score >= 40) return "neutral";
  return "low";
}
