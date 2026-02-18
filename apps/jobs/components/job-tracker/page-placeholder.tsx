type PagePlaceholderProps = {
  title: string;
};

export function PagePlaceholder({ title }: PagePlaceholderProps) {
  return (
    <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
      <h1 className="font-headline text-5xl md:text-6xl font-bold tracking-tight text-foreground">
        {title}
      </h1>
      <p className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground leading-relaxed">
        This section will be built in the next step.
      </p>
    </main>
  );
}
