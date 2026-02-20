import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { assertEntitled } from '@/lib/entitlements';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const { userId } = await auth();
  
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const { prompt, type } = await req.json(); // type: 'image' | 'video'

    // 1. Assert entitlements and increment usage atomically
    const { userId: dbUserId } = await assertEntitled(userId, type);

    // 2. Perform AI Generation (Mocked here)
    const assetUrl = `https://assets.axis.hub/gen_${Date.now()}.png`;

    // 3. Log the generation
    await prisma.generation.create({
      data: {
        userId: dbUserId,
        type: type === 'image' ? 'IMAGE' : 'VIDEO',
        prompt,
        assetUrl,
      }
    });

    return NextResponse.json({ url: assetUrl });
  } catch (error: any) {
    return new NextResponse(error.message || "Internal Error", { status: 403 });
  }
}
