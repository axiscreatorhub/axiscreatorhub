import React, { useState } from 'react';

const VSL: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      title: "Step 01: Connect Your Vibe",
      label: "SYNCING",
      desc: "Tap to link your AXIS Hub. It's like plugging into a Hollywood studio that fits in your pocket. Quick, secure, and ready to go.",
      image: "https://images.unsplash.com/photo-1616469829581-73993eb86b02?auto=format&fit=crop&q=80&w=1200",
      icon: "⚡",
      feature: "Instant Vibe Sync"
    },
    {
      title: "Step 02: Pick Your Platform",
      label: "CHOOSING",
      desc: "TikTok? Insta? YouTube? Pick your target and AXIS automatically adjusts the vibe, the sounds, and the look for maximum engagement.",
      image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=1200",
      icon: "📱",
      feature: "Smart Platform Logic"
    },
    {
      title: "Step 03: Make Some Magic",
      label: "MANIFESTING",
      desc: "Describe your idea in plain English. 'A neon sunset transition' or 'Me dancing in Paris'. AXIS manifests it into reality instantly.",
      image: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=1200",
      icon: "✨",
      feature: "AI Magic Engine"
    },
    {
      title: "Step 04: Drop It & Go Viral",
      label: "DEPLOYING",
      desc: "Satisfied? Share directly to your social feeds with one tap. AXIS even handles the captions and tags so you can just enjoy the comments.",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1200",
      icon: "🚀",
      feature: "1-Tap Viral Drop"
    }
  ];

  return (
    <section id="vsl" className="py-48 px-6 bg-[#020617] relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-pink-600/5 blur-[200px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-24">
          <div className="inline-flex items-center gap-3 px-6 py-2.5 mb-10 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.5em] text-pink-400">
            <span className="w-2 h-2 rounded-full bg-pink-400 animate-pulse"></span>
            AXIS CREATOR MASTERCLASS
          </div>
          <h2 className="text-6xl md:text-[8rem] font-black mb-8 tracking-tighter italic outfit uppercase leading-[0.85] text-white">
            Simple. <span className="text-gradient">Invigorating.</span>
          </h2>
          <p className="text-slate-400 text-2xl max-w-3xl mx-auto font-medium leading-relaxed">
            Will you know how to use it? <br/>
            <span className="text-white">Absolutely.</span> We built AXIS to be as fun as your favorite game and as intuitive as a simple swipe.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-4 space-y-4">
            {steps.map((step, idx) => (
              <button
                key={idx}
                onClick={() => setActiveStep(idx)}
                className={`w-full text-left p-8 rounded-[2.5rem] transition-all border group relative overflow-hidden ${activeStep === idx ? 'bg-white border-white shadow-2xl scale-105' : 'bg-white/5 border-white/10 opacity-40 hover:opacity-100'}`}
              >
                <div className="flex items-center gap-6 relative z-10">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-lg transition-transform ${activeStep === idx ? 'bg-pink-600 text-white' : 'bg-white/10 text-white'}`}>
                    {step.icon}
                  </div>
                  <div>
                    <div className={`text-[9px] font-black uppercase tracking-widest mb-1 ${activeStep === idx ? 'text-pink-600' : 'text-slate-500'}`}>
                      {step.label}
                    </div>
                    <div className={`text-lg font-black outfit italic uppercase tracking-tight ${activeStep === idx ? 'text-slate-900' : 'text-white'}`}>
                      {step.title}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="lg:col-span-8">
            <div className="relative aspect-video rounded-[5rem] overflow-hidden bg-white/5 border border-white/10 shadow-[0_60px_120px_-30px_rgba(0,0,0,0.8)] group">
              <img 
                src={steps[activeStep].image} 
                className="absolute inset-0 w-full h-full object-cover opacity-60 transition-all duration-[2000ms] group-hover:scale-110" 
                alt="System Step" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/40 to-transparent"></div>
              
              <div className="absolute bottom-0 left-0 w-full p-16 md:p-24">
                <div className="max-w-2xl">
                  <div className="flex items-center gap-4 mb-6">
                    <span className="px-5 py-2 bg-pink-600 rounded-full text-white text-[10px] font-black uppercase tracking-widest shadow-lg">
                      {steps[activeStep].feature}
                    </span>
                  </div>
                  <h3 className="text-4xl md:text-5xl font-black text-white mb-6 outfit italic uppercase tracking-tighter leading-tight">
                    {steps[activeStep].title}
                  </h3>
                  <p className="text-slate-300 text-xl font-medium leading-relaxed opacity-90">
                    {steps[activeStep].desc}
                  </p>
                  
                  <div className="mt-12 flex items-center gap-10">
                    <button 
                      onClick={() => setActiveStep((activeStep + 1) % steps.length)}
                      className="px-10 py-5 bg-white text-slate-950 rounded-2xl font-black text-[12px] uppercase tracking-widest hover:scale-105 transition-transform shadow-2xl"
                    >
                      Next Step
                    </button>
                    <div className="flex gap-2">
                       {steps.map((_, i) => (
                         <div key={i} className={`w-8 h-1 rounded-full transition-all ${activeStep === i ? 'bg-pink-500' : 'bg-white/20'}`}></div>
                       ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VSL;