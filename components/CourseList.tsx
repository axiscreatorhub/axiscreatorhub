
import React from 'react';
import { Course } from '../types';

export const plans: Course[] = [
  {
    id: 'trial',
    title: 'Digital Pulse',
    description: 'Instant entry-level node. Experience the AXIS manifestation flow with basic Gemini integration.',
    price: 'FREE',
    features: ['20 Image Manifestations', '5 Cinema Pulses', 'Strategy Room Basic', 'Standard Reasoning Node'],
    link: '#hub',
    image: 'https://images.unsplash.com/photo-1550745679-325348393049?auto=format&fit=crop&q=80&w=800',
    badge: 'Limited Entry'
  },
  {
    id: 'visual-pulse',
    title: 'Aesthetic Tier',
    description: 'Engineered for high-impact social curators requiring world-class visual fidelity and Imagen 4 access.',
    price: '$12.99/mo',
    features: ['Unlimited Visual Manifest', 'Imagen 4 Ultra Engine', '4K Rendering Priority', 'Custom Aesthetic Presets'],
    link: '#hub',
    image: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=800',
    badge: 'Creator Grade'
  },
  {
    id: 'cinema-pulse',
    title: 'Cinema Tier',
    description: 'The definitive video OS for world-class creators. Full access to the Veo 3.1 cinematic network.',
    price: '$34.99/mo',
    features: ['Unlimited Video Pulses', '1080p Master Rendering', 'Audio Voice Lab Pro', 'Search-Grounded Video Strategy'],
    link: '#hub',
    image: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&q=80&w=800',
    badge: 'Pro Grade'
  },
  {
    id: 'nexus-os',
    title: 'Nexus Elite',
    description: 'The complete Enterprise Omni-AI Operating System. Unlimited everything with priority thinking budget.',
    price: '$149.99/mo',
    features: ['Full Omni-AI OS Access', 'Max Thinking Budget (32K+)', 'Live Strategic Node (24/7)', 'Early Access to Google Alpha Tools'],
    link: '#hub',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800',
    badge: 'Enterprise OS'
  }
];

interface CourseListProps {
  onUpgrade?: () => void;
  isNexus?: boolean;
}

const CourseList: React.FC<CourseListProps> = ({ onUpgrade, isNexus }) => {
  const handlePurchase = (courseId: string) => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const storeName = isMobile ? (/iPhone|iPad|iPod/i.test(navigator.userAgent) ? 'Apple App Store' : 'Google Play Store') : 'Secure Web Checkout';
    
    const confirmPurchase = window.confirm(`Activate ${courseId} via ${storeName}? \n\nWorld-class creative standards will be activated immediately upon sync.`);
    
    if (confirmPurchase && onUpgrade) {
      onUpgrade();
      alert(`AXIS Node Synchronized. World-class standards enabled.`);
      window.location.href = '#hub';
    }
  };

  return (
    <section id="trial" className="py-48 bg-[#020617] relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-40">
          <div className="text-indigo-400 font-black text-[12px] uppercase tracking-[0.6em] mb-8">Select Your Operating Sync</div>
          <h2 className="text-7xl md:text-9xl font-black text-white mb-10 tracking-tighter outfit uppercase italic leading-none">Enterprise Level.</h2>
          <div className="w-32 h-2.5 bg-gradient-to-r from-indigo-500 to-cyan-500 mx-auto mb-12 rounded-full"></div>
          <p className="text-slate-400 text-2xl font-medium max-w-3xl mx-auto leading-relaxed opacity-70">Elevate your creative standards to the AXIS world-class level. <br/>{isNexus ? 'Your Elite Operating System is fully synchronized.' : 'Begin with a trial pulse or unlock the complete Omni-AI OS.'}</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {plans.map((course) => (
            <div key={course.id} className={`group relative flex flex-col bg-white/5 rounded-[4.5rem] overflow-hidden transition-all hover:bg-white/10 hover:-translate-y-5 border border-white/10 shadow-2xl ${isNexus && course.id === 'nexus-os' ? 'ring-4 ring-indigo-500 ring-offset-[16px] ring-offset-slate-950' : ''}`}>
              <div className="relative h-80 overflow-hidden">
                <img src={course.image} alt={course.title} className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-125" />
                {course.badge && (
                  <span className="absolute top-10 left-10 px-6 py-3 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-3xl shadow-2xl">
                    {course.badge}
                  </span>
                )}
              </div>

              <div className="p-14 flex flex-col flex-grow">
                <div className="mb-12">
                  <h3 className="text-3xl font-black text-white mb-4 outfit uppercase italic tracking-tighter leading-none">{course.title}</h3>
                  <div className="text-indigo-400 font-black text-3xl tracking-tight">{course.price}</div>
                </div>
                
                <p className="text-slate-400 mb-12 font-medium leading-relaxed text-[15px] opacity-80">{course.description}</p>
                
                <ul className="space-y-6 mb-16 mt-auto">
                  {course.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-5 text-[12px] font-bold text-slate-300 list-none uppercase tracking-wide">
                      <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]"></div>
                      {f}
                    </li>
                  ))}
                </ul>

                <button 
                  onClick={() => handlePurchase(course.id)}
                  className={`w-full font-black py-8 rounded-[3rem] text-center transition-all hover:scale-105 shadow-2xl text-[13px] uppercase tracking-[0.4em] active:scale-95 ${isNexus && course.id === 'nexus-os' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-950 hover:bg-indigo-500 hover:text-white'}`}
                >
                  {isNexus && course.id === 'nexus-os' ? 'Fully Synced' : 'Initialize Sync'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CourseList;
