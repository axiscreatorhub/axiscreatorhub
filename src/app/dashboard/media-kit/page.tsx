import { UserCircle } from 'lucide-react';
import { MediaKitSettings } from '@/components/dashboard/MediaKitSettings';

export default function MediaKitPage() {
  return (
    <div className="max-w-7xl mx-auto">
      <header className="mb-12">
        <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
          <UserCircle className="text-brand-purple" /> Media Kit
        </h1>
        <p className="text-zinc-400">Manage your professional creator profile and public visibility.</p>
      </header>

      <MediaKitSettings />
    </div>
  );
}
