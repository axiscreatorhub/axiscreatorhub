'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import CreatorStudio from '@/components/CreatorStudio';
import AIContentFactory from '@/components/AIContentFactory';
import IntelligenceLab from '@/components/IntelligenceLab';
import AcademyPortal from '@/components/AcademyPortal';
import StrategyConsultant from '@/components/StrategyConsultant';
import VSL from '@/components/VSL';
import AboutUs from '@/components/AboutUs';
import CourseList from '@/components/CourseList';
import Footer from '@/components/Footer';
import MobileNav from '@/components/MobileNav';
import SalesNotification from '@/components/SalesNotification';
import Logo from '@/components/Logo';

const LeadCapture: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      await new Promise(r => setTimeout(r, 1500));
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 8000);
    } catch (err) {
      alert("Relay error. Please check connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-32 bg-[#020617] relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/5 to-violet-500/5"></div>
      <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
        <div className="bg-white/5 border border-white/10 rounded-[5rem] p-16 md:p-32 backdrop-blur-3xl shadow-2xl">
          <h2 className="text-5xl md:text-7xl font-black text-white outfit italic uppercase tracking-tighter mb-8 leading-none">
            Join the <span className="text-gradient">Elite 1%.</span>
          </h2>
          <p className="text-slate-400 text-2xl font-medium max-w-2xl mx-auto mb-16">
            Get viral faceless hooks and platform intel delivered to your inbox weekly via the <span className="text-white">AXIS x Resend Relay</span>.
          </p>
          
          <form onSubmit={handleSubscribe} className="max-w-2xl mx-auto flex flex-col md:flex-row gap-6">
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your elite creator email..."
              className="flex-1 bg-black/40 border border-white/10 rounded-[2.5rem] px-12 py-8 text-white outline-none focus:ring-2 focus:ring-pink-500 transition-all font-bold"
            />
            <button 
              type="submit"
              disabled={isSubmitting}
              className="px-16 py-8 bg-white text-slate-950 rounded-[2.5rem] font-black text-[13px] uppercase tracking-[0.4em] hover:scale-105 active:scale-95 transition-all shadow-2xl flex items-center justify-center gap-3"
            >
              {isSubmitting ? <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div> : (subscribed ? 'SYNCED ✔' : 'JOIN THE LIST')}
            </button>
          </form>
          {subscribed && <p className="mt-8 text-pink-400 font-bold uppercase tracking-widest text-[10px] animate-pulse">AXIS Relay Verified. Welcome to the elite roster.</p>}
        </div>
      </div>
    </section>
  );
};

export default function Home() {
  const [isNexus, setIsNexus] = useState(false);
  const [isBooting, setIsBooting] = useState(true);
  const [bootProgress, setBootProgress] = useState(0);

  useEffect(() => {
    const active = localStorage.getItem('axis_nexus_active') === 'true';
    setIsNexus(active);
  }, []);

  useEffect(() => {
    localStorage.setItem('axis_nexus_active', isNexus.toString());
  }, [isNexus]);

  useEffect(() => {
    const interval = setInterval(() => {
      setBootProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsBooting(false), 500);
          return 100;
        }
        return prev + 2;
      });
    }, 30);
    return () => clearInterval(interval);
  }, []);

  if (isBooting) {
    return (
      <div className="fixed inset-0 z-[1000] bg-[#020617] flex flex-col items-center justify-center p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(139,92,246,0.1),_transparent_70%)] animate-pulse"></div>
        <Logo size="xl" className="mb-24 scale-150 animate-bounce-slow" />
        
        <div className="w-full max-w-sm">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] font-black text-violet-500 uppercase tracking-[0.5em] animate-pulse">Initializing AXIS OS</span>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{bootProgress}%</span>
          </div>
          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/10">
            <div 
              className="h-full bg-gradient-to-r from-pink-500 via-violet-500 to-indigo-500 transition-all duration-300 ease-out"
              style={{ width: `${bootProgress}%` }}
            ></div>
          </div>
          <div className="mt-8 text-center">
             <p className="text-[8px] font-bold text-slate-600 uppercase tracking-[0.4em]">AXIS Operating System • v7.1.0-PROD</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen selection:bg-violet-500/20 selection:text-white bg-[#020617] text-white pb-safe pt-safe animate-fadeIn">
      <div className="hidden sm:block bg-white text-slate-950 py-3.5 text-center text-[10px] font-black uppercase tracking-[0.5em] sticky top-0 z-[110] shadow-2xl border-b border-violet-500/10">
        AXIS CREATOR HUB • {isNexus ? 'NEXUS ELITE NODE ACTIVE' : 'SECURE HUB OS'} • PRODUCTION v7.1.0
      </div>
      
      <Navbar />
      
      <main className="flex flex-col overflow-x-hidden relative">
        <div className="absolute top-0 left-0 w-full h-[120vh] bg-[radial-gradient(circle_at_50%_0%,_rgba(139,92,246,0.06),_transparent_70%)] pointer-events-none"></div>
        
        <Hero />
        
        <div className="px-safe relative z-10">
          <VSL />
          <AboutUs />
          <AIContentFactory />
          <CreatorStudio isNexus={isNexus} />
          <CourseList onUpgrade={() => setIsNexus(true)} isNexus={isNexus} />
          <LeadCapture />
          <AcademyPortal />
          <IntelligenceLab />
        </div>
      </main>

      <div className="px-safe">
        <Footer />
      </div>
      
      <StrategyConsultant />
      <MobileNav />
      <SalesNotification />
    </div>
  );
}
