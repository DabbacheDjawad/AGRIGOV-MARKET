import type { OrderStatus } from "@/types/Orders";

const badgeStyles: Record<OrderStatus, string> = {
  Delivered: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  "In Transit": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  Pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  Cancelled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

export default function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${badgeStyles[status]}`}
    >
      {status}
    </span>
  );
}