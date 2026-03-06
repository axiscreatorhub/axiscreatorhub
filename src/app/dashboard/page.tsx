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
  Eye,
  Sparkles,
  PenTool,
  Rocket,
  Plus
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default async function DashboardPage() {
  const { userId: clerkId } = await auth();

  if (!clerkId) {
    redirect("/sign-in");
  }

  const user = await prisma.user.findUnique({
    where: { clerkId },
    include: {
      scripts: { orderBy: { createdAt: 'desc' }, take: 4 },
      assets: { orderBy: { createdAt: 'desc' }, take: 4 },
    }
  });

  if (!user) {
    redirect("/sign-in");
  }

  const balance = await getBalance(user.id);

  const quickTools = [
    {
      name: 'AI Image',
      description: 'Generate stunning visuals',
      href: '/dashboard/images',
      icon: ImageIcon,
      color: 'text-brand-blue',
      bg: 'bg-brand-blue/10',
      border: 'border-brand-blue/20'
    },
    {
      name: 'Reel Script',
      description: 'Viral short-form scripts',
      href: '/dashboard/scripts',
      icon: Video,
      color: 'text-brand-purple',
      bg: 'bg-brand-purple/10',
      border: 'border-brand-purple/20'
    },
    {
      name: 'Writing Tool',
      description: 'Captions & blog posts',
      href: '/dashboard/writing',
      icon: PenTool,
      color: 'text-brand-orange',
      bg: 'bg-brand-orange/10',
      border: 'border-brand-orange/20'
    },
    {
      name: 'Media Kit',
      description: 'Professional brand pitch',
      href: '/dashboard/media-kit',
      icon: Users,
      color: 'text-brand-pink',
      bg: 'bg-brand-pink/10',
      border: 'border-brand-pink/20'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-white mb-2">Welcome back, Creator</h1>
          <p className="text-zinc-400">Your creative engine is ready. What are we building today?</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="glass px-6 py-3 rounded-2xl border-white/5 flex items-center gap-3">
            <Zap size={18} className="text-brand-orange fill-brand-orange" />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Balance</p>
              <p className="text-lg font-black text-white">{balance.toLocaleString()}</p>
            </div>
          </div>
          <Link 
            href="/pricing"
            className="bg-brand-purple text-white px-6 py-3 rounded-2xl font-bold text-sm hover:opacity-90 transition-all flex items-center gap-2"
          >
            <Plus size={18} /> Top Up
          </Link>
        </div>
      </header>

      {/* Quick Tools Grid */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold flex items-center gap-3">
          <Sparkles className="text-brand-purple" size={20} /> Quick Start
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickTools.map((tool) => (
            <Link 
              key={tool.name} 
              href={tool.href}
              className={cn(
                "glass p-6 rounded-[32px] border-white/5 hover:border-white/10 transition-all group relative overflow-hidden",
                tool.border
              )}
            >
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110", tool.bg, tool.color)}>
                <tool.icon size={24} />
              </div>
              <h3 className="text-lg font-bold text-white mb-1">{tool.name}</h3>
              <p className="text-xs text-zinc-500">{tool.description}</p>
              <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                <ArrowRight size={18} className={tool.color} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Recent Activity */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold flex items-center gap-3">
              <Rocket className="text-brand-blue" size={20} /> Recent Activity
            </h2>
            <Link href="/dashboard/scripts" className="text-xs text-zinc-500 font-bold flex items-center gap-1 hover:text-white transition-colors">
              View All <ArrowRight size={12} />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {user.scripts.length > 0 || user.assets.length > 0 ? (
              <>
                {user.scripts.map((script) => (
                  <div key={script.id} className="glass p-5 rounded-2xl border-white/5 flex items-center justify-between group hover:bg-white/[0.02] transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-brand-purple/10 flex items-center justify-center text-brand-purple">
                        <FileText size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-sm truncate max-w-[200px]">{script.topic}</h4>
                        <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Script • {new Date(script.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right hidden sm:block">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-0.5">Viral Score</p>
                        <p className="text-xs font-black text-brand-purple">{script.viralScore}%</p>
                      </div>
                      <Link href={`/dashboard/scripts`} className="p-2 rounded-lg bg-white/5 text-zinc-400 hover:text-white transition-all">
                        <ArrowRight size={16} />
                      </Link>
                    </div>
                  </div>
                ))}
                {user.assets.map((asset) => (
                  <div key={asset.id} className="glass p-5 rounded-2xl border-white/5 flex items-center justify-between group hover:bg-white/[0.02] transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-brand-blue/10 flex items-center justify-center text-brand-blue">
                        <ImageIcon size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-sm truncate max-w-[200px]">{asset.prompt}</h4>
                        <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Image • {new Date(asset.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <Link href={`/dashboard/images`} className="p-2 rounded-lg bg-white/5 text-zinc-400 hover:text-white transition-all">
                        <ArrowRight size={16} />
                      </Link>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <div className="glass p-12 rounded-[40px] border-dashed border-white/10 text-center flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 text-zinc-600">
                  <Plus size={32} />
                </div>
                <p className="text-zinc-500 text-sm font-medium">No creations yet. Start your journey today!</p>
                <Link href="/dashboard/ai-assistant" className="text-brand-purple text-xs font-bold mt-4 uppercase tracking-widest hover:underline">
                  Open AI Studio
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Media Kit Stats */}
        <div className="space-y-8">
          <h2 className="text-xl font-bold flex items-center gap-3">
            <TrendingUp className="text-brand-pink" size={20} /> Performance
          </h2>
          <div className="glass p-8 rounded-[40px] border-white/5 space-y-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-pink/5 blur-3xl rounded-full -mr-16 -mt-16" />
            
            <div className="space-y-6">
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
            </div>
            
            <div className="pt-6 border-t border-white/5">
              <Link 
                href="/dashboard/media-kit"
                className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-white text-sm font-bold flex items-center justify-center gap-2 hover:bg-white/10 transition-all"
              >
                Manage Media Kit
              </Link>
            </div>
          </div>

          <div className="glass p-8 rounded-[40px] border-white/5 bg-gradient-to-br from-brand-purple/20 to-transparent">
            <h4 className="text-white font-bold mb-2">Pro Tip</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Complete your Brand Kit to get more personalized AI generations that match your unique voice.
            </p>
            <Link href="/dashboard/brand-kit" className="text-brand-purple text-[10px] font-bold uppercase tracking-widest mt-4 inline-block hover:underline">
              Setup Brand Kit →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
