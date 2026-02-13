import { useState, useCallback, useEffect } from "react";

const STORAGE_KEY = "jobTrackerPreferences";

export interface Preferences {
  roleKeywords: string;
  preferredLocations: string[];
  preferredMode: string[];
  experienceLevel: string;
  skills: string;
  minMatchScore: number;
}

export const defaultPreferences: Preferences = {
  roleKeywords: "",
  preferredLocations: [],
  preferredMode: [],
  experienceLevel: "",
  skills: "",
  minMatchScore: 40,
};

function load(): Preferences | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Preferences;
  } catch {
    return null;
  }
}

export function usePreferences() {
  const [prefs, setPrefs] = useState<Preferences>(() => load() ?? defaultPreferences);
  const [hasPreferences, setHasPreferences] = useState(() => !!load());

  const save = useCallback((p: Preferences) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
    setPrefs(p);
    setHasPreferences(true);
  }, []);

  const update = useCallback(
    (partial: Partial<Preferences>) => {
      const next = { ...prefs, ...partial };
      save(next);
    },
    [prefs, save]
  );

  return { prefs, save, update, hasPreferences };
}
