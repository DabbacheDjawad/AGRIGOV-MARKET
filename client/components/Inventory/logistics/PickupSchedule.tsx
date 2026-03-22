import type { PickupEvent } from "@/types/Logistics";

interface Props {
  events: PickupEvent[];
}

export default function PickupSchedule({ events }: Props) {
  return (
    <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-neutral-light dark:border-neutral-dark shadow-sm">
      <div className="p-4 border-b border-neutral-light dark:border-neutral-dark flex justify-between items-center">
        <h3 className="text-base font-semibold text-slate-900 dark:text-white">Upcoming Pickups</h3>
        <a
          href="#"
          className="text-sm text-primary-dark dark:text-primary hover:underline transition-colors"
        >
          View Calendar
        </a>
      </div>

      <div className="p-4 space-y-4">
        {events.map((event, i) => {
          const isLast = i === events.length - 1;
          return (
            <div key={event.id} className="relative flex gap-4">
              <div className="flex flex-col items-center">
                <div
                  className={`h-10 w-10 rounded-lg flex items-center justify-center font-bold text-xs text-center leading-tight shrink-0 ${
                    event.isToday
                      ? "bg-primary/20 text-primary-dark dark:text-primary"
                      : "bg-neutral-light dark:bg-neutral-dark text-slate-600 dark:text-slate-300"
                  }`}
                >
                  {event.dateLabel.split(" ").map((part, j) => (
                    <span key={j} className="block">
                      {part}
                    </span>
                  ))}
                </div>
                {!isLast && (
                  <div className="h-full w-px bg-neutral-light dark:bg-neutral-dark my-2" />
                )}
              </div>
              <div className={isLast ? "" : "pb-4"}>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                  {event.transporter}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {event.timeWindow}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Order {event.orderId} • {event.commodity}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}