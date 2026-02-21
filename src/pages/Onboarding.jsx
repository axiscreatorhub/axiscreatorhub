import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Target, 
  Users, 
  Palette, 
  ArrowRight, 
  CheckCircle2,
  Instagram,
  Youtube,
  Video
} from 'lucide-react';

const Onboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    niche: '',
    primaryPlatform: 'instagram',
    contentGoal: 'growth',
    experience: 'beginner'
  });

  const token = localStorage.getItem('axis_token');
  const email = localStorage.getItem('axis_email');

  useEffect(() => {
    if (!token || !email) navigate('/login');
  }, [token, email, navigate]);

  const handleComplete = async () => {
    setLoading(true);
    // In a real app, we'd save this to the backend
    // For now, we'll just simulate a delay and navigate
    await new Promise(r => setTimeout(r, 1500));
    navigate('/dashboard');
  };

  const steps = [
    {
      id: 1,
      title: "What's your niche?",
      description: "This helps our AI tailor content hooks specifically for your audience.",
      icon: <Sparkles className="w-8 h-8 text-pink-500" />
    },
    {
      id: 2,
      title: "Primary Platform",
      description: "Where do you focus your creative energy the most?",
      icon: <Target className="w-8 h-8 text-violet-500" />
    },
    {
      id: 3,
      title: "Your Main Goal",
      description: "What are you trying to achieve in the next 90 days?",
      icon: <Users className="w-8 h-8 text-emerald-500" />
    }
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-white flex items-center justify-center p-6">
      <div className="max-w-xl w-full">
        {/* Progress Bar */}
        <div className="flex gap-2 mb-12">
          {[1, 2, 3].map((s) => (
            <div 
              key={s} 
              className={`h-1.5 flex-grow rounded-full transition-all duration-500 ${
                s <= step ? 'bg-gradient-to-r from-pink-500 to-violet-600' : 'bg-white/10'
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white/5 border border-white/10 rounded-[2.5rem] p-10 md:p-14 backdrop-blur-xl"
          >
            <div className="mb-8">
              <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-6">
                {steps[step - 1].icon}
              </div>
              <h1 className="text-3xl font-bold outfit mb-3">{steps[step - 1].title}</h1>
              <p className="text-slate-400 leading-relaxed">{steps[step - 1].description}</p>
            </div>

            {step === 1 && (
              <div className="space-y-4">
                {['Fitness & Wellness', 'Tech & Gadgets', 'Lifestyle & Travel', 'Business & Finance', 'Gaming', 'Fashion & Beauty'].map((n) => (
                  <button
                    key={n}
                    onClick={() => { setProfile({...profile, niche: n}); setStep(2); }}
                    className={`w-full p-5 rounded-2xl border text-left transition-all flex items-center justify-between group ${
                      profile.niche === n ? 'border-pink-500 bg-pink-500/10' : 'border-white/10 hover:border-white/30 bg-white/5'
                    }`}
                  >
                    <span className="font-medium">{n}</span>
                    <ArrowRight className={`w-5 h-5 transition-transform ${profile.niche === n ? 'translate-x-0' : '-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'}`} />
                  </button>
                ))}
              </div>
            )}

            {step === 2 && (
              <div className="grid grid-cols-2 gap-4">
                {[
                  { id: 'instagram', label: 'Instagram', icon: <Instagram /> },
                  { id: 'youtube', label: 'YouTube', icon: <Youtube /> },
                  { id: 'tiktok', label: 'TikTok', icon: <Video /> },
                  { id: 'other', label: 'Other', icon: <Palette /> }
                ].map((p) => (
                  <button
                    key={p.id}
                    onClick={() => { setProfile({...profile, primaryPlatform: p.id}); setStep(3); }}
                    className={`p-8 rounded-3xl border transition-all flex flex-col items-center gap-4 ${
                      profile.primaryPlatform === p.id ? 'border-violet-500 bg-violet-500/10' : 'border-white/10 hover:border-white/30 bg-white/5'
                    }`}
                  >
                    <div className="p-3 bg-white/5 rounded-xl">{p.icon}</div>
                    <span className="font-bold text-sm uppercase tracking-widest">{p.label}</span>
                  </button>
                ))}
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                {[
                  { id: 'growth', label: 'Audience Growth', sub: 'Focus on reach and new followers' },
                  { id: 'monetization', label: 'Monetization', sub: 'Focus on brand deals and sales' },
                  { id: 'authority', label: 'Build Authority', sub: 'Focus on high-value educational content' }
                ].map((g) => (
                  <button
                    key={g.id}
                    onClick={() => setProfile({...profile, contentGoal: g.id})}
                    className={`w-full p-6 rounded-2xl border text-left transition-all flex items-center justify-between ${
                      profile.contentGoal === g.id ? 'border-emerald-500 bg-emerald-500/10' : 'border-white/10 hover:border-white/30 bg-white/5'
                    }`}
                  >
                    <div>
                      <p className="font-bold mb-1">{g.label}</p>
                      <p className="text-xs text-slate-500">{g.sub}</p>
                    </div>
                    {profile.contentGoal === g.id && <CheckCircle2 className="w-6 h-6 text-emerald-500" />}
                  </button>
                ))}
                
                <button
                  onClick={handleComplete}
                  disabled={loading}
                  className="w-full mt-8 py-5 bg-gradient-to-r from-pink-500 to-violet-600 rounded-2xl font-bold text-lg shadow-xl shadow-pink-500/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
                >
                  {loading ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>Complete Setup <CheckCircle2 className="w-5 h-5" /></>
                  )}
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="mt-8 text-center">
          <p className="text-slate-500 text-sm">Step {step} of 3</p>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
