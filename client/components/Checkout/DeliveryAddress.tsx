"use client";

import { useState } from "react";
import type { DeliveryAddress } from "@/types/Checkout";
import { WILAYAS } from "@/types/Register";

interface Props {
  address:  DeliveryAddress;
  onChange: (a: DeliveryAddress) => void;
}

const inp =
  "block w-full py-2 px-3 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 placeholder-gray-400 focus:border-primary focus:ring-primary focus:outline-none transition";

export default function DeliveryAddressCard({ address, onChange }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft,     setDraft]     = useState<DeliveryAddress>(address);

  const set = <K extends keyof DeliveryAddress>(k: K, v: DeliveryAddress[K]) =>
    setDraft((p) => ({ ...p, [k]: v }));

  const handleSave = () => {
    onChange(draft);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setDraft(address);
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-neutral-100 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-neutral-100 bg-gray-50/50 flex justify-between items-center">
        <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
          <span
            className="material-symbols-outlined text-primary text-xl"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            location_on
          </span>
          Delivery Address
        </h2>
        {!isEditing && (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="text-sm font-semibold text-primary-dark hover:underline"
          >
            Change
          </button>
        )}
      </div>

      <div className="p-6">
        {isEditing ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Wilaya */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">Wilaya</label>
              <div className="relative">
                <select
                  value={draft.wilaya}
                  onChange={(e) => set("wilaya", e.target.value)}
                  className={`${inp} appearance-none pr-8`}
                >
                  <option value="">Select Wilaya</option>
                  {WILAYAS.map((w) => <option key={w}>{w}</option>)}
                </select>
                <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">
                  <span className="material-symbols-outlined text-base">expand_more</span>
                </span>
              </div>
            </div>

            {/* Baladiya */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">Baladiya</label>
              <input
                type="text"
                value={draft.baladiya}
                onChange={(e) => set("baladiya", e.target.value)}
                placeholder="e.g. Bab Ezzouar"
                className={inp}
              />
            </div>

            {/* Full address */}
            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">Detailed Address</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                  <span className="material-symbols-outlined text-base">home</span>
                </span>
                <input
                  type="text"
                  value={draft.address}
                  onChange={(e) => set("address", e.target.value)}
                  placeholder="Street, building, landmark…"
                  className={`${inp} pl-9`}
                />
              </div>
            </div>

            {/* Phone */}
            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">Phone</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                  <span className="material-symbols-outlined text-base">phone</span>
                </span>
                <input
                  type="tel"
                  value={draft.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  placeholder="05XX XXX XXX"
                  className={`${inp} pl-9`}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="sm:col-span-2 flex gap-3 pt-2">
              <button
                type="button"
                onClick={handleSave}
                className="flex-1 py-2.5 rounded-lg bg-primary hover:bg-primary-dark text-black text-sm font-bold transition-colors"
              >
                Save Address
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2.5 rounded-lg border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <span
                className="material-symbols-outlined text-primary-dark"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                location_on
              </span>
            </div>
            <div className="space-y-0.5">
              <p className="font-semibold text-gray-900">
                {address.wilaya}{address.baladiya ? `, ${address.baladiya}` : ""}
              </p>
              <p className="text-sm text-gray-600">{address.address || "—"}</p>
              <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                <span className="material-symbols-outlined text-xs">phone</span>
                {address.phone || "—"}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}