import { useState } from "react";
import { Bookmark } from "lucide-react";
import { jobs, type Job } from "@/data/jobs";
import { JobCard } from "@/components/jobs/JobCard";
import { JobDetailModal } from "@/components/jobs/JobDetailModal";
import { useSavedJobs } from "@/hooks/useSavedJobs";
import { useJobStatus } from "@/hooks/useJobStatus";

const Saved = () => {
  const { savedIds, toggleSave, isSaved } = useSavedJobs();
  const { getStatus, setStatus } = useJobStatus();
  const [viewJob, setViewJob] = useState<Job | null>(null);

  const savedJobs = jobs.filter((j) => savedIds.includes(j.id));

  return (
    <main className="flex-1 px-space-3 py-space-4 max-w-[960px] mx-auto w-full">
      <h1 className="text-3xl md:text-4xl font-serif text-foreground">Saved Jobs</h1>
      <p className="mt-space-1 text-base text-muted-foreground">
        {savedJobs.length} saved job{savedJobs.length !== 1 ? "s" : ""}
      </p>

      {savedJobs.length > 0 ? (
        <div className="mt-space-3 grid gap-space-2 sm:grid-cols-2">
          {savedJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              isSaved={isSaved(job.id)}
              onToggleSave={toggleSave}
              onView={setViewJob}
              status={getStatus(job.id)}
              onStatusChange={setStatus}
            />
          ))}
        </div>
      ) : (
        <div className="mt-space-5 flex flex-col items-center text-center">
          <Bookmark className="h-10 w-10 text-muted-foreground/50" strokeWidth={1.5} />
          <h2 className="mt-space-2 text-2xl font-serif text-foreground">No saved jobs yet.</h2>
          <p className="mt-space-1 text-base text-muted-foreground max-w-prose">
            Browse the Dashboard and tap Save on jobs you're interested in. They'll appear here for quick access.
          </p>
        </div>
      )}

      <JobDetailModal job={viewJob} open={!!viewJob} onClose={() => setViewJob(null)} />
    </main>
  );
};

export default Saved;
