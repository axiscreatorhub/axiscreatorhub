import { Video } from 'lucide-react';
import { VideoCreator } from '@/components/dashboard/VideoCreator';

export default function VideosPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
          <Video className="text-brand-pink" /> Video Creator
        </h1>
        <p className="text-zinc-400">Generate high-converting scripts and concepts for short-form video.</p>
      </header>

      <VideoCreator />
    </div>
  );
}
