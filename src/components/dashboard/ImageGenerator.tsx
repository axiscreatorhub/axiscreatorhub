'use client';

import { useState, useEffect } from 'react';
import { Image as ImageIcon, Sparkles, Loader2, Download, Trash2, Maximize2 } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface AssetJob {
  id: string;
  prompt: string;
  outputUrls: string; // JSON string
  status: string;
  createdAt: string;
}

export function ImageGenerator() {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [isGenerating, setIsGenerating] = useState(false);
  const [jobs, setJobs] = useState<AssetJob[]>([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchJobs() {
      try {
        const res = await fetch('/api/ai/image');
        if (res.ok) {
          const data = await res.json();
          setJobs(data);
        }
      } catch (err) {
        console.error('Failed to fetch jobs', err);
      } finally {
        setIsLoadingJobs(false);
      }
    }
    fetchJobs();
  }, []);

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;
    setIsGenerating(true);
    setError(null);

    try {
      const res = await fetch('/api/ai/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, aspectRatio }),
      });

      if (res.ok) {
        const data = await res.json();
        // Refresh jobs list
        const resJobs = await fetch('/api/ai/image');
        if (resJobs.ok) {
          const dataJobs = await resJobs.json();
          setJobs(dataJobs);
        }
        setPrompt('');
      } else if (res.status === 403) {
        const data = await res.json();
        setError(data.message || 'Insufficient credits');
      } else {
        setError('Generation failed. Please try again.');
      }
    } catch (err) {
      console.error('Generation failed', err);
      setError('An unexpected error occurred.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-12">
      {/* Generator Section */}
      <div className="glass p-10 rounded-[40px] border-brand-blue/10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Image Prompt</label>
              <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the image you want to create (e.g. 'A futuristic cyberpunk city with neon lights and flying cars, cinematic lighting, 8k resolution')..."
                rows={4}
                className="w-full bg-white/5 border border-white/10 rounded-3xl p-6 text-sm text-white focus:outline-none focus:border-brand-blue/50 transition-all resize-none"
              />
            </div>
            
            <div className="flex flex-wrap gap-4">
              {['1:1', '16:9', '9:16', '4:3', '3:4'].map((ratio) => (
                <button
                  key={ratio}
                  onClick={() => setAspectRatio(ratio)}
                  className={cn(
                    "px-6 py-3 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all border",
                    aspectRatio === ratio 
                      ? "bg-brand-blue/10 border-brand-blue text-brand-blue" 
                      : "bg-white/5 border-white/10 text-zinc-500 hover:text-white hover:bg-white/10"
                  )}
                >
                  {ratio}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col justify-end gap-4">
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
            <button 
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="w-full h-20 rounded-3xl bg-brand-blue text-white font-black text-lg flex items-center justify-center gap-3 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-brand-blue/20"
            >
              {isGenerating ? <Loader2 className="animate-spin" size={24} /> : <Sparkles size={24} />}
              {isGenerating ? 'Generating...' : 'Generate Image'}
            </button>
            <p className="text-[10px] text-zinc-500 text-center uppercase tracking-widest font-bold">
              Uses 20 Credits per generation • Powered by Gemini 3.1
            </p>
          </div>
        </div>
      </div>

      {/* Gallery Section */}
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <ImageIcon className="text-brand-blue" /> Generation History
          </h2>
        </div>

        {isLoadingJobs ? (
          <div className="flex items-center justify-center p-20">
            <Loader2 className="animate-spin text-brand-blue" size={32} />
          </div>
        ) : jobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {jobs.map((job) => {
              const urls = JSON.parse(job.outputUrls || '[]');
              const imageUrl = urls[0];
              
              return (
                <div key={job.id} className="group relative glass rounded-3xl overflow-hidden border-white/5 hover:border-brand-blue/30 transition-all">
                  <div className="aspect-square relative bg-white/5">
                    {job.status === 'COMPLETED' && imageUrl ? (
                      <Image 
                        src={imageUrl} 
                        alt={job.prompt}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                    ) : job.status === 'PROCESSING' ? (
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-zinc-500">
                        <Loader2 className="animate-spin" size={24} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Processing...</span>
                      </div>
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-red-400">
                        <ImageIcon size={24} className="opacity-20" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Failed</span>
                      </div>
                    )}
                  </div>

                  {/* Hover Overlay */}
                  {job.status === 'COMPLETED' && (
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-6">
                      <div className="flex justify-end gap-2">
                        <button className="p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all">
                          <Download size={18} />
                        </button>
                        <button className="p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all">
                          <Maximize2 size={18} />
                        </button>
                      </div>
                      <p className="text-xs text-zinc-300 line-clamp-3 leading-relaxed">
                        {job.prompt}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="glass p-20 rounded-[40px] border-dashed border-white/10 text-center">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-zinc-500 mx-auto mb-6">
              <ImageIcon size={32} />
            </div>
            <h3 className="text-xl font-bold mb-2">No images generated yet</h3>
            <p className="text-zinc-500 text-sm max-w-xs mx-auto">
              Start by describing your vision in the generator above.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
