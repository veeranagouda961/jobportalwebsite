import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { RBBuildLayout } from "@/components/layout/RBBuildLayout";
import { ResumeBuilderLayout } from "@/components/layout/ResumeBuilderLayout";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Practice from "./pages/Practice";
import Assessments from "./pages/Assessments";
import Resources from "./pages/Resources";
import Results from "./pages/Results";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import RBStepPage from "./pages/rb/RBStepPage";
import RBProof from "./pages/rb/RBProof";
import ResumeHome from "./pages/resume/ResumeHome";
import Builder from "./pages/resume/Builder";
import Preview from "./pages/resume/Preview";
import ResumeProof from "./pages/resume/ResumeProof";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/practice" element={<Practice />} />
            <Route path="/assessments" element={<Assessments />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/results" element={<Results />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
          <Route element={<RBBuildLayout />}>
            <Route path="/rb/01-problem" element={<RBStepPage stepNumber={1} />} />
            <Route path="/rb/02-market" element={<RBStepPage stepNumber={2} />} />
            <Route path="/rb/03-architecture" element={<RBStepPage stepNumber={3} />} />
            <Route path="/rb/04-hld" element={<RBStepPage stepNumber={4} />} />
            <Route path="/rb/05-lld" element={<RBStepPage stepNumber={5} />} />
            <Route path="/rb/06-build" element={<RBStepPage stepNumber={6} />} />
            <Route path="/rb/07-test" element={<RBStepPage stepNumber={7} />} />
            <Route path="/rb/08-ship" element={<RBStepPage stepNumber={8} />} />
            <Route path="/rb/proof" element={<RBProof />} />
          </Route>
          <Route element={<ResumeBuilderLayout />}>
            <Route path="/resume" element={<ResumeHome />} />
            <Route path="/builder" element={<Builder />} />
            <Route path="/preview" element={<Preview />} />
            <Route path="/resume/proof" element={<ResumeProof />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
