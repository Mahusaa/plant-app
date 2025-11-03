"use server";

import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { IdentifySchema, type IdentifyResult } from "@/lib/ai-schema";

// Structured output schema for plant identification


export async function identifyPlantAction({
  imageBase64,
  prompt,
}: {
  imageBase64: string; // data URL or raw base64. Prefer data URL (data:image/...;base64,xxx)
  prompt?: string;
}): Promise<IdentifyResult> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("Missing OPENAI_API_KEY");
  }

  const system = `You are an expert plant identification assistant for IoT plant monitoring systems. Given a plant photo, identify the plant and return comprehensive care data.

IMPORTANT GUIDELINES:
- Provide the full scientific name (e.g., "Monstera Deliciosa")
- Include 2-3 common names if available
- Set confidence level based on image quality and distinctiveness

SENSOR THRESHOLDS (Critical for IoT monitoring):
- lightRequirements: min/max lux values for optimal growth (e.g., indoor: 1000-2500, outdoor: 2000-5000)
- soilMoistureRequirements: min/max % for soil moisture sensor (typical: 40-60% for most plants)
- waterLevelRequirements: min/max % for auto-watering reservoir (typical: 50-80%)
- Include ideal values when possible

CARE INFORMATION:
- wateringSchedule: realistic ml per session and frequency in days for medium pot (15-20cm)
- careNotes: 5-7 practical, actionable care tips
- Include common health issues to watch for
- Specify if indoor, outdoor, or both
- Include toxicity information if relevant

Be specific with numbers for thresholds - they will be used for automated monitoring and alerts.`;

  const userText =
    prompt ??
    "Identify this plant and provide complete IoT monitoring specifications including light, soil moisture, and water level thresholds, along with care instructions.";

  const { object } = await generateObject({
    model: openai("gpt-5-mini"),
    schema: IdentifySchema,
    messages: [
      { role: "system", content: system },
      {
        role: "user",
        content: [
          { type: "text", text: userText },
          // imageBase64 can be a data URL, which OpenAI accepts through the Vercel AI SDK
          { type: "image", image: imageBase64 },
        ],
      },
    ],
  });

  return object;
}
