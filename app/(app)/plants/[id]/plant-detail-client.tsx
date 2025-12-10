"use client";

import { useStreamableValue } from "@ai-sdk/rsc";
import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceArea,
  ReferenceLine,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";
import { healthAdviceAction } from "@/actions/health";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Markdown } from "@/components/ui/markdown";
import { useHistoricalData } from "@/lib/firebase-iot";
import { getRelativeTime, toIndonesiaTime } from "@/lib/time-utils";
import type { PlantData } from "./page";

type SensorKey = "waterLevel" | "lightIntensity" | "soilMoisture";

type SensorCardData = {
  key: SensorKey;
  label: string;
  emoji: string;
  unit: string;
  color: {
    gradient: string;
    border: string;
    text: string;
    bg: string;
  };
};

const sensorConfig: SensorCardData[] = [
  {
    key: "waterLevel",
    label: "Water Level",
    emoji: "💧",
    unit: "%",
    color: {
      gradient: "from-blue-50 to-cyan-50",
      border: "border-blue-200",
      text: "text-blue-900",
      bg: "bg-blue-500",
    },
  },
  {
    key: "lightIntensity",
    label: "Illuminations",
    emoji: "☀️",
    unit: "lux",
    color: {
      gradient: "from-yellow-50 to-orange-50",
      border: "border-yellow-200",
      text: "text-yellow-900",
      bg: "bg-yellow-500",
    },
  },
  {
    key: "soilMoisture",
    label: "Soil Moisture",
    emoji: "🌱",
    unit: "%",
    color: {
      gradient: "from-green-50 to-emerald-50",
      border: "border-green-200",
      text: "text-green-900",
      bg: "bg-green-500",
    },
  },
];

interface PlantDetailClientProps {
  plantData: PlantData;
  hasDevice: boolean;
  deviceId: string | null;
  isLoadingSensor: boolean;
}

