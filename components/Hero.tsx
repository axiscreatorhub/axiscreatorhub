import React, { useState, useEffect } from 'react';

const Hero: React.FC = () => {
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

  return (
    <section className="pt-64 pb-48 px-6 bg-[#020617] relative overflow-hidden">
      {/* Social Energy Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[1200px] h-[1200px] bg-pink-500/10 rounded-full blur-[200px] opacity-20 animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[800px] h-[800px] bg-violet-500/10 rounded-full blur-[200px] opacity-20 animate-pulse [animation-delay:2s]"></div>
      
      <div className="max-w-7xl mx-auto text-center relative z-10">
        <div className="inline-flex items-center gap-3 px-8 py-3.5 mb-14 rounded-full axis-badge text-pink-400 font-black text-[10px] uppercase tracking-[0.6em] backdrop-blur-3xl border border-white/10">
          <span className="w-2.5 h-2.5 rounded-full bg-pink-500 animate-ping"></span>
          FOR TIKTOK • INSTA • YOUTUBE • YOU
        </div>
        
        <h1 className="text-7xl md:text-[9.5rem] font-black mb-14 tracking-tighter leading-[0.8] text-white outfit uppercase italic">
          Fun. Fast. <br />
          <span className="text-gradient">Viral.</span>
        </h1>
        
        <p className="text-xl md:text-3xl text-slate-400 mb-20 max-w-5xl mx-auto leading-relaxed font-medium">
          The all-in-one social media hub for <span className="text-white">Modern Creators</span>. <br />
          AXIS turns your wildest ideas into viral content in seconds. No tech stress, just pure flow.
          <span className="text-white font-black uppercase tracking-widest text-[10px] opacity-40 mt-6 block italic">Powered by Google Gemini 3 Pro • Your Content, Supercharged</span>
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
          <a href="#hub" className="w-full sm:w-auto px-16 py-8 bg-white text-slate-950 rounded-[2.5rem] font-black text-[13px] transition-all hover:scale-105 hover:shadow-[0_20px_60px_rgba(255,255,255,0.2)] uppercase tracking-[0.4em] active:scale-95">
            Start Manifesting
          </a>
          <a href="#vsl" className="w-full sm:w-auto px-16 py-8 border border-white/10 bg-white/5 text-white rounded-[2.5rem] font-black text-[13px] transition-all hover:bg-white/10 uppercase tracking-[0.4em] flex items-center justify-center gap-4 active:scale-95">
            Quick Tutorial
          </a>
        </div>
        
        <div className="mt-48 pt-24 border-t border-white/5 opacity-40">
           <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.8em] mb-12">One Hub. Every Platform.</p>
           <div className="flex flex-wrap items-center justify-center gap-16 grayscale brightness-200">
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