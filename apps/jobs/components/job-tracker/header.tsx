'use client';

import { Menu, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import Link from 'next/link';
import { Nav } from './nav';

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 h-16 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <Link href="/" className="flex items-center gap-2 cursor-pointer">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black italic">K</div>
          <span className="font-black text-xl tracking-tight text-slate-900 hidden md:inline">KodNest</span>
        </Link>
        <div className="hidden md:flex">
          <Nav />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative p-2 text-slate-400 hover:text-slate-600 h-8 w-8">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
        </Button>
        <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300" />
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-600">
                <Menu />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] p-6 pt-12 bg-white">
              <SheetHeader className="sr-only">
                <SheetTitle>Navigation Menu</SheetTitle>
              </SheetHeader>
              <Nav isMobile />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
