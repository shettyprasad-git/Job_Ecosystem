import { LayoutDashboard, Code2, FileCheck, BookCopy, User, History } from 'lucide-react';

export const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/history', label: 'History', icon: History },
  { href: '/dashboard/practice', label: 'Practice', icon: Code2 },
  { href: '/dashboard/assessments', label: 'Assessments', icon: FileCheck },
  { href: '/dashboard/resources', label: 'Resources', icon: BookCopy },
  { href: '/dashboard/profile', label: 'Profile', icon: User },
];
