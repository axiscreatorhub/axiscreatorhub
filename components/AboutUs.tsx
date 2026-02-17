
import React from 'react';

const AboutUs: React.FC = () => {
  const values = [
    {
      title: "Precision Performance",
      desc: "In an era of high-speed trends, Faceless Digital Life prioritizes world-class results. Our tools help you grow sustainably.",
      icon: "✨"
    },
    {
      title: "Productive Play",
      desc: "Creation is a joy. The AXIS OS handles the friction, letting you stay in the flow state longer with AI-driven automation.",
      icon: "🎮"
    },
    {
      title: "Unified Control",
      desc: "Maintain your vision across the digital landscape. One hub, pulsed everywhere, managed through our high-tier command center.",
      icon: "🌐"
    }
  ];

  return (
    <section id="about" className="py-32 bg-white relative overflow-hidden">
      {/* Soft decorative elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-50/50 rounded-full nebula-blur -mr-64 -mt-32"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-pink-50/50 rounded-full nebula-blur -ml-48 -mb-24"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row gap-20 items-center">
          <div className="lg:w-1/2">
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-slate-50 border border-slate-100 text-[10px] font-black uppercase tracking-[0.3em] text-violet-500">
              Our Core Manifesto
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-slate-900 mb-8 leading-[1.1] tracking-tight">
              Faceless Digital Life: <br/><span className="text-transparent bg-clip-text meta-gradient italic serif">The Creator</span> Experience.
            </h2>
            <p className="text-lg text-slate-500 font-medium leading-relaxed mb-10 max-w-xl">
              Faceless Digital Life was born from a realization: world-class marketing tools should be accessible to all focused creators. We've built the definitive unified hub to empower influencers with an integrated AI toolset.
            </p>
            
            <div className="space-y-10">
              {values.map((val, i) => (
                <div key={i} className="flex gap-6 group">
                  <div className="w-14 h-14 rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-center text-2xl group-hover:scale-110 group-hover:bg-white group-hover:shadow-xl transition-all duration-500">
                    {val.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-black text-slate-900 mb-2 uppercase tracking-wide outfit">{val.title}</h4>
                    <p className="text-slate-500 text-sm leading-relaxed">{val.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:w-1/2 relative">
            <div className="relative aspect-square sm:aspect-video lg:aspect-square rounded-[4rem] overflow-hidden glass-card p-4">
              <div className="absolute inset-0 bg-violet-600/5 mix-blend-multiply"></div>
              <img 
                src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200" 
                alt="AXIS Interface" 
                className="w-full h-full object-cover rounded-[3.5rem] shadow-inner"
              />
              {/* Floating UI Elements for aesthetic */}
              <div className="absolute top-12 -left-8 bg-white/90 backdrop-blur-xl p-6 rounded-3xl shadow-2xl border border-slate-100 animate-bounce-slow">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">Live Pulse Sync</span>
                </div>
              </div>
              <div className="absolute bottom-20 -right-8 bg-white/90 backdrop-blur-xl p-6 rounded-3xl shadow-2xl border border-slate-100 animate-pulse-soft">
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-violet-500">Growth Stats</span>
                  <div className="flex gap-1">
                    <div className="w-1 h-4 bg-violet-200 rounded-full"></div>
                    <div className="w-1 h-6 bg-violet-300 rounded-full"></div>
                    <div className="w-1 h-8 bg-violet-500 rounded-full"></div>
                    <div className="w-1 h-5 bg-violet-400 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <style>{`
        .animate-bounce-slow {
          animation: bounce-slow 6s infinite ease-in-out;
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </section>
  );
};

export default AboutUs;
