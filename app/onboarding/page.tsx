"use client";

import { useState } from "react";
import Link from "next/link";

export default function Onboarding() {
  const [step, setStep] = useState(1);

  return (
    <main className="min-h-dvh p-6 flex flex-col">
      {step === 1 && (
        <section className="flex-1 flex flex-col items-center justify-center text-center gap-6">
          <div className="mx-auto h-16 w-16 rounded-full bg-secondary flex items-center justify-center">
            <img src="/plantapp-logo.png" alt="Plant Care" className="h-10 w-10 object-contain" />
          </div>
          <h1 className="text-4xl [font-family:var(--font-instrument-serif)]">Plant Care</h1>
          <p className="text-sm text-muted-foreground max-w-xs">Smart reminders and AI insights to keep your plants thriving.</p>
          <button onClick={() => setStep(2)} className="inline-flex h-12 items-center justify-center rounded-full bg-primary text-primary-foreground px-6 shadow-sm active:opacity-95">
            Get Started
          </button>
        </section>
      )}

      {step === 2 && (
        <section className="flex-1 flex flex-col justify-center gap-5">
          <h2 className="text-2xl font-semibold">What you can do</h2>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li>• Identify plants and check health with your camera.</li>
            <li>• Get hydration reminders and track growth.</li>
            <li>• See metrics like light, water level, and soil condition.</li>
            <li>• Ask AI for personalized care tips and warnings.</li>
          </ul>
          <div className="mt-6 flex gap-3">
            <button onClick={() => setStep(1)} className="h-10 px-4 rounded-full bg-muted">Back</button>
            <button onClick={() => setStep(3)} className="h-10 px-4 rounded-full bg-primary text-primary-foreground">Continue</button>
          </div>
        </section>
      )}

      {step === 3 && (
        <section className="flex-1 flex flex-col justify-center gap-5">
          <h2 className="text-2xl font-semibold">Create your account</h2>
          <form className="space-y-3">
            <input type="email" placeholder="Email" className="w-full h-11 rounded-md border px-3 bg-background" />
            <input type="password" placeholder="Password" className="w-full h-11 rounded-md border px-3 bg-background" />
            <button type="submit" className="w-full h-11 rounded-md bg-primary text-primary-foreground">Continue</button>
          </form>
          <button className="w-full h-11 rounded-md bg-muted">Continue with Google</button>
          <div className="text-xs text-muted-foreground">By continuing you agree to our terms.</div>
          <div className="mt-4">
            <Link href="/dashboard" className="text-sm underline">Skip for now</Link>
          </div>
        </section>
      )}
    </main>
  );
}


