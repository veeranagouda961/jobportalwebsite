import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ContextHeader } from "@/components/layout/ContextHeader";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Copy, ExternalLink, Check, AlertCircle, Image, ArrowRight, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { rbSteps } from "@/data/rbSteps";
import { useRBGating } from "@/components/layout/RBBuildLayout";

interface RBStepPageProps {
  stepNumber: number;
}

export default function RBStepPage({ stepNumber }: RBStepPageProps) {
  const step = rbSteps[stepNumber - 1];
  const nextStep = rbSteps[stepNumber]; // undefined for step 8
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isStepAccessible, getArtifactKey } = useRBGating();

  const [artifact, setArtifact] = useState("");
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState<"pending" | "worked" | "error">("pending");

  const artifactKey = getArtifactKey(stepNumber);

  // Load saved artifact
  useEffect(() => {
    const saved = localStorage.getItem(artifactKey);
    if (saved) {
      setArtifact(saved);
      setStatus("worked");
    } else {
      setArtifact("");
      setStatus("pending");
    }
  }, [artifactKey]);

  // Check gating
  if (!isStepAccessible(stepNumber)) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 px-space-3 py-space-5">
        <Lock className="h-10 w-10 text-muted-foreground/40 mb-space-2" />
        <h2 className="text-xl font-serif text-foreground">Step {stepNumber} Locked</h2>
        <p className="text-sm text-muted-foreground mt-space-1">
          Complete Step {stepNumber - 1} first to unlock this step.
        </p>
      </div>
    );
  }

  const copyPrompt = () => {
    navigator.clipboard.writeText(step.prompt).then(() => {
      setCopied(true);
      toast({ title: "Prompt copied to clipboard" });
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const saveArtifact = () => {
    if (!artifact.trim()) {
      toast({ title: "Paste your artifact before saving", variant: "destructive" });
      return;
    }
    localStorage.setItem(artifactKey, artifact.trim());
    setStatus("worked");
    toast({ title: `Step ${stepNumber} artifact saved` });
  };

  const markError = () => {
    setStatus("error");
    toast({ title: "Marked as error — try again" });
  };

  const goNext = () => {
    if (nextStep) {
      navigate(nextStep.path);
    } else {
      navigate("/rb/proof");
    }
  };

  const hasArtifact = !!localStorage.getItem(artifactKey);

  return (
    <div className="flex flex-1">
      {/* Main workspace (70%) */}
      <div className="flex-1 flex flex-col" style={{ flexBasis: "70%" }}>
        <ContextHeader headline={step.headline} subtext={step.subtext} />
        <div className="flex-1 p-space-3">
          <div className="max-w-2xl mx-auto space-y-space-3">
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-space-1">
                Your Artifact
              </h3>
              <Textarea
                value={artifact}
                onChange={(e) => setArtifact(e.target.value)}
                placeholder="Paste your completed artifact here (screenshot URL, code snippet, documentation, etc.)..."
                className="min-h-[200px] resize-y"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {artifact.length} characters
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <Button onClick={saveArtifact} size="sm">
                <Check className="h-3.5 w-3.5 mr-1" /> Save Artifact
              </Button>
              <Button onClick={markError} variant="outline" size="sm" className="text-destructive">
                <AlertCircle className="h-3.5 w-3.5 mr-1" /> Error
              </Button>
              {status === "worked" && (
                <Badge variant="outline" className="bg-[hsl(140,30%,42%)]/15 text-[hsl(140,30%,42%)] border-[hsl(140,30%,42%)]/30">
                  ✓ Completed
                </Badge>
              )}
              {status === "error" && (
                <Badge variant="outline" className="bg-destructive/15 text-destructive border-destructive/30">
                  ✗ Error
                </Badge>
              )}
            </div>

            {hasArtifact && (
              <Button onClick={goNext} className="w-full mt-space-2">
                {nextStep ? (
                  <>Next: {nextStep.title} <ArrowRight className="h-4 w-4 ml-1" /></>
                ) : (
                  <>Go to Proof <ArrowRight className="h-4 w-4 ml-1" /></>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Secondary panel (30%) */}
      <aside className="border-l border-border bg-card p-space-3 flex flex-col gap-space-3 w-[30%] min-w-[280px] hidden lg:flex">
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-space-1">Step Guide</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{step.explanation}</p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-foreground mb-space-1">Copy This Into Lovable</h3>
          <div className="rounded-md border border-border bg-background p-space-2">
            <p className="text-sm text-foreground font-mono leading-relaxed">{step.prompt}</p>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Button variant="default" size="sm" className="justify-start gap-2" onClick={copyPrompt}>
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copied" : "Copy Prompt"}
          </Button>
          <a
            href="https://lovable.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex"
          >
            <Button variant="secondary" size="sm" className="justify-start gap-2 w-full">
              <ExternalLink className="h-3.5 w-3.5" /> Build in Lovable
            </Button>
          </a>
          <Button
            variant="outline"
            size="sm"
            className="justify-start gap-2 text-[hsl(140,30%,42%)]"
            onClick={saveArtifact}
          >
            <Check className="h-3.5 w-3.5" /> It Worked
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="justify-start gap-2 text-destructive"
            onClick={markError}
          >
            <AlertCircle className="h-3.5 w-3.5" /> Error
          </Button>
          <Button variant="ghost" size="sm" className="justify-start gap-2">
            <Image className="h-3.5 w-3.5" /> Add Screenshot
          </Button>
        </div>
      </aside>
    </div>
  );
}
