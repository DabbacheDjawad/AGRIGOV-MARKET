import type { TickerItem } from "@/types/Home";

interface Props {
  items: TickerItem[];
}

export default function MarketTicker({ items }: Props) {
  // Duplicate items for seamless loop
  const doubled = [...items, ...items];

  return (
    <div className="bg-surface-dark text-white py-2 overflow-hidden border-b border-primary/20 relative z-40">
      <div className="flex whitespace-nowrap animate-ticker gap-8 px-4 text-xs font-medium tracking-wide">
        <span className="flex items-center gap-1 text-primary shrink-0">LIVE MARKET:</span>
        {doubled.map((item, i) => (
          <span key={i} className="flex items-center gap-4 shrink-0">
            <span className="flex items-center gap-1">
              {item.emoji} {item.label}{" "}
              <span
                className={
                  item.trend === "up"
                    ? "text-primary"
                    : item.trend === "down"
                    ? "text-red-400"
                    : "text-slate-400"
                }
              >
                {item.trend === "up" ? "▲" : item.trend === "down" ? "▼" : "–"} {item.price}
              </span>
            </span>
            <span className="text-slate-500">|</span>
          </span>
        ))}
      </div>
    </div>
  );
}