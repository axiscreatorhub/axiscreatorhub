'use client';

import { useState, useEffect } from 'react';
import { Upload, Palette, Type, Save, Trash2, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface BrandKitData {
  logo: string | null;
  colors: string[];
  typography: {
    heading: string;
    body: string;
  };
}

const DEFAULT_BRAND_KIT: BrandKitData = {
  logo: null,
  colors: ['#833ab4', '#fd1d1d', '#fcb045', '#405de6', '#1a1a2e'],
  typography: {
    heading: 'Outfit',
    body: 'Inter',
  },
};

const FONTS = [
  'Inter',
  'Outfit',
  'JetBrains Mono',
  'Playfair Display',
  'Space Grotesk',
  'Montserrat',
];

export default function BrandKit() {
  const [brandKit, setBrandKit] = useState<BrandKitData>(DEFAULT_BRAND_KIT);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('axis_brand_kit');
    if (saved) {
      try {
        setBrandKit(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse brand kit', e);
      }
    }
  }, []);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBrandKit((prev) => ({ ...prev, logo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleColorChange = (index: number, color: string) => {
    const newColors = [...brandKit.colors];
    newColors[index] = color;
    setBrandKit((prev) => ({ ...prev, colors: newColors }));
  };

  const addColor = () => {
    if (brandKit.colors.length < 8) {
      setBrandKit((prev) => ({ ...prev, colors: [...prev.colors, '#000000'] }));
    }
  };

  const removeColor = (index: number) => {
    setBrandKit((prev) => ({
      ...prev,
      colors: prev.colors.filter((_, i) => i !== index),
    }));
  };

  const saveBrandKit = () => {
    setIsSaving(true);
    localStorage.setItem('axis_brand_kit', JSON.stringify(brandKit));
    setTimeout(() => {
      setIsSaving(false);
      setMessage({ type: 'success', text: 'Brand Kit saved successfully!' });
      setTimeout(() => setMessage(null), 3000);
    }, 800);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-gradient">Brand Kit</h1>
          <p className="text-zinc-500 dark:text-zinc-400">Define your visual identity for AI-generated content.</p>
        </div>
        <button
          onClick={saveBrandKit}
          disabled={isSaving}
          className="btn-primary !px-6 !py-3 flex items-center gap-2"
        >
          {isSaving ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            <Save size={18} />
          )}
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`p-4 rounded-xl text-sm font-medium ${
              message.type === 'success' 
                ? 'bg-brand-purple/10 text-brand-purple border border-brand-purple/20' 
                : 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20'
            }`}
          >
            {message.text}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Logo Section */}
        <section className="glass rounded-3xl p-8 space-y-6">
          <div className="flex items-center gap-3 text-brand-blue">
            <Upload size={20} />
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Brand Logo</h2>
          </div>
          
          <div className="relative group aspect-video rounded-2xl border-2 border-dashed border-zinc-200 dark:border-white/10 flex flex-col items-center justify-center overflow-hidden bg-zinc-50 dark:bg-white/5 transition-colors hover:bg-zinc-100 dark:hover:bg-white/10">
            {brandKit.logo ? (
              <>
                <img src={brandKit.logo} alt="Brand Logo" className="max-h-full max-w-full object-contain p-4" />
                <button
                  onClick={() => setBrandKit(prev => ({ ...prev, logo: null }))}
                  className="absolute top-4 right-4 p-2 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={16} />
                </button>
              </>
            ) : (
              <label className="cursor-pointer flex flex-col items-center gap-2">
                <Upload className="text-zinc-400" />
                <span className="text-sm text-zinc-500">Upload PNG or SVG</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
              </label>
            )}
          </div>
        </section>

        {/* Typography Section */}
        <section className="glass rounded-3xl p-8 space-y-6">
          <div className="flex items-center gap-3 text-brand-purple">
            <Type size={20} />
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Typography</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2 block">Heading Font</label>
              <select
                value={brandKit.typography.heading}
                onChange={(e) => setBrandKit(prev => ({ ...prev, typography: { ...prev.typography, heading: e.target.value } }))}
                className="w-full bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-xl px-4 py-3 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                {FONTS.map(font => <option key={font} value={font}>{font}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2 block">Body Font</label>
              <select
                value={brandKit.typography.body}
                onChange={(e) => setBrandKit(prev => ({ ...prev, typography: { ...prev.typography, body: e.target.value } }))}
                className="w-full bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-xl px-4 py-3 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                {FONTS.map(font => <option key={font} value={font}>{font}</option>)}
              </select>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10">
            <h3 style={{ fontFamily: brandKit.typography.heading }} className="text-lg font-bold text-zinc-900 dark:text-white">Preview Heading</h3>
            <p style={{ fontFamily: brandKit.typography.body }} className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
              The quick brown fox jumps over the lazy dog.
            </p>
          </div>
        </section>

        {/* Colors Section */}
        <section className="glass rounded-3xl p-8 space-y-6 md:col-span-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-brand-orange">
              <Palette size={20} />
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Brand Colors</h2>
            </div>
            <button
              onClick={addColor}
              disabled={brandKit.colors.length >= 8}
              className="p-2 rounded-xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-white/60 hover:text-zinc-900 dark:hover:text-white transition-all disabled:opacity-50"
            >
              <Plus size={18} />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
            {brandKit.colors.map((color, index) => (
              <div key={index} className="space-y-2 group relative">
                <div 
                  className="aspect-square rounded-2xl border border-zinc-200 dark:border-white/10 shadow-inner overflow-hidden relative"
                  style={{ backgroundColor: color }}
                >
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => handleColorChange(index, e.target.value)}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                </div>
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase">{color}</span>
                  {brandKit.colors.length > 1 && (
                    <button
                      onClick={() => removeColor(index)}
                      className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
