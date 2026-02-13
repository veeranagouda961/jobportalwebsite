import { useResume, ResumeTemplate, ACCENT_COLORS } from "@/hooks/useResume";
import { Mail, Phone, MapPin, Github, Linkedin, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { getAllSkills } from "@/lib/resumeToText";

export function ResumePreviewPanel() {
  const { resume, template, accentColor } = useResume();
  const { personal, summary, education, experience, projects, skills, links } = resume;
  const accent = ACCENT_COLORS[accentColor].css;

  const allSkills = getAllSkills(skills);
  const hasSkillContent = allSkills.length > 0;
  const hasContent =
    personal.name || summary || education.length > 0 || experience.length > 0 || projects.length > 0 || hasSkillContent;

  if (!hasContent) {
    return (
      <div className="flex flex-col items-center justify-center py-space-5 text-center">
        <p className="text-sm text-muted-foreground">Start filling in the form to see your resume here.</p>
      </div>
    );
  }

  if (template === "modern") return <ModernLayout resume={resume} skills={skills} accent={accent} hasSkillContent={hasSkillContent} />;
  if (template === "minimal") return <MinimalLayout resume={resume} skills={skills} accent={accent} hasSkillContent={hasSkillContent} />;
  return <ClassicLayout resume={resume} skills={skills} accent={accent} hasSkillContent={hasSkillContent} />;
}

/* ────────────────── CLASSIC ────────────────── */
function ClassicLayout({ resume, skills, accent, hasSkillContent }: LayoutProps) {
  const { personal, summary, education, experience, projects, links } = resume;
  return (
    <div className="space-y-4 text-foreground" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {personal.name && (
        <div className="text-center pb-3" style={{ borderBottom: `2px solid ${accent}` }}>
          <h1 className="text-2xl font-bold tracking-tight" style={{ fontFamily: "'DM Serif Display', serif", color: accent }}>{personal.name}</h1>
          <ContactLine personal={personal} links={links} center />
        </div>
      )}
      {summary && <Section title="Summary" accent={accent} rule><p className="text-sm text-muted-foreground leading-relaxed">{summary}</p></Section>}
      {experience.length > 0 && (
        <Section title="Experience" accent={accent} rule>
          <div className="space-y-3">{experience.map((exp) => <ExpEntry key={exp.id} exp={exp} />)}</div>
        </Section>
      )}
      {education.length > 0 && (
        <Section title="Education" accent={accent} rule>
          <div className="space-y-2">{education.map((edu) => <EduEntry key={edu.id} edu={edu} />)}</div>
        </Section>
      )}
      {projects.length > 0 && (
        <Section title="Projects" accent={accent} rule>
          <div className="space-y-3">{projects.map((proj) => <ProjEntry key={proj.id} proj={proj} accent={accent} />)}</div>
        </Section>
      )}
      {hasSkillContent && <Section title="Skills" accent={accent} rule><SkillBadges skills={skills} accent={accent} /></Section>}
    </div>
  );
}

/* ────────────────── MODERN (two-column) ────────────────── */
function ModernLayout({ resume, skills, accent, hasSkillContent }: LayoutProps) {
  const { personal, summary, education, experience, projects, links } = resume;
  return (
    <div className="flex min-h-[400px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Sidebar */}
      <div className="w-[35%] p-4 rounded-l-md text-white" style={{ background: accent }}>
        {personal.name && (
          <h1 className="text-lg font-bold tracking-tight mb-3" style={{ fontFamily: "'DM Serif Display', serif" }}>{personal.name}</h1>
        )}
        <div className="space-y-1 text-xs opacity-90">
          {personal.email && <p className="flex items-center gap-1.5"><Mail className="h-3 w-3" /> {personal.email}</p>}
          {personal.phone && <p className="flex items-center gap-1.5"><Phone className="h-3 w-3" /> {personal.phone}</p>}
          {personal.location && <p className="flex items-center gap-1.5"><MapPin className="h-3 w-3" /> {personal.location}</p>}
          {links.github && <p className="flex items-center gap-1.5 mt-2"><Github className="h-3 w-3" /> {links.github}</p>}
          {links.linkedin && <p className="flex items-center gap-1.5"><Linkedin className="h-3 w-3" /> {links.linkedin}</p>}
        </div>
        {hasSkillContent && (
          <div className="mt-4">
            <h2 className="text-[11px] font-bold uppercase tracking-widest mb-2 opacity-80">Skills</h2>
            <div className="space-y-2">
              {skills.technical.length > 0 && (
                <div><span className="text-[9px] uppercase tracking-wide opacity-60">Technical</span>
                  <div className="flex flex-wrap gap-1 mt-0.5">{skills.technical.map((s, i) => <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-white/15">{s}</span>)}</div>
                </div>
              )}
              {skills.soft.length > 0 && (
                <div><span className="text-[9px] uppercase tracking-wide opacity-60">Soft Skills</span>
                  <div className="flex flex-wrap gap-1 mt-0.5">{skills.soft.map((s, i) => <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-white/15">{s}</span>)}</div>
                </div>
              )}
              {skills.tools.length > 0 && (
                <div><span className="text-[9px] uppercase tracking-wide opacity-60">Tools</span>
                  <div className="flex flex-wrap gap-1 mt-0.5">{skills.tools.map((s, i) => <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-white/15">{s}</span>)}</div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      {/* Main */}
      <div className="flex-1 p-4 space-y-4 text-foreground">
        {summary && <Section title="Summary" accent={accent}><p className="text-sm text-muted-foreground leading-relaxed">{summary}</p></Section>}
        {experience.length > 0 && <Section title="Experience" accent={accent}><div className="space-y-3">{experience.map((exp) => <ExpEntry key={exp.id} exp={exp} />)}</div></Section>}
        {education.length > 0 && <Section title="Education" accent={accent}><div className="space-y-2">{education.map((edu) => <EduEntry key={edu.id} edu={edu} />)}</div></Section>}
        {projects.length > 0 && <Section title="Projects" accent={accent}><div className="space-y-3">{projects.map((proj) => <ProjEntry key={proj.id} proj={proj} accent={accent} />)}</div></Section>}
      </div>
    </div>
  );
}

/* ────────────────── MINIMAL ────────────────── */
function MinimalLayout({ resume, skills, accent, hasSkillContent }: LayoutProps) {
  const { personal, summary, education, experience, projects, links } = resume;
  return (
    <div className="space-y-5 text-foreground" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {personal.name && (
        <div className="pb-3">
          <h1 className="text-xl font-semibold tracking-tight">{personal.name}</h1>
          <ContactLine personal={personal} links={links} />
        </div>
      )}
      {summary && <MinSection title="Summary" accent={accent}><p className="text-sm text-muted-foreground leading-relaxed">{summary}</p></MinSection>}
      {experience.length > 0 && <MinSection title="Experience" accent={accent}><div className="space-y-3">{experience.map((exp) => <ExpEntry key={exp.id} exp={exp} />)}</div></MinSection>}
      {education.length > 0 && <MinSection title="Education" accent={accent}><div className="space-y-2">{education.map((edu) => <EduEntry key={edu.id} edu={edu} />)}</div></MinSection>}
      {projects.length > 0 && <MinSection title="Projects" accent={accent}><div className="space-y-3">{projects.map((proj) => <ProjEntry key={proj.id} proj={proj} accent={accent} />)}</div></MinSection>}
      {hasSkillContent && (
        <MinSection title="Skills" accent={accent}>
          <div className="space-y-1">
            {skills.technical.length > 0 && <p className="text-xs text-foreground">{skills.technical.join(" · ")}</p>}
            {skills.soft.length > 0 && <p className="text-xs text-foreground">{skills.soft.join(" · ")}</p>}
            {skills.tools.length > 0 && <p className="text-xs text-foreground">{skills.tools.join(" · ")}</p>}
          </div>
        </MinSection>
      )}
    </div>
  );
}

/* ────────────────── Shared sub-components ────────────────── */

import { ResumeData, CategorizedSkills } from "@/data/resumeTypes";
import { ReactNode } from "react";

interface LayoutProps {
  resume: ResumeData;
  skills: CategorizedSkills;
  accent: string;
  hasSkillContent: boolean;
}

function ContactLine({ personal, links, center }: { personal: ResumeData["personal"]; links: ResumeData["links"]; center?: boolean }) {
  return (
    <>
      <div className={cn("flex gap-4 mt-2 text-xs text-muted-foreground flex-wrap", center ? "justify-center" : "")}>
        {personal.email && <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {personal.email}</span>}
        {personal.phone && <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {personal.phone}</span>}
        {personal.location && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {personal.location}</span>}
      </div>
      {(links.github || links.linkedin) && (
        <div className={cn("flex gap-4 mt-1 text-xs text-muted-foreground", center ? "justify-center" : "")}>
          {links.github && <span className="flex items-center gap-1"><Github className="h-3 w-3" /> {links.github}</span>}
          {links.linkedin && <span className="flex items-center gap-1"><Linkedin className="h-3 w-3" /> {links.linkedin}</span>}
        </div>
      )}
    </>
  );
}

function Section({ title, accent, rule, children }: { title: string; accent: string; rule?: boolean; children: ReactNode }) {
  return (
    <div>
      <h2 className="text-xs font-bold uppercase tracking-widest mb-2 pb-1" style={{ color: accent, borderBottom: rule ? `1px solid ${accent}33` : undefined }}>
        {title}
      </h2>
      {children}
    </div>
  );
}

function MinSection({ title, accent, children }: { title: string; accent: string; children: ReactNode }) {
  return (
    <div>
      <h2 className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-1.5" style={{ color: accent }}>
        {title}
      </h2>
      {children}
    </div>
  );
}

function ExpEntry({ exp }: { exp: ResumeData["experience"][0] }) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-semibold">{exp.role}{exp.company && ` — ${exp.company}`}</span>
        <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">{exp.startDate}{exp.endDate && ` – ${exp.endDate}`}</span>
      </div>
      {exp.description && <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">{exp.description}</p>}
    </div>
  );
}

function EduEntry({ edu }: { edu: ResumeData["education"][0] }) {
  return (
    <div className="flex items-baseline justify-between">
      <div>
        <span className="text-sm font-semibold">{edu.degree}{edu.field && ` in ${edu.field}`}</span>
        {edu.institution && <span className="text-xs text-muted-foreground ml-1">— {edu.institution}</span>}
      </div>
      <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">{edu.startYear}{edu.endYear && ` – ${edu.endYear}`}</span>
    </div>
  );
}

function ProjEntry({ proj, accent }: { proj: ResumeData["projects"][0]; accent: string }) {
  return (
    <div className="rounded border border-border p-3">
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-semibold">{proj.title}</span>
        <div className="flex items-center gap-2 ml-2">
          {proj.liveUrl && <ExternalLink className="h-3 w-3 text-muted-foreground" />}
          {proj.githubUrl && <Github className="h-3 w-3 text-muted-foreground" />}
        </div>
      </div>
      {proj.description && <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">{proj.description}</p>}
      {proj.techStack.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-1.5">
          {proj.techStack.map((tech, i) => (
            <span key={i} className="text-xs px-2 py-0.5 rounded border border-border" style={{ color: accent }}>{tech}</span>
          ))}
        </div>
      )}
    </div>
  );
}

function SkillBadges({ skills, accent }: { skills: CategorizedSkills; accent: string }) {
  return (
    <div className="space-y-2">
      {skills.technical.length > 0 && (
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Technical</span>
          <div className="flex flex-wrap gap-1.5 mt-0.5">
            {skills.technical.map((s, i) => <span key={i} className="text-xs px-2 py-0.5 rounded border border-border" style={{ color: accent }}>{s}</span>)}
          </div>
        </div>
      )}
      {skills.soft.length > 0 && (
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Soft Skills</span>
          <div className="flex flex-wrap gap-1.5 mt-0.5">
            {skills.soft.map((s, i) => <span key={i} className="text-xs px-2 py-0.5 rounded border border-border" style={{ color: accent }}>{s}</span>)}
          </div>
        </div>
      )}
      {skills.tools.length > 0 && (
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Tools & Technologies</span>
          <div className="flex flex-wrap gap-1.5 mt-0.5">
            {skills.tools.map((s, i) => <span key={i} className="text-xs px-2 py-0.5 rounded border border-border" style={{ color: accent }}>{s}</span>)}
          </div>
        </div>
      )}
    </div>
  );
}
