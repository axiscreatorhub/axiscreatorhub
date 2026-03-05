import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import axios from "axios";

export async function POST(req: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { amount, email } = await req.json();

    if (!amount || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email,
        amount: amount * 100, // Paystack expects amount in kobo
        callback_url: `${process.env.APP_URL}/dashboard/settings?payment=success`,
        metadata: {
          userId,
          credits: amount / 10, // Example: 100 NGN = 10 credits
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (err: any) {
    console.error("[PAYSTACK_ERROR]", err.response?.data || err.message);
    return NextResponse.json({ error: "Failed to initialize payment" }, { status: 500 });
  }
}
