import React from 'react';

const AboutUs: React.FC = () => {
  const values = [
    {
      title: "Creation for Everyone",
      desc: "Whether you have 10 followers or 10 million, AXIS is designed for you. We've simplified the world's most powerful AI so you can focus on being you.",
      icon: "🤝"
    },
    {
      title: "The Joy of Viral",
      desc: "Creating content should be the best part of your day. We handle the heavy lifting of editing and strategy so you can stay in the creative fun zone.",
      icon: "🎈"
    },
    {
      title: "Social-First DNA",
      desc: "AXIS lives where you do—TikTok, Instagram, YouTube. Our system is baked with the trends and sounds that define today's digital culture.",
      icon: "📱"
    }
  ];

  return (
    <section id="about" className="py-48 bg-white relative overflow-hidden">
      {/* Vibrant soft glows */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-pink-50/50 rounded-full nebula-blur -mr-64 -mt-32"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-violet-50/50 rounded-full nebula-blur -ml-48 -mb-24"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row gap-24 items-center">
          <div className="lg:w-1/2">
            <div className="inline-flex items-center gap-2 px-5 py-2 mb-10 rounded-full bg-slate-50 border border-slate-100 text-[10px] font-black uppercase tracking-[0.3em] text-pink-500">
              The AXIS Mission
            </div>
            <h2 className="text-6xl md:text-7xl font-black text-slate-900 mb-10 leading-[0.9] tracking-tighter outfit italic uppercase">
              Creator Hub <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-500 italic serif">For Everyone.</span>
            </h2>
            <p className="text-2xl text-slate-500 font-medium leading-relaxed mb-12 max-w-xl">
              AXIS was built with one goal: to make world-class social media tools so easy and fun that anyone can become an influencer. No intimidation, just inspiration.
            </p>
            
            <div className="space-y-12">
              {values.map((val, i) => (
                <div key={i} className="flex gap-8 group">
                  <div className="w-16 h-16 rounded-[1.5rem] bg-slate-50 border border-slate-100 flex items-center justify-center text-3xl group-hover:scale-110 group-hover:bg-white group-hover:shadow-2xl transition-all duration-500">
                    {val.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-black text-slate-900 mb-3 uppercase tracking-wide outfit italic">{val.title}</h4>
                    <p className="text-slate-500 text-[16px] leading-relaxed font-medium">{val.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:w-1/2 relative">
            <div className="relative aspect-square rounded-[5rem] overflow-hidden glass-card p-6 border-slate-200 shadow-2xl">
              <div className="absolute inset-0 bg-pink-500/5 mix-blend-multiply"></div>
              {/* Influencer-focused image */}
              <img 
                src="https://images.unsplash.com/photo-1541535881962-e668f38d45a1?auto=format&fit=crop&q=80&w=1200" 
                alt="Influencer Creating" 
                className="w-full h-full object-cover rounded-[4rem] shadow-inner"
              />
              <div className="absolute top-16 -left-12 bg-white/95 backdrop-blur-3xl p-8 rounded-[2.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.1)] border border-slate-100 animate-bounce-slow">
                <div className="flex items-center gap-4">
                  <div className="w-4 h-4 bg-pink-400 rounded-full animate-pulse"></div>
                  <span className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-900">VIRAL PULSE READY</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <style>{`
        .animate-bounce-slow { animation: bounce-slow 8s infinite ease-in-out; }
        @keyframes bounce-slow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-30px); } }
        .nebula-blur { filter: blur(120px); }
      `}</style>
    </section>
  );
};

export default AboutUs;