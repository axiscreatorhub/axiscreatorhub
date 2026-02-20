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
    await assertEntitled(userId, 'image');

    // 2. Initialize Gemini for Imagen
    const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });
    
    // Using Imagen 4.0 for high-quality generation
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: prompt,
      config: {
        numberOfImages: 1,
        aspectRatio: '1:1',
      },
    });

    const base64Image = response.generatedImages[0].image.imageBytes;
    const imageUrl = `data:image/png;base64,${base64Image}`;

    // 3. Log generation in DB
    const user = await prisma.user.findUnique({ where: { clerkUserId: userId } });
    await prisma.generation.create({
      data: {
        userId: user!.id,
        type: 'IMAGE',
        prompt,
        assetUrl: imageUrl, // In production, upload to S3/Cloudinary first
      }
    });

    return NextResponse.json({ url: imageUrl });
  } catch (error: any) {
    console.error("Image Gen Error:", error);
    return new NextResponse(error.message || "Internal Server Error", { status: 403 });
  }
}
