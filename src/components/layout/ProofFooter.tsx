import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";

const checklistItems = [
  { id: "ui", label: "UI Built" },
  { id: "logic", label: "Logic Working" },
  { id: "test", label: "Test Passed" },
  { id: "deployed", label: "Deployed" },
];

export function ProofFooter() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const toggle = (id: string) =>
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <footer className="border-t border-border bg-card px-space-3 py-space-2">
      <div className="flex items-center gap-space-4 flex-wrap">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mr-space-2">
          Proof
        </span>
        {checklistItems.map((item) => (
          <label
            key={item.id}
            className="flex items-center gap-2 cursor-pointer select-none"
          >
            <Checkbox
              checked={!!checked[item.id]}
              onCheckedChange={() => toggle(item.id)}
              className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            />
            <span className="text-sm text-foreground">{item.label}</span>
          </label>
        ))}
      </div>
    </footer>
  );
}
