
import React from 'react';
import Logo from './Logo';

const Navbar: React.FC = () => {
  return (
    <nav className="fixed top-8 left-0 right-0 z-[100] px-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-slate-950/70 backdrop-blur-3xl border border-white/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] rounded-[2.5rem] px-8 py-4 flex items-center justify-between">
          <a href="/" className="hover:opacity-80 transition-opacity">
            <Logo size="md" />
          </a>
          
          <div className="hidden md:flex items-center gap-10">
            {[
              { label: 'Studio Hub', id: 'hub' },
              { label: 'Academy', id: 'academy' },
              { label: 'Intelligence', id: 'intelligence' }
            ].map(item => (
              <a 
                key={item.id} 
                href={`#${item.id}`} 
                className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-indigo-400 transition-colors"
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <a href="#trial" className="hidden lg:flex px-8 py-3.5 bg-white text-slate-950 rounded-2xl font-black text-[10px] transition-all hover:scale-105 uppercase tracking-widest shadow-xl">
              Activate OS
            </a>
            <button className="md:hidden p-3 bg-white/5 rounded-xl text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16" strokeWidth={2.5}/></svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
