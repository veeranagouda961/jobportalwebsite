import { ResumeData } from "@/data/resumeTypes";

export function resumeToPlainText(data: ResumeData): string {
  const lines: string[] = [];

  // Name & Contact
  if (data.personal.name) lines.push(data.personal.name);
  const contact = [data.personal.email, data.personal.phone, data.personal.location].filter(Boolean);
  if (contact.length) lines.push(contact.join(" | "));
  if (lines.length) lines.push("");

  // Summary
  if (data.summary) {
    lines.push("SUMMARY");
    lines.push(data.summary);
    lines.push("");
  }

  // Experience
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

  // Education
  if (data.education.length) {
    lines.push("EDUCATION");
    data.education.forEach((edu) => {
      const degree = [edu.degree, edu.field].filter(Boolean).join(" in ");
      const dates = [edu.startYear, edu.endYear].filter(Boolean).join(" – ");
      lines.push(`${degree}${edu.institution ? ` — ${edu.institution}` : ""}${dates ? `  (${dates})` : ""}`);
    });
    lines.push("");
  }

  // Projects
  if (data.projects.length) {
    lines.push("PROJECTS");
    data.projects.forEach((proj) => {
      lines.push(`${proj.title}${proj.techStack ? `  [${proj.techStack}]` : ""}`);
      if (proj.description) lines.push(proj.description);
      lines.push("");
    });
  }

  // Skills
  const skills = data.skills.split(",").map((s) => s.trim()).filter(Boolean);
  if (skills.length) {
    lines.push("SKILLS");
    lines.push(skills.join(", "));
    lines.push("");
  }

  // Links
  if (data.links.github || data.links.linkedin) {
    lines.push("LINKS");
    if (data.links.github) lines.push(`GitHub: ${data.links.github}`);
    if (data.links.linkedin) lines.push(`LinkedIn: ${data.links.linkedin}`);
    lines.push("");
  }

  return lines.join("\n").trim();
}
