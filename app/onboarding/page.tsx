"use client";

import { useState } from "react";
import Link from "next/link";

export default function Onboarding() {
  const [step, setStep] = useState(1);

  return (
    <main className="min-h-dvh bg-gradient-to-b from-slate-50 to-white flex flex-col">
      {step === 1 && (
        <section className="flex-1 flex flex-col items-center justify-center text-center gap-6 px-6">
          {/* Decorative background */}
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute left-1/2 top-[15%] h-80 w-80 -translate-x-1/2 rounded-full bg-gradient-to-br from-green-200/30 to-emerald-100/30 blur-3xl" />
            <div className="absolute right-[-10%] bottom-[20%] h-64 w-64 rounded-full bg-gradient-to-br from-blue-200/20 to-cyan-100/20 blur-3xl" />
          </div>

          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-green-100 to-emerald-50 border-2 border-green-300 flex items-center justify-center shadow-lg">
            <span className="text-4xl">🌱</span>
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-slate-800 [font-family:var(--font-instrument-serif)]">Plant Care</h1>
            <p className="text-sm text-slate-600 max-w-xs">Smart IoT monitoring and AI insights to keep your plants thriving.</p>
          </div>
          <button
            onClick={() => setStep(2)}
            className="inline-flex h-12 items-center justify-center rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold px-8 shadow-lg active:opacity-95"
          >
            <span className="mr-2">🚀</span>
            Get Started
          </button>
        </section>
      )}

      {step === 2 && (
        <section className="flex-1 flex flex-col justify-center gap-6 px-6 max-w-lg mx-auto">
          <div className="space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-100 to-cyan-50 border border-blue-300 flex items-center justify-center">
              <span className="text-2xl">✨</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-800">What you can do</h2>
          </div>

          <div className="space-y-3">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
              <span className="text-2xl">🔍</span>
              <div>
                <div className="font-semibold text-green-800 text-sm">Identify Plants</div>
                <div className="text-xs text-green-700 mt-1">Scan and identify plants with AI-powered camera</div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
              <span className="text-2xl">📊</span>
              <div>
                <div className="font-semibold text-blue-800 text-sm">IoT Monitoring</div>
                <div className="text-xs text-blue-700 mt-1">Track light, soil moisture, and water levels in real-time</div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-4 flex items-start gap-3">
              <span className="text-2xl">💧</span>
              <div>
                <div className="font-semibold text-yellow-800 text-sm">Smart Reminders</div>
                <div className="text-xs text-yellow-700 mt-1">Get hydration alerts and track plant growth</div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-4 flex items-start gap-3">
              <span className="text-2xl">🤖</span>
              <div>
                <div className="font-semibold text-purple-800 text-sm">AI Health Check</div>
                <div className="text-xs text-purple-700 mt-1">Ask AI for personalized care tips and warnings</div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-4">
            <button
              onClick={() => setStep(1)}
              className="h-11 px-6 rounded-xl bg-gradient-to-r from-slate-100 to-slate-200 border border-slate-300 text-slate-700 font-medium hover:from-slate-200 hover:to-slate-300"
            >
              Back
            </button>
            <button
              onClick={() => setStep(3)}
              className="flex-1 h-11 px-6 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold shadow-lg"
            >
              Continue
            </button>
          </div>
        </section>
      )}

      {step === 3 && (
        <section className="flex-1 flex flex-col justify-center gap-6 px-6 max-w-lg mx-auto">
          <div className="space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-100 to-emerald-50 border border-green-300 flex items-center justify-center">
              <span className="text-2xl">👤</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Create your account</h2>
            <p className="text-sm text-slate-600">Join the plant care community</p>
          </div>

          <form className="space-y-3">
            <div>
              <label className="text-xs text-slate-600 font-medium mb-1 block">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full h-12 rounded-xl border border-slate-300 px-4 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-slate-600 font-medium mb-1 block">Password</label>
              <input
                type="password"
                placeholder="Create a password"
                className="w-full h-12 rounded-xl border border-slate-300 px-4 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
              />
            </div>
            <button
              type="submit"
              className="w-full h-12 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold shadow-lg"
            >
              Create Account
            </button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-300"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-2 text-slate-500">or</span>
            </div>
          </div>

          <button className="w-full h-12 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium flex items-center justify-center gap-2 shadow-sm">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <div className="text-xs text-center text-slate-500">
            By continuing you agree to our{" "}
            <span className="text-green-600 underline">Terms of Service</span>
            {" "}and{" "}
            <span className="text-green-600 underline">Privacy Policy</span>
          </div>

          <div className="text-center">
            <Link href="/dashboard" className="text-sm text-slate-600 hover:text-green-600 font-medium">
              Skip for now →
            </Link>
          </div>
        </section>
      )}
    </main>
  );
}


