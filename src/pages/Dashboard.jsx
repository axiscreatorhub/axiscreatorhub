import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Zap, 
  LogOut, 
  Copy, 
  TrendingUp,
  CreditCard,
  Sparkles,
  MessageSquare,
  Image as ImageIcon,
  Send,
  Plus,
  Instagram,
  Youtube,
  Smartphone
} from 'lucide-react';
import Markdown from 'react-markdown';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('gpt'); // 'gpt', 'apps', 'studio', 'marketplace'
  
  // GPT State
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { role: 'ai', text: "Welcome to AXIS Creator OS. I'm your strategic partner. What are we building today? A viral reel? A brand deal pitch? Or scaling your TikTok presence?" }
  ]);
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Apps State
  const [genLoading, setGenLoading] = useState(false);
  const [genResult, setGenResult] = useState(null);
  const [formData, setFormData] = useState({
    goal: 'insta_reel',
    niche: '',
    topic: '',
    tone: 'bold'
  });

  // Studio State
  const [imgPrompt, setImgPrompt] = useState('');
  const [imgLoading, setImgLoading] = useState(false);
  const [imgResult, setImgResult] = useState(null);
  const [aspectRatio, setAspectRatio] = useState('1:1');

  // Marketplace State
  const [marketplaceItems, setMarketplaceItems] = useState([]);
  const [marketLoading, setMarketLoading] = useState(false);

  const token = localStorage.getItem('axis_token');
  const email = localStorage.getItem('axis_email');
  const apiUrl = import.meta.env.VITE_API_URL || '';

  const handleLogout = useCallback(() => {
    localStorage.removeItem('axis_token');
    localStorage.removeItem('axis_email');
    navigate('/login');
  }, [navigate]);

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
      } catch {
        handleLogout();
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token, email, apiUrl, handleLogout]);

  useEffect(() => {
    if (activeTab === 'marketplace') {
      const fetchMarketplace = async () => {
        setMarketLoading(true);
        try {
          const res = await fetch(`${apiUrl}/api/marketplace/items`);
          const data = await res.json();
          setMarketplaceItems(data);
        } catch (err) {
          console.error(err);
        } finally {
          setMarketLoading(false);
        }
      };
      fetchMarketplace();
    }
  }, [activeTab, apiUrl]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleChat = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;

    const userMsg = { role: 'user', text: chatInput };
    setChatHistory(prev => [...prev, userMsg]);
    setChatInput('');
    setChatLoading(true);

    try {
      const response = await fetch(`${apiUrl}/api/ai/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'x-user-email': email
        },
        body: JSON.stringify({ message: chatInput })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Chat failed');
      
      setChatHistory(prev => [...prev, { role: 'ai', text: data.text }]);
    } catch (err) {
      console.error(err.message);
    } finally {
      setChatLoading(false);
    }
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setGenLoading(true);
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
      console.error(err.message);
    } finally {
      setGenLoading(false);
    }
  };

  const handleGenerateImage = async (e) => {
    e.preventDefault();
    if (!imgPrompt.trim() || imgLoading) return;

    setImgLoading(true);
    setImgResult(null);

    try {
      const response = await fetch(`${apiUrl}/api/ai/generate-image`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'x-user-email': email
        },
        body: JSON.stringify({ prompt: imgPrompt, aspectRatio })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Image generation failed');
      setImgResult(data.imageUrl);
    } catch (err) {
      console.error(err.message);
    } finally {
      setImgLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you absolutely sure? This will permanently delete your account and all generated content. This action cannot be undone.')) return;

    try {
      const response = await fetch(`${apiUrl}/api/me`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-user-email': email
        }
      });

      if (!response.ok) throw new Error('Failed to delete account');
      handleLogout();
    } catch (err) {
      console.error(err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-50 flex flex-col lg:flex-row">
      {/* Sidebar */}
      <aside className="w-full lg:w-20 xl:w-72 border-r border-white/5 bg-[#020617] flex flex-col sticky top-0 h-auto lg:h-screen z-50">
        <div className="p-6 xl:p-8 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-violet-600 rounded-xl flex items-center justify-center shrink-0">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tighter outfit hidden xl:block">AXIS OS</span>
        </div>

        <nav className="flex-grow px-4 space-y-2 py-4">
          <button 
            onClick={() => setActiveTab('gpt')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'gpt' ? 'bg-white/10 text-white' : 'text-slate-400 hover:bg-white/5'}`}
          >
            <MessageSquare className="w-5 h-5" /> <span className="hidden xl:block font-medium">Creator GPT</span>
          </button>
          <button 
            onClick={() => setActiveTab('apps')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'apps' ? 'bg-white/10 text-white' : 'text-slate-400 hover:bg-white/5'}`}
          >
            <Zap className="w-5 h-5" /> <span className="hidden xl:block font-medium">Toolbox</span>
          </button>
          <button 
            onClick={() => setActiveTab('studio')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'studio' ? 'bg-white/10 text-white' : 'text-slate-400 hover:bg-white/5'}`}
          >
            <ImageIcon className="w-5 h-5" /> <span className="hidden xl:block font-medium">Media Studio</span>
          </button>
          <button 
            onClick={() => setActiveTab('marketplace')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'marketplace' ? 'bg-white/10 text-white' : 'text-slate-400 hover:bg-white/5'}`}
          >
            <Plus className="w-5 h-5" /> <span className="hidden xl:block font-medium">Marketplace</span>
          </button>
          <div className="pt-4 border-t border-white/5 mt-4">
            <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-white/5 rounded-xl transition-all">
              <TrendingUp className="w-5 h-5" /> <span className="hidden xl:block">Analytics</span>
            </button>
            <button onClick={() => navigate('/pricing')} className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-white/5 rounded-xl transition-all">
              <CreditCard className="w-5 h-5" /> <span className="hidden xl:block">Billing</span>
            </button>
          </div>
        </nav>

        <div className="p-6 border-t border-white/5">
          <div className="hidden xl:block bg-white/5 rounded-2xl p-4 mb-4">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Creator Status</p>
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm">{user?.plan}</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold">Scaling</span>
            </div>
          </div>
          <button 
            onClick={handleDeleteAccount}
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all font-medium mt-2"
          >
            <LogOut className="w-5 h-5 rotate-180" /> <span className="hidden xl:block">Delete Account</span>
          </button>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-400/10 rounded-xl transition-all font-medium"
          >
            <LogOut className="w-5 h-5" /> <span className="hidden xl:block">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Workspace */}
      <main className="flex-grow flex flex-col h-screen overflow-hidden relative">
        {/* Header */}
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 shrink-0 bg-[#020617]/80 backdrop-blur-md z-10">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold outfit uppercase tracking-widest">
              {activeTab === 'gpt' && 'Creator GPT'}
              {activeTab === 'apps' && 'Toolbox'}
              {activeTab === 'studio' && 'Media Studio'}
            </h2>
            <div className="h-4 w-px bg-white/10"></div>
            <div className="flex items-center gap-2 text-xs text-slate-500 font-bold uppercase tracking-tighter">
              <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
              System Online
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
              <span className="text-[10px] font-bold text-slate-500">CREDITS</span>
              <span className="text-xs font-bold">{100 - (user?.usageCount || 0) * 2}</span>
            </div>
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
              <span className="text-[10px] font-bold text-slate-500">USAGE</span>
              <span className="text-xs font-bold">{user?.usageCount} / {user?.plan === 'Starter' ? '10' : '∞'}</span>
            </div>
            <button className="p-2 bg-pink-500 rounded-lg hover:bg-pink-600 transition-all">
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-grow overflow-auto relative custom-scrollbar">
          {activeTab === 'gpt' && (
            <div className="h-full flex flex-col">
              <div className="flex-grow p-8 space-y-8 max-w-4xl mx-auto w-full">
                {chatHistory.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-6 rounded-3xl ${msg.role === 'user' ? 'bg-pink-500 text-white' : 'bg-white/5 border border-white/10 text-slate-200'}`}>
                      <div className="markdown-body text-sm leading-relaxed">
                        <Markdown>{msg.text}</Markdown>
                      </div>
                    </div>
                  </div>
                ))}
                {chatLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white/5 border border-white/10 p-6 rounded-3xl flex items-center gap-3">
                      <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-1.5 h-1.5 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-1.5 h-1.5 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Thinking...</span>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Chat Input */}
              <div className="p-8 shrink-0 bg-gradient-to-t from-[#020617] via-[#020617] to-transparent">
                <form onSubmit={handleChat} className="max-w-4xl mx-auto relative">
                  <input 
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask AXIS anything... 'Write a TikTok script for a tech unboxing'"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 pr-16 focus:border-pink-500 outline-none transition-all placeholder:text-slate-600"
                  />
                  <button 
                    type="submit"
                    disabled={!chatInput.trim() || chatLoading}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-pink-500 rounded-xl hover:bg-pink-600 transition-all disabled:opacity-50"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </form>
              </div>
            </div>
          )}

          {activeTab === 'apps' && (
            <div className="p-8 lg:p-12 max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-2 gap-12">
              {/* Tool Form */}
              <div className="space-y-8">
                <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-10">
                  <h3 className="text-2xl font-bold outfit mb-8 flex items-center gap-3">
                    <Zap className="w-6 h-6 text-pink-500" /> Content Generator
                  </h3>
                  <form onSubmit={handleGenerate} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Platform</label>
                        <select 
                          value={formData.goal}
                          onChange={(e) => setFormData({...formData, goal: e.target.value})}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-pink-500 outline-none"
                        >
                          <option value="insta_reel">Instagram Reel</option>
                          <option value="youtube_short">YouTube Short</option>
                          <option value="brand_deal">Brand Deal Pitch</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Vibe</label>
                        <select 
                          value={formData.tone}
                          onChange={(e) => setFormData({...formData, tone: e.target.value})}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-pink-500 outline-none"
                        >
                          <option value="bold">Bold & Viral</option>
                          <option value="friendly">Relatable</option>
                          <option value="professional">Expert</option>
                          <option value="luxury">High-End</option>
                          <option value="funny">Entertaining</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Niche</label>
                      <input 
                        type="text"
                        placeholder="e.g. Minimalist Productivity"
                        value={formData.niche}
                        onChange={(e) => setFormData({...formData, niche: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-pink-500 outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Topic</label>
                      <textarea 
                        rows={4}
                        placeholder="What's the core message?"
                        value={formData.topic}
                        onChange={(e) => setFormData({...formData, topic: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-pink-500 outline-none resize-none"
                      />
                    </div>
                    <button 
                      type="submit"
                      disabled={genLoading}
                      className="w-full py-5 bg-gradient-to-r from-pink-500 to-violet-600 rounded-2xl font-bold text-lg shadow-xl shadow-pink-500/20 hover:scale-[1.02] transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                    >
                      {genLoading ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Generate Script'}
                    </button>
                  </form>
                </div>
              </div>

              {/* Output */}
              <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-10 flex flex-col">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-2xl font-bold outfit">Output</h3>
                  {genResult && (
                    <button className="text-xs font-bold text-pink-500 uppercase tracking-widest flex items-center gap-2">
                      <Copy className="w-4 h-4" /> Copy
                    </button>
                  )}
                </div>
                <div className="flex-grow bg-black/40 rounded-3xl p-8 border border-white/5 overflow-auto">
                  {genResult ? (
                    <div className="space-y-6">
                      <div>
                        <p className="text-[10px] font-black text-pink-500 uppercase tracking-widest mb-2">The Hook</p>
                        <p className="text-lg font-bold leading-tight">{genResult.hook}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-pink-500 uppercase tracking-widest mb-2">Body Points</p>
                        <ul className="space-y-2">
                          {genResult.body_points?.map((p, i) => (
                            <li key={i} className="text-sm text-slate-300 flex gap-3">
                              <span className="text-pink-500 font-bold">{i+1}.</span> {p}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-pink-500 uppercase tracking-widest mb-2">Call to Action</p>
                        <p className="text-sm font-medium">{genResult.call_to_action}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-600 text-center opacity-40">
                      <Sparkles className="w-12 h-12 mb-4" />
                      <p className="text-sm max-w-[200px]">Select a tool and generate content to see results.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'marketplace' && (
            <div className="p-8 lg:p-12 max-w-7xl mx-auto">
              <div className="flex justify-between items-end mb-12">
                <div>
                  <h2 className="text-4xl font-bold outfit mb-2">AXIS Marketplace</h2>
                  <p className="text-slate-400">Buy and sell viral content recipes. Earn royalties as others scale.</p>
                </div>
                <button className="px-6 py-3 bg-white text-black rounded-xl font-bold hover:bg-slate-200 transition-all flex items-center gap-2">
                  <Plus className="w-4 h-4" /> List Your Recipe
                </button>
              </div>

              {marketLoading ? (
                <div className="flex justify-center py-20">
                  <div className="w-10 h-10 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {marketplaceItems.map(item => (
                    <div key={item.id} className="bg-white/5 border border-white/10 rounded-3xl p-6 hover:border-pink-500/50 transition-all group">
                      <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 bg-pink-500/10 rounded-xl flex items-center justify-center">
                          <Sparkles className="w-6 h-6 text-pink-500" />
                        </div>
                        <span className="text-lg font-bold text-white">{item.price} Credits</span>
                      </div>
                      <h4 className="text-xl font-bold mb-2 group-hover:text-pink-500 transition-colors">{item.title}</h4>
                      <p className="text-sm text-slate-400 mb-6 line-clamp-2">{item.description}</p>
                      <div className="flex items-center justify-between pt-6 border-t border-white/5">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">By {item.author}</span>
                        <button className="px-4 py-2 bg-white/10 hover:bg-pink-500 hover:text-white rounded-lg text-xs font-bold transition-all">
                          Buy Recipe
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'studio' && (
            <div className="p-8 lg:p-12 max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-2 gap-12 h-full">
              <div className="space-y-8">
                <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-10">
                  <h3 className="text-2xl font-bold outfit mb-8 flex items-center gap-3">
                    <ImageIcon className="w-6 h-6 text-pink-500" /> Image Engine
                  </h3>
                  <form onSubmit={handleGenerateImage} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Aspect Ratio</label>
                      <div className="grid grid-cols-5 gap-2">
                        {['1:1', '16:9', '9:16', '4:3', '3:4'].map(ratio => (
                          <button
                            key={ratio}
                            type="button"
                            onClick={() => setAspectRatio(ratio)}
                            className={`py-2 text-[10px] font-bold rounded-lg border transition-all ${aspectRatio === ratio ? 'bg-pink-500 border-pink-500 text-white' : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'}`}
                          >
                            {ratio}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Prompt</label>
                      <textarea 
                        rows={4}
                        placeholder="Describe your aesthetic asset... 'Cyberpunk city background for a tech reel'"
                        value={imgPrompt}
                        onChange={(e) => setImgPrompt(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-pink-500 outline-none resize-none"
                      />
                    </div>
                    <button 
                      type="submit"
                      disabled={imgLoading || !imgPrompt.trim()}
                      className="w-full py-5 bg-gradient-to-r from-pink-500 to-violet-600 rounded-2xl font-bold text-lg shadow-xl shadow-pink-500/20 hover:scale-[1.02] transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                    >
                      {imgLoading ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Generate Asset'}
                    </button>
                  </form>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-10 flex flex-col items-center justify-center overflow-hidden">
                {imgResult ? (
                  <div className="w-full h-full flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-bold outfit">Result</h3>
                      <a href={imgResult} download="axis-asset.png" className="text-xs font-bold text-pink-500 uppercase tracking-widest flex items-center gap-2">
                        <Plus className="w-4 h-4" /> Download
                      </a>
                    </div>
                    <div className="flex-grow flex items-center justify-center bg-black/40 rounded-3xl border border-white/5 overflow-hidden p-4">
                      <img src={imgResult} alt="Generated Asset" className="max-w-full max-h-full object-contain rounded-xl shadow-2xl" />
                    </div>
                  </div>
                ) : (
                  <div className="text-center opacity-40">
                    <ImageIcon className="w-16 h-16 mb-6 mx-auto" />
                    <p className="text-sm max-w-[200px] mx-auto">Describe your asset and hit generate to see the magic.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions Rail */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-4">
          <div className="p-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xl group hover:border-pink-500 transition-all cursor-pointer">
            <Instagram className="w-5 h-5 text-slate-400 group-hover:text-pink-500" />
          </div>
          <div className="p-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xl group hover:border-violet-500 transition-all cursor-pointer">
            <Youtube className="w-5 h-5 text-slate-400 group-hover:text-violet-500" />
          </div>
          <div className="p-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xl group hover:border-emerald-500 transition-all cursor-pointer">
            <Smartphone className="w-5 h-5 text-slate-400 group-hover:text-emerald-500" />
          </div>
        </div>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.05); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.1); }
        
        .markdown-body p { margin-bottom: 1rem; }
        .markdown-body ul { list-style: disc; padding-left: 1.5rem; margin-bottom: 1rem; }
        .markdown-body strong { color: #ec4899; font-weight: 700; }
      `}</style>
    </div>
  );
};

export default Dashboard;
