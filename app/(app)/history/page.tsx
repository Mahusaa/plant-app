import { Card } from "@/components/ui/card";

export default function HistoryPage() {
  const historyData = [
    {
      action: "Watered Daisy",
      time: "2 hours ago",
      emoji: "💧",
      color: "blue",
    },
    {
      action: "Checked Light Levels",
      time: "1 day ago",
      emoji: "☀️",
      color: "yellow",
    },
    {
      action: "Added Fertilizer",
      time: "3 days ago",
      emoji: "🌱",
      color: "green",
    },
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case "blue":
        return "from-blue-50 to-cyan-50 border-blue-200";
      case "yellow":
        return "from-yellow-50 to-orange-50 border-yellow-200";
      case "green":
        return "from-green-50 to-emerald-50 border-green-200";
      default:
        return "from-slate-50 to-slate-100 border-slate-200";
    }
  };

  return (
    <main className="p-4 sm:p-6 space-y-6 max-w-3xl mx-auto bg-gradient-to-b from-slate-50 to-white min-h-screen">
      <header className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-yellow-100 to-orange-50 border border-yellow-300 flex items-center justify-center">
            <span className="text-2xl">📜</span>
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-800">
              History
            </h1>
            <p className="text-sm text-slate-500">
              Track your plant care activities 📝
            </p>
          </div>
        </div>
        <p className="text-sm text-slate-600 bg-yellow-50 border border-yellow-200 rounded-xl p-3 flex items-center gap-2">
          <span className="text-lg">⏰</span>
          Keep track of all your plant care activities and maintenance history
        </p>
      </header>

      <div className="space-y-4">
        {historyData.map((item, i) => (
          <Card
            key={i}
            className={`p-4 shadow-sm bg-gradient-to-r ${getColorClasses(item.color)} border hover:shadow-md transition-all duration-200`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/50 border border-white/50 flex items-center justify-center">
                <span className="text-lg">{item.emoji}</span>
              </div>
              <div className="flex-1">
                <div className="font-medium text-slate-800">{item.action}</div>
                <div className="text-sm text-slate-600">{item.time}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </main>
  );
}
