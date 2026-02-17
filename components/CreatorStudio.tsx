import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import ShareModal from './ShareModal';
import UserDashboard from './UserDashboard';

const FLOW_MESSAGES = [
  "Synchronizing with Faceless Digital Life Intelligence...",
  "Deploying Gemini 3 Pro reasoning budget...",
  "Calibrating world-class visual manifestation...",
  "Synthesizing high-fidelity assets via Google Neural Network...",
  "Rendering cinematic motion with Veo 3.1...",
  "Optimizing for viral distribution nodes..."
];

type HubTab = 'video-generation' | 'visual' | 'marketing-blueprint' | 'voice' | 'live';

interface CreatorStudioProps {
  isNexus?: boolean;
}

const CreatorStudio: React.FC<CreatorStudioProps> = ({ isNexus = false }) => {
  const [activeTab, setActiveTab] = useState<HubTab>('video-generation');
  const [artStyle, setArtStyle] = useState('Cinematic');
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusIdx, setStatusIdx] = useState(0);
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState('9:16');
  const [imageSize, setImageSize] = useState<'1K' | '2K' | '4K'>('1K');
  const [quality, setQuality] = useState<'720p' | '1080p'>('1080p');
  const [result, setResult] = useState<{ type: string, url: string, content?: string } | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const [usage, setUsage] = useState({ images: 0, videos: 0 });
  const LIMITS = { images: 20, videos: 5 };

  useEffect(() => {
    let interval: number;
    if (isProcessing) {
      interval = window.setInterval(() => {
        setStatusIdx((prev) => (prev + 1) % FLOW_MESSAGES.length);
      }, 4000);
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

  const handleVideoGen = async () => {
    if (!prompt.trim()) return;
    await checkApiKey();
    setIsProcessing(true);
    setResult(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      let op = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: `FACELESS CINEMA: ${prompt}. Artistic Style: ${artStyle}. Cinematic world-class masterpiece. High-fidelity motion.`,
        config: { 
          numberOfVideos: 1, 
          resolution: quality, 
          aspectRatio: aspectRatio as any 
        }
      });
      while (!op.done) {
        await new Promise(r => setTimeout(r, 10000));
        op = await ai.operations.getVideosOperation({ operation: op });
      }
      const link = op.response?.generatedVideos?.[0]?.video?.uri;
      const res = await fetch(`${link}&key=${process.env.API_KEY}`);
      const blob = await res.blob();
      setResult({ type: 'video', url: URL.createObjectURL(blob) });
      setUsage(prev => ({ ...prev, videos: prev.videos + 1 }));
    } catch (e: any) { 
      console.error(e); 
      if (e.message?.includes("Requested entity was not found")) {
        // @ts-ignore
        await window.aistudio.openSelectKey();
      }
    } finally { setIsProcessing(false); }
  };

  const handleImageGen = async () => {
    if (!prompt.trim()) return;
    await checkApiKey();
    setIsProcessing(true);
    setResult(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-image-preview',
        contents: { parts: [{ text: `FACELESS VISUAL ENGINE: World-class ${artStyle} manifestation of ${prompt}. Studio lighting, 8k detail, high-fashion aesthetic.` }] },
        config: { 
          imageConfig: { 
            aspectRatio: aspectRatio as any, 
            imageSize: imageSize 
          }
        }
      });
      const part = response.candidates[0].content.parts.find(p => p.inlineData);
      if (part?.inlineData) {
        setResult({ type: 'image', url: `data:image/png;base64,${part.inlineData.data}` });
        setUsage(prev => ({ ...prev, images: prev.images + 1 }));
      }
    } catch (e: any) { 
      console.error(e); 
       if (e.message?.includes("Requested entity was not found")) {
        // @ts-ignore
        await window.aistudio.openSelectKey();
      }
    } finally { setIsProcessing(false); }
  };

  const handleMarketingGen = async () => {
    if (!prompt.trim()) return;
    setIsProcessing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `FACELESS DIGITAL MARKETING BLUEPRINT: Construct a world-class influencer growth strategy for: ${prompt}. Focus on monetization, audience psychology, and viral potential. Use a professional, sophisticated tone.`,
        config: { 
          thinkingConfig: { thinkingBudget: 32768 },
          tools: [{ googleSearch: {} }] 
        }
      });
      setResult({ type: 'text', url: '', content: response.text });
    } catch (e) { console.error(e); } finally { setIsProcessing(false); }
  };

  return (
    <section id="hub" className="py-40 bg-[#020617] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <UserDashboard usage={usage} limits={LIMITS} tier={isNexus ? 'NEXUS ELITE' : 'PULSE TRIAL'} />

        <div className="flex flex-col lg:flex-row justify-between items-end mb-24 gap-12">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 mb-6">
              <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-ping"></div>
              <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.6em]">FACELESS | INFLUENCER HUB</span>
            </div>
            <h2 className="text-6xl md:text-7xl font-black text-white tracking-tighter outfit italic leading-[0.9] uppercase">The Omni-Engine</h2>
          </div>
          
          <div className="flex bg-white/5 p-2 rounded-[3.5rem] border border-white/10 backdrop-blur-3xl overflow-x-auto">
            {[
              { id: 'video-generation', label: 'Cinema Hub', icon: '🎬' },
              { id: 'visual', label: 'Visuals', icon: '🎨' },
              { id: 'marketing-blueprint', label: 'Strategy', icon: '📈' },
              { id: 'voice', label: 'Audio', icon: '🎙️' },
              { id: 'live', label: 'Intelligence', icon: '⚡' }
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
            <div className="p-12 bg-white/5 border border-white/10 rounded-[4.5rem] backdrop-blur-3xl relative overflow-hidden group shadow-inner">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-indigo-500/20 transition-all"></div>
              
              <label className="block text-[10px] font-black text-indigo-400 uppercase tracking-[0.5em] mb-8">Asset Manifestation</label>
              
              <textarea 
                value={prompt} 
                onChange={(e) => setPrompt(e.target.value)} 
                placeholder={activeTab === 'marketing-blueprint' ? "Describe your niche and current goals..." : "Describe a world-class concept..."} 
                className="w-full h-48 bg-black/20 border border-white/10 rounded-[2.5rem] p-10 text-sm font-medium text-white focus:ring-4 focus:ring-indigo-500/20 outline-none transition-all resize-none shadow-inner mb-10 placeholder:text-slate-700" 
              />
              
              <div className="space-y-10">
                {['visual', 'video-generation'].includes(activeTab) && (
                  <div>
                    <label className="block text-[9px] font-black text-slate-500 uppercase tracking-[0.4em] mb-6">Aesthetic Standard</label>
                    <div className="grid grid-cols-2 gap-4">
                      {['Cinematic', 'Hyper-Real', 'High-Fashion', 'Avant-Garde'].map(style => (
                        <button key={style} onClick={() => setArtStyle(style)} className={`py-5 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all ${artStyle === style ? 'bg-indigo-600 text-white border-indigo-600 shadow-xl shadow-indigo-500/20' : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10'}`}>
                          {style}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <button 
                  onClick={() => {
                    if(activeTab === 'visual') handleImageGen();
                    else if(activeTab === 'video-generation') handleVideoGen();
                    else if(activeTab === 'marketing-blueprint') handleMarketingGen();
                  }} 
                  disabled={isProcessing} 
                  className="w-full mt-12 bg-white text-slate-950 font-black py-9 rounded-[3rem] text-[14px] uppercase tracking-[0.5em] shadow-[0_30px_80px_rgba(255,255,255,0.15)] transition-all hover:scale-[1.02] disabled:opacity-50 active:scale-95"
                >
                  {isProcessing ? 'Synthesizing...' : `Initialize Pulse`}
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="bg-white/5 rounded-[5rem] aspect-video w-full flex items-center justify-center overflow-hidden relative border border-white/10 shadow-[0_60px_120px_-30px_rgba(0,0,0,0.6)] group">
              {isProcessing && (
                <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-3xl z-10 flex flex-col items-center justify-center text-center p-16">
                  <div className="w-28 h-28 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-[35%] animate-spin flex items-center justify-center shadow-2xl mb-14">
                     <div className="w-16 h-16 bg-slate-950 rounded-full"></div>
                  </div>
                  <h4 className="text-lg font-black text-white uppercase tracking-[0.6em] mb-6">Processing Signal</h4>
                  <p className="text-[14px] font-bold text-indigo-400 animate-pulse uppercase tracking-[0.4em]">{FLOW_MESSAGES[statusIdx]}</p>
                </div>
              )}

              {result ? (
                <div className="w-full h-full flex flex-col animate-fadeIn">
                  {result.type === 'text' ? (
                    <div className="w-full h-full p-24 overflow-y-auto bg-white/5 text-slate-300">
                      <h3 className="text-5xl font-black italic outfit mb-14 text-gradient uppercase tracking-tighter leading-none">Manifesto Result</h3>
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
                    <button onClick={() => setIsShareModalOpen(true)} className="px-16 py-8 bg-white text-slate-950 font-black text-[14px] uppercase tracking-[0.3em] rounded-[2.5rem] hover:scale-105 transition-transform shadow-2xl">Deploy Asset</button>
                  </div>
                </div>
              ) : (
                <div className="text-center opacity-10 flex flex-col items-center">
                   <div className="text-[12rem] mb-12 leading-none outfit font-black">FACELESS</div>
                   <p className="text-[16px] font-black uppercase tracking-[1.5em] text-white">System Standby</p>
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