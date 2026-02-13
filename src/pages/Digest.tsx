import { useState, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { Mail, Copy, ExternalLink, Settings, AlertTriangle, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { jobs } from "@/data/jobs";
import { usePreferences } from "@/hooks/usePreferences";
import { computeMatchScore, getScoreTier, type ScoreTier } from "@/lib/matchScore";
import { useToast } from "@/hooks/use-toast";

interface DigestEntry {
  jobId: number;
  title: string;
  company: string;
  location: string;
  experience: string;
  matchScore: number;
  applyUrl: string;
}

interface StoredDigest {
  date: string;
  entries: DigestEntry[];
}

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function storageKey(date: string) {
  return `jobTrackerDigest_${date}`;
}

function loadDigest(date: string): StoredDigest | null {
  try {
    const raw = localStorage.getItem(storageKey(date));
    if (!raw) return null;
    return JSON.parse(raw) as StoredDigest;
  } catch {
    return null;
  }
}

function saveDigest(digest: StoredDigest) {
  localStorage.setItem(storageKey(digest.date), JSON.stringify(digest));
}

function formatDateDisplay(dateStr: string) {
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function digestToPlainText(digest: StoredDigest): string {
  const lines = [
    `Top 10 Jobs For You — 9AM Digest`,
    formatDateDisplay(digest.date),
    "",
    ...digest.entries.map(
      (e, i) =>
        `${i + 1}. ${e.title} at ${e.company}\n   ${e.location} · ${e.experience} · Match: ${e.matchScore}%\n   Apply: ${e.applyUrl}`
    ),
    "",
    "This digest was generated based on your preferences.",
  ];
  return lines.join("\n");
}

const tierStyles: Record<ScoreTier, string> = {
  high: "bg-[hsl(140,30%,42%)] text-[hsl(40,18%,96%)]",
  good: "bg-[hsl(40,60%,50%)] text-foreground",
  neutral: "bg-muted text-foreground",
  low: "bg-muted/60 text-muted-foreground",
};

const Digest = () => {
  const { prefs, hasPreferences } = usePreferences();
  const { toast } = useToast();
  const today = todayKey();

  const [digest, setDigest] = useState<StoredDigest | null>(() => loadDigest(today));
  const [copied, setCopied] = useState(false);

  const generate = useCallback(() => {
    const existing = loadDigest(today);
    if (existing) {
      setDigest(existing);
      return;
    }

    const scored = jobs
      .map((job) => ({
        job,
        matchScore: computeMatchScore(job, prefs),
      }))
      .filter((item) => item.matchScore >= prefs.minMatchScore)
      .sort((a, b) => b.matchScore - a.matchScore || a.job.postedDaysAgo - b.job.postedDaysAgo)
      .slice(0, 10);

    const newDigest: StoredDigest = {
      date: today,
      entries: scored.map((s) => ({
        jobId: s.job.id,
        title: s.job.title,
        company: s.job.company,
        location: s.job.location,
        experience: s.job.experience,
        matchScore: s.matchScore,
        applyUrl: s.job.applyUrl,
      })),
    };
    saveDigest(newDigest);
    setDigest(newDigest);
  }, [prefs, today]);

  const handleCopy = useCallback(async () => {
    if (!digest) return;
    await navigator.clipboard.writeText(digestToPlainText(digest));
    setCopied(true);
    toast({ title: "Copied to clipboard" });
    setTimeout(() => setCopied(false), 2000);
  }, [digest, toast]);

  const handleEmail = useCallback(() => {
    if (!digest) return;
    const subject = encodeURIComponent("My 9AM Job Digest");
    const body = encodeURIComponent(digestToPlainText(digest));
    window.open(`mailto:?subject=${subject}&body=${body}`, "_self");
  }, [digest]);

  // No preferences
  if (!hasPreferences) {
    return (
      <main className="flex flex-col items-center justify-center flex-1 px-space-3 py-space-5 text-center">
        <AlertTriangle className="h-10 w-10 text-muted-foreground/50" strokeWidth={1.5} />
        <h1 className="mt-space-2 text-3xl md:text-4xl font-serif text-foreground">
          Set preferences first.
        </h1>
        <p className="mt-space-1 text-base text-muted-foreground max-w-prose">
          Set preferences to generate a personalized digest.
        </p>
        <Link
          to="/settings"
          className="mt-space-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
        >
          <Settings className="h-3.5 w-3.5" /> Configure Preferences
        </Link>
      </main>
    );
  }

  // Pre-generation state
  if (!digest) {
    return (
      <main className="flex flex-col items-center justify-center flex-1 px-space-3 py-space-5 text-center">
        <Mail className="h-10 w-10 text-muted-foreground/50" strokeWidth={1.5} />
        <h1 className="mt-space-2 text-3xl md:text-4xl font-serif text-foreground">
          No digests yet.
        </h1>
        <p className="mt-space-1 text-base text-muted-foreground max-w-prose">
          Your daily 9AM job digest will be collected here.
        </p>
        <Button className="mt-space-3" onClick={generate}>
          Generate Today's 9AM Digest (Simulated)
        </Button>
        <p className="mt-space-2 text-xs text-muted-foreground">
          Demo Mode: Daily 9AM trigger simulated manually.
        </p>
      </main>
    );
  }

  // Digest rendered
  return (
    <main className="flex-1 px-space-3 py-space-4 max-w-[720px] mx-auto w-full">
      {/* Email-style card */}
      <div className="rounded-lg border border-border bg-card p-space-3 md:p-space-4">
        {/* Header */}
        <div className="border-b border-border pb-space-2 mb-space-3">
          <h1 className="text-2xl md:text-3xl font-serif text-foreground">
            Top 10 Jobs For You — 9AM Digest
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {formatDateDisplay(digest.date)}
          </p>
        </div>

        {/* Jobs list */}
        {digest.entries.length === 0 ? (
          <div className="py-space-4 text-center">
            <p className="text-lg font-serif text-foreground">No matching roles today.</p>
            <p className="mt-space-1 text-sm text-muted-foreground">
              Check again tomorrow.
            </p>
          </div>
        ) : (
          <ol className="space-y-space-2">
            {digest.entries.map((entry, i) => {
              const tier = getScoreTier(entry.matchScore);
              return (
                <li
                  key={entry.jobId}
                  className="flex items-start gap-space-2 rounded-md border border-border p-space-2 transition-all duration-[180ms] ease-in-out hover:border-primary/30"
                >
                  <span className="text-sm font-medium text-muted-foreground mt-0.5 w-5 shrink-0 text-right">
                    {i + 1}.
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-serif text-base leading-snug text-foreground">
                          {entry.title}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {entry.company} · {entry.location} · {entry.experience}
                        </p>
                      </div>
                      <Badge className={tierStyles[tier]}>{entry.matchScore}%</Badge>
                    </div>
                    <Button size="sm" variant="secondary" className="mt-space-1" asChild>
                      <a href={entry.applyUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-3.5 w-3.5" /> Apply
                      </a>
                    </Button>
                  </div>
                </li>
              );
            })}
          </ol>
        )}

        {/* Footer */}
        <div className="mt-space-3 border-t border-border pt-space-2">
          <p className="text-xs text-muted-foreground">
            This digest was generated based on your preferences.
          </p>
        </div>
      </div>

      {/* Actions */}
      {digest.entries.length > 0 && (
        <div className="mt-space-3 flex flex-wrap gap-2">
          <Button variant="secondary" size="sm" onClick={handleCopy}>
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copied" : "Copy Digest to Clipboard"}
          </Button>
          <Button variant="secondary" size="sm" onClick={handleEmail}>
            <Mail className="h-3.5 w-3.5" /> Create Email Draft
          </Button>
        </div>
      )}

      {/* Regenerate + demo note */}
      <div className="mt-space-3 flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={generate}>
          Refresh Digest
        </Button>
        <p className="text-xs text-muted-foreground">
          Demo Mode: Daily 9AM trigger simulated manually.
        </p>
      </div>
    </main>
  );
};

export default Digest;
