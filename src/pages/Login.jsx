import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Rocket, Mail, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';

const Login = () => {
  const [step, setStep] = useState(1); // 1: Request, 2: Verify
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const apiUrl = import.meta.env.VITE_API_URL || '';

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${apiUrl}/api/auth/request-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || 'Failed to request OTP');
      }
      setStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${apiUrl}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Invalid code');
      
      localStorage.setItem('axis_token', data.token);
      localStorage.setItem('axis_email', email);
      navigate('/onboarding');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-500/10 blur-[120px] rounded-full pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white/5 border border-white/10 rounded-[2.5rem] p-10 md:p-14 backdrop-blur-xl relative z-10"
      >
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-pink-500/20">
            <Rocket className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold outfit mb-2">Welcome to AXIS</h1>
          <p className="text-slate-400 text-sm">
            {step === 1 ? 'The premium operating system for creators.' : `We've sent a 6-digit code to your email.`}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl flex items-center gap-3"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {step === 1 ? (
          <form onSubmit={handleRequestOtp} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-sm focus:border-pink-500 outline-none transition-all"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Name (Optional)</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-sm focus:border-pink-500 outline-none transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-gradient-to-r from-pink-500 to-violet-600 rounded-2xl font-bold text-lg shadow-xl shadow-pink-500/20 hover:scale-[1.02] transition-all disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {loading ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <>Continue <ArrowRight className="w-5 h-5" /></>}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div className="space-y-2 text-center">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Verification Code</label>
              <input
                type="text"
                required
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="000000"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-5 text-4xl text-center tracking-[0.5em] font-black outfit focus:border-pink-500 outline-none transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full py-5 bg-gradient-to-r from-pink-500 to-violet-600 rounded-2xl font-bold text-lg shadow-xl shadow-pink-500/20 hover:scale-[1.02] transition-all disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {loading ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <>Verify & Access <Sparkles className="w-5 h-5" /></>}
            </button>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full text-xs text-slate-500 hover:text-pink-500 font-bold uppercase tracking-widest transition-colors"
            >
              ← Use different email
            </button>
          </form>
        )}

        <p className="mt-10 text-center text-[10px] text-slate-500 uppercase tracking-widest leading-relaxed">
          By continuing, you agree to our <br />
          <a href="/legal/terms" className="text-slate-300 hover:text-white underline underline-offset-4">Terms</a> and <a href="/legal/privacy" className="text-slate-300 hover:text-white underline underline-offset-4">Privacy Policy</a>.
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
