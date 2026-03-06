'use client';

import { useState } from 'react';
import { 
  Video, 
  Sparkles, 
  Loader2, 
  Copy, 
  Check, 
  Smartphone, 
  Clapperboard, 
  Type, 
  Zap,
  Layout
} from 'lucide-react';
import { cn } from '@/lib/utils';

const PLATFORMS = [
  { id: 'TIKTOK', name: 'TikTok', icon: Smartphone },
  { id: 'REELS', name: 'Instagram Reels', icon: Clapperboard },
  { id: 'SHORTS', name: 'YouTube Shorts', icon: Zap },
];

const TONES = [
  { id: 'ENERGETIC', name: 'Energetic' },
  { id: 'EDUCATIONAL', name: 'Educational' },
  { id: 'STORYTELLING', name: 'Storytelling' },
  { id: 'COMEDIC', name: 'Comedic' },
];

export function VideoCreator() {
  const [topic, setTopic] = useState('');
  const [platform, setPlatform] = useState('TIKTOK');
  const [tone, setTone] = useState('ENERGETIC');
  const [isGenerating, setIsGenerating] = useState(false);
  const [script, setScript] = useState<any>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setIsGenerating(true);
    setScript(null);
    setError(null);

    try {
      const prompt = `
        Create a viral short-form video script for ${platform}.
        Topic: ${topic}
        Tone: ${tone}
        
        Please provide the response in JSON format with the following structure:
        {
          "hook": "A powerful 3-second hook",
          "storyline": "The main narrative flow",
          "shotList": ["Shot 1 description", "Shot 2 description", ...],
          "caption": "Engaging caption with hashtags"
        }
      `;

      const res = await fetch('/api/ai/write', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt,
          type: 'GENERAL',
          context: 'Video Creator'
        }),
      });

      if (res.ok) {
        const data = await res.json();
        // Try to parse JSON from the text response
        try {
          const jsonMatch = data.text.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            setScript(JSON.parse(jsonMatch[0]));
          } else {
            // Fallback if not JSON
            setScript({
              hook: "Generated Hook",
              storyline: data.text,
              shotList: ["See storyline for details"],
              caption: "Check result"
            });
          }
        } catch (e) {
          setScript({
            hook: "Generated Hook",
            storyline: data.text,
            shotList: ["See storyline for details"],
            caption: "Check result"
          });
        }
      } else if (res.status === 403) {
        const data = await res.json();
        setError(data.message || 'Insufficient credits');
      } else {
        setError('Failed to generate script. Please try again.');
      }
    } catch (err) {
      console.error('Generation failed', err);
      setError('An unexpected error occurred.');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left: Configuration */}
      <div className="lg:col-span-4 space-y-6">
        <div className="glass p-8 rounded-[32px] border-white/5 space-y-8">
          <div className="space-y-4">
            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Platform</label>
            <div className="grid grid-cols-1 gap-2">
              {PLATFORMS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPlatform(p.id)}
                  className={cn(
                    "flex items-center gap-3 p-4 rounded-2xl border transition-all text-left",
                    platform === p.id 
                      ? "bg-brand-pink/10 border-brand-pink/50 text-brand-pink" 
                      : "bg-white/5 border-white/10 text-zinc-400 hover:border-white/20"
                  )}
                >
                  <p.icon size={18} />
                  <span className="text-sm font-bold">{p.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Topic</label>
            <textarea 
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="What is your video about?"
              rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white focus:outline-none focus:border-brand-pink/50 transition-all resize-none"
            />
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Tone</label>
            <div className="grid grid-cols-2 gap-2">
              {TONES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTone(t.id)}
                  className={cn(
                    "p-3 rounded-xl border text-xs font-bold transition-all",
                    tone === t.id 
                      ? "bg-brand-pink/10 border-brand-pink/50 text-brand-pink" 
                      : "bg-white/5 border-white/10 text-zinc-500 hover:border-white/20"
                  )}
                >
                  {t.name}
                </button>
              ))}
            </div>
          </div>

          <button 
            onClick={handleGenerate}
            disabled={isGenerating || !topic.trim()}
            className="w-full py-4 rounded-2xl bg-brand-pink text-white font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 transition-all shadow-lg shadow-brand-pink/20"
          >
            {isGenerating ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
            Generate Script
          </button>

          {error && (
            <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center">
              {error}
            </div>
          )}
        </div>
      </div>

      {/* Right: Output */}
      <div className="lg:col-span-8 space-y-6">
        {script ? (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Hook Card */}
            <div className="glass p-8 rounded-[32px] border-brand-pink/20 relative group">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2 text-brand-pink">
                  <Zap size={18} className="fill-brand-pink" />
                  <span className="text-xs font-black uppercase tracking-widest">The Hook (First 3s)</span>
                </div>
                <button onClick={() => copyToClipboard(script.hook, 'hook')} className="text-zinc-500 hover:text-white transition-colors">
                  {copied === 'hook' ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
                </button>
              </div>
              <p className="text-xl font-bold text-white leading-relaxed italic">"{script.hook}"</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Storyline */}
              <div className="glass p-8 rounded-[32px] border-white/5">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-2 text-zinc-400">
                    <Clapperboard size={18} />
                    <span className="text-xs font-black uppercase tracking-widest">Storyline</span>
                  </div>
                  <button onClick={() => copyToClipboard(script.storyline, 'story')} className="text-zinc-500 hover:text-white transition-colors">
                    {copied === 'story' ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
                  </button>
                </div>
                <p className="text-sm text-zinc-300 leading-relaxed">{script.storyline}</p>
              </div>

              {/* Shot List */}
              <div className="glass p-8 rounded-[32px] border-white/5">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-2 text-zinc-400">
                    <Layout size={18} />
                    <span className="text-xs font-black uppercase tracking-widest">Shot List</span>
                  </div>
                </div>
                <div className="space-y-3">
                  {script.shotList.map((shot: string, i: number) => (
                    <div key={i} className="flex gap-3 text-sm">
                      <span className="text-brand-pink font-black">{i + 1}.</span>
                      <span className="text-zinc-400">{shot}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Caption */}
            <div className="glass p-8 rounded-[32px] border-white/5">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2 text-zinc-400">
                  <Type size={18} />
                  <span className="text-xs font-black uppercase tracking-widest">Caption & Hashtags</span>
                </div>
                <button onClick={() => copyToClipboard(script.caption, 'caption')} className="text-zinc-500 hover:text-white transition-colors">
                  {copied === 'caption' ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
                </button>
              </div>
              <p className="text-sm text-zinc-300 italic">"{script.caption}"</p>
            </div>
          </div>
        ) : (
          <div className="glass rounded-[40px] border-white/5 h-full min-h-[500px] flex flex-col items-center justify-center text-center p-12">
            <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-8">
              <Video size={40} className="text-zinc-700" />
            </div>
            <h3 className="text-xl font-bold text-zinc-500 mb-2">Ready to go viral?</h3>
            <p className="text-sm text-zinc-600 max-w-sm">
              Enter your video topic on the left to generate a high-converting script with hooks and shot lists.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
