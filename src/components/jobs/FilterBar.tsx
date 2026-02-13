import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { allLocations, allModes, allExperiences, allSources } from "@/data/jobs";
import { Search } from "lucide-react";

export interface Filters {
  keyword: string;
  location: string;
  mode: string;
  experience: string;
  source: string;
  sort: string;
  status: string;
}

interface Props {
  filters: Filters;
  onChange: (f: Filters) => void;
  hasPreferences?: boolean;
}

export function FilterBar({ filters, onChange, hasPreferences }: Props) {
  const set = (key: keyof Filters, value: string) =>
    onChange({ ...filters, [key]: value });

  return (
    <div className="flex flex-wrap items-end gap-space-2">
      <div className="relative min-w-[200px] flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search title or company…"
          value={filters.keyword}
          onChange={(e) => set("keyword", e.target.value)}
          className="pl-9"
        />
      </div>

      <Select value={filters.location} onValueChange={(v) => set("location", v)}>
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Location" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Locations</SelectItem>
          {allLocations.map((l) => (
            <SelectItem key={l} value={l}>{l}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={filters.mode} onValueChange={(v) => set("mode", v)}>
        <SelectTrigger className="w-[130px]">
          <SelectValue placeholder="Mode" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Modes</SelectItem>
          {allModes.map((m) => (
            <SelectItem key={m} value={m}>{m}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={filters.experience} onValueChange={(v) => set("experience", v)}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Experience" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Levels</SelectItem>
          {allExperiences.map((e) => (
            <SelectItem key={e} value={e}>{e}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={filters.source} onValueChange={(v) => set("source", v)}>
        <SelectTrigger className="w-[130px]">
          <SelectValue placeholder="Source" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Sources</SelectItem>
          {allSources.map((s) => (
            <SelectItem key={s} value={s}>{s}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={filters.status} onValueChange={(v) => set("status", v)}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="Not Applied">Not Applied</SelectItem>
          <SelectItem value="Applied">Applied</SelectItem>
          <SelectItem value="Rejected">Rejected</SelectItem>
          <SelectItem value="Selected">Selected</SelectItem>
        </SelectContent>
      </Select>

      <Select value={filters.sort} onValueChange={(v) => set("sort", v)}>
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Sort" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="latest">Latest</SelectItem>
          <SelectItem value="oldest">Oldest</SelectItem>
          <SelectItem value="company">Company A–Z</SelectItem>
          {hasPreferences && <SelectItem value="matchScore">Match Score</SelectItem>}
          <SelectItem value="salary">Salary</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
