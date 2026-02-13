import { useState, useEffect, useMemo, useCallback } from "react";
import {
  ClipboardCheck, CheckCircle2, AlertTriangle, Copy, CheckCheck, ExternalLink
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const LINKS_KEY = "rb_proof_links";

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

function loadLinks(): ArtifactLinks {
  try {
    const raw = localStorage.getItem(LINKS_KEY);
    return raw ? JSON.parse(raw) : { lovable: "", github: "", deployed: "" };
  } catch {
    return { lovable: "", github: "", deployed: "" };
  }
}

type ShipStatus = "Not Started" | "In Progress" | "Shipped";

const ResumeProof = () => {
  const [links, setLinks] = useState<ArtifactLinks>(loadLinks);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    localStorage.setItem(LINKS_KEY, JSON.stringify(links));
  }, [links]);

  const allLinksValid = useMemo(
    () => isValidUrl(links.lovable) && isValidUrl(links.github) && isValidUrl(links.deployed),
    [links]
  );

  const shipStatus: ShipStatus = useMemo(() => {
    if (allLinksValid) return "Shipped";
    if (links.lovable || links.github || links.deployed) return "In Progress";
    return "Not Started";
  }, [allLinksValid, links]);

  const statusColor: Record<ShipStatus, string> = {
    "Not Started": "bg-secondary text-muted-foreground border-border",
    "In Progress": "bg-[hsl(40,60%,50%)]/15 text-foreground border-[hsl(40,60%,50%)]/30",
    "Shipped": "bg-[hsl(140,30%,42%)]/15 text-[hsl(140,30%,42%)] border-[hsl(140,30%,42%)]/30",
  };

  const updateLink = (key: keyof ArtifactLinks, value: string) =>
    setLinks((prev) => ({ ...prev, [key]: value }));

  const submissionText = `AI Resume Builder — Final Submission

Lovable Project:
${links.lovable || "(not provided)"}

GitHub Repository:
${links.github || "(not provided)"}

Live Deployment:
${links.deployed || "(not provided)"}

Core Capabilities:
- Structured resume builder with live preview
- Sample data loading
- Multiple sections (education, experience, projects, skills)
- Clean, ATS-friendly preview layout
- LocalStorage persistence`;

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
        <div className="text-center">
          <ClipboardCheck className="mx-auto h-10 w-10 text-muted-foreground/50" strokeWidth={1.5} />
          <h1 className="mt-space-2 text-3xl md:text-4xl font-serif text-foreground">
            AI Resume Builder — Proof
          </h1>
          <Badge
            variant="outline"
            className={`mt-space-2 text-xs font-medium px-3 py-1 rounded-md ${statusColor[shipStatus]}`}
          >
            {shipStatus}
          </Badge>
        </div>

        {/* Artifact Links */}
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

        {/* Submission */}
        <section className={`rounded-lg border bg-card p-space-3 ${!allLinksValid ? "border-border/50 opacity-60 pointer-events-none" : "border-border"}`}>
          <h2 className="text-lg font-serif text-foreground mb-space-2">Final Submission</h2>
          {!allLinksValid && (
            <div className="flex items-center gap-2 mb-space-2 text-sm text-[hsl(40,60%,50%)]">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>Provide all 3 valid links to unlock submission.</span>
            </div>
          )}
          <pre className="text-xs text-muted-foreground bg-secondary/50 rounded-md p-space-2 whitespace-pre-wrap mb-space-2 border border-border">
            {submissionText}
          </pre>
          <Button onClick={copySubmission} disabled={!allLinksValid} variant="outline" className="w-full">
            {copied ? (
              <><CheckCheck className="h-4 w-4" /> Copied</>
            ) : (
              <><Copy className="h-4 w-4" /> Copy Final Submission</>
            )}
          </Button>
        </section>

        {shipStatus === "Shipped" && (
          <div className="text-center py-space-4 space-y-2">
            <p className="text-base font-serif text-[hsl(140,30%,42%)]">
              You built a real product.
            </p>
            <p className="text-sm text-muted-foreground italic leading-relaxed max-w-md mx-auto">
              Not a tutorial. Not a clone.<br />
              A structured tool that solves a real problem.<br />
              This is your proof of work.
            </p>
          </div>
        )}
      </div>
    </main>
  );
};

export default ResumeProof;
