import { getGeminiModel } from "@/lib/gemini";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { deductCredits } from "@/lib/credits";

export async function POST(req: Request) {
  try {
    const ai = getGeminiModel();
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const { prompt, aspectRatio = "1:1", type = "THUMBNAIL" } = await req.json();

    if (!prompt) {
      return new NextResponse("Prompt is required", { status: 400 });
    }

    // 1. Check and deduct credits
    const creditCost = 5; // 5 credits per image generation
    try {
      await deductCredits(user.id, creditCost, "IMAGE_GEN");
    } catch (error) {
      return new NextResponse("Insufficient credits", { status: 403 });
    }

    // 2. Create AssetJob record
    const job = await prisma.assetJob.create({
      data: {
        userId: user.id,
        type,
        prompt,
        status: "PROCESSING",
      },
    });

    // 3. Call Gemini for Image Generation
    // Using gemini-2.5-flash-image as per guidelines
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: prompt,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio as any,
        },
      },
    });

    let base64Image = "";
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData?.data) {
        base64Image = part.inlineData.data;
        break;
      }
    }

    if (!base64Image) {
      await prisma.assetJob.update({
        where: { id: job.id },
        data: { status: "FAILED" },
      });
      return new NextResponse("Failed to generate image", { status: 500 });
    }

    const imageUrl = `data:image/png;base64,${base64Image}`;

    // 4. Update AssetJob
    await prisma.assetJob.update({
      where: { id: job.id },
      data: {
        status: "COMPLETED",
        outputUrls: JSON.stringify([imageUrl]),
      },
    });

    // 5. Log usage in UsageLedger
    await prisma.usageLedger.create({
      data: {
        userId: user.id,
        feature: "ASSET_GEN",
        credits: creditCost,
        day: new Date(),
      }
    });

    return NextResponse.json({ imageUrl, jobId: job.id });
  } catch (error: any) {
    console.error("[IMAGE_GEN_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return new NextResponse("Unauthorized", { status: 401 });

    const user = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!user) return new NextResponse("User not found", { status: 404 });

    const jobs = await prisma.assetJob.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    return NextResponse.json(jobs);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
