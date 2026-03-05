import { FileText } from 'lucide-react';
import { ScriptGenerator } from '@/components/dashboard/ScriptGenerator';

export default function ScriptsPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-12">
        <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
          <FileText className="text-brand-purple" /> Script Generator
        </h1>
        <p className="text-zinc-400">Generate high-converting video scripts tailored to your brand voice.</p>
      </header>

      <ScriptGenerator />
    </div>
  );
}
