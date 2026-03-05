import { Sidebar } from '@/components/dashboard/Sidebar';
import { Topbar } from '@/components/dashboard/Topbar';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  return (
    <div className="min-h-screen bg-[#0a0a12]">
      <Sidebar />
      <div className="pl-64">
        <Topbar />
        <main className="pt-20 min-h-screen">
          <div className="p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
