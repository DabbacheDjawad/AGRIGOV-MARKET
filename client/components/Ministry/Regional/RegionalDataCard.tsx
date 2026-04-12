import type { RegionDetail } from "@/types/Regional";

interface Props {
  region:  RegionDetail;
  onClose: () => void;
}

export default function RegionDataCard({ region, onClose }: Props) {
  const revenueFormatted = region.revenue.toLocaleString("fr-DZ", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  return (
    <div className="absolute top-1/2 left-1/2 translate-x-12 -translate-y-24 w-80 bg-white rounded-xl shadow-2xl border border-slate-100 z-20 overflow-hidden">
      {/* Dark header */}
      <div className="bg-slate-900 text-white p-4 rounded-t-xl flex justify-between items-start">
        <div>
          <h3 className="font-bold text-lg">{region.name} Region</h3>
          <p className="text-xs text-primary font-medium mt-0.5">
            {region.wilayas.length} wilayas
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-slate-400 hover:text-white transition-colors mt-0.5"
          aria-label="Close"
        >
          <span className="material-icons text-sm">close</span>
        </button>
      </div>

      {/* Body */}
      <div className="p-4 space-y-4">
        {/* KPI grid */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Farmers</p>
            <p className="text-xl font-bold text-slate-800">
              {region.totalFarmers}
              <span className="text-xs font-normal text-slate-500 ml-1">
                ({region.activeFarmers} active)
              </span>
            </p>
          </div>
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Buyers</p>
            <p className="text-xl font-bold text-slate-800">{region.buyers}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Revenue (DZD)</p>
            <p className="text-xl font-bold text-slate-800">{revenueFormatted}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Orders</p>
            <p className="text-xl font-bold text-slate-800">{region.totalOrders}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Transporters</p>
            <p className="text-xl font-bold text-slate-800">{region.transporters}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Active Prices</p>
            <p className="text-xl font-bold text-slate-800">{region.activePrices}</p>
          </div>
        </div>

        {/* Top products */}
        {region.topProducts.length > 0 && (
          <div className="border-t border-slate-100 pt-3">
            <p className="text-[10px] text-slate-500 font-bold uppercase mb-2">Top Products</p>
            <div className="flex flex-wrap gap-2">
              {region.topProducts.map((p) => (
                <span
                  key={p.id}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-neutral-light dark:bg-slate-100 rounded text-xs font-semibold text-slate-700"
                >
                  <span className="material-icons text-[14px] text-primary">eco</span>
                  {p.name}
                  {p.sold != null && (
                    <span className="text-slate-400">·{p.sold}</span>
                  )}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Wilayas preview */}
        <div className="border-t border-slate-100 pt-3">
          <p className="text-[10px] text-slate-500 font-bold uppercase mb-2">
            Wilayas ({region.wilayas.length})
          </p>
          <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
            {region.wilayas.slice(0, 6).join(", ")}
            {region.wilayas.length > 6 && (
              <span className="text-slate-400"> +{region.wilayas.length - 6} more</span>
            )}
          </p>
        </div>

        <button
          type="button"
          className="w-full mt-1 bg-primary text-slate-900 font-bold py-2 rounded-lg text-sm hover:opacity-90 active:scale-95 transition-all"
        >
          View Detailed Report
        </button>
      </div>
    </div>
  );
}