import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { jobs, type Job } from "@/data/jobs";
import { FilterBar, type Filters } from "@/components/jobs/FilterBar";
import { JobCard } from "@/components/jobs/JobCard";
import { JobDetailModal } from "@/components/jobs/JobDetailModal";
import { useSavedJobs } from "@/hooks/useSavedJobs";
import { usePreferences } from "@/hooks/usePreferences";
import { useJobStatus } from "@/hooks/useJobStatus";
import { computeMatchScore } from "@/lib/matchScore";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { AlertTriangle, Settings } from "lucide-react";

const defaultFilters: Filters = {
  keyword: "",
  location: "all",
  mode: "all",
  experience: "all",
  source: "all",
  sort: "latest",
  status: "all",
};

const Dashboard = () => {
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [viewJob, setViewJob] = useState<Job | null>(null);
  const [showOnlyMatches, setShowOnlyMatches] = useState(false);
  const { toggleSave, isSaved } = useSavedJobs();
  const { prefs, hasPreferences } = usePreferences();
  const { getStatus, setStatus } = useJobStatus();

  const scored = useMemo(() => {
    return jobs.map((job) => ({
      job,
      matchScore: hasPreferences ? computeMatchScore(job, prefs) : 0,
    }));
  }, [prefs, hasPreferences]);

  const filtered = useMemo(() => {
    let list = [...scored];

    if (showOnlyMatches && hasPreferences) {
      list = list.filter((item) => item.matchScore >= prefs.minMatchScore);
    }

    if (filters.keyword) {
      const kw = filters.keyword.toLowerCase();
      list = list.filter(
        (item) =>
          item.job.title.toLowerCase().includes(kw) ||
          item.job.company.toLowerCase().includes(kw)
      );
    }
    if (filters.location !== "all") list = list.filter((item) => item.job.location === filters.location);
    if (filters.mode !== "all") list = list.filter((item) => item.job.mode === filters.mode);
    if (filters.experience !== "all") list = list.filter((item) => item.job.experience === filters.experience);
    if (filters.source !== "all") list = list.filter((item) => item.job.source === filters.source);
    if (filters.status !== "all") list = list.filter((item) => getStatus(item.job.id) === filters.status);

    if (filters.sort === "latest") list.sort((a, b) => a.job.postedDaysAgo - b.job.postedDaysAgo);
    else if (filters.sort === "oldest") list.sort((a, b) => b.job.postedDaysAgo - a.job.postedDaysAgo);
    else if (filters.sort === "company") list.sort((a, b) => a.job.company.localeCompare(b.job.company));
    else if (filters.sort === "matchScore") list.sort((a, b) => b.matchScore - a.matchScore);
    else if (filters.sort === "salary") {
      const extractSalary = (s: string): number => {
        const match = s.match(/(\d+)/);
        return match ? parseInt(match[1], 10) : 0;
      };
      list.sort((a, b) => extractSalary(b.job.salaryRange) - extractSalary(a.job.salaryRange));
    }

    return list;
  }, [scored, filters, showOnlyMatches, hasPreferences, prefs.minMatchScore, getStatus]);

  return (
    <main className="flex-1 px-space-3 py-space-4 max-w-[960px] mx-auto w-full">
      <h1 className="text-3xl md:text-4xl font-serif text-foreground">Dashboard</h1>
      <p className="mt-space-1 text-base text-muted-foreground">
        {filtered.length} job{filtered.length !== 1 ? "s" : ""} found
      </p>

      {!hasPreferences && (
        <div className="mt-space-2 flex items-center gap-3 rounded-lg border border-border bg-card p-space-2">
          <AlertTriangle className="h-5 w-5 text-muted-foreground shrink-0" />
          <p className="text-sm text-muted-foreground flex-1">
            Set your preferences to activate intelligent matching.
          </p>
          <Link
            to="/settings"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
          >
            <Settings className="h-3.5 w-3.5" /> Configure
          </Link>
        </div>
      )}

      <div className="mt-space-3">
        <FilterBar filters={filters} onChange={setFilters} hasPreferences={hasPreferences} />
      </div>

      {hasPreferences && (
        <div className="mt-space-2 flex items-center gap-3">
          <Switch checked={showOnlyMatches} onCheckedChange={setShowOnlyMatches} id="match-toggle" />
          <Label htmlFor="match-toggle" className="text-sm text-muted-foreground cursor-pointer">
            Show only jobs above my threshold ({prefs.minMatchScore}%)
          </Label>
        </div>
      )}

      <div className="mt-space-3 grid gap-space-2 sm:grid-cols-2">
        {filtered.map((item) => (
          <JobCard
            key={item.job.id}
            job={item.job}
            matchScore={hasPreferences ? item.matchScore : undefined}
            isSaved={isSaved(item.job.id)}
            onToggleSave={toggleSave}
            onView={setViewJob}
            status={getStatus(item.job.id)}
            onStatusChange={setStatus}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="mt-space-5 text-center">
          <p className="text-lg font-serif text-foreground">No roles match your criteria.</p>
          <p className="mt-space-1 text-sm text-muted-foreground">
            Adjust filters or lower your match threshold in preferences.
          </p>
        </div>
      )}

      <JobDetailModal job={viewJob} open={!!viewJob} onClose={() => setViewJob(null)} />
    </main>
  );
};

export default Dashboard;
