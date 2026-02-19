import express from "express";
import cors from "cors";
import { createServer as createViteServer } from "vite";
import { Resend } from "resend";

const app = express();
const PORT = 3000;

// Initialize Resend lazily
let resend: Resend | null = null;
const getResend = () => {
  if (!resend) {
    const key = process.env.RESEND_API_KEY;
    if (!key) {
      console.warn("RESEND_API_KEY is missing. Email functionality will be disabled.");
      return null;
    }
    resend = new Resend(key);
  }
  return resend;
};

app.use(cors());
app.use(express.json());

// API Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", engine: "AXIS-V7" });
});

// Email Endpoint
app.post("/api/send-welcome", async (req, res) => {
  const { email, name, plan } = req.body;
  const client = getResend();
  
  if (!client) {
    return res.status(500).json({ error: "Email service not configured" });
  }

  try {
    const { data, error } = await client.emails.send({
      from: "AXIS Hub <onboarding@axiscreatorhub.com>",
      to: [email],
      subject: `Welcome to AXIS ${plan} Tier`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h1 style="color: #1a1a1a; text-transform: uppercase; letter-spacing: -1px;">AXIS Creator Hub</h1>
          <p>Hello <strong>${name}</strong>,</p>
          <p>Your manifestation node for the <strong>${plan}</strong> tier is now active.</p>
          <p>You now have full access to the AXIS Engine, including Veo 3.1 cinematic drops and high-fidelity visual assets.</p>
          <div style="margin-top: 30px; padding: 20px; bg-color: #f9f9f9; border-radius: 8px;">
            <p style="font-size: 12px; color: #666;">Node ID: ${Math.random().toString(36).substring(7).toUpperCase()}</p>
          </div>
          <p style="margin-top: 30px;">Stay creative,<br>The AXIS Team</p>
        </div>
      `,
    });

    if (error) {
      return res.status(400).json({ error });
    }

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// Paystack Webhook Placeholder
app.post("/api/webhooks/paystack", (req, res) => {
  // In production, verify the signature: req.headers['x-paystack-signature']
  const event = req.body;
  console.log("Paystack Webhook Received:", event.event);
  
  if (event.event === 'charge.success') {
    // Update user subscription in your database
    console.log("Payment successful for:", event.data.customer.email);
  }
  
  res.sendStatus(200);
});

// Vite middleware for development
if (process.env.NODE_ENV !== "production") {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "spa",
  });
  app.use(vite.middlewares);
} else {
  // In production, serve static files from dist
  app.use(express.static("dist"));
  app.get("*", (req, res) => {
    res.sendFile("dist/index.html", { root: "." });
  });
}

app.listen(PORT, "0.0.0.0", () => {
  console.log(`AXIS Server running on http://0.0.0.0:${PORT}`);
});
