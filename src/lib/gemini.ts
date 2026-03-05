import { GoogleGenAI } from '@google/genai';

export const getGeminiModel = () => {
  const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY or NEXT_PUBLIC_GEMINI_API_KEY is not defined');
  }
  return new GoogleGenAI({ apiKey });
};

export const getBrandKitContext = () => {
  if (typeof window === 'undefined') return '';
  const saved = localStorage.getItem('axis_brand_kit');
  if (!saved) return '';
  try {
    const brandKit = JSON.parse(saved);
    return `
Brand Identity Context:
- Colors: ${brandKit.colors.join(', ')}
- Typography: Heading: ${brandKit.typography.heading}, Body: ${brandKit.typography.body}
- Brand Tone: Professional, Modern, Creator-focused
`;
  } catch (e) {
    return '';
  }
};
