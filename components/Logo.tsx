import React from 'react';

interface LogoProps {
  className?: string;
  withText?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const Logo: React.FC<LogoProps> = ({ className = '', withText = true, size = 'md' }) => {
  const sizeMap = {
    sm: 'h-6 text-xl',
    md: 'h-8 text-2xl',
    lg: 'h-12 text-4xl',
    xl: 'h-20 text-6xl',
  };

  return (
    <div className={`flex items-center gap-4 select-none ${className}`}>
      <div className={`aspect-square ${size === 'sm' ? 'h-8' : size === 'md' ? 'h-10' : 'h-16'} relative`}>
        <div className="absolute inset-0 bg-violet-500/20 rounded-2xl blur-lg animate-pulse"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl overflow-hidden group">
          <svg className="w-3/5 h-3/5 text-white drop-shadow-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        </div>
      </div>

      {withText && (
        <div className="flex flex-col leading-none">
          <span className={`text-white font-black tracking-tighter outfit uppercase italic ${sizeMap[size]}`}>
            AXIS
          </span>
          <span className="text-violet-400 font-bold text-[7px] tracking-[0.4em] uppercase -mt-0.5 ml-1 opacity-70">
            Creator Hub
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;