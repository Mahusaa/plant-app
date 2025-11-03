"use client";

import { useState } from "react";
import { type IdentifyResult } from "@/lib/ai-schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronDown, ChevronUp } from "lucide-react";

interface ResultDisplayProps {
  result: IdentifyResult;
  imagePreview?: string | null;
}

export function ResultDisplay({ result, imagePreview }: ResultDisplayProps) {
  const [showImage, setShowImage] = useState(false);

  return (
    <section className="space-y-4 pb-6">
      {/* Collapsible Image Preview */}
      {imagePreview && (
        <Card className="shadow-sm border-0 bg-gradient-to-br from-white to-slate-50/30">
          <CardContent className="p-3">
            <button
              onClick={() => setShowImage(!showImage)}
              className="w-full flex items-center justify-between text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors"
            >
              <span className="flex items-center gap-2">
                <span>📸</span>
                Captured Image
              </span>
              {showImage ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
            {showImage && (
              <div className="mt-3 relative mx-auto max-w-xs">
                <img
                  src={imagePreview}
                  alt="Captured plant"
                  className="w-full rounded-xl border-2 border-green-300 shadow-sm"
                />
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Card className="shadow-sm border-0 bg-gradient-to-br from-white to-green-50/30">
        <CardHeader className="py-4">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-100 to-emerald-50 border border-green-300 flex items-center justify-center">
                <span className="text-2xl">{getMoodEmoji(result.confidence)}</span>
              </div>
              <div className="flex-1">
                <CardTitle className="text-xl sm:text-2xl text-slate-800 font-bold">
                  {result.commonName}
                </CardTitle>
                <div className="text-sm text-slate-500 italic mt-1">
                  {result.speciesName}
                </div>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  {result.plantType && (
                    <Badge variant="outline" className="text-xs">
                      {result.plantType} plant
                    </Badge>
                  )}
                  {typeof result.confidence === "number" && (
                    <Badge
                      variant="secondary"
                      className={`${getConfidenceBadgeClass(result.confidence)} font-semibold px-3 py-1`}
                    >
                      {(result.confidence * 100).toFixed(0)}% match
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            {typeof result.confidence === "number" && (
              <div className="flex items-center gap-3">
                <Progress
                  value={Math.round(result.confidence * 100)}
                  className="h-3 bg-gradient-to-r from-green-100 to-emerald-100"
                />
                <span className="text-sm text-slate-600 font-medium">Confidence</span>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-6 text-sm">
          {/* IoT Sensor Thresholds - Primary Info */}
          <div>
            <h3 className="text-xs font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
              <span className="text-sm">📊</span>
              IoT Monitoring Thresholds
            </h3>
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-3 text-center">
                <div className="flex justify-center mb-1">
                  <span className="text-2xl">☀️</span>
                </div>
                <div className="text-sm font-bold text-yellow-900">
                  {result.lightRequirements.min}–{result.lightRequirements.max}
                </div>
                <div className="text-xs text-yellow-700">lux</div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg p-3 text-center">
                <div className="flex justify-center mb-1">
                  <span className="text-2xl">🌱</span>
                </div>
                <div className="text-sm font-bold text-green-900">
                  {result.soilMoistureRequirements.min}–{result.soilMoistureRequirements.max}%
                </div>
                <div className="text-xs text-green-700">moisture</div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-lg p-3 text-center">
                <div className="flex justify-center mb-1">
                  <span className="text-2xl">💧</span>
                </div>
                <div className="text-sm font-bold text-blue-900">
                  {result.waterLevelRequirements.min}–{result.waterLevelRequirements.max}%
                </div>
                <div className="text-xs text-blue-700">reservoir</div>
              </div>
            </div>
          </div>

          {/* Tabs for detailed information */}
          <Tabs defaultValue="care" className="w-full">
            <TabsList className="w-full grid grid-cols-4 bg-gradient-to-r from-slate-100 to-slate-200 border border-slate-300 rounded-xl p-1">
              <TabsTrigger
                value="care"
                className="text-xs font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white rounded-lg"
              >
                <span className="mr-1">🌿</span>
                Care
              </TabsTrigger>
              <TabsTrigger
                value="watering"
                className="text-xs font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white rounded-lg"
              >
                <span className="mr-1">💧</span>
                Water
              </TabsTrigger>
              <TabsTrigger
                value="environment"
                className="text-xs font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white rounded-lg"
              >
                <span className="mr-1">🌡️</span>
                Env
              </TabsTrigger>
              <TabsTrigger
                value="info"
                className="text-xs font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-slate-500 data-[state=active]:to-slate-700 data-[state=active]:text-white rounded-lg"
              >
                <span className="mr-1">ℹ️</span>
                Info
              </TabsTrigger>
            </TabsList>

            {/* Care Tab */}
            <TabsContent value="care" className="space-y-4 pt-4">
              {result.careNotes?.length ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-slate-700 font-medium">
                    <span>💡</span>
                    <span>Care Tips</span>
                  </div>
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
                    <ul className="list-none space-y-2">
                      {result.careNotes.map((note: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-green-800">
                          <span className="text-green-600 mt-0.5">•</span>
                          <span className="leading-relaxed">{note}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : null}

              {result.healthIssues?.length ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-slate-700 font-medium">
                    <span>⚠️</span>
                    <span>Watch For</span>
                  </div>
                  <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-xl p-4">
                    <ul className="list-none space-y-2">
                      {result.healthIssues.map((issue: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-amber-800">
                          <span className="text-amber-600 mt-0.5">•</span>
                          <span className="leading-relaxed">{issue}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : null}
            </TabsContent>

            {/* Watering Tab */}
            <TabsContent value="watering" className="space-y-4 pt-4">
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">💧</span>
                  <span className="font-semibold text-blue-800">Watering Schedule</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-xs text-blue-600 font-medium mb-1">Amount</div>
                    <div className="text-2xl font-bold text-blue-900">{result.wateringSchedule.amountMl}</div>
                    <div className="text-xs text-blue-700">ml per session</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-blue-600 font-medium mb-1">Frequency</div>
                    <div className="text-2xl font-bold text-blue-900">{result.wateringSchedule.frequencyDays}</div>
                    <div className="text-xs text-blue-700">days</div>
                  </div>
                </div>
              </div>

              {result.wateringSchedule.notes?.length ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-slate-600 font-medium">
                    <span>💡</span>
                    <span>Watering Tips</span>
                  </div>
                  <ul className="list-none space-y-2">
                    {result.wateringSchedule.notes.map((note: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                        <span className="text-blue-500 mt-0.5">•</span>
                        <span>{note}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </TabsContent>

            {/* Environment Tab */}
            <TabsContent value="environment" className="space-y-4 pt-4">
              {result.temperatureRange && (
                <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg">🌡️</span>
                    <span className="font-semibold text-orange-800">Temperature</span>
                  </div>
                  <div className="text-lg font-bold text-orange-900">
                    {result.temperatureRange.min}°C - {result.temperatureRange.max}°C
                  </div>
                  {result.temperatureRange.ideal && (
                    <div className="text-sm text-orange-700 mt-1">Ideal: {result.temperatureRange.ideal}°C</div>
                  )}
                </div>
              )}

              {result.humidityRange && (
                <div className="bg-gradient-to-r from-sky-50 to-blue-50 border border-sky-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg">💨</span>
                    <span className="font-semibold text-sky-800">Humidity</span>
                  </div>
                  <div className="text-lg font-bold text-sky-900">
                    {result.humidityRange.min}% - {result.humidityRange.max}%
                  </div>
                  {result.humidityRange.ideal && (
                    <div className="text-sm text-sky-700 mt-1">Ideal: {result.humidityRange.ideal}%</div>
                  )}
                </div>
              )}

              {result.lightRequirements.description && (
                <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">☀️</span>
                    <span className="font-semibold text-yellow-800">Light Description</span>
                  </div>
                  <p className="text-sm text-yellow-800">{result.lightRequirements.description}</p>
                </div>
              )}
            </TabsContent>

            {/* Info Tab */}
            <TabsContent value="info" className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-3">
                {result.growthRate && (
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                    <div className="text-xs text-slate-600 mb-1">Growth Rate</div>
                    <div className="text-sm font-bold text-slate-900 capitalize">{result.growthRate}</div>
                  </div>
                )}

                {result.maxHeight && (
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                    <div className="text-xs text-slate-600 mb-1">Max Height</div>
                    <div className="text-sm font-bold text-slate-900">{result.maxHeight}</div>
                  </div>
                )}
              </div>

              {result.toxicity && (
                <div
                  className={`rounded-xl p-4 border-2 ${
                    result.toxicity.toxic
                      ? "bg-gradient-to-r from-red-50 to-orange-50 border-red-300"
                      : "bg-gradient-to-r from-green-50 to-emerald-50 border-green-300"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{result.toxicity.toxic ? "⚠️" : "✅"}</span>
                    <span
                      className={`font-semibold ${result.toxicity.toxic ? "text-red-900" : "text-green-900"}`}
                    >
                      {result.toxicity.toxic ? "Toxic" : "Non-Toxic"}
                    </span>
                  </div>
                  {result.toxicity.notes && (
                    <p className={`text-sm ${result.toxicity.toxic ? "text-red-800" : "text-green-800"}`}>
                      {result.toxicity.notes}
                    </p>
                  )}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </section>
  );
}

function getMoodEmoji(confidence?: number | null): string {
  if (typeof confidence !== "number") return "🌿";
  const pct = confidence * 100;
  if (pct >= 85) return "🌱";
  if (pct >= 60) return "🌿";
  if (pct >= 35) return "🍃";
  return "🌾";
}

function getConfidenceBadgeClass(confidence?: number | null): string {
  if (typeof confidence !== "number") return "";
  const pct = confidence * 100;
  if (pct >= 85) return "border-green-200 bg-green-50 text-green-700";
  if (pct >= 60) return "border-emerald-200 bg-emerald-50 text-emerald-700";
  if (pct >= 35) return "border-amber-200 bg-amber-50 text-amber-800";
  return "border-red-200 bg-red-50 text-red-700";
}
