"use client";

import { useState, useMemo } from "react";
import type { CommodityPrice, ChangeReason } from "@/types/Prices";
import { CHANGE_REASONS } from "@/types/Prices";

interface Props {
  item: CommodityPrice;
  onConfirm: (id: string, newPrice: number, reason: ChangeReason) => void;
  onCancel: () => void;
}

export default function PriceAdjustmentPanel({ item, onConfirm, onCancel }: Props) {
  const [newPriceStr, setNewPriceStr] = useState(
    (item.officialPrice * 1.077).toFixed(2)
  );
  const [reason, setReason] = useState<ChangeReason>(CHANGE_REASONS[0]);
  const [saving, setSaving] = useState(false);

  const newPrice = parseFloat(newPriceStr) || 0;
  const changePct = useMemo(() => {
    if (!item.officialPrice) return 0;
    return ((newPrice - item.officialPrice) / item.officialPrice) * 100;
  }, [newPrice, item.officialPrice]);

  const isIncrease = changePct > 0;
  const isFlat = changePct === 0;

  const handleConfirm = async () => {
    if (!newPrice || newPrice <= 0) return;
    setSaving(true);
    await new Promise((res) => setTimeout(res, 800));
    onConfirm(item.id, newPrice, reason);
    setSaving(false);
  };

  return (
    <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-primary shadow-sm overflow-hidden relative">
      {/* Left accent bar */}
      <div className="absolute top-0 left-0 w-1 h-full bg-primary" />

      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Price Adjustment</h2>
            <p className="text-sm text-slate-500">
              {item.name} — {item.unit}
            </p>
          </div>
          <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
            <span className="material-icons text-sm">edit</span>
          </span>
        </div>

        <div className="space-y-4">
          {/* Current price (read-only) */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Current Price
            </label>
            <div className="text-2xl font-bold font-mono text-slate-400">
              ${item.officialPrice.toFixed(2)}
            </div>
          </div>

          {/* New price input */}
          <div>
            <label
              htmlFor="new_price"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
            >
              New Official Price
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-slate-500 sm:text-sm">$</span>
              </div>
              <input
                id="new_price"
                type="number"
                min="0"
                step="0.01"
                value={newPriceStr}
                onChange={(e) => setNewPriceStr(e.target.value)}
                className="focus:ring-primary focus:border-primary block w-full pl-7 pr-12 sm:text-lg border border-slate-300 dark:border-slate-600 rounded-lg py-3 dark:bg-slate-800 dark:text-white font-mono font-bold outline-none"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-slate-500 sm:text-sm">USD</span>
              </div>
            </div>

            {/* Change indicator */}
            {!isFlat && (
              <p
                className={`mt-1 text-xs font-medium flex items-center ${
                  isIncrease ? "text-primary" : "text-red-500"
                }`}
              >
                <span className="material-icons text-xs mr-1">
                  {isIncrease ? "trending_up" : "trending_down"}
                </span>
                {Math.abs(changePct).toFixed(1)}% {isIncrease ? "Increase" : "Decrease"}
              </p>
            )}
          </div>

          {/* Reason */}
          <div>
            <label
              htmlFor="reason"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
            >
              Reason for Change
            </label>
            <select
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value as ChangeReason)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-lg dark:bg-slate-800 dark:text-white"
            >
              {CHANGE_REASONS.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </div>

          {/* Actions */}
          <div className="pt-2 space-y-2">
            <button
              type="button"
              onClick={handleConfirm}
              disabled={saving || newPrice <= 0}
              className="w-full flex justify-center items-center gap-2 py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-background-dark bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <span className="material-icons animate-spin text-sm">autorenew</span>
                  Saving…
                </>
              ) : (
                "Confirm Update"
              )}
            </button>
            <button
              type="button"
              onClick={onCancel}
              disabled={saving}
              className="w-full flex justify-center py-2 px-4 border border-border-light dark:border-border-dark rounded-lg shadow-sm text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}