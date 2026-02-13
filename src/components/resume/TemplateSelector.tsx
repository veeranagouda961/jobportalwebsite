import { useResume, ResumeTemplate, AccentColor, ACCENT_COLORS } from "@/hooks/useResume";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

/* ── Mini thumbnail sketches ── */
function ClassicThumb({ active, accent }: { active: boolean; accent: string }) {
  return (
    <div className="w-full h-full p-2 flex flex-col gap-1.5">
      <div className="h-1.5 w-10 mx-auto rounded-full" style={{ background: accent }} />
      <div className="h-0.5 w-full bg-border" />
      <div className="space-y-1 flex-1">
        <div className="h-1 w-full bg-muted rounded-sm" />
        <div className="h-1 w-3/4 bg-muted rounded-sm" />
        <div className="h-0.5 w-full bg-border mt-1.5" />
        <div className="h-1 w-full bg-muted rounded-sm" />
        <div className="h-1 w-5/6 bg-muted rounded-sm" />
      </div>
    </div>
  );
}

function ModernThumb({ active, accent }: { active: boolean; accent: string }) {
  return (
    <div className="w-full h-full flex">
      <div className="w-[35%] rounded-l-sm p-1.5 flex flex-col gap-1" style={{ background: accent }}>
        <div className="h-1.5 w-full bg-white/30 rounded-sm" />
        <div className="h-1 w-3/4 bg-white/20 rounded-sm" />
        <div className="h-1 w-full bg-white/20 rounded-sm mt-auto" />
      </div>
      <div className="flex-1 p-1.5 flex flex-col gap-1">
        <div className="h-1.5 w-10 bg-muted rounded-sm" />
        <div className="h-1 w-full bg-muted rounded-sm" />
        <div className="h-1 w-3/4 bg-muted rounded-sm" />
        <div className="h-1 w-5/6 bg-muted rounded-sm" />
      </div>
    </div>
  );
}

function MinimalThumb({ active, accent }: { active: boolean; accent: string }) {
  return (
    <div className="w-full h-full p-2.5 flex flex-col gap-2">
      <div className="h-1.5 w-12 bg-muted rounded-sm" />
      <div className="h-1 w-8 rounded-sm" style={{ background: accent, opacity: 0.5 }} />
      <div className="space-y-1 flex-1">
        <div className="h-1 w-full bg-muted/60 rounded-sm" />
        <div className="h-1 w-3/4 bg-muted/60 rounded-sm" />
        <div className="h-1 w-full bg-muted/60 rounded-sm mt-2" />
        <div className="h-1 w-5/6 bg-muted/60 rounded-sm" />
      </div>
    </div>
  );
}

const TEMPLATES: { id: ResumeTemplate; label: string; desc: string; Thumb: typeof ClassicThumb }[] = [
  { id: "classic", label: "Classic", desc: "Traditional single-column, serif headings", Thumb: ClassicThumb },
  { id: "modern", label: "Modern", desc: "Two-column with colored sidebar", Thumb: ModernThumb },
  { id: "minimal", label: "Minimal", desc: "Clean, generous whitespace", Thumb: MinimalThumb },
];

const COLOR_KEYS: AccentColor[] = ["teal", "navy", "burgundy", "forest", "charcoal"];

interface TemplateSelectorProps {
  className?: string;
}

export function TemplateSelector({ className }: TemplateSelectorProps) {
  const { template, setTemplate, accentColor, setAccentColor } = useResume();
  const accent = ACCENT_COLORS[accentColor].css;

  return (
    <div className={cn("space-y-3", className)}>
      {/* Template thumbnails */}
      <div className="flex items-start gap-3">
        {TEMPLATES.map((t) => {
          const active = template === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTemplate(t.id)}
              className={cn(
                "relative w-[120px] rounded-md border-2 transition-all overflow-hidden",
                active
                  ? "border-primary shadow-sm"
                  : "border-border hover:border-muted-foreground/40"
              )}
            >
              <div className="h-[80px] bg-white">
                <t.Thumb active={active} accent={accent} />
              </div>
              <div className="px-2 py-1.5 bg-card border-t border-border">
                <span className="text-[11px] font-medium text-foreground">{t.label}</span>
              </div>
              {active && (
                <div className="absolute top-1 right-1 h-4 w-4 rounded-full bg-primary flex items-center justify-center">
                  <Check className="h-2.5 w-2.5 text-primary-foreground" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Color circles */}
      <div className="flex items-center gap-2">
        <span className="text-[11px] text-muted-foreground font-medium mr-1">Accent</span>
        {COLOR_KEYS.map((key) => {
          const c = ACCENT_COLORS[key];
          const active = accentColor === key;
          return (
            <button
              key={key}
              onClick={() => setAccentColor(key)}
              title={c.label}
              className={cn(
                "h-6 w-6 rounded-full transition-all flex items-center justify-center",
                active ? "ring-2 ring-offset-2 ring-foreground" : "hover:scale-110"
              )}
              style={{ background: c.css }}
            >
              {active && <Check className="h-3 w-3 text-white" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
