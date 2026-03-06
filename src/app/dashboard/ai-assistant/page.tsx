'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, User, Bot, Loader2, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm your AXIS AI Assistant. How can I help you create today? I can write scripts, generate hooks, or help with your brand strategy.",
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/write', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input, context: "AI Assistant Chat" }),
      });

      if (response.status === 403) {
        const data = await response.json();
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `${data.message || "Insufficient credits."} Please top up your wallet in the settings.`,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, assistantMessage]);
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to generate response');
      }

      const data = await response.json();
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.text || "I'm sorry, I couldn't generate a response.",
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat Error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I encountered an error. Please check your credit balance or try again later.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-160px)] flex flex-col">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
            <Sparkles className="text-brand-purple" /> AI Assistant
          </h1>
          <p className="text-zinc-400">Your personal creative co-pilot powered by Gemini 3.1.</p>
        </div>
        <button 
          onClick={() => setMessages([messages[0]])}
          className="p-2 rounded-xl bg-white/5 border border-white/10 text-zinc-500 hover:text-red-400 transition-all"
          title="Clear Chat"
        >
          <Trash2 size={20} />
        </button>
      </header>

      <div className="flex-1 glass rounded-[40px] overflow-hidden flex flex-col border-brand-purple/10">
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide"
        >
          {messages.map((msg) => (
            <div 
              key={msg.id}
              className={cn(
                "flex gap-4 max-w-[85%]",
                msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-2xl flex items-center justify-center shrink-0",
                msg.role === 'user' ? "bg-brand-blue/10 text-brand-blue" : "bg-brand-purple/10 text-brand-purple"
              )}>
                {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
              </div>
              <div className={cn(
                "p-4 rounded-3xl text-sm leading-relaxed",
                msg.role === 'user' 
                  ? "bg-brand-blue/10 text-white rounded-tr-none" 
                  : "bg-white/5 text-zinc-200 rounded-tl-none border border-white/5"
              )}>
                {msg.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-4 mr-auto animate-pulse">
              <div className="w-10 h-10 rounded-2xl bg-brand-purple/10 flex items-center justify-center text-brand-purple">
                <Loader2 size={20} className="animate-spin" />
              </div>
              <div className="p-4 rounded-3xl bg-white/5 text-zinc-500 text-sm rounded-tl-none border border-white/5">
                Thinking...
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-white/5 bg-white/[0.02]">
          <div className="relative group">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask me to write a script, generate hooks, or plan your next video..."
              className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl pl-6 pr-16 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-brand-purple/50 transition-all"
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="absolute right-2 top-2 w-10 h-10 rounded-xl bg-brand-purple text-white flex items-center justify-center hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <Send size={18} />
            </button>
          </div>
          <p className="mt-3 text-[10px] text-zinc-500 text-center uppercase tracking-widest font-bold">
            Uses 5 Credits per response • Powered by Gemini 3.1 Flash
          </p>
        </div>
      </div>
    </div>
  );
}
