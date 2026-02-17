import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CreatorStudio from './components/CreatorStudio';
import IntelligenceLab from './components/IntelligenceLab';
import AcademyPortal from './components/AcademyPortal';
import StrategyConsultant from './components/StrategyConsultant';
import VSL from './components/VSL';
import AboutUs from './components/AboutUs';
import CourseList from './components/CourseList';
import Footer from './components/Footer';
import MobileNav from './components/MobileNav';
import StoreReadiness from './components/StoreReadiness';
import SalesNotification from './components/SalesNotification';

const App: React.FC = () => {
  const [isNexus, setIsNexus] = useState(() => localStorage.getItem('axis_elite_active') === 'true');

  useEffect(() => {
    localStorage.setItem('axis_elite_active', isNexus.toString());
  }, [isNexus]);

  return (
    <div className="min-h-screen selection:bg-indigo-500/20 selection:text-white bg-[#020617] text-white pb-safe pt-safe">
      {/* Branded OS Notification */}
      <div className="hidden sm:block bg-white text-slate-950 py-3.5 text-center text-[10px] font-black uppercase tracking-[0.5em] sticky top-0 z-[110] shadow-2xl border-b border-indigo-500/10">
        FACELESS DIGITAL LIFE • {isNexus ? 'OMNI-AI OS ELITE' : 'CREATOR PULSE ACTIVE'} • v6.0.0 PRO
      </div>
      
      <Navbar />
      
      <main className="flex flex-col overflow-x-hidden relative">
        <div className="absolute top-0 left-0 w-full h-[120vh] bg-[radial-gradient(circle_at_50%_0%,_rgba(99,102,241,0.06),_transparent_70%)] pointer-events-none"></div>
        
        <Hero isNexus={isNexus} />
        
        <div className="px-safe relative z-10">
          <VSL />
          <AboutUs />
          <div id="hub">
            <CreatorStudio isNexus={isNexus} />
          </div>
          <CourseList onUpgrade={() => setIsNexus(true)} isNexus={isNexus} />
          <div id="academy">
             <AcademyPortal />
          </div>
          <div id="intelligence">
             <IntelligenceLab />
          </div>
          <StoreReadiness />
        </div>
      </main>

      <div className="px-safe">
        <Footer />
      </div>
      
      <StrategyConsultant />
      <MobileNav />
      <SalesNotification />

      <style>{`
        * { -webkit-tap-highlight-color: transparent; }
        html { scroll-behavior: smooth; overscroll-behavior-y: contain; }
        ::-webkit-scrollbar { display: none; }
        .pt-safe { padding-top: env(safe-area-inset-top); }
        .pb-safe { padding-bottom: env(safe-area-inset-bottom); }
      `}</style>
    </div>
  );
};

export default App;