"use client";

import type { Transporter } from "@/types/Checkout";

interface Props {
  transporters: Transporter[];
  selectedId: string;
  onChange: (id: string) => void;
}

export default function TransporterSelector({ transporters, selectedId, onChange }: Props) {
  return (
    <div className="bg-neutral-surface dark:bg-neutral-surface-dark rounded-xl shadow-sm border border-gray-100 dark:border-primary/10 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-100 dark:border-primary/10 bg-gray-50/50 dark:bg-white/5">
        <h2 className="text-lg font-bold flex items-center gap-2 text-gray-900 dark:text-white">
          <span className="material-icons text-primary text-xl">local_shipping</span>
          Select Certified Transporter
        </h2>
      </div>

      {/* Options */}
      <div className="p-6 space-y-4">
        {transporters.map((t) => {
          const active = selectedId === t.id;
          return (
            <label
              key={t.id}
              className={`relative flex cursor-pointer rounded-lg border p-4 shadow-sm transition-all ${
                active
                  ? "bg-primary/5 dark:bg-primary/5 border-primary ring-1 ring-primary z-10"
                  : "bg-white dark:bg-neutral-surface-dark border-gray-200 dark:border-gray-700 hover:border-primary/50"
              }`}
            >
              <input
                type="radio"
                name="transporter"
                value={t.id}
                checked={active}
                onChange={() => onChange(t.id)}
                className="sr-only"
              />

              {/* Left: info */}
              <span className="flex flex-1 flex-col">
                <span className="block text-sm font-bold text-gray-900 dark:text-white">
                  {t.name}
                </span>
                <span className="mt-1 flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <span className="material-icons text-yellow-400 text-sm mr-1">star</span>
                  {t.rating} ({t.deliveryCount} deliveries)
                </span>
                <span className="mt-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Est. Delivery: {t.estimatedDelivery}
                </span>
              </span>

              {/* Active check icon */}
              {active && (
                <span className="material-icons text-primary absolute top-4 right-4">
                  check_circle
                </span>
              )}

              {/* Right: price */}
              <span className="flex flex-col text-right justify-end">
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  ${t.price.toFixed(2)}
                </span>
                {t.badge && (
                  <span className="text-xs text-primary font-medium">{t.badge}</span>
                )}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}