import type { StatCard } from "@/types/Logistics";

interface Props {
  cards: StatCard[];
}

export default function LogisticsStatCards({ cards }: Props) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.id}
          className="overflow-hidden rounded-xl bg-surface-light dark:bg-surface-dark border border-neutral-light dark:border-neutral-dark shadow-sm"
        >
          <div className="p-5">
            <div className="flex items-center">
              <div className="shrink-0">
                <span className={`material-icons text-3xl ${card.iconColor}`}>{card.icon}</span>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dt className="truncate text-sm font-medium text-slate-500 dark:text-slate-400">
                  {card.label}
                </dt>
                <dd className="text-lg font-bold text-slate-900 dark:text-white">{card.value}</dd>
              </div>
            </div>
          </div>
          <div className={`${card.footerBg} px-5 py-2`}>
            <p className={`text-xs font-medium ${card.footerText}`}>{card.footerNote}</p>
          </div>
        </div>
      ))}
    </div>
  );
}