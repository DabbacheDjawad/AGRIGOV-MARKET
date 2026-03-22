import type { AgMetric } from "../../types/Weather";
import { agMetrics, currentConditions } from "../../types/Weather";

function MetricTile({ metric }: { metric: AgMetric }) {
  return (
    <div className="bg-background-light dark:bg-background-dark/50 p-3 rounded-lg border border-gray-100 dark:border-primary/10">
      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
        {metric.label}
      </p>
      <div className="flex items-end gap-2">
        <span className={`text-xl font-bold ${metric.highlight ? "text-primary" : "text-gray-900 dark:text-white"}`}>
          {metric.value}
        </span>
        {(metric.unit || metric.subLabel) && (
          <span className="text-xs text-gray-400 mb-1">{metric.subLabel ?? metric.unit}</span>
        )}
      </div>

      {metric.barPct !== undefined && metric.barColor ? (
        <div className="w-full bg-gray-700 h-1 mt-2 rounded-full overflow-hidden">
          <div className={`h-full rounded-full ${metric.barColor}`} style={{ width: `${metric.barPct}%` }} />
        </div>
      ) : metric.id === "wind" ? (
        <div className="flex items-center gap-1 mt-2">
          <span className="material-icons text-xs text-primary rotate-45">arrow_upward</span>
          <span className="text-[10px] text-gray-400">{metric.subLabel}</span>
        </div>
      ) : null}
    </div>
  );
}

export default function CurrentConditionsCard() {
  return (
    <div className="bg-white dark:bg-surface-dark rounded-xl p-6 border border-gray-200 dark:border-primary/20 relative overflow-hidden group">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
        <span className="material-icons text-9xl text-primary">cloud</span>
      </div>

      <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center md:items-start">
        {/* Temperature */}
        <div className="text-center md:text-left shrink-0">
          <div className="flex items-center justify-center md:justify-start">
            <span className="text-6xl md:text-7xl font-bold text-gray-900 dark:text-white">
              {currentConditions.tempC}°
            </span>
            <span className="text-2xl text-gray-400 self-start mt-2">C</span>
          </div>
          <p className="text-xl font-medium mt-2 flex items-center gap-2 justify-center md:justify-start">
            <span className="material-icons text-primary">{currentConditions.icon}</span>
            {currentConditions.condition}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Feels like {currentConditions.feelsLikeC}°C
          </p>
        </div>

        {/* Metrics grid */}
        <div className="grow grid grid-cols-2 md:grid-cols-3 gap-4 w-full">
          {agMetrics.map((m) => <MetricTile key={m.id} metric={m} />)}
        </div>
      </div>
    </div>
  );
}