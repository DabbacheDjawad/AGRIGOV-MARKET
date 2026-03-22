"use client";

import { useState } from "react";

interface Props {
  subtotal: number;
  transport: number;
  levyRate: number;
  totalWeightKg: number;
  vehicleType: string;
}

export default function OrderSummary({
  subtotal,
  transport,
  levyRate,
  totalWeightKg,
  vehicleType,
}: Props) {
  const [promoCode, setPromoCode] = useState("");
  const levy = subtotal * levyRate;
  const total = subtotal + transport + levy;

  const fmt = (n: number) =>
    "₦" + n.toLocaleString("en-NG", { minimumFractionDigits: 2 });

  return (
    <div className="sticky top-24 space-y-6">
      {/* Main summary card */}
      <div className="bg-surface-light dark:bg-surface-dark shadow-lg rounded-xl border border-gray-100 dark:border-green-900/20 p-6">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Order Summary</h2>

        {/* Logistics widget */}
        <div className="bg-primary/10 dark:bg-primary/5 rounded-lg p-4 mb-6 border border-primary/20">
          <div className="flex items-start gap-3">
            <div className="bg-white dark:bg-surface-dark p-2 rounded-full shadow-sm text-primary-dark dark:text-primary shrink-0">
              <span className="material-icons">local_shipping</span>
            </div>
            <div className="w-full">
              <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                Logistics Estimation
              </h4>
              <div className="mt-2 space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Total Weight:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {totalWeightKg.toLocaleString()} kg
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Vehicle Type:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{vehicleType}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Financial breakdown */}
        <dl className="space-y-4 text-sm text-gray-600 dark:text-gray-300">
          <div className="flex justify-between">
            <dt>Subtotal (Items)</dt>
            <dd className="font-medium text-gray-900 dark:text-white">{fmt(subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="flex items-center gap-1">
              Estimated Transport
              <span
                className="material-icons text-gray-400 text-xs cursor-help"
                title="Based on average distance to your registered warehouse"
              >
                info
              </span>
            </dt>
            <dd className="font-medium text-gray-900 dark:text-white">{fmt(transport)}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Platform Levy ({(levyRate * 100).toFixed(0)}%)</dt>
            <dd className="font-medium text-gray-900 dark:text-white">{fmt(levy)}</dd>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4 flex items-center justify-between">
            <dt className="text-base font-bold text-gray-900 dark:text-white">Total</dt>
            <dd className="text-2xl font-bold text-primary-dark dark:text-primary">{fmt(total)}</dd>
          </div>
        </dl>

        {/* CTA */}
        <div className="mt-8">
          <button
            type="button"
            className="w-full bg-primary hover:bg-green-400 text-black font-bold py-4 px-6 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group"
          >
            Proceed to Checkout
            <span className="material-icons text-black group-hover:translate-x-1 transition-transform">
              arrow_forward
            </span>
          </button>
          <p className="mt-4 text-xs text-center text-gray-500 dark:text-gray-400 flex items-center justify-center gap-1">
            <span className="material-icons text-sm text-green-600">lock</span>
            Transactions are secured by Ministry Escrow
          </p>
        </div>
      </div>

      {/* Promo code card */}
      <div className="bg-surface-light dark:bg-surface-dark shadow-sm rounded-xl border border-gray-100 dark:border-green-900/20 p-6">
        <label
          htmlFor="promo"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Have a voucher code?
        </label>
        <div className="flex gap-2">
          <input
            id="promo"
            type="text"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            placeholder="Enter code"
            className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-black/20 dark:text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2.5"
          />
          <button
            type="button"
            className="bg-gray-800 dark:bg-gray-700 text-white px-4 rounded-lg text-sm font-medium hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors whitespace-nowrap"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}