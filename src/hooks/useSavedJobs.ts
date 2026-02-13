import { useState, useCallback } from "react";

const STORAGE_KEY = "saved-job-ids";

function getStoredIds(): number[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function useSavedJobs() {
  const [savedIds, setSavedIds] = useState<number[]>(getStoredIds);

  const toggleSave = useCallback((id: number) => {
    setSavedIds((prev) => {
      const next = prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const isSaved = useCallback((id: number) => savedIds.includes(id), [savedIds]);

  return { savedIds, toggleSave, isSaved };
}
