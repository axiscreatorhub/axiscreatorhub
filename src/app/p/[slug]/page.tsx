import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { 
  Instagram, 
  Twitter, 
  Youtube, 
  Globe, 
  Mail, 
  TrendingUp, 
  Users, 
  Eye,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";

export default async function PublicMediaKitPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const profile = await prisma.brandProfile.findUnique({
    where: { slug },
    include: { mediaKit: true },
  });

  if (!profile || !profile.mediaKit?.isPublic) {
    notFound();
  }

  // Increment view count
  await prisma.mediaKit.update({
    where: { id: profile.mediaKit.id },
    data: { viewCount: { increment: 1 } },
  });

  const stats = JSON.parse(profile.stats || "{}");
  const links = JSON.parse(profile.links || "[]");
  const theme = profile.mediaKit.theme;

  return (
    <div className={cn(
      "min-h-screen py-20 px-6",
      theme === 'MODERN' ? "bg-[#0a0a12] text-white" :
      theme === 'MINIMAL' ? "bg-white text-black" :
      "bg-brand-pink text-white"
    )}>
      <div className="max-w-4xl mx-auto space-y-16">
        {/* Header */}
        <header className="text-center space-y-6">
          <div className={cn(
            "w-32 h-32 rounded-full mx-auto border-4",
            theme === 'MODERN' ? "bg-brand-purple/20 border-brand-purple/30" :
            theme === 'MINIMAL' ? "bg-zinc-100 border-zinc-200" :
            "bg-white/20 border-white/30"
          )} />
          <div className="space-y-2">
            <h1 className="text-5xl font-black tracking-tighter">{profile.name}</h1>
            <p className={cn(
              "text-xl font-medium",
              theme === 'MODERN' ? "text-brand-purple" :
              theme === 'MINIMAL' ? "text-zinc-500" :
              "text-white/80"
            )}>{profile.niche}</p>
          </div>
          <p className={cn(
            "max-w-2xl mx-auto text-lg leading-relaxed",
            theme === 'MODERN' ? "text-zinc-400" :
            theme === 'MINIMAL' ? "text-zinc-600" :
            "text-white/90"
          )}>
            {profile.bio}
          </p>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className={cn(
            "p-8 rounded-[32px] text-center space-y-2",
            theme === 'MODERN' ? "bg-white/5 border border-white/10" :
            theme === 'MINIMAL' ? "bg-zinc-50 border border-zinc-100" :
            "bg-white/10 border border-white/20"
          )}>
            <Users className="mx-auto mb-2 opacity-50" size={24} />
            <p className="text-sm font-bold uppercase tracking-widest opacity-50">Total Reach</p>
            <h3 className="text-3xl font-black">{stats.totalReach || '0'}</h3>
          </div>
          <div className={cn(
            "p-8 rounded-[32px] text-center space-y-2",
            theme === 'MODERN' ? "bg-white/5 border border-white/10" :
            theme === 'MINIMAL' ? "bg-zinc-50 border border-zinc-100" :
            "bg-white/10 border border-white/20"
          )}>
            <TrendingUp className="mx-auto mb-2 opacity-50" size={24} />
            <p className="text-sm font-bold uppercase tracking-widest opacity-50">Engagement</p>
            <h3 className="text-3xl font-black">{stats.engagement || '0%'}</h3>
          </div>
          <div className={cn(
            "p-8 rounded-[32px] text-center space-y-2",
            theme === 'MODERN' ? "bg-white/5 border border-white/10" :
            theme === 'MINIMAL' ? "bg-zinc-50 border border-zinc-100" :
            "bg-white/10 border border-white/20"
          )}>
            <Zap className="mx-auto mb-2 opacity-50" size={24} />
            <p className="text-sm font-bold uppercase tracking-widest opacity-50">Avg Views</p>
            <h3 className="text-3xl font-black">{stats.avgViews || '0'}</h3>
          </div>
        </div>

        {/* Social Links */}
        <div className="flex flex-wrap justify-center gap-4">
          {links.map((link: any, i: number) => (
            <a 
              key={i}
              href={link.url}
              target="_blank"
              className={cn(
                "px-8 py-4 rounded-2xl font-bold flex items-center gap-3 transition-all",
                theme === 'MODERN' ? "bg-brand-purple text-white hover:opacity-90" :
                theme === 'MINIMAL' ? "bg-black text-white hover:bg-zinc-800" :
                "bg-white text-brand-pink hover:bg-white/90"
              )}
            >
              {link.platform === 'Instagram' && <Instagram size={20} />}
              {link.platform === 'Twitter' && <Twitter size={20} />}
              {link.platform === 'Youtube' && <Youtube size={20} />}
              {link.platform === 'Website' && <Globe size={20} />}
              {link.label || link.platform}
            </a>
          ))}
          <a 
            href={`mailto:${profile.userId}`} // Mock email
            className={cn(
              "px-8 py-4 rounded-2xl font-bold flex items-center gap-3 transition-all border",
              theme === 'MODERN' ? "border-white/10 text-white hover:bg-white/5" :
              theme === 'MINIMAL' ? "border-zinc-200 text-black hover:bg-zinc-50" :
              "border-white/20 text-white hover:bg-white/10"
            )}
          >
            <Mail size={20} />
            Contact Me
          </a>
        </div>

        {/* Footer */}
        <footer className="text-center pt-20">
          <p className="text-xs font-bold uppercase tracking-widest opacity-30">
            Powered by AXIS Creator Hub AI
          </p>
        </footer>
      </div>
    </div>
  );
}
