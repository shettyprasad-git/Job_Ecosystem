import Link from 'next/link';
import { APP_URLS } from './config';
import {
  Rocket,
  Briefcase,
  FileText,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

const apps = [
  {
    key: 'placement' as const,
    title: 'Placement Readiness',
    description:
      'Analyze job descriptions, get readiness scores, practice plans, and interview prep tailored to each role.',
    icon: Rocket,
    href: APP_URLS.placement,
    accent: 'from-cyan-500/20 to-blue-600/20 border-cyan-500/30',
    iconBg: 'bg-cyan-500/20 text-cyan-400',
  },
  {
    key: 'jobs' as const,
    title: 'Job Tracker',
    description:
      'Discover roles, track applications, save jobs, and manage status from applied to selected.',
    icon: Briefcase,
    href: APP_URLS.jobs,
    accent: 'from-emerald-500/20 to-teal-600/20 border-emerald-500/30',
    iconBg: 'bg-emerald-500/20 text-emerald-400',
  },
  {
    key: 'resume' as const,
    title: 'Resume Builder',
    description:
      'Build and tailor your resume for each application.',
    icon: FileText,
    href: APP_URLS.resume,
    accent: 'from-violet-500/20 to-purple-600/20 border-violet-500/30',
    iconBg: 'bg-violet-500/20 text-violet-400',
    comingSoon: false,
  },
];

function AppCard({
  title,
  description,
  icon: Icon,
  href,
  accent,
  iconBg,
  comingSoon,
}: (typeof apps)[0]) {
  const isExternal =
    href.startsWith('http://') || href.startsWith('https://');
  const content = (
    <>
      <div
        className={`rounded-2xl border p-6 h-full flex flex-col transition-all duration-200 hover:border-[var(--primary)]/50 hover:shadow-lg hover:shadow-[var(--primary)]/10 ${accent}`}
      >
        <div
          className={`inline-flex w-12 h-12 rounded-xl items-center justify-center mb-4 ${iconBg}`}
        >
          <Icon className="h-6 w-6" />
        </div>
        <h2 className="text-xl font-semibold text-[var(--foreground)] mb-2">
          {title}
        </h2>
        <p className="text-sm text-[var(--muted-foreground)] flex-1">
          {description}
        </p>
        <div className="mt-4 flex items-center gap-2">
          {comingSoon ? (
            <span className="text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wider">
              Coming soon
            </span>
          ) : (
            <>
              <span className="text-sm font-medium text-[var(--primary)]">
                Open app
              </span>
              <ArrowRight className="h-4 w-4 text-[var(--primary)]" />
            </>
          )}
        </div>
      </div>
    </>
  );

  if (comingSoon || !href || href === '#') {
    return (
      <div className="cursor-not-allowed opacity-90" title="Coming soon">
        {content}
      </div>
    );
  }

  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="block h-full"
      >
        {content}
      </a>
    );
  }

  return <Link href={href}>{content}</Link>;
}

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-[var(--border)]">
        <div className="container mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center gap-2 font-semibold text-lg">
            <Sparkles className="h-6 w-6 text-[var(--primary)]" />
            <span>KodNest Job Ecosystem</span>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 md:px-6 py-12 md:py-20">
        <section className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[var(--foreground)] mb-4">
            Your job journey, one hub
          </h1>
          <p className="text-lg text-[var(--muted-foreground)]">
            Placement prep, job tracking, and resume building—all in one place.
            Pick an app below to get started.
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {apps.map((app) => (
            <AppCard key={app.key} {...app} />
          ))}
        </section>

        <p className="text-center text-sm text-[var(--muted-foreground)] mt-12">
          In development, run each app on a different port and set{' '}
          <code className="bg-[var(--card)] px-1.5 py-0.5 rounded text-xs">
            NEXT_PUBLIC_PLACEMENT_URL
          </code>
          ,{' '}
          <code className="bg-[var(--card)] px-1.5 py-0.5 rounded text-xs">
            NEXT_PUBLIC_JOBS_URL
          </code>
          , and{' '}
          <code className="bg-[var(--card)] px-1.5 py-0.5 rounded text-xs">
            NEXT_PUBLIC_RESUME_URL
          </code>{' '}
          in <code className="bg-[var(--card)] px-1.5 py-0.5 rounded text-xs">.env.local</code>.
        </p>
      </main>

      <footer className="border-t border-[var(--border)] py-6">
        <div className="container mx-auto px-4 md:px-6 text-center text-sm text-[var(--muted-foreground)]">
          © {new Date().getFullYear()} KodNest Job Ecosystem
        </div>
      </footer>
    </div>
  );
}
