import React, { useState } from 'react';

const VSL: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [startTime, setStartTime] = useState(0);
  
  // High-fidelity cinematic presentation
  const mainVideoId = "dQw4w9WgXcQ"; 
  const placeholderVideoId = "3fI6V_pQv_M"; 

  const chapters = [
    { title: "The Vision", time: 0, label: "0:00" },
    { title: "AI Manifestation", time: 45, label: "0:45" },
    { title: "Content Engine", time: 120, label: "2:00" },
    { title: "Viral Logic", time: 185, label: "3:05" },
    { title: "Elite Strategy", time: 240, label: "4:00" }
  ];

  const handleJumpTo = (seconds: number) => {
    setStartTime(seconds);
    setIsPlaying(true);
    const player = document.getElementById('vsl-player');
    if (player) {
      player.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <section id="vsl" className="py-32 px-6 bg-slate-50 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-violet-100/40 blur-[180px] rounded-full opacity-50 pointer-events-none"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-3 px-5 py-2.5 mb-8 rounded-full bg-white border border-slate-100 text-[10px] font-black uppercase tracking-widest text-violet-600 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-violet-600 pulse-soft"></span>
            AXIS CINEMA • EXPERIENCE THE HUB
          </div>
          <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tight italic serif text-slate-900 leading-[0.9]">
            The <span className="text-gradient bg-clip-text">Future</span> of Influence.
          </h2>
          <p className="text-slate-500 text-xl max-w-2xl mx-auto font-medium leading-relaxed">
            Witness the unified creator hub in action. Manifest your vision to global platforms with elite AI precision.
          </p>
        </div>

        <div id="vsl-player" className="relative aspect-video rounded-[4rem] overflow-hidden bg-white border-[12px] md:border-[20px] border-white shadow-[0_60px_120px_-20px_rgba(166,107,255,0.25)] group transition-all duration-1000 hover:scale-[1.01]">
          
          {!isPlaying ? (
            <div className="absolute inset-0 w-full h-full">
              <iframe 
                className="absolute inset-0 w-full h-full pointer-events-none scale-105 opacity-50 grayscale group-hover:grayscale-0 transition-all duration-1000"
                src={`https://www.youtube.com/embed/${placeholderVideoId}?autoplay=1&mute=1&loop=1&playlist=${placeholderVideoId}&controls=0&modestbranding=1&showinfo=0&rel=0`}
                title="AXIS Motion Preview" 
                frameBorder="0" 
                allow="autoplay"
              ></iframe>

              <div className="absolute inset-0 flex flex-col items-center justify-center bg-violet-900/5 backdrop-blur-[2px] transition-all group-hover:bg-transparent group-hover:backdrop-blur-none">
                <button 
                  onClick={() => setIsPlaying(true)}
                  className="w-32 h-32 bg-violet-600 text-white rounded-[2.5rem] flex items-center justify-center shadow-2xl transition-all hover:scale-110 active:scale-95 group/btn relative"
                >
                  <div className="absolute inset-0 bg-white rounded-[2.5rem] scale-0 group-hover/btn:scale-125 opacity-20 transition-transform duration-700"></div>
                  <svg className="w-12 h-12 fill-current translate-x-1" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </button>
                <div className="mt-10 flex flex-col items-center">
                  <p className="text-[12px] font-black uppercase tracking-[0.5em] text-slate-900 drop-shadow-sm mb-2">Watch AXIS Presentation</p>
                  <p className="text-[10px] font-bold text-slate-400 italic uppercase">AI Manifestation Logic Unveiled</p>
                </div>
              </div>
            </div>
          ) : (
            <iframe 
              className="w-full h-full animate-fadeIn"
              src={`https://www.youtube.com/embed/${mainVideoId}?autoplay=1&start=${startTime}&rel=0&modestbranding=1`}
              title="AXIS Platform Trailer" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            ></iframe>
          )}
        </div>

        <div className="mt-12 flex flex-wrap justify-center gap-4">
          <div className="w-full text-center mb-4">
            <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.5em]">Explore Key Moments</span>
          </div>
          {chapters.map((chapter, idx) => (
            <button
              key={idx}
              onClick={() => handleJumpTo(chapter.time)}
              className={`px-6 py-3 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-3 ${startTime === chapter.time && isPlaying ? 'bg-slate-900 text-white border-slate-900 shadow-xl' : 'bg-white border-slate-100 text-slate-400 hover:border-violet-200 hover:text-violet-600'}`}
            >
              <span className="opacity-50">{chapter.label}</span>
              <span>{chapter.title}</span>
            </button>
          ))}
        </div>
      </div>

      <style>{`
        .pulse-soft { animation: pulse-soft 3s infinite ease-in-out; }
        @keyframes pulse-soft { 0%, 100% { transform: scale(1); opacity: 0.8; } 50% { transform: scale(1.05); opacity: 1; } }
      `}</style>
    </section>
  );
};

export default VSL;