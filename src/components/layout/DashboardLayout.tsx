import { Outlet, Link, useLocation } from "react-router-dom";
import { LayoutDashboard, BookOpen, ClipboardCheck, FolderOpen, User, History } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { label: "Practice", to: "/practice", icon: BookOpen },
  { label: "JD Analyzer", to: "/assessments", icon: ClipboardCheck },
  { label: "History", to: "/resources", icon: History },
  { label: "Profile", to: "/profile", icon: User },
];

export function DashboardLayout() {
  const { pathname } = useLocation();

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-60 shrink-0 bg-sidebar text-sidebar-foreground border-r border-sidebar-border flex flex-col">
        <div className="px-space-3 py-space-3">
          <h2 className="text-lg font-semibold tracking-tight">Placement Prep</h2>
        </div>
        <nav className="flex-1 px-3 space-y-1">
          {navItems.map((item) => {
            const active = pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-14 border-b border-border bg-card flex items-center justify-between px-space-3">
          <span className="text-sm font-semibold text-foreground">Placement Prep</span>
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-4 w-4 text-primary" />
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-space-3">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
