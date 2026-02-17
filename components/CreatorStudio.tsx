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
      if (e.message?.includes("entity was not found")) {
        // @ts-ignore
        await window.aistudio.openSelectKey();
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePastePrompt = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setPrompt(text);
    } catch (e) {
      alert("Please allow clipboard permissions to paste external prompts.");
    }
  };

  return (
    <section id="hub" className="py-40 bg-[#020617] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <UserDashboard usage={usage} limits={LIMITS} tier={isNexus ? 'NEXUS ELITE' : 'PULSE TRIAL'} />

        <div className="flex flex-col lg:flex-row justify-between items-end mb-24 gap-12">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 mb-6">
              <div className="w-2.5 h-2.5 rounded-full bg-violet-500 animate-ping"></div>
              <span className="text-[10px] font-black text-violet-400 uppercase tracking-[0.6em]">AXIS | THE CREATION FOUNDRY</span>
            </div>
            <h2 className="text-6xl md:text-7xl font-black text-white tracking-tighter outfit italic leading-[0.9] uppercase">The Omni <span className="text-gradient">Engine.</span></h2>
          </div>
          
          <div className="flex bg-white/5 p-2 rounded-[3.5rem] border border-white/10 backdrop-blur-3xl overflow-x-auto">
            {[
              { id: 'video', label: 'Cinema', icon: '📽️' },
              { id: 'visual', label: 'Visuals', icon: '🎨' },
              { id: 'strategy', label: 'Strategy', icon: '🧠' },
              { id: 'audio', label: 'Audio', icon: '🎙️' }
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
            <div className="p-12 glass-card rounded-[4.5rem] relative overflow-hidden group shadow-inner">
              <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-violet-500/20 transition-all"></div>
              
              <div className="flex justify-between items-center mb-8">
                <label className="text-[10px] font-black text-violet-400 uppercase tracking-[0.5em]">Manifest Prompt</label>
                <button 
                  onClick={handlePastePrompt}
                  className="text-[9px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-colors flex items-center gap-2"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" strokeWidth={2.5}/></svg>
                  Paste from External
                </button>
              </div>
              
              <textarea 
                value={prompt} 
                onChange={(e) => setPrompt(e.target.value)} 
                placeholder="Describe your vision or paste a complex ChatGPT prompt here for AI manifestation..." 
                className="w-full h-56 bg-black/40 border border-white/10 rounded-[2.5rem] p-10 text-sm font-medium text-white focus:ring-4 focus:ring-violet-500/20 outline-none transition-all resize-none shadow-inner mb-10 placeholder:text-slate-700" 
              />
              
              <div className="space-y-10">
                <div>
                  <label className="block text-[9px] font-black text-slate-500 uppercase tracking-[0.4em] mb-6">Aesthetic Standard</label>
                  <div className="grid grid-cols-2 gap-4">
                    {['Cinematic 8K', 'Hyper-Real', 'Cyber-Neon', 'Avant-Garde'].map(style => (
                      <button key={style} onClick={() => setArtStyle(style)} className={`py-5 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all ${artStyle === style ? 'bg-violet-600 text-white border-violet-600 shadow-xl shadow-violet-500/20' : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10'}`}>
                        {style}
                      </button>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={handleManifest} 
                  disabled={isProcessing} 
                  className="w-full mt-12 bg-white text-slate-950 font-black py-9 rounded-[3rem] text-[14px] uppercase tracking-[0.5em] shadow-[0_30px_80px_rgba(255,255,255,0.15)] transition-all hover:scale-[1.02] disabled:opacity-50 active:scale-95"
                >
                  {isProcessing ? 'Synthesizing Pulse...' : `Initialize Manifest`}
                </button>
                
                <p className="text-[9px] text-center text-slate-500 font-bold uppercase tracking-widest opacity-60">
                  <span className="text-emerald-500">✔</span> Safety Filters Active • AI Driven OS
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="bg-white/5 rounded-[5rem] aspect-video w-full flex items-center justify-center overflow-hidden relative border border-white/10 shadow-[0_60px_120px_-30px_rgba(0,0,0,0.6)] group">
              {isProcessing && (
                <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-3xl z-10 flex flex-col items-center justify-center text-center p-16 animate-fadeIn">
                  <div className="w-32 h-32 bg-gradient-to-br from-violet-500 to-indigo-500 rounded-[35%] animate-spin flex items-center justify-center shadow-2xl mb-14">
                     <div className="w-16 h-16 bg-slate-950 rounded-full"></div>
                  </div>
                  <h4 className="text-xl font-black text-white uppercase tracking-[0.6em] mb-6">Manifestation in Progress</h4>
                  <p className="text-[14px] font-bold text-violet-400 animate-pulse uppercase tracking-[0.4em]">{FLOW_MESSAGES[statusIdx]}</p>
                </div>
              )}

              {result ? (
                <div className="w-full h-full flex flex-col animate-fadeIn">
                  {result.type === 'text' ? (
                    <div className="w-full h-full p-24 overflow-y-auto bg-white/5 text-slate-300">
                      <h3 className="text-5xl font-black italic outfit mb-14 text-gradient uppercase tracking-tighter leading-none">Strategic Manifesto</h3>
                      <div className="whitespace-pre-wrap text-xl leading-loose font-medium opacity-90 prose prose-invert max-w-none">{result.content}</div>
                    </div>
                  ) : result.type === 'image' ? (
                    <img src={result.url} className="w-full h-full object-contain" alt="Manifested Asset" />
                  ) : (
                    <video src={result.url} controls autoPlay loop className="w-full h-full object-contain" />
                  )}
                  <div className="absolute bottom-16 right-16 flex gap-6">
                    <button onClick={() => setResult(null)} className="p-8 bg-white/10 border border-white/20 rounded-3xl text-white hover:bg-red-500 transition-colors backdrop-blur-2xl">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeWidth={2.5}/></svg>
                    </button>
                    <button onClick={() => setIsShareModalOpen(true)} className="px-16 py-8 bg-white text-slate-950 font-black text-[14px] uppercase tracking-[0.3em] rounded-[2.5rem] hover:scale-105 transition-transform shadow-2xl">Deploy to Cloud</button>
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