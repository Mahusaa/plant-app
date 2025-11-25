// app/plants/[id]/page.tsx (Server Component)
import { Suspense } from "react";
import { PlantDetailWrapper } from "./plant-detail-wrapper";
import type { IdentifyResult } from "@/lib/ai-schema";
import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { headers } from "next/headers";
import PlantDetailContent from "./plant-detail-content";
import { PlantDetailSkeleton } from "./plant-detail-skeleton";

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

// Convert care requirements from DB to IdentifyResult format
function buildIdentifyDataFromCareRequirements(plant: any): IdentifyResult {
  const care = plant.careRequirements;

  if (!care) {
    // Return default values if no care requirements exist
    return {
      speciesName: plant.scientificName || "Unknown",
      commonName: plant.commonName || plant.name,
      plantType: "indoor",
      lightRequirements: { min: 1000, max: 2500 },
      soilMoistureRequirements: { min: 40, max: 60 },
      waterLevelRequirements: { min: 50, max: 80 },
      wateringSchedule: { amountMl: 500, frequencyDays: 7 },
      careNotes: [],
    };
  }

  return {
    speciesName: plant.scientificName || "Unknown",
    commonName: plant.commonName || plant.name,
    plantType: "indoor",
    lightRequirements: {
      min: care.lightMin || 1000,
      max: care.lightMax || 2500,
      ideal: care.lightIdeal,
      description: care.lightDescription,
    },
    soilMoistureRequirements: {
      min: care.soilMoistureMin || 40,
      max: care.soilMoistureMax || 60,
      ideal: care.soilMoistureIdeal,
      description: care.soilMoistureDescription,
    },
    waterLevelRequirements: {
      min: care.waterLevelMin || 50,
      max: care.waterLevelMax || 80,
      description: care.waterLevelDescription,
    },
    wateringSchedule: {
      amountMl: care.wateringAmountMl || 500,
      frequencyDays: care.wateringFrequencyDays || 7,
      notes: care.wateringNotes ? JSON.parse(care.wateringNotes) : [],
    },
    temperatureRange: care.temperatureMin && care.temperatureMax ? {
      min: care.temperatureMin,
      max: care.temperatureMax,
      ideal: care.temperatureIdeal,
    } : undefined,
    humidityRange: care.humidityMin && care.humidityMax ? {
      min: care.humidityMin,
      max: care.humidityMax,
      ideal: care.humidityIdeal,
    } : undefined,
    careNotes: care.careNotes ? JSON.parse(care.careNotes) : [],
    healthIssues: care.healthIssues ? JSON.parse(care.healthIssues) : [],
    growthRate: care.growthRate as any,
    maxHeight: care.maxHeight,
    toxicity: care.isToxic !== null ? {
      toxic: care.isToxic,
      notes: care.toxicityNotes,
    } : undefined,
  };
}

interface PlantDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function PlantDetailPage({ params }: PlantDetailPageProps) {
  const { id } = await params;

  // Get authenticated user with Better Auth
  const headersList = await headers();
  const session = await auth.api.getSession({
    headers: headersList,
  });

  if (!session?.user?.id) {
    redirect("/login");
  }

  return (
    <Suspense fallback={<PlantDetailSkeleton />}>
      <PlantDetailContent plantId={id} userId={session.user.id} />
    </Suspense>
  );
}
