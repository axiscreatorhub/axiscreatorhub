import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("x-paystack-signature");

  if (!signature) {
    return new NextResponse("No signature", { status: 400 });
  }

  // Verify signature
  const hash = crypto
    .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY || "")
    .update(body)
    .digest("hex");

  if (hash !== signature) {
    return new NextResponse("Invalid signature", { status: 400 });
  }

  const event = JSON.parse(body);

  if (event.event === "charge.success") {
    const { metadata } = event.data;
    const userId = metadata.userId;
    const credits = metadata.credits;

    if (userId && credits) {
      // Find the user first to get their internal ID if metadata.userId is clerkId
      const user = await prisma.user.findUnique({
        where: { clerkId: userId },
      });

      if (user) {
        // Update or create credit wallet
        await prisma.creditWallet.upsert({
          where: { userId: user.id },
          update: {
            balance: {
              increment: Number(credits),
            },
          },
          create: {
            userId: user.id,
            balance: Number(credits),
          },
        });

        // Log transaction
        await prisma.creditTransaction.create({
          data: {
            walletId: (await prisma.creditWallet.findUnique({ where: { userId: user.id } }))!.id,
            amount: Number(credits),
            type: "PURCHASE",
          },
        });

        console.log(`Successfully added ${credits} credits to user ${userId}`);
      }
    }
  }

  return new NextResponse("OK", { status: 200 });
}
