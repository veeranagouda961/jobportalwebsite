import { Button } from "@/components/ui/button";
import { Copy, ExternalLink, Check, AlertCircle, Image } from "lucide-react";

interface SecondaryPanelProps {
  explanation?: string;
  prompt?: string;
}

export function SecondaryPanel({
  explanation = "This step walks you through setting up the foundational design tokens for your project.",
  prompt = "Create a design system with off-white background, deep red accent, serif headings, and clean sans-serif body text.",
}: SecondaryPanelProps) {
  return (
    <aside className="border-l border-border bg-card p-space-3 flex flex-col gap-space-3">
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-space-1">
          Step Guide
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {explanation}
        </p>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-foreground mb-space-1">
          Prompt
        </h3>
        <div className="rounded-md border border-border bg-background p-space-2">
          <p className="text-sm text-foreground font-mono leading-relaxed">
            {prompt}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Button variant="default" size="sm" className="justify-start gap-2">
          <Copy className="h-3.5 w-3.5" />
          Copy Prompt
        </Button>
        <Button variant="secondary" size="sm" className="justify-start gap-2">
          <ExternalLink className="h-3.5 w-3.5" />
          Build in Lovable
        </Button>
        <Button variant="outline" size="sm" className="justify-start gap-2 text-success">
          <Check className="h-3.5 w-3.5" />
          It Worked
        </Button>
        <Button variant="outline" size="sm" className="justify-start gap-2 text-destructive">
          <AlertCircle className="h-3.5 w-3.5" />
          Error
        </Button>
        <Button variant="ghost" size="sm" className="justify-start gap-2">
          <Image className="h-3.5 w-3.5" />
          Add Screenshot
        </Button>
      </div>
    </aside>
  );
}
