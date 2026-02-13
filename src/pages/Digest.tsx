import { Mail } from "lucide-react";

const Digest = () => (
  <main className="flex flex-col items-center justify-center flex-1 px-space-3 py-space-5 text-center">
    <Mail className="h-10 w-10 text-muted-foreground/50" strokeWidth={1.5} />
    <h1 className="mt-space-2 text-3xl md:text-4xl font-serif text-foreground">No digests yet.</h1>
    <p className="mt-space-1 text-base text-muted-foreground max-w-prose">
      Your daily 9AM job digest will be collected here.
    </p>
  </main>
);

export default Digest;
