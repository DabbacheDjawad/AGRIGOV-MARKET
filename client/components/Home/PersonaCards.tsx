import Link from "next/link";
import type { PersonaCard } from "@/types/Home";

interface Props {
  cards: PersonaCard[];
}

export default function PersonaCards({ cards }: Props) {
  return (
    <div className="relative z-20 -mt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card) => (
          <div
            key={card.id}
            className="group bg-surface-light dark:bg-surface-dark p-8 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 hover:border-primary/50 transition-all hover:-translate-y-1"
          >
            <div
              className={`h-14 w-14 rounded-lg flex items-center justify-center mb-6 transition-colors ${card.iconBgLight} ${card.iconBgDark} ${card.iconColorLight} ${card.iconColorDark} ${card.hoverBg} ${card.hoverText}`}
            >
              <span className="material-icons text-3xl">{card.icon}</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{card.title}</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6 text-sm leading-relaxed">
              {card.description}
            </p>
            <Link
              href={card.href}
              className={`inline-flex items-center text-sm font-bold group-hover:underline ${card.ctaColor}`}
            >
              {card.cta}
              <span className="material-icons text-sm ml-1">arrow_forward</span>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}