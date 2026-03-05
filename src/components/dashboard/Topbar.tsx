'use client';

import { UserButton, useUser } from '@clerk/nextjs';
import { Bell, Search, Zap } from 'lucide-react';

export function Topbar() {
  const { user } = useUser();

  return (
    <header className="h-20 fixed top-0 right-0 left-64 bg-[#0a0a12]/80 backdrop-blur-xl border-b border-white/5 z-40 flex items-center justify-between px-8">
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <div className="relative w-full group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-hover:text-white transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search tools, assets, or scripts..." 
            className="w-full h-12 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-brand-purple/50 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-brand-orange/10 text-brand-orange text-xs font-bold uppercase tracking-widest hover:bg-brand-orange/20 transition-all">
          <Zap size={14} /> Buy Credits
        </button>
        
        <button className="relative p-2 rounded-xl bg-white/5 border border-white/10 text-zinc-400 hover:text-white transition-all">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-brand-pink rounded-full border-2 border-[#0a0a12]" />
        </button>

        <div className="flex items-center gap-3 pl-6 border-l border-white/5">
          <div className="hidden md:block text-right">
            <p className="text-sm font-bold text-white">{user?.fullName || 'Creator'}</p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Pro Plan</p>
          </div>
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </header>
  );
}
