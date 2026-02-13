import { useState, useEffect, useMemo } from "react";
import { ClipboardCheck, RotateCcw, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";

const STORAGE_KEY = "jobTrackerTestChecklist";

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

function loadChecked(): Record<string, boolean> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

const Proof = () => {
  const [checked, setChecked] = useState<Record<string, boolean>>(loadChecked);
  const { toast } = useToast();

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(checked));
  }, [checked]);

  const toggle = (id: string) =>
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));

  const passedCount = useMemo(
    () => testItems.filter((t) => checked[t.id]).length,
    [checked]
  );

  const allPassed = passedCount === testItems.length;

  const reset = () => {
    setChecked({});
    toast({ title: "Test status reset" });
  };

  return (
    <main className="flex-1 px-space-3 py-space-5">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="text-center mb-space-4">
          <ClipboardCheck className="mx-auto h-10 w-10 text-muted-foreground/50" strokeWidth={1.5} />
          <h1 className="mt-space-2 text-3xl md:text-4xl font-serif text-foreground">
            Test Checklist
          </h1>
          <p className="mt-space-1 text-base text-muted-foreground">
            Verify every feature before shipping.
          </p>
        </div>

        {/* Summary */}
        <div className="rounded-lg border border-border bg-card p-space-3 mb-space-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {allPassed ? (
                <CheckCircle2 className="h-5 w-5 text-[hsl(140,30%,42%)]" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-[hsl(40,60%,50%)]" />
              )}
              <span className="text-lg font-semibold text-foreground">
                Tests Passed: {passedCount} / {testItems.length}
              </span>
            </div>
            <Button size="sm" variant="ghost" onClick={reset}>
              <RotateCcw className="h-3.5 w-3.5" /> Reset
            </Button>
          </div>
          {!allPassed && (
            <p className="mt-1 text-sm text-muted-foreground">
              Resolve all issues before shipping.
            </p>
          )}
        </div>

        {/* Checklist */}
        <div className="rounded-lg border border-border bg-card divide-y divide-border">
          {testItems.map((item) => (
            <label
              key={item.id}
              className="flex items-center gap-3 px-space-3 py-3 cursor-pointer select-none transition-colors duration-base hover:bg-accent/30"
            >
              <Checkbox
                checked={!!checked[item.id]}
                onCheckedChange={() => toggle(item.id)}
                className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <span
                className={`flex-1 text-sm font-medium transition-colors duration-base ${
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
      </div>
    </main>
  );
};

export default Proof;
