'use client';

import { useState } from 'react';
import { PenTool, Sparkles, Loader2, Copy, Check, Send, Type, Mail, Hash, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

const CONTENT_TYPES = [
  { id: 'POST', name: 'Social Post', icon: Hash, prompt: 'Write an engaging social media post about:' },
  { id: 'EMAIL', name: 'Email', icon: Mail, prompt: 'Write a professional email about:' },
  { id: 'BLOG', name: 'Blog Post', icon: FileText, prompt: 'Write a detailed blog post about:' },
  { id: 'CAPTION', name: 'Caption', icon: Type, prompt: 'Write a catchy caption for:' },
];

export function WritingTool() {
  const [topic, setTopic] = useState('');
  const [contentType, setContentType] = useState('POST');
  const [tone, setTone] = useState('PROFESSIONAL');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setIsGenerating(true);
    setResult('');
    setError(null);

    const selectedType = CONTENT_TYPES.find(t => t.id === contentType);
    const basePrompt = selectedType?.prompt || 'Write about:';

    try {
      const res = await fetch('/api/ai/write', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: `${basePrompt} ${topic}. Tone: ${tone}.`,
          type: 'GENERAL',
          context: `Content Type: ${contentType}, Tone: ${tone}`
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        <div className="glass p-8 rounded-[32px] border-brand-purple/10 space-y-6">
          <div className="space-y-4">
            <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Content Type</label>
            <div className="grid grid-cols-2 gap-3">
              {CONTENT_TYPES.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setContentType(type.id)}
                  className={cn(
                    "flex items-center gap-3 p-4 rounded-2xl border transition-all text-left",
                    contentType === type.id 
                      ? "bg-brand-purple/10 border-brand-purple/50 text-brand-purple" 
                      : "bg-white/5 border-white/10 text-zinc-400 hover:border-white/20"
                  )}
                >
                  <type.icon size={18} />
                  <span className="text-sm font-bold">{type.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Topic or Subject</label>
            <textarea 
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="What should I write about?"
              rows={4}
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white focus:outline-none focus:border-brand-purple/50 transition-all resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Tone of Voice</label>
            <select 
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full h-12 bg-white/5 border border-white/10 rounded-2xl px-4 text-sm text-white focus:outline-none focus:border-brand-purple/50 transition-all appearance-none"
            >
              <option value="PROFESSIONAL">Professional</option>
              <option value="CASUAL">Casual</option>
              <option value="PERSUASIVE">Persuasive</option>
              <option value="HUMOROUS">Humorous</option>
              <option value="INSPIRATIONAL">Inspirational</option>
            </select>
          </div>

          <button 
            onClick={handleGenerate}
            disabled={isGenerating || !topic.trim()}
            className="w-full py-4 rounded-2xl bg-brand-purple text-white font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 transition-all"
          >
            {isGenerating ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
            Generate Content
          </button>

          {error && (
            <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex flex-col gap-2">
              <p>{error}</p>
              {error.includes('credits') && (
                <a href="/dashboard/settings" className="text-brand-orange font-bold hover:underline">
                  Buy Credits →
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="glass rounded-[32px] border-brand-purple/10 flex flex-col min-h-[400px]">
        <div className="p-6 border-b border-white/5 flex justify-between items-center">
          <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500">AI Generated Result</h3>
          {result && (
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
          {result ? (
            <div className="prose prose-invert prose-sm max-w-none whitespace-pre-wrap text-zinc-300 leading-relaxed">
              {result}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center text-zinc-600">
              <PenTool size={48} className="mb-4 opacity-20" />
              <p className="text-sm">Your generated content will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
