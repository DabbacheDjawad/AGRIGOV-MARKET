import type { OrderStatus } from "@/types/Logistics";

interface Props {
  status: OrderStatus;
}

const badgeStyles: Record<OrderStatus, string> = {
  "Pending Pickup":
    "bg-yellow-50 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 ring-yellow-600/20",
  Loaded:
    "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 ring-blue-700/10",
  "In Transit":
    "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 ring-indigo-700/10",
  Delivered:
    "bg-primary/20 dark:bg-primary/20 text-green-800 dark:text-primary ring-primary/30",
  "Issue Reported":
    "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 ring-red-600/10",
};

export default function OrderStatusBadge({ status }: Props) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${badgeStyles[status]}`}
    >
      {status}
    </span>
  );
}