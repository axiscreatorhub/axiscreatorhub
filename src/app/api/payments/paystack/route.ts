import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import axios from "axios";

const PACKAGES = {
  starter: { amount: 9900, credits: 100 },
  pro: { amount: 19900, credits: 250 },
  studio: { amount: 49900, credits: 700 },
};

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const email = user.emailAddresses[0]?.emailAddress;

  if (!email) {
    return NextResponse.json({ error: "User email not found" }, { status: 400 });
  }

  try {
    const body = await req.json();
    const { packageId } = body;

    const selectedPackage = PACKAGES[packageId as keyof typeof PACKAGES];

    if (!selectedPackage) {
      return NextResponse.json({ error: "Invalid package selected" }, { status: 400 });
    }

    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email,
        amount: selectedPackage.amount, // Amount is already in kobo (e.g. 9900 = NGN 99.00)
        callback_url: `${process.env.APP_URL}/dashboard/settings?payment=success`,
        metadata: {
          userId,
          credits: selectedPackage.credits,
          packageId,
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
