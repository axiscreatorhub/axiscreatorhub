import React, { useState } from 'react';
import { CourseModule } from '../types';

const masterclassModules: CourseModule[] = [
  {
    id: 'm1',
    title: 'The 60-Second Viral Formula',
    duration: '12m',
    thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=800',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    description: 'Master the exact science of the short-form hook. Learn how to use AXIS to generate retention-focused pulses that stop the scroll instantly.',
    resources: [{ name: 'Viral Script Blueprint', type: 'Guide', size: '1.2 MB' }]
  },
  {
    id: 'm2',
    title: 'Aesthetic Influence 101',
    duration: '15m',
    thumbnail: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=800',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    description: 'Why vibe matters more than production. How to use AXIS Neural Manifestation to create a premium, consistent look across all your feeds.',
    resources: [{ name: 'Color Palette Presets', type: 'Template', size: '0.8 MB' }]
  },
  {
    id: 'm3',
    title: 'Omni-Platform Dominance',
    duration: '20m',
    thumbnail: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=800',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    description: 'Stop working hard, start working smart. How to repurpose one single idea into a multi-platform empire using the AXIS Strategy engine.',
    resources: [{ name: 'Deployment Schedule', type: 'PDF', size: '2.1 MB' }]
  }
];

const AcademyPortal: React.FC = () => {
  const [activeMod, setActiveMod] = useState(masterclassModules[0]);

  return (
    <section id="academy" className="py-48 bg-white overflow-hidden relative">
      {/* Decorative dynamic glows */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-pink-100/50 rounded-full blur-[120px] -ml-64 -mt-32"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-violet-100/50 rounded-full blur-[120px] -mr-64 -mb-32"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="mb-32 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-2 mb-10 rounded-full bg-pink-50 border border-pink-100 text-pink-500 text-[11px] font-black uppercase tracking-[0.5em] shadow-sm">
            <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse"></span>
            AXIS CREATOR MASTERCLASS
          </div>
          <h2 className="text-6xl md:text-[7.5rem] font-black mb-10 outfit italic uppercase tracking-tighter leading-[0.85] text-slate-900">
            Learn the <br/><span className="text-gradient">Viral Logic.</span>
          </h2>
          <p className="text-slate-500 text-2xl font-medium max-w-2xl mx-auto leading-relaxed">
            Quick, easy, and invigorating. Our masterclass is designed to get you from <span className="text-slate-950 font-black">idea to viral drop</span> in minutes.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-24 items-start">
          {/* Main Masterclass Viewer */}
          <div className="lg:col-span-8">
            <div className="relative group">
              {/* Premium Frame Effect */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-pink-500 to-violet-500 rounded-[5.5rem] blur-2xl opacity-10 group-hover:opacity-20 transition-opacity"></div>
              
              <div className="relative aspect-video bg-slate-950 rounded-[5rem] overflow-hidden border-[16px] border-white shadow-[0_60px_100px_-20px_rgba(0,0,0,0.1)] group">
                <iframe 
                  className="w-full h-full" 
                  src={activeMod.videoUrl} 
                  title={activeMod.title} 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                ></iframe>
                
                {/* Custom Overlay */}
                <div className="absolute top-10 left-10 flex flex-col gap-2 pointer-events-none">
                   <div className="px-5 py-2.5 bg-pink-600/90 backdrop-blur-xl rounded-full text-[10px] font-black text-white uppercase tracking-widest shadow-xl">
                    Featured Lesson
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-20">
              <div className="flex items-center gap-6 mb-8">
                <div className="w-16 h-16 rounded-[2rem] bg-pink-50 border border-pink-100 flex items-center justify-center text-3xl shadow-sm">
                  🔥
                </div>
                <div>
                  <h3 className="text-4xl md:text-5xl font-black italic outfit uppercase tracking-tighter leading-tight text-slate-900">
                    {activeMod.title}
                  </h3>
                  <p className="text-pink-600 text-[11px] font-black uppercase tracking-widest mt-1">Creator Hub Series • Episode 01</p>
                </div>
              </div>
              <p className="text-slate-500 font-medium text-2xl leading-relaxed max-w-3xl">
                {activeMod.description}
              </p>
              
              <div className="mt-12 flex flex-wrap gap-6">
                 {activeMod.resources?.map((res, i) => (
                   <button key={i} className="flex items-center gap-4 px-8 py-5 bg-slate-900 text-white rounded-2xl hover:bg-pink-600 transition-all shadow-xl group/res">
                     <span className="text-xl group-hover/res:scale-110 transition-transform">📥</span>
                     <div className="text-left">
                       <div className="text-[10px] font-black uppercase tracking-widest leading-none mb-1">Download {res.type}</div>
                       <div className="text-[12px] font-bold text-white/60">{res.name}</div>
                     </div>
                   </button>
                 ))}
              </div>
            </div>
          </div>

          {/* Masterclass Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-4 flex justify-between items-center">
              <span>Next in Curriculum</span>
              <span className="px-2 py-0.5 bg-slate-100 rounded text-slate-500">3 Lessons Unlocked</span>
            </div>
            
            <div className="space-y-6">
              {masterclassModules.map(mod => (
                <button 
                  key={mod.id} 
                  onClick={() => setActiveMod(mod)}
                  className={`w-full flex items-center gap-8 p-8 rounded-[3.5rem] transition-all text-left group relative overflow-hidden ${activeMod.id === mod.id ? 'bg-pink-50 ring-2 ring-pink-100 shadow-2xl scale-[1.05]' : 'bg-slate-50 border border-slate-100 hover:bg-white hover:border-pink-200 hover:shadow-xl opacity-70 hover:opacity-100'}`}
                >
                  <div className="w-24 h-24 rounded-[1.8rem] overflow-hidden flex-shrink-0 shadow-lg group-hover:rotate-3 transition-transform border-4 border-white">
                    <img src={mod.thumbnail} className="w-full h-full object-cover" alt="Lesson" />
                  </div>
                  <div>
                    <span className={`text-[9px] font-black uppercase tracking-widest ${activeMod.id === mod.id ? 'text-pink-600' : 'text-slate-400'}`}>
                      {mod.duration} Lesson
                    </span>
                    <h5 className={`text-lg font-black italic outfit leading-tight uppercase tracking-tight mt-1 ${activeMod.id === mod.id ? 'text-slate-900' : 'text-slate-700'}`}>
                      {mod.title}
                    </h5>
                    <div className="mt-3 flex items-center gap-1.5">
                       <div className={`w-1.5 h-1.5 rounded-full ${activeMod.id === mod.id ? 'bg-pink-500 animate-pulse' : 'bg-slate-300'}`}></div>
                       <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Ready to watch</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            
            <div className="mt-16 p-12 bg-gradient-to-br from-pink-600 via-violet-600 to-indigo-700 rounded-[4rem] text-center text-white shadow-[0_40px_80px_rgba(236,72,153,0.3)] relative overflow-hidden group">
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
              
              <p className="text-[11px] font-black uppercase tracking-[0.5em] mb-6">Premium Creator Pass</p>
              <div className="text-4xl font-black italic outfit mb-10 leading-[0.9] uppercase tracking-tighter">
                Unlock <br/>The Studio.
              </div>
              <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-10 leading-relaxed">Join 5,000+ creators mastering the AXIS engine.</p>
              <button className="w-full py-6 bg-white text-slate-950 font-black text-[12px] uppercase tracking-widest rounded-3xl hover:scale-105 transition-transform shadow-2xl active:scale-95">
                Join Now for Free
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AcademyPortal;