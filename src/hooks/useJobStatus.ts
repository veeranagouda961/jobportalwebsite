import { useState, useCallback } from "react";

export type JobStatus = "Not Applied" | "Applied" | "Rejected" | "Selected";

export const ALL_STATUSES: JobStatus[] = ["Not Applied", "Applied", "Rejected", "Selected"];

interface StatusEntry {
  status: JobStatus;
  date: string;
}

type StatusMap = Record<number, StatusEntry>;

const STORAGE_KEY = "jobTrackerStatus";

function getStored(): StatusMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function useJobStatus() {
  const [statusMap, setStatusMap] = useState<StatusMap>(getStored);

  const getStatus = useCallback(
    (jobId: number): JobStatus => statusMap[jobId]?.status ?? "Not Applied",
    [statusMap]
  );

  const setStatus = useCallback((jobId: number, status: JobStatus) => {
    setStatusMap((prev) => {
      const next = {
        ...prev,
        [jobId]: { status, date: new Date().toISOString() },
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const getRecentUpdates = useCallback(() => {
    return Object.entries(statusMap)
      .filter(([, entry]) => entry.status !== "Not Applied")
      .map(([id, entry]) => ({
        jobId: Number(id),
        status: entry.status,
        date: entry.date,
      }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [statusMap]);

  return { getStatus, setStatus, getRecentUpdates };
}
