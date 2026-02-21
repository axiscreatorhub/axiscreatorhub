
import React from 'react';
import { Testimonial } from '../types';

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "S. J.",
    role: "Lifestyle Curator",
    avatar: "https://picsum.photos/id/64/100/100",
    content: "Axis didn't just give me a course; they gave me a framework for an entire business. My conversion rates have seen a shift I never thought possible."
  },
  {
    id: 2,
    name: "M. T.",
    role: "Strategy Lead",
    avatar: "https://picsum.photos/id/65/100/100",
    content: "Effective principles for the digital age. This is the only platform that speaks to creators like high-level entrepreneurs rather than just content machines."
  },
  {
    id: 3,
    name: "E. R.",
    role: "Visual Artist",
    avatar: "https://picsum.photos/id/66/100/100",
    content: "The aesthetic, the strategy, and the tools are all perfectly aligned. Axis has completely redefined how I view reach and marketing."
  }
];

const Proof: React.FC = () => {
  return (
    <section className="py-24 bg-white border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-20 text-slate-800 serif italic">Voices of Growth</h2>
        <div className="grid md:grid-cols-3 gap-12">
          {testimonials.map((t) => (
            <div key={t.id} className="bg-[#F9FAFB] p-10 rounded-3xl border border-slate-100 transition-all soft-shadow">
              <div className="flex items-center gap-5 mb-8">
                <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full grayscale" />
                <div>
                  <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wider">{t.name}</h4>
                  <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">{t.role}</p>
                </div>
              </div>
              <p className="text-slate-500 italic leading-relaxed text-sm font-light">&quot;{t.content}&quot;</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Proof;
