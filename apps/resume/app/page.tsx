import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center bg-background p-8 text-center">
      <div className="mx-auto max-w-3xl space-y-6">
        <h1 className="font-headline text-5xl font-bold tracking-tight text-foreground sm:text-6xl md:text-7xl">
          Build a Resume That Gets Read.
        </h1>
        <p className="text-lg text-muted-foreground">
          Our AI-powered builder helps you craft a professional resume in minutes. Stand out and get hired faster.
        </p>
        <Button asChild size="lg">
          <Link href="/builder">Start Building</Link>
        </Button>
      </div>
    </main>
  );
}
