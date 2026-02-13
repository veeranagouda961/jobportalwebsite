import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Code2, Video, BarChart3 } from "lucide-react";

const features = [
  {
    icon: Code2,
    title: "Practice Problems",
    description: "Solve curated coding challenges across data structures, algorithms, and more.",
  },
  {
    icon: Video,
    title: "Mock Interviews",
    description: "Simulate real interview experiences with timed sessions and feedback.",
  },
  {
    icon: BarChart3,
    title: "Track Progress",
    description: "Monitor your strengths, weaknesses, and readiness score over time.",
  },
];

const Index = () => (
  <div className="min-h-screen flex flex-col bg-background">
    {/* Hero */}
    <main className="flex-1 flex flex-col items-center justify-center px-space-3 py-space-5 text-center">
      <h1 className="text-5xl md:text-6xl font-serif text-foreground text-balance max-w-[720px]">
        Ace Your Placement
      </h1>
      <p className="mt-space-2 text-lg text-muted-foreground max-w-prose">
        Practice, assess, and prepare for your dream job.
      </p>
      <Button asChild className="mt-space-4" size="lg">
        <Link to="/dashboard">Get Started</Link>
      </Button>
    </main>

    {/* Features */}
    <section className="px-space-3 pb-space-5">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-space-3">
        {features.map((f) => (
          <Card key={f.title} className="text-center">
            <CardContent className="pt-6 flex flex-col items-center gap-space-2">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <f.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>

    {/* Footer */}
    <footer className="border-t border-border py-space-3 text-center">
      <p className="text-sm text-muted-foreground">
        © {new Date().getFullYear()} Placement Prep. All rights reserved.
      </p>
    </footer>
  </div>
);

export default Index;