export function PlantDetailClient({
  plantData,
  hasDevice,
  deviceId,
  isLoadingSensor,
}: PlantDetailClientProps) {
  const [selectedSensor, setSelectedSensor] = useState<SensorCardData | null>(
    null,
  );
  const [showAiDialog, setShowAiDialog] = useState(false);
  const [showStatusInfo, setShowStatusInfo] = useState(false);
  const [showTimeInfo, setShowTimeInfo] = useState(false);
  const [aiContext, setAiContext] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<any>(null);
  const [_currentTime, setCurrentTime] = useState(Date.now());

  // Get historical data from Firebase (30 minutes time series)
  const { data: firebaseHistoricalData, loading: historicalLoading } =
    useHistoricalData(deviceId, "30min");

  // Update current time every 5 seconds for relative time display
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  // Get formatted timestamps (with null safety)
  const lastUpdateTime = plantData.currentSensorData?.timestamp || null;
  const relativeTime = getRelativeTime(lastUpdateTime);
  const indonesiaTime = toIndonesiaTime(lastUpdateTime);

  const getSensorValue = (key: SensorKey): number => {
    return plantData.currentSensorData?.[key] || 0;
  };

  // Get thresholds for each sensor type from identify data
  const getSensorThresholds = (
    key: SensorKey,
  ): { min: number; max: number } => {
    if (!plantData.identifyData) {
      return { min: 0, max: 100 };
    }

    if (key === "lightIntensity") {
      return {
        min: plantData.identifyData.lightRequirements?.min || 0,
        max: plantData.identifyData.lightRequirements?.max || 100,
      };
    } else if (key === "soilMoisture") {
      return {
        min: plantData.identifyData.soilMoistureRequirements?.min || 0,
        max: plantData.identifyData.soilMoistureRequirements?.max || 100,
      };
    } else if (key === "waterLevel") {
      return {
        min: plantData.identifyData.waterLevelRequirements?.min || 0,
        max: plantData.identifyData.waterLevelRequirements?.max || 100,
      };
    }
    return { min: 0, max: 100 };
  };

  const getSensorStatus = (
    key: SensorKey,
  ): { status: string; emoji: string; description: string } => {
    const value = getSensorValue(key);
    const { min, max } = getSensorThresholds(key);

    if (value >= min && value <= max) {
      return {
        status: "Optimal",
        emoji: "✅",
        description: "Perfect conditions",
      };
    } else if (value < min * 0.7 || value > max * 1.3) {
      return {
        status: "Critical",
        emoji: "🔴",
        description: "Needs immediate attention",
      };
    } else {
      return {
        status: "Warning",
        emoji: "⚠️",
        description: "Suboptimal conditions",
      };
    }
  };

  const [timeRange, setTimeRange] = useState<"day" | "week">("day");

  const getChartData = (key: SensorKey) => {
    // Debug logging
    console.log("🔍 Getting chart data for:", key);
    console.log("📊 Has device:", hasDevice);
    console.log(
      "📊 Firebase data length:",
      firebaseHistoricalData?.length || 0,
    );
    console.log(
      "📊 Firebase data sample:",
      firebaseHistoricalData?.slice(0, 2),
    );

    // Use Firebase historical data if available, otherwise fall back to mock data
    if (
      hasDevice &&
      firebaseHistoricalData &&
      firebaseHistoricalData.length > 0
    ) {
      // Map Firebase data to chart format
      const chartData = firebaseHistoricalData.map((point) => {
        const normalizedPoint = point as typeof point & Record<string, unknown>;

        const rawValue =
          key === "waterLevel"
            ? (normalizedPoint.level_air ??
              normalizedPoint.water_level ??
              normalizedPoint.waterLevel)
            : key === "lightIntensity"
              ? (normalizedPoint.intensitas_cahaya ??
                normalizedPoint.lux ??
                normalizedPoint.lightIntensity)
              : (normalizedPoint.kelembapan_tanah ??
                normalizedPoint.soil_moisture ??
                normalizedPoint.soilMoisture);

        const numericValue =
          typeof rawValue === "string"
            ? Number(rawValue)
            : typeof rawValue === "number"
              ? rawValue
              : NaN;
        const safeValue = Number.isFinite(numericValue) ? numericValue : 0;

        // Add 7 hours for Indonesian timezone (WIB - UTC+7)
        const wibTimestamp = point.timestamp + 7 * 60 * 60 * 1000;
        const wibDate = new Date(wibTimestamp);

        return {
          date: wibDate.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
          time: point.time, // This is already formatted in WIB from firebase-iot.ts
          value: safeValue,
          fullDate: wibDate.toLocaleDateString(),
          timestamp: wibTimestamp,
        };
      });

      console.log("✅ Using Firebase data:", chartData.length, "points");
      console.log(
        "📈 Value range:",
        Math.min(...chartData.map((d) => d.value)),
        "-",
        Math.max(...chartData.map((d) => d.value)),
      );
      return chartData;
    }

    console.log("⚠️ Using mock data (no Firebase data)");
    // Fall back to mock data if no Firebase data
    const now = new Date();
    const daysToShow = timeRange === "day" ? 1 : 7;

    return plantData.historicalData[key]
      .filter((point) => {
        const diffTime = now.getTime() - point.date.getTime();
        const diffDays = diffTime / (1000 * 60 * 60 * 24);
        return diffDays <= daysToShow;
      })
      .map((point) => {
        // Add 7 hours for Indonesian timezone (WIB - UTC+7)
        const wibTimestamp = point.date.getTime() + 7 * 60 * 60 * 1000;
        const wibDate = new Date(wibTimestamp);

        return {
          date: wibDate.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
          time: wibDate.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }),
          value: point.value,
          fullDate: wibDate.toLocaleDateString(),
          timestamp: wibTimestamp,
        };
      });
  };

  const handleAiAnalyze = async () => {
    setAiLoading(true);
    setAiResponse(null);

    try {
      const sensorContext = {
        lux: plantData.currentSensorData?.lightIntensity || 0,
        moisture: plantData.currentSensorData?.soilMoisture || 0,
      };

      const prompt = aiContext.trim()
        ? `${aiContext}\n\nAdditional context: Plant is ${plantData.latinName}`
        : `Analyze the current health of my ${plantData.latinName} plant based on sensor readings.`;

      const { output } = await healthAdviceAction({
        prompt,
        context: sensorContext,
        plantId: plantData.id,
        deviceId: deviceId || undefined,
      });

      setAiResponse(output);
      toast.success("Health analysis complete");
    } catch (error) {
      console.error("AI analysis failed:", error);
      toast.error("Failed to analyze plant health");
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <>
      {/* Sensor Cards - Compact Row */}
      <section className="px-6 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-700">IoT Sensors</h3>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-[10px] text-slate-500">Live</span>
            </div>
            <button
              onClick={() => setShowStatusInfo(true)}
              className="w-4 h-4 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center transition-colors"
              aria-label="Status information"
            >
              <span className="text-[10px] text-slate-600 font-bold">i</span>
            </button>
          </div>
        </div>

        {/* Last Updated Time */}
        <button
          onClick={() => setShowTimeInfo(true)}
          className="w-full bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg p-2 flex items-center justify-between hover:from-blue-100 hover:to-cyan-100 transition-colors"
        >
          <div className="flex items-center gap-2">
            <span className="text-sm">🕐</span>
            <div className="text-left">
              <p className="text-[10px] text-blue-600 font-medium">
                Last Updated
              </p>
              <p className="text-xs text-blue-900 font-semibold">
                {relativeTime}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-blue-600 font-medium">WIB</p>
            <p className="text-xs text-blue-900 font-semibold">
              {indonesiaTime.time}
            </p>
          </div>
        </button>

        <div className="grid grid-cols-3 gap-2">
          {sensorConfig.map((sensor) => {
            const value = getSensorValue(sensor.key);
            const status = getSensorStatus(sensor.key);

            return (
              <Card
                key={sensor.key}
                onClick={() => setSelectedSensor(sensor)}
                className={`cursor-pointer transition-all duration-200 active:scale-95 hover:shadow-md border ${sensor.color.border} bg-gradient-to-br ${sensor.color.gradient} p-3 relative overflow-hidden`}
              >
                {/* Status Indicator - Top Right */}
                <div className="absolute top-1.5 right-1.5">
                  <span className="text-sm">{status.emoji}</span>
                </div>

                {/* Content */}
                <div className="space-y-2">
                  {/* Icon */}
                  <div className="flex items-center justify-center">
                    <span className="text-3xl">{sensor.emoji}</span>
                  </div>

                  {/* Value */}
                  <div className="text-center">
                    <div className="flex items-baseline justify-center gap-0.5">
                      <span
                        className={`text-xl font-bold ${sensor.color.text} leading-none`}
                      >
                        {value}
                      </span>
                      <span className="text-[10px] text-slate-600 font-medium">
                        {sensor.unit}
                      </span>
                    </div>
                  </div>

                  {/* Label */}
                  <div className="text-center">
                    <p className="text-[9px] font-semibold text-slate-600 uppercase tracking-wide leading-tight">
                      {sensor.label}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Care Tips */}
      <section className="px-6 space-y-3 pt-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-slate-700">
            Care Tips
          </span>
          <span className="text-base">💡</span>
        </div>
        <div className="bg-gradient-to-br from-emerald-50 to-green-50 border border-green-200 rounded-xl p-3 space-y-2">
          {plantData.identifyData?.careNotes &&
          plantData.identifyData.careNotes.length > 0 ? (
            <ul className="space-y-2">
              {plantData.identifyData.careNotes.slice(0, 5).map((note, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-xs text-green-800"
                >
                  <span className="text-green-600 mt-0.5 flex-shrink-0">•</span>
                  <span className="leading-relaxed">{note}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-green-700 text-center py-2">
              No care tips available yet
            </p>
          )}
        </div>
      </section>

      {/* AI Analyze Button */}
      <section className="px-6 pt-2">
        <Button
          onClick={() => setShowAiDialog(true)}
          className="w-full h-11 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold shadow-md flex items-center justify-center gap-2"
        >
          <span className="text-lg">🤖</span>
          <span className="text-sm">AI Health Analysis</span>
          <svg
            className="h-4 w-4 ml-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        </Button>
      </section>

      {/* Sensor Detail Dialog */}
      {selectedSensor && (
        <Dialog
          open={!!selectedSensor}
          onOpenChange={() => setSelectedSensor(null)}
        >
          <DialogContent className="w-[95vw] max-w-md max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center gap-3">
                <span className="text-3xl">{selectedSensor.emoji}</span>
                <div>
                  <DialogTitle className="text-lg font-bold">
                    {selectedSensor.label}
                  </DialogTitle>
                  <p className="text-sm text-slate-600">
                    Current: {getSensorValue(selectedSensor.key)}
                    {selectedSensor.unit}
                  </p>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-4 pt-4">
              {/* Time Range Selector */}
              <div className="flex justify-center">
                <div className="inline-flex rounded-lg bg-slate-100 p-1">
                  <button
                    onClick={() => setTimeRange("day")}
                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                      timeRange === "day"
                        ? "bg-white shadow-sm text-slate-900"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Day
                  </button>
                  <button
                    onClick={() => setTimeRange("week")}
                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                      timeRange === "week"
                        ? "bg-white shadow-sm text-slate-900"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Week
                  </button>
                </div>
              </div>

              {/* Chart */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-slate-700">
                  {timeRange === "day" ? "Last 24 Hours" : "Last 7 Days"}
                </h4>
                <div className="h-72 w-full bg-white rounded-lg border border-slate-200 p-3">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={getChartData(selectedSensor.key)}
                      margin={{ top: 10, right: 10, bottom: 25, left: -15 }}
                    >
                      <defs>
                        {/* Area gradient for the data line */}
                        <linearGradient
                          id={`areaGradient${selectedSensor.key}`}
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor={
                              selectedSensor.color.bg === "bg-blue-500"
                                ? "#3b82f6"
                                : selectedSensor.color.bg === "bg-yellow-500"
                                  ? "#eab308"
                                  : "#22c55e"
                            }
                            stopOpacity={0.4}
                          />
                          <stop
                            offset="95%"
                            stopColor={
                              selectedSensor.color.bg === "bg-blue-500"
                                ? "#3b82f6"
                                : selectedSensor.color.bg === "bg-yellow-500"
                                  ? "#eab308"
                                  : "#22c55e"
                            }
                            stopOpacity={0.1}
                          />
                        </linearGradient>
                      </defs>

                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#e2e8f0"
                        vertical={false}
                      />

                      <XAxis
                        dataKey={timeRange === "day" ? "time" : "date"}
                        tick={{ fontSize: 10, fill: "#64748b" }}
                        tickLine={false}
                        axisLine={{ stroke: "#cbd5e1" }}
                        interval="preserveStartEnd"
                        minTickGap={35}
                      />

                      <YAxis
                        tick={{ fontSize: 10, fill: "#64748b" }}
                        tickLine={false}
                        axisLine={{ stroke: "#cbd5e1" }}
                        domain={["dataMin - 10", "dataMax + 10"]}
                      />

                      {/* Optimal zone background - more prominent */}
                      {(() => {
                        const threshold = getSensorThresholds(
                          selectedSensor.key,
                        );
                        return (
                          <ReferenceArea
                            y1={threshold.min}
                            y2={threshold.max}
                            fill="#22c55e"
                            fillOpacity={0.15}
                            strokeOpacity={0}
                          />
                        );
                      })()}

                      {/* Threshold boundary lines with labels */}
                      {(() => {
                        const threshold = getSensorThresholds(
                          selectedSensor.key,
                        );
                        return (
                          <>
                            <ReferenceLine
                              y={threshold.min}
                              stroke="#059669"
                              strokeWidth={2.5}
                              strokeDasharray="5 3"
                              label={{
                                value: threshold.min,
                                position: "left",
                                fill: "#059669",
                                fontSize: 11,
                                fontWeight: "bold",
                                offset: 5,
                              }}
                            />
                            <ReferenceLine
                              y={threshold.max}
                              stroke="#059669"
                              strokeWidth={2.5}
                              strokeDasharray="5 3"
                              label={{
                                value: threshold.max,
                                position: "left",
                                fill: "#059669",
                                fontSize: 11,
                                fontWeight: "bold",
                                offset: 5,
                              }}
                            />
                          </>
                        );
                      })()}

                      {/* Data line */}
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke={
                          selectedSensor.color.bg === "bg-blue-500"
                            ? "#3b82f6"
                            : selectedSensor.color.bg === "bg-yellow-500"
                              ? "#eab308"
                              : "#22c55e"
                        }
                        strokeWidth={3}
                        fill={`url(#areaGradient${selectedSensor.key})`}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Legend */}
                <div className="flex items-center justify-center gap-4 text-xs">
                  <div className="flex items-center gap-1.5">
                    <div className="w-4 h-3 bg-green-500 bg-opacity-20 border-2 border-green-600 border-dashed rounded-sm"></div>
                    <span className="text-slate-700 font-medium">
                      Optimal Zone
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div
                      className="w-4 h-2 rounded-full"
                      style={{
                        background:
                          selectedSensor.color.bg === "bg-blue-500"
                            ? "#3b82f6"
                            : selectedSensor.color.bg === "bg-yellow-500"
                              ? "#eab308"
                              : "#22c55e",
                      }}
                    ></div>
                    <span className="text-slate-700 font-medium">
                      Sensor Data
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* AI Analysis Dialog */}
      <Dialog open={showAiDialog} onOpenChange={setShowAiDialog}>
        <DialogContent className="w-[95vw] max-w-md max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <span className="text-3xl">🤖</span>
              <div>
                <DialogTitle className="text-lg font-bold">
                  AI Health Analysis
                </DialogTitle>
                <p className="text-sm text-slate-600">
                  Get personalized plant care advice
                </p>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4 pt-4">
            {/* Current Sensor Data */}
            <div className="bg-gradient-to-r from-slate-50 to-slate-100 border-2 border-slate-200 rounded-xl p-4">
              <h4 className="text-sm font-semibold text-slate-700 mb-3">
                Current Sensor Data
              </h4>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="text-center">
                  <div className="font-medium text-slate-600">Water</div>
                  <div className="font-bold text-slate-900">
                    {plantData.currentSensorData.waterLevel}%
                  </div>
                </div>
                <div className="text-center">
                  <div className="font-medium text-slate-600">Light</div>
                  <div className="font-bold text-slate-900">
                    {plantData.currentSensorData.lightIntensity} lux
                  </div>
                </div>
                <div className="text-center">
                  <div className="font-medium text-slate-600">Soil</div>
                  <div className="font-bold text-slate-900">
                    {plantData.currentSensorData.soilMoisture}%
                  </div>
                </div>
              </div>
            </div>

            {/* Context Input */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">
                Additional Context (Optional)
              </label>
              <textarea
                value={aiContext}
                onChange={(e) => setAiContext(e.target.value)}
                placeholder="e.g., I noticed yellow leaves, or The plant seems droopy..."
                className="w-full h-24 rounded-xl border-2 border-slate-200 px-4 py-3 text-sm focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all resize-none"
              />
            </div>

            {/* Analyze Button */}
            <Button
              onClick={handleAiAnalyze}
              disabled={aiLoading}
              className="w-full h-11 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold"
            >
              {aiLoading ? (
                <>
                  <span className="mr-2">🤔</span>
                  Analyzing...
                </>
              ) : (
                <>
                  <span className="mr-2">✨</span>
                  Analyze Plant Health
                </>
              )}
            </Button>

            {/* AI Response */}
            {aiResponse && (
              <StreamedResponse data={aiResponse} isLoading={aiLoading} />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Status Info Dialog */}
      <Dialog open={showStatusInfo} onOpenChange={setShowStatusInfo}>
        <DialogContent className="w-[90vw] max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">
              Status Indicators
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3 pt-2">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-green-50 border border-green-200">
              <span className="text-2xl">✅</span>
              <div className="flex-1">
                <h4 className="font-semibold text-green-900 text-sm">
                  Optimal
                </h4>
                <p className="text-xs text-green-700 mt-0.5">
                  Perfect conditions for your plant's health and growth
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg bg-yellow-50 border border-yellow-200">
              <span className="text-2xl">⚠️</span>
              <div className="flex-1">
                <h4 className="font-semibold text-yellow-900 text-sm">
                  Warning
                </h4>
                <p className="text-xs text-yellow-700 mt-0.5">
                  Suboptimal conditions - monitor and adjust if needed
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg bg-red-50 border border-red-200">
              <span className="text-2xl">🔴</span>
              <div className="flex-1">
                <h4 className="font-semibold text-red-900 text-sm">Critical</h4>
                <p className="text-xs text-red-700 mt-0.5">
                  Needs immediate attention - plant health at risk
                </p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Time Info Dialog */}
      <Dialog open={showTimeInfo} onOpenChange={setShowTimeInfo}>
        <DialogContent className="w-[90vw] max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <span>🕐</span>
              Last Updated
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            {/* Relative Time */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4">
              <p className="text-xs text-purple-600 font-medium mb-1">
                Relative Time
              </p>
              <p className="text-2xl font-bold text-purple-900">
                {relativeTime}
              </p>
            </div>

            {/* Indonesia Time (WIB) */}
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs text-blue-600 font-medium">
                  Indonesia Time
                </p>
                <span className="text-xs font-semibold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                  {indonesiaTime.timezone}
                </span>
              </div>
              <p className="text-xl font-bold text-blue-900">
                {indonesiaTime.time}
              </p>
              <p className="text-xs text-blue-700">{indonesiaTime.date}</p>

              {/* Time Delta */}
              <div className="mt-3 pt-3 border-t border-blue-200">
                <div className="flex items-center gap-2">
                  <span className="text-sm">🌍</span>
                  <div>
                    <p className="text-[10px] text-blue-600 font-medium">
                      Time Difference
                    </p>
                    <p className="text-xs text-blue-900 font-semibold">
                      {indonesiaTime.delta}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Your Local Time */}
            <div className="bg-gradient-to-r from-slate-50 to-gray-50 border border-slate-200 rounded-lg p-4">
              <p className="text-xs text-slate-600 font-medium mb-1">
                Your Local Time
              </p>
              <p className="text-lg font-bold text-slate-900">
                {lastUpdateTime
                  ? lastUpdateTime.toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                      hour12: false,
                    })
                  : "No data"}
              </p>
              <p className="text-xs text-slate-600 mt-1">
                {lastUpdateTime
                  ? lastUpdateTime.toLocaleDateString("en-US", {
                      weekday: "short",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                  : "Waiting for sensor data"}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function StreamedResponse({
  data,
  isLoading,
}: {
  data: any;
  isLoading: boolean;
}) {
  const [streamedText] = useStreamableValue<string>(data);

  return (
    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
          <span className="text-lg">🌿</span>
        </div>
        <span className="font-semibold text-green-800">AI Recommendation</span>
        {isLoading && streamedText && (
          <span className="text-xs text-green-600 animate-pulse">
            ● Analyzing...
          </span>
        )}
      </div>
      <div className="leading-relaxed text-sm bg-white/50 rounded-lg p-3 border border-green-100">
        {!streamedText && isLoading ? (
          <div className="flex items-center gap-2 text-green-600">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-green-600 border-t-transparent"></div>
            <span>Thinking...</span>
          </div>
        ) : (
          <div>
            <Markdown content={streamedText || ""} />
            {isLoading && streamedText && (
              <span className="inline-block w-2 h-4 bg-green-600 animate-pulse ml-1 align-middle"></span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
