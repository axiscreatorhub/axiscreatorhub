import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getBalance } from "@/lib/credits";

export async function GET() {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return new NextResponse("Unauthorized", { status: 401 });

    const user = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!user) return new NextResponse("User not found", { status: 404 });

    const balance = await getBalance(user.id);

    return NextResponse.json({ balance });
  } catch (error) {
    console.error("[CREDITS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
