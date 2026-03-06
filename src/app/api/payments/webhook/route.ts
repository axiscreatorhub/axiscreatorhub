import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { addCredits } from "@/lib/credits";
import { PACKAGES, PackageId } from "@/lib/packages";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("x-paystack-signature");

  if (!signature) {
    return new NextResponse("No signature", { status: 400 });
  }

  // Verify signature
  const hash = crypto
    .createHmac("sha512", process.env.PAYSTACK_WEBHOOK_SECRET || process.env.PAYSTACK_SECRET_KEY || "")
    .update(body)
    .digest("hex");

  if (hash !== signature) {
    console.error("[WEBHOOK_ERROR] Invalid signature");
    return new NextResponse("Invalid signature", { status: 400 });
  }

  const event = JSON.parse(body);

  if (event.event === "charge.success") {
    const { metadata, reference, status } = event.data;
    
    if (status !== "success") {
      return new NextResponse("Transaction not successful", { status: 200 });
    }

    const clerkId = metadata.userId;
    const packageId = metadata.packageId as PackageId;
    
    // Verify credits against server-side package definition
    const selectedPackage = PACKAGES[packageId];
    if (!selectedPackage) {
      console.error("[WEBHOOK_ERROR] Invalid packageId in metadata");
      return new NextResponse("Invalid package", { status: 400 });
    }

    const credits = selectedPackage.credits;

    if (clerkId && credits) {
      const user = await prisma.user.findUnique({
        where: { clerkId },
      });

      if (user) {
        try {
          await addCredits(user.id, credits, "PURCHASE", reference);
          console.log(`[WEBHOOK_SUCCESS] Added ${credits} credits to user ${clerkId} (Ref: ${reference})`);
        } catch (error: any) {
          if (error.message === "Reference already exists") {
            console.log(`[WEBHOOK_INFO] Duplicate webhook for reference ${reference}, skipping.`);
            return new NextResponse("OK", { status: 200 });
          }
          throw error;
        }
      }
    }
  }

  return new NextResponse("OK", { status: 200 });
}
