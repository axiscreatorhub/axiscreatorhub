import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import ShareModal from './ShareModal';
import UserDashboard from './UserDashboard';

const FLOW_MESSAGES = [
  "Synchronizing with AXIS Omni-Intelligence...",
  "Deploying Gemini 3 Pro reasoning engine...",
  "Synthesizing high-fidelity visual frames...",
  "Calibrating world-class cinematic flow...",
  "Refining motion via Veo 3.1 Neural Network...",
  "Encoding viral distribution metadata..."
];

const PRESETS = [
  { label: 'TikTok Viral', prompt: 'High-energy viral hook, fast transitions, vibrant colors, influencer aesthetic' },
  { label: 'Insta Premium', prompt: 'Sophisticated luxury aesthetic, soft cinematic lighting, professional color grade' },
  { label: 'YouTube Short', prompt: 'Engaging cinematic story-beat, high-fidelity resolution, clear focal point' },
  { label: 'Brand Ad', prompt: 'Clean professional product showcase, studio lighting, minimalistic background' }
];

type HubTab = 'video' | 'visual' | 'strategy' | 'audio';

const CreatorStudio: React.FC<{ isNexus?: boolean }> = ({ isNexus = false }) => {
  const [activeTab, setActiveTab] = useState<HubTab>('video');
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusIdx, setStatusIdx] = useState(0);
  const [prompt, setPrompt] = useState('');
  const [artStyle, setArtStyle] = useState('Cinematic 8K');
  const [result, setResult] = useState<{ type: string, url: string, content?: string } | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const [usage, setUsage] = useState({ images: 0, videos: 0 });
  const LIMITS = { images: 20, videos: 5 };

  useEffect(() => {
    let interval: number;
    if (isProcessing) {
      interval = window.setInterval(() => {
        setStatusIdx((prev) => (prev + 1) % FLOW_MESSAGES.length);
      }, 3500);
    }
    return () => clearInterval(interval);
  }, [isProcessing]);

  const checkApiKey = async () => {
    // @ts-ignore
    if (window.aistudio && !(await window.aistudio.hasSelectedApiKey())) {
      // @ts-ignore
      await window.aistudio.openSelectKey();
    }
  };

  const handleManifest = async () => {
    if (!prompt.trim()) return;
    await checkApiKey();
    setIsProcessing(true);
    setResult(null);

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    try {
      if (activeTab === 'video') {
        let op = await ai.models.generateVideos({
          model: 'veo-3.1-fast-generate-preview',
          prompt: `AXIS CINEMA: ${prompt}. Artistic Style: ${artStyle}. Masterpiece quality, viral aesthetic.`,
          config: { resolution: '1080p', aspectRatio: '9:16' }
        });
        while (!op.done) {
          await new Promise(r => setTimeout(r, 8000));
          op = await ai.operations.getVideosOperation({ operation: op });
        }
        const link = op.response?.generatedVideos?.[0]?.video?.uri;
        const res = await fetch(`${link}&key=${process.env.API_KEY}`);
        const blob = await res.blob();
        setResult({ type: 'video', url: URL.createObjectURL(blob) });
        setUsage(prev => ({ ...prev, videos: prev.videos + 1 }));
      } else if (activeTab === 'visual') {
        const response = await ai.models.generateContent({
          model: 'gemini-3-pro-image-preview',
          contents: { parts: [{ text: `AXIS VISUAL ENGINE: Elite ${artStyle} manifestation of ${prompt}. Studio lighting, high-fidelity detail.` }] },
          config: { imageConfig: { aspectRatio: '9:16', imageSize: '1K' } }
        });
        const part = response.candidates[0].content.parts.find(p => p.inlineData);
        if (part?.inlineData) {
          setResult({ type: 'image', url: `data:image/png;base64,${part.inlineData.data}` });
          setUsage(prev => ({ ...prev, images: prev.images + 1 }));
        }
      } else if (activeTab === 'strategy') {
        const response = await ai.models.generateContent({
          model: 'gemini-3-pro-preview',
          contents: `AXIS STRATEGIC MANIFESTO: Convert this prompt into a world-class growth strategy: ${prompt}. Focus on viral potential and audience psychology.`,
          config: { thinkingConfig: { thinkingBudget: 32768 }, tools: [{ googleSearch: {} }] }
        });
        setResult({ type: 'text', url: '', content: response.text });
      }
    } catch (e: any) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  const applyPreset = (p: string) => {
    setPrompt(p);
    const element = document.getElementById('manifest-input');
    if (element) element.focus();
  };

  return (
    <section id="hub" className="py-40 bg-[#020617] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <UserDashboard usage={usage} limits={LIMITS} tier={isNexus ? 'NEXUS ELITE' : 'PULSE TRIAL'} />

        <div className="flex flex-col lg:flex-row justify-between items-end mb-24 gap-12">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 mb-6">
              <div className="w-2.5 h-2.5 rounded-full bg-violet-500 animate-ping"></div>
              <span className="text-[10px] font-black text-violet-400 uppercase tracking-[0.6em]">AXIS | CREATIVE STUDIO</span>
            </div>
            <h2 className="text-6xl md:text-7xl font-black text-white tracking-tighter outfit italic leading-[0.9] uppercase">The Omni <span className="text-gradient">Engine.</span></h2>
          </div>
          
          <div className="flex bg-white/5 p-2 rounded-[3.5rem] border border-white/10 backdrop-blur-3xl overflow-x-auto">
            {[
              { id: 'video', label: 'Cinema', icon: '📽️' },
              { id: 'visual', label: 'Visuals', icon: '🎨' },
              { id: 'strategy', label: 'Strategy', icon: '🧠' }
            ].map((t) => (
              <button 
                key={t.id} 
                onClick={() => setActiveTab(t.id as HubTab)}
                className={`flex items-center gap-4 px-10 py-6 rounded-full text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === t.id ? 'bg-white text-slate-950 shadow-2xl' : 'text-slate-400 hover:text-white'}`}
              >
                <span className="text-lg">{t.icon}</span>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-16 items-start">
          <div className="lg:col-span-4 space-y-10">
            <div className="p-10 glass-card rounded-[4.5rem] relative overflow-hidden group shadow-inner">
              <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/10 rounded-full blur-3xl -mr-16 -mt-16 transition-all"></div>
              
              <div className="mb-8">
                <label className="text-[10px] font-black text-violet-400 uppercase tracking-[0.5em] mb-6 block">Quick Templates</label>
                <div className="flex flex-wrap gap-3">
                  {PRESETS.map((p, idx) => (
                    <button 
                      key={idx} 
                      onClick={() => applyPreset(p.prompt)}
                      className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[9px] font-black text-white uppercase tracking-widest hover:bg-violet-600 hover:border-violet-600 transition-all"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] mb-4 block">Manifest Prompt</label>
              <textarea 
                id="manifest-input"
                value={prompt} 
                onChange={(e) => setPrompt(e.target.value)} 
                placeholder="What are we creating today?" 
                className="w-full h-48 bg-black/40 border border-white/10 rounded-[2.5rem] p-8 text-sm font-medium text-white focus:ring-4 focus:ring-violet-500/20 outline-none transition-all resize-none shadow-inner mb-8 placeholder:text-slate-700" 
              />
              
              <div className="space-y-8">
                <button 
                  onClick={handleManifest} 
                  disabled={isProcessing || !prompt.trim()} 
                  className="w-full bg-white text-slate-950 font-black py-8 rounded-[3rem] text-[14px] uppercase tracking-[0.5em] shadow-[0_30px_80px_rgba(255,255,255,0.15)] transition-all hover:scale-[1.02] disabled:opacity-30 active:scale-95"
                >
                  {isProcessing ? 'Synthesizing...' : `Manifest`}
                </button>
                
                <p className="text-[9px] text-center text-slate-500 font-bold uppercase tracking-widest opacity-60 flex items-center justify-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  AI SYNC: OPTIMAL
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="bg-white/5 rounded-[5rem] aspect-video w-full flex items-center justify-center overflow-hidden relative border border-white/10 shadow-[0_60px_120px_-30px_rgba(0,0,0,0.6)] group">
              {isProcessing && (
                <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-3xl z-10 flex flex-col items-center justify-center text-center p-16 animate-fadeIn">
                  <div className="w-24 h-24 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mb-10 shadow-[0_0_30px_rgba(139,92,246,0.3)]"></div>
                  <p className="text-[14px] font-bold text-violet-400 animate-pulse uppercase tracking-[0.4em]">{FLOW_MESSAGES[statusIdx]}</p>
                </div>
              )}

              {result ? (
                <div className="w-full h-full flex flex-col animate-fadeIn">
                  {result.type === 'text' ? (
                    <div className="w-full h-full p-20 overflow-y-auto bg-white/5 text-slate-300">
                      <div className="prose prose-invert max-w-none text-xl leading-loose">{result.content}</div>
                    </div>
                  ) : result.type === 'image' ? (
                    <img src={result.url} className="w-full h-full object-contain" alt="Manifested Asset" />
                  ) : (
                    <video src={result.url} controls autoPlay loop className="w-full h-full object-contain" />
                  )}
                  <div className="absolute bottom-12 right-12 flex gap-4">
                    <button onClick={() => setResult(null)} className="p-6 bg-white/10 border border-white/20 rounded-2xl text-white hover:bg-red-500 transition-colors backdrop-blur-2xl">
                       ✕
                    </button>
                    <button onClick={() => setIsShareModalOpen(true)} className="px-12 py-6 bg-white text-slate-950 font-black text-[12px] uppercase tracking-[0.3em] rounded-[2rem] hover:scale-105 transition-transform shadow-2xl">Deploy Asset</button>
                  </div>
                </div>
              ) : (
                <div className="text-center opacity-10 flex flex-col items-center">
                   <div className="text-[12rem] mb-12 leading-none outfit font-black">AXIS</div>
                   <p className="text-[16px] font-black uppercase tracking-[1.5em] text-white">Neural Hub Standby</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {isShareModalOpen && result && <ShareModal isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} assetUrl={result.url} assetType={result.type} />}
    </section>
  );
};

export default CreatorStudio;