import Image from "next/image";
import { farmerAvatars } from "@/types/Ministry";

interface KpiData {
  id: string;
  icon: string;
  iconColor: string;
  label: string;
  value: string;
  trend: "up" | "down" | "flat";
  trendLabel: string;
  footer: "progress" | "avatars" | "fleet" | "compare";
}

const kpis: KpiData[] = [
  {
    id: "volume",
    icon: "analytics",
    iconColor: "text-primary",
    label: "Total Trade Volume",
    value: "1.2M Tons",
    trend: "up",
    trendLabel: "5.2%",
    footer: "progress",
  },
  {
    id: "farmers",
    icon: "groups",
    iconColor: "text-blue-500",
    label: "Active Farmers",
    value: "45,230",
    trend: "up",
    trendLabel: "1.8%",
    footer: "avatars",
  },
  {
    id: "fleet",
    icon: "local_shipping",
    iconColor: "text-orange-500",
    label: "Logistics Fleet",
    value: "1,842",
    trend: "flat",
    trendLabel: "0.0%",
    footer: "fleet",
  },
  {
    id: "price",
    icon: "monetization_on",
    iconColor: "text-yellow-500",
    label: "Avg. Maize Price",
    value: "$240",
    trend: "down",
    trendLabel: "2.1%",
    footer: "compare",
  },
];

const trendStyles = {
  up: { badge: "text-primary bg-primary/10", icon: "arrow_upward" },
  down: { badge: "text-red-500 bg-red-50 dark:bg-red-900/20", icon: "arrow_downward" },
  flat: { badge: "text-slate-400 bg-slate-100 dark:bg-slate-800", icon: "remove" },
};

export default function KpiCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {kpis.map((kpi) => {
        const ts = trendStyles[kpi.trend];
        return (
          <div
            key={kpi.id}
            className="bg-white dark:bg-[#1a331a] p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group"
          >
            {/* Watermark icon */}
            <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
              <span className={`material-icons text-6xl ${kpi.iconColor}`}>{kpi.icon}</span>
            </div>

            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{kpi.label}</p>

            <div className="flex items-end mt-2 gap-2">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                {kpi.value}
                {kpi.id === "price" && (
                  <span className="text-sm text-slate-400 font-normal">/ton</span>
                )}
              </h3>
              <span
                className={`mb-1 text-xs font-bold flex items-center px-1.5 py-0.5 rounded ${ts.badge}`}
              >
                <span className="material-icons text-[10px] mr-0.5">{ts.icon}</span>
                {kpi.trendLabel}
              </span>
            </div>

            {/* Footer variant */}
            {kpi.footer === "progress" && (
              <div className="mt-4 h-1 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-primary w-[75%] rounded-full" />
              </div>
            )}
            {kpi.footer === "avatars" && (
              <div className="mt-4 flex -space-x-2 overflow-hidden">
                {farmerAvatars.map((src, i) => (
                  <div key={i} className="relative h-6 w-6 shrink-0">
                    <Image
                      src={src}
                      alt="Farmer avatar"
                      fill
                      className="rounded-full object-cover ring-2 ring-white dark:ring-slate-800"
                      sizes="24px"
                    />
                  </div>
                ))}
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700 ring-2 ring-white dark:ring-slate-800 text-[10px] font-medium text-slate-500">
                  +4k
                </span>
              </div>
            )}
            {kpi.footer === "fleet" && (
              <div className="mt-4 flex items-center text-xs text-slate-500">
                <span className="w-2 h-2 rounded-full bg-primary mr-2" />
                85% Active
              </div>
            )}
            {kpi.footer === "compare" && (
              <div className="mt-4 flex items-center text-xs text-slate-400">
                Vs last month $245
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}