"use client";

import { useState } from "react";
import { ALGERIA_WILAYA_PATHS, WILAYA_TO_REGION, normalizeShapeName } from "@/lib/AlgeriaRegions";
import RegionDataCard from "./RegionalDataCard";
import { SEASONS, CROP_TYPES, METRICS, mapRegions } from "@/types/Regional";
import type { SeasonOption, CropTypeOption, MetricOption, RegionDetail } from "@/types/Regional";

interface Props {
  activeRegionId: string | null;
  onRegionClick: (id: string) => void;
  onCardClose: () => void;
  activeDetail: RegionDetail | null;
}

export default function RegionalMap({ activeRegionId, onRegionClick, onCardClose, activeDetail }: Props) {
  const [season, setSeason] = useState<SeasonOption>("Q3 2026");
  const [cropType, setCropType] = useState<CropTypeOption>("All Crops");
  const [metric, setMetric] = useState<MetricOption>("Order Count");

  const selectClass = "bg-transparent border-none p-0 text-sm font-semibold text-slate-700 focus:ring-0 cursor-pointer outline-none";

  return (
    <section className="flex-1 flex flex-col relative bg-neutral-light/20 min-h-175">
      {/* Floating filter bar */}
      <div className="absolute top-6 left-6 right-6 z-10 flex flex-wrap items-center justify-between pointer-events-none">
        {/* Filters */}
        <div className="bg-surface-light/90 backdrop-blur-md border border-white/50 p-2 rounded-xl shadow-sm flex items-center gap-2 pointer-events-auto">
          <div className="px-3 py-1.5 border-r border-slate-100">
            <label className="block text-[10px] text-slate-400 font-bold uppercase mb-0.5">Season</label>
            <select value={season} onChange={(e) => setSeason(e.target.value as SeasonOption)} className={selectClass}>
              {SEASONS.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="px-3 py-1.5 border-r border-slate-100">
            <label className="block text-[10px] text-slate-400 font-bold uppercase mb-0.5">Crop Type</label>
            <select value={cropType} onChange={(e) => setCropType(e.target.value as CropTypeOption)} className={selectClass}>
              {CROP_TYPES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="px-3 py-1.5">
            <label className="block text-[10px] text-slate-400 font-bold uppercase mb-0.5">Metric</label>
            <select value={metric} onChange={(e) => setMetric(e.target.value as MetricOption)} className={selectClass}>
              {METRICS.map((m) => <option key={m}>{m}</option>)}
            </select>
          </div>
        </div>

        {/* Legend */}
        <div className="bg-surface-light/90 backdrop-blur-md border border-white/50 p-3 rounded-xl shadow-sm pointer-events-auto">
          <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">{metric}</p>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-500">Low</span>
            <div className="h-2 w-32 bg-linear-to-r from-neutral-light via-primary/50 to-primary rounded-full" />
            <span className="text-[10px] text-slate-500">High</span>
          </div>
        </div>
      </div>

      {/* Map + floating card */}
      <div className="flex-1 flex items-center justify-center p-12 relative overflow-hidden">
        <svg
          // 1. The ViewBox matches Algeria's exact geographic bounds (Longitude / Latitude)
          viewBox="-9 -37.5 21.5 19.5"
          className="w-full h-full max-w-4xl drop-shadow-xl overflow-visible"
        >
          <defs>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="0.1" result="blur" /> {/* Reduced blur for geographic scale */}
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* 2. scale(1, -1) flips the Y axis so the map isn't upside down */}
          <g transform="scale(1, -1)">
            {ALGERIA_WILAYA_PATHS.map((wilaya) => {
              const normalizedName = normalizeShapeName(wilaya.wilaya);
              const region = WILAYA_TO_REGION[normalizedName];
              const isActive = activeRegionId === region;

              return (
                <path
                  key={wilaya.wilaya} // Using name as key since iso isn't in your new file
                  d={wilaya.svg_path}
                  stroke="#ffffff"
                  // 3. Stroke width must be very small because the viewBox is in GPS degrees
                  strokeWidth={0.03}
                  onClick={() => region && onRegionClick(region)}
                  className="cursor-pointer transition-all duration-300"
                  style={{
                    fill: isActive ? "#0df20d" : "#e2e8e2",
                    fillOpacity: isActive ? 1 : 1,
                  }}
                  onMouseEnter={(e) => {
                    const target = e.target as SVGPathElement;
                    if (!isActive) {
                      target.style.fill = "#0df20d";
                      target.style.fillOpacity = "0.4";
                    }
                  }}
                  onMouseLeave={(e) => {
                    const target = e.target as SVGPathElement;
                    if (!isActive) {
                      target.style.fill = "#e2e8e2";
                      target.style.fillOpacity = "1";
                    }
                  }}
                >
                  <title>{wilaya.wilaya}</title>
                </path>
              );
            })}
          </g>
        </svg>

        {activeDetail && <RegionDataCard region={activeDetail} onClose={onCardClose} />}

        {/* Zoom controls */}
        <div className="absolute bottom-6 left-6 flex gap-2 z-10">
          {[
            { icon: "add", label: "Zoom in" },
            { icon: "remove", label: "Zoom out" },
            { icon: "my_location", label: "Reset view" },
          ].map(({ icon, label }) => (
            <button
              key={icon}
              type="button"
              aria-label={label}
              className="bg-surface-light p-2 rounded-lg shadow-sm border border-slate-200 text-slate-600 hover:text-primary transition-colors"
            >
              <span className="material-icons">{icon}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}