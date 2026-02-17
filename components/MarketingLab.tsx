
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Type } from "@google/genai";

const VIDEO_STATUS_MESSAGES = [
  "Initializing neural cinematic engine...",
  "Analyzing visual composition and flow...",
  "Synthesizing high-fidelity frames...",
  "Refining temporal consistency and motion...",
  "Polishing final render for export...",
  "Finalizing your creative masterpiece..."
];

const MarketingLab: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'creative' | 'intelligence' | 'concierge'>('creative');
  const [isGenerating, setIsGenerating] = useState(false);
  const [statusMessageIndex, setStatusMessageIndex] = useState(0);
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState<{ type: 'image' | 'video' | 'text' | 'audio', url?: string, content?: string } | null>(null);
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [imageSize, setImageSize] = useState('1K');
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'model', text: string}[]>([]);
  
  useEffect(() => {
    let interval: number;
    if (isGenerating && result?.type !== 'video') { // Rotating messages mainly for video as it takes longer
      interval = window.setInterval(() => {
        setStatusMessageIndex((prev) => (prev + 1) % VIDEO_STATUS_MESSAGES.length);
      }, 8000);
    }
    return () => clearInterval(interval);
  }, [isGenerating]);

  const checkApiKey = async () => {
    // @ts-ignore
    if (window.aistudio && !(await window.aistudio.hasSelectedApiKey())) {
      // @ts-ignore
      await window.aistudio.openSelectKey();
    }
  };

  const handleImageGen = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-image-preview',
        contents: { parts: [{ text: prompt }] },
        config: {
          imageConfig: {
            aspectRatio: aspectRatio as any,
            imageSize: imageSize as any
          }
        }
      });
      
      const part = response.candidates[0].content.parts.find(p => p.inlineData);
      if (part?.inlineData) {
        setResult({ type: 'image', url: `data:image/png;base64,${part.inlineData.data}` });
      }
    } catch (e: any) {
      console.error(e);
      if (e.message?.includes("Requested entity was not found")) {
        // @ts-ignore
        await window.aistudio.openSelectKey();
      } else {
        alert("Creative engine encountered an error. Please try a different prompt.");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleVideoGen = async () => {
    if (!prompt.trim()) return;
    await checkApiKey();
    setIsGenerating(true);
    setStatusMessageIndex(0);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: prompt,
        config: {
          numberOfVideos: 1,
          resolution: '720p',
          aspectRatio: aspectRatio as any
        }
      });
      
      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 10000));
        operation = await ai.operations.getVideosOperation({ operation });
      }
      
      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      const videoResponse = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
      const blob = await videoResponse.blob();
      setResult({ type: 'video', url: URL.createObjectURL(blob) });
    } catch (e: any) {
      console.error(e);
      if (e.message?.includes("Requested entity was not found")) {
        // @ts-ignore
        await window.aistudio.openSelectKey();
      } else {
        alert("Video generation failed. Ensure your Gemini API Key is billing-enabled.");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleChat = async () => {
    if (!prompt.trim()) return;
    const userMsg = prompt;
    setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setPrompt('');
    setIsGenerating(true);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: userMsg,
        config: {
          thinkingConfig: { thinkingBudget: 32768 },
          tools: [{ googleSearch: {} }],
          systemInstruction: "You are the Axis Lead Strategist. Provide sophisticated, high-tier advice for digital creators focusing on brand longevity, automation, and cinematic manifestation. Axis is creativity powered in one."
        }
      });
      
      setChatHistory(prev => [...prev, { role: 'model', text: response.text || "Thinking through the strategy..." }]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <section id="lab" className="py-32 bg-[#F8F9FA] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-16">
          <div className="lg:w-1/3">
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] font-bold text-[10px] uppercase tracking-widest border border-[#D4AF37]/20">
              Axis OS • Elite Lab
            </div>
            <h2 className="text-4xl font-bold text-slate-900 mb-6 serif italic tracking-tight">AI Content Foundry</h2>
            <p className="text-slate-500 font-light leading-relaxed mb-10 text-lg">
              Generate elite visual assets, animate stills into cinematic video, and consult with the Axis reasoning engine.
            </p>
            
            <nav className="space-y-3">
              {[
                { id: 'creative', icon: '🎨', label: 'Visual Studio', sub: 'Imagen 4 & Veo 3.1' },
                { id: 'intelligence', icon: '🧠', label: 'Intelligence Lab', sub: 'Market Analysis Hub' },
                { id: 'concierge', icon: '🎩', label: 'Strategy Room', sub: 'Thinking Mode Enabled' }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full text-left p-6 rounded-[2rem] transition-all border ${activeTab === item.id ? 'bg-white border-[#D4AF37] shadow-2xl translate-x-2' : 'border-transparent hover:bg-white/50'}`}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <div className="font-bold text-slate-900 text-xs uppercase tracking-widest">{item.label}</div>
                      <div className="text-[9px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1">{item.sub}</div>
                    </div>
                  </div>
                </button>
              ))}
            </nav>
          </div>

          <div className="lg:w-2/3">
            <div className="bg-white rounded-[3.5rem] p-10 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.05)] min-h-[650px] border border-slate-100 flex flex-col relative overflow-hidden">
              
              {activeTab === 'creative' && (
                <div className="space-y-8 flex-grow flex flex-col">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 ml-2">Aspect Ratio</span>
                      <select value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value)} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-4 text-[10px] font-bold outline-none focus:ring-1 focus:ring-[#D4AF37]">
                        <option value="16:9">16:9 Cinema</option>
                        <option value="9:16">9:16 Portrait</option>
                        <option value="1:1">1:1 Square</option>
                        <option value="4:3">4:3 Gallery</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                       <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 ml-2">Detail Level</span>
                      <select value={imageSize} onChange={(e) => setImageSize(e.target.value)} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-4 text-[10px] font-bold outline-none focus:ring-1 focus:ring-[#D4AF37]">
                        <option value="1K">1K Standard</option>
                        <option value="2K">2K Premium</option>
                        <option value="4K">4K Master</option>
                      </select>
                    </div>
                  </div>

                  <textarea 
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe your creative intent..."
                    className="w-full h-32 bg-slate-50 border border-slate-100 rounded-[2rem] p-8 text-sm font-medium focus:ring-1 focus:ring-[#D4AF37] outline-none resize-none transition-all"
                  />

                  <div className="flex gap-4">
                    <button 
                      onClick={handleImageGen}
                      disabled={isGenerating}
                      className="flex-1 bg-slate-900 text-white font-bold py-5 rounded-2xl text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all disabled:opacity-50 active:scale-[0.98]"
                    >
                      {isGenerating ? 'Rendering Visual...' : 'Generate Image'}
                    </button>
                    <button 
                      onClick={handleVideoGen}
                      disabled={isGenerating}
                      className="flex-1 border-2 border-slate-900 text-slate-900 font-bold py-5 rounded-2xl text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all disabled:opacity-50 active:scale-[0.98] group"
                    >
                      {isGenerating ? 'Processing Video...' : 'Animate with Veo'}
                    </button>
                  </div>

                  <div className="mt-4 flex-grow aspect-video rounded-[2.5rem] bg-slate-50 flex items-center justify-center overflow-hidden relative border border-slate-100 shadow-inner group">
                    {isGenerating && (
                      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center text-center p-12">
                        <div className="w-16 h-16 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin mb-8"></div>
                        <p className="text-xs font-black text-slate-900 uppercase tracking-widest mb-2 animate-pulse">
                          {VIDEO_STATUS_MESSAGES[statusMessageIndex]}
                        </p>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.3em]">Axis Engine Processing</p>
                      </div>
                    )}
                    
                    {result?.type === 'image' && <img src={result.url} className="w-full h-full object-contain animate-fadeIn" />}
                    {result?.type === 'video' && <video src={result.url} controls autoPlay loop className="w-full h-full object-contain animate-fadeIn" />}
                    
                    {!result && !isGenerating && (
                      <div className="text-center p-12 opacity-30">
                        <div className="text-5xl mb-6 grayscale">🎨</div>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.4em]">Creative Sandbox Idle</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'concierge' && (
                <div className="flex flex-col h-[580px]">
                  <div className="flex-grow overflow-y-auto space-y-6 mb-6 pr-4 custom-scrollbar">
                    {chatHistory.length === 0 && (
                      <div className="h-full flex flex-col items-center justify-center text-center px-12">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-8 text-3xl">🎩</div>
                        <h4 className="text-xl font-bold serif italic mb-3">Axis Strategy War Room</h4>
                        <p className="text-slate-400 text-[10px] font-black max-w-xs uppercase tracking-widest leading-relaxed">
                          Gemini 3 Pro with extended thinking budget for complex business modeling.
                        </p>
                      </div>
                    )}
                    {chatHistory.map((msg, i) => (
                      <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] p-6 rounded-[2rem] text-xs font-medium leading-relaxed ${msg.role === 'user' ? 'bg-slate-900 text-white rounded-tr-none' : 'bg-slate-50 text-slate-800 border border-slate-100 rounded-tl-none shadow-sm'}`}>
                          {msg.text}
                        </div>
                      </div>
                    ))}
                    {isGenerating && (
                      <div className="flex justify-start">
                        <div className="bg-slate-50 border border-slate-100 p-6 rounded-[2rem] rounded-tl-none animate-pulse">
                          <div className="flex gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]"></span>
                            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] delay-150"></span>
                            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] delay-300"></span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="relative pt-4 border-t border-slate-50">
                    <input 
                      type="text"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleChat()}
                      placeholder="Ask the Axis Lead Strategist for deep insight..."
                      className="w-full bg-slate-50 border border-slate-100 rounded-[1.5rem] px-8 py-5 pr-20 text-sm font-medium focus:ring-1 focus:ring-[#D4AF37] outline-none transition-all"
                    />
                    <button 
                      onClick={handleChat}
                      className="absolute right-3 top-[calc(50%+8px)] -translate-y-1/2 w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center hover:bg-black transition-all shadow-lg active:scale-95"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'intelligence' && (
                <div className="space-y-8 flex-grow">
                  <div className="p-10 bg-[#D4AF37]/5 border border-[#D4AF37]/20 rounded-[2.5rem] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/10 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-[#D4AF37]/20 transition-all"></div>
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-[0.3em] mb-4">Neural Market Grounding</h4>
                    <p className="text-xs text-slate-500 leading-relaxed font-light mb-8 max-w-md">
                      Identify real-time shifts in the creator economy using the Axis Intelligence Engine.
                    </p>
                    <div className="grid grid-cols-2 gap-4 relative z-10">
                      <button className="p-6 bg-white border border-slate-100 rounded-2xl text-left hover:shadow-2xl transition-all group/btn active:scale-95">
                        <div className="text-2xl mb-3 group-hover/btn:scale-110 transition-transform">📍</div>
                        <div className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Regional Intel</div>
                        <div className="text-[8px] text-slate-400 mt-1 uppercase font-bold">Maps Grounding</div>
                      </button>
                      <button className="p-6 bg-white border border-slate-100 rounded-2xl text-left hover:shadow-2xl transition-all group/btn active:scale-95">
                        <div className="text-2xl mb-3 group-hover/btn:scale-110 transition-transform">🔍</div>
                        <div className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Live Trend Scan</div>
                        <div className="text-[8px] text-slate-400 mt-1 uppercase font-bold">Search Grounding</div>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MarketingLab;
