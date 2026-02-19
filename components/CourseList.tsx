import { useState } from 'react';
import { Course } from '../types';
import { plans } from '../constants';

interface CourseListProps {
  onUpgrade?: () => void;
  isNexus?: boolean;
}

const CourseList = ({ onUpgrade, isNexus }: CourseListProps) => {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handleActivate = async (course: Course) => {
    if (course.id === 'trial') {
      window.location.hash = 'hub';
      return;
    }

    setLoadingPlan(course.id);
    
    // Simulating AXIS x Paystack x Resend integrated flow
    setTimeout(() => {
      if (window.PaystackPop) {
        const priceNum = parseFloat(course.price.replace('$', '').replace('/mo', ''));
        const handler = window.PaystackPop.setup({
          key: process.env.PAYSTACK_PUBLIC_KEY || 'pk_test_placeholder', 
          email: 'billing@axiscreatorhub.com',
          amount: Math.round(priceNum * 100),
          currency: 'USD',
          ref: 'AXIS-SYNC-' + Math.floor((Math.random() * 10000000) + 1),
          callback: () => {
            if (onUpgrade) onUpgrade();
            // In production, your backend would now call Resend to send a "Welcome to Elite" email
            alert('Nexus Sync Successful. Check your email for onboarding docs.');
            window.location.hash = 'hub';
          },
          onClose: () => setLoadingPlan(null)
        });
        handler.openIframe();
      } else {
        if (onUpgrade) onUpgrade();
        setLoadingPlan(null);
      }
    }, 1200);
  };

  return (
    <section id="trial" className="py-48 bg-[#020617] relative">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <div className="text-violet-400 font-black text-[12px] uppercase tracking-[0.6em] mb-8">Axis Hub Tier Selection</div>
        <h2 className="text-7xl md:text-9xl font-black text-white mb-10 tracking-tighter outfit uppercase italic leading-none">The Brand.</h2>
        <div className="w-32 h-2.5 bg-gradient-to-r from-violet-500 to-indigo-500 mx-auto mb-12 rounded-full"></div>
        <p className="text-slate-400 text-2xl font-medium max-w-3xl mx-auto leading-relaxed mb-40">Choose your level of engagement. <br/>{isNexus ? 'Your Nexus Elite plan is fully active.' : 'Start with a trial or unlock the complete enterprise OS.'}</p>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 text-left">
          {plans.map((course) => (
            <div key={course.id} className={`group relative flex flex-col bg-white/5 rounded-[4.5rem] overflow-hidden transition-all hover:bg-white/10 hover:-translate-y-5 border border-white/10 shadow-2xl ${isNexus && (course.id === 'nexus' || (isNexus && course.id !== 'trial')) ? 'ring-4 ring-violet-500' : ''}`}>
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
                  onClick={() => handleActivate(course)}
                  disabled={loadingPlan === course.id}
                  className={`w-full font-black py-8 rounded-[3rem] text-center transition-all hover:scale-105 shadow-2xl text-[13px] uppercase tracking-[0.4em] active:scale-95 flex items-center justify-center gap-3 ${isNexus && (course.id === 'nexus' || (isNexus && course.id !== 'trial')) ? 'bg-violet-600 text-white' : 'bg-white text-slate-950 hover:bg-violet-50'}`}
                >
                  {loadingPlan === course.id ? (
                    <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    (isNexus && (course.id === 'nexus' || (isNexus && course.id !== 'trial'))) ? 'Plan Active' : 'Activate Plan'
                  )}
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