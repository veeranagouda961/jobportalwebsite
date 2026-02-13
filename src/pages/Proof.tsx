import { useState, useEffect, useMemo, useCallback } from "react";
import {
  ClipboardCheck, RotateCcw, AlertTriangle, CheckCircle2,
  ExternalLink, Copy, CheckCheck
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";

/* ─── localStorage keys ─── */
const CHECKLIST_KEY = "jobTrackerTestChecklist";
const LINKS_KEY = "jobTrackerSubmissionLinks";

/* ─── Test checklist items ─── */
interface TestItem {
  id: string;
  label: string;
  howToTest: string;
}

const testItems: TestItem[] = [
  { id: "prefs_persist", label: "Preferences persist after refresh", howToTest: "Go to /settings, save preferences, refresh the page, and confirm they're still there." },
  { id: "match_score", label: "Match score calculates correctly", howToTest: "Set preferences, go to /dashboard, and verify score badges reflect your keywords, location, and skills." },
  { id: "show_matches", label: '"Show only matches" toggle works', howToTest: "Enable the toggle on /dashboard and confirm only jobs above your threshold appear." },
  { id: "save_persist", label: "Save job persists after refresh", howToTest: "Save a job on /dashboard, refresh, then check /saved to confirm it's still there." },
  { id: "apply_tab", label: "Apply opens in new tab", howToTest: 'Click "Apply" on any job card and confirm the link opens in a new browser tab.' },
  { id: "status_persist", label: "Status update persists after refresh", howToTest: 'Change a job status to "Applied", refresh the page, and confirm the status is retained.' },
  { id: "status_filter", label: "Status filter works correctly", howToTest: 'Use the Status dropdown on /dashboard to filter by "Applied" and confirm only matching jobs show.' },
  { id: "digest_top10", label: "Digest generates top 10 by score", howToTest: "Generate a digest on /digest and verify the list contains 10 jobs sorted by match score." },
  { id: "digest_persist", label: "Digest persists for the day", howToTest: "Generate a digest, refresh the page, and confirm the same digest loads without regenerating." },
  { id: "no_errors", label: "No console errors on main pages", howToTest: "Open browser DevTools, visit each page, and confirm no red errors appear in the Console tab." },
];

/* ─── Step definitions ─── */
const steps = [
  "Project Setup",
  "Job Data Layer",
  "Dashboard & Filters",
  "Preferences & Match Scoring",
  "Save & Apply Flow",
  "Status Tracking",
  "Daily Digest Engine",
  "Test Checklist & Proof",
];

/* ─── Artifact link fields ─── */
interface ArtifactLinks {
  lovable: string;
  github: string;
  deployed: string;
}

function isValidUrl(str: string): boolean {
  try {
    const url = new URL(str);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function loadChecked(): Record<string, boolean> {
  try {
    const raw = localStorage.getItem(CHECKLIST_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
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

type ShipStatus = "Not Started" | "In Progress" | "Shipped";

const Proof = () => {
  const [checked, setChecked] = useState<Record<string, boolean>>(loadChecked);
  const [links, setLinks] = useState<ArtifactLinks>(loadLinks);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    localStorage.setItem(CHECKLIST_KEY, JSON.stringify(checked));
  }, [checked]);

  useEffect(() => {
    localStorage.setItem(LINKS_KEY, JSON.stringify(links));
  }, [links]);

  const toggle = (id: string) =>
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));

  const passedCount = useMemo(
    () => testItems.filter((t) => checked[t.id]).length,
    [checked]
  );
  const allTestsPassed = passedCount === testItems.length;

  const allLinksValid = useMemo(
    () => isValidUrl(links.lovable) && isValidUrl(links.github) && isValidUrl(links.deployed),
    [links]
  );

  const shipStatus: ShipStatus = useMemo(() => {
    if (allTestsPassed && allLinksValid) return "Shipped";
    if (passedCount > 0 || links.lovable || links.github || links.deployed) return "In Progress";
    return "Not Started";
  }, [allTestsPassed, allLinksValid, passedCount, links]);

  const statusColor: Record<ShipStatus, string> = {
    "Not Started": "bg-secondary text-muted-foreground border-border",
    "In Progress": "bg-[hsl(40,60%,50%)]/15 text-foreground border-[hsl(40,60%,50%)]/30",
    "Shipped": "bg-[hsl(140,30%,42%)]/15 text-[hsl(140,30%,42%)] border-[hsl(140,30%,42%)]/30",
  };

  const updateLink = (key: keyof ArtifactLinks, value: string) =>
    setLinks((prev) => ({ ...prev, [key]: value }));

  const submissionText = `Job Notification Tracker — Final Submission

Lovable Project:
${links.lovable || "(not provided)"}

GitHub Repository:
${links.github || "(not provided)"}

Live Deployment:
${links.deployed || "(not provided)"}

Core Features:
- Intelligent match scoring
- Daily digest simulation
- Status tracking
- Test checklist enforced`;

  const copySubmission = useCallback(() => {
    navigator.clipboard.writeText(submissionText).then(() => {
      setCopied(true);
      toast({ title: "Submission copied to clipboard" });
      setTimeout(() => setCopied(false), 2000);
    });
  }, [submissionText, toast]);

  const reset = () => {
    setChecked({});
    toast({ title: "Test status reset" });
  };

  const linkFields: { key: keyof ArtifactLinks; label: string; placeholder: string }[] = [
    { key: "lovable", label: "Lovable Project Link", placeholder: "https://lovable.dev/projects/..." },
    { key: "github", label: "GitHub Repository Link", placeholder: "https://github.com/..." },
    { key: "deployed", label: "Deployed URL", placeholder: "https://your-app.vercel.app" },
  ];

  return (
    <main className="flex-1 px-space-3 py-space-5">
      <div className="mx-auto max-w-2xl space-y-space-4">
        {/* ─── Header ─── */}
        <div className="text-center">
          <ClipboardCheck className="mx-auto h-10 w-10 text-muted-foreground/50" strokeWidth={1.5} />
          <h1 className="mt-space-2 text-3xl md:text-4xl font-serif text-foreground">
            Project 1 — Final Proof
          </h1>
          <p className="mt-space-1 text-base text-muted-foreground">
            Job Notification Tracker
          </p>
          <Badge
            variant="outline"
            className={`mt-space-2 text-xs font-medium px-3 py-1 rounded-md ${statusColor[shipStatus]}`}
          >
            {shipStatus}
          </Badge>
        </div>

        {/* ─── A) Step Completion Summary ─── */}
        <section className="rounded-lg border border-border bg-card p-space-3">
          <h2 className="text-lg font-serif text-foreground mb-space-2">Step Completion</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {steps.map((step, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-[hsl(140,30%,42%)]" />
                <span className="text-foreground">
                  Step {i + 1}: {step}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ─── B) Test Checklist ─── */}
        <section className="rounded-lg border border-border bg-card p-space-3">
          <div className="flex items-center justify-between mb-space-2">
            <div className="flex items-center gap-2">
              {allTestsPassed ? (
                <CheckCircle2 className="h-5 w-5 text-[hsl(140,30%,42%)]" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-[hsl(40,60%,50%)]" />
              )}
              <h2 className="text-lg font-serif text-foreground">
                Tests: {passedCount} / {testItems.length}
              </h2>
            </div>
            <Button size="sm" variant="ghost" onClick={reset}>
              <RotateCcw className="h-3.5 w-3.5" /> Reset
            </Button>
          </div>
          {!allTestsPassed && (
            <p className="mb-space-2 text-sm text-muted-foreground">
              Resolve all issues before shipping.
            </p>
          )}
          <div className="rounded-lg border border-border divide-y divide-border">
            {testItems.map((item) => (
              <label
                key={item.id}
                className="flex items-center gap-3 px-space-3 py-3 cursor-pointer select-none transition-colors duration-[var(--transition-base)] hover:bg-accent/30"
              >
                <Checkbox
                  checked={!!checked[item.id]}
                  onCheckedChange={() => toggle(item.id)}
                  className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <span
                  className={`flex-1 text-sm font-medium transition-colors duration-[var(--transition-base)] ${
                    checked[item.id] ? "text-muted-foreground line-through" : "text-foreground"
                  }`}
                >
                  {item.label}
                </span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="text-xs text-muted-foreground/60 cursor-help underline decoration-dotted">
                      How?
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="left" className="max-w-xs text-xs">
                    {item.howToTest}
                  </TooltipContent>
                </Tooltip>
              </label>
            ))}
          </div>
        </section>

        {/* ─── C) Artifact Links ─── */}
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

        {/* ─── D) Submission Export ─── */}
        <section className="rounded-lg border border-border bg-card p-space-3">
          <h2 className="text-lg font-serif text-foreground mb-space-2">Final Submission</h2>
          <pre className="text-xs text-muted-foreground bg-secondary/50 rounded-md p-space-2 whitespace-pre-wrap mb-space-2 border border-border">
            {submissionText}
          </pre>
          <Button
            onClick={copySubmission}
            disabled={!allLinksValid}
            variant="outline"
            className="w-full"
          >
            {copied ? (
              <><CheckCheck className="h-4 w-4" /> Copied</>
            ) : (
              <><Copy className="h-4 w-4" /> Copy Final Submission</>
            )}
          </Button>
          {!allLinksValid && (
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Provide all 3 valid links to enable copy.
            </p>
          )}
        </section>

        {/* ─── Ship confirmation ─── */}
        {shipStatus === "Shipped" && (
          <div className="text-center py-space-3">
            <p className="text-sm font-medium text-[hsl(140,30%,42%)]">
              Project 1 Shipped Successfully.
            </p>
          </div>
        )}
      </div>
    </main>
  );
};

export default Proof;
