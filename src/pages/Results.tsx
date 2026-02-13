import { useState, useMemo, useCallback } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getAnalysisById, updateAnalysis, type AnalysisResult } from "@/lib/jdAnalyzer";
import {
  ArrowLeft, CheckCircle2, BookOpen, CalendarDays, HelpCircle,
  Copy, Download, Zap, Check, XCircle, Building2, Info,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

function ScoreCircle({ score }: { score: number }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.max(0, Math.min(100, score)) / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-space-1">
      <svg width="140" height="140" viewBox="0 0 140 140">
        <circle cx="70" cy="70" r={radius} fill="none" stroke="hsl(var(--secondary))" strokeWidth="10" />
        <circle
          cx="70" cy="70" r={radius} fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="10" strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 70 70)"
          style={{ transition: "stroke-dashoffset 0.6s ease-in-out" }}
        />
        <text x="70" y="66" textAnchor="middle" className="fill-foreground" style={{ fontSize: "28px", fontWeight: 700, fontFamily: "var(--font-sans)" }}>{score}</text>
        <text x="70" y="86" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: "11px", fontFamily: "var(--font-sans)" }}>Readiness</text>
      </svg>
    </div>
  );
}

function copyToClipboard(text: string, label: string) {
  navigator.clipboard.writeText(text).then(() => {
    toast({ title: "Copied!", description: `${label} copied to clipboard.` });
  });
}

function formatPlanText(result: AnalysisResult): string {
  return result.plan.map(d => `${d.day} — ${d.focus}\n${d.tasks.map(t => `  • ${t}`).join("\n")}`).join("\n\n");
}

function formatChecklistText(result: AnalysisResult): string {
  return result.checklist.map(r => `${r.title}\n${r.items.map(i => `  ☐ ${i}`).join("\n")}`).join("\n\n");
}

function formatQuestionsText(result: AnalysisResult): string {
  return result.questions.map((q, i) => `${i + 1}. ${q}`).join("\n");
}

function formatFullTxt(result: AnalysisResult): string {
  const lines: string[] = [];
  lines.push(`=== Analysis Results ===`);
  if (result.company) lines.push(`Company: ${result.company}`);
  if (result.role) lines.push(`Role: ${result.role}`);
  lines.push(`Readiness Score: ${result.readinessScore}/100`);
  lines.push("");
  lines.push("--- Key Skills ---");
  Object.entries(result.extractedSkills).forEach(([cat, skills]) => {
    lines.push(`${cat}: ${skills.join(", ")}`);
  });
  lines.push("");
  lines.push("--- 7-Day Plan ---");
  lines.push(formatPlanText(result));
  lines.push("");
  lines.push("--- Round Checklist ---");
  lines.push(formatChecklistText(result));
  lines.push("");
  lines.push("--- Interview Questions ---");
  lines.push(formatQuestionsText(result));
  return lines.join("\n");
}

