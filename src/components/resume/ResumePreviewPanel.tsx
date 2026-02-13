import { useResume } from "@/hooks/useResume";
import { Mail, Phone, MapPin, Github, Linkedin } from "lucide-react";

export function ResumePreviewPanel() {
  const { resume } = useResume();
  const { personal, summary, education, experience, projects, skills, links } = resume;

  const skillList = skills
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

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
    <div className="space-y-5 text-foreground" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Header */}
      {personal.name && (
        <div className="text-center border-b border-border pb-4">
          <h1 className="text-2xl font-bold tracking-tight" style={{ fontFamily: "'DM Serif Display', serif" }}>
            {personal.name}
          </h1>
          <div className="flex items-center justify-center gap-4 mt-2 text-xs text-muted-foreground flex-wrap">
            {personal.email && (
              <span className="flex items-center gap-1">
                <Mail className="h-3 w-3" /> {personal.email}
              </span>
            )}
            {personal.phone && (
              <span className="flex items-center gap-1">
                <Phone className="h-3 w-3" /> {personal.phone}
              </span>
            )}
            {personal.location && (
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" /> {personal.location}
              </span>
            )}
          </div>
          {(links.github || links.linkedin) && (
            <div className="flex items-center justify-center gap-4 mt-1 text-xs text-muted-foreground">
              {links.github && (
                <span className="flex items-center gap-1">
                  <Github className="h-3 w-3" /> {links.github}
                </span>
              )}
              {links.linkedin && (
                <span className="flex items-center gap-1">
                  <Linkedin className="h-3 w-3" /> {links.linkedin}
                </span>
              )}
            </div>
          )}
        </div>
      )}

      {/* Summary */}
      {summary && (
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-foreground mb-1">Summary</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">{summary}</p>
        </div>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-foreground mb-2">Experience</h2>
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
          <h2 className="text-xs font-bold uppercase tracking-widest text-foreground mb-2">Education</h2>
          <div className="space-y-2">
            {education.map((edu) => (
              <div key={edu.id} className="flex items-baseline justify-between">
                <div>
                  <span className="text-sm font-semibold">
                    {edu.degree}{edu.field && ` in ${edu.field}`}
                  </span>
                  {edu.institution && (
                    <span className="text-xs text-muted-foreground ml-1">— {edu.institution}</span>
                  )}
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
          <h2 className="text-xs font-bold uppercase tracking-widest text-foreground mb-2">Projects</h2>
          <div className="space-y-3">
            {projects.map((proj) => (
              <div key={proj.id}>
                <div className="flex items-baseline justify-between">
                  <span className="text-sm font-semibold">{proj.title}</span>
                  {proj.techStack && (
                    <span className="text-xs text-muted-foreground ml-2">{proj.techStack}</span>
                  )}
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
          <h2 className="text-xs font-bold uppercase tracking-widest text-foreground mb-2">Skills</h2>
          <div className="flex flex-wrap gap-1.5">
            {skillList.map((skill, i) => (
              <span
                key={i}
                className="text-xs px-2 py-0.5 rounded border border-border text-foreground bg-secondary/50"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
