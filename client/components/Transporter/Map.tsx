import type { MapPin, StatsWidget } from "@/types/Transporter";

interface Props {
  pins: MapPin[];
  stats: StatsWidget[];
}

export default function MapView({ pins, stats }: Props) {
  return (
    <section className="flex-1 relative bg-slate-50 dark:bg-slate-900 overflow-hidden">
      {/* Grid pattern background */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundColor: "var(--map-bg, #e5e7eb)",
          backgroundImage:
            "linear-gradient(#d1d5db 1px, transparent 1px), linear-gradient(90deg, #d1d5db 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Abstract map elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Roads */}
        <div className="absolute top-1/4 left-0 w-full h-2 bg-white dark:bg-slate-700 shadow-sm rotate-3 transform translate-y-12" />
        <div className="absolute top-0 left-1/3 h-full w-3 bg-white dark:bg-slate-700 shadow-sm -rotate-12" />
        {/* River */}
        <div className="absolute top-2/3 left-0 w-full h-12 bg-blue-100 dark:bg-blue-900/20 blur-sm transform -skew-y-3" />

        {/* Map pins */}
        {pins.map((pin) => {
          if (pin.variant === "pickup") {
            return (
              <div
                key={pin.id}
                className="absolute group cursor-pointer z-10"
                style={{
                  top: `${pin.topPct}%`,
                  left: `${pin.leftPct}%`,
                  transform: "translate(-50%, -100%)",
                }}
              >
                <div className="relative flex flex-col items-center">
                  {/* Tooltip */}
                  <div className="bg-white dark:bg-slate-800 px-3 py-1.5 rounded-lg shadow-lg mb-2 whitespace-nowrap border border-slate-200 dark:border-slate-600 opacity-0 group-hover:opacity-100 transition-opacity absolute -top-10 left-1/2 -translate-x-1/2">
                    <p className="text-xs font-bold">{pin.label}</p>
                    <p className="text-[10px] text-slate-500">{pin.sublabel}</p>
                  </div>
                  <div className="w-10 h-10 bg-slate-800 dark:bg-slate-100 rounded-full flex items-center justify-center shadow-xl ring-4 ring-white dark:ring-slate-800 z-10">
                    <span className="material-icons text-white dark:text-slate-800">agriculture</span>
                  </div>
                  <div className="w-2 h-8 bg-slate-800 dark:bg-slate-100 rounded-full -mt-2.5" />
                  <div className="w-8 h-2 bg-black/20 rounded-[100%] blur-sm -mt-0.5" />
                </div>
              </div>
            );
          }

          if (pin.variant === "dropoff") {
            return (
              <div
                key={pin.id}
                className="absolute group cursor-pointer z-10"
                style={{
                  top: `${pin.topPct}%`,
                  left: `${pin.leftPct}%`,
                  transform: "translate(-50%, -100%)",
                }}
              >
                <div className="relative flex flex-col items-center">
                  <div className="bg-white dark:bg-slate-800 px-3 py-1.5 rounded-lg shadow-lg mb-2 whitespace-nowrap border border-slate-200 dark:border-slate-600 opacity-0 group-hover:opacity-100 transition-opacity absolute -top-10 left-1/2 -translate-x-1/2">
                    <p className="text-xs font-bold">{pin.label}</p>
                    <p className="text-[10px] text-slate-500">{pin.sublabel}</p>
                  </div>
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center shadow-xl ring-4 ring-white dark:ring-slate-800 z-10 animate-bounce">
                    <span className="material-icons text-black font-bold">place</span>
                  </div>
                  <div className="w-2 h-8 bg-primary rounded-full -mt-2.5" />
                  <div className="w-8 h-2 bg-primary/40 rounded-[100%] blur-sm -mt-0.5" />
                </div>
              </div>
            );
          }

          // Available pins
          return (
            <div
              key={pin.id}
              className="absolute scale-75 opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
              style={{ top: `${pin.topPct}%`, left: `${pin.leftPct}%` }}
            >
              <div className="w-8 h-8 bg-slate-400 rounded-full flex items-center justify-center shadow-md border-2 border-white">
                <span className="material-icons text-white text-sm">agriculture</span>
              </div>
            </div>
          );
        })}

        {/* SVG connecting route line */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
          <path
            d="M 40% 30% Q 50% 40% 58% 55%"
            fill="none"
            stroke="#0df20d"
            strokeDasharray="8 4"
            strokeWidth="4"
            className="opacity-80"
          />
          <circle
            cx="49%"
            cy="42.5%"
            r="4"
            fill="white"
            stroke="#0df20d"
            strokeWidth="2"
          />
        </svg>
      </div>

      {/* Stats widgets */}
      <div className="absolute top-6 right-6 z-10 flex flex-col gap-3">
        {stats.map((widget) => (
          <div
            key={widget.id}
            className="bg-white dark:bg-[#1a2e1a] rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 p-4 min-w-50"
          >
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              {widget.label}
            </p>
            <div className="flex items-end gap-2">
              <span className="text-2xl font-bold text-slate-800 dark:text-white">
                {widget.value}
              </span>
              {widget.badge && (
                <span className={`text-xs font-bold mb-1 ${widget.badgeColor}`}>
                  {widget.badge}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}