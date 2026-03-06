'use client';

import { useState } from 'react';
import { Check, Sparkles, Zap, Rocket, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';

const PACKAGES = [
  {
    id: 'starter',
    name: 'Starter',
    price: '₦9,900',
    credits: 100,
    description: 'Perfect for new creators starting their journey.',
    features: [
      '100 AI Credits',
      'AI Script Generator',
      'Basic Asset Generation',
      'Brand Profile Setup',
      'Email Support'
    ],
    icon: Rocket,
    color: 'text-brand-blue',
    bg: 'bg-brand-blue/10'
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '₦19,900',
    credits: 250,
    description: 'For active creators who need more power.',
    features: [
      '250 AI Credits',
      'Priority AI Generation',
      'Advanced Storyboarding',
      'Media Kit Builder',
      'Priority Support'
    ],
    icon: Zap,
    color: 'text-brand-purple',
    bg: 'bg-brand-purple/10',
    popular: true
  },
  {
    id: 'studio',
    name: 'Studio',
    price: '₦49,900',
    credits: 700,
    description: 'The ultimate toolkit for professional studios.',
    features: [
      '700 AI Credits',
      'Unlimited Brand Profiles',
      'Custom Media Kit Themes',
      'Bulk Asset Generation',
      'Dedicated Account Manager'
    ],
    icon: Crown,
    color: 'text-brand-pink',
    bg: 'bg-brand-pink/10'
  }
];

export default function PricingPage() {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handlePurchase = async (packageId: string) => {
    setLoadingId(packageId);
    try {
      const res = await fetch('/api/payments/paystack', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packageId }),
      });

      const data = await res.json();
      if (data.status && data.data.authorization_url) {
        window.location.href = data.data.authorization_url;
      } else {
        alert('Failed to initialize payment. Please try again.');
      }
    } catch (err) {
      console.error('Payment error:', err);
      alert('An unexpected error occurred.');
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white py-24 px-6">
      <div className="max-w-7xl mx-auto space-y-16">
        <div className="text-center space-y-4">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter">
            FUEL YOUR <span className="text-brand-purple">CREATIVITY</span>
          </h1>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            Choose the plan that fits your growth. Scale your content production with AI-powered tools.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PACKAGES.map((pkg) => (
            <div 
              key={pkg.id}
              className={cn(
                "relative glass p-8 rounded-[40px] border-white/5 flex flex-col transition-all hover:scale-[1.02]",
                pkg.popular && "border-brand-purple/50 shadow-2xl shadow-brand-purple/10"
              )}
            >
              {pkg.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-brand-purple text-white text-[10px] font-black uppercase tracking-widest px-4 py-1 rounded-full">
                  Most Popular
                </div>
              )}

              <div className="mb-8">
                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-6", pkg.bg, pkg.color)}>
                  <pkg.icon size={24} />
                </div>
                <h3 className="text-2xl font-bold mb-2">{pkg.name}</h3>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-4xl font-black">{pkg.price}</span>
                  <span className="text-zinc-500 text-sm font-medium">/ one-time</span>
                </div>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  {pkg.description}
                </p>
              </div>

              <div className="flex-1 space-y-4 mb-10">
                <div className="flex items-center gap-3 text-brand-orange">
                  <Sparkles size={18} />
                  <span className="text-sm font-bold uppercase tracking-widest">{pkg.credits} Credits Included</span>
                </div>
                <div className="h-px bg-white/5" />
                {pkg.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-3 text-sm text-zinc-300">
                    <Check size={16} className="text-emerald-500 shrink-0" />
                    {feature}
                  </div>
                ))}
              </div>

              <button
                onClick={() => handlePurchase(pkg.id)}
                disabled={loadingId !== null}
                className={cn(
                  "w-full py-4 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2",
                  pkg.popular 
                    ? "bg-brand-purple text-white hover:opacity-90" 
                    : "bg-white/5 border border-white/10 text-white hover:bg-white/10"
                )}
              >
                {loadingId === pkg.id ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Get Started with {pkg.name}</>
                )}
              </button>
            </div>
          ))}
        </div>

        <div className="text-center">
          <p className="text-zinc-500 text-sm">
            Secure payments processed by <span className="text-white font-bold">Paystack</span>. 
            All plans are one-time purchases.
          </p>
        </div>
      </div>
    </div>
  );
}
