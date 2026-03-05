import { Palette } from 'lucide-react';
import { BrandKitForm } from '@/components/dashboard/BrandKitForm';

export default function BrandKitPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-12">
        <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
          <Palette className="text-brand-orange" /> Brand Identity
        </h1>
        <p className="text-zinc-400">Define your brand voice, niche, and audience to power your AI content.</p>
      </header>

      <div className="glass p-10 rounded-[40px] border-brand-orange/10">
        <BrandKitForm />
      </div>
    </div>
  );
}
