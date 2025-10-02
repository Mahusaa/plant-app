// app/plants/[id]/page.tsx (Server Component)
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { PlantStatsClient } from "@/components/plant-stats";

// Types for our data structure
export type PlantData = {
  id: string;
  name: string;
  latinName: string;
  image: string;
  daysToHarvest: number;
  stats: PlantStat[];
  thresholds: Record<string, ThresholdRange>;
};

export type PlantStat = {
  key: string;
  icon: string;
  value: string;
  subtitle?: string;
  unit: string;
  color: string; // tailwind color class
};

export type ThresholdRange = {
  optimal: { min: number; max: number };
  warning: { min: number; max: number };
  critical: { min: number; max: number };
};

export type TimeSeriesData = {
  timestamp: Date;
  value: number;
}[];

// Mock data - replace with actual API call
async function getPlantData(id: string): Promise<PlantData> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));

  return {
    id,
    name: "Plantain Lily",
    latinName: "Hosta plantaginea",
    image: "/bougenvile.png",
    daysToHarvest: 5,
    stats: [
      {
        key: "temperature",
        icon: "🌡️",
        value: "24",
        unit: "°C",
        color: "bg-amber-50 border-amber-200 text-amber-900",
      },
      {
        key: "humidity",
        icon: "💧",
        value: "68",
        unit: "%",
        color: "bg-blue-50 border-blue-200 text-blue-900",
      },
      {
        key: "soilMoisture",
        icon: "🌱",
        value: "45",
        unit: "%",
        subtitle: "Needs water",
        color: "bg-green-50 border-green-200 text-green-900",
      },
      {
        key: "lightIntensity",
        icon: "☀️",
        value: "850",
        unit: "lux",
        color: "bg-yellow-50 border-yellow-200 text-yellow-900",
      },
    ],
    thresholds: {
      temperature: {
        optimal: { min: 20, max: 26 },
        warning: { min: 15, max: 30 },
        critical: { min: 10, max: 35 },
      },
      humidity: {
        optimal: { min: 60, max: 80 },
        warning: { min: 40, max: 90 },
        critical: { min: 20, max: 95 },
      },
      soilMoisture: {
        optimal: { min: 50, max: 70 },
        warning: { min: 30, max: 80 },
        critical: { min: 15, max: 90 },
      },
      lightIntensity: {
        optimal: { min: 800, max: 1200 },
        warning: { min: 500, max: 1500 },
        critical: { min: 200, max: 2000 },
      },
    },
  };
}

// Mock time series data generator
function generateTimeSeriesData(days: number, baseValue: number, variance: number): TimeSeriesData {
  const now = new Date();
  const data: TimeSeriesData = [];

  for (let i = 0; i < days * 24; i++) { // hourly data points
    const timestamp = new Date(now.getTime() - (days * 24 - 1 - i) * 60 * 60 * 1000);
    const noise = (Math.random() - 0.5) * variance;
    const trend = Math.sin(i * 0.1) * (variance * 0.3);
    const value = Math.max(0, baseValue + noise + trend);

    data.push({ timestamp, value });
  }

  return data;
}

interface PlantDetailPageProps {
  params: { id: string };
}

export default async function PlantDetailPage({ params }: PlantDetailPageProps) {
  const plantData = await getPlantData(params.id);

  // Generate mock time series data for each stat
  const timeSeriesData = {
    temperature: generateTimeSeriesData(30, 24, 6),
    humidity: generateTimeSeriesData(30, 68, 20),
    soilMoisture: generateTimeSeriesData(30, 45, 25),
    lightIntensity: generateTimeSeriesData(30, 850, 300),
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <div className="mx-auto max-w-md p-6 space-y-8">
        {/* Enhanced Header */}
        <header className="flex items-center justify-between">
          <Button asChild variant="ghost" size="icon" className="rounded-full">
            <Link href="/plants" aria-label="Back">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
          </Button>

          <div className="text-center">
            <h1 className="text-lg font-semibold text-gray-900">Plant Monitor</h1>
            <p className="text-xs text-gray-500">Real-time statistics</p>
          </div>

          <Button variant="ghost" size="icon" className="rounded-full text-red-500">
            <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </Button>
        </header>

        {/* Enhanced Plant Profile */}
        <section className="text-center space-y-4">
          <div className="relative">
            <Avatar className="h-32 w-32 mx-auto ring-4 ring-white shadow-xl">
              <AvatarImage
                src={plantData.image}
                alt={plantData.name}
                className="object-cover"
              />
            </Avatar>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-green-500 text-white text-xs px-3 py-1 rounded-full">
              Healthy
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-900">{plantData.name}</h2>
            <p className="text-sm text-gray-600 italic">{plantData.latinName}</p>
            <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              {plantData.daysToHarvest} days to harvest
            </div>
          </div>
        </section>

        {/* Client Component for Stats and Charts */}
        <PlantStatsClient
          stats={plantData.stats}
          thresholds={plantData.thresholds}
          timeSeriesData={timeSeriesData}
        />

        {/* Enhanced AI Analysis Button */}
        <div className="pt-4">
          <Button asChild className="w-full h-12 rounded-xl bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 shadow-lg">
            <Link href={`/ai/${plantData.id}`} className="flex items-center gap-2">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9.5 2A1.5 1.5 0 0 0 8 3.5v1A1.5 1.5 0 0 0 9.5 6h5A1.5 1.5 0 0 0 16 4.5v-1A1.5 1.5 0 0 0 14.5 2h-5zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10z" />
                <path d="M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
              </svg>
              Analyze with AI
              <svg className="h-4 w-4 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
