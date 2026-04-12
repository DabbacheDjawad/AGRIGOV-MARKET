"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import BuyerLayout from "../BuyerLayout";
import type { BuyerReview, ReviewsResponse } from "@/types/BuyerDashboard";
import { fmtDateTime } from "@/types/BuyerDashboard";
import { buyerApi, ApiError } from "@/lib/api";

const PAGE_SIZE = 8;

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700 ${className ?? ""}`} />;
}

function StarRating({ rating, max = 5 }: { rating: number; max?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <span
          key={i}
          className={`material-symbols-outlined text-amber-400 text-base`}
          style={{ fontVariationSettings: i < rating ? "'FILL' 1" : "'FILL' 0" }}
        >
          star
        </span>
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: BuyerReview }) {
  const product = review.product;
  const image   = product.images[0]?.image;
  const mName   = product.ministry_product.name;
  const farm    = product.farm.name;

  return (
    <div className="bg-white dark:bg-neutral-dark rounded-2xl border border-neutral-light dark:border-border-dark shadow-sm p-5 space-y-4">
      {/* Product */}
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-xl overflow-hidden bg-neutral-100 dark:bg-earth-800 shrink-0 relative">
          {image ? (
            <Image src={image} alt={mName} fill className="object-cover" sizes="56px" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="material-symbols-outlined text-slate-300 text-3xl">eco</span>
            </div>
          )}
        </div>
        <div className="min-w-0">
          <p className="font-bold text-slate-800 dark:text-slate-100 truncate capitalize">{mName}</p>
          <p className="text-xs text-slate-500 mt-0.5">
            <span className="material-symbols-outlined text-[13px] align-middle mr-0.5">storefront</span>
            {farm} · <span className="capitalize">{product.category_name}</span>
          </p>
          <p className="text-[10px] text-slate-400 mt-0.5">
            {parseFloat(product.unit_price).toLocaleString("fr-DZ")} DZD / unit · {product.stock} in stock
          </p>
        </div>
      </div>

      {/* Rating & comment */}
      <div className="border-t border-neutral-light dark:border-border-dark pt-4">
        <div className="flex items-center justify-between mb-2">
          <StarRating rating={review.rating} />
          <span className="text-[10px] text-slate-400">{fmtDateTime(review.created_at)}</span>
        </div>
        {review.comment ? (
          <p className="text-sm text-slate-700 dark:text-slate-300 italic">"{review.comment}"</p>
        ) : (
          <p className="text-xs text-slate-400 italic">No comment provided.</p>
        )}
      </div>

      {/* Location */}
      <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
        <span className="material-symbols-outlined text-[12px]">location_on</span>
        <span className="capitalize">{product.farm.wilaya}, {product.farm.baladiya}</span>
      </div>
    </div>
  );
}

export default function BuyerReviewsPage() {
  const [reviews,   setReviews]   = useState<BuyerReview[]>([]);
  const [total,     setTotal]     = useState(0);
  const [page,      setPage]      = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error,     setError]     = useState<string | null>(null);
  const cancelledRef = useRef(false);

  useEffect(() => {
    cancelledRef.current = false;
    setIsLoading(true);
    setError(null);
    buyerApi.reviews(page, PAGE_SIZE)
      .then(res => { if (!cancelledRef.current) { setReviews(res.results); setTotal(res.count); } })
      .catch((err: unknown) => { if (!cancelledRef.current) setError(err instanceof ApiError ? err.message : "Failed to load reviews."); })
      .finally(() => { if (!cancelledRef.current) setIsLoading(false); });
    return () => { cancelledRef.current = true; };
  }, [page]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const avgRating  = reviews.length > 0
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : "—";

  return (
    <BuyerLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">My Reviews</h1>
            <p className="text-slate-500 text-sm mt-1">{total} review{total !== 1 ? "s" : ""} left</p>
          </div>
          <Link href="/marketplace" className="flex items-center gap-2 bg-primary text-slate-900 px-4 py-2.5 rounded-xl font-bold text-sm hover:opacity-90 transition-all shadow-sm">
            <span className="material-symbols-outlined text-[16px]">storefront</span>
            Shop & Review
          </Link>
        </div>

        {error && (
          <div role="alert" className="flex items-center gap-3 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            <span className="material-symbols-outlined text-base shrink-0">error</span>
            {error}
          </div>
        )}

        {/* Stats strip */}
        {!isLoading && reviews.length > 0 && (
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Reviews",    value: String(total),    icon: "rate_review",   color: "text-primary" },
              { label: "Avg Rating", value: `${avgRating}/5`, icon: "star",          color: "text-amber-500" },
              { label: "Products",   value: String(new Set(reviews.map(r => r.product.id)).size), icon: "eco", color: "text-green-500" },
            ].map(s => (
              <div key={s.label} className="bg-white dark:bg-neutral-dark rounded-2xl border border-neutral-light dark:border-border-dark p-4 flex items-center gap-3 shadow-sm">
                <span className={`material-symbols-outlined ${s.color} text-2xl`}>{s.icon}</span>
                <div>
                  <p className="text-lg font-extrabold text-slate-900 dark:text-slate-100">{s.value}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Reviews grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({length:4}).map((_,i)=><Skeleton key={i} className="h-52"/>)}
          </div>
        ) : reviews.length === 0 ? (
          <div className="flex flex-col items-center py-20 text-slate-400 bg-white dark:bg-neutral-dark rounded-2xl border border-neutral-light dark:border-border-dark">
            <span className="material-symbols-outlined text-6xl mb-4">star_border</span>
            <p className="text-base font-medium mb-2">No reviews yet</p>
            <p className="text-sm text-slate-400 mb-6">After receiving a delivery, share your feedback on the products.</p>
            <Link href="/marketplace" className="flex items-center gap-2 bg-primary text-slate-900 px-5 py-2.5 rounded-xl font-bold text-sm hover:opacity-90 transition-all">
              <span className="material-symbols-outlined text-[16px]">storefront</span>
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews.map(r => <ReviewCard key={r.id} review={r} />)}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-2">
            <p className="text-xs text-slate-500">Page <span className="font-bold">{page}</span> of <span className="font-bold">{totalPages}</span></p>
            <div className="flex gap-2">
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
                className="px-3 py-1.5 rounded-lg border border-neutral-light text-xs font-bold disabled:opacity-40 hover:bg-neutral-50 transition-colors">
                Previous
              </button>
              <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}
                className="px-3 py-1.5 rounded-lg bg-primary text-slate-900 text-xs font-bold disabled:opacity-40 hover:opacity-90 transition-opacity">
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </BuyerLayout>
  );
}