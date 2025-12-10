import { notFound } from "next/navigation";
import { getPlantWithFirebaseData } from "@/db/queries/plants";
import type { PlantData } from "./page";
import { PlantDetailWrapper } from "./plant-detail-wrapper";

interface PlantDetailContentProps {
  plantId: string;
  userId: string;
}

// Mock data generator for daily data (last 30 days)
function generateDailyData(
  baseValue: number,
  variance: number,
  days: number = 30,
) {
  const now = new Date();
  const data = [];

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    date.setHours(12, 0, 0, 0);

    const noise = (Math.random() - 0.5) * variance;
    const trend = Math.sin((days - i) * 0.2) * (variance * 0.5);
    const value = Math.max(0, Math.min(100, baseValue + noise + trend));

    data.push({
      date,
      value: Math.round(value * 10) / 10,
    });
  }

  return data;
}

export default async function PlantDetailContent({
  plantId,
  userId,
}: PlantDetailContentProps) {
  // Fetch plant with Firebase data
  const plantData = await getPlantWithFirebaseData(plantId, userId);

  if (!plantData) {
    notFound();
  }

  // Prepare data for wrapper component
  const plantDataForWrapper: PlantData = {
    id: plantData.id,
    name: plantData.name,
    latinName: plantData.identifyData?.speciesName || "Unknown Species",
    image: plantData.imageUrl || "/default-plant.png",
    identifyData: plantData.identifyData || {
      speciesName: "Unknown",
      commonName: "Unknown Plant",
      lightRequirements: { min: 1000, max: 2500 },
      soilMoistureRequirements: { min: 40, max: 60 },
      waterLevelRequirements: { min: 50, max: 80 },
      wateringSchedule: { amountMl: 500, frequencyDays: 7 },
      careNotes: [],
    },
    currentSensorData: plantData.currentSensorData || {
      waterLevel: 0,
      lightIntensity: 0,
      soilMoisture: 0,
      timestamp: new Date(),
    },
    historicalData: {
      waterLevel: generateDailyData(70, 20),
      lightIntensity: generateDailyData(1800, 500),
      soilMoisture: generateDailyData(50, 25),
    },
  };

  return (
    <PlantDetailWrapper
      id={plantId}
      mockPlantData={plantDataForWrapper}
      firebaseDeviceId={plantData.firebaseDeviceId}
      roomLocation={plantData.roomLocation || null}
    />
  );
}
