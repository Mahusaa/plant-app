// app/plants/[id]/page.tsx (Server Component)
import Link from "next/link";
import { PlantDetailClient } from "./plant-detail-client";
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
    commonNames: ["Swiss Cheese Plant", "Split-leaf Philodendron"],
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
  const plantData = await getPlantData(id);

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white pb-24">
      <div className="mx-auto max-w-md">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/plants" className="h-9 w-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors">
              <svg className="h-5 w-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div className="text-center">
              <h1 className="text-base font-semibold text-slate-900">Plant Monitor</h1>
            </div>
            <div className="w-9" /> {/* Spacer for centering */}
          </div>
        </header>

        {/* Plant Profile - Compact */}
        <section className="px-6 py-4 space-y-3">
          <div className="flex gap-3 items-center">
            {/* Plant Image */}
            <div className="relative flex-shrink-0">
              <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 shadow-sm">
                <img
                  src={plantData.image}
                  alt={plantData.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center shadow-sm">
                <span className="text-[10px]">✓</span>
              </div>
            </div>

            {/* Plant Info */}
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold text-slate-900 truncate">{plantData.name}</h2>
              <p className="text-xs text-slate-600 italic truncate">{plantData.latinName}</p>
            </div>
          </div>

          {/* Care Info - Compact */}
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg p-2">
              <span className="text-lg">💧</span>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-blue-700 font-medium">Watering</p>
                <p className="text-xs font-bold text-blue-900 truncate">{plantData.identifyData.wateringSchedule.amountMl}ml / {plantData.identifyData.wateringSchedule.frequencyDays}d</p>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-2">
              <span className="text-lg">☀️</span>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-yellow-700 font-medium">Light Range</p>
                <p className="text-xs font-bold text-yellow-900 truncate">{plantData.identifyData.lightRequirements.min}-{plantData.identifyData.lightRequirements.max} lux</p>
              </div>
            </div>
          </div>
        </section>

        {/* Client Component with all interactive features */}
        <PlantDetailClient plantData={plantData} />
      </div>
    </main>
  );
}
