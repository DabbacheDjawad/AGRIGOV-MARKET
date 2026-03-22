import type { AuditEntry } from "@/types/Prices";

interface Props {
  entries: AuditEntry[];
}

export default function AuditLog({ entries }: Props) {
  return (
    <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-border-light dark:border-border-dark flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
          Recent Activity
        </h3>
        <a href="#" className="text-xs text-primary hover:text-primary-dark font-medium transition-colors">
          View All
        </a>
      </div>

      <ul className="divide-y divide-border-light dark:divide-border-dark max-h-96 overflow-y-auto">
        {entries.map((entry) => (
          <li
            key={entry.id}
            className="px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
          >
            <div className="flex space-x-3">
              {/* Avatar */}
              <div className="shrink-0">
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center ring-1 ring-white dark:ring-slate-800 ${entry.actorBg} ${entry.actorTextColor}`}
                >
                  <span className="material-icons text-sm">{entry.actorIcon}</span>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 space-y-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-slate-900 dark:text-white truncate">
                    {entry.actorName}
                  </h3>
                  <p className="text-xs text-slate-500 shrink-0 ml-2">{entry.timeAgo}</p>
                </div>
                <p
                  className="text-xs text-slate-500 dark:text-slate-400"
                  dangerouslySetInnerHTML={{
                    __html: entry.message.replace(
                      /<b>(.*?)<\/b>/g,
                      '<span class="font-medium text-slate-700 dark:text-slate-200">$1</span>'
                    ),
                  }}
                />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}