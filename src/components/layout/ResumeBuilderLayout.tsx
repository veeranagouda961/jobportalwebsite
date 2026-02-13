import { Outlet, Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ResumeProvider } from "@/hooks/useResume";
import { FileText, Eye, ClipboardCheck } from "lucide-react";

const navItems = [
  { label: "Builder", to: "/builder", icon: FileText },
  { label: "Preview", to: "/preview", icon: Eye },
  { label: "Proof", to: "/resume/proof", icon: ClipboardCheck },
];

export function ResumeBuilderLayout() {
  const { pathname } = useLocation();

  return (
    <ResumeProvider>
      <div className="flex flex-col min-h-screen bg-background">
        {/* Top nav */}
        <header className="border-b border-border bg-card">
          <div className="flex items-center justify-between px-space-3 py-space-2">
            <Link to="/" className="text-sm font-semibold tracking-tight text-foreground">
              AI Resume Builder
            </Link>
            <nav className="flex items-center gap-1">
              {navItems.map((item) => {
                const active = pathname === item.to;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={cn(
                      "flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-md transition-colors",
                      active
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                    )}
                  >
                    <item.icon className="h-3.5 w-3.5" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </header>

        <div className="flex-1 flex flex-col">
          <Outlet />
        </div>
      </div>
    </ResumeProvider>
  );
}
