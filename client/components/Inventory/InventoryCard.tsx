import Image from "next/image";
import type { InventoryItem } from "@/types/Inventory";

interface Props {
  item: InventoryItem;
  onEdit: (id: string) => void;
}

const statusStyles: Record<string, string> = {
  "In Stock": "text-green-600 dark:text-primary",
  "Low Stock": "text-orange-600 dark:text-orange-400",
  "Out of Stock": "text-red-500",
};

const gradeStyles: Record<string, string> = {
  "Grade A": "bg-yellow-100 text-yellow-800 border-yellow-200",
  "Grade B": "bg-slate-100 text-slate-800 border-slate-200",
  Organic: "bg-green-100 text-green-800 border-green-200",
};

export default function InventoryCard({ item, onEdit }: Props) {
  return (
    <div className="group bg-white dark:bg-background-dark border border-earth-100 dark:border-white/10 rounded-xl overflow-hidden hover:shadow-lg hover:border-primary/50 transition-all duration-300">
      {/* Image */}
      <div className="relative h-40 overflow-hidden">
        <Image
          src={item.imageUrl}
          alt={item.imageAlt}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        {/* Status badge */}
        <div className="absolute top-3 right-3 bg-white/90 dark:bg-black/80 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold shadow-sm">
          <span className={statusStyles[item.status]}>{item.status}</span>
        </div>
        {/* Grade badge */}
        <div className="absolute top-3 left-3">
          <span
            className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${gradeStyles[item.grade]}`}
          >
            {item.grade}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-bold text-lg text-earth-800 dark:text-white leading-tight">
              {item.name}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Harvested: {item.harvestedDate}
            </p>
          </div>
          <button
            type="button"
            className="text-slate-400 hover:text-earth-800 dark:hover:text-white transition-colors"
            aria-label="More options"
          >
            <span className="material-icons text-lg">more_vert</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mt-4 py-3 border-t border-dashed border-slate-200 dark:border-white/10">
          <div>
            <p className="text-[10px] uppercase text-slate-400 font-semibold tracking-wider">
              Quantity
            </p>
            <p className="text-sm font-bold text-earth-800 dark:text-slate-200">{item.quantity}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase text-slate-400 font-semibold tracking-wider">
              {item.priceLabel}
            </p>
            <p className="text-sm font-bold text-earth-800 dark:text-slate-200">{item.priceValue}</p>
          </div>
        </div>

        {/* Edit button */}
        <div className="mt-3">
          <button
            type="button"
            onClick={() => onEdit(item.id)}
            className="w-full py-2 bg-primary/10 hover:bg-primary/20 text-primary-dark dark:text-primary text-xs font-bold rounded transition-colors uppercase tracking-wide"
          >
            Edit Details
          </button>
        </div>
      </div>
    </div>
  );
}