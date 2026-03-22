import { soilMoistureBars, sprayingConditions } from "../../types/Weather";

function SoilMoistureChart() {
  return (
    <div className="bg-white dark:bg-surface-dark rounded-xl p-6 border border-gray-200 dark:border-primary/20">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg">Soil Moisture Trend</h3>
        <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded">Last 24h</span>
      </div>

      <div className="h-40 w-full relative flex items-end justify-between px-2 gap-1">
        {soilMoistureBars.map((bar, i) => (
          <div
            key={i}
            className={`flex-1 ${bar.opacityClass} rounded-t min-w-0`}
            style={{ height: `${bar.heightPct}%` }}
          />
        ))}
      </div>

      <div className="flex justify-between mt-2 text-xs text-gray-500">
        <span>12 AM</span>
        <span>6 AM</span>
        <span>12 PM</span>
        <span>Now</span>
      </div>

      <p className="text-xs text-gray-400 mt-4">
        Moisture decreasing due to wind. Irrigation recommended if levels drop below 35%.
      </p>
    </div>
  );
}

function SprayingConditionsCard() {
  return (
    <div className="bg-white dark:bg-surface-dark rounded-xl p-6 border border-gray-200 dark:border-primary/20">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg">Spraying Conditions</h3>
        <span className="text-xs text-white bg-green-600 px-2 py-1 rounded">Optimal Now</span>
      </div>

      <div className="space-y-4">
        {sprayingConditions.map((c) => (
          <div key={c.id}>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-400">{c.label}</span>
              <span className={`font-bold ${c.statusColor}`}>{c.status}</span>
            </div>
            <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${c.barColor}`}
                style={{ width: `${c.barPct}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-400 mt-4">
        Next optimal window closes at 15:00 due to rising wind speeds.
      </p>
    </div>
  );
}

export default function DeepDiveCharts() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <SoilMoistureChart />
      <SprayingConditionsCard />
    </div>
  );
}