import type { Order } from "@/types/Orders";
import OrderStatusBadge from "./OrderStatusBadge";

interface Props {
  orders: Order[];
  selectedId: string | null;
  page: number;
  totalCount: number;
  pageSize: number;
  onSelect: (order: Order) => void;
  onPageChange: (page: number) => void;
}

const PAGE_WINDOW = 3;

export default function OrdersTable({
  orders, selectedId, page, totalCount, pageSize, onSelect, onPageChange,
}: Props) {
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalCount);

  return (
    <div className="lg:col-span-2">
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden border border-gray-100 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                {["Order ID", "Date & Supplier", "Product", "Amount", "Status", ""].map((h, i) => (
                  <th
                    key={i}
                    scope="col"
                    className={`px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider ${i === 5 ? "relative" : "text-left"}`}
                  >
                    {h || <span className="sr-only">Actions</span>}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {orders.map((order) => {
                const isSelected = selectedId === order.id;
                return (
                  <tr
                    key={order.id}
                    onClick={() => onSelect(order)}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-primary/5 hover:bg-primary/10 border-l-4 border-primary"
                        : "hover:bg-gray-50 dark:hover:bg-gray-700 border-l-4 border-transparent"
                    }`}
                  >
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${isSelected ? "text-primary-dark" : "text-gray-900 dark:text-white"}`}>
                      {order.orderId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">{order.date}</div>
                      <div className="text-xs text-gray-500">{order.supplier}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">{order.product}</div>
                      <div className="text-xs text-gray-500">{order.productDetail}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      ${order.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <OrderStatusBadge status={order.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        type="button"
                        aria-label={`View ${order.orderId}`}
                        className="text-gray-400 hover:text-primary-dark transition-colors"
                      >
                        <span className="material-icons">chevron_right</span>
                      </button>
                    </td>
                  </tr>
                );
              })}

              {orders.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-sm text-gray-400">
                    No orders match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-white dark:bg-gray-800 px-4 py-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between sm:px-6">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Showing <span className="font-medium">{orders.length === 0 ? 0 : start}</span> to{" "}
            <span className="font-medium">{end}</span> of{" "}
            <span className="font-medium">{totalCount}</span> results
          </p>

          <nav aria-label="Pagination" className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
            <button
              type="button"
              onClick={() => onPageChange(Math.max(1, page - 1))}
              disabled={page === 1}
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <span className="sr-only">Previous</span>
              <span className="material-icons text-sm">chevron_left</span>
            </button>

            {Array.from({ length: Math.min(totalPages, PAGE_WINDOW) }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => onPageChange(n)}
                aria-current={n === page ? "page" : undefined}
                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium transition-colors ${
                  n === page
                    ? "z-10 bg-primary/20 border-primary text-primary-dark"
                    : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                {n}
              </button>
            ))}

            {totalPages > PAGE_WINDOW && (
              <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700">
                …
              </span>
            )}

            <button
              type="button"
              onClick={() => onPageChange(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <span className="sr-only">Next</span>
              <span className="material-icons text-sm">chevron_right</span>
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}