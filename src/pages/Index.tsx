import { TopBar } from "@/components/layout/TopBar";
import { ContextHeader } from "@/components/layout/ContextHeader";
import { SecondaryPanel } from "@/components/layout/SecondaryPanel";
import { ProofFooter } from "@/components/layout/ProofFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Top Bar */}
      <TopBar
        projectName="KodNest Premium Build System"
        currentStep={1}
        totalSteps={5}
        status="In Progress"
      />

      {/* Context Header */}
      <ContextHeader
        headline="Design System Foundation"
        subtext="Establish the visual language that every component, page, and interaction will follow. Consistency is not a constraint — it is confidence."
      />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col lg:flex-row">
        {/* Primary Workspace (70%) */}
        <main className="flex-1 lg:w-[70%] p-space-3 md:p-space-4">
          <div className="max-w-prose space-y-space-4">
            {/* Color Palette */}
            <section>
              <h2 className="text-2xl font-serif text-foreground mb-space-3">
                Color Palette
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-space-2">
                <ColorSwatch
                  name="Background"
                  color="bg-background"
                  hex="#F7F6F3"
                />
                <ColorSwatch
                  name="Foreground"
                  color="bg-foreground"
                  hex="#111111"
                />
                <ColorSwatch
                  name="Accent"
                  color="bg-primary"
                  hex="#8B0000"
                />
                <ColorSwatch
                  name="Muted"
                  color="bg-muted"
                  hex="#E8E6E1"
                />
              </div>
            </section>

            {/* Typography */}
            <section>
              <h2 className="text-2xl font-serif text-foreground mb-space-3">
                Typography
              </h2>
              <div className="space-y-space-2 border border-border rounded-md p-space-3 bg-card">
                <h1 className="text-4xl font-serif text-foreground">
                  Heading One — Serif
                </h1>
                <h2 className="text-2xl font-serif text-foreground">
                  Heading Two — Serif
                </h2>
                <h3 className="text-xl font-serif text-foreground">
                  Heading Three — Serif
                </h3>
                <p className="text-base text-foreground leading-relaxed">
                  Body text — Clean sans-serif at 16px with generous line-height
                  for comfortable reading. Maximum width constrained to 720px to
                  maintain optimal line length.
                </p>
                <p className="text-sm text-muted-foreground">
                  Secondary text — Muted foreground for supporting information.
                </p>
              </div>
            </section>

            {/* Buttons */}
            <section>
              <h2 className="text-2xl font-serif text-foreground mb-space-3">
                Buttons
              </h2>
              <div className="flex flex-wrap gap-space-2 items-center">
                <Button variant="default">Primary Action</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="link">Link Style</Button>
              </div>
              <div className="flex flex-wrap gap-space-2 items-center mt-space-2">
                <Button variant="default" size="sm">Small</Button>
                <Button variant="default" size="default">Default</Button>
                <Button variant="default" size="lg">Large</Button>
              </div>
            </section>

            {/* Inputs */}
            <section>
              <h2 className="text-2xl font-serif text-foreground mb-space-3">
                Inputs
              </h2>
              <div className="space-y-space-2 max-w-sm">
                <Input placeholder="Default input" />
                <Input placeholder="Disabled input" disabled />
              </div>
            </section>

            {/* Badges */}
            <section>
              <h2 className="text-2xl font-serif text-foreground mb-space-3">
                Status Badges
              </h2>
              <div className="flex flex-wrap gap-space-2 items-center">
                <Badge variant="default">Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge variant="destructive">Error</Badge>
              </div>
            </section>

            {/* Cards */}
            <section>
              <h2 className="text-2xl font-serif text-foreground mb-space-3">
                Cards
              </h2>
              <div className="grid md:grid-cols-2 gap-space-2">
                <div className="border border-border rounded-md p-space-3 bg-card">
                  <h3 className="text-lg font-serif text-foreground mb-space-1">
                    Standard Card
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Subtle border, no drop shadow, balanced padding. Content
                    lives here with clear hierarchy.
                  </p>
                </div>
                <div className="border border-border rounded-md p-space-3 bg-card">
                  <h3 className="text-lg font-serif text-foreground mb-space-1">
                    Interactive Card
                  </h3>
                  <p className="text-sm text-muted-foreground mb-space-2">
                    Cards can hold actions and interactive elements.
                  </p>
                  <Button variant="default" size="sm">
                    Take Action
                  </Button>
                </div>
              </div>
            </section>

            {/* Spacing */}
            <section>
              <h2 className="text-2xl font-serif text-foreground mb-space-3">
                Spacing Scale
              </h2>
              <div className="space-y-space-1">
                {[
                  { label: "space-1", value: "8px" },
                  { label: "space-2", value: "16px" },
                  { label: "space-3", value: "24px" },
                  { label: "space-4", value: "40px" },
                  { label: "space-5", value: "64px" },
                ].map((s) => (
                  <div key={s.label} className="flex items-center gap-space-2">
                    <span className="text-sm text-muted-foreground w-20 font-mono">
                      {s.label}
                    </span>
                    <div
                      className="bg-primary/20 rounded-sm h-4"
                      style={{ width: s.value }}
                    />
                    <span className="text-xs text-muted-foreground">
                      {s.value}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Error & Empty States */}
            <section>
              <h2 className="text-2xl font-serif text-foreground mb-space-3">
                States
              </h2>
              <div className="space-y-space-2">
                <div className="border border-destructive/30 rounded-md p-space-3 bg-destructive/5">
                  <p className="text-sm font-medium text-foreground">
                    Something didn't go as expected.
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    The build configuration file couldn't be parsed. Check for
                    syntax errors in your config and try again.
                  </p>
                </div>
                <div className="border border-border rounded-md p-space-3 bg-card text-center">
                  <p className="text-sm text-muted-foreground">
                    No builds yet.
                  </p>
                  <Button variant="default" size="sm" className="mt-space-2">
                    Start Your First Build
                  </Button>
                </div>
              </div>
            </section>
          </div>
        </main>

        {/* Secondary Panel (30%) */}
        <div className="lg:w-[30%] lg:min-w-[320px]">
          <SecondaryPanel />
        </div>
      </div>

      {/* Proof Footer */}
      <ProofFooter />
    </div>
  );
};

function ColorSwatch({
  name,
  color,
  hex,
}: {
  name: string;
  color: string;
  hex: string;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`w-full aspect-square rounded-md border border-border ${color}`}
      />
      <span className="text-sm font-medium text-foreground">{name}</span>
      <span className="text-xs text-muted-foreground font-mono">{hex}</span>
    </div>
  );
}

export default Index;
