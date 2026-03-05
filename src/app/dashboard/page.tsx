import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getBalance } from "@/lib/credits";
import { 
  Zap, 
  FileText, 
  Image as ImageIcon, 
  Video, 
  ArrowRight,
  TrendingUp,
  Users,
  Eye
} from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const { userId: clerkId } = await auth();

  if (!clerkId) {
    redirect("/sign-in");
  }

  const user = await prisma.user.findUnique({
    where: { clerkId },
    include: {
      scripts: { orderBy: { createdAt: 'desc' }, take: 3 },
      assets: { orderBy: { createdAt: 'desc' }, take: 3 },
    }
  });

  if (!user) {
    redirect("/sign-in");
  }

  const balance = await getBalance(user.id);

  const stats = [
    { name: 'Total Scripts', value: user.scripts.length, icon: FileText, color: 'text-brand-purple' },
    { name: 'Assets Generated', value: user.assets.length, icon: ImageIcon, color: 'text-brand-blue' },
    { name: 'Credit Balance', value: balance, icon: Zap, color: 'text-brand-orange' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-12">
      <header>
        <h1 className="text-4xl font-black tracking-tighter text-white mb-2">Welcome back, Creator</h1>
        <p className="text-zinc-400">Here's what's happening with your brand today.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="glass p-8 rounded-3xl border-white/5 hover:border-white/10 transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center ${stat.color} group-hover:scale-110 transition-transform`}>
                <stat.icon size={24} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Last 30 Days</span>
            </div>
            <p className="text-zinc-400 text-sm font-medium mb-1">{stat.name}</p>
            <h3 className="text-3xl font-black text-white">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Scripts */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <FileText className="text-brand-purple" /> Recent Scripts
            </h2>
            <Link href="/dashboard/scripts" className="text-sm text-brand-purple font-bold flex items-center gap-1 hover:underline">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          
          <div className="space-y-4">
            {user.scripts.length > 0 ? (
              user.scripts.map((script) => (
                <div key={script.id} className="glass p-6 rounded-2xl border-white/5 flex items-center justify-between group hover:bg-white/[0.02] transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-brand-purple/10 flex items-center justify-center text-brand-purple">
                      <FileText size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-white truncate max-w-[200px]">{script.topic}</h4>
                      <p className="text-xs text-zinc-500">{new Date(script.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right hidden sm:block">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Viral Score</p>
                      <p className="text-sm font-black text-brand-purple">{script.viralScore}%</p>
                    </div>
                    <button className="p-2 rounded-lg bg-white/5 text-zinc-400 hover:text-white transition-all">
                      <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="glass p-12 rounded-3xl border-dashed border-white/10 text-center">
                <p className="text-zinc-500 text-sm">No scripts generated yet.</p>
                <Link href="/dashboard/scripts" className="text-brand-purple text-sm font-bold mt-2 inline-block hover:underline">
                  Create your first script
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions / Media Kit Stats */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <TrendingUp className="text-brand-blue" /> Media Kit Stats
          </h2>
          <div className="glass p-8 rounded-[40px] border-brand-blue/10 space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-blue/10 flex items-center justify-center text-brand-blue">
                  <Eye size={20} />
                </div>
                <span className="text-sm font-bold text-zinc-300">Profile Views</span>
              </div>
              <span className="text-xl font-black text-white">0</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-pink/10 flex items-center justify-center text-brand-pink">
                  <Users size={20} />
                </div>
                <span className="text-sm font-bold text-zinc-300">Brand Clicks</span>
              </div>
              <span className="text-xl font-black text-white">0</span>
            </div>
            
            <div className="pt-4 border-t border-white/5">
              <Link 
                href="/dashboard/media-kit"
                className="w-full py-4 rounded-2xl bg-brand-blue text-white text-sm font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all"
              >
                Customize Media Kit
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
