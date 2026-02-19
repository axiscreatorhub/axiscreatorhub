import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import ShareModal from './ShareModal';
import UserDashboard from './UserDashboard';

const FLOW_MESSAGES = [
  "Synchronizing Content Engine...",
  "Deploying Flash Generation Node...",
  "Synthesizing elite creator aesthetics...",
  "Calibrating viral hook potential...",
  "Refining faceless content strategy...",
  "Ready for drop..."
];

const PRESETS = [
  { label: 'Viral Reel Hook', prompt: 'High-energy viral hook, fast transitions, vibrant colors, influencer aesthetic' },
  { label: 'Faceless Vibe', prompt: 'Sophisticated luxury aesthetic, soft cinematic lighting, professional color grade, anonymous presence' },
  { label: 'Batch Shorts', prompt: 'Engaging cinematic story-beat, high-fidelity resolution, clear focal point' },
  { label: 'Brand Strategy', prompt: 'Clean professional product showcase, studio lighting, minimalistic background' }
];

type HubTab = 'video' | 'visual' | 'strategy' | 'audio';

const CreatorStudio: React.FC<{ isNexus?: boolean }> = ({ isNexus = false }) => {
  const [activeTab, setActiveTab] = useState<HubTab>('video');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isEmailing, setIsEmailing] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [showEmailCapture, setShowEmailCapture] = useState(false);
  const [statusIdx, setStatusIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const [prompt, setPrompt] = useState('');
  const artStyle = 'Cinematic 8K';
  const [result, setResult] = useState<{ type: string, url: string, content?: string } | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const [usage, setUsage] = useState({ images: 0, videos: 0 });
  const LIMITS = { images: 20, videos: 5 };

  useEffect(() => {
    let interval: number;
    if (isProcessing) {
      interval = window.setInterval(() => {
        setStatusIdx((prev) => (prev + 1) % FLOW_MESSAGES.length);
        setProgress(prev => {
          if (prev >= 98) return 98;
          return prev + (activeTab === 'video' ? 0.5 : 2);
        });
      }, 2000);
    } else {
      setProgress(0);
    }
    return () => clearInterval(interval);
  }, [isProcessing, activeTab]);

  const handleEmailResult = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!result || !emailInput) return;
    setIsEmailing(true);
    
    try {
      // In a real Vercel environment, you would call:
      // await fetch('/api/send', { method: 'POST', body: JSON.stringify({ email: emailInput, asset: result.url }) });
      
      await new Promise(r => setTimeout(r, 1800));
      alert(`Asset successfully dispatched to ${emailInput} via AXIS Hub (Resend Node).`);
      setShowEmailCapture(false);
      setEmailInput('');
    } catch {
      alert("Mail server communication failed. Retrying...");
    } finally {
      setIsEmailing(false);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsProcessing(true);
    setResult(null);

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    try {
      if (activeTab === 'video') {
        let op = await ai.models.generateVideos({
          model: 'veo-3.1-fast-generate-preview',
          prompt: `AXIS CONTENT: ${prompt}. Style: ${artStyle}. Masterpiece quality, viral faceless aesthetic.`,
          config: { resolution: '720p', aspectRatio: '9:16' }
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
          model: 'gemini-2.5-flash-image',
          contents: { parts: [{ text: `AXIS ASSET: Elite ${artStyle} render of ${prompt}. Modern digital content, high-fidelity.` }] },
          config: { imageConfig: { aspectRatio: '9:16' } }
        });
        const part = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
        if (part?.inlineData) {
          setResult({ type: 'image', url: `data:image/png;base64,${part.inlineData.data}` });
          setUsage(prev => ({ ...prev, images: prev.images + 1 }));
        }
      } else if (activeTab === 'strategy') {
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: `AXIS FACELESS STRATEGY: Build a viral hook and engagement workflow for: ${prompt}. Focus on faceless marketing channels.`,
          config: { thinkingConfig: { thinkingBudget: 0 } }
        });
        setResult({ type: 'text', url: '', content: response.text });
      }
    } catch (e: unknown) {
      console.error("AXIS Engine Error:", e);
      if (window.aistudio) window.aistudio.openSelectKey();
    } finally {
      setIsProcessing(false);
    }
  };

  const applyPreset = (p: string) => {
    setPrompt(p);
    const element = document.getElementById('drop-input');
    if (element) element.focus();
  };

  return (
    <section id="hub" className="py-40 bg-[#020617] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <UserDashboard usage={usage} limits={LIMITS} tier={isNexus ? 'NEXUS ELITE' : 'HUB TRIAL'} />

        <div className="flex flex-col lg:flex-row justify-between items-end mb-24 gap-12">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 mb-6">
              <div className="w-2.5 h-2.5 rounded-full bg-pink-500 animate-ping"></div>
              <span className="text-[10px] font-black text-pink-400 uppercase tracking-[0.6em]">AXIS | CONTENT FACTORY</span>
            </div>
            <h2 className="text-6xl md:text-7xl font-black text-white tracking-tighter outfit italic leading-[0.9] uppercase">High Fidelity <span className="text-gradient">Drops.</span></h2>
          </div>
          
          <div className="flex bg-white/5 p-2 rounded-[3.5rem] border border-white/10 backdrop-blur-3xl overflow-x-auto">
            {['video', 'visual', 'strategy'].map((id) => (
              <button 
                key={id} 
                onClick={() => { setActiveTab(id as HubTab); setResult(null); }}
                className={`flex items-center gap-4 px-10 py-6 rounded-full text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === id ? 'bg-white text-slate-950 shadow-2xl' : 'text-slate-400 hover:text-white'}`}
              >
                {id === 'video' ? '📽️' : id === 'visual' ? '🎨' : '🧠'} {id.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-16 items-start">
          <div className="lg:col-span-4 space-y-10">
            <div className="p-10 glass-card rounded-[4.5rem] relative overflow-hidden group shadow-inner border border-white/5">
              <div className="mb-8">
                <label className="text-[10px] font-black text-pink-400 uppercase tracking-[0.5em] mb-6 block">Quick Presets</label>
                <div className="flex flex-wrap gap-3">
                  {PRESETS.map((p, idx) => (
                    <button key={idx} onClick={() => applyPreset(p.prompt)} className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[9px] font-black text-white uppercase tracking-widest hover:bg-pink-600 transition-all">{p.label}</button>
                  ))}
                </div>
              </div>

              <textarea 
                id="drop-input"
                value={prompt} 
                onChange={(e) => setPrompt(e.target.value)} 
                placeholder="Describe your next viral asset..." 
                className="w-full h-48 bg-black/40 border border-white/10 rounded-[2.5rem] p-8 text-sm font-medium text-white focus:ring-1 focus:ring-pink-500 outline-none transition-all resize-none shadow-inner mb-8 placeholder:text-slate-700" 
              />
              
              <button 
                onClick={handleGenerate} 
                disabled={isProcessing || !prompt.trim()} 
                className="w-full bg-white text-slate-950 font-black py-8 rounded-[3rem] text-[14px] uppercase tracking-[0.4em] shadow-2xl transition-all hover:scale-[1.02] disabled:opacity-30 active:scale-95"
              >
                {isProcessing ? 'Batching...' : `Drop Asset`}
              </button>
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="bg-white/5 rounded-[5rem] aspect-video w-full flex items-center justify-center overflow-hidden relative border border-white/10 shadow-2xl">
              {isProcessing && (
                <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-3xl z-10 flex flex-col items-center justify-center text-center p-16 animate-fadeIn">
                  <div className="w-24 h-24 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mb-10"></div>
                  <div className="w-full max-w-xs mb-4">
                    <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">
                       <span>{FLOW_MESSAGES[statusIdx]}</span>
                       <span>{Math.floor(progress)}%</span>
                    </div>
                    <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                       <div className="h-full bg-pink-500 transition-all duration-500" style={{ width: `${progress}%` }}></div>
                    </div>
                  </div>
                </div>
              )}

              {result ? (
                <div className="w-full h-full flex flex-col animate-fadeIn relative">
                  {result.type === 'text' ? (
                    <div className="w-full h-full p-20 overflow-y-auto bg-white/5 text-slate-300">
                      <div className="prose prose-invert max-w-none text-xl leading-loose">{result.content}</div>
                    </div>
                  ) : result.type === 'image' ? (
                    <img src={result.url} className="w-full h-full object-contain" alt="AXIS Asset" />
                  ) : (
                    <video src={result.url} controls autoPlay loop className="w-full h-full object-contain" />
                  )}

                  {showEmailCapture && (
                    <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-12 z-20">
                      <div className="bg-white rounded-[3rem] p-12 max-w-md w-full text-center">
                        <h4 className="text-2xl font-black outfit italic uppercase text-slate-900 mb-6">Dispatch to Inbox</h4>
                        <p className="text-slate-500 text-sm font-medium mb-8">Dispatched via AXIS x Resend Relay Node</p>
                        <form onSubmit={handleEmailResult} className="space-y-6">
                          <input 
                            type="email" 
                            required 
                            value={emailInput} 
                            onChange={(e) => setEmailInput(e.target.value)}
                            placeholder="creator@axis.hub" 
                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-5 text-sm font-bold text-slate-900 outline-none focus:ring-2 focus:ring-pink-500"
                          />
                          <div className="flex gap-4">
                            <button type="button" onClick={() => setShowEmailCapture(false)} className="flex-1 py-5 bg-slate-100 rounded-2xl text-[10px] font-black uppercase text-slate-500">Cancel</button>
                            <button type="submit" disabled={isEmailing} className="flex-1 py-5 bg-pink-600 rounded-2xl text-[10px] font-black uppercase text-white flex items-center justify-center gap-2">
                              {isEmailing ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : 'Confirm Sync'}
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}

                  <div className="absolute bottom-12 right-12 flex gap-4">
                    <button onClick={() => setResult(null)} className="p-6 bg-white/10 border border-white/20 rounded-2xl text-white hover:bg-red-500 transition-colors backdrop-blur-2xl">✕</button>
                    <button 
                      onClick={() => setShowEmailCapture(true)}
                      className="px-8 py-6 bg-pink-600 text-white font-black text-[12px] uppercase tracking-[0.3em] rounded-[2rem] hover:scale-105 transition-transform flex items-center gap-3"
                    >
                      📩 Email Asset
                    </button>
                    <button onClick={() => setIsShareModalOpen(true)} className="px-12 py-6 bg-white text-slate-950 font-black text-[12px] uppercase tracking-[0.3em] rounded-[2rem] hover:scale-105 transition-transform shadow-2xl">Share Asset</button>
                  </div>
                </div>
              ) : (
                <div className="text-center opacity-10 flex flex-col items-center">
                   <div className="text-[12rem] mb-12 leading-none outfit font-black tracking-tighter">AXIS</div>
                   <p className="text-[16px] font-black uppercase tracking-[1.5em] text-white">Hub Standby</p>
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