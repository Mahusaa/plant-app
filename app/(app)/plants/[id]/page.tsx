// app/plants/[id]/page.tsx (Server Component)
import { PlantDetailWrapper } from "./plant-detail-wrapper";
import type { IdentifyResult } from "@/lib/ai-schema";

// Types for IoT sensor data
export type PlantData = {
  id: string;
  name: string;
  latinName: string;
  image: string;
  identifyData: IdentifyResult; // From plant identification
  currentSensorData: SensorData;
  historicalData: HistoricalSensorData;
};

export type SensorData = {
  waterLevel: number; // Water capacitancy for autowatering (%)
  lightIntensity: number; // lux
  soilMoisture: number; // %
  timestamp: Date;
};

export type HistoricalSensorData = {
  waterLevel: DailyDataPoint[];
  lightIntensity: DailyDataPoint[];
  soilMoisture: DailyDataPoint[];
};

export type DailyDataPoint = {
  date: Date;
  value: number;
};

// Mock data generator for daily data (last 30 days)
function generateDailyData(baseValue: number, variance: number, days: number = 30): DailyDataPoint[] {
  const now = new Date();
  const data: DailyDataPoint[] = [];

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    date.setHours(12, 0, 0, 0); // Set to noon for consistency

    const noise = (Math.random() - 0.5) * variance;
    const trend = Math.sin((days - i) * 0.2) * (variance * 0.5);
    const value = Math.max(0, Math.min(100, baseValue + noise + trend));

    data.push({
      date,
      value: Math.round(value * 10) / 10, // Round to 1 decimal
    });
  }

  return data;
}

// Mock function to get plant data - replace with actual API call
async function getPlantData(id: string): Promise<PlantData> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));

  // Mock identify data (this would come from when the user identified the plant)
  const identifyData: IdentifyResult = {
    speciesName: "Monstera Deliciosa",
    commonName: "Swiss Cheese Plant",
    confidence: 0.95,
    plantType: "indoor",

    // Light requirements for IoT sensor
    lightRequirements: {
      min: 1000,
      max: 2500,
      ideal: 1800,
      description: "Bright indirect light",
    },

    // Soil moisture requirements for IoT sensor
    soilMoistureRequirements: {
      min: 40,
      max: 60,
      ideal: 50,
      description: "Keep soil moderately moist",
    },

    // Water level requirements for auto-watering reservoir
    waterLevelRequirements: {
      min: 50,
      max: 80,
      description: "Maintain adequate water reservoir",
    },

    // Watering schedule
    wateringSchedule: {
      amountMl: 500,
      frequencyDays: 7,
      notes: ["Water when top 2 inches of soil are dry", "Reduce watering in winter"],
    },

    // Optional environmental preferences
    temperatureRange: {
      min: 18,
      max: 27,
      ideal: 22,
    },

    humidityRange: {
      min: 50,
      max: 70,
      ideal: 60,
    },

    // Care information
    careNotes: [
      "Water when top 2 inches of soil are dry",
      "Prefers humid environments - mist regularly",
      "Fertilize monthly during growing season",
      "Wipe leaves to remove dust",
      "Provide support for climbing",
    ],

    healthIssues: [
      "Yellow leaves indicate overwatering",
      "Brown leaf tips suggest low humidity",
      "Pale leaves mean insufficient light",
    ],

    growthRate: "fast",
    maxHeight: "2-3 meters indoors",

    toxicity: {
      toxic: true,
      notes: "Toxic to cats and dogs if ingested",
    },
  };

  return {
    id,
    name: "Monstera",
    latinName: identifyData.speciesName,
    image: "/bougenvile.png",
    identifyData,
    currentSensorData: {
      waterLevel: 65,
      lightIntensity: 1800,
      soilMoisture: 45,
      timestamp: new Date(),
    },
    historicalData: {
      waterLevel: generateDailyData(70, 20),
      lightIntensity: generateDailyData(1800, 500),
      soilMoisture: generateDailyData(50, 25),
    },
  };
}

interface PlantDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function PlantDetailPage({ params }: PlantDetailPageProps) {
  const { id } = await params;
  const mockPlantData = await getPlantData(id);

  return <PlantDetailWrapper id={id} mockPlantData={mockPlantData} />;
}
