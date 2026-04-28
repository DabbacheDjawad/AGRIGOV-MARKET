"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import BuyerLayout from "../BuyerLayout";
import type { ApiOrder, OrdersResponse } from "@/types/BuyerDashboard";
import {
  fmtDZD,
  fmtDate,
  fmtDateTime,
  parseFarmName,
  ORDER_STATUS_BADGE,
  ORDER_STATUS_LABEL,
  ORDER_STATUS_ICON,
} from "@/types/BuyerDashboard";
import { buyerApi, ApiError } from "@/lib/api";
import Link from "next/link";

const PAGE_SIZE = 8;
const STATUS_FILTERS = [
  "all",
  "pending",
  "confirmed",
  "in_transit",
  "delivered",
  "cancelled",
] as const;
type StatusFilter = (typeof STATUS_FILTERS)[number];

function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700 ${className ?? ""}`}
    />
  );
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${ORDER_STATUS_BADGE[status] ?? "bg-slate-100 text-slate-500"}`}
    >
      <span className="material-symbols-outlined text-[12px] leading-none">
        {ORDER_STATUS_ICON[status] ?? "help"}
      </span>
      {ORDER_STATUS_LABEL[status] ?? status}
    </span>
  );
}

// ─── Order Detail Panel ───────────────────────────────────────────────────────

