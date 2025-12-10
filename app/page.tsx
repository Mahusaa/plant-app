import Link from "next/link";

export default function Home() {
  return (
    <main className="relative min-h-dvh bg-gradient-to-b from-slate-50 to-white flex flex-col items-center justify-center text-center gap-8 overflow-hidden px-6">
      {/* Soft background accents */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[10%] h-80 w-80 -translate-x-1/2 rounded-full bg-gradient-to-br from-green-200/30 to-emerald-100/30 blur-3xl" />
        <div className="absolute right-[-10%] bottom-[15%] h-72 w-72 rounded-full bg-gradient-to-br from-blue-200/20 to-cyan-100/20 blur-3xl" />
      </div>

      <div className="space-y-6">
        <div className="mx-auto w-24 h-24 rounded-3xl bg-gradient-to-br from-green-100 to-emerald-50 border-2 border-green-300 flex items-center justify-center shadow-xl">
          <span className="text-5xl">🌿</span>
        </div>
        <div className="space-y-2">
          <h1 className="text-5xl font-bold text-slate-800 [font-family:var(--font-instrument-serif)]">
            Plant Care
          </h1>
          <p className="text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
            Keep your plants healthy with smart IoT monitoring and AI-powered
            insights.
          </p>
        </div>

        {/* Feature highlights */}
        <div className="flex items-center justify-center gap-4 text-xs text-slate-600 max-w-md mx-auto">
          <div className="flex items-center gap-1">
            <span className="text-base">📊</span>
            <span>IoT Sensors</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-base">🤖</span>
            <span>AI Analysis</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-base">💧</span>
            <span>Auto Care</span>
          </div>
        </div>
      </div>

      <Link
        href="/onboarding"
        className="inline-flex h-14 items-center justify-center rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold px-10 shadow-xl active:opacity-95 transition-all"
      >
        <span className="mr-2">🚀</span>
        Get Started
      </Link>

      <div className="text-xs text-slate-500">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-green-600 font-medium hover:underline"
        >
          Sign in
        </Link>
      </div>
    </main>
  );
}
