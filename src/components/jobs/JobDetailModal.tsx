import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, MapPin, Briefcase } from "lucide-react";
import type { Job } from "@/data/jobs";

interface Props {
  job: Job | null;
  open: boolean;
  onClose: () => void;
}

export function JobDetailModal({ job, open, onClose }: Props) {
  if (!job) return null;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl">{job.title}</DialogTitle>
          <DialogDescription>
            {job.company} · {job.location} · {job.mode}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-space-2">
          <div className="flex flex-wrap items-center gap-x-space-3 gap-y-1 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" /> {job.location}
            </span>
            <span className="inline-flex items-center gap-1">
              <Briefcase className="h-3.5 w-3.5" /> {job.experience}
            </span>
            <span>{job.salaryRange}</span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {job.skills.map((s) => (
              <Badge key={s} variant="outline" className="text-xs font-normal">
                {s}
              </Badge>
            ))}
          </div>

          <p className="whitespace-pre-line text-sm leading-relaxed text-foreground">
            {job.description}
          </p>

          <Button asChild className="w-full">
            <a href={job.applyUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4" /> Apply on {job.source}
            </a>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
