import { useSearchParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getAnalysisById, type AnalysisResult } from "@/lib/jdAnalyzer";
import { ArrowLeft, CheckCircle2, BookOpen, CalendarDays, HelpCircle } from "lucide-react";

function ScoreCircle({ score }: { score: number }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

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

const Results = () => {
  const [params] = useSearchParams();
  const id = params.get("id");
  const result: AnalysisResult | undefined = id ? getAnalysisById(id) : undefined;

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

      <div className="mt-space-3 grid grid-cols-1 lg:grid-cols-3 gap-space-2">
        {/* Score */}
        <Card>
          <CardHeader><CardTitle className="text-lg">Readiness Score</CardTitle></CardHeader>
          <CardContent className="flex justify-center"><ScoreCircle score={result.readinessScore} /></CardContent>
        </Card>

        {/* Skills */}
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-lg flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Key Skills Extracted</CardTitle></CardHeader>
          <CardContent className="space-y-space-2">
            {Object.entries(result.extractedSkills).map(([category, skills]) => (
              <div key={category}>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5">{category}</p>
                <div className="flex flex-wrap gap-1.5">
                  {skills.map((s) => (
                    <Badge key={s} variant="secondary">{s}</Badge>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

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
    </div>
  );
};

export default Results;
