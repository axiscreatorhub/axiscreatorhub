'use client';

import { useState, useEffect } from 'react';
import { Save, Loader2, Globe, Lock, ExternalLink, Palette, Share2, Sparkles, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

export function MediaKitSettings() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratingPitch, setIsGeneratingPitch] = useState(false);
  const [slug, setSlug] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [theme, setTheme] = useState('MODERN');
  const [pitch, setPitch] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/media-kit');
        if (res.ok) {
          const json = await res.json();
          setData(json);
          setSlug(json.profile.slug || '');
          setIsPublic(json.mediaKit?.isPublic || false);
          setTheme(json.mediaKit?.theme || 'MODERN');
          setPitch(json.profile.pitch || '');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleGeneratePitch = async () => {
    if (!data?.profile) return;
    setIsGeneratingPitch(true);
    try {
      const prompt = `
        Create a professional brand pitch for a creator media kit.
        Brand Name: ${data.profile.name}
        Niche: ${data.profile.niche}
        Audience: ${data.profile.audience}
        Bio: ${data.profile.bio}
        
        The pitch should be concise, persuasive, and highlight why brands should collaborate with this creator.
      `;

      const res = await fetch('/api/ai/write', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt,
          type: 'GENERAL',
          context: 'Brand Pitch'
        }),
      });

      if (res.ok) {
        const json = await res.json();
        setPitch(json.text);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingPitch(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/media-kit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, isPublic, theme, pitch }),
      });
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-brand-purple" size={32} /></div>;

  const publicUrl = `${window.location.origin}/p/${slug}`;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Visibility Section */}
          <div className="glass p-8 rounded-[32px] border-brand-purple/10 space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  {isPublic ? <Globe className="text-emerald-500" size={20} /> : <Lock className="text-zinc-500" size={20} />}
                  Public Visibility
                </h3>
                <p className="text-xs text-zinc-500">Enable this to make your media kit accessible via a public link.</p>
              </div>
              <button 
                onClick={() => setIsPublic(!isPublic)}
                className={cn(
                  "w-14 h-8 rounded-full transition-all relative",
                  isPublic ? "bg-emerald-500" : "bg-white/10"
                )}
              >
                <div className={cn(
                  "absolute top-1 w-6 h-6 rounded-full bg-white transition-all",
                  isPublic ? "left-7" : "left-1"
                )} />
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Custom URL Slug</label>
              <div className="flex items-center gap-2">
                <div className="h-12 px-4 bg-white/5 border border-white/10 rounded-2xl flex items-center text-zinc-500 text-sm">
                  axis.ai/p/
                </div>
                <input 
                  type="text" 
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="your-name"
                  className="flex-1 h-12 bg-white/5 border border-white/10 rounded-2xl px-4 text-sm text-white focus:outline-none focus:border-brand-purple/50 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Pitch Section */}
          <div className="glass p-8 rounded-[32px] border-brand-purple/10 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <FileText className="text-brand-purple" size={20} />
                Brand Pitch
              </h3>
              <button 
                onClick={handleGeneratePitch}
                disabled={isGeneratingPitch}
                className="flex items-center gap-2 text-xs font-bold text-brand-purple hover:opacity-80 transition-all disabled:opacity-50"
              >
                {isGeneratingPitch ? <Loader2 className="animate-spin" size={14} /> : <Sparkles size={14} />}
                Generate with AI
              </button>
            </div>
            <textarea 
              value={pitch}
              onChange={(e) => setPitch(e.target.value)}
              placeholder="Your professional brand pitch..."
              rows={6}
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white focus:outline-none focus:border-brand-purple/50 transition-all resize-none"
            />
          </div>

          {/* Theme Section */}
          <div className="glass p-8 rounded-[32px] border-brand-purple/10 space-y-6">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Palette className="text-brand-purple" size={20} />
              Profile Theme
            </h3>
            <div className="grid grid-cols-3 gap-4">
              {['MODERN', 'MINIMAL', 'BOLD'].map((t) => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  className={cn(
                    "p-4 rounded-2xl border transition-all text-center space-y-2",
                    theme === t 
                      ? "bg-brand-purple/10 border-brand-purple text-brand-purple" 
                      : "bg-white/5 border-white/10 text-zinc-500 hover:text-white"
                  )}
                >
                  <div className={cn(
                    "w-full aspect-video rounded-lg mb-2",
                    t === 'MODERN' ? "bg-gradient-to-br from-brand-purple to-brand-blue" :
                    t === 'MINIMAL' ? "bg-zinc-800" : "bg-brand-pink"
                  )} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">{t}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass p-8 rounded-[32px] border-brand-purple/10 space-y-6 sticky top-24">
            <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500">Live Preview</h3>
            <div className="aspect-[3/4] bg-white/5 rounded-2xl border border-white/10 overflow-hidden relative group">
               <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 z-10">
                  <a href={publicUrl} target="_blank" className="p-3 rounded-full bg-white text-black">
                    <ExternalLink size={20} />
                  </a>
               </div>
               {/* Mock Profile */}
               <div className="p-6 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-brand-purple/20 mx-auto" />
                  <div className="h-4 w-24 bg-white/10 mx-auto rounded-full" />
                  <div className="h-2 w-32 bg-white/5 mx-auto rounded-full" />
                  <div className="grid grid-cols-2 gap-2 pt-4">
                    <div className="h-12 bg-white/5 rounded-xl" />
                    <div className="h-12 bg-white/5 rounded-xl" />
                  </div>
               </div>
            </div>
            
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="w-full py-4 rounded-2xl bg-brand-purple text-white font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all"
            >
              {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
              Save Changes
            </button>

            {slug && isPublic && (
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(publicUrl);
                  alert('Link copied!');
                }}
                className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold flex items-center justify-center gap-2 hover:bg-white/10 transition-all"
              >
                <Share2 size={18} />
                Copy Public Link
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
