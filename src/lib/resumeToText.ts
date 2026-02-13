import { ResumeData } from "@/data/resumeTypes";

/** Flatten all skills into a single array */
export function getAllSkills(skills: ResumeData["skills"]): string[] {
  return [...skills.technical, ...skills.soft, ...skills.tools];
}

export function resumeToPlainText(data: ResumeData): string {
  const lines: string[] = [];

  if (data.personal.name) lines.push(data.personal.name);
  const contact = [data.personal.email, data.personal.phone, data.personal.location].filter(Boolean);
  if (contact.length) lines.push(contact.join(" | "));
  if (lines.length) lines.push("");

  if (data.summary) {
    lines.push("SUMMARY");
    lines.push(data.summary);
    lines.push("");
  }

  if (data.experience.length) {
    lines.push("EXPERIENCE");
    data.experience.forEach((exp) => {
      const title = [exp.role, exp.company].filter(Boolean).join(" — ");
      const dates = [exp.startDate, exp.endDate].filter(Boolean).join(" – ");
      lines.push(`${title}${dates ? `  (${dates})` : ""}`);
      if (exp.description) lines.push(exp.description);
      lines.push("");
    });
  }

  if (data.education.length) {
    lines.push("EDUCATION");
    data.education.forEach((edu) => {
      const degree = [edu.degree, edu.field].filter(Boolean).join(" in ");
      const dates = [edu.startYear, edu.endYear].filter(Boolean).join(" – ");
      lines.push(`${degree}${edu.institution ? ` — ${edu.institution}` : ""}${dates ? `  (${dates})` : ""}`);
    });
    lines.push("");
  }

  if (data.projects.length) {
    lines.push("PROJECTS");
    data.projects.forEach((proj) => {
      const tech = proj.techStack.length ? `  [${proj.techStack.join(", ")}]` : "";
      lines.push(`${proj.title}${tech}`);
      if (proj.description) lines.push(proj.description);
      if (proj.liveUrl) lines.push(`Live: ${proj.liveUrl}`);
      if (proj.githubUrl) lines.push(`GitHub: ${proj.githubUrl}`);
      lines.push("");
    });
  }

  const allSkills = getAllSkills(data.skills);
  if (allSkills.length) {
    lines.push("SKILLS");
    if (data.skills.technical.length) lines.push(`Technical: ${data.skills.technical.join(", ")}`);
    if (data.skills.soft.length) lines.push(`Soft Skills: ${data.skills.soft.join(", ")}`);
    if (data.skills.tools.length) lines.push(`Tools: ${data.skills.tools.join(", ")}`);
    lines.push("");
  }

  if (data.links.github || data.links.linkedin) {
    lines.push("LINKS");
    if (data.links.github) lines.push(`GitHub: ${data.links.github}`);
    if (data.links.linkedin) lines.push(`LinkedIn: ${data.links.linkedin}`);
    lines.push("");
  }

  return lines.join("\n").trim();
}
