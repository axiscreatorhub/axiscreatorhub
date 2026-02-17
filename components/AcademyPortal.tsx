
import React, { useState } from 'react';
import { CourseModule } from '../types';

const valueModules: CourseModule[] = [
  {
    id: 'v1',
    title: 'Faceless Foundations',
    duration: '15m',
    thumbnail: 'https://images.unsplash.com/photo-1550745679-325348393049?auto=format&fit=crop&q=80&w=800',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    description: 'Master the Faceless workflow. How to go from zero ideas to a platform-ready pulse in minutes using Gemini AI.',
    resources: [{ name: 'Creator Cheat Sheet', type: 'Guide', size: '1.2 MB' }]
  },
  {
    id: 'v2',
    title: 'The Viral Vibe',
    duration: '22m',
    thumbnail: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=800',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    description: 'Understanding Meta-trends. Learn the secrets of high-retention content for Reels and TikTok powered by Search Grounding.',
    resources: [{ name: 'Hook Library', type: 'PDF', size: '2.4 MB' }]
  }
];

const AcademyPortal: React.FC = () => {
  const [activeMod, setActiveMod] = useState(valueModules[0]);

  return (
    <section id="academy" className="py-32 bg-white overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="mb-24 text-center">
          <h2 className="text-5xl font-black mb-4 outfit">Academy Portal</h2>
          <p className="text-violet-500 text-[11px] font-black uppercase tracking-[0.5em] mb-8 leading-loose">Faceless Digital Life: Creativity Powered in One</p>
          <div className="w-24 h-2 meta-gradient mx-auto rounded-full"></div>
        </div>

        <div className="grid lg:grid-cols-12 gap-16 items-start">
          <div className="lg:col-span-8">
            <div className="aspect-video bg-slate-900 rounded-[4rem] overflow-hidden border-[12px] border-slate-50 canva-shadow">
              <iframe className="w-full h-full" src={activeMod.videoUrl} title={activeMod.title} frameBorder="0" allowFullScreen></iframe>
            </div>
            <div className="mt-12">
              <h3 className="text-4xl font-black mb-4 italic serif">{activeMod.title}</h3>
              <p className="text-slate-400 font-medium text-xl leading-relaxed max-w-2xl">{activeMod.description}</p>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-4">
            {valueModules.map(mod => (
              <button 
                key={mod.id} 
                onClick={() => setActiveMod(mod)}
                className={`w-full flex items-center gap-6 p-6 rounded-[2.5rem] transition-all text-left ${activeMod.id === mod.id ? 'bg-violet-50 ring-2 ring-violet-200' : 'hover:bg-slate-50 opacity-50 hover:opacity-100'}`}
              >
                <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0">
                  <img src={mod.thumbnail} className="w-full h-full object-cover" />
                </div>
                <div>
                  <span className="text-[9px] font-black text-violet-500 uppercase tracking-widest">{mod.duration} Lesson</span>
                  <h5 className="text-lg font-black italic serif text-slate-900 leading-tight">{mod.title}</h5>
                </div>
              </button>
            ))}
            
            <div className="mt-12 p-10 meta-gradient rounded-[3.5rem] text-center text-white shadow-2xl">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] mb-4">Ultimate Masterclass</p>
              <div className="text-2xl font-black italic serif mb-8 leading-none">Generation Relation: Freedom to Dream</div>
              <button className="w-full py-5 bg-white text-slate-900 font-black text-[11px] uppercase tracking-widest rounded-2xl hover:scale-105 transition-transform">Unlock Secret Pulses</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AcademyPortal;
