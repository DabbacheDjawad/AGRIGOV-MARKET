import type { RegionDetail } from "@/types/Regional";

interface Props {
  region: RegionDetail;
  onClose: () => void;
}

export default function RegionDataCard({ region, onClose }: Props) {
  return (
    <div className="absolute top-1/2 left-1/2 transform translate-x-12 -translate-y-24 w-72 bg-surface-light rounded-xl shadow-2xl border border-slate-100 z-20 overflow-hidden">
      {/* Dark header */}
      <div className="bg-slate-900 text-white p-4 rounded-t-xl flex justify-between items-start">
        <div>
          <h3 className="font-bold text-lg">{region.name}</h3>
          <p className="text-xs text-primary font-medium flex items-center gap-1">
            <span className="material-icons text-[14px]">
              {region.statusTrend === "up"
                ? "trending_up"
                : region.statusTrend === "down"
                ? "trending_down"
                : "trending_flat"}
            </span>
            {region.status}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-slate-400 hover:text-white transition-colors"
          aria-label="Close"
        >
          <span className="material-icons text-sm">close</span>
        </button>
      </div>

      {/* Body */}
      <div className="p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Total Volume</p>
            <p className="text-xl font-bold text-slate-800">
              {region.totalVolume}{" "}
              <span className="text-xs font-normal text-slate-500">Tons</span>
            </p>
          </div>
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Active Farmers</p>
            <p className="text-xl font-bold text-slate-800">{region.activeFarmers}</p>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-3">
          <p className="text-[10px] text-slate-500 font-bold uppercase mb-2">Top Crops</p>
          <div className="flex flex-wrap gap-2">
            {region.topCrops.map((crop) => (
              <span
                key={crop.label}
                className="inline-flex items-center gap-1 px-2 py-1 bg-neutral-light rounded text-xs font-semibold text-slate-700"
              >
                <span className={`material-icons text-[14px] ${crop.iconColor}`}>
                  {crop.icon}
                </span>
                {crop.label}
              </span>
            ))}
          </div>
        </div>

        <button
          type="button"
          className="w-full mt-2 bg-primary text-black font-bold py-2 rounded-lg text-sm hover:bg-primary-dark hover:text-white transition-colors"
        >
          View Detailed Report
        </button>
      </div>
    </div>
  );
}