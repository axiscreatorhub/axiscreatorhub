import React from 'react';

const StoreReadiness: React.FC = () => {
  // Reset Protocol for production synchronization
  const repairScript = `git add .; git commit -m "fix: resolve vercel 404 and enforce faceless digital life branding"; git push origin main --force`;

  const copyToClipboard = (text: string, title: string) => {
    navigator.clipboard.writeText(text);
    alert(`${title} Protocol Copied. Execute this in your terminal to fix the deployment error.`);
  };

  return (
    <section id="mission-control" className="py-40 bg-[#010411] border-t border-white/5 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(99,102,241,0.08),_transparent_70%)]"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="bg-black/40 rounded-[4rem] p-12 md:p-20 shadow-2xl border border-white/10 backdrop-blur-3xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 px-4 py-1.5 mb-6 rounded-full bg-indigo-500/10 text-indigo-400 font-black text-[9px] uppercase tracking-[0.5em] border border-indigo-500/20">
              DEPLOYMENT DIAGNOSTICS • FACELESS DIGITAL LIFE
            </div>
            <h3 className="text-5xl font-black text-white outfit italic uppercase tracking-tighter leading-none">System <span className="text-gradient">Integrity</span> Control</h3>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] mt-6 leading-relaxed">
              Target Subdomain: axiscreatorhub.vercel.app <br/>
              Status: Action Required to Resolve 404
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-10">
            {/* RESET PROTOCOL */}
            <div className="p-10 bg-indigo-500/10 rounded-[3rem] border border-indigo-500/30 flex flex-col relative group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-indigo-500/20 transition-all"></div>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg text-white font-black text-xl">!</div>
                <h4 className="text-sm font-black text-white uppercase tracking-widest">Protocol: Vercel Re-Sync</h4>
              </div>
              <p className="text-[11px] text-indigo-200/80 mb-10 leading-relaxed font-bold">
                Run this command to force a new build on Vercel. This often clears "DEPLOYMENT_NOT_FOUND" by refreshing the deployment metadata.
              </p>
              <div className="bg-black/60 p-6 rounded-2xl border border-indigo-500/20 text-[9px] font-mono text-indigo-400 leading-relaxed break-all mb-10 h-20 overflow-y-auto">
                {repairScript}
              </div>
              <button 
                onClick={() => copyToClipboard(repairScript, 'Deployment Sync')}
                className="mt-auto w-full py-6 bg-indigo-600 text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-transform shadow-[0_0_40px_rgba(79,70,229,0.4)]"
              >
                Trigger Global Sync
              </button>
            </div>

            {/* NODE STATUS */}
            <div className="p-10 bg-white/5 rounded-[3rem] border border-white/10 flex flex-col">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-white">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L1 21h22L12 2z"/></svg>
                </div>
                <h4 className="text-sm font-black text-white uppercase tracking-widest">404 Troubleshooting</h4>
              </div>
              <p className="text-[11px] text-slate-400 mb-10 leading-relaxed">
                If the error persists, check that your Vercel Project Name is exactly <strong>"axiscreatorhub"</strong>. Ensure a production deployment has finished successfully.
              </p>
              <div className="bg-black/60 p-6 rounded-2xl border border-white/5 mb-10">
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                    <span className="text-slate-500">Subdomain</span>
                    <span className="text-white">axiscreatorhub.vercel.app</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                    <span className="text-slate-500">Framework</span>
                    <span className="text-emerald-400">Faceless OS v6.3</span>
                  </div>
                </div>
              </div>
              <a 
                href="https://axiscreatorhub.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto w-full py-6 bg-white text-slate-950 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-transform text-center shadow-2xl"
              >
                Verify Live Site
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StoreReadiness;