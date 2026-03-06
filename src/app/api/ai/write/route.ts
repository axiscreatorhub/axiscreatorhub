import { getGeminiModel } from "@/lib/gemini";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireCredits } from "@/lib/credits";

import { AI_COSTS } from "@/lib/costs";

export async function POST(req: Request) {
  try {
    const ai = getGeminiModel();
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { prompt, context: manualContext, type = "GENERAL" } = await req.json();

    if (!prompt) {
      return new NextResponse("Prompt is required", { status: 400 });
    }

    // 0. Fetch Brand Context
    const userProfile = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: { brandProfile: true }
    });

    if (!userProfile) {
      return new NextResponse("User not found", { status: 404 });
    }

    const brandContext = userProfile.brandProfile 
      ? `Brand Name: ${userProfile.brandProfile.name}, 
         Tone: ${userProfile.brandProfile.tone}, 
         Niche: ${userProfile.brandProfile.niche}, 
         Audience: ${userProfile.brandProfile.audience}, 
         Bio: ${userProfile.brandProfile.bio}`
      : "General creative assistance";

    // 1. Check and deduct credits
    const creditCost = manualContext === 'Video Creator' ? AI_COSTS.VIDEO_SCRIPT : AI_COSTS.WRITING;
    try {
      await requireCredits(userProfile.id, creditCost, "AI_WRITE");
    } catch (error: any) {
      if (error.message === "Insufficient credits") {
        return NextResponse.json({ 
          error: "Insufficient credits", 
          message: `You need ${creditCost} credits to generate this content. Please top up your wallet.`,
          code: "INSUFFICIENT_CREDITS"
        }, { status: 403 });
      }
      return new NextResponse("Failed to verify credits", { status: 500 });
    }

    // 2. Call Gemini
    const model = ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `You are an expert content creator assistant for Axis Creator Hub. 
              Brand Context: ${brandContext}
              Additional Context: ${manualContext || "None"}
              Task: ${prompt}
              
              Provide a high-quality, viral-ready response that matches the brand's tone and niche.`
            }
          ]
        }
      ],
      config: {
        temperature: 0.7,
        topP: 0.9,
      }
    });

    const response = await model;
    const text = response.text;

    // 3. Log usage in UsageLedger (for legacy tracking)
    await prisma.usageLedger.create({
      data: {
        userId: userProfile.id,
        feature: "AI_WRITE",
        credits: creditCost,
        day: new Date(),
      }
    });

    // 4. Save to Scripts if it's a script
    if (type === "SCRIPT") {
      await prisma.script.create({
        data: {
          userId: userProfile.id,
          topic: prompt.substring(0, 50),
          format: "TIKTOK", // Default
          content: text || "",
          viralScore: Math.floor(Math.random() * 20) + 80, // Mock score
        }
      });
    }

    return NextResponse.json({ text });
  } catch (error: any) {
    console.error("[AI_WRITE_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
