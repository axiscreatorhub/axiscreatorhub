import React, { useEffect } from 'react';

const Hero: React.FC = () => {
  useEffect(() => {
    const checkKey = async () => {
      if (window.aistudio && await window.aistudio.hasSelectedApiKey()) {
        // Key is active
      }
    };
    checkKey();
  }, []);

  const socialLogos = [
    { name: 'Instagram', url: 'https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg' },
    { name: 'YouTube', url: 'https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_%282017%29.svg' },
    { name: 'TikTok', url: 'https://upload.wikimedia.org/wikipedia/en/a/a9/TikTok_logo.svg' },
    { name: 'X', url: 'https://upload.wikimedia.org/wikipedia/commons/c/ce/X_logo_2023.svg' }
  ];

  return (
    <section className="pt-64 pb-48 px-6 bg-[#020617] relative overflow-hidden">
      {/* Dynamic Background Effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[1200px] h-[1200px] bg-pink-500/10 rounded-full blur-[200px] opacity-20 animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[800px] h-[800px] bg-violet-500/10 rounded-full blur-[200px] opacity-20 animate-pulse [animation-delay:2s]"></div>
      
      <div className="max-w-7xl mx-auto text-center relative z-10">
        <div className="inline-flex items-center gap-3 px-8 py-3.5 mb-14 rounded-full lifestyle-badge text-pink-400 font-black text-[10px] uppercase tracking-[0.6em] backdrop-blur-3xl border border-white/10">
          <span className="w-2.5 h-2.5 rounded-full bg-pink-500 animate-ping"></span>
          REELS • TIKTOK • SHORTS • FACELESS STRATEGY
        </div>
        
        <h1 className="text-7xl md:text-[9.5rem] font-black mb-14 tracking-tighter leading-[0.8] text-white outfit uppercase italic">
          Batch. Hook. <br />
          <span className="text-gradient">Viral.</span>
        </h1>
        
        <p className="text-xl md:text-3xl text-slate-400 mb-20 max-w-5xl mx-auto leading-relaxed font-medium">
          The definitive all-in-one hub for <span className="text-white">AXIS Creators</span>. <br />
          Scale your digital footprint and execute elite faceless content strategies.
          <span className="text-white font-black uppercase tracking-widest text-[10px] opacity-40 mt-6 block italic leading-loose">Powered by Gemini 3 Pro • Your Content Factory, Redefined</span>
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mb-40">
          <a href="#hub" className="w-full sm:w-auto px-16 py-8 bg-white text-slate-950 rounded-[2.5rem] font-black text-[13px] transition-all hover:scale-105 hover:shadow-[0_20px_60px_rgba(255,255,255,0.2)] uppercase tracking-[0.4em] active:scale-95">
            Start Creating
          </a>
          <a href="#vsl" className="w-full sm:w-auto px-16 py-8 border border-white/10 bg-white/5 text-white rounded-[2.5rem] font-black text-[13px] transition-all hover:bg-white/10 uppercase tracking-[0.4em] flex items-center justify-center gap-4 active:scale-95">
            The Method
          </a>
        </div>
        
        <div className="pt-24 border-t border-white/5 relative">
           <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
           <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.8em] mb-16">Optimized For Every Social Platform</p>
           
           <div className="flex flex-wrap items-center justify-center gap-12 md:gap-24">
             {socialLogos.map((logo) => (
               <div key={logo.name} className="group relative flex flex-col items-center">
                 <div className="absolute inset-0 bg-white/5 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                 <img 
                    src={logo.url} 
                    alt={logo.name} 
                    className="h-10 md:h-12 w-auto grayscale brightness-200 opacity-40 group-hover:grayscale-0 group-hover:brightness-100 group-hover:opacity-100 transition-all duration-500 hover:scale-110" 
                 />
                 <span className="mt-4 text-[8px] font-black text-slate-500 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                   {logo.name}
                 </span>
               </div>
             ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;