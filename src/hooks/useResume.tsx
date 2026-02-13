import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { ResumeData, emptyResume, loadResumeData, saveResumeData } from "@/data/resumeTypes";

export type ResumeTemplate = "classic" | "modern" | "minimal";

const TEMPLATE_KEY = "rb_template";

function loadTemplate(): ResumeTemplate {
  const saved = localStorage.getItem(TEMPLATE_KEY);
  if (saved === "classic" || saved === "modern" || saved === "minimal") return saved;
  return "classic";
}

interface ResumeContextValue {
  resume: ResumeData;
  setResume: (data: ResumeData) => void;
  updateResume: (updater: (prev: ResumeData) => ResumeData) => void;
  template: ResumeTemplate;
  setTemplate: (t: ResumeTemplate) => void;
}

const ResumeContext = createContext<ResumeContextValue | null>(null);

export function ResumeProvider({ children }: { children: ReactNode }) {
  const [resume, setResumeState] = useState<ResumeData>(loadResumeData);
  const [template, setTemplateState] = useState<ResumeTemplate>(loadTemplate);

  useEffect(() => {
    saveResumeData(resume);
  }, [resume]);

  useEffect(() => {
    localStorage.setItem(TEMPLATE_KEY, template);
  }, [template]);

  const setResume = useCallback((data: ResumeData) => {
    setResumeState(data);
  }, []);

  const updateResume = useCallback((updater: (prev: ResumeData) => ResumeData) => {
    setResumeState((prev) => updater(prev));
  }, []);

  const setTemplate = useCallback((t: ResumeTemplate) => {
    setTemplateState(t);
  }, []);

  return (
    <ResumeContext.Provider value={{ resume, setResume, updateResume, template, setTemplate }}>
      {children}
    </ResumeContext.Provider>
  );
}

export function useResume() {
  const ctx = useContext(ResumeContext);
  if (!ctx) throw new Error("useResume must be used within ResumeProvider");
  return ctx;
}
