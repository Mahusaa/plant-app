"use client";

import { useCallback, useRef, useState } from "react";
import { identifyPlantAction } from "@/actions/identify";
import { type IdentifyResult } from "@/lib/ai-schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

export default function IdentifyPage() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<IdentifyResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const readFileAsDataURL = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const base64 = await readFileAsDataURL(file);
    setImagePreview(base64);
    setError(null);
    setResult(null);
  };

  const startScanning = () => {
    setScanning(true);
    // Trigger camera
    fileInputRef.current?.click();
  };

  const stopScanning = () => {
    setScanning(false);
  };

  const clearSelection = () => {
    setImagePreview(null);
    setResult(null);
    setError(null);
    setScanning(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  async function onIdentify() {
    if (!imagePreview) return;
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const res = await identifyPlantAction({ imageBase64: imagePreview });
      setResult(res);
    } catch (e: any) {
      setError(e?.message ?? "Failed to identify plant");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="p-4 sm:p-6 space-y-6 max-w-3xl mx-auto bg-gradient-to-b from-slate-50 to-white min-h-screen">
      <header className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-100 to-cyan-50 border border-blue-300 flex items-center justify-center">
            <span className="text-2xl">🔍</span>
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Plant Scanner</h1>
            <p className="text-sm text-slate-500">Scan and identify your plants 📱</p>
          </div>
        </div>
        <p className="text-sm text-slate-600 bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-center gap-2">
          <span className="text-lg">📸</span>
          Point your camera at a plant and tap scan to identify it
        </p>
      </header>

      {/* Main Scanning Area */}
      <div className="space-y-6">
        <Card className="shadow-sm border-0 bg-gradient-to-br from-white to-blue-50/30">
          <CardContent className="p-6">
            {!imagePreview ? (
              <div className="space-y-6">
                {/* Camera Viewfinder */}
                <div className="relative mx-auto max-w-sm">
                  <div className="relative w-full aspect-[4/5] bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl border-4 border-dashed border-blue-300 overflow-hidden">
                    {/* Viewfinder Corners */}
                    <div className="absolute top-4 left-4 w-8 h-8 border-t-4 border-l-4 border-blue-500 rounded-tl-lg"></div>
                    <div className="absolute top-4 right-4 w-8 h-8 border-t-4 border-r-4 border-blue-500 rounded-tr-lg"></div>
                    <div className="absolute bottom-4 left-4 w-8 h-8 border-b-4 border-l-4 border-blue-500 rounded-bl-lg"></div>
                    <div className="absolute bottom-4 right-4 w-8 h-8 border-b-4 border-r-4 border-blue-500 rounded-br-lg"></div>
                    
                    {/* Center Plant Icon */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-100 to-emerald-50 border-4 border-green-300 flex items-center justify-center">
                        <span className="text-4xl">🌱</span>
                      </div>
                    </div>
                    
                    {/* Scanning Animation */}
                    {scanning && (
                      <div className="absolute inset-0 bg-blue-500/20 animate-pulse">
                        <div className="absolute inset-0 border-4 border-blue-500 rounded-3xl animate-ping"></div>
                      </div>
                    )}
                  </div>
                  
                  {/* Scan Instructions */}
                  <div className="mt-4 text-center space-y-2">
                    <div className="text-lg font-semibold text-slate-800">
                      {scanning ? "Position plant in frame" : "Ready to scan"}
                    </div>
                    <div className="text-sm text-slate-600">
                      {scanning ? "Tap anywhere to capture" : "Tap scan to start camera"}
                    </div>
                  </div>
                </div>

                {/* Scan Button */}
                <div className="flex justify-center">
                  <Button 
                    onClick={startScanning}
                    disabled={scanning}
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold px-8 py-4 rounded-2xl text-lg shadow-lg"
                  >
                    {scanning ? (
                      <>
                        <span className="mr-2">📷</span>
                        Scanning...
                      </>
                    ) : (
                      <>
                        <span className="mr-2">📸</span>
                        Scan Plant
                      </>
                    )}
                  </Button>
                </div>

                {/* Hidden File Input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={onFileChange}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="space-y-6">
                {/* Captured Image */}
                <div className="relative mx-auto max-w-sm">
                  <div className="relative w-full aspect-[4/5] overflow-hidden rounded-3xl border-4 border-green-300 bg-gradient-to-br from-green-50 to-emerald-50">
                    <img
                      src={imagePreview}
                      alt="Captured plant"
                      className="w-full h-full object-cover"
                    />
                    {/* Success Overlay */}
                    <div className="absolute top-4 right-4 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">✓</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 text-center space-y-2">
                    <div className="text-lg font-semibold text-green-800">Plant Captured!</div>
                    <div className="text-sm text-green-600">Ready to identify</div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 justify-center">
                  <Button 
                    size="lg"
                    variant="secondary" 
                    onClick={() => fileInputRef.current?.click()} 
                    disabled={loading}
                    className="bg-gradient-to-r from-blue-100 to-cyan-50 border-blue-200 text-blue-700 hover:from-blue-200 hover:to-cyan-100 px-6"
                  >
                    <span className="mr-2">🔄</span>
                    Rescan
                  </Button>
                  <Button 
                    size="lg"
                    onClick={onIdentify} 
                    disabled={loading}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold px-8"
                  >
                    {loading ? (
                      <>
                        <span className="mr-2">🔍</span>
                        Identifying...
                      </>
                    ) : (
                      <>
                        <span className="mr-2">🌱</span>
                        Identify Plant
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mt-6 rounded-xl border border-red-200 bg-gradient-to-r from-red-50 to-pink-50 text-red-700 text-sm p-4 flex items-center gap-2">
                <span className="text-lg">⚠️</span>
                {error}
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-100 to-cyan-50 flex items-center justify-center">
                    <span className="text-lg animate-spin">🌱</span>
                  </div>
                  <div className="text-sm font-medium text-slate-700">Analyzing your plant...</div>
                </div>
                <div className="space-y-2">
                  <div className="h-2 w-full rounded-full bg-gradient-to-r from-blue-100 to-cyan-100 overflow-hidden">
                    <div className="h-2 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full animate-pulse" style={{ width: "70%" }} />
                  </div>
                  <div className="h-2 w-2/3 rounded-full bg-gradient-to-r from-blue-100 to-cyan-100 overflow-hidden mx-auto">
                    <div className="h-2 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full animate-pulse" style={{ width: "45%" }} />
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Results Section */}
      {result && (
        <section className="space-y-6">
          <Card className="shadow-sm border-0 bg-gradient-to-br from-white to-green-50/30">
            <CardHeader className="py-4">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-100 to-emerald-50 border border-green-300 flex items-center justify-center">
                    <span className="text-2xl">{getMoodEmoji(result.confidence)}</span>
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg sm:text-xl flex items-center gap-2 text-slate-800">
                      {result.speciesName}
                    </CardTitle>
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
                {typeof result.confidence === "number" && (
                  <div className="flex items-center gap-3">
                    <Progress 
                      value={Math.round(result.confidence * 100)} 
                      className="h-3 bg-gradient-to-r from-green-100 to-emerald-100" 
                    />
                    <span className="text-sm text-slate-600 font-medium">Confidence Level</span>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6 text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-4 text-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-100 to-orange-100 flex items-center justify-center mx-auto mb-2">
                    <span className="text-2xl">☀️</span>
                  </div>
                  <div className="text-xs text-yellow-700 font-medium mb-1">Light Range</div>
                  <div className="text-lg font-bold text-yellow-800">
                    {result.luxThresholdRange.min}–{result.luxThresholdRange.max}
                  </div>
                  <div className="text-xs text-yellow-600">{result.luxThresholdRange.unit}</div>
                </div>
                
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-4 text-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center mx-auto mb-2">
                    <span className="text-2xl">💧</span>
                  </div>
                  <div className="text-xs text-blue-700 font-medium mb-1">Water Frequency</div>
                  <div className="text-lg font-bold text-blue-800">
                    Every {result.waterNeeded.frequencyDays} days
                  </div>
                  <div className="text-xs text-blue-600">Regular schedule</div>
                </div>
                
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 text-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center mx-auto mb-2">
                    <span className="text-2xl">🧪</span>
                  </div>
                  <div className="text-xs text-green-700 font-medium mb-1">Water Amount</div>
                  <div className="text-lg font-bold text-green-800">
                    {result.waterNeeded.amountMl} ml
                  </div>
                  <div className="text-xs text-green-600">Per watering</div>
                </div>
              </div>

              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="w-full grid grid-cols-4 bg-gradient-to-r from-slate-100 to-slate-200 border border-slate-300 rounded-xl p-1">
                  <TabsTrigger 
                    value="overview" 
                    className="text-xs font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white rounded-lg"
                  >
                    <span className="mr-1">📋</span>
                    Overview
                  </TabsTrigger>
                  <TabsTrigger 
                    value="light" 
                    className="text-xs font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-500 data-[state=active]:to-orange-500 data-[state=active]:text-white rounded-lg"
                  >
                    <span className="mr-1">☀️</span>
                    Light
                  </TabsTrigger>
                  <TabsTrigger 
                    value="watering" 
                    className="text-xs font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white rounded-lg"
                  >
                    <span className="mr-1">💧</span>
                    Watering
                  </TabsTrigger>
                  <TabsTrigger 
                    value="care" 
                    className="text-xs font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white rounded-lg"
                  >
                    <span className="mr-1">🌱</span>
                    Care
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4 pt-4">
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">📋</span>
                      <span className="font-semibold text-green-800">Plant Overview</span>
                    </div>
                    <p className="text-sm leading-relaxed text-green-700">
                      {getOverviewText(result)}
                    </p>
                  </div>
                  {result.commonNames?.length ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-slate-600 font-medium">
                        <span>🏷️</span>
                        <span>Also known as</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {result.commonNames.map((name: string, i: number) => (
                          <span key={i} className="text-xs px-3 py-1 rounded-full bg-gradient-to-r from-slate-100 to-slate-200 border border-slate-300 text-slate-700 font-medium">
                            {name}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </TabsContent>

                <TabsContent value="light" className="space-y-4 pt-4">
                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">☀️</span>
                        <span className="font-semibold text-yellow-800">Light Requirements</span>
                      </div>
                      <div className="text-lg font-bold text-yellow-800">
                        {result.luxThresholdRange.min}–{result.luxThresholdRange.max} {result.luxThresholdRange.unit}
                      </div>
                    </div>
                    <div className="w-full bg-gradient-to-r from-yellow-100 to-orange-100 rounded-full h-2 overflow-hidden">
                      <div className="h-2 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full" style={{ width: "75%" }} />
                    </div>
                  </div>
                  {result.lightNotes?.length ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-slate-600 font-medium">
                        <span>💡</span>
                        <span>Light Tips</span>
                      </div>
                      <ul className="list-none space-y-2">
                        {result.lightNotes.map((n: string, i: number) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                            <span className="text-yellow-500 mt-0.5">•</span>
                            <span>{n}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </TabsContent>

                <TabsContent value="watering" className="space-y-4 pt-4">
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-lg">💧</span>
                      <span className="font-semibold text-blue-800">Watering Schedule</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-xs text-blue-600 font-medium mb-1">Amount</div>
                        <div className="text-xl font-bold text-blue-800">{result.waterNeeded.amountMl} ml</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-blue-600 font-medium mb-1">Frequency</div>
                        <div className="text-xl font-bold text-blue-800">every {result.waterNeeded.frequencyDays} days</div>
                      </div>
                    </div>
                  </div>
                  {result.careNotes?.length ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-slate-600 font-medium">
                        <span>💡</span>
                        <span>Watering Tips</span>
                      </div>
                      <ul className="list-none space-y-2">
                        {result.careNotes.map((n: string, i: number) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                            <span className="text-blue-500 mt-0.5">•</span>
                            <span>{n}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </TabsContent>

                <TabsContent value="care" className="space-y-4 pt-4">
                  {result.careNotes?.length ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-slate-600 font-medium">
                        <span>🌱</span>
                        <span>Care Instructions</span>
                      </div>
                      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-4">
                        <ul className="list-none space-y-3">
                          {result.careNotes.map((n: string, i: number) => (
                            <li key={i} className="flex items-start gap-3 text-sm text-purple-700">
                              <span className="text-purple-500 mt-0.5">🌿</span>
                              <span>{n}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gradient-to-r from-slate-50 to-slate-100 border border-slate-200 rounded-xl p-4 text-center">
                      <div className="flex items-center justify-center gap-2 text-slate-500">
                        <span>📝</span>
                        <span>No additional care notes available.</span>
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </section>
      )}
    </main>
  );
}

function getMoodEmoji(confidence?: number | null): string {
  if (typeof confidence !== "number") return "🌿";
  const pct = confidence * 100;
  if (pct >= 85) return "🌱"; // very confident
  if (pct >= 60) return "🌿"; // confident
  if (pct >= 35) return "🍃"; // moderate
  return "🌾"; // low
}

function getConfidenceBadgeClass(confidence?: number | null): string {
  if (typeof confidence !== "number") return "";
  const pct = confidence * 100;
  if (pct >= 85) return "border-green-200 bg-green-50 text-green-700";
  if (pct >= 60) return "border-emerald-200 bg-emerald-50 text-emerald-700";
  if (pct >= 35) return "border-amber-200 bg-amber-50 text-amber-800";
  return "border-red-200 bg-red-50 text-red-700";
}

function getOverviewText(result: IdentifyResult): string {
  const species = result.speciesName;
  const light = `${result.luxThresholdRange.min}–${result.luxThresholdRange.max} ${result.luxThresholdRange.unit}`;
  const freq = result.waterNeeded.frequencyDays;
  const amount = result.waterNeeded.amountMl;
  return `${species} typically thrives at ${light}. Water about ${amount} ml every ${freq} days. Check leaves for cues and adjust for your room’s light.`;
}

