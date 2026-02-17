
import React, { useState } from 'react';
import { CourseModule } from '../types';

const modules: CourseModule[] = [
  {
    id: 'm1',
    title: 'High-Tier Identity',
    duration: '42:15',
    thumbnail: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=800',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    description: 'Constructing a digital presence that commands authority and attracts premium partnerships.',
    resources: [
      { name: 'Identity Audit Checklist', type: 'PDF', size: '2.4 MB' },
      { name: 'Brand Voice Template', type: 'Template', size: '1.1 MB' }
    ]
  },
  {
    id: 'm2',
    title: 'The Conversion Engine',
    duration: '58:30',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    description: 'Technical deep-dive into landing page psychology and high-converting funnel structures.',
    resources: [
      { name: 'Funnel Logic Map', type: 'PDF', size: '4.8 MB' },
      { name: 'Landing Page Swipe File', type: 'Guide', size: '15.2 MB' }
    ]
  },
  {
    id: 'm3',
    title: 'Honest Ad Strategy',
    duration: '34:10',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    description: 'How to scale on Meta and Google without the usual "guru" fluff or misleading promises.',
    resources: [
      { name: 'Campaign Budget Planner', type: 'Template', size: '0.8 MB' },
      { name: 'Ad Copy Frameworks', type: 'PDF', size: '3.1 MB' }
    ]
  }
];

const CoursePortal: React.FC = () => {
  const [activeModule, setActiveModule] = useState(modules[0]);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  return (
    <section className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="text-4xl font-bold text-slate-900 serif italic mb-4">Curriculum Preview</h2>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.4em]">Actual Training Content Inside the Foundation</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 transition-all duration-500 ease-in-out">
          {/* Main Video Player */}
          <div className={`transition-all duration-500 ease-in-out ${isSidebarVisible ? 'lg:w-2/3' : 'lg:w-full'}`}>
            <div className="relative group">
              {/* Toggle Button */}
              <button 
                onClick={() => setIsSidebarVisible(!isSidebarVisible)}
                className="absolute top-6 right-6 z-10 bg-white/90 backdrop-blur border border-slate-200 p-3 rounded-2xl shadow-xl hover:bg-white hover:scale-105 transition-all group/btn"
                title={isSidebarVisible ? "Expand Video" : "Show Playlist"}
              >
                {isSidebarVisible ? (
                  <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                ) : (
                  <div className="flex items-center gap-2 px-2">
                    <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">Show Modules</span>
                  </div>
                )}
              </button>

              <div className="aspect-video bg-slate-900 rounded-[3rem] overflow-hidden shadow-2xl border-8 border-slate-50 relative">
                <iframe 
                  className="w-full h-full"
                  src={activeModule.videoUrl}
                  title={activeModule.title}
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                ></iframe>
              </div>
            </div>
            
            <div className="mt-10 p-4">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-3">
                     <span className="px-3 py-1 bg-[#C5A059]/10 text-[#C5A059] text-[9px] font-black uppercase tracking-widest rounded-full">Module Active</span>
                     <h3 className="text-2xl font-bold text-slate-800 serif">{activeModule.title}</h3>
                  </div>
                  <p className="text-slate-500 font-light leading-relaxed max-w-2xl">{activeModule.description}</p>
                </div>

                {activeModule.resources && activeModule.resources.length > 0 && (
                  <div className="w-full md:w-64">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Downloadable Resources</h4>
                    <div className="space-y-3">
                      {activeModule.resources.map((resource, idx) => (
                        <button 
                          key={idx}
                          className="w-full flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl group hover:border-[#C5A059] hover:bg-white transition-all text-left"
                          onClick={() => alert(`Premium download for "${resource.name}" started.`)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center group-hover:bg-[#C5A059]/10 group-hover:border-[#C5A059]/30 transition-colors">
                              <svg className="w-4 h-4 text-slate-400 group-hover:text-[#C5A059]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                            <div>
                              <div className="text-[10px] font-bold text-slate-800 line-clamp-1">{resource.name}</div>
                              <div className="text-[8px] text-slate-400 uppercase font-black">{resource.type} • {resource.size}</div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Module List Sidebar */}
          {isSidebarVisible && (
            <div className="lg:w-1/3 space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between mb-6 px-4">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Course Modules (03)</h4>
                <button 
                  onClick={() => setIsSidebarVisible(false)}
                  className="text-[9px] font-bold text-slate-400 hover:text-slate-600 uppercase tracking-widest transition-colors"
                >
                  Hide List
                </button>
              </div>
              
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {modules.map(module => (
                  <button
                    key={module.id}
                    onClick={() => setActiveModule(module)}
                    className={`w-full flex items-center gap-6 p-4 rounded-[2rem] transition-all text-left group ${activeModule.id === module.id ? 'bg-[#F9FAFB] ring-1 ring-[#C5A059] shadow-xl' : 'hover:bg-[#F9FAFB]'}`}
                  >
                    <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 shadow-sm border border-slate-100">
                      <img src={module.thumbnail} alt={module.title} className={`w-full h-full object-cover transition-all duration-700 ${activeModule.id === module.id ? 'grayscale-0' : 'grayscale group-hover:grayscale-0'}`} />
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[9px] font-black text-[#C5A059] uppercase tracking-widest">Premium Content</span>
                        <span className="text-[9px] text-slate-400 font-bold">{module.duration}</span>
                      </div>
                      <h5 className="text-sm font-bold text-slate-800 serif">{module.title}</h5>
                      <p className="text-[10px] text-slate-400 mt-1 font-medium truncate max-w-[150px]">Unlocked with membership</p>
                    </div>
                  </button>
                ))}
              </div>
              
              <div className="mt-8 p-8 bg-slate-900 rounded-[2.5rem] text-center text-white relative overflow-hidden group/cta">
                <div className="absolute inset-0 bg-gradient-to-br from-[#C5A059]/20 to-transparent transition-opacity group-hover/cta:opacity-30"></div>
                <div className="relative z-10">
                  <p className="text-[9px] font-bold uppercase tracking-[0.3em] mb-4 opacity-60">Full Program Includes</p>
                  <div className="text-2xl font-bold serif mb-6">24+ Additional Modules</div>
                  <a href="#checkout" className="inline-block w-full py-4 bg-white text-slate-900 font-bold text-[10px] uppercase tracking-widest rounded-full hover:scale-105 transition-transform shadow-xl">Get Lifetime Access</a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #F1F5F9;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #E2E8F0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #C5A059;
        }
      `}</style>
    </section>
  );
};

export default CoursePortal;
