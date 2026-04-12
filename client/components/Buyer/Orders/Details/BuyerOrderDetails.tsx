"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import BuyerLayout from "../../BuyerLayout";
import { 
  ApiOrder, 
  fmtDZD, 
  fmtDateTime, 
  parseFarmName, 
  ORDER_STATUS_BADGE, 
  ORDER_STATUS_ICON, 
  ORDER_STATUS_LABEL 
} from "@/types/BuyerDashboard";
import { buyerApi, ApiError } from "@/lib/api";

export default function OrderDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  
  const [order, setOrder] = useState<ApiOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dlLoading, setDlLoading] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const BASE = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:8000";

  const fetchOrder = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await buyerApi.orderDetail(Number(id));
      setOrder(data);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load order details.");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  const handleDownloadInvoice = async () => {
    if (!order) return;
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

  const handleCancel = async () => {
    if (!order || !confirm("Are you sure you want to cancel this order?")) return;
    setIsCancelling(true);
    try {
      const updated = await buyerApi.cancelOrder(order.id);
      setOrder(updated);
    } catch (err) {
      alert(err instanceof ApiError ? err.message : "Failed to cancel order.");
    } finally {
      setIsCancelling(false);
    }
  };

  if (isLoading) {
    return (
      <BuyerLayout>
        <div className="max-w-3xl mx-auto mt-10 space-y-4">
          <div className="h-8 w-48 animate-pulse bg-slate-200 dark:bg-slate-700 rounded" />
          <div className="h-64 w-full animate-pulse bg-slate-200 dark:bg-slate-700 rounded-2xl" />
        </div>
      </BuyerLayout>
    );
  }

  if (error || !order) {
    return (
      <BuyerLayout>
        <div className="max-w-3xl mx-auto mt-20 text-center">
          <span className="material-symbols-outlined text-6xl text-slate-300">error</span>
          <h1 className="text-xl font-bold mt-4">{error || "Order not found"}</h1>
          <Link href="/buyer/orders" className="text-primary hover:underline mt-2 inline-block">
            Back to Orders
          </Link>
        </div>
      </BuyerLayout>
    );
  }

  const canCancel = order.allowed_statuses.includes("cancelled");

  return (
    <BuyerLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header Navigation */}
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 hover:bg-neutral-100 dark:hover:bg-earth-800 rounded-full transition-colors">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div>
            <h1 className="text-2xl font-black tracking-tight">Order Details</h1>
            <p className="text-sm text-slate-500">ID: #{order.id} • {fmtDateTime(order.created_at)}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Items Card */}
            <div className="bg-white dark:bg-neutral-dark rounded-3xl border border-neutral-light dark:border-border-dark shadow-sm overflow-hidden">
              <div className="p-6 border-b border-neutral-light dark:border-border-dark flex justify-between items-center">
                <h3 className="font-bold">Purchased Items</h3>
                <span className="text-xs font-bold text-slate-400 bg-slate-100 dark:bg-earth-800 px-2 py-1 rounded-md">
                  {order.items.length} Units
                </span>
              </div>
              <div className="divide-y divide-neutral-light dark:divide-border-dark">
                {order.items.map((item) => (
                  <div key={item.id} className="p-6 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary">inventory_2</span>
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 dark:text-slate-100 capitalize">{item.product.title}</p>
                        <p className="text-xs text-slate-500">
                          {item.product.category_name} • {item.quantity} units
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold font-mono text-sm">{fmtDZD(item.total_price)}</p>
                      <p className="text-[10px] text-slate-400 uppercase">DZD</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Farm Details */}
            <div className="bg-neutral-50 dark:bg-earth-800/50 rounded-3xl p-6 border border-dashed border-slate-300 dark:border-slate-700 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white dark:bg-neutral-dark flex items-center justify-center shadow-sm">
                <span className="material-symbols-outlined text-primary">storefront</span>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Producer</p>
                <p className="font-bold text-lg">{parseFarmName(order.farm)}</p>
              </div>
            </div>
          </div>

          {/* Sidebar: Summary & Actions */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-neutral-dark rounded-3xl border border-neutral-light dark:border-border-dark shadow-sm p-6 space-y-6">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase mb-3">Order Status</p>
                <div className={`flex items-center gap-2 p-3 rounded-2xl ${ORDER_STATUS_BADGE[order.status]}`}>
                  <span className="material-symbols-outlined">{ORDER_STATUS_ICON[order.status]}</span>
                  <span className="font-bold text-sm">{ORDER_STATUS_LABEL[order.status]}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-light dark:border-border-dark">
                <p className="text-xs font-bold text-slate-400 uppercase mb-1">Total Amount</p>
                <p className="text-3xl font-black font-mono text-slate-900 dark:text-white">
                  {fmtDZD(parseFloat(order.total_price))}
                  <span className="text-sm font-normal ml-1 text-slate-400">DZD</span>
                </p>
              </div>

              <div className="space-y-3 pt-2">
                {order.status === "delivered" && (
                  <button
                    onClick={handleDownloadInvoice}
                    disabled={dlLoading}
                    className="w-full bg-primary text-slate-900 font-bold py-3.5 rounded-2xl text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-60"
                  >
                    <span className={`material-symbols-outlined ${dlLoading && 'animate-spin'}`}>
                      {dlLoading ? 'progress_activity' : 'download'}
                    </span>
                    {dlLoading ? "Processing..." : "Download Invoice"}
                  </button>
                )}

                {canCancel && (
                  <button
                    onClick={handleCancel}
                    disabled={isCancelling}
                    className="w-full border-2 border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 font-bold py-3 rounded-2xl text-sm flex items-center justify-center gap-2 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors disabled:opacity-50"
                  >
                    <span className={`material-symbols-outlined ${isCancelling && 'animate-spin'}`}>
                      {isCancelling ? 'progress_activity' : 'block'}
                    </span>
                    {isCancelling ? "Cancelling..." : "Cancel Order"}
                  </button>
                )}
              </div>
            </div>

            {/* Support Box */}
            <div className="p-6 bg-slate-900 text-white rounded-3xl">
              <p className="text-sm font-bold mb-1">Need help with this order?</p>
              <p className="text-xs text-slate-400 mb-4">Contact our support for logistics or payment issues.</p>
              <button className="text-xs font-bold text-primary hover:underline">Open Support Ticket</button>
            </div>
          </div>
        </div>
      </div>
    </BuyerLayout>
  );
}