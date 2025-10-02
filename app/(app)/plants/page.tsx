import Link from "next/link";

export default function PlantsPage() {
  return (
    <main className="p-4 sm:p-6 space-y-6 max-w-3xl mx-auto bg-gradient-to-b from-slate-50 to-white min-h-screen">
      <header className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-100 to-emerald-50 border border-green-300 flex items-center justify-center">
            <span className="text-2xl">🌱</span>
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-800">My Plants</h1>
            <p className="text-sm text-slate-500">Manage your plant collection 🌿</p>
          </div>
        </div>
        <p className="text-sm text-slate-600 bg-green-50 border border-green-200 rounded-xl p-3 flex items-center gap-2">
          <span className="text-lg">📋</span>
          Track and monitor all your plants in one place
        </p>
      </header>

      <div className="grid gap-4">
        {[1, 2, 3, 4].map((id) => (
          <Link 
            key={id} 
            href={`/plants/${id}`} 
            className="group rounded-2xl border border-slate-200 p-4 flex gap-4 items-center bg-gradient-to-r from-white to-green-50/30 shadow-sm hover:shadow-md transition-all duration-200 hover:border-green-200 hover:-translate-y-1"
          >
            <div className="relative">
              <img 
                src="/nanas.png" 
                alt="plant" 
                className="h-18 w-18 rounded-xl object-cover border border-slate-100" 
              />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full border-2 border-white flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <div className="font-semibold text-slate-800">Plant #{id}</div>
                <div className="text-xs font-medium text-slate-500 bg-gradient-to-r from-blue-100 to-cyan-50 px-2 py-1 rounded-full border border-blue-200">
                  {Math.round(60 + id * 10)}% Health
                </div>
              </div>
              <div className="mb-3">
                <div className="h-2 bg-gradient-to-r from-slate-100 to-slate-200 rounded-full overflow-hidden">
                  <div className="h-2 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full transition-all duration-300" style={{ width: `${60 + id * 10}%` }} />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-3 h-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="text-xs text-slate-500">Next hydration in {id} days</div>
              </div>
            </div>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}


