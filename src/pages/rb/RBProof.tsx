import { useState, useEffect, useMemo, useCallback } from "react";
import {
  ClipboardCheck, CheckCircle2, AlertTriangle, Copy, CheckCheck, ExternalLink, Square, CheckSquare
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { rbSteps } from "@/data/rbSteps";

const LINKS_KEY = "rb_final_submission";
const CHECKLIST_KEY = "rb_test_checklist";

interface ArtifactLinks {
  lovable: string;
  github: string;
  deployed: string;
}

const TEST_CHECKLIST = [
  "All form sections save to localStorage",
  "Live preview updates in real-time",
  "Template switching preserves data",
  "Color theme persists after refresh",
  "ATS score calculates correctly",
  "Score updates live on edit",
  "Export buttons work (copy/download)",
  "Empty states handled gracefully",
  "Mobile responsive layout works",
  "No console errors on any page",
];

function isValidUrl(str: string): boolean {
  try {
    const url = new URL(str);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function loadLinks(): ArtifactLinks {
  try {
    const raw = localStorage.getItem(LINKS_KEY);
    return raw ? JSON.parse(raw) : { lovable: "", github: "", deployed: "" };
  } catch {
    return { lovable: "", github: "", deployed: "" };
  }
}

function loadChecklist(): boolean[] {
  try {
    const raw = localStorage.getItem(CHECKLIST_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length === TEST_CHECKLIST.length) return parsed;
    }
    return new Array(TEST_CHECKLIST.length).fill(false);
  } catch {
    return new Array(TEST_CHECKLIST.length).fill(false);
  }
}

type ShipStatus = "Not Started" | "In Progress" | "Shipped";

export default function RBProof() {
  const [links, setLinks] = useState<ArtifactLinks>(loadLinks);
  const [checklist, setChecklist] = useState<boolean[]>(loadChecklist);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  useEffect(() => { localStorage.setItem(LINKS_KEY, JSON.stringify(links)); }, [links]);
  useEffect(() => { localStorage.setItem(CHECKLIST_KEY, JSON.stringify(checklist)); }, [checklist]);

  const stepStatuses = useMemo(() => {
    return rbSteps.map((step) => ({
      ...step,
      completed: !!localStorage.getItem(`rb_step_${step.number}_artifact`),
    }));
  }, []);

  const allStepsCompleted = stepStatuses.every((s) => s.completed);
  const completedStepCount = stepStatuses.filter((s) => s.completed).length;

  const allLinksValid = useMemo(
    () => isValidUrl(links.lovable) && isValidUrl(links.github) && isValidUrl(links.deployed),
    [links]
  );

  const allChecklistPassed = checklist.every(Boolean);
  const checklistPassedCount = checklist.filter(Boolean).length;

  const canShip = allStepsCompleted && allChecklistPassed && allLinksValid;

  const shipStatus: ShipStatus = useMemo(() => {
    if (canShip) return "Shipped";
    if (completedStepCount > 0 || links.lovable || links.github || links.deployed || checklistPassedCount > 0) return "In Progress";
    return "Not Started";
  }, [canShip, completedStepCount, links, checklistPassedCount]);

  const statusColor: Record<ShipStatus, string> = {
    "Not Started": "bg-secondary text-muted-foreground border-border",
    "In Progress": "bg-[hsl(40,60%,50%)]/15 text-foreground border-[hsl(40,60%,50%)]/30",
    "Shipped": "bg-[hsl(140,30%,42%)]/15 text-[hsl(140,30%,42%)] border-[hsl(140,30%,42%)]/30",
  };

  const updateLink = (key: keyof ArtifactLinks, value: string) =>
    setLinks((prev) => ({ ...prev, [key]: value }));

  const toggleChecklist = (index: number) =>
    setChecklist((prev) => prev.map((v, i) => (i === index ? !v : v)));

  const submissionText = `------------------------------------------
AI Resume Builder — Final Submission

Lovable Project: ${links.lovable || "(not provided)"}
GitHub Repository: ${links.github || "(not provided)"}
Live Deployment: ${links.deployed || "(not provided)"}

Core Capabilities:
- Structured resume builder
- Deterministic ATS scoring
- Template switching
- PDF export with clean formatting
- Persistence + validation checklist
------------------------------------------`;

  const copySubmission = useCallback(() => {
    navigator.clipboard.writeText(submissionText).then(() => {
      setCopied(true);
      toast({ title: "Submission copied to clipboard" });
      setTimeout(() => setCopied(false), 2000);
    });
  }, [submissionText, toast]);

  const linkFields: { key: keyof ArtifactLinks; label: string; placeholder: string }[] = [
    { key: "lovable", label: "Lovable Project Link", placeholder: "https://lovable.dev/projects/..." },
    { key: "github", label: "GitHub Repository Link", placeholder: "https://github.com/..." },
    { key: "deployed", label: "Deployed URL", placeholder: "https://your-app.lovable.app" },
  ];

  return (
    <main className="flex-1 px-space-3 py-space-5">
      <div className="mx-auto max-w-2xl space-y-space-4">
        {/* Header */}
        <div className="text-center">
          <ClipboardCheck className="mx-auto h-10 w-10 text-muted-foreground/50" strokeWidth={1.5} />
          <h1 className="mt-space-2 text-3xl md:text-4xl font-serif text-foreground">
            AI Resume Builder — Final Proof
          </h1>
          <p className="mt-space-1 text-base text-muted-foreground">Project 3</p>
          <Badge
            variant="outline"
            className={`mt-space-2 text-xs font-medium px-3 py-1 rounded-md ${statusColor[shipStatus]}`}
          >
            {shipStatus}
          </Badge>
        </div>

        {/* A) Step Completion Overview */}
        <section className="rounded-lg border border-border bg-card p-space-3">
          <h2 className="text-lg font-serif text-foreground mb-space-2">
            Step Completion ({completedStepCount} / 8)
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {stepStatuses.map((step) => (
              <div key={step.number} className="flex items-center gap-2 text-sm">
                {step.completed ? (
                  <CheckCircle2 className="h-4 w-4 text-[hsl(140,30%,42%)]" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-[hsl(40,60%,50%)]" />
                )}
                <span className={step.completed ? "text-foreground" : "text-muted-foreground"}>
                  Step {step.number}: {step.title}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Test Checklist */}
        <section className="rounded-lg border border-border bg-card p-space-3">
          <h2 className="text-lg font-serif text-foreground mb-space-2">
            Test Checklist ({checklistPassedCount} / {TEST_CHECKLIST.length})
          </h2>
          <div className="space-y-1.5">
            {TEST_CHECKLIST.map((item, i) => (
              <button
                key={i}
                onClick={() => toggleChecklist(i)}
                className="flex items-center gap-2 text-sm w-full text-left py-1 hover:bg-accent/50 rounded px-1 transition-colors"
              >
                {checklist[i] ? (
                  <CheckSquare className="h-4 w-4 text-[hsl(140,30%,42%)] shrink-0" />
                ) : (
                  <Square className="h-4 w-4 text-muted-foreground shrink-0" />
                )}
                <span className={checklist[i] ? "text-foreground" : "text-muted-foreground"}>
                  {item}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* B) Artifact Collection */}
        <section className="rounded-lg border border-border bg-card p-space-3">
          <h2 className="text-lg font-serif text-foreground mb-space-2">Artifact Links</h2>
          <div className="space-y-space-2">
            {linkFields.map(({ key, label, placeholder }) => (
              <div key={key}>
                <Label className="text-sm text-foreground">{label}</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    value={links[key]}
                    onChange={(e) => updateLink(key, e.target.value)}
                    placeholder={placeholder}
                    className="flex-1"
                  />
                  {isValidUrl(links[key]) && (
                    <a
                      href={links[key]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center h-10 w-10 rounded-md border border-border text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
                {links[key] && !isValidUrl(links[key]) && (
                  <p className="text-xs text-destructive mt-1">Enter a valid URL (https://...)</p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Final Submission Export */}
        <section className={`rounded-lg border bg-card p-space-3 ${
          !canShip ? "border-border/50 opacity-60 pointer-events-none" : "border-border"
        }`}>
          <h2 className="text-lg font-serif text-foreground mb-space-2">Final Submission</h2>
          {!canShip && (
            <div className="flex items-start gap-2 mb-space-2 text-sm text-[hsl(40,60%,50%)]">
              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>
                Complete all 8 steps, pass all 10 checklist tests, and provide 3 valid links to unlock shipping.
              </span>
            </div>
          )}
          <pre className="text-xs text-muted-foreground bg-secondary/50 rounded-md p-space-2 whitespace-pre-wrap mb-space-2 border border-border">
            {submissionText}
          </pre>
          <Button
            onClick={copySubmission}
            disabled={!canShip}
            variant="outline"
            className="w-full"
          >
            {copied ? (
              <><CheckCheck className="h-4 w-4" /> Copied</>
            ) : (
              <><Copy className="h-4 w-4" /> Copy Final Submission</>
            )}
          </Button>
        </section>

        {/* Shipped confirmation */}
        {shipStatus === "Shipped" && (
          <div className="text-center py-space-4">
            <p className="text-lg font-serif text-[hsl(140,30%,42%)]">
              Project 3 Shipped Successfully.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
