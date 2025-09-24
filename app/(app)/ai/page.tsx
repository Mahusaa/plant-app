import Link from "next/link";

export default function AIPage() {
  return (
    <main className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">AI Dashboard</h1>
      <div className="grid gap-3">
        {[1, 2, 3].map((id) => (
          <Link key={id} href={`/ai/${id}`} className="rounded-xl border p-4 bg-card shadow-sm">
            <div className="font-medium">Daisy #{id}</div>
            <div className="text-sm text-muted-foreground">Tap to ask AI</div>
          </Link>
        ))}
      </div>
    </main>
  );
}