const Results = () => {
  const [params] = useSearchParams();
  const id = params.get("id");
  const [result, setResult] = useState<AnalysisResult | undefined>(() =>
    id ? getAnalysisById(id) : undefined
  );

  const allSkills = useMemo(() => {
    if (!result) return [];
    return Object.values(result.extractedSkills).flat();
  }, [result]);

  const confidenceMap = result?.skillConfidenceMap ?? {};

  const liveScore = useMemo(() => {
    if (!result) return 0;
    let score = result.readinessScore;
    for (const skill of allSkills) {
      const status = confidenceMap[skill];
      if (status === "know") score += 2;
      else score -= 2; // default is "practice"
    }
    return Math.max(0, Math.min(100, score));
  }, [result, allSkills, confidenceMap]);

  const weakSkills = useMemo(() => {
    return allSkills.filter(s => (confidenceMap[s] ?? "practice") === "practice").slice(0, 3);
  }, [allSkills, confidenceMap]);

  const toggleSkill = useCallback((skill: string) => {
    if (!result) return;
    const current = confidenceMap[skill] ?? "practice";
    const next = current === "know" ? "practice" : "know";
    const updated: AnalysisResult = {
      ...result,
      skillConfidenceMap: { ...confidenceMap, [skill]: next },
    };
    setResult(updated);
    updateAnalysis(updated);
  }, [result, confidenceMap]);

  const downloadTxt = useCallback(() => {
    if (!result) return;
    const blob = new Blob([formatFullTxt(result)], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `analysis-${result.company || "report"}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }, [result]);

  if (!result) {
    return (
      <div>
        <h1 className="text-3xl font-serif text-foreground">No Results</h1>
        <p className="mt-space-1 text-muted-foreground">Analysis not found. Run a new analysis from the Assessments page.</p>
        <Button asChild variant="outline" className="mt-space-3">
          <Link to="/assessments"><ArrowLeft className="mr-1 h-4 w-4" /> Go to Assessments</Link>
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-space-2 mb-space-1">
        <Button asChild variant="ghost" size="sm">
          <Link to="/assessments"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <h1 className="text-3xl font-serif text-foreground">Analysis Results</h1>
      </div>
      <p className="text-muted-foreground">
        {result.company && <span className="font-medium text-foreground">{result.company}</span>}
        {result.company && result.role && " — "}
        {result.role && <span>{result.role}</span>}
        {!result.company && !result.role && "General analysis"}
      </p>

      {/* Export toolbar */}
      <div className="mt-space-2 flex flex-wrap gap-2">
        <Button variant="secondary" size="sm" onClick={() => copyToClipboard(formatPlanText(result), "7-day plan")}>
          <Copy className="h-3.5 w-3.5" /> Copy 7-day plan
        </Button>
        <Button variant="secondary" size="sm" onClick={() => copyToClipboard(formatChecklistText(result), "Round checklist")}>
          <Copy className="h-3.5 w-3.5" /> Copy round checklist
        </Button>
        <Button variant="secondary" size="sm" onClick={() => copyToClipboard(formatQuestionsText(result), "10 questions")}>
          <Copy className="h-3.5 w-3.5" /> Copy 10 questions
        </Button>
        <Button variant="outline" size="sm" onClick={downloadTxt}>
          <Download className="h-3.5 w-3.5" /> Download as TXT
        </Button>
      </div>

      <div className="mt-space-3 grid grid-cols-1 lg:grid-cols-3 gap-space-2">
        {/* Score */}
        <Card>
          <CardHeader><CardTitle className="text-lg">Readiness Score</CardTitle></CardHeader>
          <CardContent className="flex justify-center"><ScoreCircle score={liveScore} /></CardContent>
        </Card>

        {/* Skills with toggles */}
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-lg flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Key Skills Extracted</CardTitle></CardHeader>
          <CardContent className="space-y-space-2">
            {Object.entries(result.extractedSkills).map(([category, skills]) => (
              <div key={category}>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5">{category}</p>
                <div className="flex flex-wrap gap-1.5">
                  {skills.map((s) => {
                    const status = confidenceMap[s] ?? "practice";
                    const isKnow = status === "know";
                    return (
                      <button
                        key={s}
                        onClick={() => toggleSkill(s)}
                        className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer ${
                          isKnow
                            ? "border-primary/30 bg-primary/10 text-primary"
                            : "border-border bg-secondary text-muted-foreground"
                        }`}
                      >
                        {isKnow ? <Check className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                        {s}
                        <span className="text-[10px] opacity-70">{isKnow ? "I know" : "Need practice"}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Company Intel */}
      {result.companyIntel && (
        <Card className="mt-space-2">
          <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Building2 className="h-4 w-4 text-primary" /> Company Intel</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-2 mb-space-2">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Company</p>
                <p className="font-medium text-foreground">{result.companyIntel.name}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Industry</p>
                <p className="text-sm text-foreground">{result.companyIntel.industry}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Estimated Size</p>
                <Badge variant="outline">{result.companyIntel.size}</Badge>
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Typical Hiring Focus</p>
              <p className="text-sm text-muted-foreground">{result.companyIntel.hiringFocus}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Round Mapping */}
      {result.roundMapping && result.roundMapping.length > 0 && (
        <Card className="mt-space-2">
          <CardHeader><CardTitle className="text-lg flex items-center gap-2"><CalendarDays className="h-4 w-4 text-primary" /> Expected Round Flow</CardTitle></CardHeader>
          <CardContent>
            <div className="relative pl-6">
              {result.roundMapping.map((rm, i) => (
                <div key={i} className="relative pb-space-3 last:pb-0">
                  {i < result.roundMapping!.length - 1 && (
                    <span className="absolute left-[-17px] top-6 w-px h-[calc(100%-8px)] bg-border" />
                  )}
                  <span className="absolute left-[-22px] top-1 h-3 w-3 rounded-full bg-primary ring-4 ring-background" />
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{rm.round}</p>
                  <p className="font-medium text-foreground mt-0.5">{rm.title}</p>
                  <p className="text-sm text-muted-foreground mt-1 flex items-start gap-1.5">
                    <Info className="h-3.5 w-3.5 mt-0.5 shrink-0 text-primary/60" />
                    {rm.why}
                  </p>
                </div>
              ))}
            </div>
            <p className="mt-space-2 text-xs text-muted-foreground italic flex items-center gap-1">
              <Info className="h-3 w-3" /> Demo Mode: Company intel generated heuristically.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Checklist */}
      <Card className="mt-space-2">
        <CardHeader><CardTitle className="text-lg flex items-center gap-2"><BookOpen className="h-4 w-4 text-primary" /> Round-wise Preparation Checklist</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-space-3">
            {result.checklist.map((round) => (
              <div key={round.title}>
                <p className="font-medium text-foreground mb-2">{round.title}</p>
                <ul className="space-y-1.5">
                  {round.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="mt-0.5 h-4 w-4 rounded border border-border shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 7-Day Plan */}
      <Card className="mt-space-2">
        <CardHeader><CardTitle className="text-lg flex items-center gap-2"><CalendarDays className="h-4 w-4 text-primary" /> 7-Day Preparation Plan</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-space-3">
            {result.plan.map((day) => (
              <div key={day.day}>
                <div className="flex items-center gap-2 mb-1.5">
                  <Badge variant="outline">{day.day}</Badge>
                  <span className="font-medium text-foreground text-sm">{day.focus}</span>
                </div>
                <ul className="space-y-1 pl-space-2">
                  {day.tasks.map((task, i) => (
                    <li key={i} className="text-sm text-muted-foreground list-disc">{task}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Interview Questions */}
      <Card className="mt-space-2">
        <CardHeader><CardTitle className="text-lg flex items-center gap-2"><HelpCircle className="h-4 w-4 text-primary" /> Likely Interview Questions</CardTitle></CardHeader>
        <CardContent>
          <ol className="space-y-2">
            {result.questions.map((q, i) => (
              <li key={i} className="flex items-start gap-3 text-sm">
                <span className="shrink-0 h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">{i + 1}</span>
                <span className="text-foreground pt-0.5">{q}</span>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      {/* Action Next box */}
      <Card className="mt-space-2 border-primary/20 bg-primary/5">
        <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Zap className="h-4 w-4 text-primary" /> Action Next</CardTitle></CardHeader>
        <CardContent>
          {weakSkills.length > 0 ? (
            <>
              <p className="text-sm text-muted-foreground mb-2">Your top areas to focus on:</p>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {weakSkills.map(s => (
                  <Badge key={s} variant="secondary" className="border-destructive/20 text-destructive">{s}</Badge>
                ))}
              </div>
            </>
          ) : (
            <p className="text-sm text-muted-foreground mb-3">Great — you're confident across all skills!</p>
          )}
          <p className="text-sm font-medium text-foreground">👉 Start Day 1 plan now.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Results;
