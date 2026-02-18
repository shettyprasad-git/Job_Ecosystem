'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Bookmark,
  Settings,
  Mail,
  ListChecks,
  Rocket,
  Lock,
} from 'lucide-react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const navLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/saved', label: 'Saved', icon: Bookmark },
  { href: '/digest', label: 'Digest', icon: Mail },
  { href: '/settings', label: 'Preferences', icon: Settings },
  { href: '/proof', label: 'Tests', icon: ListChecks },
];

const totalTests = 10; // Number of items in the checklist on the proof page

export function Nav({ isMobile = false }: { isMobile?: boolean }) {
  const pathname = usePathname();
  const [savedJobs] = useLocalStorage<string[]>('kodnest_saved_jobs', []);
  const [checkedState] = useLocalStorage<Record<string, boolean>>(
    'kodnest_test_checklist',
    {}
  );

  const passedTestCount = Object.values(checkedState).filter(Boolean).length;
  const allTestsPassed = passedTestCount === totalTests;

  const shipLink = {
    href: '/ship',
    label: 'Ship',
    icon: allTestsPassed ? Rocket : Lock,
  };

  return (
    <TooltipProvider>
      <nav
        className={cn(
          'flex items-center gap-1',
          isMobile && 'flex-col gap-y-2 items-start w-full'
        )}
      >
        {navLinks.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-2 text-sm font-bold transition-colors',
                isMobile
                  ? `w-full text-base rounded-lg px-4 py-2 ${
                      isActive
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                    }`
                  : `px-3 py-2 border-b-2 ${
                      isActive
                        ? 'border-red-600 text-red-600'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`
              )}
            >
              <Icon size={16} />
              {label}
              {label === 'Saved' && (
                <span className="ml-auto bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded text-[10px]">
                  {savedJobs.length}
                </span>
              )}
            </Link>
          );
        })}

        {/* Ship Link */}
        <Tooltip>
          <TooltipTrigger asChild>
            <div className={cn(!allTestsPassed && 'cursor-not-allowed')}>
              <Link
                href={allTestsPassed ? shipLink.href : '#'}
                className={cn(
                  'flex items-center gap-2 text-sm font-bold transition-colors',
                  isMobile
                    ? `w-full text-base rounded-lg px-4 py-2 ${
                        pathname === shipLink.href
                          ? 'text-blue-600 bg-blue-50'
                          : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                      }`
                    : `px-3 py-2 border-b-2 ${
                        pathname === shipLink.href
                          ? 'border-red-600 text-red-600'
                          : 'border-transparent text-slate-500 hover:text-slate-800'
                      }`,
                  !allTestsPassed && 'pointer-events-none text-slate-400'
                )}
                aria-disabled={!allTestsPassed}
                tabIndex={!allTestsPassed ? -1 : undefined}
              >
                <shipLink.icon size={16} />
                {shipLink.label}
              </Link>
            </div>
          </TooltipTrigger>
          {!allTestsPassed && !isMobile && (
            <TooltipContent>
              <p>Complete all tests to unlock.</p>
            </TooltipContent>
          )}
        </Tooltip>
      </nav>
    </TooltipProvider>
  );
}
