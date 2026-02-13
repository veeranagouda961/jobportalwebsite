import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Code, Video, BarChart3 } from "lucide-react";

const features = [
  {
    icon: Code,
    title: "Practice Problems",
    description: "Sharpen your skills with curated coding challenges across difficulty levels.",
  },
  {
    icon: Video,
    title: "Mock Interviews",
    description: "Simulate real interview scenarios with timed sessions and feedback.",
  },
  {
    icon: BarChart3,
    title: "Track Progress",
    description: "Monitor your improvement with detailed analytics and performance insights.",
  },
];

const Index = () => (
  <div className="flex flex-col min-h-screen">
    {/* Hero */}
    <main className="flex flex-col items-center justify-center flex-1 px-space-3 py-space-5 text-center">
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
    <section className="px-space-3 py-space-5 bg-card">
      <div className="max-w-[960px] mx-auto">
        <div className="grid gap-space-3 sm:grid-cols-3">
          {features.map((f) => (
            <Card key={f.title} className="border border-border shadow-none">
              <CardContent className="p-space-3 flex flex-col items-center text-center gap-space-2">
                <div className="rounded-lg bg-primary/10 p-3">
                  <f.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-serif text-foreground">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>

    {/* Footer */}
    <footer className="border-t border-border px-space-3 py-space-3 text-center">
      <p className="text-sm text-muted-foreground">
        © {new Date().getFullYear()} Placement Prep. All rights reserved.
      </p>
    </footer>
  </div>
);

export default Index;
