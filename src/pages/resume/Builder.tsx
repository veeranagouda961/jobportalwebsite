import { useResume } from "@/hooks/useResume";
import { sampleResume, Education, Experience, Project } from "@/data/resumeTypes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Plus, Trash2, Database } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ResumePreviewPanel } from "@/components/resume/ResumePreviewPanel";

function genId() {
  return Math.random().toString(36).slice(2, 9);
}

const Builder = () => {
  const { resume, updateResume, setResume } = useResume();
  const { toast } = useToast();

  const loadSample = () => {
    setResume(sampleResume);
    toast({ title: "Sample data loaded" });
  };

  const updatePersonal = (key: keyof typeof resume.personal, value: string) =>
    updateResume((r) => ({ ...r, personal: { ...r.personal, [key]: value } }));

  const addEducation = () =>
    updateResume((r) => ({
      ...r,
      education: [...r.education, { id: genId(), institution: "", degree: "", field: "", startYear: "", endYear: "" }],
    }));

  const updateEducation = (id: string, key: keyof Education, value: string) =>
    updateResume((r) => ({
      ...r,
      education: r.education.map((e) => (e.id === id ? { ...e, [key]: value } : e)),
    }));

  const removeEducation = (id: string) =>
    updateResume((r) => ({ ...r, education: r.education.filter((e) => e.id !== id) }));

  const addExperience = () =>
    updateResume((r) => ({
      ...r,
      experience: [...r.experience, { id: genId(), company: "", role: "", startDate: "", endDate: "", description: "" }],
    }));

  const updateExperience = (id: string, key: keyof Experience, value: string) =>
    updateResume((r) => ({
      ...r,
      experience: r.experience.map((e) => (e.id === id ? { ...e, [key]: value } : e)),
    }));

  const removeExperience = (id: string) =>
    updateResume((r) => ({ ...r, experience: r.experience.filter((e) => e.id !== id) }));

  const addProject = () =>
    updateResume((r) => ({
      ...r,
      projects: [...r.projects, { id: genId(), title: "", description: "", techStack: "" }],
    }));

  const updateProject = (id: string, key: keyof Project, value: string) =>
    updateResume((r) => ({
      ...r,
      projects: r.projects.map((p) => (p.id === id ? { ...p, [key]: value } : p)),
    }));

  const removeProject = (id: string) =>
    updateResume((r) => ({ ...r, projects: r.projects.filter((p) => p.id !== id) }));

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Left: Form */}
      <div className="flex-1 overflow-y-auto p-space-3 space-y-space-3">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-serif text-foreground">Resume Builder</h1>
          <Button variant="outline" size="sm" onClick={loadSample}>
            <Database className="h-3.5 w-3.5 mr-1" /> Load Sample Data
          </Button>
        </div>

        {/* Personal Info */}
        <section className="rounded-lg border border-border bg-card p-space-3 space-y-space-2">
          <h2 className="text-base font-semibold text-foreground">Personal Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-2">
            <div className="space-y-1">
              <Label className="text-sm">Full Name</Label>
              <Input value={resume.personal.name} onChange={(e) => updatePersonal("name", e.target.value)} placeholder="John Doe" />
            </div>
            <div className="space-y-1">
              <Label className="text-sm">Email</Label>
              <Input value={resume.personal.email} onChange={(e) => updatePersonal("email", e.target.value)} placeholder="john@email.com" />
            </div>
            <div className="space-y-1">
              <Label className="text-sm">Phone</Label>
              <Input value={resume.personal.phone} onChange={(e) => updatePersonal("phone", e.target.value)} placeholder="+91 98765 43210" />
            </div>
            <div className="space-y-1">
              <Label className="text-sm">Location</Label>
              <Input value={resume.personal.location} onChange={(e) => updatePersonal("location", e.target.value)} placeholder="Bangalore, India" />
            </div>
          </div>
        </section>

        {/* Summary */}
        <section className="rounded-lg border border-border bg-card p-space-3 space-y-space-2">
          <h2 className="text-base font-semibold text-foreground">Professional Summary</h2>
          <Textarea
            value={resume.summary}
            onChange={(e) => updateResume((r) => ({ ...r, summary: e.target.value }))}
            placeholder="Write a brief professional summary..."
            className="min-h-[100px] resize-y"
          />
        </section>

        {/* Education */}
        <section className="rounded-lg border border-border bg-card p-space-3 space-y-space-2">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-foreground">Education</h2>
            <Button variant="ghost" size="sm" onClick={addEducation}>
              <Plus className="h-3.5 w-3.5 mr-1" /> Add
            </Button>
          </div>
          {resume.education.length === 0 && (
            <p className="text-sm text-muted-foreground">No education entries yet.</p>
          )}
          {resume.education.map((edu, i) => (
            <div key={edu.id} className="space-y-space-1">
              {i > 0 && <Separator />}
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground font-medium">Entry {i + 1}</span>
                <Button variant="ghost" size="sm" onClick={() => removeEducation(edu.id)} className="text-destructive h-7 px-2">
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-1">
                <div className="space-y-1">
                  <Label className="text-xs">Institution</Label>
                  <Input value={edu.institution} onChange={(e) => updateEducation(edu.id, "institution", e.target.value)} placeholder="University name" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Degree</Label>
                  <Input value={edu.degree} onChange={(e) => updateEducation(edu.id, "degree", e.target.value)} placeholder="B.Tech" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Field of Study</Label>
                  <Input value={edu.field} onChange={(e) => updateEducation(edu.id, "field", e.target.value)} placeholder="Computer Science" />
                </div>
                <div className="grid grid-cols-2 gap-space-1">
                  <div className="space-y-1">
                    <Label className="text-xs">Start Year</Label>
                    <Input value={edu.startYear} onChange={(e) => updateEducation(edu.id, "startYear", e.target.value)} placeholder="2019" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">End Year</Label>
                    <Input value={edu.endYear} onChange={(e) => updateEducation(edu.id, "endYear", e.target.value)} placeholder="2023" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Experience */}
        <section className="rounded-lg border border-border bg-card p-space-3 space-y-space-2">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-foreground">Experience</h2>
            <Button variant="ghost" size="sm" onClick={addExperience}>
              <Plus className="h-3.5 w-3.5 mr-1" /> Add
            </Button>
          </div>
          {resume.experience.length === 0 && (
            <p className="text-sm text-muted-foreground">No experience entries yet.</p>
          )}
          {resume.experience.map((exp, i) => (
            <div key={exp.id} className="space-y-space-1">
              {i > 0 && <Separator />}
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground font-medium">Entry {i + 1}</span>
                <Button variant="ghost" size="sm" onClick={() => removeExperience(exp.id)} className="text-destructive h-7 px-2">
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-1">
                <div className="space-y-1">
                  <Label className="text-xs">Company</Label>
                  <Input value={exp.company} onChange={(e) => updateExperience(exp.id, "company", e.target.value)} placeholder="Company name" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Role</Label>
                  <Input value={exp.role} onChange={(e) => updateExperience(exp.id, "role", e.target.value)} placeholder="Software Engineer" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Start Date</Label>
                  <Input value={exp.startDate} onChange={(e) => updateExperience(exp.id, "startDate", e.target.value)} placeholder="Jul 2023" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">End Date</Label>
                  <Input value={exp.endDate} onChange={(e) => updateExperience(exp.id, "endDate", e.target.value)} placeholder="Present" />
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Description</Label>
                <Textarea value={exp.description} onChange={(e) => updateExperience(exp.id, "description", e.target.value)} placeholder="Key achievements and responsibilities..." className="min-h-[80px] resize-y" />
              </div>
            </div>
          ))}
        </section>

        {/* Projects */}
        <section className="rounded-lg border border-border bg-card p-space-3 space-y-space-2">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-foreground">Projects</h2>
            <Button variant="ghost" size="sm" onClick={addProject}>
              <Plus className="h-3.5 w-3.5 mr-1" /> Add
            </Button>
          </div>
          {resume.projects.length === 0 && (
            <p className="text-sm text-muted-foreground">No projects yet.</p>
          )}
          {resume.projects.map((proj, i) => (
            <div key={proj.id} className="space-y-space-1">
              {i > 0 && <Separator />}
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground font-medium">Project {i + 1}</span>
                <Button variant="ghost" size="sm" onClick={() => removeProject(proj.id)} className="text-destructive h-7 px-2">
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Title</Label>
                <Input value={proj.title} onChange={(e) => updateProject(proj.id, "title", e.target.value)} placeholder="Project name" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Description</Label>
                <Textarea value={proj.description} onChange={(e) => updateProject(proj.id, "description", e.target.value)} placeholder="What it does..." className="min-h-[60px] resize-y" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Tech Stack</Label>
                <Input value={proj.techStack} onChange={(e) => updateProject(proj.id, "techStack", e.target.value)} placeholder="React, Node.js, PostgreSQL" />
              </div>
            </div>
          ))}
        </section>

        {/* Skills */}
        <section className="rounded-lg border border-border bg-card p-space-3 space-y-space-2">
          <h2 className="text-base font-semibold text-foreground">Skills</h2>
          <Input
            value={resume.skills}
            onChange={(e) => updateResume((r) => ({ ...r, skills: e.target.value }))}
            placeholder="React, TypeScript, Node.js, Python..."
          />
          <p className="text-xs text-muted-foreground">Comma-separated list</p>
        </section>

        {/* Links */}
        <section className="rounded-lg border border-border bg-card p-space-3 space-y-space-2">
          <h2 className="text-base font-semibold text-foreground">Links</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-2">
            <div className="space-y-1">
              <Label className="text-sm">GitHub</Label>
              <Input
                value={resume.links.github}
                onChange={(e) => updateResume((r) => ({ ...r, links: { ...r.links, github: e.target.value } }))}
                placeholder="https://github.com/..."
              />
            </div>
            <div className="space-y-1">
              <Label className="text-sm">LinkedIn</Label>
              <Input
                value={resume.links.linkedin}
                onChange={(e) => updateResume((r) => ({ ...r, links: { ...r.links, linkedin: e.target.value } }))}
                placeholder="https://linkedin.com/in/..."
              />
            </div>
          </div>
        </section>
      </div>

      {/* Right: Live Preview */}
      <div className="w-[45%] min-w-[360px] border-l border-border bg-card overflow-y-auto hidden lg:block">
        <div className="p-space-3">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-space-2">Live Preview</h3>
          <ResumePreviewPanel />
        </div>
      </div>
    </div>
  );
};

export default Builder;
