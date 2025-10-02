"use server";

import { z } from "zod";
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

  const system = `You are a plant identification assistant. Given a plant photo, identify the plant and return structured care data.
- Always populate luxThresholdRange with realistic values for the identified plant.
- Always populate waterNeeded with amountMl and frequencyDays for typical indoor pot size.
- Use 'lux' as the unit for light thresholds.
- Add a few concise careNotes and lightNotes if helpful.
- If unsure, choose the most probable species and include a lower confidence value.`;

  const userText =
    prompt ??
    "Identify this plant and return structured data for light (lux range) and watering (ml and days).";

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
