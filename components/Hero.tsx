import React, { useState, useEffect } from 'react';

interface HeroProps {
  isNexus?: boolean;
}

const Hero: React.FC<HeroProps> = ({ isNexus = false }) => {
  const [hasKey, setHasKey] = useState(false);

  useEffect(() => {
    const checkKey = async () => {
      // @ts-ignore
      if (window.aistudio && await window.aistudio.hasSelectedApiKey()) {
        setHasKey(true);
      }
    };
    checkKey();
  }, []);

  const handleConnect = async () => {
    // @ts-ignore
    if (window.aistudio) {
      // @ts-ignore
      await window.aistudio.openSelectKey();
      setHasKey(true);
    }
  };

  return (
    <section className="pt-64 pb-48 px-6 bg-[#020617] relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-[1200px] h-[1200px] bg-indigo-500/10 rounded-full blur-[200px] opacity-40 animate-pulse"></div>
      
      <div className="max-w-7xl mx-auto text-center relative z-10">
        <div className="inline-flex items-center gap-3 px-8 py-3.5 mb-14 rounded-full os-badge text-indigo-400 font-black text-[10px] uppercase tracking-[0.6em] backdrop-blur-3xl border border-white/10">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-ping"></span>
          FACELESS DIGITAL LIFE • ELITE INFLUENCER HUB
        </div>
        
        <h1 className="text-7xl md:text-[9rem] font-black mb-14 tracking-tighter leading-[0.8] text-white outfit uppercase italic">
          Tools for <br />
          <span className="text-gradient">The Elite.</span>
        </h1>
        
        <p className="text-xl md:text-3xl text-slate-400 mb-20 max-w-5xl mx-auto leading-relaxed font-medium">
          Equipping the world's most ambitious influencers with digital marketing blueprints and cinematic visual assets. <br />
          <span className="text-white font-black uppercase tracking-widest text-[10px] opacity-60 mt-4 block">Strategic Intelligence • Content Automation • Professional Authority</span>
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
          <a href="#hub" className="w-full sm:w-auto px-16 py-8 bg-white text-slate-950 rounded-[2.5rem] font-black text-[13px] transition-all hover:scale-105 hover:shadow-[0_20px_60px_rgba(255,255,255,0.2)] uppercase tracking-[0.4em] active:scale-95">
            Launch Platform
          </a>
          {!hasKey ? (
            <button 
              onClick={handleConnect}
              className="w-full sm:w-auto px-16 py-8 border border-white/10 bg-white/5 text-white rounded-[2.5rem] font-black text-[13px] transition-all hover:bg-white/10 hover:border-indigo-500/30 uppercase tracking-[0.4em] flex items-center justify-center gap-4 active:scale-95"
            >
              <span className="text-xl">🔑</span>
              Connect API Node
            </button>
          ) : (
            <div className="px-12 py-8 bg-indigo-500/10 border border-indigo-500/30 rounded-[2.5rem] text-indigo-400 text-[10px] font-black uppercase tracking-widest">
              Live Intelligence Sync Active
            </div>
          )}
        </div>
        
        <div className="mt-48 pt-24 border-t border-white/5 opacity-40">
           <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.8em] mb-12">Global Distribution Partners</p>
           <div className="flex flex-wrap items-center justify-center gap-16 grayscale invert brightness-200">
             <img src="https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg" alt="Instagram" className="h-8" />
             <img src="https://upload.wikimedia.org/wikipedia/commons/b/b8/YouTube_Logo_2017.svg" alt="YouTube" className="h-6" />
             <img src="https://upload.wikimedia.org/wikipedia/commons/4/4e/TikTok_logo.svg" alt="TikTok" className="h-8" />
             <img src="https://upload.wikimedia.org/wikipedia/commons/c/ce/X_logo_2023.svg" alt="X" className="h-7" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;