'use client';

import { useState, useEffect } from 'react';
import { Library, Loader2, Download, ExternalLink, ImageIcon } from 'lucide-react';
import Image from 'next/image';

interface Asset {
  id: string;
  type: string;
  prompt: string;
  outputUrls: string;
  createdAt: string;
}

export default function AssetsPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchAssets() {
      try {
        const res = await fetch('/api/ai/image');
        if (res.ok) {
          const data = await res.json();
          setAssets(data.filter((job: any) => job.status === 'COMPLETED'));
        }
      } catch (err) {
        console.error('Failed to fetch assets', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchAssets();
  }, []);

  return (
    <div className="max-w-7xl mx-auto">
      <header className="mb-12 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
            <Library className="text-brand-pink" /> Asset Library
          </h1>
          <p className="text-zinc-400">Manage your generated images and brand assets.</p>
        </div>
      </header>

      {isLoading ? (
        <div className="flex items-center justify-center p-20">
          <Loader2 className="animate-spin text-brand-pink" size={32} />
        </div>
      ) : assets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {assets.map((asset) => {
            const urls = JSON.parse(asset.outputUrls || '[]');
            const imageUrl = urls[0];
            
            return (
              <div key={asset.id} className="glass rounded-3xl overflow-hidden border-white/5 group hover:border-brand-pink/30 transition-all">
                <div className="aspect-square relative bg-white/5">
                  {imageUrl && (
                    <Image 
                      src={imageUrl} 
                      alt={asset.prompt}
                      fill
                      className="object-cover"
                      referrerPolicy="no-referrer"
                    />
                  )}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                    <button className="p-3 rounded-2xl bg-white/10 text-white hover:bg-white/20 transition-all">
                      <Download size={20} />
                    </button>
                    <button className="p-3 rounded-2xl bg-white/10 text-white hover:bg-white/20 transition-all">
                      <ExternalLink size={20} />
                    </button>
                  </div>
                </div>
                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-brand-pink bg-brand-pink/10 px-2 py-1 rounded-lg">
                      {asset.type}
                    </span>
                    <span className="text-[10px] text-zinc-500">
                      {new Date(asset.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                    {asset.prompt}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="glass p-20 rounded-[40px] border-dashed border-white/10 text-center">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-zinc-500 mx-auto mb-6">
            <Library size={32} />
          </div>
          <h3 className="text-xl font-bold mb-2">No assets found</h3>
          <p className="text-zinc-500 text-sm max-w-xs mx-auto mb-8">
            Start by generating images in the Visual Studio.
          </p>
          <a 
            href="/dashboard/images"
            className="px-8 py-3 rounded-2xl bg-white/5 border border-white/10 text-white text-sm font-bold hover:bg-white/10 transition-all inline-block"
          >
            Go to Visual Studio
          </a>
        </div>
      )}
    </div>
  );
}
