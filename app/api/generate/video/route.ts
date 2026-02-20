import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { assertEntitled } from '@/lib/entitlements';
import { prisma } from '@/lib/prisma';
import { GoogleGenAI } from "@google/genai";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const { prompt } = await req.json();
    if (!prompt) return new NextResponse("Prompt is required", { status: 400 });

    // 1. Check entitlements (Atomic increment)
    await assertEntitled(userId, 'video');

    // 2. Initialize Gemini for Veo
    const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });
    
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: prompt,
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: '16:9'
      }
    });

    // Poll for completion
    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 10000));
      operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    // Append API key for download
    const videoUrl = `${downloadLink}&key=${process.env.NEXT_PUBLIC_GEMINI_API_KEY}`;

    // 3. Log generation in DB
    const user = await prisma.user.findUnique({ where: { clerkUserId: userId } });
    await prisma.generation.create({
      data: {
        userId: user!.id,
        type: 'VIDEO',
        prompt,
        assetUrl: videoUrl,
      }
    });

    return NextResponse.json({ url: videoUrl });
  } catch (error: any) {
    console.error("Video Gen Error:", error);
    return new NextResponse(error.message || "Internal Server Error", { status: 403 });
  }
}
