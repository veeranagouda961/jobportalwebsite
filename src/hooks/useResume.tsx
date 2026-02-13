import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { ResumeData, emptyResume, loadResumeData, saveResumeData } from "@/data/resumeTypes";

export type ResumeTemplate = "classic" | "modern" | "minimal";

export type AccentColor = "teal" | "navy" | "burgundy" | "forest" | "charcoal";

export const ACCENT_COLORS: Record<AccentColor, { label: string; hsl: string; css: string }> = {
  teal:      { label: "Teal",      hsl: "168 60% 40%", css: "hsl(168, 60%, 40%)" },
  navy:      { label: "Navy",      hsl: "220 60% 35%", css: "hsl(220, 60%, 35%)" },
  burgundy:  { label: "Burgundy",  hsl: "345 60% 35%", css: "hsl(345, 60%, 35%)" },
  forest:    { label: "Forest",    hsl: "150 50% 30%", css: "hsl(150, 50%, 30%)" },
  charcoal:  { label: "Charcoal",  hsl: "0 0% 25%",    css: "hsl(0, 0%, 25%)" },
};

const TEMPLATE_KEY = "rb_template";
const ACCENT_KEY = "rb_accent";

function loadTemplate(): ResumeTemplate {
  const saved = localStorage.getItem(TEMPLATE_KEY);
  if (saved === "classic" || saved === "modern" || saved === "minimal") return saved;
  return "classic";
}

function loadAccent(): AccentColor {
  const saved = localStorage.getItem(ACCENT_KEY);
  if (saved && saved in ACCENT_COLORS) return saved as AccentColor;
  return "teal";
}

interface ResumeContextValue {
  resume: ResumeData;
  setResume: (data: ResumeData) => void;
  updateResume: (updater: (prev: ResumeData) => ResumeData) => void;
  template: ResumeTemplate;
  setTemplate: (t: ResumeTemplate) => void;
  accentColor: AccentColor;
  setAccentColor: (c: AccentColor) => void;
}

const ResumeContext = createContext<ResumeContextValue | null>(null);

export function ResumeProvider({ children }: { children: ReactNode }) {
  const [resume, setResumeState] = useState<ResumeData>(loadResumeData);
  const [template, setTemplateState] = useState<ResumeTemplate>(loadTemplate);
  const [accentColor, setAccentState] = useState<AccentColor>(loadAccent);

  useEffect(() => { saveResumeData(resume); }, [resume]);
  useEffect(() => { localStorage.setItem(TEMPLATE_KEY, template); }, [template]);
  useEffect(() => { localStorage.setItem(ACCENT_KEY, accentColor); }, [accentColor]);

  const setResume = useCallback((data: ResumeData) => setResumeState(data), []);
  const updateResume = useCallback((updater: (prev: ResumeData) => ResumeData) => setResumeState((prev) => updater(prev)), []);
  const setTemplate = useCallback((t: ResumeTemplate) => setTemplateState(t), []);
  const setAccentColor = useCallback((c: AccentColor) => setAccentState(c), []);

  return (
    <ResumeContext.Provider value={{ resume, setResume, updateResume, template, setTemplate, accentColor, setAccentColor }}>
      {children}
    </ResumeContext.Provider>
  );
}

export function useResume() {
  const ctx = useContext(ResumeContext);
  if (!ctx) throw new Error("useResume must be used within ResumeProvider");
  return ctx;
}