function OrderDetailPanel({
  order,
  onClose,
  onCancel,
  isCancelling,
}: {
  order: ApiOrder;
  onClose: () => void;
  onCancel: (id: number) => void;
  isCancelling: boolean;
}) {
  const [dlLoading, setDlLoading] = useState(false);
  const BASE =
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ??
    "http://localhost:8000";

  const handleDownloadInvoice = async () => {
    setDlLoading(true);
    try {
      const token = localStorage.getItem("access");
      const res = await fetch(`${BASE}/api/orders/${order.id}/invoice/`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error("Invoice unavailable");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `invoice-order-${order.id}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert("Could not download invoice. Please try again.");
    } finally {
      setDlLoading(false);
    }
  };

  const canCancel = order.allowed_statuses.includes("cancelled");
  const total = parseFloat(order.total_price);

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative w-full max-w-md bg-white dark:bg-neutral-dark h-full overflow-y-auto shadow-2xl flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-neutral-dark border-b border-neutral-light dark:border-border-dark px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="font-bold text-lg">Order #{order.id}</h2>
            <p className="text-xs text-slate-500">
              {fmtDateTime(order.created_at)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-neutral-50 dark:hover:bg-earth-800 transition-colors"
            aria-label="Close"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="p-6 space-y-6 flex-1">
          {/* Status */}
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
              Status
            </p>
            <StatusBadge status={order.status} />
          </div>

          {/* Farm */}
          <div className="bg-neutral-50 dark:bg-earth-800 rounded-xl p-4 flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-primary text-[20px]">
                storefront
              </span>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                Farm
              </p>
              <p className="font-bold text-slate-800 dark:text-slate-100">
                {parseFarmName(order.farm)}
              </p>
            </div>
          </div>

          {/* Items */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">
              Items ({order.items.length})
            </p>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-4 p-3 bg-neutral-50 dark:bg-earth-800 rounded-xl"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-sm text-slate-800 dark:text-slate-100 truncate capitalize">
                      {item.product.title}
                    </p>
                    <p className="text-[10px] text-slate-400 capitalize">
                      {item.product.category_name ?? "—"} ·{" "}
                      {item.product.season} · ×{item.quantity} units
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-bold text-sm font-mono">
                      {fmtDZD(item.total_price)}
                    </p>
                    <p className="text-[10px] text-slate-400">DZD</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="bg-neutral-50 dark:bg-earth-800 rounded-xl p-4 flex justify-between items-center">
            <p className="text-sm font-bold text-slate-500">Total Paid</p>
            <p className="text-2xl font-extrabold font-mono text-slate-900 dark:text-slate-100">
              {fmtDZD(total)}{" "}
              <span className="text-sm font-normal text-slate-400">DZD</span>
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-3 pt-4 border-t border-neutral-100 dark:border-border-dark">
            {/* ── NEW: View Full Details Button ── */}
            <Link
              href={`/buyer/dashboard/orders/${order.id}`}
              className="w-full flex items-center justify-center gap-2 border-2 border-slate-200 dark:border-border-dark text-slate-700 dark:text-slate-200 font-bold py-2.5 rounded-xl text-sm hover:bg-slate-50 dark:hover:bg-earth-800 transition-colors"
            >
              <span className="material-symbols-outlined text-base">
                visibility
              </span>
              View Full Details & Reviews
            </Link>

            {/* Existing Invoice Button */}
            {order.status === "delivered" && (
              <button
                onClick={handleDownloadInvoice}
                disabled={dlLoading}
                className="w-full flex items-center justify-center gap-2 bg-primary text-slate-900 font-bold py-3 rounded-xl text-sm hover:opacity-90 active:scale-95 transition-all disabled:opacity-60"
              >
                {dlLoading ? (
                  <span className="material-symbols-outlined text-base animate-spin">
                    progress_activity
                  </span>
                ) : (
                  <span className="material-symbols-outlined text-base">
                    download
                  </span>
                )}
                {dlLoading ? "Downloading…" : "Download Invoice PDF"}
              </button>
            )}

            {/* Existing Cancel Button */}
            {canCancel && (
              <button
                onClick={() => onCancel(order.id)}
                disabled={isCancelling}
                className="w-full flex items-center justify-center gap-2 border-2 border-red-200 dark:border-red-900/40 text-red-600 dark:text-red-400 font-bold py-2.5 rounded-xl text-sm hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
              >
                {isCancelling ? (
                  <span className="material-symbols-outlined text-base animate-spin">
                    progress_activity
                  </span>
                ) : (
                  <span className="material-symbols-outlined text-base">
                    cancel
                  </span>
                )}
                {isCancelling ? "Cancelling…" : "Cancel Order"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function BuyerOrdersPage() {
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<ApiOrder | null>(null);
  const [cancellingId, setCancellingId] = useState<number | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const cancelledRef = useRef(false);

  const fetchOrders = useCallback(() => {
    cancelledRef.current = false;
    setIsLoading(true);
    setError(null);
    buyerApi
      .orders(
        page,
        PAGE_SIZE,
        statusFilter === "all" ? undefined : statusFilter,
      )
      .then((res) => {
        if (cancelledRef.current) return;
        setOrders(res.results);
        setTotalCount(res.count);
      })
      .catch((err: unknown) => {
        if (cancelledRef.current) return;
        setError(
          err instanceof ApiError ? err.message : "Failed to load orders.",
        );
      })
      .finally(() => {
        if (!cancelledRef.current) setIsLoading(false);
      });
    return () => {
      cancelledRef.current = true;
    };
  }, [page, statusFilter]);

  useEffect(fetchOrders, [fetchOrders]);

  const handleCancel = useCallback(
    async (id: number) => {
      setCancellingId(id);
      try {
        const updated = await buyerApi.cancelOrder(id);
        setOrders((prev) => prev.map((o) => (o.id === id ? updated : o)));
        if (selectedOrder?.id === id) setSelectedOrder(updated);
        setToast("Order cancelled successfully.");
        setTimeout(() => setToast(null), 3000);
      } catch (err) {
        setToast(
          err instanceof ApiError ? err.message : "Failed to cancel order.",
        );
        setTimeout(() => setToast(null), 3000);
      } finally {
        setCancellingId(null);
      }
    },
    [selectedOrder],
  );

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  return (
    <BuyerLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Orders & Invoices
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              {totalCount} order{totalCount !== 1 ? "s" : ""} total
            </p>
          </div>
        </div>

        {error && (
          <div
            role="alert"
            className="flex items-center gap-3 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700"
          >
            <span className="material-symbols-outlined text-base shrink-0">
              error
            </span>
            <span className="flex-1">{error}</span>
            <button
              onClick={fetchOrders}
              className="underline font-bold text-xs"
            >
              Retry
            </button>
          </div>
        )}

        {/* Filter tabs */}
        <div className="flex gap-1.5 overflow-x-auto scrollbar-hide bg-white dark:bg-neutral-dark border border-neutral-light dark:border-border-dark rounded-2xl p-2 shadow-sm">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              onClick={() => {
                setStatusFilter(s);
                setPage(1);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                statusFilter === s
                  ? "bg-primary text-slate-900"
                  : "text-slate-500 hover:bg-neutral-50 dark:hover:bg-earth-800"
              }`}
            >
              {s === "all" ? "All Orders" : (ORDER_STATUS_LABEL[s] ?? s)}
            </button>
          ))}
        </div>

        {/* Orders list */}
        <div className="bg-white dark:bg-neutral-dark rounded-2xl border border-neutral-light dark:border-border-dark shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="p-4 space-y-3">
              {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                <Skeleton key={i} className="h-20" />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="flex flex-col items-center py-16 text-slate-400">
              <span className="material-symbols-outlined text-5xl mb-3">
                inbox
              </span>
              <p className="text-sm font-medium">No orders found.</p>
            </div>
          ) : (
            <div className="divide-y divide-neutral-light dark:divide-border-dark">
              {orders.map((order) => {
                const farmName = parseFarmName(order.farm);
                const firstTitle = order.items[0]?.product.title ?? "—";
                const extraItems = order.items.length - 1;

                return (
                  <button
                    key={order.id}
                    type="button"
                    onClick={() => setSelectedOrder(order)}
                    className="w-full flex items-center gap-4 px-5 py-4 hover:bg-neutral-50 dark:hover:bg-earth-800 transition-colors text-left group"
                  >
                    {/* Icon */}
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                        order.status === "delivered"
                          ? "bg-primary/10"
                          : "bg-neutral-100 dark:bg-earth-800"
                      }`}
                    >
                      <span
                        className={`material-symbols-outlined text-[18px] ${
                          order.status === "delivered"
                            ? "text-primary"
                            : "text-slate-400"
                        }`}
                      >
                        {ORDER_STATUS_ICON[order.status] ?? "receipt_long"}
                      </span>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-sm text-slate-800 dark:text-slate-100">
                          Order #{order.id}
                        </p>
                        <StatusBadge status={order.status} />
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5 truncate">
                        {farmName} · {firstTitle}
                        {extraItems > 0 ? ` +${extraItems} more` : ""} ·{" "}
                        {fmtDate(order.created_at)}
                      </p>
                    </div>

                    {/* Amount */}
                    <div className="text-right shrink-0">
                      <p className="font-bold font-mono text-sm text-slate-800 dark:text-slate-100">
                        {fmtDZD(parseFloat(order.total_price))} DZD
                      </p>
                      {order.status === "delivered" && (
                        <p className="text-[10px] text-primary font-bold">
                          Invoice ready
                        </p>
                      )}
                    </div>

                    <span className="material-symbols-outlined text-slate-300 group-hover:text-primary transition-colors text-sm shrink-0">
                      arrow_forward_ios
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-5 py-4 border-t border-neutral-light dark:border-border-dark flex items-center justify-between">
              <p className="text-xs text-slate-500">
                Page <span className="font-bold">{page}</span> of{" "}
                <span className="font-bold">{totalPages}</span>
              </p>
              <div className="flex gap-2">
                <button
                  disabled={page === 1 || isLoading}
                  onClick={() => setPage((p) => p - 1)}
                  className="px-3 py-1.5 rounded-lg border border-neutral-light text-xs font-bold disabled:opacity-40 hover:bg-neutral-50 transition-colors"
                >
                  Previous
                </button>
                <button
                  disabled={page === totalPages || isLoading}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-3 py-1.5 rounded-lg bg-primary text-slate-900 text-xs font-bold disabled:opacity-40 hover:opacity-90 transition-opacity"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Detail panel */}
      {selectedOrder && (
        <OrderDetailPanel
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onCancel={handleCancel}
          isCancelling={cancellingId === selectedOrder.id}
        />
      )}

      {/* Toast */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 z-50"
        >
          <span className="material-symbols-outlined text-primary text-base">
            check_circle
          </span>
          <span className="font-medium text-sm">{toast}</span>
        </div>
      )}
    </BuyerLayout>
  );
}
