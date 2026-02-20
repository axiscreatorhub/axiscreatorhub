import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { assertEntitled } from '@/lib/entitlements';

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const { type } = await req.json(); // 'image' | 'video'
    const entitlements = await assertEntitled(userId, type);
    return NextResponse.json(entitlements);
  } catch (error: any) {
    return new NextResponse(error.message || "Forbidden", { status: 403 });
  }
}
