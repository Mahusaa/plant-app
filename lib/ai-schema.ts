import { z } from "zod/v4";
export const IdentifySchema = z.object({
  speciesName: z.string().describe("Scientific or common species name"),
  commonNames: z.array(z.string()).optional().describe("Common names if known"),
  confidence: z.number().min(0).max(1).optional().describe("Model confidence 0-1"),
  luxThresholdRange: z.object({
    min: z.number().describe("Minimum recommended lux"),
    max: z.number().describe("Maximum recommended lux"),
    unit: z.literal("lux").default("lux"),
  }),
  waterNeeded: z.object({
    amountMl: z.number().describe("Approximate water amount per session in ml"),
    frequencyDays: z.number().describe("Recommended watering frequency in days"),
  }),
  lightNotes: z.array(z.string()).optional(),
  careNotes: z.array(z.string()).optional(),
});

export type IdentifyResult = z.infer<typeof IdentifySchema>;
