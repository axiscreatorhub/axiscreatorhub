import { Settings } from 'lucide-react';
import { BillingSettings } from '@/components/dashboard/BillingSettings';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { getBalance } from '@/lib/credits';

export default async function SettingsPage() {
  const { userId: clerkId } = await auth();
  
  const user = await prisma.user.findUnique({
    where: { clerkId: clerkId || '' },
  });

  const balance = user ? await getBalance(user.id) : 0;

  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-12 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
            <Settings className="text-brand-orange" /> Settings
          </h1>
          <p className="text-zinc-400">Manage your account, billing, and preferences.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass p-8 rounded-3xl space-y-6">
          <h3 className="text-xl font-bold">Account Settings</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-sm text-zinc-400">Email Address</span>
              <span className="text-sm font-bold">{user?.email || 'N/A'}</span>
            </div>
            <div className="flex justify-between items-center p-4 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-sm text-zinc-400">Current Plan</span>
              <span className="text-sm font-bold text-brand-purple">Pro Plan</span>
            </div>
          </div>
        </div>

        <BillingSettings currentBalance={balance} />
      </div>
    </div>
  );
}
