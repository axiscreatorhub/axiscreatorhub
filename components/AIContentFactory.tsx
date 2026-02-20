import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";

type ContentType = 'blog' | 'caption' | 'script';

interface ToolConfig {
  id: ContentType;
  label: string;
  icon: string;
  placeholder: string;
  prompt: (input: string, tone: string) => string;
}

const TOOLS: ToolConfig[] = [
  {
    id: 'blog',
    label: 'Blog Ideas',
    icon: '📝',
    placeholder: 'Enter a niche or topic (e.g., "AI in Marketing")',
    prompt: (input, tone) => `AXIS CONTENT ENGINE: Generate 5 viral blog post ideas for the niche: ${input}. Tone: ${tone}. Include a catchy title and a brief outline for each. Focus on high-engagement potential.`,
  },
  {
    id: 'caption',
    label: 'Social Captions',
    icon: '📱',
    placeholder: 'What is your post about?',
    prompt: (input, tone) => `AXIS CONTENT ENGINE: Write 3 high-converting social media captions for: ${input}. Tone: ${tone}. Include relevant emojis and hashtags. Optimize for Instagram and LinkedIn.`,
  },
  {
    id: 'script',
    label: 'Video Scripts',
    icon: '🎬',
    placeholder: 'Describe the video topic...',
    prompt: (input, tone) => `AXIS CONTENT ENGINE: Create a viral 60-second video script (Shorts/Reels/TikTok) for: ${input}. Tone: ${tone}. Include visual cues, hook, body, and call to action.`,
  }
];

const TONES = ['Viral', 'Professional', 'Aesthetic', 'Controversial', 'Educational'];

const AIContentFactory: React.FC = () => {
  const [activeTool, setActiveTool] = useState<ContentType>('blog');
  const [input, setInput] = useState('');
  const [tone, setTone] = useState('Viral');
  const [result, setResult] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!input.trim()) return;
    setIsGenerating(true);
    setResult('');

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const tool = TOOLS.find(t => t.id === activeTool);
      if (!tool) return;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: tool.prompt(input, tone),
      });

      setResult(response.text || 'No content generated.');
    } catch (error) {
      console.error('Generation failed:', error);
      setResult('Error: Failed to generate content. Please check your API key.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <section id="content-factory" className="py-40 bg-[#020617] relative overflow-hidden">
      {/* Background Accents */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-pink-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-violet-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="mb-24">
          <div className="inline-flex items-center gap-2 mb-6">
            <div className="w-2 h-2 rounded-full bg-pink-500 animate-pulse"></div>
            <span className="text-[10px] font-black text-pink-400 uppercase tracking-[0.6em]">AXIS | CONTENT ENGINE</span>
          </div>
          <h2 className="text-6xl md:text-8xl font-black text-white outfit italic uppercase tracking-tighter leading-none mb-8">
            AI Content <br />
            <span className="text-gradient">Factory.</span>
          </h2>
          <p className="text-slate-400 text-2xl font-light max-w-2xl">
            Generate viral-ready scripts, captions, and ideas in seconds using the AXIS neural content node.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-12">
          {/* Controls */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-white/5 border border-white/10 rounded-[3rem] p-10 backdrop-blur-3xl shadow-2xl">
              <div className="flex flex-wrap gap-4 mb-10">
                {TOOLS.map((tool) => (
                  <button
                    key={tool.id}
                    onClick={() => setActiveTool(tool.id)}
                    className={`flex-1 min-w-[140px] px-6 py-5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 ${
                      activeTool === tool.id
                        ? 'bg-white text-slate-950 shadow-xl scale-105'
                        : 'bg-white/5 text-slate-400 hover:text-white border border-white/5'
                    }`}
                  >
                    <span>{tool.icon}</span>
                    {tool.label}
                  </button>
                ))}
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-4">Topic / Context</label>
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={TOOLS.find(t => t.id === activeTool)?.placeholder}
                    className="w-full h-40 bg-black/40 border border-white/10 rounded-2xl p-6 text-white outline-none focus:ring-2 focus:ring-pink-500 transition-all resize-none placeholder:text-slate-700"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-4">Content Tone</label>
                  <div className="flex flex-wrap gap-3">
                    {TONES.map((t) => (
                      <button
                        key={t}
                        onClick={() => setTone(t)}
                        className={`px-5 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${
                          tone === t
                            ? 'bg-pink-500 text-white'
                            : 'bg-white/5 text-slate-400 hover:bg-white/10'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleGenerate}
                  disabled={isGenerating || !input.trim()}
                  className="w-full py-6 bg-white text-slate-950 rounded-2xl font-black text-[13px] uppercase tracking-[0.4em] hover:scale-[1.02] active:scale-95 transition-all shadow-2xl disabled:opacity-30 mt-4 flex items-center justify-center gap-3"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </>
                  ) : (
                    'Generate Content'
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Output */}
          <div className="lg:col-span-7">
            <div className="bg-white/5 border border-white/10 rounded-[4rem] p-12 h-full min-h-[600px] backdrop-blur-3xl relative overflow-hidden flex flex-col shadow-2xl">
              <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-6">
                <span className="text-[11px] font-black text-pink-400 uppercase tracking-[0.5em]">Output Node</span>
                {result && (
                  <button 
                    onClick={() => navigator.clipboard.writeText(result)}
                    className="text-[10px] font-black text-slate-400 hover:text-white uppercase tracking-widest transition-colors"
                  >
                    Copy to Clipboard
                  </button>
                )}
              </div>

              <div className="flex-grow overflow-y-auto custom-scrollbar pr-4">
                {isGenerating ? (
                  <div className="h-full flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mb-8 shadow-[0_0_30px_rgba(236,72,153,0.2)]"></div>
                    <p className="text-[12px] font-black text-slate-500 uppercase tracking-[0.5em] animate-pulse">Synthesizing Neural Output...</p>
                  </div>
                ) : result ? (
                  <div className="prose prose-invert max-w-none animate-fadeIn">
                    <div className="text-slate-300 text-lg leading-relaxed font-light whitespace-pre-wrap">
                      {result}
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-10">
                    <div className="text-9xl font-black outfit mb-8">NODE</div>
                    <p className="text-[14px] font-black uppercase tracking-[1em]">Standby</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </section>
  );
};

export default AIContentFactory;
