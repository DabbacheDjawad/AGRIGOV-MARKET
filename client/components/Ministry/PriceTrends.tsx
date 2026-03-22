"use client";

import { useState } from "react";
import type { TrendPeriod } from "@/types/Ministry";

const PERIODS: TrendPeriod[] = ["Last 30 Days", "Last Quarter"];

// Points are expressed as percentages of the SVG viewBox (0 0 260 128)
const chartLines: Record<TrendPeriod, { maize: string; rice: string }> = {
  "Last 30 Days": {
    maize: "0,100 52,83 104,108 156,67 208,75 260,33",
    rice: "0,133 52,125 104,117 156,108 208,100 260,92",
  },
  "Last Quarter": {
    maize: "0,120 52,90 104,70 156,55 208,40 260,15",
    rice: "0,110 52,100 104,95 156,85 208,78 260,65",
  },
};

export default function PriceTrendsChart() {
  const [period, setPeriod] = useState<TrendPeriod>("Last 30 Days");
  const lines = chartLines[period];

  return (
    <div className="bg-white dark:bg-[#1a331a] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 flex-1">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Price Trends</h3>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value as TrendPeriod)}
          className="bg-transparent text-xs font-medium text-slate-500 border-none focus:ring-0 cursor-pointer outline-none dark:text-slate-400"
        >
          {PERIODS.map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>
      </div>

      {/* SVG chart */}
      <div className="relative h-32 w-full">
        {/* Dashed grid lines */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 260 128"
          preserveAspectRatio="none"
        >
          {[32, 64, 96].map((y) => (
            <line
              key={y}
              x1={0}
              y1={y}
              x2={260}
              y2={y}
              stroke="#cbd5e1"
              strokeDasharray="4"
              strokeWidth="1"
              opacity="0.4"
            />
          ))}
          {/* Maize line */}
          <polyline
            fill="none"
            points={lines.maize}
            stroke="#0df20d"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          />
          {/* Maize fill */}
          <polygon
            points={`${lines.maize} 260,128 0,128`}
            fill="#0df20d"
            opacity="0.08"
          />
          {/* Rice line */}
          <polyline
            fill="none"
            points={lines.rice}
            stroke="#3b82f6"
            strokeWidth="2"
            strokeDasharray="4"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-4 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-primary" />
          <span className="text-slate-600 dark:text-slate-300">Maize</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-blue-500" />
          <span className="text-slate-600 dark:text-slate-300">Rice</span>
        </div>
      </div>
    </div>
  );
}