import type { PriceRow } from "@/types/Home";

interface Props {
  rows: PriceRow[];
}

const trendBadge: Record<string, string> = {
  up: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  down: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  flat: "bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300",
};

export default function PriceTable({ rows }: Props) {
  return (
    <section className="py-20 bg-background-light dark:bg-background-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              Official Price Updates
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              Daily average wholesale prices across major national markets.
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <button
              type="button"
              className="px-4 py-2 bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium hover:border-primary transition-colors text-slate-700 dark:text-slate-200"
            >
              Download Report (PDF)
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-primary/10 text-primary-dark dark:text-primary border border-primary/20 rounded-lg text-sm font-medium hover:bg-primary/20 transition-colors flex items-center gap-1"
            >
              View All Markets
              <span className="material-icons text-sm">arrow_forward</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 dark:text-slate-400 uppercase bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  {["Commodity", "Market Region", "Unit", "Avg. Price", "Change (24h)", "Action"].map(
                    (h, i) => (
                      <th
                        key={h}
                        scope="col"
                        className={`px-6 py-4 font-semibold ${i === 5 ? "text-right" : ""}`}
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {rows.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                      <div className="flex items-center gap-3">
                        <div
                          className={`h-8 w-8 rounded flex items-center justify-center text-lg ${row.emojiBg}`}
                        >
                          {row.emoji}
                        </div>
                        {row.commodity}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{row.region}</td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{row.unit}</td>
                    <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white">
                      {row.price}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${trendBadge[row.trend]}`}
                      >
                        {row.change}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <a
                        href="#"
                        className="text-primary hover:text-primary-dark font-medium transition-colors"
                      >
                        Trade
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="bg-slate-50 dark:bg-slate-900/50 px-6 py-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Last updated: Today, 08:30 AM</span>
            <span>Data Source: Ministry Statistics Bureau</span>
          </div>
        </div>
      </div>
    </section>
  );
}