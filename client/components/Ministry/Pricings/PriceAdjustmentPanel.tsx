"use client";

import { useState, useMemo } from "react";
import type { ApiOfficialPrice, ChangeReason } from "@/types/Prices";
import { CHANGE_REASONS, midPrice } from "@/types/Prices";

interface Props {
  item:       ApiOfficialPrice;
  onConfirm:  (id: number, minPrice: number, maxPrice: number, reason: ChangeReason) => void;
  onCancel:   () => void;
  isSaving:   boolean;
}

export default function PriceAdjustmentPanel({ item, onConfirm, onCancel, isSaving }: Props) {
  const currentMid   = midPrice(item);
  const [minStr, setMinStr] = useState(item.min_price);
  const [maxStr, setMaxStr] = useState(item.max_price);
  const [reason, setReason] = useState<ChangeReason>(CHANGE_REASONS[0]);

  const min = parseFloat(minStr) || 0;
  const max = parseFloat(maxStr) || 0;
  const newMid = min && max ? (min + max) / 2 : 0;

  const changePct = useMemo(() => {
    if (!currentMid || !newMid) return 0;
    return ((newMid - currentMid) / currentMid) * 100;
  }, [newMid, currentMid]);

  const isIncrease = changePct > 0;
  const isFlat     = Math.abs(changePct) < 0.01;

  const valid = min > 0 && max > 0 && min <= max;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-primary shadow-sm overflow-hidden relative">
      {/* Left accent */}
      <div className="absolute top-0 left-0 w-1 h-full bg-primary" />

      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Price Adjustment</h2>
            <p className="text-sm text-slate-500 capitalize">
              {item.product_detail.name} — {item.unit}
              {item.wilaya ? ` · ${item.wilaya}` : " · National"}
            </p>
          </div>
          <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 text-primary">
            <span className="material-icons text-sm">edit</span>
          </span>
        </div>

        <div className="space-y-4">
          {/* Current range (read-only) */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Current Range
            </label>
            <p className="text-xl font-bold font-mono text-slate-400">
              {item.min_price} – {item.max_price}{" "}
              <span className="text-sm font-normal">DZD / {item.unit}</span>
            </p>
          </div>

          {/* Min price */}
          <div>
            <label htmlFor="min-price" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              New Min Price (DZD)
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-slate-500 text-xs font-bold">DZD</span>
              </div>
              <input
                id="min-price"
                type="number"
                min={0}
                step={0.01}
                value={minStr}
                onChange={(e) => setMinStr(e.target.value)}
                className="block w-full pl-12 pr-3 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg text-sm dark:bg-slate-700 dark:text-white font-mono font-bold outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              />
            </div>
          </div>

          {/* Max price */}
          <div>
            <label htmlFor="max-price" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              New Max Price (DZD)
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-slate-500 text-xs font-bold">DZD</span>
              </div>
              <input
                id="max-price"
                type="number"
                min={0}
                step={0.01}
                value={maxStr}
                onChange={(e) => setMaxStr(e.target.value)}
                className="block w-full pl-12 pr-3 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg text-sm dark:bg-slate-700 dark:text-white font-mono font-bold outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              />
            </div>
            {min > max && min > 0 && max > 0 && (
              <p className="mt-1 text-xs text-red-500 font-medium">
                Min price must not exceed max price.
              </p>
            )}
          </div>

          {/* Change indicator */}
          {!isFlat && valid && (
            <p className={`text-xs font-medium flex items-center gap-1 ${isIncrease ? "text-primary" : "text-red-500"}`}>
              <span className="material-icons text-xs">
                {isIncrease ? "trending_up" : "trending_down"}
              </span>
              {Math.abs(changePct).toFixed(1)}% {isIncrease ? "increase" : "decrease"} vs current mid-price
            </p>
          )}

          {/* Reason */}
          <div>
            <label htmlFor="reason" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Reason for Change
            </label>
            <select
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value as ChangeReason)}
              className="block w-full pl-3 pr-10 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-primary focus:border-primary dark:bg-slate-700 dark:text-white"
            >
              {CHANGE_REASONS.map((r) => <option key={r}>{r}</option>)}
            </select>
          </div>

          {/* Toggle active */}
          <div className="flex items-center justify-between py-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Active Price
            </span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
              item.is_active
                ? "bg-primary-light dark:bg-primary/20 text-primary-dark"
                : "bg-slate-100 dark:bg-slate-700 text-slate-500"
            }`}>
              {item.is_active ? "Currently Active" : "Currently Inactive"}
            </span>
          </div>

          {/* Actions */}
          <div className="pt-2 space-y-2">
            <button
              type="button"
              onClick={() => onConfirm(item.id, min, max, reason)}
              disabled={isSaving || !valid}
              className="w-full flex justify-center items-center gap-2 py-2.5 px-4 rounded-lg text-sm font-bold text-slate-900 bg-primary hover:opacity-90 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <span className="material-icons animate-spin text-sm">autorenew</span>
                  Saving…
                </>
              ) : "Confirm Update"}
            </button>
            <button
              type="button"
              onClick={onCancel}
              disabled={isSaving}
              className="w-full flex justify-center py-2 px-4 border border-neutral-light dark:border-border-dark rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}