import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, FileText } from "lucide-react";

const ResumeHome = () => {
  return (
    <main className="flex-1 flex flex-col items-center justify-center px-space-3 py-space-5">
      <div className="text-center max-w-xl space-y-space-3">
        <FileText className="mx-auto h-12 w-12 text-muted-foreground/40" strokeWidth={1.5} />
        <h1 className="text-4xl md:text-5xl font-serif text-foreground text-balance">
          Build a Resume That Gets Read.
        </h1>
          <p className="text-lg text-muted-foreground max-w-md mx-auto leading-relaxed">
            A clean, structured resume builder with live preview. No clutter. No distractions. Just your story, well told.
          </p>
        <Link to="/builder">
          <Button size="lg" className="mt-space-2">
            Start Building <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </main>
  );
};

export default ResumeHome;
