import { Outlet } from "react-router-dom";
import { AppNavigation } from "./AppNavigation";

export function AppLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppNavigation />
      <Outlet />
    </div>
  );
}
