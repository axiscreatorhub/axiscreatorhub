
interface UserDashboardProps {
  usage: { images: number; videos: number };
  limits: { images: number; videos: number };
  tier: string;
}

const UserDashboard = ({ usage, limits, tier }: UserDashboardProps) => {
  const imagePercent = Math.min((usage.images / limits.images) * 100, 100);
  const videoPercent = Math.min((usage.videos / limits.videos) * 100, 100);

  return (
    <div className="w-full bg-white/40 backdrop-blur-xl border border-white/60 rounded-[2.5rem] p-6 mb-10 shadow-xl shadow-violet-100/20">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl meta-gradient flex items-center justify-center text-white shadow-lg shadow-violet-200">
             <span className="text-2xl">✨</span>
          </div>
          <div>
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Current Pulse Tier</div>
            <div className="text-xl font-black text-slate-900 outfit uppercase tracking-tight">{tier}</div>
          </div>
        </div>

        <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 gap-6 w-full md:w-auto">
          <div className="space-y-2">
            <div className="flex justify-between text-[9px] font-black uppercase tracking-widest">
              <span className="text-slate-500">Image Manifestations</span>
              <span className={usage.images >= limits.images ? 'text-red-500' : 'text-violet-600'}>
                {limits.images - usage.images} Remaining
              </span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full meta-gradient transition-all duration-1000" 
                style={{ width: `${100 - imagePercent}%` }}
              ></div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-[9px] font-black uppercase tracking-widest">
              <span className="text-slate-500">Video Cinematic Pulses</span>
              <span className={usage.videos >= limits.videos ? 'text-red-500' : 'text-violet-600'}>
                {limits.videos - usage.videos} Remaining
              </span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full meta-gradient transition-all duration-1000" 
                style={{ width: `${100 - videoPercent}%` }}
              ></div>
            </div>
          </div>
        </div>

        <a href="#trial" className="px-8 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-violet-600 transition-all shadow-xl active:scale-95">
          Upgrade Hub
        </a>
      </div>
    </div>
  );
};

export default UserDashboard;
