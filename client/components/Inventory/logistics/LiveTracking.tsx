import Image from "next/image";

export default function LiveTracking() {
  return (
    <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-neutral-light dark:border-neutral-dark shadow-sm overflow-hidden">
      <div className="p-4 border-b border-neutral-light dark:border-neutral-dark">
        <h3 className="text-base font-semibold text-slate-900 dark:text-white">Live Tracking</h3>
      </div>

      {/* Map */}
      <div className="relative h-48 bg-slate-200">
        <Image
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBYcQi_k7Fe-pnfShTlu27GXu5yGvmZHw3ukFR6xLKcNZazsD_s_t7tvPUklNzlz-hDIPlxDZO23qGB3CumQklprXFi0slj6N4jOr0zI8e54VMKIMTfoULic6w9pKo7bsbBeOsbUF-aA39mxQhBX0XXpz_wWTZPI9NIKIaro35SabWBdSMCFM_MClGsvAMF3KKfPl_LTCoaUBs5UpIdXvo2fIJlAvnJLZQ9yI6qs3JPsLgEjVyEICSAhN4hGRQfOJJMPHXzsz62FWAy"
          alt="Map showing delivery routes"
          fill
          className="object-cover opacity-80"
          sizes="(max-width: 1024px) 100vw, 33vw"
        />

        {/* Animated map pin */}
        <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2">
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-primary" />
          </div>
          <div className="mt-1 bg-white dark:bg-surface-dark px-2 py-1 rounded shadow text-xs font-bold whitespace-nowrap">
            Order #3988
          </div>
        </div>
      </div>

      {/* Truck info */}
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="shrink-0 h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
            <span className="material-icons text-indigo-600 dark:text-indigo-400 text-sm">
              local_shipping
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-900 dark:text-white">
              Truck ID: TRK-8921
            </p>
            <p className="text-xs text-slate-500">20km away • Est. Arrival 45m</p>
          </div>
        </div>
      </div>
    </div>
  );
}