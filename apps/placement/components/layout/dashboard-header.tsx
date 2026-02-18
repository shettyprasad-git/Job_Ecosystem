import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Menu, Rocket } from 'lucide-react';
import { navItems } from './dashboard-nav-items';

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background px-4 sm:justify-end sm:px-6">
       <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline" className="sm:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="sm:max-w-xs">
              <nav className="grid gap-6 text-lg font-medium">
                <Link
                  href="/"
                  className="group flex h-16 shrink-0 items-center gap-2 px-4 font-semibold"
                >
                  <Rocket className="h-6 w-6 text-primary transition-all group-hover:scale-110" />
                  <span>Placement Prep</span>
                </Link>
                {navItems.map((item) => (
                    <Link
                        key={item.label}
                        href={item.href}
                        className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                    >
                        <item.icon className="h-5 w-5" />
                        {item.label}
                    </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
      
      <div className="flex items-center gap-4">
        <Avatar className="h-9 w-9">
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
