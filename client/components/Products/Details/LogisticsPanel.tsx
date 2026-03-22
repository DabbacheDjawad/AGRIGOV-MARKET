import Image from "next/image";
import type { LogisticsDetail, ProductDetail } from "@/types/ProductDetails";

interface Props {
  mapImageUrl: string;
  warehouseLabel: string;
  logistics: LogisticsDetail[];
}

export default function OriginLogisticsPanel({ mapImageUrl, warehouseLabel, logistics }: Props) {
  return (
    <div className="bg-neutral-surface dark:bg-neutral-surface-dark rounded-xl shadow-sm border border-neutral-border dark:border-neutral-border-dark p-6">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
        Origin &amp; Logistics
      </h3>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Map */}
        <div className="w-full md:w-2/3 h-64 rounded-lg overflow-hidden relative">
          <Image
            src={mapImageUrl}
            alt="Map showing origin warehouse location"
            fill
            className="object-cover opacity-80"
            sizes="(max-width: 768px) 100vw, 66vw"
          />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-white dark:bg-gray-900 p-2 rounded shadow-lg flex items-center gap-2">
              <span className="material-icons text-red-500">location_on</span>
              <span className="text-sm font-bold text-gray-800 dark:text-white">
                {warehouseLabel}
              </span>
            </div>
          </div>
        </div>

        {/* Logistics detail list */}
        <div className="w-full md:w-1/3 space-y-4">
          {logistics.map((item) => (
            <div key={item.title} className="flex items-start gap-3">
              <div className={`${item.iconBg} p-2 rounded-full shrink-0`}>
                <span className={`material-icons ${item.iconColor}`}>{item.icon}</span>
              </div>
              <div>
                <h5 className="font-semibold text-gray-900 dark:text-white text-sm">
                  {item.title}
                </h5>
                <p className="text-xs text-gray-500">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}