import { ExternalLink, Bookmark, Eye, MapPin, Briefcase, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Job } from "@/data/jobs";
import { getScoreTier, type ScoreTier } from "@/lib/matchScore";
import { type JobStatus, ALL_STATUSES } from "@/hooks/useJobStatus";
import { useToast } from "@/hooks/use-toast";

interface JobCardProps {
  job: Job;
  matchScore?: number;
  isSaved: boolean;
  onToggleSave: (id: number) => void;
  onView: (job: Job) => void;
  status?: JobStatus;
  onStatusChange?: (jobId: number, status: JobStatus) => void;
}

function postedLabel(days: number) {
  if (days === 0) return "Today";
  if (days === 1) return "1 day ago";
  return `${days} days ago`;
}

const sourceBg: Record<Job["source"], string> = {
  LinkedIn: "bg-muted text-foreground",
  Naukri: "bg-muted text-foreground",
  Indeed: "bg-muted text-foreground",
};

const tierStyles: Record<ScoreTier, string> = {
  high: "bg-[hsl(140,30%,42%)] text-[hsl(40,18%,96%)]",
  good: "bg-[hsl(40,60%,50%)] text-foreground",
  neutral: "bg-muted text-foreground",
  low: "bg-muted/60 text-muted-foreground",
};

const statusStyles: Record<JobStatus, string> = {
  "Not Applied": "bg-muted text-muted-foreground",
  Applied: "bg-[hsl(210,60%,50%)] text-[hsl(40,18%,96%)]",
  Rejected: "bg-destructive text-destructive-foreground",
  Selected: "bg-[hsl(140,30%,42%)] text-[hsl(40,18%,96%)]",
};

export function JobCard({ job, matchScore, isSaved, onToggleSave, onView, status = "Not Applied", onStatusChange }: JobCardProps) {
  const tier = matchScore !== undefined ? getScoreTier(matchScore) : null;
  const { toast } = useToast();

  const handleStatusChange = (newStatus: JobStatus) => {
    if (newStatus === status) return;
    onStatusChange?.(job.id, newStatus);
    if (newStatus !== "Not Applied") {
      toast({ title: `Status updated: ${newStatus}` });
    }
  };

  return (
    <div className="rounded-lg border border-border bg-card p-space-3 transition-all duration-base ease-base hover:border-primary/30">
      {/* Header */}
      <div className="flex items-start justify-between gap-space-2">
        <div className="min-w-0 flex-1">
          <h3 className="font-serif text-lg leading-snug text-foreground">{job.title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{job.company}</p>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {tier !== null && (
            <Badge className={tierStyles[tier]}>
              {matchScore}%
            </Badge>
          )}
          <Badge className={sourceBg[job.source]} variant="secondary">
            {job.source}
          </Badge>
        </div>
      </div>

      {/* Meta */}
      <div className="mt-space-2 flex flex-wrap items-center gap-x-space-3 gap-y-1 text-sm text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <MapPin className="h-3.5 w-3.5" /> {job.location} · {job.mode}
        </span>
        <span className="inline-flex items-center gap-1">
          <Briefcase className="h-3.5 w-3.5" /> {job.experience}
        </span>
        <span className="inline-flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" /> {postedLabel(job.postedDaysAgo)}
        </span>
      </div>

      <p className="mt-space-1 text-sm font-medium text-foreground">{job.salaryRange}</p>

      {/* Status */}
      {onStatusChange && (
        <div className="mt-space-2 flex flex-wrap items-center gap-1.5">
          {ALL_STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => handleStatusChange(s)}
              className={`rounded-full px-2.5 py-0.5 text-xs font-semibold transition-all duration-[180ms] ease-in-out ${
                s === status ? statusStyles[s] : "bg-muted/40 text-muted-foreground hover:bg-muted"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="mt-space-2 flex items-center gap-2">
        <Button size="sm" variant="secondary" onClick={() => onView(job)}>
          <Eye className="h-3.5 w-3.5" /> View
        </Button>
        <Button
          size="sm"
          variant={isSaved ? "default" : "secondary"}
          onClick={() => onToggleSave(job.id)}
        >
          <Bookmark className="h-3.5 w-3.5" fill={isSaved ? "currentColor" : "none"} /> {isSaved ? "Saved" : "Save"}
        </Button>
        <Button size="sm" variant="secondary" asChild>
          <a href={job.applyUrl} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-3.5 w-3.5" /> Apply
          </a>
        </Button>
      </div>
    </div>
  );
}
