'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  MessageSquare, 
  FileText, 
  Image as ImageIcon, 
  Video, 
  Palette, 
  UserCircle, 
  Calendar, 
  Library, 
  Settings,
  Zap,
  PenTool
} from 'lucide-react';
import { cn } from '@/lib/utils';

const menuGroups = [
  {
    label: 'Overview',
    items: [
      { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    ]
  },
  {
    label: 'AI Studio',
    items: [
      { name: 'AI Studio', href: '/dashboard/ai-assistant', icon: MessageSquare },
      { name: 'Video Creator', href: '/dashboard/videos', icon: Video },
      { name: 'Image Generator', href: '/dashboard/images', icon: ImageIcon },
      { name: 'Script Writer', href: '/dashboard/scripts', icon: FileText },
      { name: 'Writing Tool', href: '/dashboard/writing', icon: PenTool },
    ]
  },
  {
    label: 'Brand & Growth',
    items: [
      { name: 'Brand Kit', href: '/dashboard/brand-kit', icon: Palette },
      { name: 'Media Kit', href: '/dashboard/media-kit', icon: UserCircle },
      { name: 'Content Planner', href: '/dashboard/planner', icon: Calendar },
    ]
  },
  {
    label: 'Account',
    items: [
      { name: 'Pricing', href: '/pricing', icon: Zap },
      { name: 'Settings', href: '/dashboard/settings', icon: Settings },
    ]
  }
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-screen fixed left-0 top-0 bg-[#0a0a12] border-r border-white/5 flex flex-col z-50">
      <div className="p-6">
        <Link href="/" className="text-2xl font-black tracking-tighter text-white flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-purple rounded-lg flex items-center justify-center">
            <Zap size={20} className="text-white fill-white" />
          </div>
          AXIS
        </Link>
      </div>
      
      <nav className="flex-1 px-4 py-4 space-y-8 overflow-y-auto custom-scrollbar">
        {menuGroups.map((group) => (
          <div key={group.label} className="space-y-2">
            <h3 className="px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600">
              {group.label}
            </h3>
            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all group",
                      isActive 
                        ? "bg-brand-purple/10 text-brand-purple" 
                        : "text-zinc-400 hover:text-white hover:bg-white/5"
                    )}
                  >
                    <item.icon size={18} className={cn(
                      "transition-transform group-hover:scale-110",
                      isActive ? "text-brand-purple" : "text-zinc-500 group-hover:text-white"
                    )} />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-white/5">
        <div className="glass p-4 rounded-2xl space-y-3">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-zinc-500">
            <span>Credits</span>
            <Zap size={12} className="text-brand-orange" />
          </div>
          <div className="flex items-end gap-1">
            <span className="text-2xl font-black text-white">1,250</span>
            <span className="text-[10px] text-zinc-500 mb-1">/ 5,000</span>
          </div>
          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-brand-purple w-1/4" />
          </div>
          <button className="w-full py-2 rounded-lg bg-brand-purple/10 text-brand-purple text-[10px] font-bold uppercase tracking-widest hover:bg-brand-purple/20 transition-colors">
            Upgrade Plan
          </button>
        </div>
      </div>
    </aside>
  );
}
