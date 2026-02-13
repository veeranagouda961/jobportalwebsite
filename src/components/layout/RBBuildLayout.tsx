import { Outlet, useLocation, useNavigate, Link } from "react-router-dom";
import { TopBar } from "./TopBar";
import { ProofFooter } from "./ProofFooter";
import { rbSteps } from "@/data/rbSteps";
import { cn } from "@/lib/utils";
import { useMemo } from "react";

const ARTIFACT_PREFIX = "rb_step_";

function getArtifactKey(step: number) {
  return `${ARTIFACT_PREFIX}${step}_artifact`;
}

export function useRBGating() {
  const completedSteps = useMemo(() => {
    const completed: Record<number, boolean> = {};
    for (let i = 1; i <= 8; i++) {
      const artifact = localStorage.getItem(getArtifactKey(i));
      completed[i] = !!artifact;
    }
    return completed;
  }, []);

  const isStepAccessible = (stepNumber: number) => {
    if (stepNumber === 1) return true;
    return !!localStorage.getItem(getArtifactKey(stepNumber - 1));
  };

  return { completedSteps, isStepAccessible, getArtifactKey };
}

type ShipStatus = "Not Started" | "In Progress" | "Shipped";

export function RBBuildLayout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { isStepAccessible } = useRBGating();

  const currentStep = rbSteps.find((s) => s.path === pathname);
  const stepNumber = currentStep?.number ?? 0;

  const isProof = pathname === "/rb/proof";

  // Compute status
  const status: ShipStatus = useMemo(() => {
    let anyStarted = false;
    let allDone = true;
    for (let i = 1; i <= 8; i++) {
      if (localStorage.getItem(getArtifactKey(i))) {
        anyStarted = true;
      } else {
        allDone = false;
      }
    }
    if (allDone) return "Shipped";
    if (anyStarted) return "In Progress";
    return "Not Started";
  }, [pathname]); // re-eval on nav

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <TopBar
        projectName="AI Resume Builder"
        currentStep={isProof ? 8 : stepNumber}
        totalSteps={8}
        status={status}
      />

      {/* Step nav */}
      <nav className="border-b border-border bg-card px-space-3 py-space-1 overflow-x-auto">
        <div className="flex items-center gap-1">
          {rbSteps.map((step) => {
            const accessible = isStepAccessible(step.number);
            const active = pathname === step.path;
            return (
              <Link
                key={step.path}
                to={accessible ? step.path : "#"}
                onClick={(e) => {
                  if (!accessible) {
                    e.preventDefault();
                  }
                }}
                className={cn(
                  "text-xs font-medium px-3 py-1.5 rounded-md whitespace-nowrap transition-colors",
                  active
                    ? "bg-primary text-primary-foreground"
                    : accessible
                    ? "text-muted-foreground hover:bg-accent hover:text-foreground"
                    : "text-muted-foreground/40 cursor-not-allowed"
                )}
              >
                {step.number}. {step.title}
              </Link>
            );
          })}
          <Link
            to="/rb/proof"
            className={cn(
              "text-xs font-medium px-3 py-1.5 rounded-md whitespace-nowrap transition-colors",
              isProof
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            )}
          >
            Proof
          </Link>
        </div>
      </nav>

      <div className="flex-1 flex flex-col">
        <Outlet />
      </div>

      <ProofFooter />
    </div>
  );
}
