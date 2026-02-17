import React, { useState, useEffect } from 'react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  assetUrl: string;
  assetType: string;
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, assetUrl, assetType }) => {
  const [isSharing, setIsSharing] = useState(false);
  const [trackableLink, setTrackableLink] = useState<string | null>(null);
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);
  
  const [analytics, setAnalytics] = useState({
    views: 0,
    clicks: 0,
    conversion: 0,
    regions: ['North America', 'Europe', 'Asia']
  });

  useEffect(() => {
    if (isOpen) {
      setTrackableLink(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const platforms = [
    { 
      name: 'Instagram', 
      icon: '📸', 
      color: 'bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888]',
      handler: () => handlePlatformShare('Instagram')
    },
    { 
      name: 'TikTok', 
      icon: '🎵', 
      color: 'bg-black',
      handler: () => handlePlatformShare('TikTok')
    },
    { 
      name: 'YouTube', 
      icon: '📽️', 
      color: 'bg-[#ff0000]',
      handler: () => handlePlatformShare('YouTube')
    },
    { 
      name: 'Twitter (X)', 
      icon: '✖️', 
      color: 'bg-slate-900',
      handler: () => handlePlatformShare('Twitter')
    },
    { 
      name: 'Direct Pulse', 
      icon: '🚀', 
      color: 'bg-indigo-600',
      handler: () => handleNativeShare()
    }
  ];

  const generateTrackableLink = () => {
    setIsGeneratingLink(true);
    setTimeout(() => {
      const uniqueId = Math.random().toString(36).substring(2, 10).toUpperCase();
      const generatedLink = `https://axiscreatorhub.vercel.app/pulse/${uniqueId}`;
      setTrackableLink(generatedLink);
      setAnalytics({
        views: Math.floor(Math.random() * 500) + 120,
        clicks: Math.floor(Math.random() * 100) + 45,
        conversion: Math.floor(Math.random() * 15) + 5,
        regions: ['North America', 'Europe', 'Asia']
      });
      setIsGeneratingLink(false);
    }, 1200);
  };

  const getFileFromUrl = async (url: string, type: string) => {
    const response = await fetch(url);
    const blob = await response.blob();
    const extension = type === 'video' ? 'mp4' : type === 'audio' ? 'pcm' : 'png';
    return new File([blob], `faceless-asset-${Date.now()}.${extension}`, { type: blob.type });
  };

  const handleNativeShare = async () => {
    if (!navigator.share) {
      alert('Web Share API not supported in this browser.');
      return;
    }

    setIsSharing(true);
    try {
      const file = await getFileFromUrl(assetUrl, assetType);
      const shareData: ShareData = {
        title: 'Faceless Digital Life Manifest',
        text: 'Check out this elite asset I manifested on Faceless Digital Life.',
        files: [file],
      };

      if (navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        await navigator.share({
          title: 'Faceless Manifest',
          text: 'Check out my new creation!',
          url: trackableLink || window.location.href
        });
      }
    } catch (err) {
      console.error('Sharing failed:', err);
    } finally {
      setIsSharing(false);
    }
  };

  const handlePlatformShare = async (platform: string) => {
    const file = await getFileFromUrl(assetUrl, assetType);
    const downloadUrl = URL.createObjectURL(file);
    
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    const shareText = encodeURIComponent("Be the next gen creator. Just manifested a new asset with Faceless Digital Life! 🚀 #FacelessDigitalLife #CreatorEconomy");
    const shareUrl = encodeURIComponent(trackableLink || window.location.href);

    const platformUrls: Record<string, string> = {
      Instagram: 'https://www.instagram.com/',
      TikTok: 'https://www.tiktok.com/upload',
      YouTube: 'https://www.youtube.com/upload',
      Twitter: `https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`
    };

    setTimeout(() => {
      window.open(platformUrls[platform], '_blank');
    }, 1000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Pulse Link copied! Ready for distribution.');
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-950/60 backdrop-blur-2xl animate-fadeIn">
      <div className="bg-white rounded-[4rem] max-w-xl w-full p-12 shadow-[0_50px_100px_rgba(0,0,0,0.3)] border border-slate-200 relative overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="relative z-10">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="text-3xl font-black text-slate-900 tracking-tight italic outfit uppercase">Pulse Hub</h3>
              <p className="text-indigo-600 font-bold text-[10px] uppercase tracking-[0.3em] mt-2">Faceless Digital Life Asset Ready</p>
            </div>
            <button onClick={onClose} className="p-4 hover:bg-slate-50 rounded-3xl transition-all">
              <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth={2.5}/></svg>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
            {platforms.map(p => (
              <button 
                key={p.name}
                disabled={isSharing}
                className="flex flex-col items-center gap-4 p-6 rounded-[2rem] border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50 transition-all text-center group disabled:opacity-50"
                onClick={p.handler}
              >
                <div className={`w-12 h-12 ${p.color} rounded-2xl flex items-center justify-center text-xl shadow-lg group-hover:scale-110 transition-transform text-white`}>
                  {isSharing && p.name === 'Direct Pulse' ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : p.icon}
                </div>
                <span className="font-black text-[9px] uppercase tracking-widest text-slate-900 leading-tight">{p.name}</span>
              </button>
            ))}
          </div>

          <div className="mb-10 p-8 bg-slate-950 rounded-[2.5rem] text-white overflow-hidden relative group">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <span className="text-xl">🔗</span>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Production Pulse Link</span>
              </div>
            </div>

            {trackableLink ? (
              <div className="space-y-6">
                <div className="flex gap-3">
                  <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-[11px] font-black text-indigo-300 truncate font-mono">
                    {trackableLink}
                  </div>
                  <button onClick={() => copyToClipboard(trackableLink)} className="px-8 bg-white text-slate-950 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl">Copy</button>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <button 
                  onClick={generateTrackableLink}
                  disabled={isGeneratingLink}
                  className="w-full py-5 bg-indigo-600 rounded-2xl text-white font-black text-[10px] uppercase tracking-[0.2em] hover:scale-[1.02] transition-all shadow-2xl flex items-center justify-center gap-3"
                >
                  {isGeneratingLink ? 'Generating Node...' : 'Generate Smart Pulse Link'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;