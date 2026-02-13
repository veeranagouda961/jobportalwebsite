import { Outlet, Link, useLocation } from "react-router-dom";
import { LayoutDashboard, BookOpen, ClipboardList, FolderOpen, User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { label: "Practice", to: "/practice", icon: BookOpen },
  { label: "Assessments", to: "/assessments", icon: ClipboardList },
  { label: "Resources", to: "/resources", icon: FolderOpen },
  { label: "Profile", to: "/profile", icon: User },
];

export function DashboardLayout() {
  const { pathname } = useLocation();

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="hidden md:flex w-60 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
        <div className="px-space-3 py-space-3 border-b border-sidebar-border">
          <h2 className="text-lg font-semibold tracking-tight">Placement Prep</h2>
        </div>
        <nav className="flex-1 px-3 py-space-2 space-y-1">
          {navItems.map((item) => {
            const active = pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-sidebar-accent text-sidebar-primary"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
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
      <div className="flex flex-col flex-1">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-border px-space-3 py-space-2 bg-card">
          <span className="text-sm font-semibold tracking-tight text-foreground md:hidden">
            Placement Prep
          </span>
          <div className="hidden md:block" />
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
              U
            </AvatarFallback>
          </Avatar>
        </header>

        {/* Mobile nav */}
        <nav className="flex md:hidden border-b border-border bg-card overflow-x-auto">
          {navItems.map((item) => {
            const active = pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2 text-xs font-medium whitespace-nowrap border-b-2 transition-colors",
                  active
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                <item.icon className="h-3.5 w-3.5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Content */}
        <main className="flex-1 p-space-3">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
