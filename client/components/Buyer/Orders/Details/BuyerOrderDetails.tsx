"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import BuyerLayout from "../../BuyerLayout";
import {
  ApiOrder,
  BuyerReview,
  fmtDZD,
  fmtDateTime,
  parseFarmName,
  ORDER_STATUS_BADGE,
  ORDER_STATUS_ICON,
  ORDER_STATUS_LABEL,
} from "@/types/BuyerDashboard";
import { buyerApi, ApiError } from "@/lib/api";

// ─── Star rating component (polished) ────────────────────────────────────
const StarRating = ({
  rating,
  onChange,
  disabled,
}: {
  rating: number;
  onChange?: (r: number) => void;
  disabled?: boolean;
}) => {
  const stars = [1, 2, 3, 4, 5];
  return (
    <div className="flex items-center gap-1.5">
      {stars.map((star) => (
        <button
          key={star}
          type="button"
          disabled={disabled}
          onClick={() => onChange?.(star)}
          className={`text-2xl transition-all duration-200 ease-out ${
            disabled
              ? "cursor-not-allowed opacity-70"
              : "cursor-pointer hover:scale-125 hover:brightness-110 active:scale-95"
          } ${
            star <= rating
              ? "text-amber-400 drop-shadow-glow"
              : "text-slate-300 dark:text-slate-600"
          }`}
          aria-label={`${star} star${star > 1 ? "s" : ""}`}
        >
          <span className="material-symbols-outlined">star</span>
        </button>
      ))}
    </div>
  );
};

