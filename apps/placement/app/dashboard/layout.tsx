import { DashboardHeader } from '@/components/layout/dashboard-header';
import { DashboardSidebar } from '@/components/layout/dashboard-sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full bg-background">
      <DashboardSidebar />
      <div className="flex flex-col flex-1">
        <DashboardHeader />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
