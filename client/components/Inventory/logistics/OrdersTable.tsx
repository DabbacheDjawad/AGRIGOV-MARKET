"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import OrderStatusBadge from "./OrderStatusBadge";
import type { LogisticsOrder, OrderStatus } from "@/types/Logistics";

interface Props {
  orders: LogisticsOrder[];
}

const STATUSES: Array<OrderStatus | "All Statuses"> = [
  "All Statuses",
  "Pending Pickup",
  "Loaded",
  "In Transit",
  "Delivered",
  "Issue Reported",
];

const PAGE_SIZE = 5;

export default function OrdersTable({ orders }: Props) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<OrderStatus | "All Statuses">("All Statuses");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        o.orderId.toLowerCase().includes(q) ||
        o.buyer.toLowerCase().includes(q) ||
        o.transporter.toLowerCase().includes(q);
      const matchStatus = status === "All Statuses" || o.status === status;
      return matchSearch && matchStatus;
    });
  }, [orders, search, status]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleStatus = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatus(e.target.value as OrderStatus | "All Statuses");
    setPage(1);
  };

  const selectClass =
    "block rounded-lg border-0 py-2 pl-3 pr-8 text-slate-900 ring-1 ring-inset ring-neutral-light focus:ring-2 focus:ring-primary dark:bg-surface-dark dark:text-white dark:ring-neutral-dark sm:text-sm sm:leading-6 outline-none";

  return (
    <div className="lg:col-span-2 space-y-4">
      {/* Filter bar */}
      <div className="bg-surface-light dark:bg-surface-dark p-4 rounded-xl border border-neutral-light dark:border-neutral-dark flex flex-wrap gap-3 items-center justify-between">
        <div className="relative grow max-w-md">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <span className="material-icons text-slate-400 text-lg">search</span>
          </div>
          <input
            type="text"
            value={search}
            onChange={handleSearch}
            placeholder="Search by Order ID, Buyer, or Transporter"
            className="block w-full rounded-lg border-0 py-2 pl-10 text-slate-900 ring-1 ring-inset ring-neutral-light placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary dark:bg-surface-dark dark:text-white dark:ring-neutral-dark sm:text-sm sm:leading-6 outline-none"
          />
        </div>
        <div className="flex gap-2">
          <select value={status} onChange={handleStatus} className={selectClass}>
            {STATUSES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-lg bg-white dark:bg-neutral-dark px-3 py-2 text-sm font-semibold text-slate-900 dark:text-white shadow-sm ring-1 ring-inset ring-neutral-light dark:ring-neutral-dark hover:bg-slate-50"
            aria-label="Filter"
          >
            <span className="material-icons text-lg">filter_list</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-neutral-light dark:border-neutral-dark overflow-hidden shadow-sm">
        <div className="min-w-full overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-light dark:divide-neutral-dark">
            <thead className="bg-neutral-light/30 dark:bg-neutral-dark/30">
              <tr>
                {["Order ID", "Buyer & Commodity", "Transporter", "Status", "Manifest", ""].map(
                  (h, i) => (
                    <th
                      key={i}
                      scope="col"
                      className={`py-3.5 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 ${
                        i === 0
                          ? "pl-4 pr-3 sm:pl-6 text-left"
                          : i === 5
                          ? "pl-3 pr-4 sm:pr-6 relative"
                          : "px-3 text-left"
                      }`}
                    >
                      {h || <span className="sr-only">Actions</span>}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-light dark:divide-neutral-dark bg-white dark:bg-surface-dark">
              {paginated.map((order) => (
                <tr
                  key={order.id}
                  className={`hover:bg-neutral-light/20 dark:hover:bg-neutral-dark/40 transition-colors group ${
                    order.hasIssue ? "bg-red-50/50 dark:bg-red-900/10" : ""
                  }`}
                >
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-slate-900 dark:text-white sm:pl-6">
                    {order.orderId}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500 dark:text-slate-400">
                    <div className="font-medium text-slate-900 dark:text-white">{order.buyer}</div>
                    <div className="text-xs text-slate-500">
                      {order.commodity} • {order.weight}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                      <span className="material-icons text-base">local_shipping</span>
                      {order.transporter}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm">
                    <OrderStatusBadge status={order.status} />
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500 dark:text-slate-400">
                    <Link
                      href="#"
                      className="text-primary-dark dark:text-primary hover:underline flex items-center gap-1 font-medium"
                    >
                      <span className="material-icons text-sm">description</span> View
                    </Link>
                  </td>
                  <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                    <button
                      type="button"
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
                      aria-label="More options"
                    >
                      <span className="material-icons">more_vert</span>
                    </button>
                  </td>
                </tr>
              ))}

              {paginated.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-sm text-slate-400">
                    No orders match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-surface-light dark:bg-surface-dark border-t border-neutral-light dark:border-neutral-dark px-4 py-3 flex items-center justify-between sm:px-6">
          <p className="text-sm text-slate-700 dark:text-slate-300">
            Showing{" "}
            <span className="font-medium">
              {filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}
            </span>{" "}
            to{" "}
            <span className="font-medium">{Math.min(page * PAGE_SIZE, filtered.length)}</span> of{" "}
            <span className="font-medium">{filtered.length}</span> orders
          </p>

          <nav aria-label="Pagination" className="isolate inline-flex -space-x-px rounded-md shadow-sm">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="relative inline-flex items-center rounded-l-md px-2 py-2 text-slate-400 ring-1 ring-inset ring-neutral-light dark:ring-neutral-dark hover:bg-slate-50 dark:hover:bg-neutral-dark disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <span className="sr-only">Previous</span>
              <span className="material-icons text-sm">chevron_left</span>
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setPage(n)}
                aria-current={n === page ? "page" : undefined}
                className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold transition-colors ${
                  n === page
                    ? "z-10 bg-primary text-black focus-visible:outline focus-visible:outline-primary"
                    : "text-slate-900 dark:text-white ring-1 ring-inset ring-neutral-light dark:ring-neutral-dark hover:bg-slate-50 dark:hover:bg-neutral-dark"
                }`}
              >
                {n}
              </button>
            ))}

            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="relative inline-flex items-center rounded-r-md px-2 py-2 text-slate-400 ring-1 ring-inset ring-neutral-light dark:ring-neutral-dark hover:bg-slate-50 dark:hover:bg-neutral-dark disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
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