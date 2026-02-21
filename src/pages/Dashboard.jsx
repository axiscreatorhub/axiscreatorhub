import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  Zap, 
  Settings, 
  LogOut, 
  ChevronRight, 
  Copy, 
  Check, 
  AlertCircle,
  TrendingUp,
  CreditCard,
  Sparkles
} from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [genLoading, setGenLoading] = useState(false);
  const [error, setError] = useState('');
  const [genResult, setGenResult] = useState(null);
  const [copied, setCopied] = useState(false);

  const [formData, setFormData] = useState({
    goal: 'insta_reel',
    niche: '',
    topic: '',
    tone: 'bold'
  });

  const token = localStorage.getItem('axis_token');
  const email = localStorage.getItem('axis_email');
  const apiUrl = import.meta.env.VITE_API_URL || '';

  useEffect(() => {
    if (!token || !email) {
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/me`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'x-user-email': email
          }
        });
        if (!response.ok) throw new Error('Session expired');
        const data = await response.json();
        setUser(data);
      } catch (err) {
        handleLogout();
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token, email, apiUrl]);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setGenLoading(true);
    setError('');
    setGenResult(null);

    try {
      const response = await fetch(`${apiUrl}/api/ai/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'x-user-email': email
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Generation failed');
      setGenResult(data);
      
      // Refresh user stats
      const userRes = await fetch(`${apiUrl}/api/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-user-email': email
        }
      });
      if (userRes.ok) setUser(await userRes.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setGenLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('axis_token');
    localStorage.removeItem('axis_email');
    navigate('/login');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(genResult, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!token || !email) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mb-8 border border-white/10">
          <AlertCircle className="w-10 h-10 text-slate-500" />
        </div>
        <h2 className="text-3xl font-bold outfit mb-4">Session Expired</h2>
        <p className="text-slate-400 mb-8 max-w-sm">Your session has timed out for security. Please log in again to continue creating.</p>
        <button 
          onClick={() => navigate('/login')}
          className="px-10 py-4 bg-white text-black rounded-2xl font-bold hover:bg-slate-200 transition-all"
        >
          Return to Login
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-50 flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-72 border-r border-white/5 bg-[#020617]/50 backdrop-blur-xl sticky top-0 h-screen">
        <div className="p-8 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-violet-600 rounded-xl flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tighter outfit">AXIS</span>
        </div>

        <nav className="flex-grow px-4 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-white/5 rounded-xl text-white font-medium">
            <LayoutDashboard className="w-5 h-5" /> Dashboard
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-white/5 rounded-xl transition-all">
            <TrendingUp className="w-5 h-5" /> Analytics
          </button>
          <button onClick={() => navigate('/pricing')} className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-white/5 rounded-xl transition-all">
            <CreditCard className="w-5 h-5" /> Billing
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-white/5 rounded-xl transition-all">
            <Settings className="w-5 h-5" /> Settings
          </button>
        </nav>

        <div className="p-6 border-t border-white/5">
          <div className="bg-white/5 rounded-2xl p-4 mb-4">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Current Plan</p>
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm">{user?.plan}</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold">Active</span>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-400/10 rounded-xl transition-all font-medium"
          >
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-6 lg:p-12 max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-bold outfit mb-2">Creator Hub</h1>
            <p className="text-slate-400">Welcome back, <span className="text-white font-medium">{user?.name || email}</span></p>
          </div>
          <div className="flex gap-4">
            <div className="px-6 py-3 bg-white/5 rounded-2xl border border-white/10">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Usage</p>
              <p className="text-xl font-bold">{user?.usageCount} <span className="text-xs text-slate-500 font-normal">/ {user?.plan === 'Starter' ? '10' : '∞'}</span></p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Form */}
          <section className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 md:p-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-pink-500/10 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-pink-500" />
              </div>
              <h2 className="text-2xl font-bold outfit">Generate Hook</h2>
            </div>

            <form onSubmit={handleGenerate} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Goal</label>
                  <select 
                    value={formData.goal}
                    onChange={(e) => setFormData({...formData, goal: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-pink-500 outline-none transition-all"
                  >
                    <option value="insta_reel">Instagram Reel</option>
                    <option value="youtube_short">YouTube Short</option>
                    <option value="brand_deal">Brand Deal</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Tone</label>
                  <select 
                    value={formData.tone}
                    onChange={(e) => setFormData({...formData, tone: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-pink-500 outline-none transition-all"
                  >
                    <option value="bold">Bold</option>
                    <option value="friendly">Friendly</option>
                    <option value="professional">Professional</option>
                    <option value="luxury">Luxury</option>
                    <option value="funny">Funny</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Niche</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Minimalist Tech"
                  value={formData.niche}
                  onChange={(e) => setFormData({...formData, niche: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-pink-500 outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Topic / Context</label>
                <textarea 
                  required
                  rows={4}
                  placeholder="What is this content about?"
                  value={formData.topic}
                  onChange={(e) => setFormData({...formData, topic: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-pink-500 outline-none transition-all resize-none"
                />
              </div>

              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl flex items-center gap-3">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error}
                </div>
              )}

              <button 
                type="submit"
                disabled={genLoading}
                className="w-full py-5 bg-gradient-to-r from-pink-500 to-violet-600 rounded-2xl font-bold text-lg shadow-xl shadow-pink-500/20 hover:scale-[1.02] transition-all disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {genLoading ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>Generate Magic <Sparkles className="w-5 h-5" /></>
                )}
              </button>
            </form>
          </section>

          {/* Output */}
          <section className="flex flex-col gap-6">
            <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 md:p-10 flex-grow flex flex-col">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold outfit">Output</h2>
                {genResult && (
                  <button 
                    onClick={copyToClipboard}
                    className="flex items-center gap-2 text-xs font-bold text-pink-500 uppercase tracking-widest hover:text-pink-400 transition-colors"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copied' : 'Copy JSON'}
                  </button>
                )}
              </div>

              <div className="flex-grow bg-black/40 rounded-3xl p-8 font-mono text-sm text-pink-300/80 overflow-auto custom-scrollbar border border-white/5">
                {genResult ? (
                  <pre className="whitespace-pre-wrap leading-relaxed">{JSON.stringify(genResult, null, 2)}</pre>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-600 text-center">
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/5">
                      <Sparkles className="w-8 h-8 opacity-20" />
                    </div>
                    <p className="max-w-[200px]">Your AI-generated content will appear here.</p>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.05); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.1); }
      `}</style>
    </div>
  );
};

export default Dashboard;
