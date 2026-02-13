import { useMemo } from "react";
import { analyzeBullet } from "@/lib/bulletAnalyzer";
import { Lightbulb } from "lucide-react";

interface BulletHintsProps {
  text: string;
}

export function BulletHints({ text }: BulletHintsProps) {
  const hints = useMemo(() => analyzeBullet(text), [text]);

  if (!text.trim() || (!hints.needsVerb && !hints.needsMetric)) return null;

  return (
    <div className="flex flex-wrap gap-2 mt-1">
      {hints.needsVerb && (
        <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground/70 italic">
          <Lightbulb className="h-3 w-3" /> Start with a strong action verb.
        </span>
      )}
      {hints.needsMetric && (
        <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground/70 italic">
          <Lightbulb className="h-3 w-3" /> Add measurable impact (numbers).
        </span>
      )}
    </div>
  );
}
