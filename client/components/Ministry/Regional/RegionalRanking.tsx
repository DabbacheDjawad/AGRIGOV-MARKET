import type { ApiRegionComparison, AlgeriaRegion } from "@/types/Regional";

interface Props {
  comparisons:    ApiRegionComparison[];
  activeRegionId: AlgeriaRegion | null;
  isLoading:      boolean;
  onSelect:       (id: AlgeriaRegion) => void;
}

function SkeletonRow() {
  return (
    <div className="animate-pulse bg-white border border-slate-100 rounded-lg p-3 space-y-2">
      <div className="flex justify-between">
        <div className="h-3 bg-slate-200 rounded w-1/3" />
        <div className="h-3 bg-slate-100 rounded w-1/4" />
      </div>
      <div className="h-1 bg-slate-100 rounded-full w-full" />
    </div>
  );
}

export default function RegionalRankings({
  comparisons, activeRegionId, isLoading, onSelect,
}: Props) {
  // Sort by revenue desc for ranking
  const sorted = [...comparisons].sort((a, b) => b.revenue - a.revenue);
  const maxRevenue = Math.max(...sorted.map((r) => r.revenue), 1);

  const formatRevenue = (n: number) =>
    n.toLocaleString("fr-DZ", { maximumFractionDigits: 0 });

  return (
    <aside className="w-96 bg-white border-l border-neutral-light flex flex-col z-10 shadow-[-4px_0_24px_rgba(0,0,0,0.02)]">
      {/* Header */}
      <div className="p-6 border-b border-neutral-light bg-white sticky top-0">
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">
          National Supply
        </h2>
        <h3 className="text-xl font-bold text-slate-800">Regional Comparison</h3>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-6 pt-2">
        {/* Column headers */}
        <div className="grid grid-cols-12 gap-2 mb-3 px-2">
          <div className="col-span-1 text-[10px] font-bold text-slate-400 uppercase">#</div>
          <div className="col-span-5 text-[10px] font-bold text-slate-400 uppercase">Region</div>
          <div className="col-span-6 text-[10px] font-bold text-slate-400 uppercase text-right">
            Revenue / Orders
          </div>
        </div>

        <div className="space-y-2">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} />)
            : sorted.map((item, idx) => {
                const isActive = activeRegionId === item.region.toLowerCase();
                const pct      = (item.revenue / maxRevenue) * 100;

                return (
                  <div
                    key={item.region}
                    onClick={() => onSelect(item.region.toLowerCase() as AlgeriaRegion)}
                    className={`bg-white border rounded-lg p-3 cursor-pointer group transition-all ${
                      isActive
                        ? "border-primary shadow-md"
                        : "border-slate-100 hover:border-primary/50 hover:shadow-md"
                    }`}
                  >
                    <div className="grid grid-cols-12 gap-2 items-center">
                      {/* Rank */}
                      <div
                        className={`col-span-1 font-bold text-sm ${
                          isActive ? "text-primary" : "text-slate-300 group-hover:text-primary"
                        }`}
                      >
                        {String(idx + 1).padStart(2, "0")}
                      </div>

                      {/* Name */}
                      <div className="col-span-5">
                        <p className="font-bold text-sm text-slate-800 capitalize">
                          {item.region}
                        </p>
                        <p className="text-[10px] text-slate-500">
                          {item.total_active_prices} active price
                          {item.total_active_prices !== 1 ? "s" : ""}
                        </p>
                      </div>

                      {/* Revenue + bar */}
                      <div className="col-span-6 text-right">
                        <span className="font-bold text-sm text-slate-800">
                          {formatRevenue(item.revenue)} DZD
                        </span>
                        <p className="text-[10px] text-slate-400">
                          {item.order_count} order{item.order_count !== 1 ? "s" : ""}
                        </p>
                        <div className="h-1 w-full bg-slate-100 rounded-full mt-1.5 overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full transition-all duration-700"
                            style={{ width: `${Math.max(pct, 3)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
        </div>
      </div>

      {/* Export CTA */}
      <div className="p-6 border-t border-neutral-light bg-neutral-light/30">
        <button
          type="button"
          className="w-full flex items-center justify-center gap-2 bg-white border border-slate-300 text-slate-700 font-semibold py-3 rounded-lg hover:bg-slate-50 hover:border-slate-400 transition-all shadow-sm text-sm"
        >
          <span className="material-icons text-sm">download</span>
          Export Full Dataset (CSV)
        </button>
      </div>
    </aside>
  );
}