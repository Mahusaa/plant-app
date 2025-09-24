export default function HistoryPage() {
  return (
    <main className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">History</h1>
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-xl border p-3 bg-card shadow-sm">
            <div className="text-sm">Watered Daisy</div>
            <div className="text-xs text-muted-foreground">{i} days ago</div>
          </div>
        ))}
      </div>
    </main>
  );
}


