
import React from 'react';
import { ContentPoint } from '../types';

interface ContentSectionProps {
  id?: string;
  title: string;
  subtitle: string;
  points: ContentPoint[];
  imageSrc: string;
  imagePosition: 'left' | 'right';
  theme?: 'dark' | 'light';
}

const ContentSection: React.FC<ContentSectionProps> = ({ 
  id, 
  title, 
  subtitle, 
  points, 
  imageSrc, 
  imagePosition,
  theme = 'light'
}) => {
  const isImageLeft = imagePosition === 'left';
  const bulletColors = ['bg-blue-600', 'bg-purple-600', 'bg-red-600'];
  
  return (
    <section id={id} className={`py-32 px-4 ${theme === 'light' ? 'bg-white' : 'bg-slate-50'}`}>
      <div className={`max-w-7xl mx-auto flex flex-col ${isImageLeft ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-16 lg:gap-24`}>
        <div className="w-full lg:w-1/2 space-y-10">
          <div>
            <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight text-slate-900 leading-tight">{title}</h2>
            <p className="text-xl text-slate-600 leading-relaxed font-medium">{subtitle}</p>
          </div>
          <div className="space-y-8">
            {points.map((point, index) => (
              <div key={index} className="flex gap-6 group">
                <div className={`flex-shrink-0 w-12 h-12 rounded-2xl ${bulletColors[index % 3]} flex items-center justify-center text-white font-black text-xl shadow-lg transition-transform group-hover:scale-110 group-hover:rotate-3`}>
                  {index + 1}
                </div>
                <div>
                  <h4 className="font-black text-xl mb-2 text-slate-900">{point.title}</h4>
                  <p className="text-slate-600 leading-relaxed">{point.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="w-full lg:w-1/2">
          <div className="relative">
            <div className={`absolute -inset-6 bg-gradient-to-tr from-blue-500/10 via-purple-500/10 to-red-500/10 rounded-[3rem] blur-3xl`}></div>
            <img 
              src={imageSrc} 
              alt={title} 
              className="relative w-full rounded-[2.5rem] shadow-2xl border-4 border-white object-cover aspect-square sm:aspect-video lg:aspect-square" 
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContentSection;
