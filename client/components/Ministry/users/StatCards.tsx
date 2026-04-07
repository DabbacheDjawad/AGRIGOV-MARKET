import type { ApiDashboardOverview } from '@/types/UserManagement';

interface Props {
  overview:     ApiDashboardOverview | null;
  pendingCount: number;
  isLoading:    boolean;
}

function SkeletonCard() {
  return (
    <div className="animate-pulse bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="flex justify-between items-start mb-2">
        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-24" />
        <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-10" />
      </div>
      <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-20 mt-3" />
      <div className="mt-4 w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
        <div className="bg-slate-200 dark:bg-slate-700 h-full w-1/2 rounded-full" />
      </div>
    </div>
  );
}

export default function UserStatCards({ overview, pendingCount, isLoading }: Props) {
  if (isLoading || !overview) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    );
  }

  // Build stat cards from live data
  const totalNonAdmin = overview.total_users;
  // Rough barPercent normalised against a ceiling (adjust if needed)
  const cards = [
    {
      label:      'Total Users',
      value:      totalNonAdmin.toLocaleString(),
      trend:      `+${overview.new_users_last_30_days} this month`,
      barPercent: Math.min((totalNonAdmin / 200) * 100, 100),
      highlight:  false,
    },
    {
      label:      'Total Products',
      value:      overview.total_products.toLocaleString(),
      trend:      'Active listings',
      barPercent: Math.min((overview.total_products / 100) * 100, 100),
      highlight:  false,
    },
    {
      label:      'Total Orders',
      value:      overview.total_orders.toLocaleString(),
      trend:      `${overview.monthly_revenue.toLocaleString('fr-DZ')} DZD / mo`,
      barPercent: Math.min((overview.total_orders / 50) * 100, 100),
      highlight:  false,
    },
    {
      label:      'Pending Requests',
      value:      pendingCount.toLocaleString(),
      trend:      'URGENT',
      barPercent: 0,
      highlight:  true,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card) =>
        card.highlight ? (
          <div key={card.label} className="bg-primary p-6 rounded-xl shadow-lg shadow-primary/20">
            <div className="flex justify-between items-start mb-2">
              <p className="text-slate-900 text-sm font-bold">{card.label}</p>
              <span className="bg-slate-900 text-primary px-2 py-0.5 rounded text-[10px] font-bold">
                {card.trend}
              </span>
            </div>
            <p className="text-slate-900 text-3xl font-black tracking-tight">{card.value}</p>
            <p className="mt-2 text-slate-900/70 text-xs font-medium">Requires validation</p>
          </div>
        ) : (
          <div
            key={card.label}
            className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm"
          >
            <div className="flex justify-between items-start mb-2">
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{card.label}</p>
              <span className="text-emerald-500 text-xs font-bold">{card.trend}</span>
            </div>
            <p className="text-3xl font-bold tracking-tight">{card.value}</p>
            <div className="mt-4 w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-primary h-full transition-all duration-500"
                style={{ width: `${card.barPercent}%` }}
              />
            </div>
          </div>
        ),
      )}
    </div>
  );
}