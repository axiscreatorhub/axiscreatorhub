import { Sparkles } from 'lucide-react';
import { AIStudio } from '@/components/dashboard/AIStudio';

export default function AIAssistantPage() {
  return (
    <div className="max-w-7xl mx-auto h-full space-y-8">
      <header>
        <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
          <Sparkles className="text-brand-purple" /> AI Studio
        </h1>
        <p className="text-zinc-400">Your unified workspace for content creation and brand strategy.</p>
      </header>

      <AIStudio />
    </div>
  );
}
