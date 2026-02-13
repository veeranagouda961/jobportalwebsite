import { useMemo } from "react";
import { useResume } from "@/hooks/useResume";
import { computeATSScore } from "@/lib/atsScoring";
import { AlertTriangle, CheckCircle2 } from "lucide-react";

export function ATSScorePanel() {
  const { resume } = useResume();

  const { score, suggestions } = useMemo(() => computeATSScore(resume), [resume]);

  const circumference = 2 * Math.PI * 40;
  const strokeOffset = circumference - (score / 100) * circumference;

  const scoreColor =
    score >= 75
      ? "hsl(140, 30%, 42%)"
      : score >= 45
      ? "hsl(40, 60%, 50%)"
      : "hsl(0, 72%, 51%)";

  const scoreLabel =
    score >= 75 ? "Strong" : score >= 45 ? "Needs Work" : "Weak";

  return (
    <div className="rounded-lg border border-border bg-card p-space-3 space-y-space-2">
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
        ATS Readiness Score
      </h3>

      <div className="flex items-center gap-space-3">
        {/* Score circle */}
        <div className="relative h-24 w-24 shrink-0">
          <svg className="h-24 w-24 -rotate-90" viewBox="0 0 96 96">
            <circle
              cx="48"
              cy="48"
              r="40"
              fill="none"
              stroke="hsl(var(--border))"
              strokeWidth="6"
            />
            <circle
              cx="48"
              cy="48"
              r="40"
              fill="none"
              stroke={scoreColor}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeOffset}
              className="transition-all duration-500 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-foreground">{score}</span>
            <span className="text-[10px] text-muted-foreground">{scoreLabel}</span>
          </div>
        </div>

        {/* Suggestions */}
        <div className="flex-1 space-y-1.5">
          {suggestions.length === 0 ? (
            <div className="flex items-center gap-1.5 text-sm text-[hsl(140,30%,42%)]">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Looking good! Your resume covers the essentials.</span>
            </div>
          ) : (
            suggestions.map((s, i) => (
              <div key={i} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                <AlertTriangle className="h-3 w-3 mt-0.5 shrink-0 text-[hsl(40,60%,50%)]" />
                <span>{s}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
