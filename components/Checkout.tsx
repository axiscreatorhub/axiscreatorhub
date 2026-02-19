
import React, { useState } from 'react';
import { Course } from '../types';

interface CheckoutProps {
  selectedCourse: Course | null;
}

const Checkout = ({ selectedCourse }: CheckoutProps) => {
  const [formData, setFormData] = useState({ name: '', email: '', cc: '', expiry: '', cvc: '' });
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal'>('card');
  const [isProcessing, setIsProcessing] = useState(false);

  const displayTitle = selectedCourse?.title || "Axis Digital Masterclass";
  const displayPrice = selectedCourse?.price || "$297";
  const displayImage = selectedCourse?.image || "https://picsum.photos/id/20/800/800";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    setTimeout(() => {
      setIsProcessing(false);
      if (paymentMethod === 'paypal') {
        window.location.href = `https://www.paypal.com/checkout?amount=${displayPrice.replace('$', '')}`;
      } else {
        alert(`CONGRATULATIONS! Enrollment for "${displayTitle}" is successful. Check your email for login details.`);
      }
    }, 1500);
  };

  return (
    <section id="checkout" className="py-32 px-4 bg-white relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-6">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Secure 256-Bit SSL Connection
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight italic uppercase">Finalize Your Transformation</h2>
          <p className="text-slate-500 font-medium">Join 5,000+ top-tier influencers building honest empires on Axis.</p>
        </div>
        
        <div className="bg-white rounded-[4rem] overflow-hidden border border-slate-100 shadow-[0_50px_100px_rgba(0,0,0,0.08)] flex flex-col lg:flex-row">
          {/* Product Sidebar */}
          <div className="lg:w-5/12 p-12 lg:p-20 social-gradient relative overflow-hidden flex flex-col justify-center">
            {/* Background Decorative Circles */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full -ml-32 -mb-32 blur-3xl"></div>
            
            <div className="mb-10 relative z-10 text-white">
              <span className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest mb-8 inline-block">Order Summary</span>
              <h3 className="text-4xl font-black mb-4 tracking-tighter uppercase drop-shadow-xl leading-[0.9]">
                {displayTitle}
              </h3>
              <p className="text-white/80 font-medium leading-relaxed italic">
                Immediate access to all modules, templates, and community tools.
              </p>
            </div>
            
            <div className="relative group mb-12 z-10">
              <img src={displayImage} alt={displayTitle} className="rounded-[2rem] shadow-2xl border-8 border-white/10 aspect-square object-cover" />
              <div className="absolute -bottom-6 -right-6 bg-white text-slate-900 px-10 py-5 rounded-[2rem] font-black shadow-2xl text-3xl transform -rotate-3 border-4 border-slate-50">
                {displayPrice}
              </div>
            </div>

            <div className="space-y-4 z-10 bg-black/10 p-6 rounded-3xl backdrop-blur-sm border border-white/10">
              <p className="text-white text-xs font-black uppercase tracking-widest mb-2 opacity-60">Verified Enrollment Benefits:</p>
              <li className="flex items-center gap-3 text-white font-bold text-sm list-none">
                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                Lifetime Axis Strategy Updates
              </li>
              <li className="flex items-center gap-3 text-white font-bold text-sm list-none">
                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                Bonus: Axis Content CRM (V2.0)
              </li>
            </div>
          </div>

          {/* Checkout Form */}
          <div className="lg:w-7/12 p-12 lg:p-24 bg-white">
            <div className="flex gap-4 mb-12 p-2 bg-slate-50 rounded-[2.5rem] border border-slate-100">
              <button onClick={() => setPaymentMethod('card')} className={`flex-1 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest transition-all ${paymentMethod === 'card' ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:text-slate-600'}`}>Credit Card</button>
              <button onClick={() => setPaymentMethod('paypal')} className={`flex-1 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest transition-all ${paymentMethod === 'paypal' ? 'bg-[#0070ba] text-white shadow-xl' : 'text-slate-400 hover:text-slate-600'}`}>PayPal</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-10">
              {paymentMethod === 'card' ? (
                <>
                  <div className="space-y-8">
                    <h4 className="text-xl font-black text-slate-900 flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs">1</span>
                      Customer Details
                    </h4>
                    <div className="grid sm:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Your Full Name</label>
                        <input type="text" required className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-5 focus:outline-none focus:border-blue-500 transition-all font-bold placeholder:text-slate-300" placeholder="Jane Doe" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Email Address</label>
                        <input type="email" required className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-5 focus:outline-none focus:border-blue-500 transition-all font-bold placeholder:text-slate-300" placeholder="creator@axis.hub" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <h4 className="text-xl font-black text-slate-900 flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs">2</span>
                      Billing Details
                    </h4>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Card Information</label>
                      <div className="relative">
                        <input type="text" required className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-5 focus:outline-none focus:border-purple-500 transition-all font-bold placeholder:text-slate-300" placeholder="0000 0000 0000 0000" value={formData.cc} onChange={(e) => setFormData({...formData, cc: e.target.value})} />
                        <div className="absolute right-6 top-1/2 -translate-y-1/2 flex gap-2">
                          <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-3 grayscale opacity-30" />
                          <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-4 grayscale opacity-30" />
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Expiry (MM/YY)</label>
                        <input type="text" required className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-5 focus:outline-none focus:border-purple-500 transition-all font-bold placeholder:text-slate-300" placeholder="09 / 28" value={formData.expiry} onChange={(e) => setFormData({...formData, expiry: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">CVC Code</label>
                        <input type="text" required className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-5 focus:outline-none focus:border-purple-500 transition-all font-bold placeholder:text-slate-300" placeholder="123" value={formData.cvc} onChange={(e) => setFormData({...formData, cvc: e.target.value})} />
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-16 bg-blue-50/30 rounded-[3rem] border-2 border-dashed border-blue-200">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-16 mx-auto mb-6" />
                  <p className="text-slate-600 font-bold max-w-sm mx-auto leading-relaxed">Fast, secure checkout with PayPal for Axis members.</p>
                </div>
              )}

              <button 
                disabled={isProcessing}
                type="submit"
                className={`w-full font-black py-6 rounded-[2rem] shadow-2xl transition-all active:scale-95 hover:brightness-110 text-xl uppercase tracking-widest flex items-center justify-center gap-3 ${paymentMethod === 'card' ? 'social-gradient text-white' : 'bg-[#0070ba] text-white'} ${isProcessing ? 'opacity-70 cursor-wait' : ''}`}
              >
                {isProcessing ? (
                  <>
                    <svg className="animate-spin h-6 w-6 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    SECURELY PROCESSING...
                  </>
                ) : (
                  <>ACTIVATE MY ENROLLMENT • {displayPrice}</>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Checkout;
