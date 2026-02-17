import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";

const IntelligenceLab: React.FC = () => {
  const [activeAnalysis, setActiveAnalysis] = useState<'market' | 'media'>('market');
  const [query, setQuery] = useState('');
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [urls, setUrls] = useState<{web?: {uri: string, title: string}}[]>([]);

  const handleGroundingSearch = async () => {
    if (!query) return;
    setIsAnalyzing(true);
    setUrls([]);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `AXIS MARKET INTELLIGENCE: Analyze ${query} with world-class accuracy. Provide trending triggers and strategic signals for digital influencers. Focus on ethical, safe growth strategies.`,
        config: { tools: [{ googleSearch: {} }] }
      });
      
      setAnalysisResult(response.text);
      if (response.candidates?.[0]?.groundingMetadata?.groundingChunks) {
        setUrls(response.candidates[0].groundingMetadata.groundingChunks as any);
      }
    } catch (e) { console.error(e); } finally { setIsAnalyzing(false); }
  };

  const handleMapsResearch = async () => {
    if (!query) return;
    setIsAnalyzing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `AXIS GEO-INTEL: Research ${query} local creator opportunities and trending regional narratives for high-fidelity content deployment.`,
        config: { tools: [{ googleMaps: {} }] }
      });
      setAnalysisResult(response.text);
    } catch (e) { console.error(e); } finally { setIsAnalyzing(false); }
  };

  return (
    <section id="intelligence" className="py-48 bg-[#020617] text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{backgroundImage: 'radial-gradient(circle at 2px 2px, #4f46e5 1px, transparent 0)', backgroundSize: '60px 60px'}}></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="max-w-4xl mb-32">
          <div className="inline-flex items-center gap-3 px-5 py-2 mb-8 rounded-full bg-white/5 border border-white/10 text-[11px] font-black uppercase tracking-[0.5em] text-violet-400">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse"></span>
            Neural Intelligence Hub
          </div>
          <h2 className="text-6xl md:text-8xl font-black outfit italic mb-10 leading-[0.85] uppercase tracking-tighter">Strategic Intel. <br/><span className="text-gradient">World Class.</span></h2>
          <p className="text-slate-400 text-2xl leading-relaxed font-light max-w-3xl">
            Leverage AXIS Hub proprietary grounding engine to identify global market shifts and regional trends with neural precision.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-24">
          <div className="space-y-12">
            <div className="flex gap-6 p-2 bg-white/5 rounded-[2.5rem] border border-white/10 w-fit backdrop-blur-3xl">
              <button onClick={() => setActiveAnalysis('market')} className={`px-10 py-5 rounded-[2rem] text-[11px] font-black uppercase tracking-widest transition-all ${activeAnalysis === 'market' ? 'bg-white text-slate-900 shadow-2xl' : 'text-slate-400 hover:text-white'}`}>Intel Research</button>
              <button onClick={() => setActiveAnalysis('media')} className={`px-10 py-5 rounded-[2rem] text-[11px] font-black uppercase tracking-widest transition-all ${activeAnalysis === 'media' ? 'bg-white text-slate-900 shadow-2xl' : 'text-slate-400 hover:text-white'}`}>Neural Analyst</button>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-[4rem] p-12 backdrop-blur-3xl shadow-2xl">
              <label className="block text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] mb-8">Intelligence Inquiry</label>
              <div className="relative">
                <input 
                  type="text" 
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={activeAnalysis === 'market' ? "Research 'Emerging cinematic aesthetics 2024'..." : "Analyze the narrative flow of this strategy..."}
                  className="w-full bg-black/20 border border-white/10 rounded-[2rem] px-10 py-8 pr-24 text-sm font-medium focus:ring-4 focus:ring-violet-500/20 outline-none transition-all placeholder:text-slate-700"
                />
                <button 
                  onClick={handleGroundingSearch}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-16 h-16 bg-violet-500 text-white rounded-2xl flex items-center justify-center hover:scale-105 transition-transform shadow-2xl shadow-violet-500/30"
                >
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeWidth={3}/></svg>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-6 mt-12">
                <button onClick={handleMapsResearch} className="p-10 bg-white/5 border border-white/10 rounded-3xl text-left hover:bg-white/10 transition-all group">
                  <div className="text-3xl mb-4 group-hover:scale-110 transition-transform">📍</div>
                  <div className="text-[11px] font-black uppercase tracking-widest mb-2">Geo-Grounding</div>
                  <div className="text-[9px] text-slate-500 uppercase font-black tracking-widest opacity-60">Local Market Signal</div>
                </button>
                <button onClick={handleGroundingSearch} className="p-10 bg-white/5 border border-white/10 rounded-3xl text-left hover:bg-white/10 transition-all group">
                  <div className="text-3xl mb-4 group-hover:scale-110 transition-transform">🌐</div>
                  <div className="text-[11px] font-black uppercase tracking-widest mb-2">Omni-Search</div>
                  <div className="text-[9px] text-slate-500 uppercase font-black tracking-widest opacity-60">Global Narrative Sync</div>
                </button>
              </div>
            </div>
          </div>

          <div className="bg-black/60 rounded-[5rem] border border-white/10 p-16 min-h-[500px] flex flex-col relative overflow-hidden shadow-2xl">
            {isAnalyzing ? (
              <div className="flex-grow flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mb-10 shadow-[0_0_30px_rgba(139,92,246,0.3)]"></div>
                <p className="text-[12px] font-black text-slate-500 uppercase tracking-[0.5em] animate-pulse">Grounding Neural Node...</p>
              </div>
            ) : analysisResult ? (
              <div className="flex-grow animate-fadeIn overflow-y-auto space-y-10 custom-scrollbar pr-4">
                 <h4 className="text-[12px] font-black text-violet-400 uppercase tracking-[0.6em] mb-8 border-b border-white/5 pb-4">Intelligence Manifesto</h4>
                 <div className="text-slate-300 text-lg leading-relaxed font-light whitespace-pre-wrap prose prose-invert max-w-none">{analysisResult}</div>
                 
                 {urls.length > 0 && (
                   <div className="pt-12 border-t border-white/10">
                     <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-6">Source Matrix</p>
                     <div className="space-y-4">
                       {urls.map((u, i) => u.web && (
                         <a key={i} href={u.web.uri} target="_blank" className="flex items-center justify-between p-6 bg-white/5 rounded-2xl text-[11px] hover:text-violet-400 transition-all border border-transparent hover:border-violet-500/30 group">
                           <span className="font-bold uppercase tracking-widest">{u.web.title}</span>
                           <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" strokeWidth={3}/></svg>
                         </a>
                       ))}
                     </div>
                   </div>
                 )}
              </div>
            ) : (
              <div className="flex-grow flex flex-col items-center justify-center text-center opacity-10">
                <div className="text-9xl mb-12 outfit font-black">INTEL</div>
                <p className="text-[14px] font-black uppercase tracking-[1em]">Engine Standby</p>
              </div>
            )}
            
            <div className="absolute top-0 right-0 w-48 h-48 bg-violet-500/5 rounded-full -mr-24 -mt-24 blur-[80px]"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IntelligenceLab;