import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"

export const metadata: Metadata = {
  title: 'AI Resume Builder',
  description: 'Build a Resume That Gets Read.',
};

function AppHeader() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-border/50 sticky top-0 z-50 w-full glass no-print px-6">
      <Link href="/" className="font-headline text-lg font-medium text-foreground">
        AI Resume Builder
      </Link>
      <nav className="flex items-center gap-6 text-sm">
        <Link href="/builder" className="text-muted-foreground transition-colors hover:text-foreground">
          Builder
        </Link>
        <Link href="/preview" className="text-muted-foreground transition-colors hover:text-foreground">
          Preview
        </Link>
        <Link href="/proof" className="text-muted-foreground transition-colors hover:text-foreground">
          Proof
        </Link>
      </nav>
    </header>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@400;500&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <div className="relative flex min-h-screen flex-col">
          <AppHeader />
          <main className="flex-1 flex flex-col">{children}</main>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
