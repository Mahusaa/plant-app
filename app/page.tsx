import Link from "next/link";

export default function Home() {
  return (
    <main className="relative min-h-dvh p-6 flex flex-col items-center justify-center text-center gap-8 overflow-hidden">
      {/* Soft background accents */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[8%] h-72 w-72 -translate-x-1/2 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute right-[-10%] bottom-[10%] h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
      </div>

      <div className="space-y-3">
        <div className="mx-auto h-16 w-16 rounded-full bg-secondary flex items-center justify-center shadow-sm">
          <img src="/plantapp-logo.png" alt="Plant Care" className="h-10 w-10 object-contain" />
        </div>
        <h1 className="text-4xl [font-family:var(--font-instrument-serif)]">Plant Care</h1>
        <p className="text-sm text-muted-foreground max-w-xs mx-auto">Keep your plants healthy with smart reminders and AI insights.</p>
      </div>
      <Link href="/onboarding" className="inline-flex h-12 items-center justify-center rounded-full bg-primary text-primary-foreground px-6 shadow-sm active:opacity-95">
        Get Started
      </Link>
    </main>
  );
}
