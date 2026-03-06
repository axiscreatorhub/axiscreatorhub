'use client';

import { useState } from 'react';
import { 
  Sparkles, 
  Video, 
  Youtube, 
  Instagram, 
  Palette, 
  Calendar,
  Loader2,
  Copy,
  Check,
  Send,
  ArrowRight,
  MessageSquare
} from 'lucide-react';
import { cn } from '@/lib/utils';

const TOOLS = [
  {
    id: 'short-form',
    name: 'Short Form Ideas',
    description: 'Viral hooks & concepts for TikTok/Reels',
    icon: Video,
    color: 'text-brand-purple',
    bg: 'bg-brand-purple/10',
    prompt: 'Generate 5 viral short-form video ideas for:'
  },
  {
    id: 'youtube',
    name: 'YouTube Scripts',
    description: 'Full video outlines and scripts',
    icon: Youtube,
    color: 'text-brand-blue',
    bg: 'bg-brand-blue/10',
    prompt: 'Write a detailed YouTube video script about:'
  },
  {
    id: 'instagram',
    name: 'IG Captions',
    description: 'Engaging captions with hashtags',
    icon: Instagram,
    color: 'text-brand-pink',
    bg: 'bg-brand-pink/10',
    prompt: 'Write 3 engaging Instagram captions for:'
  },
  {
    id: 'brand-voice',
    name: 'Brand Voice',
    description: 'Define your unique creator persona',
    icon: Palette,
    color: 'text-brand-orange',
    bg: 'bg-brand-orange/10',
    prompt: 'Analyze and define a unique brand voice for a creator who:'
  },
  {
    id: 'calendar',
    name: 'Content Calendar',
    description: 'Weekly posting schedule',
    icon: Calendar,
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
    prompt: 'Create a 7-day content calendar for:'
  }
];

export function AIStudio() {
  const [selectedTool, setSelectedTool] = useState(TOOLS[0]);
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!input.trim()) return;
    setIsGenerating(true);
    setResult('');
    setError(null);

    try {
      const res = await fetch('/api/ai/write', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: `${selectedTool.prompt} ${input}`,
          type: 'GENERAL',
          context: `AI Studio: ${selectedTool.name}`
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setResult(data.text);
      } else if (res.status === 403) {
        const data = await res.json();
        setError(data.message || 'Insufficient credits');
      } else {
        setError('Failed to generate content. Please try again.');
      }
    } catch (err) {
      console.error('Generation failed', err);
      setError('An unexpected error occurred.');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 h-full">
      {/* Left Panel: Tools & Config */}
      <div className="w-full lg:w-[400px] flex flex-col gap-6">
        <div className="glass p-6 rounded-[32px] border-white/5 space-y-6">
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Select Tool</h3>
            <div className="grid grid-cols-1 gap-2">
              {TOOLS.map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => setSelectedTool(tool)}
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-2xl border transition-all text-left group",
                    selectedTool.id === tool.id 
                      ? "bg-brand-purple/10 border-brand-purple/50 text-brand-purple" 
                      : "bg-white/5 border-white/10 text-zinc-400 hover:border-white/20"
                  )}
                >
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110", tool.bg, tool.color)}>
                    <tool.icon size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold">{tool.name}</p>
                    <p className="text-[10px] text-zinc-500">{tool.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="h-px bg-white/5" />

          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Configuration</h3>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 ml-1">Topic / Context</label>
              <textarea 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="What should I write about?"
                rows={5}
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white focus:outline-none focus:border-brand-purple/50 transition-all resize-none"
              />
            </div>
            
            <button 
              onClick={handleGenerate}
              disabled={isGenerating || !input.trim()}
              className="w-full py-4 rounded-2xl bg-brand-purple text-white font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 transition-all shadow-lg shadow-brand-purple/20"
            >
              {isGenerating ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
              Generate with AI
            </button>

            {error && (
              <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex flex-col gap-2">
                <p>{error}</p>
                {error.includes('credits') && (
                  <a href="/pricing" className="text-brand-orange font-bold hover:underline">
                    Buy Credits →
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Panel: Results */}
      <div className="flex-1 glass rounded-[40px] border-white/5 flex flex-col min-h-[500px] overflow-hidden">
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", selectedTool.bg, selectedTool.color)}>
              <selectedTool.icon size={16} />
            </div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400">{selectedTool.name} Output</h3>
          </div>
          {result && (
            <div className="flex items-center gap-2">
              <button 
                onClick={copyToClipboard}
                className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-zinc-400 hover:text-white transition-all flex items-center gap-2 text-xs font-bold"
              >
                {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                {copied ? 'Copied!' : 'Copy Result'}
              </button>
            </div>
          )}
        </div>
        
        <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
          {result ? (
            <div className="prose prose-invert prose-sm max-w-none whitespace-pre-wrap text-zinc-300 leading-relaxed font-medium">
              {result}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center text-zinc-600">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                <selectedTool.icon size={32} className="opacity-20" />
              </div>
              <h4 className="text-lg font-bold text-zinc-500 mb-2">Ready to create?</h4>
              <p className="text-sm max-w-xs">Configure your tool on the left and click generate to see the magic happen.</p>
            </div>
          )}
        </div>

        {result && (
          <div className="p-6 border-t border-white/5 bg-white/[0.01] flex justify-center">
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 flex items-center gap-2">
              <Sparkles size={12} /> Generated by Gemini 3.1 Flash
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
