"use server";
import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { createStreamableValue } from "@ai-sdk/rsc";

export async function healthAdviceAction({
  prompt,
  context,
  imageBase64,
}: {
  prompt: string;
  context?: {
    lux?: number;
    moisture?: number;
    temperatureC?: number;
    humidity?: number;
  };
  imageBase64?: string;
}) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("Missing OPENAI_API_KEY");
  }

  const stream = createStreamableValue("");

  (async () => {
    const system = `You are a plant health assistant. Provide concise, step-by-step guidance.
    - Analyze plant images for signs of disease, pests, nutrient deficiencies, or stress.
    - Consider sensor data when provided (lux, moisture, temperature, humidity).
    - If watering is needed, specify amount in ml and reasons.
    - If light is suboptimal, recommend a target lux range and placement.
    - Keep responses short, practical, and actionable.`;

    const ctx = context
      ? `\nSensor context: ${JSON.stringify(context)}`
      : "";

    // Build content array for multimodal input
    const content: Array<
      | { type: "text"; text: string }
      | { type: "image"; image: string }
    > = [
      {
        type: "text",
        text: `${prompt}${ctx}`,
      },
    ];

    // Add image if provided
    if (imageBase64) {
      content.push({
        type: "image",
        image: imageBase64,
      });
    }

    const { textStream } = await streamText({
      model: openai("gpt-4o"),
      system,
      messages: [
        {
          role: "user",
          content,
        },
      ],
    });

    for await (const delta of textStream) {
      stream.append(delta);
    }

    stream.done();
  })();

  return { output: stream.value };
}
