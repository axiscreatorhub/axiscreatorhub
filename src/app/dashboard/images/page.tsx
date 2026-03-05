import { Image as ImageIcon } from 'lucide-react';
import { ImageGenerator } from '@/components/dashboard/ImageGenerator';

export default function ImagesPage() {
  return (
    <div className="max-w-7xl mx-auto">
      <header className="mb-12">
        <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
          <ImageIcon className="text-brand-blue" /> Visual Studio
        </h1>
        <p className="text-zinc-400">Generate high-quality thumbnails, social posts, and brand assets with AI.</p>
      </header>

      <ImageGenerator />
    </div>
  );
}
