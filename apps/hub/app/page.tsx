import Link from "next/link";
import { APP_URLS } from "./config";
import {
  Rocket,
  Briefcase,
  FileText,
  ArrowRight,
  Sparkles,
} from "lucide-react";

/* ---------------- Types ---------------- */

type App = {
  id: "placement" | "jobs" | "resume";
  title: string;
  description: string;
  icon: any;
  href: string;
  accent: string;
  iconBg: string;
  comingSoon?: boolean;
};

/* ---------------- Apps Config ---------------- */

const apps: App[] = [
  {
    id: "placement",
    title: "Placement Readiness",
    description:
      "Analyze job descriptions, get readiness scores, practice plans, and interview prep tailored to each role.",
    icon: Rocket,
    href: APP_URLS.placement,
    accent: "from-cyan-500/20 to-blue-600/20 border-cyan-500/30",
    iconBg: "bg-cyan-500/20 text-cyan-400",
  },
  {
    id: "jobs",
    title: "Job Tracker",
    description:
      "Discover roles, track applications, save jobs, and manage status from applied to selected.",
    icon: Briefcase,
    href: APP_URLS.jobs,
    accent: "from-emerald-500/20 to-teal-600/20 border-emerald-500/30",
    iconBg: "bg-emerald-500/20 text-emerald-400",
  },
  {
    id: "resume",
    title: "Resume Builder",
    description: "Build and tailor your resume for each application.",
    icon: FileText,
    href: APP_URLS.resume,
    accent: "from-violet-500/20 to-purple-600/20 border-violet-500/30",
    iconBg: "bg-violet-500/20 text-violet-400",
    comingSoon: false,
  },
];

/* ---------------- App Card ---------------- */

function AppCard({
  title,
  description,
  icon: Icon,
  href,
  accent,
  iconBg,
  comingSoon,
}: App) {
  const isExternal =
    href.startsWith("http://") || href.startsWith("https://");

  const content = (
    <div
      className={`rounded-2xl border p-6 h-full flex flex-col transition-all duration-200 hover:border-[var(--primary)]/50 hover:shadow-lg hover:shadow-[var(--primary)]/10 ${accent}`}
    >
      <div
        className={`inline-flex w-12 h-12 rounded-xl items-center justify-center mb-4 ${iconBg}`}
      >
        <Icon className="h-6 w-6" />
      </div>

      <h2 className="text-xl font-semibold mb-2">{title}</h2>

      <p className="text-sm text-muted-foreground flex-1">
        {description}
      </p>

      <div className="mt-4 flex items-center gap-2">
        {comingSoon ? (
          <span className="text-xs uppercase tracking-wider">
            Coming soon
          </span>
        ) : (
          <>
            <span className="text-sm font-medium text-primary">
              Open app
            </span>
            <ArrowRight className="h-4 w-4 text-primary" />
          </>
        )}
      </div>
    </div>
  );

  if (comingSoon || !href || href === "#") {
    return <div className="opacity-80">{content}</div>;
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

/* ---------------- Home Page ---------------- */

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">

      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-2 text-lg font-semibold">
            <Sparkles className="h-6 w-6 text-primary" />
            <span>KodNest Job Ecosystem</span>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 container mx-auto px-6 py-20">

        {/* Hero */}
        <section className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Your job journey, one hub
          </h1>

          <p className="text-lg text-muted-foreground">
            Placement prep, job tracking, and resume building—all in one place.
          </p>
        </section>

        {/* Apps */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">

          {apps.map((app) => (
            <AppCard key={app.id} {...app} />
          ))}

        </section>

      </main>

      {/* Footer */}
      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} KodNest Job Ecosystem
      </footer>

    </div>
  );
}
