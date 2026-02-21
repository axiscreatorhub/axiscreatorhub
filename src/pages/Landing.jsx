import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Rocket, 
  Zap, 
  Shield, 
  CheckCircle2, 
  ArrowRight, 
  Instagram, 
  Youtube, 
  TrendingUp,
  Layout,
  Cpu
} from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Zap className="w-6 h-6 text-pink-500" />,
      title: "Viral Hook Engine",
      description: "Generate scroll-stopping hooks tailored to your niche in seconds using advanced AI."
    },
    {
      icon: <Layout className="w-6 h-6 text-violet-500" />,
      title: "Content OS",
      description: "A unified operating system to manage your Reels, Shorts, and Brand Deals without the chaos."
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-emerald-500" />,
      title: "Performance Analytics",
      description: "Track what works and scale your brand identity with data-driven insights."
    },
    {
      icon: <Shield className="w-6 h-6 text-blue-500" />,
      title: "Brand Deal Tracker",
      description: "Manage sponsorships, deliverables, and payments in one professional interface."
    }
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-slate-50 selection:bg-pink-500/30">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[#020617]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-pink-500/20">
              <Rocket className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tighter outfit">AXIS</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="/pricing" className="hover:text-white transition-colors">Pricing</a>
            <button 
              onClick={() => navigate('/login')}
              className="bg-white text-black px-6 py-2.5 rounded-full font-bold hover:bg-slate-200 transition-all"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-pink-500/10 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-600/10 blur-[120px] rounded-full"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8"
          >
            <span className="w-2 h-2 bg-pink-500 rounded-full animate-pulse"></span>
            <span className="text-xs font-bold tracking-widest uppercase text-slate-400">The Viral Content OS</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-extrabold tracking-tighter outfit mb-8 leading-[0.9]"
          >
            SCALE YOUR <br />
            <span className="text-gradient">CREATOR BRAND</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            Stop guessing. Start growing. AXIS is the premium operating system for modern creators who want to automate their workflow and dominate the algorithm.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button 
              onClick={() => navigate('/login')}
              className="w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-pink-500 to-violet-600 rounded-2xl font-bold text-lg shadow-xl shadow-pink-500/20 hover:scale-105 transition-all flex items-center justify-center gap-2"
            >
              Start Creating Free <ArrowRight className="w-5 h-5" />
            </button>
            <button 
              onClick={() => navigate('/pricing')}
              className="w-full sm:w-auto px-10 py-5 bg-white/5 border border-white/10 rounded-2xl font-bold text-lg hover:bg-white/10 transition-all"
            >
              View Pricing
            </button>
          </motion.div>

          {/* Social Proof */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-20 pt-20 border-t border-white/5"
          >
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-slate-500 mb-10">Trusted by creators on</p>
            <div className="flex flex-wrap justify-center gap-12 opacity-40 grayscale hover:grayscale-0 transition-all">
              <Instagram className="w-8 h-8" />
              <Youtube className="w-8 h-8" />
              <div className="text-2xl font-black italic">TikTok</div>
              <div className="text-2xl font-black">Twitch</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold outfit mb-4">Everything you need to <span className="text-pink-500">win</span>.</h2>
            <p className="text-slate-400 max-w-xl mx-auto">Built by creators, for creators. We've removed the friction so you can focus on what matters: the content.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((f, i) => (
              <div key={i} className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-pink-500/50 transition-all group">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-32">
        <div className="max-w-5xl mx-auto px-6 bg-gradient-to-br from-pink-500/10 to-violet-600/10 rounded-[3rem] border border-white/10 p-12 md:p-20 text-center relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-bold outfit mb-8 leading-tight">Ready to turn your <br /> passion into a <span className="text-gradient">powerhouse</span>?</h2>
            <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto">Join 2,000+ creators who have scaled their brand identity with AXIS.</p>
            <button 
              onClick={() => navigate('/login')}
              className="px-12 py-6 bg-white text-black rounded-2xl font-bold text-xl hover:scale-105 transition-all shadow-2xl shadow-white/10"
            >
              Get Instant Access
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-violet-600 rounded-lg flex items-center justify-center">
                <Rocket className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tighter outfit">AXIS</span>
            </div>
            <p className="text-slate-500 max-w-xs leading-relaxed">The premium operating system for modern creators. Built in South Africa, scaling globally.</p>
          </div>
          <div>
            <h4 className="font-bold mb-6">Product</h4>
            <ul className="space-y-4 text-slate-500 text-sm">
              <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="/pricing" className="hover:text-white transition-colors">Pricing</a></li>
              <li><a href="/login" className="hover:text-white transition-colors">Login</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6">Legal</h4>
            <ul className="space-y-4 text-slate-500 text-sm">
              <li><a href="/legal/privacy" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="/legal/terms" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="/legal/refunds" className="hover:text-white transition-colors">Refund Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-600 text-xs">© {new Date().getFullYear()} AXIS Creator Hub. Not legal advice. POPIA & GDPR Compliant.</p>
          <div className="flex items-center gap-6 grayscale opacity-50">
            <Shield className="w-5 h-5" />
            <Cpu className="w-5 h-5" />
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
