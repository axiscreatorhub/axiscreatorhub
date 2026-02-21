import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import { z } from 'zod';
import rateLimit from 'express-rate-limit';
import { Resend } from 'resend';
import Paystack from 'paystack-node';
import { GoogleGenerativeAI } from '@google/generative-ai';
import crypto from 'crypto';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// --- Clients ---
const resend = new Resend(process.env.RESEND_API_KEY);
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const paystack = new Paystack(process.env.PAYSTACK_SECRET, 'production');

// --- In-Memory Storage ---
const otps = new Map(); // email -> { otp, expires }
const sessions = new Map(); // token -> email
const users = new Map(); // email -> { plan, usage }

// --- Middleware ---
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));

// Capture raw body for Paystack webhook verification
app.use(express.json({
  verify: (req, res, buf) => {
    req.rawBody = buf;
  }
}));

// --- Validation Schemas ---
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

// --- Auth Helper ---
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const emailHeader = req.headers['x-user-email'];

  if (!authHeader || !authHeader.startsWith('Bearer ') || !emailHeader) {
    return res.status(401).json({ message: 'Missing authentication headers' });
  }

  const token = authHeader.split(' ')[1];
  const sessionEmail = sessions.get(token);

  if (!sessionEmail || sessionEmail !== emailHeader) {
    return res.status(401).json({ message: 'Invalid or expired session' });
  }

  req.userEmail = sessionEmail;
  next();
};

// --- Rate Limiting ---
const genLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: 'Too many requests, please try again later.' },
  keyGenerator: (req) => req.userEmail || req.ip
});

// --- Routes ---

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/auth/request-otp', async (req, res) => {
  try {
    const { email } = requestOtpSchema.parse(req.body);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = Date.now() + 10 * 60 * 1000; // 10 mins

    otps.set(email, { otp, expires });

    // Initialize user if new
    if (!users.has(email)) {
      users.set(email, { plan: 'Starter', usage: 0 });
    }

    await resend.emails.send({
      from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
      to: email,
      subject: 'Your AXIS OTP',
      html: `<p>Your code is <strong>${otp}</strong>. Valid for 10 minutes.</p>`
    });

    res.json({ message: 'OTP sent' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.post('/auth/verify-otp', (req, res) => {
  try {
    const { email, otp } = verifyOtpSchema.parse(req.body);
    const stored = otps.get(email);

    if (!stored || stored.otp !== otp || Date.now() > stored.expires) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    sessions.set(token, email);
    otps.delete(email);

    res.json({ token });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.get('/me', authenticate, (req, res) => {
  const user = users.get(req.userEmail) || { plan: 'Starter', usage: 0 };
  res.json({ email: req.userEmail, ...user });
});

app.post('/ai/generate', authenticate, genLimiter, async (req, res) => {
  try {
    const { goal, niche, topic, tone } = generateSchema.parse(req.body);
    const user = users.get(req.userEmail);

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const prompt = `
      Generate a ${goal} for the ${niche} niche.
      Topic: ${topic}
      Tone: ${tone}
      
      Return ONLY a valid JSON object with "hook", "body_points" (array), and "cta".
      No markdown, no extra text.
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Strict JSON extraction
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('AI failed to return valid JSON');
    
    const content = JSON.parse(jsonMatch[0]);

    // Track usage
    user.usage += 1;
    users.set(req.userEmail, user);

    res.json(content);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/billing/paystack/init', authenticate, async (req, res) => {
  try {
    const { amount } = req.body; // in kobo
    const response = await paystack.transaction.initialize({
      email: req.userEmail,
      amount,
      callback_url: process.env.PAYSTACK_CALLBACK_URL
    });
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/webhooks/paystack', (req, res) => {
  const signature = req.headers['x-paystack-signature'];
  const secret = process.env.PAYSTACK_SECRET;

  const hash = crypto
    .createHmac('sha512', secret)
    .update(req.rawBody)
    .digest('hex');

  if (hash === signature) {
    const event = req.body;
    if (event.event === 'charge.success') {
      const email = event.data.customer.email;
      const user = users.get(email) || { usage: 0 };
      users.set(email, { ...user, plan: 'Pro' });
    }
    return res.sendStatus(200);
  }

  res.sendStatus(400);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
