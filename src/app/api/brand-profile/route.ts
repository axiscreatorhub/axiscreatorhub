import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return new NextResponse("Unauthorized", { status: 401 });

    const user = await prisma.user.findUnique({
      where: { clerkId },
      include: { brandProfile: true },
    });

    if (!user) return new NextResponse("User not found", { status: 404 });

    return NextResponse.json(user.brandProfile);
  } catch (error) {
    console.error("[BRAND_PROFILE_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId: clerkId, sessionClaims } = await auth();
    if (!clerkId) return new NextResponse("Unauthorized", { status: 401 });

    const email = (sessionClaims?.email as string) || "";
    const { name, tone, niche, audience, bio } = await req.json();

    const user = await prisma.user.upsert({
      where: { clerkId },
      update: { email },
      create: {
        clerkId,
        email,
      },
    });

    const profile = await prisma.brandProfile.upsert({
      where: { userId: user.id },
      update: {
        name,
        tone,
        niche,
        audience,
        bio,
      },
      create: {
        userId: user.id,
        name,
        tone,
        niche,
        audience,
        bio,
      },
    });

    return NextResponse.json(profile);
  } catch (error) {
    console.error("[BRAND_PROFILE_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
