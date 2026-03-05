import blueprint from '@/lib/blueprint.json';
import { CheckCircle2, Rocket, Zap, Shield, Globe, Cpu, BarChart3, Mail } from 'lucide-react';

export default function BlueprintPage() {
  return (
    <div className="min-h-screen bg-[#0a0a12] text-white p-8 pt-32 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-blue/5 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-purple/5 blur-[120px] rounded-full" />

      <div className="max-w-7xl mx-auto relative">
        <header className="mb-16 text-center">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-gradient mb-4">Product Blueprint</h1>
          <p className="text-zinc-400 text-xl max-w-3xl mx-auto">
            The strategic roadmap to evolving AXIS into the definitive AI-native operating system for creators.
          </p>
        </header>

        {/* Roadmap Grid */}
        <section className="mb-24">
          <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
            <Rocket className="text-brand-purple" /> Feature Roadmap
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blueprint.roadmap.map((item) => (
              <div key={item.id} className="glass p-8 rounded-3xl hover:border-brand-purple/30 transition-all group">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs font-mono font-bold text-brand-purple bg-brand-purple/10 px-2 py-1 rounded">{item.id}</span>
                  <span className={`text-xs font-bold px-2 py-1 rounded ${
                    item.priority === 'P0' ? 'bg-red-500/10 text-red-500' : 
                    item.priority === 'P1' ? 'bg-orange-500/10 text-orange-500' : 
                    'bg-blue-500/10 text-blue-500'
                  }`}>
                    {item.priority}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-brand-purple transition-colors">{item.title}</h3>
                <p className="text-zinc-400 text-sm mb-6 leading-relaxed">{item.description}</p>
                <div className="space-y-3 pt-4 border-t border-white/5">
                  <div className="flex justify-between text-[10px] uppercase tracking-wider font-bold">
                    <span className="text-zinc-500">Effort</span>
                    <span className="text-zinc-300">{item.estimated_effort}</span>
                  </div>
                  <div className="flex justify-between text-[10px] uppercase tracking-wider font-bold">
                    <span className="text-zinc-500">Revenue</span>
                    <span className="text-brand-purple">{item.revenue_potential}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Tiers & Architecture */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24">
          <section>
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
              <Zap className="text-brand-orange" /> Tiered Structure
            </h2>
            <div className="space-y-4">
              {Object.entries(blueprint.tiered_structure).map(([tier, data]) => (
                <div key={tier} className="glass p-6 rounded-2xl border-brand-purple/5">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-2xl font-black capitalize">{tier}</h3>
                    <span className="text-brand-orange font-bold">{data.price}</span>
                  </div>
                  <ul className="space-y-2">
                    {data.features.map((feat, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-zinc-400">
                        <CheckCircle2 size={14} className="text-brand-purple" /> {feat}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
              <Cpu className="text-brand-blue" /> System Architecture
            </h2>
            <div className="glass p-8 rounded-[40px] space-y-6">
              {Object.entries(blueprint.system_architecture).map(([key, value]) => (
                <div key={key}>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-1">{key.replace('_', ' ')}</h4>
                  <p className="text-zinc-200 font-medium">{value}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Strategy & GTM */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <section>
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
              <BarChart3 className="text-brand-pink" /> Monetization
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {blueprint.monetization_strategy.map((item, i) => (
                <div key={i} className="glass p-6 rounded-2xl flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-brand-pink/10 flex items-center justify-center text-brand-pink">
                    <Zap size={18} />
                  </div>
                  <span className="text-sm font-bold">{item}</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
              <Globe className="text-brand-blue" /> Go-To-Market
            </h2>
            <div className="glass p-8 rounded-[40px] space-y-6">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-brand-blue mb-2">MVP Launch</h4>
                <p className="text-zinc-400 text-sm">{blueprint.go_to_market.mvp_launch}</p>
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-brand-purple mb-2">Scaling</h4>
                <p className="text-zinc-400 text-sm">{blueprint.go_to_market.scaling}</p>
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-brand-pink mb-2">Retention</h4>
                <p className="text-zinc-400 text-sm">{blueprint.go_to_market.retention}</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
