import { Calendar, Plus } from 'lucide-react';

export default function PlannerPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-12 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
            <Calendar className="text-brand-blue" /> Content Planner
          </h1>
          <p className="text-zinc-400">Plan and schedule your content across all platforms.</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus size={18} /> New Event
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass p-8 rounded-3xl border-dashed border-white/10 flex flex-col items-center justify-center text-center py-20 col-span-full">
          <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-zinc-500 mb-4">
            <Calendar size={24} />
          </div>
          <h3 className="text-lg font-bold mb-1">No events planned</h3>
          <p className="text-zinc-500 text-sm mb-6">Start by planning your content calendar.</p>
          <button className="px-6 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-bold hover:bg-white/10 transition-all">
            Plan Content
          </button>
        </div>
      </div>
    </div>
  );
}
