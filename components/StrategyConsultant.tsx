import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const StrategyConsultant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'model', text: string }[]>([]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  
  const chatRef = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleToggle = () => {
      setIsOpen(true);
      initChat();
    };
    window.addEventListener('toggle-consultant', handleToggle);
    return () => window.removeEventListener('toggle-consultant', handleToggle);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isStreaming]);

  const initChat = () => {
    if (!chatRef.current) {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      chatRef.current = ai.chats.create({
        model: 'gemini-3-pro-preview',
        config: {
          thinkingConfig: { thinkingBudget: 32768 },
          systemInstruction: "You are the AXIS Hub Lead Creator Strategist. Your mission is to help everyone—from beginners to pros—master social media marketing. You provide advice on TikTok hooks, Instagram aesthetics, and YouTube growth. Your tone is invigorating, fun, supportive, and world-class. You are the definitive guide for anyone wanting to build a presence in the modern creator economy."
        }
      });
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isStreaming) return;
    
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsThinking(true);
    setIsStreaming(true);

    try {
      initChat();
      const streamResponse = await chatRef.current.sendMessageStream({ message: userMsg });
      let fullText = "";
      setMessages(prev => [...prev, { role: 'model', text: "" }]);

      for await (const chunk of streamResponse) {
        setIsThinking(false);
        const c = chunk as GenerateContentResponse;
        const textChunk = c.text;
        if (textChunk) {
          fullText += textChunk;
          setMessages(prev => {
            const updated = [...prev];
            updated[updated.length - 1] = { role: 'model', text: fullText };
            return updated;
          });
        }
      }
    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, { role: 'model', text: "AXIS Connection reset. Let's try that again!" }]);
    } finally {
      setIsThinking(false);
      setIsStreaming(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => { setIsOpen(true); initChat(); }}
        className="hidden md:flex fixed bottom-10 right-10 z-[100] w-20 h-20 bg-pink-600 text-white rounded-full shadow-2xl items-center justify-center hover:scale-110 transition-all border-4 border-slate-50 group"
      >
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full border-2 border-pink-600 animate-pulse"></div>
        <svg className="w-8 h-8 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M13 10V3L4 14h7v7l9-11h-7z" strokeWidth={2} />
        </svg>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[210] flex items-end justify-center md:justify-end md:p-10 pointer-events-none">
          <div className="w-full max-w-lg h-[90vh] md:h-[750px] bg-white rounded-t-[3.5rem] md:rounded-[3.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] border border-slate-100 flex flex-col pointer-events-auto animate-panelIn overflow-hidden">
            <div className="p-8 bg-pink-600 text-white flex justify-between items-center relative overflow-hidden shrink-0">
              <div className="relative z-10">
                <h4 className="text-xl font-black outfit italic uppercase tracking-tight">Strategy Chat</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`w-2 h-2 rounded-full ${isStreaming || isThinking ? 'bg-white animate-pulse' : 'bg-pink-300'}`}></span>
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-pink-100">AXIS STRATEGIST ACTIVE</span>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-xl transition-all relative z-10">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth={2.5}/></svg>
              </button>
            </div>

            <div ref={scrollRef} className="flex-grow overflow-y-auto p-8 space-y-8 scroll-smooth custom-scrollbar bg-[#FDFDFD]">
              {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center px-8 animate-fadeIn">
                  <div className="w-20 h-20 bg-pink-50 rounded-full flex items-center justify-center mb-8 border border-pink-100">
                    <span className="text-3xl">💡</span>
                  </div>
                  <h5 className="text-2xl font-black outfit italic mb-3 uppercase tracking-tighter">Need a Hook?</h5>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-[0.2em] leading-loose max-w-xs">Ask for a viral strategy or a fresh TikTok idea.</p>
                </div>
              )}
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-messageIn`}>
                  <div className={`group relative max-w-[88%] p-6 rounded-[2.5rem] text-sm font-medium leading-relaxed shadow-sm transition-all ${m.role === 'user' ? 'bg-pink-600 text-white rounded-tr-none' : 'bg-white text-slate-800 rounded-tl-none border border-slate-100'}`}>
                    {m.text || (isThinking && <div className="flex gap-1.5 py-1">
                      <div className="w-2 h-2 rounded-full bg-pink-500 animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="w-2 h-2 rounded-full bg-pink-500 animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="w-2 h-2 rounded-full bg-pink-500 animate-bounce"></div>
                    </div>)}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-8 pb-12 md:pb-8 bg-white border-t border-slate-50 shrink-0">
              <div className="relative group">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  disabled={isStreaming}
                  placeholder="Ask for a viral idea..."
                  className="w-full bg-slate-50 border border-slate-100 rounded-[2rem] px-8 py-6 pr-16 text-sm font-medium outline-none focus:ring-1 focus:ring-pink-500 transition-all"
                />
                <button 
                  onClick={handleSend}
                  disabled={isStreaming || !input.trim()}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 bg-pink-600 text-white rounded-[1.2rem] flex items-center justify-center hover:bg-pink-700 shadow-xl"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeWidth={3}/></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes panelIn { from { opacity: 0; transform: translateY(100%); } to { opacity: 1; transform: translateY(0); } }
        @media (min-width: 768px) { @keyframes panelIn { from { opacity: 0; transform: translateY(30px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } } }
        .animate-panelIn { animation: panelIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </>
  );
};

export default StrategyConsultant;