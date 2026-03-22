import type { ForecastDay } from "../../types/Weather";
import { forecast } from "../../types/Weather";

function DayCard({ day }: { day: ForecastDay }) {
  return (
    <div
      className={`flex flex-col items-center rounded-lg p-3 ${
        day.isToday
          ? "bg-primary/10 border border-primary/30"
          : "bg-background-light dark:bg-background-dark"
      }`}
    >
      <span
        className={`text-xs font-semibold uppercase ${
          day.isToday ? "text-primary" : "text-gray-400"
        }`}
      >
        {day.label}
      </span>
      <span className={`material-icons text-3xl my-2 ${day.iconColor}`}>{day.icon}</span>
      <div className="flex gap-2 text-sm font-bold">
        <span className="text-gray-900 dark:text-white">{day.highC}°</span>
        <span className={day.lowC < 0 ? "text-blue-400" : "text-gray-500"}>{day.lowC}°</span>
      </div>
      <div className={`mt-2 text-xs flex items-center gap-1 ${day.precipColor}`}>
        <span className="material-icons text-[10px]">water_drop</span>
        {day.precipPct}%
      </div>
    </div>
  );
}

export default function ForecastGrid() {
  return (
    <div className="bg-white dark:bg-surface-dark rounded-xl p-6 border border-gray-200 dark:border-primary/20">
      <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
        <span className="material-icons text-primary">calendar_today</span>
        7-Day Field Forecast
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-4">
        {forecast.map((day) => <DayCard key={day.id} day={day} />)}
      </div>
    </div>
  );
}