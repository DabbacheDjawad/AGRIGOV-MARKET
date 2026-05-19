"use client";

import type { DeliveryAddress } from "@/types/Checkout";
import { WILAYAS } from "@/types/Register";

const inp =
  "block w-full py-2 px-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder-gray-400 focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none transition-all";

interface Props {
  address: DeliveryAddress;
  onAddressChange: (a: DeliveryAddress) => void;
}

export default function DeliveryAddressCard({
  address,
  onAddressChange,
}: Props) {
  const set = <K extends keyof DeliveryAddress>(
    key: K,
    value: DeliveryAddress[K]
  ) => {
    onAddressChange({
      ...address,
      [key]: value,
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-neutral-100 bg-linear-to-r from-primary/5 to-transparent">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <span
            className="material-symbols-outlined text-primary text-2xl"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            location_on
          </span>
          Delivery Address
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          Your address is saved automatically while typing.
        </p>
      </div>

      <div className="p-6 space-y-5">
        {/* Top row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Wilaya */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Wilaya
            </label>

            <div className="relative">
              <select
                value={address.wilaya}
                onChange={(e) => set("wilaya", e.target.value)}
                className={`${inp} appearance-none pr-10 h-11`}
              >
                <option value="">Select Wilaya</option>

                {WILAYAS.map((w) => (
                  <option key={w}>{w}</option>
                ))}
              </select>

              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                <span className="material-symbols-outlined text-base">
                  expand_more
                </span>
              </span>
            </div>
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Phone
            </label>

            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <span className="material-symbols-outlined text-base">
                  phone
                </span>
              </span>

              <input
                type="tel"
                value={address.phone}
                onChange={(e) => set("phone", e.target.value)}
                placeholder="05XX XXX XXX"
                className={`${inp} pl-10 h-11`}
              />
            </div>
          </div>
        </div>

        {/* Full address */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            Detailed Address
          </label>

          <div className="relative">
            <span className="absolute left-3 top-4 text-gray-400">
              <span className="material-symbols-outlined text-base">
                home
              </span>
            </span>

            <textarea
              rows={3}
              value={address.address}
              onChange={(e) => set("address", e.target.value)}
              placeholder="Street, building, landmark..."
              className={`${inp} pl-10 resize-none`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}