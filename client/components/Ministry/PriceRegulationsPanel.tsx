"use client";

import { useState } from "react";
import type { PriceUpdate } from "@/types/Ministry";
import { COMMODITIES, priceUpdates } from "@/types/Ministry";

export default function PriceRegulationPanel() {
  const [commodity, setCommodity] = useState(COMMODITIES[0]);
  const [minPrice, setMinPrice] = useState("210.00");
  const [maxPrice, setMaxPrice] = useState("285.50");
  const [updates, setUpdates] = useState<PriceUpdate[]>(priceUpdates);
  const [saving, setSaving] = useState(false);

  const handleUpdate = async () => {
    setSaving(true);
    await new Promise((res) => setTimeout(res, 800));
    setUpdates((prev) => [
      { id: Date.now().toString(), label: `${commodity} benchmark updated`, timeAgo: "Just now" },
      ...prev.slice(0, 3),
    ]);
    setSaving(false);
  };

  const inputClass =
    "w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm pr-3 py-2 text-slate-700 dark:text-slate-300 focus:ring-1 focus:ring-primary focus:border-primary outline-none";

  return (
    <div className="bg-white dark:bg-[#1a331a] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
      {/* Title */}
      <div className="flex items-center gap-2 mb-4 border-b border-slate-100 dark:border-slate-800 pb-3">
        <span className="material-icons text-primary">gavel</span>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Price Regulation</h3>
      </div>

      <div className="space-y-4">
        {/* Commodity selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wide">
            Commodity
          </label>
          <select
            value={commodity}
            onChange={(e) => setCommodity(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm px-3 py-2 text-slate-700 dark:text-slate-300 focus:ring-1 focus:ring-primary focus:border-primary outline-none"
          >
            {COMMODITIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Min / Max price */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
              Min Support Price
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-slate-400 text-sm">$</span>
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className={`${inputClass} pl-7`}
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
              Max Retail Price
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-slate-400 text-sm">$</span>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className={`${inputClass} pl-7`}
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleUpdate}
            disabled={saving}
            className="w-full bg-primary hover:bg-green-400 text-black font-bold py-2.5 rounded-lg text-sm shadow-md shadow-primary/20 transition-all flex justify-center items-center gap-2 disabled:opacity-60"
          >
            {saving ? (
              <>
                <span className="material-icons animate-spin text-sm">autorenew</span>
                Saving…
              </>
            ) : (
              <>
                <span className="material-icons text-sm">publish</span>
                Update Benchmark
              </>
            )}
          </button>
        </div>
      </div>

      {/* Recent updates */}
      <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
        <p className="text-xs text-slate-400 mb-2 font-medium uppercase tracking-wide">
          Recent Updates
        </p>
        <div className="space-y-3">
          {updates.map((u) => (
            <div key={u.id} className="flex justify-between items-center text-sm">
              <span className="text-slate-600 dark:text-slate-300">{u.label}</span>
              <span className="text-slate-400 text-xs shrink-0 ml-2">{u.timeAgo}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}