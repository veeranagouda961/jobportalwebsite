import { Badge } from "@/components/ui/badge";

type Status = "Not Started" | "In Progress" | "Shipped";

interface TopBarProps {
  projectName?: string;
  currentStep?: number;
  totalSteps?: number;
  status?: Status;
}

const statusStyles: Record<Status, string> = {
  "Not Started": "bg-secondary text-muted-foreground border-border",
  "In Progress": "bg-warning/15 text-warning-foreground border-warning/30",
  "Shipped": "bg-success/15 text-success border-success/30",
};

export function TopBar({
  projectName = "KodNest Premium Build System",
  currentStep = 1,
  totalSteps = 5,
  status = "Not Started",
}: TopBarProps) {
  return (
    <header className="flex items-center justify-between border-b border-border px-space-3 py-space-2 bg-card">
      <span className="text-sm font-semibold tracking-tight text-foreground">
        {projectName}
      </span>

      <span className="text-xs font-medium text-muted-foreground tracking-wide uppercase">
        Step {currentStep} / {totalSteps}
      </span>

      <Badge
        variant="outline"
        className={`text-xs font-medium px-3 py-1 rounded-md ${statusStyles[status]}`}
      >
        {status}
      </Badge>
    </header>
  );
}
