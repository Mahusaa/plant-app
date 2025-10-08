import { z } from "zod/v4";

// Comprehensive plant identification schema for IoT monitoring
export const IdentifySchema = z.object({
  // Basic identification
  speciesName: z.string().describe("Full scientific name (e.g., Monstera Deliciosa)"),
  commonNames: z.array(z.string()).optional().describe("Common names (e.g., Swiss Cheese Plant)"),
  confidence: z.number().min(0).max(1).optional().describe("Model confidence 0-1"),

  // Plant category/type
  plantType: z.enum(["indoor", "outdoor", "both"]).optional().describe("Indoor or outdoor plant"),

  // Light requirements (Illuminations sensor)
  lightRequirements: z.object({
    min: z.number().describe("Minimum lux (e.g., 1000)"),
    max: z.number().describe("Maximum lux (e.g., 2500)"),
    ideal: z.number().optional().describe("Ideal lux level"),
    description: z.string().optional().describe("Light description (e.g., Bright indirect light)"),
  }).describe("Light intensity thresholds for monitoring"),

  // Soil moisture requirements
  soilMoistureRequirements: z.object({
    min: z.number().describe("Minimum soil moisture % (e.g., 40)"),
    max: z.number().describe("Maximum soil moisture % (e.g., 60)"),
    ideal: z.number().optional().describe("Ideal soil moisture %"),
    description: z.string().optional().describe("Soil moisture description"),
  }).describe("Soil moisture thresholds for monitoring"),

  // Water level requirements (for auto-watering reservoir)
  waterLevelRequirements: z.object({
    min: z.number().describe("Minimum water level % (e.g., 50)"),
    max: z.number().describe("Maximum water level % (e.g., 80)"),
    description: z.string().optional().describe("Water level description"),
  }).describe("Water reservoir level thresholds"),

  // Watering schedule
  wateringSchedule: z.object({
    amountMl: z.number().describe("Water amount per session in ml (e.g., 500)"),
    frequencyDays: z.number().describe("Watering frequency in days (e.g., 7)"),
    notes: z.array(z.string()).optional().describe("Watering tips"),
  }).describe("Recommended watering schedule"),

  // Temperature preferences (for future sensor integration)
  temperatureRange: z.object({
    min: z.number().describe("Minimum temperature in Celsius (e.g., 18)"),
    max: z.number().describe("Maximum temperature in Celsius (e.g., 27)"),
    ideal: z.number().optional().describe("Ideal temperature"),
  }).optional().describe("Temperature preferences"),

  // Humidity preferences (for future sensor integration)
  humidityRange: z.object({
    min: z.number().describe("Minimum humidity % (e.g., 50)"),
    max: z.number().describe("Maximum humidity % (e.g., 70)"),
    ideal: z.number().optional().describe("Ideal humidity %"),
  }).optional().describe("Humidity preferences"),

  // Care tips and notes
  careNotes: z.array(z.string()).describe("General care tips (max 5-7 tips)"),
  healthIssues: z.array(z.string()).optional().describe("Common health issues to watch for"),

  // Growing information
  growthRate: z.enum(["slow", "moderate", "fast"]).optional().describe("Plant growth rate"),
  maxHeight: z.string().optional().describe("Maximum height (e.g., 2-3 meters)"),

  // Toxicity information
  toxicity: z.object({
    toxic: z.boolean().describe("Is plant toxic?"),
    notes: z.string().optional().describe("Toxicity details"),
  }).optional().describe("Toxicity information for pets/humans"),
});

export type IdentifyResult = z.infer<typeof IdentifySchema>;
