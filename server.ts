import express from 'express';
import { createServer as createViteServer } from 'vite';
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
import { GoogleGenerativeAI } from '@google/generative-ai';
import crypto from 'crypto';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const paystack = new Paystack(process.env.PAYSTACK_SECRET || '', 'production');

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  // --- Middleware ---
  app.use(helmet({
    contentSecurityPolicy: false, // Disable for dev/vite
  }));
  app.use(cors());
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
    message: { message: 'Too many generation requests, please try again later.' },
    keyGenerator: (req: any) => req.user?.email || req.ip
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

  app.post('/api/ai/generate', authenticate, genLimiter, async (req: any, res) => {
    try {
      const { goal, niche, topic, tone } = generateSchema.parse(req.body);
      const user = req.user;

      if (user.usageCount >= 10 && user.plan === 'Starter') {
        return res.status(403).json({ message: 'Usage limit reached for Starter plan. Please upgrade to Pro.' });
      }

      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      
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
      `;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('Failed to generate valid content structure');
      
      const content = JSON.parse(jsonMatch[0]);

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

  // --- Vite Middleware for Dev ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
