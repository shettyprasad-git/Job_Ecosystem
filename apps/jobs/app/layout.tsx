import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/components/job-tracker/header';

export const metadata: Metadata = {
  title: 'KodNest Job Tracker',
  description: 'Precision-matched job discovery.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans antialiased bg-slate-50 text-slate-900 selection:bg-blue-100 selection:text-blue-900">
        <div className="min-h-screen">
          <Header />
          {children}
        </div>
        <Toaster />
      </body>
    </html>
  );
}
