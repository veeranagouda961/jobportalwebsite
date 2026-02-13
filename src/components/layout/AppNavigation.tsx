import { useState } from "react";
import { NavLink } from "@/components/NavLink";
import { Menu, X } from "lucide-react";

const navItems = [
  { label: "Dashboard", to: "/dashboard" },
  { label: "Saved", to: "/saved" },
  { label: "Digest", to: "/digest" },
  { label: "Settings", to: "/settings" },
  { label: "Proof", to: "/proof" },
];

export function AppNavigation() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="border-b border-border bg-card">
      <div className="flex items-center justify-between px-space-3 py-space-2">
        <NavLink to="/" className="text-sm font-semibold tracking-tight text-foreground">
          KodNest
        </NavLink>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-space-3">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className="text-sm font-medium text-muted-foreground pb-1 border-b-2 border-transparent transition-all duration-base"
                activeClassName="text-primary border-primary"
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-1 text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <ul className="md:hidden border-t border-border px-space-3 py-space-2 space-y-space-1 bg-card">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className="block text-sm font-medium text-muted-foreground py-1 border-l-2 border-transparent pl-space-2 transition-all duration-base"
                activeClassName="text-primary border-primary"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
}
