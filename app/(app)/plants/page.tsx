import Link from "next/link";

export default function PlantsPage() {
  return (
    <main className="p-6 space-y-4">
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-semibold">Plant List</h1>
      </div>

      <div className="grid gap-3">
        {[1, 2, 3, 4].map((id) => (
          <Link key={id} href={`/plants/${id}`} className="rounded-xl border p-3 flex gap-3 items-center bg-card shadow-sm">
            <img src="/nanas.png" alt="plant" className="h-16 w-16 rounded-md object-cover" />
            <div className="flex-1">
              <div className="font-medium">Plant #{id}</div>
              <div className="text-xs text-muted-foreground">Next hydration in {id} days</div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}


