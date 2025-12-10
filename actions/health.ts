"use server";
import { openai } from "@ai-sdk/openai";
import { createStreamableValue } from "@ai-sdk/rsc";
import { streamText } from "ai";
import { getDeviceThresholdPlan } from "@/lib/firebase-device";
import { fetchHistoricalData } from "@/lib/firebase-iot";

export async function healthAdviceAction({
  prompt,
  context,
  imageBase64,
  plantId,
  deviceId,
}: {
  prompt: string;
  context?: {
    lux?: number;
    moisture?: number;
    temperatureC?: number;
    humidity?: number;
  };
  imageBase64?: string;
  plantId?: string;
  deviceId?: string;
}) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("Missing OPENAI_API_KEY");
  }

  const stream = createStreamableValue("");

  (async () => {
    // Fetch historical data if deviceId is provided
    let historicalContext = "";

    if (deviceId) {
      try {
        // Fetch last 30 days of sensor data
        const historicalData = await fetchHistoricalData(deviceId, "30min");
        const thresholds = await getDeviceThresholdPlan(deviceId);

        if (historicalData.length > 0 && thresholds) {
          // Calculate averages
          const avgLight = Math.round(
            historicalData.reduce((sum, d) => sum + d.intensitas_cahaya, 0) /
              historicalData.length,
          );
          const avgMoisture = Math.round(
            historicalData.reduce((sum, d) => sum + d.kelembapan_tanah, 0) /
              historicalData.length,
          );
          const avgWater = Math.round(
            historicalData.reduce((sum, d) => sum + d.level_air, 0) /
              historicalData.length,
          );

          // Compare current vs historical
          const currentLight = context?.lux || 0;
          const currentMoisture = context?.moisture || 0;

          const lightTrend =
            currentLight > avgLight
              ? "increasing"
              : currentLight < avgLight
                ? "decreasing"
                : "stable";
          const moistureTrend =
            currentMoisture > avgMoisture
              ? "increasing"
              : currentMoisture < avgMoisture
                ? "decreasing"
                : "stable";

          // Calculate ideal values from thresholds
          const idealLight =
            thresholds.lightRequirements.ideal ||
            Math.round(
              (thresholds.lightRequirements.min +
                thresholds.lightRequirements.max) /
                2,
            );
          const idealMoisture =
            thresholds.soilMoistureRequirements.ideal ||
            Math.round(
              (thresholds.soilMoistureRequirements.min +
                thresholds.soilMoistureRequirements.max) /
                2,
            );

          historicalContext = `

HISTORICAL DATA (Last 30 readings):
- Average Light: ${avgLight} lux (Current: ${currentLight} lux, Trend: ${lightTrend})
- Average Soil Moisture: ${avgMoisture}% (Current: ${currentMoisture}%, Trend: ${moistureTrend})
- Average Water Level: ${avgWater}%
- Data points collected: ${historicalData.length}

OPTIMAL THRESHOLDS:
- Target Light: ${idealLight} lux (Range: ${thresholds.lightRequirements.min}-${thresholds.lightRequirements.max} lux)
- Target Soil Moisture: ${idealMoisture}% (Range: ${thresholds.soilMoistureRequirements.min}-${thresholds.soilMoistureRequirements.max}%)
- Watering Schedule: ${thresholds.wateringSchedule.amountMl}ml every ${thresholds.wateringSchedule.frequencyDays} days
`;
        }
      } catch (error) {
        console.error("Error fetching historical data:", error);
      }
    }

    const system = `You are an expert plant health analyst. Provide comprehensive, markdown-formatted health assessments.

RESPONSE FORMAT:
- Use markdown formatting: **bold** for emphasis, ## headers for sections, bullet lists
- Structure: ## Health Summary, ## Sensor Analysis, ## Trend Analysis, ## Recommendations, ## Warnings (if any)
- Be specific with numbers and dates from the data provided

ANALYSIS REQUIREMENTS:
- Analyze current sensor data against optimal thresholds
- Review historical trends (last 30 readings) for patterns
- Compare current readings to historical averages
- Identify concerning trends (declining soil moisture, stress indicators)
- Provide actionable recommendations with specific amounts (e.g., "Water 200ml")
- Explain WHY recommendations are needed based on actual data

FORMATTING RULES:
- Use **bold** for critical values and key recommendations
- Use bullet lists (- or 1.) for step-by-step instructions
- Use ### for section headers
- Keep language clear, friendly, but scientifically accurate
- Cite specific values from sensor readings`;

    const ctx = context
      ? `\nCurrent sensor readings: ${JSON.stringify(context)}`
      : "";

    const fullPrompt = `${prompt}${historicalContext}${ctx}`;

    // Build content array for multimodal input
    const content: Array<
      { type: "text"; text: string } | { type: "image"; image: string }
    > = [
      {
        type: "text",
        text: fullPrompt,
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
