import { useState, useMemo } from "react";
import { jobs, type Job } from "@/data/jobs";
import { FilterBar, type Filters } from "@/components/jobs/FilterBar";
import { JobCard } from "@/components/jobs/JobCard";
import { JobDetailModal } from "@/components/jobs/JobDetailModal";
import { useSavedJobs } from "@/hooks/useSavedJobs";

const defaultFilters: Filters = {
  keyword: "",
  location: "all",
  mode: "all",
  experience: "all",
  source: "all",
  sort: "latest",
};

const Dashboard = () => {
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [viewJob, setViewJob] = useState<Job | null>(null);
  const { toggleSave, isSaved } = useSavedJobs();

  const filtered = useMemo(() => {
    let list = [...jobs];

    if (filters.keyword) {
      const kw = filters.keyword.toLowerCase();
      list = list.filter(
        (j) =>
          j.title.toLowerCase().includes(kw) ||
          j.company.toLowerCase().includes(kw)
      );
    }
    if (filters.location !== "all") list = list.filter((j) => j.location === filters.location);
    if (filters.mode !== "all") list = list.filter((j) => j.mode === filters.mode);
    if (filters.experience !== "all") list = list.filter((j) => j.experience === filters.experience);
    if (filters.source !== "all") list = list.filter((j) => j.source === filters.source);

    if (filters.sort === "latest") list.sort((a, b) => a.postedDaysAgo - b.postedDaysAgo);
    else if (filters.sort === "oldest") list.sort((a, b) => b.postedDaysAgo - a.postedDaysAgo);
    else if (filters.sort === "company") list.sort((a, b) => a.company.localeCompare(b.company));

    return list;
  }, [filters]);

  return (
    <main className="flex-1 px-space-3 py-space-4 max-w-[960px] mx-auto w-full">
      <h1 className="text-3xl md:text-4xl font-serif text-foreground">Dashboard</h1>
      <p className="mt-space-1 text-base text-muted-foreground">
        {filtered.length} job{filtered.length !== 1 ? "s" : ""} found
      </p>

      <div className="mt-space-3">
        <FilterBar filters={filters} onChange={setFilters} />
      </div>

      <div className="mt-space-3 grid gap-space-2 sm:grid-cols-2">
        {filtered.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            isSaved={isSaved(job.id)}
            onToggleSave={toggleSave}
            onView={setViewJob}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="mt-space-5 text-center">
          <p className="text-lg font-serif text-foreground">No matching jobs.</p>
          <p className="mt-space-1 text-sm text-muted-foreground">
            Try adjusting your filters to see more results.
          </p>
        </div>
      )}

      <JobDetailModal job={viewJob} open={!!viewJob} onClose={() => setViewJob(null)} />
    </main>
  );
};

export default Dashboard;
