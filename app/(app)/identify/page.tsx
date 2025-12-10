"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { identifyPlantAction } from "@/actions/identify";
import ImageCropModal from "@/components/image-crop-modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { IdentifyResult } from "@/lib/ai-schema";
import { formatFileSize, readFileAsDataURL } from "@/lib/image-utils";
import { ResultDisplay } from "./result-display";

export default function IdentifyPage() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageSize, setImageSize] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<IdentifyResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showCropModal, setShowCropModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const base64 = await readFileAsDataURL(file);
      setOriginalImage(base64);
      setShowCropModal(true);
      setError(null);
      setResult(null);
    } catch (_err) {
      setError("Failed to load image. Please try again.");
    }
  };

  const handleCropComplete = (croppedImage: string, size: number) => {
    setImagePreview(croppedImage);
    setImageSize(size);
    setShowCropModal(false);
    setScanning(false);
  };

  const handleCropCancel = () => {
    setShowCropModal(false);
    setOriginalImage(null);
    setScanning(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const startScanning = () => {
    setScanning(true);
    // Trigger camera
    fileInputRef.current?.click();
  };

  const _stopScanning = () => {
    setScanning(false);
  };

  const clearSelection = () => {
    setImagePreview(null);
    setOriginalImage(null);
    setImageSize(null);
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
      toast.success("Plant identified successfully!");
    } catch (e: any) {
      const errorMsg = e?.message ?? "Failed to identify plant";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="p-4 sm:p-6 pb-32 space-y-4 max-w-3xl mx-auto bg-gradient-to-b from-slate-50 to-white min-h-screen flex flex-col">
      <header className="space-y-3">
        <div className="flex items-center gap-3 justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-100 to-cyan-50 border border-blue-300 flex items-center justify-center">
              <span className="text-2xl">🔍</span>
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-800">
                Plant Scanner
              </h1>
              <p className="text-sm text-slate-500">
                Scan and identify your plants 📱
              </p>
            </div>
          </div>
          {result && (
            <Button
              onClick={clearSelection}
              variant="outline"
              size="sm"
              className="shrink-0"
            >
              <span className="mr-1">🔄</span>
              New Scan
            </Button>
          )}
        </div>
        {!result && (
          <p className="text-sm text-slate-600 bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-center gap-2">
            <span className="text-lg">📸</span>
            Point your camera at a plant and tap scan to identify it
          </p>
        )}
      </header>

      {/* Main Scanning Area */}
      {!result && (
        <div className="flex-1 flex flex-col justify-center space-y-4">
          <Card className="shadow-sm border-0 bg-gradient-to-br from-white to-blue-50/30">
            <CardContent className="p-6">
              {!imagePreview ? (
                <div className="space-y-4">
                  {/* Camera Viewfinder */}
                  <div className="relative mx-auto max-w-sm">
                    <div className="relative w-full aspect-[3/4] bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl border-4 border-dashed border-blue-300 overflow-hidden">
                      {/* Viewfinder Corners */}
                      <div className="absolute top-4 left-4 w-8 h-8 border-t-4 border-l-4 border-blue-500 rounded-tl-lg"></div>
                      <div className="absolute top-4 right-4 w-8 h-8 border-t-4 border-r-4 border-blue-500 rounded-tr-lg"></div>
                      <div className="absolute bottom-4 left-4 w-8 h-8 border-b-4 border-l-4 border-blue-500 rounded-bl-lg"></div>
                      <div className="absolute bottom-4 right-4 w-8 h-8 border-b-4 border-r-4 border-blue-500 rounded-br-lg"></div>

                      {/* Center Plant Icon */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-100 to-emerald-50 border-4 border-green-300 flex items-center justify-center">
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
                    <div className="mt-3 text-center space-y-1">
                      <div className="text-base font-semibold text-slate-800">
                        {scanning ? "Position plant in frame" : "Ready to scan"}
                      </div>
                      <div className="text-xs text-slate-600">
                        {scanning
                          ? "Tap anywhere to capture"
                          : "Tap scan to start camera"}
                      </div>
                    </div>
                  </div>

                  {/* Scan Button */}
                  <div className="flex justify-center pt-2">
                    <Button
                      onClick={startScanning}
                      loading={scanning}
                      size="lg"
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold px-10 rounded-2xl shadow-lg"
                    >
                      {!scanning && <span className="mr-2 text-xl">📸</span>}
                      Scan Plant
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
                      <div className="text-lg font-semibold text-green-800">
                        Plant Captured!
                      </div>
                      <div className="text-sm text-green-600">
                        {imageSize
                          ? `Optimized: ${formatFileSize(imageSize)}`
                          : "Ready to identify"}
                      </div>
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
                      loading={loading}
                      className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold px-8"
                    >
                      {!loading && <span className="mr-2">🌱</span>}
                      Identify Plant
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
                    <div className="text-sm font-medium text-slate-700">
                      Analyzing your plant...
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 w-full rounded-full bg-gradient-to-r from-blue-100 to-cyan-100 overflow-hidden">
                      <div
                        className="h-2 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full animate-pulse"
                        style={{ width: "70%" }}
                      />
                    </div>
                    <div className="h-2 w-2/3 rounded-full bg-gradient-to-r from-blue-100 to-cyan-100 overflow-hidden mx-auto">
                      <div
                        className="h-2 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full animate-pulse"
                        style={{ width: "45%" }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Results Section */}
      {result && <ResultDisplay result={result} imagePreview={imagePreview} />}

      {/* Crop Modal */}
      {originalImage && (
        <ImageCropModal
          open={showCropModal}
          imageSrc={originalImage}
          onClose={handleCropCancel}
          onCropComplete={handleCropComplete}
        />
      )}
    </main>
  );
}
