import Link from "next/link";

function Metric({ label, value, advice }: { label: string; value: number; advice: string }) {
  const high = value >= 70;
  return (
    <div className="rounded-xl border p-4 bg-card">
      <div className="flex items-baseline justify-between">
        <div className="text-sm text-muted-foreground">{label}</div>
        <div className="text-2xl font-semibold">{value}%</div>
      </div>
        <div className="h-2 bg-muted rounded-full mt-3">
        <div className="h-2 bg-primary rounded-full" style={{ width: `${value}%` }} />
      </div>
      <div className="text-xs text-muted-foreground mt-2">{advice}</div>
    </div>
  );
}

export default function PlantDetailPage() {
  return (
    <main className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/plants" className="h-9 w-9 rounded-full bg-muted flex items-center justify-center">←</Link>
        <h1 className="text-xl font-semibold">Daisy</h1>
      </div>

      <div className="flex items-center justify-center">
        <img src="/bougenvile.png" alt="plant" className="h-48 w-48 object-contain" />
      </div>

      <div className="text-center">
        <div className="text-sm text-muted-foreground">Next hydration</div>
        <div className="text-lg font-medium">in 2 days</div>
      </div>

      <section className="grid grid-cols-1 gap-3">
        <Metric label="Light" value={82} advice="Light is above threshold, consider partial shade." />
        <Metric label="Water Level" value={35} advice="Water level is below threshold, water today." />
        <Metric label="Soil" value={58} advice="Soil condition near threshold, monitor moisture." />
      </section>
    </main>
  );
}