// ─── Main page (styling lifted) ─────────────────────────────────────────
export default function OrderDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [order, setOrder] = useState<ApiOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dlLoading, setDlLoading] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  // ── Review state per product item ──────────────────────────────────────
  type ReviewFormState = {
    visible: boolean;
    rating: number;
    comment: string;
    submitting: boolean;
    submitted: boolean;
    error: string | null;
  };
  const [reviewForms, setReviewForms] = useState<
    Record<number, ReviewFormState>
  >({});

  const BASE =
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ??
    "http://localhost:8000";

  const fetchOrder = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await buyerApi.orderDetail(Number(id));
      setOrder(data);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Failed to load order details.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  // ── Invoice download (unchanged) ────────────────────────────────────────
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

  // ── Cancel order (unchanged) ──────────────────────────────────────────
  const handleCancel = async () => {
    if (!order || !confirm("Are you sure you want to cancel this order?"))
      return;
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

  // ── Open / close review form for a given item ──────────────────────────
  const toggleReviewForm = (itemId: number) => {
    setReviewForms((prev) => ({
      ...prev,
      [itemId]: {
        visible: !prev[itemId]?.visible,
        rating: prev[itemId]?.rating ?? 0,
        comment: prev[itemId]?.comment ?? "",
        submitting: false,
        submitted: prev[itemId]?.submitted ?? false,
        error: null,
      },
    }));
  };

  // ── Update rating / comment ────────────────────────────────────────────
  const updateReviewField = (
    itemId: number,
    field: "rating" | "comment",
    value: any,
  ) => {
    setReviewForms((prev) => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        [field]: value,
      },
    }));
  };

  // ── Submit review (unchanged) ─────────────────────────────────────────
  const submitReview = async (itemId: number, productId: number) => {
    const form = reviewForms[itemId];
    if (!form || form.rating === 0) {
      alert("Please select a rating.");
      return;
    }

    setReviewForms((prev) => ({
      ...prev,
      [itemId]: { ...prev[itemId], submitting: true, error: null },
    }));

    try {
      await buyerApi.createReview(productId, form.rating, form.comment.trim());

      setReviewForms((prev) => ({
        ...prev,
        [itemId]: {
          ...prev[itemId],
          submitting: false,
          submitted: true,
          visible: false,
        },
      }));
    } catch (err) {
      setReviewForms((prev) => ({
        ...prev,
        [itemId]: {
          ...prev[itemId],
          submitting: false,
          error:
            err instanceof ApiError ? err.message : "Review submission failed.",
        },
      }));
    }
  };

  // ── Loading skeleton (styled) ────────────────────────────────────────
  if (isLoading) {
    return (
      <BuyerLayout>
        <div className="max-w-3xl mx-auto mt-10 space-y-6 animate-pulse">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-full" />
            <div className="space-y-2">
              <div className="h-7 w-44 bg-slate-200 dark:bg-slate-700 rounded-lg" />
              <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded-lg" />
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 h-72 bg-slate-200 dark:bg-slate-700 rounded-3xl" />
            <div className="h-72 bg-slate-200 dark:bg-slate-700 rounded-3xl" />
          </div>
        </div>
      </BuyerLayout>
    );
  }

  // ── Error / not found ─────────────────────────────────────────────────
  if (error || !order) {
    return (
      <BuyerLayout>
        <div className="max-w-3xl mx-auto mt-20 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full mb-6">
            <span className="material-symbols-outlined text-5xl text-slate-400">
              error
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white">
            {error || "Order not found"}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            We couldn’t retrieve this order. It may have been removed or the link
            is invalid.
          </p>
          <Link
            href="/buyer/orders"
            className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 bg-primary/10 dark:bg-primary/20 text-primary font-semibold rounded-xl hover:bg-primary/20 dark:hover:bg-primary/30 transition-colors"
          >
            <span className="material-symbols-outlined text-lg">arrow_back</span>
            Back to Orders
          </Link>
        </div>
      </BuyerLayout>
    );
  }

  const canCancel = order.allowed_statuses.includes("cancelled");
  const isDelivered = order.status === "delivered";

  // Order progress steps for visual enhancement
  const statusSteps = ["pending", "confirmed", "in_transit", "delivered"];
  const currentStepIndex = statusSteps.indexOf(order.status);

  return (
    <BuyerLayout>
      <div className="max-w-5xl mx-auto space-y-8 pb-10">
        {/* ── Header with status progress ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-white/80 dark:hover:bg-earth-800/60 rounded-xl transition-all shadow-sm hover:shadow-md"
              aria-label="Go back"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-slate-800 dark:text-white">
                Order Details
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                ID: #{order.id} • {fmtDateTime(order.created_at)}
              </p>
            </div>
          </div>

          {/* Compact progress indicator */}
          <div className="flex items-center gap-1.5">
            {statusSteps.map((step, idx) => (
              <div key={step} className="flex items-center">
                <div
                  className={`
                    w-3 h-3 rounded-full transition-all duration-700
                    ${
                      idx <= currentStepIndex
                        ? "bg-primary shadow-primary/30 shadow-sm scale-110"
                        : "bg-slate-200 dark:bg-slate-700"
                    }
                  `}
                />
                {idx < statusSteps.length - 1 && (
                  <div
                    className={`w-6 h-0.5 ${
                      idx < currentStepIndex
                        ? "bg-primary"
                        : "bg-slate-200 dark:bg-slate-700"
                    }`}
                  />
                )}
              </div>
            ))}
            <span className="ml-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {ORDER_STATUS_LABEL[order.status]}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Items Card (glass effect) */}
            <div className="bg-white/90 backdrop-blur-sm dark:bg-neutral-dark/90 rounded-3xl border border-neutral-light/50 dark:border-border-dark shadow-xl shadow-slate-200/50 dark:shadow-black/10 overflow-hidden transition-all">
              <div className="p-5 sm:p-6 border-b border-neutral-light dark:border-border-dark flex justify-between items-center bg-slate-50/50 dark:bg-earth-900/20">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">
                    package_2
                  </span>
                  <h3 className="font-bold text-slate-700 dark:text-slate-200">
                    Purchased Items
                  </h3>
                </div>
                <span className="text-xs font-bold text-slate-500 bg-white dark:bg-earth-800 px-3 py-1 rounded-full shadow-sm">
                  {order.items.length} {order.items.length === 1 ? "Item" : "Items"}
                </span>
              </div>
              <div className="divide-y divide-neutral-light dark:divide-border-dark">
                {order.items.map((item) => {
                  const reviewState = reviewForms[item.id] ?? {
                    visible: false,
                    rating: 0,
                    comment: "",
                    submitting: false,
                    submitted: false,
                    error: null,
                  };

                  return (
                    <div
                      key={item.id}
                      className="p-5 sm:p-6 hover:bg-slate-50/50 dark:hover:bg-earth-900/20 transition-colors"
                    >
                      {/* Item row */}
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center shadow-inner">
                            <span className="material-symbols-outlined text-primary text-2xl">
                              inventory_2
                            </span>
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 dark:text-slate-100 capitalize text-lg">
                              {item.product.title}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                              <span className="material-symbols-outlined text-sm">
                                category
                              </span>
                              {item.product.category_name} • {item.quantity}{" "}
                              {item.quantity > 1 ? "units" : "unit"}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold font-mono text-base text-slate-800 dark:text-white">
                            {fmtDZD(item.total_price)}
                          </p>
                          <p className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider">
                            DZD
                          </p>
                        </div>
                      </div>

                      {/* Review section (only if delivered) */}
                      {isDelivered && !item.product.has_review && (
                        <div className="mt-5 pt-5 border-t border-dashed border-slate-200 dark:border-slate-700">
                          {reviewState.submitted ? (
                            <div className="flex items-center gap-2 text-green-600 dark:text-green-400 animate-slide-up">
                              <span className="material-symbols-outlined text-xl">
                                check_circle
                              </span>
                              <span className="text-sm font-medium">
                                Thank you! Your review has been submitted.
                              </span>
                            </div>
                          ) : !reviewState.visible ? (
                            <button
                              onClick={() => toggleReviewForm(item.id)}
                              className="group inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-all"
                            >
                              <span className="material-symbols-outlined text-lg group-hover:scale-110 transition-transform">
                                rate_review
                              </span>
                              Write a Review
                            </button>
                          ) : (
                            <div className="space-y-4 animate-fade-in">
                              <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
                                  <span className="material-symbols-outlined text-sm">
                                    star
                                  </span>
                                  Your Rating
                                </label>
                                <StarRating
                                  rating={reviewState.rating}
                                  onChange={(r) =>
                                    updateReviewField(item.id, "rating", r)
                                  }
                                  disabled={reviewState.submitting}
                                />
                              </div>
                              <div>
                                <label className="text-xs font-bold text-slate-500 uppercase block mb-1.5">
                                  Comment (optional)
                                </label>
                                <textarea
                                  rows={3}
                                  className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-neutral-dark p-4 text-sm resize-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all outline-none placeholder:text-slate-400"
                                  placeholder="Share your experience with this product..."
                                  value={reviewState.comment}
                                  onChange={(e) =>
                                    updateReviewField(
                                      item.id,
                                      "comment",
                                      e.target.value,
                                    )
                                  }
                                  disabled={reviewState.submitting}
                                />
                              </div>
                              {reviewState.error && (
                                <div className="flex items-center gap-2 text-red-500 text-xs bg-red-50 dark:bg-red-900/20 p-2 rounded-xl">
                                  <span className="material-symbols-outlined text-sm">
                                    error
                                  </span>
                                  {reviewState.error}
                                </div>
                              )}
                              <div className="flex items-center gap-3 pt-1">
                                <button
                                  onClick={() =>
                                    submitReview(
                                      item.id,
                                      item.product.product_id,
                                    )
                                  }
                                  disabled={
                                    reviewState.submitting ||
                                    reviewState.rating === 0
                                  }
                                  className="px-6 py-2.5 bg-primary text-slate-900 font-bold rounded-xl text-sm hover:shadow-lg hover:shadow-primary/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 active:scale-95"
                                >
                                  {reviewState.submitting && (
                                    <span className="material-symbols-outlined animate-spin text-base">
                                      progress_activity
                                    </span>
                                  )}
                                  {reviewState.submitting
                                    ? "Submitting..."
                                    : "Submit Review"}
                                </button>
                                <button
                                  onClick={() => toggleReviewForm(item.id)}
                                  disabled={reviewState.submitting}
                                  className="text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors font-medium"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                      {item.product.has_review && (
                        <div className="mt-5 pt-5 border-t border-dashed border-slate-200 dark:border-slate-700 flex items-center gap-2 text-slate-400 text-sm">
                          <span className="material-symbols-outlined text-base text-green-500">
                            check_circle
                          </span>
                          You already reviewed this product
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Farm Details (elegant card) */}
            <div className="bg-linear-to-br from-slate-50 to-white dark:from-earth-800/30 dark:to-neutral-dark/80 rounded-3xl p-5 sm:p-6 border border-dashed border-slate-300 dark:border-slate-700 flex items-center gap-4 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-white dark:bg-neutral-dark flex items-center justify-center shadow-md">
                <span className="material-symbols-outlined text-primary text-2xl">
                  storefront
                </span>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Producer
                </p>
                <p className="font-bold text-lg text-slate-800 dark:text-white">
                  {parseFarmName(order.farm)}
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar: Summary & Actions */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-neutral-dark rounded-3xl border border-neutral-light dark:border-border-dark shadow-xl shadow-slate-200/50 dark:shadow-black/10 p-6 space-y-6 transition-all">
              {/* Status Badge */}
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase mb-3">
                  Order Status
                </p>
                <div
                  className={`flex items-center gap-3 p-3 rounded-2xl ${ORDER_STATUS_BADGE[order.status]} shadow-sm`}
                >
                  <span className="material-symbols-outlined text-xl">
                    {ORDER_STATUS_ICON[order.status]}
                  </span>
                  <span className="font-bold text-sm">
                    {ORDER_STATUS_LABEL[order.status]}
                  </span>
                </div>
              </div>

              {/* Total Amount */}
              <div className="pt-4 border-t border-neutral-light dark:border-border-dark">
                <p className="text-xs font-bold text-slate-400 uppercase mb-1">
                  Total Amount
                </p>
                <p className="text-3xl font-black font-mono text-slate-900 dark:text-white tracking-tight">
                  {fmtDZD(parseFloat(order.total_price))}
                  <span className="text-lg font-semibold ml-1 text-slate-400">
                    DZD
                  </span>
                </p>
              </div>

              {/* Actions */}
              <div className="space-y-3 pt-2">
                {order.status === "delivered" && (
                  <button
                    onClick={handleDownloadInvoice}
                    disabled={dlLoading}
                    className="w-full bg-primary text-slate-900 font-bold py-3.5 rounded-2xl text-sm flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-primary/30 transition-all disabled:opacity-60 active:scale-[0.98]"
                  >
                    <span
                      className={`material-symbols-outlined text-lg ${dlLoading && "animate-spin"}`}
                    >
                      {dlLoading ? "progress_activity" : "download"}
                    </span>
                    {dlLoading ? "Processing..." : "Download Invoice"}
                  </button>
                )}

                {canCancel && (
                  <button
                    onClick={handleCancel}
                    disabled={isCancelling}
                    className="w-full border-2 border-red-100 dark:border-red-900/40 text-red-600 dark:text-red-400 font-bold py-3 rounded-2xl text-sm flex items-center justify-center gap-2 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
                  >
                    <span
                      className={`material-symbols-outlined text-lg ${isCancelling && "animate-spin"}`}
                    >
                      {isCancelling ? "progress_activity" : "block"}
                    </span>
                    {isCancelling ? "Cancelling..." : "Cancel Order"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </BuyerLayout>
  );
}