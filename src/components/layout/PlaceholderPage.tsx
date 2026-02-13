interface PlaceholderPageProps {
  title: string;
}

export function PlaceholderPage({ title }: PlaceholderPageProps) {
  return (
    <div className="flex flex-col items-center justify-center flex-1 px-space-3 py-space-5">
      <h1 className="text-3xl md:text-4xl font-serif text-foreground text-balance text-center">
        {title}
      </h1>
      <p className="mt-space-2 text-base text-muted-foreground text-center max-w-prose">
        This section will be built in the next step.
      </p>
    </div>
  );
}
