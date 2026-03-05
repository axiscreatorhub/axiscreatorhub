'use client';

import { useState } from 'react';
import { FileText, Sparkles, Loader2, Copy, Check, Send } from 'lucide-react';

export function ScriptGenerator() {
  const [topic, setTopic] = useState('');
  const [format, setFormat] = useState('TIKTOK');
  const [tone, setTone] = useState('ENERGETIC');
  const [isGenerating, setIsGenerating] = useState(false);
  const [script, setScript] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setIsGenerating(true);
    setScript('');

    try {
      const res = await fetch('/api/ai/write', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: `Write a high-converting ${format} script about: ${topic}. Tone: ${tone}. Include a strong hook, value-packed body, and clear call-to-action.`,
          type: 'SCRIPT',
          context: `Format: ${format}, Tone: ${tone}`
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setScript(data.text);
      }
    } catch (err) {
      console.error('Generation failed', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(script);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        <div className="glass p-8 rounded-[32px] border-brand-purple/10 space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Video Topic</label>
            <textarea 
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="What is your video about?"
              rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white focus:outline-none focus:border-brand-purple/50 transition-all resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Platform</label>
              <select 
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                className="w-full h-12 bg-white/5 border border-white/10 rounded-2xl px-4 text-sm text-white focus:outline-none focus:border-brand-purple/50 transition-all appearance-none"
              >
                <option value="TIKTOK">TikTok</option>
                <option value="REELS">Instagram Reels</option>
                <option value="SHORTS">YouTube Shorts</option>
                <option value="LONG_FORM">Long Form</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Tone</label>
              <select 
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full h-12 bg-white/5 border border-white/10 rounded-2xl px-4 text-sm text-white focus:outline-none focus:border-brand-purple/50 transition-all appearance-none"
              >
                <option value="ENERGETIC">Energetic</option>
                <option value="EDUCATIONAL">Educational</option>
                <option value="WITTY">Witty</option>
                <option value="DRAMATIC">Dramatic</option>
              </select>
            </div>
          </div>

          <button 
            onClick={handleGenerate}
            disabled={isGenerating || !topic.trim()}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            {isGenerating ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
            Generate Script
          </button>
        </div>
      </div>

      <div className="glass rounded-[32px] border-brand-purple/10 flex flex-col min-h-[400px]">
        <div className="p-6 border-b border-white/5 flex justify-between items-center">
          <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500">Generated Output</h3>
          {script && (
            <button 
              onClick={copyToClipboard}
              className="p-2 rounded-lg bg-white/5 border border-white/10 text-zinc-400 hover:text-white transition-all flex items-center gap-2 text-xs"
            >
              {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          )}
        </div>
        <div className="flex-1 p-8 overflow-y-auto">
          {script ? (
            <div className="prose prose-invert prose-sm max-w-none whitespace-pre-wrap text-zinc-300 leading-relaxed">
              {script}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center text-zinc-600">
              <FileText size={48} className="mb-4 opacity-20" />
              <p className="text-sm">Your generated script will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
