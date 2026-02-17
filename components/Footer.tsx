
import React, { useState } from 'react';
import Logo from './Logo';
import LegalModal from './LegalModal';

const Footer: React.FC = () => {
  const [modalData, setModalData] = useState<{ isOpen: boolean; type: 'Privacy' | 'Terms' | 'EULA' }>({
    isOpen: false,
    type: 'Privacy'
  });

  const openLegal = (type: 'Privacy' | 'Terms' | 'EULA') => {
    setModalData({ isOpen: true, type });
  };

  return (
    <footer className="py-24 px-6 border-t border-white/5 bg-[#020617] relative">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start justify-between gap-16 md:gap-8">
        <div className="flex flex-col items-center md:items-start gap-8 flex-1">
          <Logo size="md" />
          <p className="text-slate-500 text-sm max-w-xs text-center md:text-left font-medium leading-relaxed">
            Faceless Digital Life: Equipping the next generation of world-class creators with unified AI-driven growth tools.
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-pulse"></span>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Omni-Intelligence Engine v4.0</span>
          </div>
          <p className="text-slate-600 text-[10px] font-bold uppercase tracking-widest mt-4">© 2024 Faceless Digital Life. All Manifestations Encrypted.</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-12 w-full md:w-auto">
          <div className="space-y-4">
            <h5 className="text-[10px] font-black text-white uppercase tracking-widest">Platform</h5>
            <ul className="space-y-3 text-sm text-slate-500 font-medium">
              <li><a href="#hub" className="hover:text-indigo-400 transition-colors">Studio Hub</a></li>
              <li><a href="#intelligence" className="hover:text-indigo-400 transition-colors">Intelligence OS</a></li>
              <li><a href="#academy" className="hover:text-indigo-400 transition-colors">Academy Portal</a></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h5 className="text-[10px] font-black text-white uppercase tracking-widest">Security</h5>
            <ul className="space-y-3 text-sm text-slate-500 font-medium">
              <li><button onClick={() => openLegal('Privacy')} className="hover:text-indigo-400 transition-colors">Privacy Shield</button></li>
              <li><button onClick={() => openLegal('Terms')} className="hover:text-indigo-400 transition-colors">Terms of Sync</button></li>
              <li><button onClick={() => openLegal('EULA')} className="hover:text-indigo-400 transition-colors">App EULA</button></li>
            </ul>
          </div>
          <div className="space-y-4 col-span-2 md:col-span-1">
            <h5 className="text-[10px] font-black text-white uppercase tracking-widest">Connect</h5>
            <div className="flex gap-4">
              <a href="#" className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all">
                 <img src="https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg" className="h-5" />
              </a>
              <a href="#" className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all">
                 <img src="https://upload.wikimedia.org/wikipedia/commons/c/ce/X_logo_2023.svg" className="h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <LegalModal 
        isOpen={modalData.isOpen} 
        onClose={() => setModalData(prev => ({ ...prev, isOpen: false }))} 
        type={modalData.type} 
      />
    </footer>
  );
};

export default Footer;
