import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';

const Pricing = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('axis_token');
  const email = localStorage.getItem('axis_email');
  const apiUrl = import.meta.env.VITE_API_URL || '';

  const handleSubscribe = async (tier) => {
    if (!token || !email) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/billing/paystack/init`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'x-user-email': email
        },
        body: JSON.stringify({
          amount: tier.priceValue, // in kobo
          planName: tier.name
        })
      });

      const data = await response.json();
      if (data.authorization_url) {
        window.location.href = data.authorization_url;
      } else {
        throw new Error('Failed to initialize payment');
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const tiers = [
    {
      name: "Starter",
      price: "R0",
      priceValue: 0,
      description: "Perfect for new creators just starting their journey.",
      features: [
        "10 AI generations / mo",
        "Basic content tracking",
        "1 social media account",
        "Community support"
      ],
      cta: "Start for Free",
      highlight: false
    },
    {
      name: "Pro",
      price: "R299",
      priceValue: 29900,
      description: "The sweet spot for growing influencers and creators.",
      features: [
        "Unlimited AI generations",
        "Advanced performance analytics",
        "Up to 5 social accounts",
        "Brand deal tracker",
        "Priority email support"
      ],
      cta: "Go Pro",
      highlight: true
    },
    {
      name: "Studio",
      price: "R999",
      priceValue: 99900,
      description: "For established creators and small management teams.",
      features: [
        "Team collaboration (3 seats)",
        "Unlimited social accounts",
        "Custom reporting tools",
        "Dedicated account manager",
        "Early access to new features"
      ],
      cta: "Get Studio",
      highlight: false
    }
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans">
      {/* Header */}
      <header className="py-24 text-center px-4 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-pink-500/10 blur-[120px] rounded-full"></div>
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter outfit mb-6 relative z-10">Simple, Honest <span className="text-gradient">Pricing</span></h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto relative z-10">
          No hidden fees. No complicated tiers. Just the tools you need to manage your creative career.
        </p>
      </header>

      {/* Pricing Grid */}
      <main className="max-w-7xl mx-auto px-6 pb-32">
        <div className="grid md:grid-cols-3 gap-8">
          {tiers.map((tier, idx) => (
            <div 
              key={idx} 
              className={`relative p-10 rounded-[2.5rem] border flex flex-col transition-all duration-500 ${
                tier.highlight 
                ? 'border-pink-500 bg-pink-500/5 shadow-2xl shadow-pink-500/10 scale-105 z-10' 
                : 'border-white/10 bg-white/5 hover:border-white/20'
              }`}
            >
              {tier.highlight && (
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-pink-500 to-violet-600 text-white text-[10px] font-black uppercase tracking-[0.2em] px-6 py-2 rounded-full shadow-lg">
                  Most Popular
                </span>
              )}
              
              <div className="mb-8">
                <h3 className="text-2xl font-bold outfit mb-2">{tier.name}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{tier.description}</p>
              </div>

              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-6xl font-black outfit">{tier.price}</span>
                <span className="text-slate-500 font-bold uppercase tracking-widest text-xs">/mo</span>
              </div>

              <ul className="space-y-5 mb-12 flex-grow">
                {tier.features.map((feature, fIdx) => (
                  <li key={fIdx} className="flex items-start gap-4 text-slate-300 text-sm">
                    <CheckCircle2 className="w-5 h-5 text-pink-500 mt-0.5 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <button 
                onClick={() => handleSubscribe(tier)}
                className={`w-full py-5 rounded-2xl font-bold text-lg transition-all ${
                  tier.highlight 
                  ? 'bg-gradient-to-r from-pink-500 to-violet-600 text-white hover:scale-[1.02] shadow-xl shadow-pink-500/20' 
                  : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {tier.cta}
              </button>
            </div>
          ))}
        </div>

        {/* Payment Methods & Info */}
        <div className="mt-20 text-center space-y-8">
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 sm:gap-8 px-8 py-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              <span className="text-sm font-bold text-slate-700">Paystack available now</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-slate-200"></div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
              <span className="text-sm font-bold text-slate-700">LemonSqueezy pending (global taxes)</span>
            </div>
          </div>

          <div className="max-w-2xl mx-auto space-y-4">
            <p className="text-slate-500 text-sm italic">
              * All plans support "Cancel Anytime". We believe in providing value, not trapping you in contracts.
            </p>
            <p className="text-slate-400 text-xs">
              Prices are shown in placeholder format (R___). Final pricing will be determined based on your region and local currency at checkout.
            </p>
          </div>
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="border-t border-slate-100 py-12 text-center">
        <div className="flex justify-center gap-8 text-sm font-medium text-slate-500 mb-4">
          <a href="/" className="hover:text-indigo-600">Home</a>
          <a href="/legal/terms" className="hover:text-indigo-600">Terms</a>
          <a href="/legal/privacy" className="hover:text-indigo-600">Privacy</a>
        </div>
        <p className="text-slate-400 text-xs">© {new Date().getFullYear()} AXIS Creator Hub. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Pricing;
