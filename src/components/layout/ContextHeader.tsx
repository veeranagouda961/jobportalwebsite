interface ContextHeaderProps {
  headline: string;
  subtext: string;
}

export function ContextHeader({ headline, subtext }: ContextHeaderProps) {
  return (
    <section className="px-space-3 py-space-4 border-b border-border">
      <h1 className="text-3xl md:text-4xl font-serif text-foreground text-balance">
        {headline}
      </h1>
      <p className="mt-space-2 text-base text-muted-foreground max-w-prose">
        {subtext}
      </p>
    </section>
  );
}
