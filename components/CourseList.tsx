import React from 'react';
import { Course } from '../types';

export const plans: Course[] = [
  {
    id: 'trial',
    title: 'Trial Node',
    description: 'Instant entry-level access to the AXIS engine. Experience the flow of manifestation.',
    price: 'FREE',
    features: ['20 Visual Manifestations', '5 Cinema Pulses', 'Standard Reasoning Node', 'Standard Resolution'],
    link: '#hub',
    image: 'https://images.unsplash.com/photo-1550745679-325348393049?auto=format&fit=crop&q=80&w=800',
    badge: 'Limited Hub'
  },
  {
    id: 'aesthetic',
    title: 'Aesthetic Tier',
    description: 'Engineered for social curators requiring high-impact visuals and 2K rendering standards.',
    price: '$14.99/mo',
    features: ['Unlimited Visual Manifest', '4K Rendering Priority', 'Imagen 4 Engine Access', 'Custom Aesthetic Presets'],
    link: '#hub',
    image: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=800',
    badge: 'Creator Grade'
  },
  {
    id: 'cinema',
    title: 'Cinema Tier',
    description: 'The definitive video operating system for creators. Full Veo 3.1 cinematic network access.',
    price: '$39.99/mo',
    features: ['Unlimited Video Pulses', '1080p Master Quality', 'Neural Voice Synthesis', 'Real-Time Trend Grounding'],
    link: '#hub',
    image: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&q=80&w=800',
    badge: 'Master Grade'
  },
  {
    id: 'nexus',
    title: 'Nexus Elite',
    description: 'The ultimate enterprise omni-AI hub. Maximum thinking budget and priority Google Alpha access.',
    price: '$159.99/mo',
    features: ['Full Nexus OS Unlocked', 'Max Thinking (32K+)', '24/7 Strategic Support', 'Beta Google Tools Access'],
    link: '#hub',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800',
    badge: 'Enterprise Hub'
  }
];

interface CourseListProps {
  onUpgrade?: () => void;
  isNexus?: boolean;
}

const CourseList: React.FC<CourseListProps> = ({ onUpgrade, isNexus }) => {
  const payWithPaystack = (course: Course) => {
    // @ts-ignore
    const handler = PaystackPop.setup({
      key: 'pk_live_your_actual_key_here', // In production, this should come from env: process.env.PAYSTACK_PUBLIC_KEY
      email: 'customer@axiscreatorhub.com',
      amount: parseFloat(course.price.replace('$', '').replace('/mo', '')) * 100 * 1500, // Conversion if needed, or flat rate
      currency: 'NGN', // Paystack default, can be USD if account supports it
      ref: 'AXIS-' + Math.floor((Math.random() * 1000000000) + 1),
      callback: (response: any) => {
        alert('Payment successful. Transaction reference: ' + response.reference);
        if (onUpgrade) onUpgrade();
        window.location.href = '#hub';
      },
      onClose: () => {
        alert('Transaction cancelled. Your AXIS Node remains in trial mode.');
      }
    });
    handler.openIframe();
  };

  const handlePurchase = (course: Course) => {
    if (course.id === 'trial') {
      window.location.href = '#hub';
      return;
    }
    
    payWithPaystack(course);
  };

  return (
    <section id="trial" className="py-48 bg-[#020617] relative">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <div className="text-violet-400 font-black text-[12px] uppercase tracking-[0.6em] mb-8">Synchronize Operating Node</div>
        <h2 className="text-7xl md:text-9xl font-black text-white mb-10 tracking-tighter outfit uppercase italic leading-none">The Matrix.</h2>
        <div className="w-32 h-2.5 bg-gradient-to-r from-violet-500 to-indigo-500 mx-auto mb-12 rounded-full"></div>
        <p className="text-slate-400 text-2xl font-medium max-w-3xl mx-auto leading-relaxed mb-40">Choose your level of intelligence sync. <br/>{isNexus ? 'Your Nexus Elite node is fully active.' : 'Start with a trial or unlock the complete enterprise OS.'}</p>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 text-left">
          {plans.map((course) => (
            <div key={course.id} className={`group relative flex flex-col bg-white/5 rounded-[4.5rem] overflow-hidden transition-all hover:bg-white/10 hover:-translate-y-5 border border-white/10 shadow-2xl ${isNexus && course.id === 'nexus' ? 'ring-4 ring-violet-500 ring-offset-[16px] ring-offset-slate-950' : ''}`}>
              <div className="relative h-80 overflow-hidden">
                <img src={course.image} alt={course.title} className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-125" />
                {course.badge && (
                  <span className="absolute top-10 left-10 px-6 py-3 bg-violet-600 text-white text-[10px] font-black uppercase tracking-widest rounded-3xl shadow-2xl">
                    {course.badge}
                  </span>
                )}
              </div>

              <div className="p-14 flex flex-col flex-grow">
                <div className="mb-12">
                  <h3 className="text-3xl font-black text-white mb-4 outfit uppercase italic tracking-tighter leading-none">{course.title}</h3>
                  <div className="text-violet-400 font-black text-3xl tracking-tight">{course.price}</div>
                </div>
                
                <p className="text-slate-400 mb-12 font-medium leading-relaxed text-[15px] opacity-80">{course.description}</p>
                
                <ul className="space-y-6 mb-16 mt-auto">
                  {course.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-5 text-[12px] font-bold text-slate-300 list-none uppercase tracking-wide">
                      <div className="w-2.5 h-2.5 rounded-full bg-violet-500 shadow-[0_0_15px_rgba(139,92,246,0.5)]"></div>
                      {f}
                    </li>
                  ))}
                </ul>

                <button 
                  onClick={() => handlePurchase(course)}
                  className={`w-full font-black py-8 rounded-[3rem] text-center transition-all hover:scale-105 shadow-2xl text-[13px] uppercase tracking-[0.4em] active:scale-95 ${isNexus && course.id === 'nexus' ? 'bg-violet-600 text-white' : 'bg-white text-slate-950 hover:bg-violet-500 hover:text-white'}`}
                >
                  {isNexus && course.id === 'nexus' ? 'Node Active' : 'Activate Node'}
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