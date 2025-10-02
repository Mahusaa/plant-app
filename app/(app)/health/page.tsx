"use client";

import { useState, ChangeEvent } from "react";
import { healthAdviceAction } from "@/actions/health";
import { readStreamableValue } from "@ai-sdk/rsc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const maxDuration = 30;

export default function HealthPage() {
  const [prompt, setPrompt] = useState("");
  const [context, setContext] = useState("");
  const [imageBase64, setImageBase64] = useState<string | undefined>(undefined);
  const [generation, setGeneration] = useState<string>("");
  const [loading, setLoading] = useState(false);

  function handleImageUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageBase64(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  async function onSubmit() {
    if (!prompt.trim() && !imageBase64 && !context.trim()) return;

    setLoading(true);
    setGeneration(""); // reset previous output

    try {
      const { output } = await healthAdviceAction({
        prompt,
        imageBase64,
      });

      for await (const delta of readStreamableValue(output)) {
        setGeneration((current) => `${current}${delta}`);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="p-4 sm:p-6 space-y-6 max-w-3xl mx-auto bg-gradient-to-b from-slate-50 to-white min-h-screen">
      <header className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-100 to-pink-50 border border-purple-300 flex items-center justify-center">
            <span className="text-2xl">🏥</span>
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Health Check</h1>
            <p className="text-sm text-slate-500">Get expert advice for your plants 🌿</p>
          </div>
        </div>
        <p className="text-sm text-slate-600 bg-purple-50 border border-purple-200 rounded-xl p-3 flex items-center gap-2">
          <span className="text-lg">💡</span>
          Describe symptoms, upload photos, or ask questions about your plant's health
        </p>
      </header>

      <Card className="shadow-sm border-0 bg-gradient-to-br from-white to-purple-50/30">
        <CardHeader className="py-4">
          <CardTitle className="text-base sm:text-lg flex items-center gap-2">
            <span className="text-lg">💬</span>
            Ask for Health Advice
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-4">
            {/* Prompt */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <span>📝</span>
                Describe Symptoms
              </label>
              <input
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe symptoms, sensor readings, or concerns..."
                className="h-11 rounded-xl border border-purple-200 px-4 bg-gradient-to-r from-purple-50/50 to-white focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all"
              />
            </div>

            {/* Context */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <span>📋</span>
                Additional Context
              </label>
              <textarea
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder="Additional context (medical history, lifestyle, etc.)"
                className="h-20 rounded-xl border border-purple-200 px-4 py-3 bg-gradient-to-r from-purple-50/50 to-white focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all resize-none"
              />
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <span>📸</span>
                Upload Photo (Optional)
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-medium file:bg-gradient-to-r file:from-blue-100 file:to-cyan-50 file:text-blue-700 hover:file:from-blue-200 hover:file:to-cyan-100 file:border file:border-blue-200"
                />
              </div>
              {imageBase64 && (
                <div className="mt-3">
                  <div className="text-sm text-slate-600 mb-2 flex items-center gap-2">
                    <span>🖼️</span>
                    <span>Uploaded Image</span>
                  </div>
                  <div className="relative w-32 h-32 overflow-hidden rounded-xl border border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
                    <img
                      src={imageBase64}
                      alt="Uploaded"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
            </div>

            <Button 
              onClick={onSubmit} 
              disabled={loading}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold px-6 py-3 rounded-xl"
            >
              {loading ? (
                <>
                  <span className="mr-2">🤔</span>
                  Analyzing...
                </>
              ) : (
                <>
                  <span className="mr-2">💡</span>
                  Get Health Advice
                </>
              )}
            </Button>
          </div>

          {generation && (
            <div className="mt-6">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
                    <span className="text-lg">🤖</span>
                  </div>
                  <span className="font-semibold text-green-800">AI Health Advisor</span>
                </div>
                <div className="whitespace-pre-wrap leading-relaxed text-sm text-green-700 bg-white/50 rounded-lg p-3 border border-green-100">
                  {generation}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
