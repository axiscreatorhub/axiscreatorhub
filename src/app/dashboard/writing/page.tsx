import { PenTool } from 'lucide-react';
import { WritingTool } from '@/components/dashboard/WritingTool';

export default function WritingPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-12">
        <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
          <PenTool className="text-brand-purple" /> AI Writer
        </h1>
        <p className="text-zinc-400">Create high-quality copy for any platform in seconds.</p>
      </header>

      <WritingTool />
    </div>
  );
}
