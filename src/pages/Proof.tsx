import { ClipboardCheck } from "lucide-react";

const Proof = () => (
  <main className="flex flex-col items-center justify-center flex-1 px-space-3 py-space-5 text-center">
    <ClipboardCheck className="h-10 w-10 text-muted-foreground/50" strokeWidth={1.5} />
    <h1 className="mt-space-2 text-3xl md:text-4xl font-serif text-foreground">Proof of Work</h1>
    <p className="mt-space-1 text-base text-muted-foreground max-w-prose">
      Artifact collection and verification will be set up in the next step.
    </p>
  </main>
);

export default Proof;
