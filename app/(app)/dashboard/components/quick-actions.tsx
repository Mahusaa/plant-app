import Link from "next/link";

function ActionCard({
  title,
  emoji,
  href,
  color = "blue",
}: {
  title: string;
  emoji: string;
  href: string;
  color?: "blue" | "purple";
}) {
  const colorClasses = {
    blue: {
      gradient: "from-blue-50 to-cyan-50",
      border: "border-blue-200",
      hover: "hover:border-blue-300 hover:shadow-sm",
      text: "text-blue-900",
    },
    purple: {
      gradient: "from-purple-50 to-pink-50",
      border: "border-purple-200",
      hover: "hover:border-purple-300 hover:shadow-sm",
      text: "text-purple-900",
    },
  };

  const style = colorClasses[color];

  return (
    <Link href={href} className="block">
      <div
        className={`group rounded-xl border py-3 px-3 bg-gradient-to-br ${style.gradient} ${style.border} ${style.hover} transition-all duration-200 active:scale-95 relative overflow-hidden`}
      >
        <div className="relative flex items-center gap-2.5">
          <div className="text-2xl group-hover:scale-110 transition-transform duration-200">
            {emoji}
          </div>
          <h3 className={`font-semibold text-sm ${style.text} flex-1`}>
            {title}
          </h3>
          <svg
            className={`w-4 h-4 ${style.text} opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>
    </Link>
  );
}

export default function QuickActions() {
  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2">
        <h2 className="text-base font-semibold text-slate-700">
          Quick Actions
        </h2>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <ActionCard
          title="Identify Plant"
          emoji="🔍"
          href="/identify"
          color="blue"
        />
        <ActionCard
          title="Health Check"
          emoji="💚"
          href="/health"
          color="purple"
        />
      </div>
    </section>
  );
}
