import type { RegionRanking } from "@/types/Regional";

interface Props {
  rankings: RegionRanking[];
  activeRegionId: string | null;
  onSelect: (id: string) => void;
}

export default function RegionalRankings({ rankings, activeRegionId, onSelect }: Props) {
  return (
    <aside className="w-96 bg-surface-light border-l border-neutral-light flex flex-col z-10 shadow-[-4px_0_24px_rgba(0,0,0,0.02)]">
      {/* Sticky header */}
      <div className="p-6 border-b border-neutral-light bg-surface-light sticky top-0">
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">
          National Supply
        </h2>
        <h3 className="text-xl font-bold text-slate-800">Regional Contribution</h3>
      </div>

      {/* Rankings list */}
      <div className="flex-1 overflow-y-auto p-6 pt-2">
        {/* Column headers */}
        <div className="grid grid-cols-12 gap-2 mb-3 px-2">
          <div className="col-span-1 text-[10px] font-bold text-slate-400 uppercase">#</div>
          <div className="col-span-6 text-[10px] font-bold text-slate-400 uppercase">Region</div>
          <div className="col-span-5 text-[10px] font-bold text-slate-400 uppercase text-right">
            Contribution
          </div>
        </div>

        <div className="space-y-2">
          {rankings.map((item) => {
            const isActive = activeRegionId === item.id;
            return (
              <div
                key={item.id}
                onClick={() => onSelect(item.id)}
                className={`bg-white border rounded-lg p-3 cursor-pointer group transition-all ${
                  isActive
                    ? "border-primary shadow-md"
                    : "border-slate-100 hover:border-primary/50 hover:shadow-md"
                }`}
              >
                <div className="grid grid-cols-12 gap-2 items-center">
                  {/* Rank */}
                  <div
                    className={`col-span-1 font-bold ${
                      isActive ? "text-primary" : "text-slate-300 group-hover:text-primary"
                    }`}
                  >
                    {String(item.rank).padStart(2, "0")}
                  </div>

                  {/* Name + crops */}
                  <div className="col-span-6">
                    <p className="font-bold text-sm text-slate-800">{item.name}</p>
                    <p className="text-[10px] text-slate-500">{item.crops}</p>
                  </div>

                  {/* Contribution bar */}
                  <div className="col-span-5 text-right">
                    <span className="font-bold text-sm text-slate-800">
                      {item.contribution}%
                    </span>
                    <div className="h-1 w-full bg-slate-100 rounded-full mt-1 overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-500"
                        style={{ width: `${item.contribution}%` }}
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
          className="w-full flex items-center justify-center gap-2 bg-white border border-slate-300 text-slate-700 font-semibold py-3 rounded-lg hover:bg-slate-50 hover:border-slate-400 transition-all shadow-sm"
        >
          <span className="material-icons text-sm">download</span>
          Export Full Dataset (CSV)
        </button>
      </div>
    </aside>
  );
}