import { useResume, ResumeTemplate } from "@/hooks/useResume";
import { Mail, Phone, MapPin, Github, Linkedin } from "lucide-react";
import { cn } from "@/lib/utils";

/* Template style configs — layout only, no color */
const templateStyles: Record<ResumeTemplate, {
  wrapper: string;
  headerLayout: string;
  nameSize: string;
  sectionTitle: string;
  skillStyle: string;
  sectionSpacing: string;
}> = {
  classic: {
    wrapper: "",
    headerLayout: "text-center border-b border-border pb-4",
    nameSize: "text-2xl font-bold tracking-tight",
    sectionTitle: "text-xs font-bold uppercase tracking-widest text-foreground mb-2 border-b border-border pb-1",
    skillStyle: "text-xs px-2 py-0.5 rounded border border-border text-foreground bg-secondary/50",
    sectionSpacing: "space-y-5",
  },
  modern: {
    wrapper: "",
    headerLayout: "pb-4 border-b-2 border-foreground",
    nameSize: "text-3xl font-bold tracking-tight",
    sectionTitle: "text-sm font-bold uppercase tracking-wide text-foreground mb-2",
    skillStyle: "text-xs px-2.5 py-1 rounded-full border border-border text-foreground",
    sectionSpacing: "space-y-6",
  },
  minimal: {
    wrapper: "",
    headerLayout: "pb-3",
    nameSize: "text-xl font-semibold tracking-tight",
    sectionTitle: "text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-1.5",
    skillStyle: "text-xs text-foreground",
    sectionSpacing: "space-y-4",
  },
};

export function ResumePreviewPanel() {
  const { resume, template } = useResume();
  const { personal, summary, education, experience, projects, skills, links } = resume;
  const styles = templateStyles[template];

  const skillList = skills.split(",").map((s) => s.trim()).filter(Boolean);

  const hasContent =
    personal.name || summary || education.length > 0 || experience.length > 0 || projects.length > 0 || skillList.length > 0;

  if (!hasContent) {
    return (
      <div className="flex flex-col items-center justify-center py-space-5 text-center">
        <p className="text-sm text-muted-foreground">
          Start filling in the form to see your resume here.
        </p>
      </div>
    );
  }

  return (
    <div className={cn(styles.sectionSpacing, "text-foreground")} style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Header */}
      {personal.name && (
        <div className={styles.headerLayout}>
          <h1 className={styles.nameSize} style={{ fontFamily: template === "minimal" ? "'DM Sans', sans-serif" : "'DM Serif Display', serif" }}>
            {personal.name}
          </h1>
          <div className={cn(
            "flex gap-4 mt-2 text-xs text-muted-foreground flex-wrap",
            template === "classic" ? "items-center justify-center" : "items-center"
          )}>
            {personal.email && <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {personal.email}</span>}
            {personal.phone && <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {personal.phone}</span>}
            {personal.location && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {personal.location}</span>}
          </div>
          {(links.github || links.linkedin) && (
            <div className={cn(
              "flex gap-4 mt-1 text-xs text-muted-foreground",
              template === "classic" ? "items-center justify-center" : "items-center"
            )}>
              {links.github && <span className="flex items-center gap-1"><Github className="h-3 w-3" /> {links.github}</span>}
              {links.linkedin && <span className="flex items-center gap-1"><Linkedin className="h-3 w-3" /> {links.linkedin}</span>}
            </div>
          )}
        </div>
      )}

      {/* Summary */}
      {summary && (
        <div>
          <h2 className={styles.sectionTitle}>Summary</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">{summary}</p>
        </div>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <div>
          <h2 className={styles.sectionTitle}>Experience</h2>
          <div className="space-y-3">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex items-baseline justify-between">
                  <span className="text-sm font-semibold">{exp.role}{exp.company && ` — ${exp.company}`}</span>
                  <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                    {exp.startDate}{exp.endDate && ` – ${exp.endDate}`}
                  </span>
                </div>
                {exp.description && (
                  <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">{exp.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div>
          <h2 className={styles.sectionTitle}>Education</h2>
          <div className="space-y-2">
            {education.map((edu) => (
              <div key={edu.id} className="flex items-baseline justify-between">
                <div>
                  <span className="text-sm font-semibold">{edu.degree}{edu.field && ` in ${edu.field}`}</span>
                  {edu.institution && <span className="text-xs text-muted-foreground ml-1">— {edu.institution}</span>}
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                  {edu.startYear}{edu.endYear && ` – ${edu.endYear}`}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <div>
          <h2 className={styles.sectionTitle}>Projects</h2>
          <div className="space-y-3">
            {projects.map((proj) => (
              <div key={proj.id}>
                <div className="flex items-baseline justify-between">
                  <span className="text-sm font-semibold">{proj.title}</span>
                  {proj.techStack && <span className="text-xs text-muted-foreground ml-2">{proj.techStack}</span>}
                </div>
                {proj.description && (
                  <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">{proj.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {skillList.length > 0 && (
        <div>
          <h2 className={styles.sectionTitle}>Skills</h2>
          <div className="flex flex-wrap gap-1.5">
            {template === "minimal" ? (
              <p className="text-xs text-foreground">{skillList.join(" · ")}</p>
            ) : (
              skillList.map((skill, i) => (
                <span key={i} className={styles.skillStyle}>{skill}</span>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
