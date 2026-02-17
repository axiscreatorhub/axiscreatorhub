import React from 'react';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'Privacy' | 'Terms' | 'EULA';
}

const LegalModal: React.FC<LegalModalProps> = ({ isOpen, onClose, type }) => {
  if (!isOpen) return null;

  const content = {
    Privacy: {
      title: "Privacy Shield v7.0",
      text: "AXIS Creator Hub strictly enforces data sovereignty. We utilize Google Cloud infrastructure for the processing of all manifestations. Your prompt history is private and utilized solely for your creative output. We do not sell user data. All generated assets are processed via secure API nodes."
    },
    Terms: {
      title: "Terms of Sync",
      text: "By accessing AXIS, you agree to our Content Integrity Policy. We strictly prohibit the manifestation of illegal, harmful, or pornographic material. All outputs are scanned via Google AI Safety Filters. Violation of these terms results in permanent node termination without refund."
    },
    EULA: {
      title: "End User License Agreement",
      text: "This world-class platform is provided for influencers and professional creators. All monetization flows are processed securely. AXIS reserves the right to scale thinking budgets based on tier status to ensure ecosystem stability across the Google-powered network."
    }
  };

  const active = content[type];

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-white rounded-[3rem] max-w-lg w-full p-10 shadow-2xl border border-white/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
        
        <div className="relative z-10">
          <h3 className="text-2xl font-black text-slate-900 mb-6 outfit italic uppercase tracking-tight">{active.title}</h3>
          <div className="max-h-[300px] overflow-y-auto pr-4 text-sm text-slate-500 leading-relaxed font-medium">
            <p>{active.text}</p>
            <p className="mt-4 font-black text-violet-600 uppercase tracking-widest text-[10px]">✔ Safety First Architecture</p>
            <p className="mt-2 text-slate-400 text-[10px]">Last Updated: October 2024</p>
          </div>
          
          <button 
            onClick={onClose}
            className="w-full mt-10 py-5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-violet-600 transition-all shadow-xl"
          >
            I Acknowledge
          </button>
        </div>
      </div>
    </div>
  );
};

export default LegalModal;