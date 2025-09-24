export default function AnalyticsPage() {
  return (
    <main className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">AI Analytics</h1>
      <div className="grid grid-cols-2 gap-3">
        {["Hydration", "Light", "Soil", "Warnings"].map((t, i) => (
          <div key={t} className="rounded-xl p-4 bg-gradient-to-br from-primary/10 to-accent/10 border shadow-sm">
            <div className="text-sm text-muted-foreground">{t}</div>
            <div className="text-2xl font-semibold">{Math.round(40 + i * 15)}%</div>
          </div>
        ))}
      </div>
    </main>
  );
}


