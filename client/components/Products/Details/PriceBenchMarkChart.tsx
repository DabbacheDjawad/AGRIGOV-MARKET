import type { ChartBar } from "@/types/ProductDetails";

interface Props {
  bars: ChartBar[];
  benchmarkLabel: string;
}

export default function PriceBenchmarkChart({ bars, benchmarkLabel }: Props) {
  return (
    <div className="bg-neutral-surface dark:bg-neutral-surface-dark rounded-xl shadow-sm border border-neutral-border dark:border-neutral-border-dark p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Price Benchmark Analysis
          </h3>
          <p className="text-sm text-gray-500">Comparing listing price vs. National Average</p>
        </div>
        <div className="bg-primary-light dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-bold px-3 py-1 rounded-full border border-green-200 dark:border-green-800 shrink-0 ml-4">
          {benchmarkLabel}
        </div>
      </div>

      {/* Bar chart */}
      <div className="relative h-48 w-full mt-4 flex items-end justify-between gap-2 px-2">
        {/* Grid lines */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="border-t border-gray-100 dark:border-gray-800 w-full h-0" />
          ))}
        </div>

        {/* National average dashed line at 1/3 height */}
        <div className="absolute top-1/3 left-0 right-0 border-t-2 border-dashed border-gray-400 z-10 opacity-50" />
        <div className="absolute top-[30%] right-0 bg-gray-100 dark:bg-gray-700 text-[10px] px-1 rounded text-gray-500">
          Nat&apos;l Avg
        </div>

        {/* Bars */}
        {bars.map((bar) => (
          <div
            key={bar.label}
            className={`w-full rounded-t-sm relative group transition-all ${
              bar.highlighted
                ? "bg-primary shadow-[0_0_15px_rgba(13,242,13,0.3)]"
                : "bg-gray-200 dark:bg-gray-700"
            }`}
            style={{ height: `${bar.heightPct}%` }}
          >
            {bar.tooltip && (
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-white text-xs font-bold py-1 px-2 rounded whitespace-nowrap">
                {bar.tooltip}
              </div>
            )}
            {!bar.highlighted && bar.label && (
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                {bar.label}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-between mt-2 text-xs text-gray-400">
        <span>4 Weeks Ago</span>
        <span>Today</span>
      </div>
    </div>
  );
}