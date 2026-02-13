import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => (
  <main className="flex flex-col items-center justify-center flex-1 px-space-3 py-space-5 text-center">
    <h1 className="text-4xl md:text-5xl font-serif text-foreground text-balance max-w-[640px]">
      Stop Missing The Right Jobs.
    </h1>
    <p className="mt-space-2 text-lg text-muted-foreground max-w-prose">
      Precision-matched job discovery delivered daily at 9AM.
    </p>
    <Button asChild className="mt-space-4" size="lg">
      <Link to="/settings">Start Tracking</Link>
    </Button>
  </main>
);

export default Index;
