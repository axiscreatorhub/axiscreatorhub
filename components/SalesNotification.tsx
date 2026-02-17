
import React, { useState, useEffect } from 'react';

const names = ["James K.", "Sarah L.", "Alex M.", "Elena R.", "Marcus T.", "Jessica W.", "David B."];
const locations = ["California", "London", "Sydney", "New York", "Dubai", "Toronto"];
const courses = ["Axis Manifestation Protocol", "High-Tier Digital Foundation", "Strategic AI Ads"];

const SalesNotification: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState({ name: "", location: "", course: "" });

  useEffect(() => {
    const showNotification = () => {
      setData({
        name: names[Math.floor(Math.random() * names.length)],
        location: locations[Math.floor(Math.random() * locations.length)],
        course: courses[Math.floor(Math.random() * courses.length)]
      });
      setVisible(true);
      setTimeout(() => setVisible(false), 5000);
    };

    const interval = setInterval(showNotification, 18000);
    setTimeout(showNotification, 5000); 

    return () => clearInterval(interval);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 left-6 z-[100] animate-bounce-in">
      <div className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-3xl shadow-2xl p-5 flex items-center gap-5 max-w-sm">
        <div className="w-12 h-12 rounded-2xl meta-gradient flex items-center justify-center text-white font-black text-xl shadow-lg">
          {data.name[0]}
        </div>
        <div className="flex-1">
          <p className="text-xs text-slate-500 font-medium">
            <span className="text-slate-900 font-bold">{data.name}</span> from {data.location}
          </p>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 leading-tight">
            Just activated <span className="text-violet-600 font-black">{data.course}</span>
          </p>
          <p className="text-[9px] text-emerald-500 font-black mt-1.5 flex items-center gap-1.5 uppercase tracking-tighter">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Nexus Connection Verified
          </p>
        </div>
      </div>
    </div>
  );
};

export default SalesNotification;
