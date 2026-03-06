'use client';

import { useState, useEffect } from 'react';
import { Zap } from 'lucide-react';
import Link from 'next/link';

export function CreditBadge() {
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    async function fetchBalance() {
      try {
        const balanceRes = await fetch('/api/credits');
        if (balanceRes.ok) {
          const data = await balanceRes.json();
          setBalance(data.balance);
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchBalance();
    
    // Refresh balance every 30 seconds
    const interval = setInterval(fetchBalance, 30000);
    return () => clearInterval(interval);
  }, []);

  if (balance === null) return null;

  return (
    <Link 
      href="/dashboard/settings" 
      className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-orange/10 border border-brand-orange/20 text-brand-orange hover:bg-brand-orange/20 transition-all group"
    >
      <Zap size={14} className="group-hover:scale-110 transition-transform" />
      <span className="text-xs font-bold">{balance} Credits</span>
    </Link>
  );
}
