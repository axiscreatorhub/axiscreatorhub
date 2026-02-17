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
      title: "Privacy Shield v4.0",
      text: "Faceless Digital Life respects your digital sovereignty. We use the Camera and Microphone solely for asset manifestation. Your prompt history and generated data are processed securely via Google Gemini and are not sold to third-party brokers. All manifestations are encrypted at the edge."
    },
    Terms: {
      title: "Terms of Manifestation",
      text: "By using Faceless Digital Life, you agree that you own the rights to the prompts you provide. Generated assets are yours to use for commercial distribution. We prohibit the generation of harmful, illegal, or malicious content that violates our ethical manifest."
    },
    EULA: {
      title: "End User License Agreement",
      text: "This software is provided as-is for world-class creators. Subscriptions are managed securely. Faceless Digital Life reserves the right to throttle usage on trial tiers to ensure ecosystem stability across the Vercel production network."
    }
  };

  const active = content[type];

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-white rounded-[3rem] max-w-lg w-full p-10 shadow-2xl border border-white/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
        
        <div className="relative z-10">
          <h3 className="text-2xl font-black text-slate-900 mb-6 outfit italic uppercase tracking-tight">{active.title}</h3>
          <div className="max-h-[300px] overflow-y-auto pr-4 text-sm text-slate-500 leading-relaxed font-medium">
            <p>{active.text}</p>
            <p className="mt-4">Last Updated: October 2024</p>
            <p className="mt-2">Contact: support@facelessdigitallife.com</p>
          </div>
          
          <button 
            onClick={onClose}
            className="w-full mt-10 py-5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl"
          >
            I Acknowledge
          </button>
        </div>
      </div>
    </div>
  );
};

export default LegalModal;