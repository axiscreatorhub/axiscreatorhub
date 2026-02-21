import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { z } from 'zod';
import rateLimit from 'express-rate-limit';
import { Resend } from 'resend';
import Paystack from 'paystack-node';
import { GoogleGenAI } from '@google/genai';
import crypto from 'crypto';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const prisma = new PrismaClient();
  const resend = new Resend(process.env.RESEND_API_KEY);
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
  const paystack = new Paystack(process.env.PAYSTACK_SECRET || '', 'production');

  const app = express();
  const PORT = Number(process.env.PORT || 8080);

  // --- Middleware ---
  app.use(helmet({
    contentSecurityPolicy: false, // Disable for dev/vite
  }));
  app.use(cors({
    origin: process.env.VITE_API_URL ? process.env.VITE_API_URL.split(',') : '*',
    credentials: true,
  }));
  app.use(morgan('dev'));
  
  // Capture raw body for Paystack webhook verification
  app.use(express.json({
    verify: (req: any, res, buf) => {
      req.rawBody = buf;
    }
  }));

  // --- Schemas ---
  const requestOtpSchema = z.object({
    email: z.string().email(),
    name: z.string().optional()
  });

  const verifyOtpSchema = z.object({
    email: z.string().email(),
    otp: z.string().length(6)
  });

  const generateSchema = z.object({
    goal: z.enum(['insta_reel', 'youtube_short', 'brand_deal']),
    niche: z.string().min(2),
    topic: z.string().min(5),
    tone: z.enum(['bold', 'friendly', 'professional', 'luxury', 'funny'])
  });

  const chatSchema = z.object({
    message: z.string().min(1),
    context: z.record(z.any()).optional()
  });

  const imageGenSchema = z.object({
    prompt: z.string().min(5),
    aspectRatio: z.enum(['1:1', '16:9', '9:16', '4:3', '3:4']).default('1:1')
  });

  const marketplaceSchema = z.object({
    title: z.string().min(5),
    description: z.string().min(10),
    price: z.number().min(1),
    contentId: z.string()
  });

  // --- Auth Middleware ---
  const authenticate = async (req: any, res: any, next: any) => {
    const authHeader = req.headers.authorization;
    const emailHeader = req.headers['x-user-email'];

    if (!authHeader || !authHeader.startsWith('Bearer ') || !emailHeader) {
      return res.status(401).json({ message: 'Missing authentication headers' });
    }

    const token = authHeader.split(' ')[1];
    
    const session = await prisma.session.findUnique({
      where: { token },
      include: { user: true }
    });

    if (!session || session.user.email !== emailHeader || session.expiresAt < new Date()) {
      return res.status(401).json({ message: 'Invalid or expired session' });
    }

    req.user = session.user;
    next();
  };

  // --- Rate Limiter ---
  const genLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: { message: 'Too many generation requests, please try again later.' }
  });

  // --- API Routes ---

  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  app.post('/api/auth/request-otp', async (req, res) => {
    try {
      const { email, name } = requestOtpSchema.parse(req.body);
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

      await prisma.otp.create({
        data: { email, code: otpCode, expiresAt }
      });

      // Ensure user exists
      await prisma.user.upsert({
        where: { email },
        update: { name: name || undefined },
        create: { email, name }
      });

      await resend.emails.send({
        from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
        to: email,
        subject: 'Your AXIS Verification Code',
        html: `<p>Your verification code is <strong>${otpCode}</strong>. It expires in 10 minutes.</p>`
      });

      res.json({ message: 'OTP sent successfully' });
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  });

  app.post('/api/auth/verify-otp', async (req, res) => {
    try {
      const { email, otp } = verifyOtpSchema.parse(req.body);
      
      const storedOtp = await prisma.otp.findFirst({
        where: { email, code: otp, expiresAt: { gt: new Date() } },
        orderBy: { createdAt: 'desc' }
      });

      if (!storedOtp) {
        return res.status(400).json({ message: 'Invalid or expired OTP' });
      }

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) throw new Error('User not found');

      const token = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

      await prisma.session.create({
        data: { token, userId: user.id, expiresAt }
      });

      // Cleanup OTPs
      await prisma.otp.deleteMany({ where: { email } });

      res.json({ token });
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  });

  app.get('/api/me', authenticate, (req: any, res) => {
    res.json(req.user);
  });

  app.post('/api/ai/chat', authenticate, genLimiter, async (req: any, res) => {
    try {
      const { message, context } = chatSchema.parse(req.body);
      const user = req.user;

      const systemInstruction = `
        You are the AXIS Creator OS AI, the ultimate assistant for social media influencers and creators.
        Your goal is to help users scale their brand on Instagram, TikTok, Facebook, and YouTube.
        Focus on:
        - Viral hooks and scroll-stopping scripts.
        - Strategic content planning.
        - Monetization strategies (side hustle to full-time).
        - Creative excellence and ease of production.
        
        User Context: ${JSON.stringify(context || {})}
        User Plan: ${user.plan}
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `${systemInstruction}\n\nUser: ${message}`,
      });

      res.json({ text: response.text });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.post('/api/ai/generate-image', authenticate, genLimiter, async (req: any, res) => {
    try {
      const user = req.user;

      // Check credits (Assuming credits field exists or using usageCount as proxy for now)
      // In a real app, we'd check user.credits
      if (user.plan === 'Starter' && user.usageCount >= 10) {
        return res.status(403).json({ message: 'Insufficient credits. Please upgrade or buy more.' });
      }

      const { prompt, aspectRatio } = imageGenSchema.parse(req.body);
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: [{ text: `A high-end, aesthetic creator asset for social media: ${prompt}` }],
        config: {
          imageConfig: {
            aspectRatio: aspectRatio as any
          }
        }
      });

      let imageUrl = '';
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          imageUrl = `data:image/png;base64,${part.inlineData.data}`;
          break;
        }
      }

      if (!imageUrl) throw new Error('No image generated');

      res.json({ imageUrl });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.post('/api/ai/generate', authenticate, genLimiter, async (req: any, res) => {
    try {
      const { goal, niche, topic, tone } = generateSchema.parse(req.body);
      const user = req.user;

      if (user.usageCount >= 10 && user.plan === 'Starter') {
        return res.status(403).json({ message: 'Usage limit reached for Starter plan. Please upgrade to Pro.' });
      }

      const prompt = `
        You are an expert content creator assistant for AXIS Creator Hub.
        Generate a high-converting ${goal} for the ${niche} niche.
        Topic: ${topic}
        Tone: ${tone}
        
        Requirements:
        - Return ONLY a valid JSON object.
        - Include "hook" (string), "body_points" (array of strings), and "call_to_action" (string).
        - Ensure the content is engaging, viral-ready, and fits the specified tone.
        - Do not include any markdown formatting or extra text.
        - Do not include any backticks or "json" prefix.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });

      const content = JSON.parse(response.text || '{}');

      // Store content and increment usage
      await prisma.$transaction([
        prisma.content.create({
          data: {
            userId: user.id,
            goal,
            niche,
            topic,
            tone,
            output: content
          }
        }),
        prisma.user.update({
          where: { id: user.id },
          data: { usageCount: { increment: 1 } }
        })
      ]);

      res.json(content);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.post('/api/billing/paystack/init', authenticate, async (req: any, res) => {
    try {
      const { amount, planName } = req.body;
      
      const response = await paystack.transaction.initialize({
        email: req.user.email,
        amount: amount, // in kobo
        callback_url: process.env.PAYSTACK_CALLBACK_URL,
        metadata: { planName, userId: req.user.id }
      });

      res.json(response.data);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.post('/api/webhooks/paystack', async (req: any, res) => {
    const signature = req.headers['x-paystack-signature'];
    const secret = process.env.PAYSTACK_SECRET || '';

    const hash = crypto
      .createHmac('sha512', secret)
      .update(req.rawBody)
      .digest('hex');

    if (hash === signature) {
      const event = req.body;
      
      if (event.event === 'charge.success') {
        const { email } = event.data.customer;
        const { planName, userId } = event.data.metadata;
        
        await prisma.user.update({
          where: { id: userId || undefined, email },
          data: { 
            plan: planName || 'Pro', 
            planActive: true,
            paystackId: event.data.customer.customer_code
          }
        });
        
        console.log(`[PAYSTACK] Payment success for ${email}: ${planName}`);
      }
      
      return res.sendStatus(200);
    }

    res.sendStatus(400);
  });

  app.get('/api/billing/paystack/callback', async (req, res) => {
    // Paystack redirects here after payment. 
    // The webhook handles the actual database update.
    res.redirect('/dashboard');
  });

  app.post('/api/marketplace/list', authenticate, async (req: any, res) => {
    try {
      marketplaceSchema.parse(req.body);

      // In a real app, we'd create a MarketplaceItem record
      // For now, we'll simulate the success
      res.json({ message: 'Item listed successfully in the AXIS Marketplace' });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.get('/api/marketplace/items', async (req, res) => {
    // Mocking marketplace items for the demo
    const items = [
      { id: '1', title: 'Viral Tech Unboxing Script', description: 'Used for a video with 1.2M views. High retention.', price: 5, author: 'TechGuru' },
      { id: '2', title: 'Luxury Lifestyle Reel Hook', description: 'Perfect for travel and high-end niches.', price: 3, author: 'JetSetter' },
      { id: '3', title: 'Productivity Hack Template', description: 'Minimalist aesthetic, proven engagement.', price: 4, author: 'FocusFlow' }
    ];
    res.json(items);
  });

  app.post('/api/billing/credits/buy', authenticate, async (req: any, res) => {
    try {
      const { amount } = req.body; // e.g., 100 credits
      // Initialize Paystack transaction for credits
      const response = await paystack.transaction.initialize({
        email: req.user.email,
        amount: amount * 100, // $1 per credit for example
        callback_url: process.env.PAYSTACK_CALLBACK_URL,
        metadata: { type: 'credits', amount, userId: req.user.id }
      });
      res.json(response.data);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.delete('/api/me', authenticate, async (req: any, res) => {
    try {
      const userId = req.user.id;
      
      // Delete all user data
      await prisma.$transaction([
        prisma.session.deleteMany({ where: { userId } }),
        prisma.content.deleteMany({ where: { userId } }),
        prisma.user.delete({ where: { id: userId } })
      ]);

      res.json({ message: 'Account deleted successfully' });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  // --- Vite Middleware for Dev ---
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('/*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
