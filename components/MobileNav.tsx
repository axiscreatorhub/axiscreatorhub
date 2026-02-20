
import React from 'react';

const MobileNav: React.FC = () => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-[120] px-4 pb-4">
      <div className="bg-slate-900/90 backdrop-blur-2xl rounded-[2.5rem] border border-white/10 shadow-2xl flex items-center justify-around py-4 px-6">
        <a href="#content-factory" className="flex flex-col items-center gap-1 group">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center transition-all group-active:scale-90 bg-white/5 text-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth={2.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
          </div>
          <span className="text-[8px] font-black uppercase tracking-widest text-white/40">Content</span>
        </a>
        <a href="#hub" className="flex flex-col items-center gap-1 group">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center transition-all group-active:scale-90 bg-white/5 text-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth={2.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
          </div>
          <span className="text-[8px] font-black uppercase tracking-widest text-white/40">Studio</span>
        </a>
        <a href="#intelligence" className="flex flex-col items-center gap-1 group">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center transition-all group-active:scale-90 bg-white/5 text-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth={2.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          </div>
          <span className="text-[8px] font-black uppercase tracking-widest text-white/40">Intel</span>
        </a>
        <div className="relative -top-6">
          <a href="#hub" className="w-16 h-16 meta-gradient rounded-full flex items-center justify-center shadow-2xl border-4 border-[#FCFCFF] active:scale-95 transition-transform">
             <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth={3} d="M12 4v16m8-8H4"/></svg>
          </a>
        </div>
        <a href="#academy" className="flex flex-col items-center gap-1 group">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center transition-all group-active:scale-90 bg-white/5 text-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth={2.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
          </div>
          <span className="text-[8px] font-black uppercase tracking-widest text-white/40">Academy</span>
        </a>
        <button onClick={() => window.dispatchEvent(new CustomEvent('toggle-consultant'))} className="flex flex-col items-center gap-1 group">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center transition-all group-active:scale-90 bg-white/5 text-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth={2.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>
          </div>
          <span className="text-[8px] font-black uppercase tracking-widest text-white/40">Strategy</span>
        </button>
      </div>
    </div>
  );
};

export default MobileNav;
