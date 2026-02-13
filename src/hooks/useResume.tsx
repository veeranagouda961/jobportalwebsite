import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { ResumeData, emptyResume, loadResumeData, saveResumeData } from "@/data/resumeTypes";

interface ResumeContextValue {
  resume: ResumeData;
  setResume: (data: ResumeData) => void;
  updateResume: (updater: (prev: ResumeData) => ResumeData) => void;
}

const ResumeContext = createContext<ResumeContextValue | null>(null);

export function ResumeProvider({ children }: { children: ReactNode }) {
  const [resume, setResumeState] = useState<ResumeData>(loadResumeData);

  useEffect(() => {
    saveResumeData(resume);
  }, [resume]);

  const setResume = useCallback((data: ResumeData) => {
    setResumeState(data);
  }, []);

  const updateResume = useCallback((updater: (prev: ResumeData) => ResumeData) => {
    setResumeState((prev) => updater(prev));
  }, []);

  return (
    <ResumeContext.Provider value={{ resume, setResume, updateResume }}>
      {children}
    </ResumeContext.Provider>
  );
}

export function useResume() {
  const ctx = useContext(ResumeContext);
  if (!ctx) throw new Error("useResume must be used within ResumeProvider");
  return ctx;
}
