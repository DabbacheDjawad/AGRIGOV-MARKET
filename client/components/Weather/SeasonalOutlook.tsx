import Image from "next/image";
import { seasonalInsights, SEASONAL_MAP_URL } from "../../types/Weather";

interface Props {
  zoneName: string;
}

export default function SeasonalOutlookWidget({ zoneName }: Props) {
  return (
    <div className="bg-white dark:bg-surface-dark rounded-xl overflow-hidden border border-gray-200 dark:border-primary/20 flex flex-col max-h-125">
      {/* Map header */}
      <div className="relative h-48 shrink-0">
        <Image
          src={SEASONAL_MAP_URL}
          alt="Satellite view of agricultural fields showing crop zones"
          fill
          className="object-cover opacity-60"
          sizes="(max-width: 1024px) 100vw, 33vw"
        />
        <div className="absolute inset-0 bg-linear-to-t from-surface-dark to-transparent" />
        <div className="absolute bottom-4 left-4">
          <h3 className="font-bold text-lg text-white">Seasonal Outlook</h3>
          <p className="text-sm text-primary">{zoneName}</p>
        </div>
      </div>

      {/* Insights */}
      <div className="p-6 grow flex flex-col gap-4">
        {seasonalInsights.map((item) => (
          <div key={item.id} className="flex items-start gap-3">
            <span className={`material-icons mt-1 ${item.iconColor}`}>{item.icon}</span>
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white">{item.title}</h4>
              <p className="text-sm text-gray-400 mt-1">{item.body}</p>
            </div>
          </div>
        ))}

        <div className="mt-auto">
          <button
            type="button"
            className="w-full py-3 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/50 rounded-lg transition-colors text-sm font-bold uppercase tracking-wide"
          >
            Download Regional Report
          </button>
        </div>
      </div>
    </div>
  );
}