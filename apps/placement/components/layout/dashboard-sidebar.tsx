import Link from 'next/link';
import { Rocket } from 'lucide-react';
import { DashboardNav } from './dashboard-nav';

export function DashboardSidebar() {
  return (
    <aside className="hidden w-64 flex-col border-r bg-background md:flex">
      <div className="flex h-16 shrink-0 items-center border-b px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Rocket className="h-6 w-6 text-primary" />
          <span>Placement Prep</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-4 text-sm font-medium">
            <DashboardNav />
        </nav>
      </div>
    </aside>
  );
}
