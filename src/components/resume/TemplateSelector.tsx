import { useResume, ResumeTemplate } from "@/hooks/useResume";
import { cn } from "@/lib/utils";

interface TemplateSelectorProps {
  className?: string;
}

const templates: { id: ResumeTemplate; label: string }[] = [
  { id: "classic", label: "Classic" },
  { id: "modern", label: "Modern" },
  { id: "minimal", label: "Minimal" },
];

export function TemplateSelector({ className }: TemplateSelectorProps) {
  const { template, setTemplate } = useResume();

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {templates.map((t) => (
        <button
          key={t.id}
          onClick={() => setTemplate(t.id)}
          className={cn(
            "text-xs font-medium px-3 py-1.5 rounded-md transition-colors",
            template === t.id
              ? "bg-foreground text-background"
              : "text-muted-foreground hover:bg-accent hover:text-foreground"
          )}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
