'use client';

import { useState } from 'react';
import { Zap, Loader2, CreditCard } from 'lucide-react';
import axios from 'axios';
import { useUser } from '@clerk/nextjs';

export function BillingSettings({ currentBalance }: { currentBalance: number }) {
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);

  const handleTopUp = async (amount: number) => {
    if (!user?.primaryEmailAddress?.emailAddress) return;
    
    setIsLoading(true);
    try {
      const response = await axios.post('/api/payments/paystack', {
        amount,
        email: user.primaryEmailAddress.emailAddress,
      });

      const { authorization_url } = response.data.data;
      window.location.href = authorization_url;
    } catch (error) {
      console.error('Payment error:', error);
      alert('Failed to initialize payment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass p-8 rounded-3xl space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <Zap className="text-brand-orange" size={20} /> Credit Balance
        </h3>
        <span className="text-2xl font-black text-white">{currentBalance}</span>
      </div>

      <div className="space-y-4">
        <p className="text-sm text-zinc-400">Top up your credits to continue generating viral content.</p>
        
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => handleTopUp(1000)}
            disabled={isLoading}
            className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-brand-orange/50 transition-all text-center group"
          >
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Starter</p>
            <p className="text-lg font-black text-white">100 Credits</p>
            <p className="text-sm text-brand-orange font-bold mt-2">₦1,000</p>
          </button>

          <button
            onClick={() => handleTopUp(5000)}
            disabled={isLoading}
            className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-brand-orange/50 transition-all text-center group"
          >
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Pro</p>
            <p className="text-lg font-black text-white">600 Credits</p>
            <p className="text-sm text-brand-orange font-bold mt-2">₦5,000</p>
          </button>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center gap-2 text-zinc-500 text-sm animate-pulse">
            <Loader2 size={16} className="animate-spin" /> Redirecting to Paystack...
          </div>
        )}
      </div>

      <div className="pt-6 border-t border-white/5">
        <div className="flex items-center gap-3 text-xs text-zinc-500">
          <CreditCard size={14} /> Secure payments powered by Paystack
        </div>
      </div>
    </div>
  );
}
