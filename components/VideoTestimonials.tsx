
import React from 'react';

const VideoTestimonials: React.FC = () => {
  const testimonials = [
    { name: "Jessica's Story", id: "dQw4w9WgXcQ" },
    { name: "How Mark Scaled", id: "dQw4w9WgXcQ" },
    { name: "Pure Skill ROI", id: "dQw4w9WgXcQ" }
  ];

  return (
    <section className="py-24 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-black text-slate-900 mb-2 uppercase tracking-tight italic">Success On Screen</h2>
          <p className="text-slate-500 font-medium">Real influencers, real results, real honest feedback.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((video, i) => (
            <div key={i} className="group">
              <div className="relative aspect-video rounded-3xl overflow-hidden bg-slate-100 border border-slate-100 shadow-xl">
                <iframe 
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${video.id}`}
                  title={video.name}
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                ></iframe>
              </div>
              <h4 className="mt-4 text-center font-black text-slate-900 uppercase tracking-widest text-xs">{video.name}</h4>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VideoTestimonials;
