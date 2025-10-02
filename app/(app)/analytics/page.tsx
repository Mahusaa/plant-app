export default function AnalyticsPage() {
  const analyticsData = [
    { name: "Hydration", value: 85, emoji: "💧", color: "blue" },
    { name: "Light", value: 72, emoji: "☀️", color: "yellow" },
    { name: "Soil", value: 68, emoji: "🌱", color: "green" },
    { name: "Warnings", value: 15, emoji: "⚠️", color: "red" },
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case "blue":
        return "from-blue-50 to-cyan-50 border-blue-200";
      case "yellow":
        return "from-yellow-50 to-orange-50 border-yellow-200";
      case "green":
        return "from-green-50 to-emerald-50 border-green-200";
      case "red":
        return "from-red-50 to-pink-50 border-red-200";
      default:
        return "from-slate-50 to-slate-100 border-slate-200";
    }
  };

  const getProgressColor = (color: string) => {
    switch (color) {
      case "blue":
        return "from-blue-400 to-cyan-400";
      case "yellow":
        return "from-yellow-400 to-orange-400";
      case "green":
        return "from-green-400 to-emerald-400";
      case "red":
        return "from-red-400 to-pink-400";
      default:
        return "from-slate-400 to-slate-500";
    }
  };

  return (
    <main className="p-4 sm:p-6 space-y-6 max-w-3xl mx-auto bg-gradient-to-b from-slate-50 to-white min-h-screen">
      <header className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-100 to-pink-50 border border-purple-300 flex items-center justify-center">
            <span className="text-2xl">📊</span>
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-800">AI Analytics</h1>
            <p className="text-sm text-slate-500">Smart insights for your plants 🤖</p>
          </div>
        </div>
        <p className="text-sm text-slate-600 bg-purple-50 border border-purple-200 rounded-xl p-3 flex items-center gap-2">
          <span className="text-lg">📈</span>
          Track performance metrics and get AI-powered recommendations
        </p>
      </header>

      <div className="grid grid-cols-2 gap-4">
        {analyticsData.map((item) => (
          <div 
            key={item.name} 
            className={`rounded-2xl p-4 bg-gradient-to-br ${getColorClasses(item.color)} border shadow-sm hover:shadow-md transition-all duration-200`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">{item.emoji}</span>
                <div className="text-sm font-medium text-slate-700">{item.name}</div>
              </div>
              <div className="text-xl font-bold text-slate-800">{item.value}%</div>
            </div>
            <div className="w-full bg-gradient-to-r from-slate-100 to-slate-200 rounded-full h-2 overflow-hidden">
              <div 
                className={`h-2 bg-gradient-to-r ${getProgressColor(item.color)} rounded-full transition-all duration-500`} 
                style={{ width: `${item.value}%` }} 
              />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}


