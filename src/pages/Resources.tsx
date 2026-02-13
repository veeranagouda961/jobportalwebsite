import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getHistory } from "@/lib/jdAnalyzer";
import { Clock, ArrowRight } from "lucide-react";

const Resources = () => {
  const history = getHistory();
  const rawCount = (() => {
    try {
      const raw = localStorage.getItem("jd-analysis-history");
      return raw ? JSON.parse(raw).length : 0;
    } catch { return 0; }
  })();
  const corruptedCount = rawCount - history.length;

  return (
    <div>
      <h1 className="text-3xl font-serif text-foreground">Analysis History</h1>
      <p className="mt-space-1 text-muted-foreground max-w-prose">
        All your past JD analyses, saved locally and available offline.
      </p>

      {corruptedCount > 0 && (
        <p className="mt-space-2 text-sm text-destructive/80">
          {corruptedCount} saved {corruptedCount === 1 ? "entry" : "entries"} couldn't be loaded. Create a new analysis.
        </p>
      )}

      {history.length === 0 ? (
        <Card className="mt-space-3">
          <CardContent className="pt-6 text-center py-space-5">
            <p className="text-muted-foreground">No analyses yet. Go to Assessments to analyze your first JD.</p>
            <Link to="/assessments" className="inline-flex items-center gap-1 mt-space-2 text-sm font-medium text-primary hover:underline">
              Start an analysis <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="mt-space-3 space-y-space-1">
          {history.map((entry) => (
            <Link key={entry.id} to={`/results?id=${entry.id}`} className="block">
              <Card className="transition-colors hover:bg-secondary/40">
                <CardContent className="pt-4 pb-4 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="font-medium text-foreground">
                      {entry.company || "Unknown Company"}
                      {entry.role && ` — ${entry.role}`}
                    </p>
                    <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {new Date(entry.createdAt).toLocaleDateString("en-US", {
                        month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-sm font-semibold">
                    {entry.readinessScore}/100
                  </Badge>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Resources;
