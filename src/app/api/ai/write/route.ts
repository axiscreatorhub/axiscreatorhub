import { getGeminiModel } from "@/lib/gemini";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { deductCredits } from "@/lib/credits";

export async function POST(req: Request) {
  try {
    const ai = getGeminiModel();
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { prompt, context, type = "GENERAL" } = await req.json();

    if (!prompt) {
      return new NextResponse("Prompt is required", { status: 400 });
    }

    // 1. Check and deduct credits
    const creditCost = 1; // 1 credit per AI write
    try {
      await deductCredits(userId, creditCost, "AI_WRITE");
    } catch (error) {
      return new NextResponse("Insufficient credits", { status: 403 });
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
              Context: ${context || "General creative assistance"}
              Task: ${prompt}
              
              Provide a high-quality, viral-ready response.`
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
        userId,
        feature: "AI_WRITE",
        credits: creditCost,
        day: new Date(),
      }
    });

    // 4. Save to Scripts if it's a script
    if (type === "SCRIPT") {
      await prisma.script.create({
        data: {
          userId,
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
