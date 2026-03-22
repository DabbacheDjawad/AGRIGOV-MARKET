"use client";

import Image from "next/image";
import { useState } from "react";
import type { MapView } from "@/types/Ministry";

export default function RegionalMap() {
  const [view, setView] = useState<MapView>("Volume");

  return (
    <div className="lg:col-span-2 bg-white dark:bg-[#1a331a] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Regional Production Output
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Current quarter volume by province
          </p>
        </div>
        <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
          {(["Volume", "Yield"] as MapView[]).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setView(v)}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                view === v
                  ? "bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Map container */}
      <div className="flex-1 min-h-100 relative bg-slate-50 dark:bg-slate-900 rounded-lg overflow-hidden flex items-center justify-center">
        {/* Gradient decoration */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, #0df20d 0%, transparent 20%), radial-gradient(circle at 80% 60%, #0df20d 0%, transparent 25%)",
          }}
        />

        {/* Map image + overlays */}
        <div className="relative w-3/4 h-3/4">
          <Image
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBlJisfYB8OSwiJk9Ju9cC-SFyAVykm9D7mQYEAIwAKgNuJIT3H5rXQS_S1_exQnEyw0o8bvc23-AXdSYej5uLPwyjDpmVNLv6vrIxSAN2SAoc1muMQoCnZPBArAtQ8UshqDKJwpQqaf-8AMDvezBTV_WlGSC8-7AfhMOMDjiuDzftwIgXrzxD43pkhw4s_YL9gZedb298Lo4lPOx7v9N4k-B1S--jYnbkwL1OGdrD_1XsuPPS5-yHDgga_1meB6LUxUc0oBFbk7aJo"
            alt="Map of agricultural regions"
            fill
            className="object-contain opacity-40 dark:opacity-20 grayscale"
            sizes="(max-width: 1024px) 75vw, 600px"
          />

          {/* Heatmap blobs */}
          <div className="absolute top-[30%] left-[40%] w-24 h-24 bg-primary/40 rounded-full blur-xl animate-pulse pointer-events-none" />
          <div className="absolute top-[60%] left-[30%] w-32 h-32 bg-primary/30 rounded-full blur-xl pointer-events-none" />
          <div className="absolute top-[20%] right-[30%] w-16 h-16 bg-yellow-400/30 rounded-full blur-xl pointer-events-none" />

          {/* Tooltip pin */}
          <div className="absolute top-[35%] left-[42%] group cursor-pointer">
            <div className="w-4 h-4 bg-primary rounded-full border-2 border-white dark:border-slate-900 shadow-lg relative z-10" />
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
              Ashanti Region
              <br />
              <span className="font-bold text-primary">320k Tons</span>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 right-4 bg-white dark:bg-slate-800 p-2 rounded-lg shadow border border-slate-200 dark:border-slate-700 text-xs">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-3 h-3 rounded-sm bg-primary/80" />
            High Output (&gt;50k)
          </div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-3 h-3 rounded-sm bg-yellow-400/80" />
            Medium (20k–50k)
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm bg-slate-300" />
            Low (&lt;20k)
          </div>
        </div>
      </div>
    </div>
  );
}