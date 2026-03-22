import type { CommodityCategory } from "@/types/Prices";

const badgeStyles: Record<CommodityCategory, string> = {
  Grains: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  Vegetables: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  Tubers: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  Fruits: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
};

export default function CategoryBadge({ category }: { category: CommodityCategory }) {
  return (
    <span
      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${badgeStyles[category]}`}
    >
      {category}
    </span>
  );
}