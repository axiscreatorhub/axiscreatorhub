import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return new NextResponse("Unauthorized", { status: 401 });

    const user = await prisma.user.findUnique({
      where: { clerkId },
      include: { 
        brandProfile: {
          include: { mediaKit: true }
        } 
      },
    });

    if (!user || !user.brandProfile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    return NextResponse.json({
      profile: user.brandProfile,
      mediaKit: user.brandProfile.mediaKit,
    });
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return new NextResponse("Unauthorized", { status: 401 });

    const { slug, isPublic, theme, links, stats } = await req.json();

    const user = await prisma.user.findUnique({
      where: { clerkId },
      include: { brandProfile: true },
    });

    if (!user || !user.brandProfile) {
      return new NextResponse("Brand profile required first", { status: 400 });
    }

    // Update Brand Profile (slug, links, stats)
    const updatedProfile = await prisma.brandProfile.update({
      where: { id: user.brandProfile.id },
      data: {
        slug: slug?.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
        links: JSON.stringify(links || []),
        stats: JSON.stringify(stats || {}),
      },
    });

    // Upsert Media Kit
    const mediaKit = await prisma.mediaKit.upsert({
      where: { brandProfileId: user.brandProfile.id },
      update: {
        isPublic: !!isPublic,
        theme: theme || "MODERN",
      },
      create: {
        brandProfileId: user.brandProfile.id,
        isPublic: !!isPublic,
        theme: theme || "MODERN",
      },
    });

    return NextResponse.json({ profile: updatedProfile, mediaKit });
  } catch (error) {
    console.error("[MEDIA_KIT_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
