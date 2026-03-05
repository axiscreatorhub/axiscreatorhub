'use client';

import { useState, useEffect } from 'react';
import { Save, Loader2, CheckCircle2 } from 'lucide-react';

interface BrandProfile {
  name: string;
  tone: string;
  niche: string;
  audience: string;
  bio: string;
}

export function BrandKitForm() {
  const [profile, setProfile] = useState<BrandProfile>({
    name: '',
    tone: '',
    niche: '',
    audience: '',
    bio: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch('/api/brand-profile');
        if (res.ok) {
          const data = await res.json();
          if (data) setProfile(data);
        }
      } catch (err) {
        console.error('Failed to fetch profile', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    try {
      const res = await fetch('/api/brand-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });

      if (res.ok) {
        setMessage({ type: 'success', text: 'Brand identity updated successfully!' });
      } else {
        throw new Error('Failed to save');
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to save brand identity.' });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-20">
        <Loader2 className="animate-spin text-brand-purple" size={32} />
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-8">
      {message && (
        <div className={`p-4 rounded-2xl flex items-center gap-3 text-sm font-medium ${
          message.type === 'success' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'
        }`}>
          {message.type === 'success' && <CheckCircle2 size={18} />}
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Creator Name / Brand Name</label>
          <input 
            type="text" 
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            placeholder="e.g. Alex Creator"
            className="w-full h-12 bg-white/5 border border-white/10 rounded-2xl px-4 text-sm text-white focus:outline-none focus:border-brand-purple/50 transition-all"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Brand Tone</label>
          <input 
            type="text" 
            value={profile.tone}
            onChange={(e) => setProfile({ ...profile, tone: e.target.value })}
            placeholder="e.g. Energetic, Professional, Witty"
            className="w-full h-12 bg-white/5 border border-white/10 rounded-2xl px-4 text-sm text-white focus:outline-none focus:border-brand-purple/50 transition-all"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Niche / Industry</label>
          <input 
            type="text" 
            value={profile.niche}
            onChange={(e) => setProfile({ ...profile, niche: e.target.value })}
            placeholder="e.g. Tech Reviews, Fitness, Travel"
            className="w-full h-12 bg-white/5 border border-white/10 rounded-2xl px-4 text-sm text-white focus:outline-none focus:border-brand-purple/50 transition-all"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Target Audience</label>
          <input 
            type="text" 
            value={profile.audience}
            onChange={(e) => setProfile({ ...profile, audience: e.target.value })}
            placeholder="e.g. Gen Z Entrepreneurs, Tech Enthusiasts"
            className="w-full h-12 bg-white/5 border border-white/10 rounded-2xl px-4 text-sm text-white focus:outline-none focus:border-brand-purple/50 transition-all"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Short Bio / Brand Story</label>
        <textarea 
          value={profile.bio}
          onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
          placeholder="Tell us about your brand..."
          rows={4}
          className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white focus:outline-none focus:border-brand-purple/50 transition-all resize-none"
        />
      </div>

      <button 
        type="submit"
        disabled={isSaving}
        className="btn-primary flex items-center gap-2 w-full md:w-auto"
      >
        {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
        Save Brand Identity
      </button>
    </form>
  );
}
