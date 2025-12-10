"use client";

import Link from "next/link";
import { useState } from "react";

export default function Onboarding() {
  const [step, setStep] = useState(1);

  return (
    <main className="min-h-dvh bg-gradient-to-b from-slate-50 to-white flex flex-col">
      {step === 1 && (
        <section className="flex-1 flex flex-col justify-center gap-6 px-6 max-w-lg mx-auto">
          <div className="space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-100 to-cyan-50 border border-blue-300 flex items-center justify-center">
              <span className="text-2xl">✨</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-800">
              What you can do
            </h2>
          </div>

          <div className="space-y-3">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
              <span className="text-2xl">🔍</span>
              <div>
                <div className="font-semibold text-green-800 text-sm">
                  Identify Plants
                </div>
                <div className="text-xs text-green-700 mt-1">
                  Scan and identify plants with AI-powered camera
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
              <span className="text-2xl">📊</span>
              <div>
                <div className="font-semibold text-blue-800 text-sm">
                  IoT Monitoring
                </div>
                <div className="text-xs text-blue-700 mt-1">
                  Track light, soil moisture, and water levels in real-time
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-4 flex items-start gap-3">
              <span className="text-2xl">💧</span>
              <div>
                <div className="font-semibold text-yellow-800 text-sm">
                  Smart Reminders
                </div>
                <div className="text-xs text-yellow-700 mt-1">
                  Get hydration alerts and track plant growth
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-4 flex items-start gap-3">
              <span className="text-2xl">🤖</span>
              <div>
                <div className="font-semibold text-purple-800 text-sm">
                  AI Health Check
                </div>
                <div className="text-xs text-purple-700 mt-1">
                  Ask AI for personalized care tips and warnings
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-4">
            <Link
              href="/"
              className="h-11 px-6 rounded-xl bg-gradient-to-r from-slate-100 to-slate-200 border border-slate-300 text-slate-700 font-medium hover:from-slate-200 hover:to-slate-300 flex items-center justify-center"
            >
              Back
            </Link>
            <button
              onClick={() => setStep(2)}
              className="flex-1 h-11 px-6 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold shadow-lg"
            >
              Continue
            </button>
          </div>
        </section>
      )}

      {step === 2 && (
        <section className="flex-1 flex flex-col justify-center gap-6 px-6 max-w-lg mx-auto">
          <div className="space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-100 to-emerald-50 border border-green-300 flex items-center justify-center">
              <span className="text-2xl">👤</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-800">
              Ready to get started?
            </h2>
            <p className="text-sm text-slate-600">
              Create an account or sign in to continue
            </p>
          </div>

          <div className="space-y-3">
            <Link
              href="/signup"
              className="w-full h-12 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold shadow-lg flex items-center justify-center"
            >
              Create Account
            </Link>

            <Link
              href="/login"
              className="w-full h-12 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium flex items-center justify-center shadow-sm"
            >
              Sign In
            </Link>
          </div>

          <div className="text-xs text-center text-slate-500">
            By continuing you agree to our{" "}
            <span className="text-green-600 underline">Terms of Service</span>{" "}
            and <span className="text-green-600 underline">Privacy Policy</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <button
              onClick={() => setStep(1)}
              className="text-slate-600 hover:text-green-600 font-medium"
            >
              ← Back
            </button>
          </div>
        </section>
      )}
    </main>
  );
}
