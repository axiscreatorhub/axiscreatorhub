import Link from "next/link";
import { ArrowRight, Sparkles, Zap, Shield, Globe } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a12] text-white selection:bg-brand-purple/30 overflow-hidden relative">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-blue/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-purple/10 blur-[120px] rounded-full" />

      <main className="relative flex flex-col items-center justify-center pt-48 px-6 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-brand-purple text-xs font-bold uppercase tracking-widest mb-8">
          <Sparkles size={14} /> The AI Operating System for Creators
        </div>
        
        <h1 className="text-6xl md:text-9xl font-black tracking-tighter mb-8 max-w-5xl leading-[0.9]">
          CRAFT YOUR <span className="text-gradient">LEGACY.</span>
        </h1>
        
        <p className="text-zinc-400 text-lg md:text-2xl max-w-3xl mb-12 leading-relaxed">
          Automate your workflow, generate viral content, and manage your brand with the power of Gemini 3.1 AI.
        </p>

        <div className="flex flex-col sm:flex-row gap-6">
          <Link 
            href="/sign-up" 
            className="btn-primary flex items-center gap-2 group"
          >
            Start Creating Free <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link 
            href="/blueprint" 
            className="px-8 py-4 rounded-full bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 transition-all"
          >
            View Blueprint
          </Link>
        </div>
      </main>

      {/* Feature Grid */}
      <section className="relative max-w-7xl mx-auto px-6 py-40 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="glass p-10 rounded-[40px] space-y-6 hover:border-brand-purple/50 transition-all group">
          <div className="w-14 h-14 rounded-2xl bg-brand-purple/10 flex items-center justify-center text-brand-purple group-hover:scale-110 transition-transform">
            <Zap size={28} />
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-2">AI Content Engine</h3>
            <p className="text-zinc-400 leading-relaxed">Generate viral hooks, scripts, and captions in seconds tailored to your unique voice.</p>
          </div>
        </div>

        <div className="glass p-10 rounded-[40px] space-y-6 hover:border-brand-blue/50 transition-all group">
          <div className="w-14 h-14 rounded-2xl bg-brand-blue/10 flex items-center justify-center text-brand-blue group-hover:scale-110 transition-transform">
            <Globe size={28} />
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-2">Smart Media Kits</h3>
            <p className="text-zinc-400 leading-relaxed">Live-updating media kits that showcase your best work and real-time stats to brands.</p>
          </div>
        </div>

        <div className="glass p-10 rounded-[40px] space-y-6 hover:border-brand-pink/50 transition-all group">
          <div className="w-14 h-14 rounded-2xl bg-brand-pink/10 flex items-center justify-center text-brand-pink group-hover:scale-110 transition-transform">
            <Shield size={28} />
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-2">Brand Outreach</h3>
            <p className="text-zinc-400 leading-relaxed">AI-crafted pitch emails that actually get opened. Integrated with Resend for delivery.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-white/5 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-2xl font-black tracking-tighter text-gradient">AXIS</div>
          <div className="flex gap-8 text-sm text-zinc-500">
            <Link href="/blueprint" className="hover:text-white transition-colors">Blueprint</Link>
            <Link href="/sign-in" className="hover:text-white transition-colors">Sign In</Link>
            <Link href="/sign-up" className="hover:text-white transition-colors">Sign Up</Link>
          </div>
          <div className="text-xs text-zinc-600 font-mono uppercase tracking-widest">
            © 2026 AXIS CREATOR HUB AI
          </div>
        </div>
      </footer>
    </div>
  );
}
