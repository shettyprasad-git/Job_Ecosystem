'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { navItems } from './dashboard-nav-items';

export function DashboardNav() {
  const pathname = usePathname();
  return (
    <nav className="grid items-start gap-2">
      {navItems.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
            pathname === item.href && 'bg-primary/10 text-primary font-semibold'
          )}
        >
          <item.icon className="h-4 w-4" />
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
