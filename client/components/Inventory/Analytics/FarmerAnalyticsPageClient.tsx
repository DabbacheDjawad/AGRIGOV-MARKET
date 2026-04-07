"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type {
  FarmerDashboardResponse,
  RevenueDataPoint,
  OrdersDataPoint,
  TopProduct,
  CategoryDataPoint,
} from "@/types/FarmerAnalytics";
import { formatDZD, shortMonthDay } from "@/types/FarmerAnalytics";
import { farmerDashboardApi, ApiError } from "@/lib/api";

// ─── Mini skeleton ────────────────────────────────────────────────────────────

function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-xl bg-neutral-200 dark:bg-neutral-700 ${className ?? ""}`}
    />
  );
}

// ─── KPI card ─────────────────────────────────────────────────────────────────

function KpiCard({
  label,
  value,
  sub,
  icon,
  accent,
  isLoading,
}: {
  label:     string;
  value:     string;
  sub?:      React.ReactNode;
  icon:      string;
  accent?:   string;
  isLoading: boolean;
}) {
  return (
    <div
      className={`relative overflow-hidden bg-white dark:bg-neutral-dark rounded-2xl p-6 shadow-sm border border-neutral-light dark:border-border-dark group ${accent ?? ""}`}
    >
      {/* watermark icon */}
      <span
        className="material-symbols-outlined absolute top-3 right-3 text-6xl text-slate-100 dark:text-white/5 pointer-events-none select-none group-hover:opacity-30 transition-opacity"
        aria-hidden="true"
      >
        {icon}
      </span>

      <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1">
        {label}
      </p>

      {isLoading ? (
        <>
          <Skeleton className="h-9 w-32 mb-4" />
          <Skeleton className="h-4 w-24" />
        </>
      ) : (
        <>
          <h3 className="text-3xl font-extrabold font-display text-slate-900 dark:text-slate-100 mb-3">
            {value}
          </h3>
          <div className="text-xs">{sub}</div>
        </>
      )}
    </div>
  );
}

// ─── Bar chart (pure CSS) ─────────────────────────────────────────────────────

function BarChart({
  data,
  isLoading,
}: {
  data:      { label: string; value: number; highlight?: boolean }[];
  isLoading: boolean;
}) {
  const max = Math.max(...data.map((d) => d.value), 1);

  if (isLoading) {
    return (
      <div className="h-52 flex items-end gap-2 px-2">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-2">
            <div
              className="w-full rounded-t-lg bg-neutral-200 dark:bg-neutral-700 animate-pulse"
              style={{ height: `${30 + Math.random() * 50}%` }}
            />
            <div className="h-2 w-6 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="h-52 flex items-center justify-center text-slate-400 text-sm">
        No data available for this period.
      </div>
    );
  }

  return (
    <div className="h-52 flex items-end gap-1.5 px-2">
      {data.map((d) => {
        const pct = Math.max((d.value / max) * 100, 4);
        return (
          <div key={d.label} className="flex-1 flex flex-col items-center group/bar relative">
            {/* tooltip */}
            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded-lg opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
              {d.label}: {d.value}
            </div>

            <div
              className={`w-full rounded-t-lg transition-all duration-500 ${
                d.highlight
                  ? "bg-primary shadow-lg shadow-primary/30"
                  : "bg-neutral-200 dark:bg-earth-800 group-hover/bar:bg-primary/60"
              }`}
              style={{ height: `${pct}%` }}
            />
            <span
              className={`text-[10px] font-bold mt-1.5 uppercase tracking-wider ${
                d.highlight ? "text-primary" : "text-slate-400"
              }`}
            >
              {d.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ─── Progress bar row ─────────────────────────────────────────────────────────

function ProgressRow({
  label,
  value,
  pct,
  colorClass,
}: {
  label:      string;
  value:      string;
  pct:        number;
  colorClass: string;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <div className="w-full h-2.5 bg-neutral-100 dark:bg-earth-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${colorClass}`}
          style={{ width: `${Math.min(pct, 100)}%` }}
        />
      </div>
    </div>
  );
}

// ─── Star rating ──────────────────────────────────────────────────────────────

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i < Math.floor(rating);
        const half   = !filled && i < rating;
        return (
          <span
            key={i}
            className="material-symbols-outlined text-primary text-sm"
            style={{ fontVariationSettings: filled || half ? "'FILL' 1" : "'FILL' 0" }}
          >
            star
          </span>
        );
      })}
      <span className="text-xs text-slate-400 ml-1 font-bold">{rating.toFixed(2)}</span>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

type Period = "weekly" | "monthly" | "yearly";

export default function FarmerAnalyticsPage() {
  const [data,      setData]      = useState<FarmerDashboardResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error,     setError]     = useState<string | null>(null);
  const [period,    setPeriod]    = useState<Period>("monthly");

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    farmerDashboardApi
      .get()
      .then((res) => { if (!cancelled) { setData(res); } })
      .catch((err: unknown) => {
        if (!cancelled)
          setError(err instanceof ApiError ? err.message : "Failed to load analytics.");
      })
      .finally(() => { if (!cancelled) setIsLoading(false); });

    return () => { cancelled = true; };
  }, []);

  // ── Derived chart data ────────────────────────────────────────────────────

  /** Revenue bar chart — collapse to labels */
  const revenueChartData = (data?.charts.revenue_over_time ?? []).map(
    (d: RevenueDataPoint, i, arr) => ({
      label:     shortMonthDay(d.day),
      value:     d.total,
      highlight: i === arr.length - 1,
    })
  );

  /** Orders bar chart */
  const ordersChartData = (data?.charts.orders_over_time ?? []).map(
    (d: OrdersDataPoint, i, arr) => ({
      label:     shortMonthDay(d.day),
      value:     d.count,
      highlight: i === arr.length - 1,
    })
  );

  /** Category distribution for progress bars */
  const categoryTotal = (data?.charts.category_distribution ?? []).reduce(
    (sum: number, c: CategoryDataPoint) => sum + c.total,
    0
  ) || 1;

  /** Top products — sort by total_sold descending, null = 0 */
  const topProducts = [...(data?.insights.top_products ?? [])].sort(
    (a: TopProduct, b: TopProduct) => (b.total_sold ?? 0) - (a.total_sold ?? 0)
  );
  const maxSold = Math.max(...topProducts.map((p) => p.total_sold ?? 0), 1);

  const { overview } = data ?? {};
console.log(data);
  // ── render ─────────────────────────────────────────────────────────────────
  return (
    <div className="flex min-h-screen bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100">
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-6 lg:p-10 pb-20">

          {/* ── Page header ── */}
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <nav className="flex items-center gap-2 text-slate-500 text-sm mb-2 font-medium">
                <Link href="/farmer/dashboard" className="hover:text-primary transition-colors">
                  Dashboard
                </Link>
                <span className="material-symbols-outlined text-xs">chevron_right</span>
                <span className="text-slate-800 dark:text-slate-200">Analytics</span>
              </nav>
              <h1 className="text-4xl font-extrabold tracking-tight">Harvest Insights</h1>
              <p className="text-slate-500 dark:text-slate-400 mt-1.5 text-sm">
                Farm performance review &amp; market analysis
              </p>
            </div>

            {/* Period switcher */}
            <div className="flex items-center gap-1 bg-white dark:bg-neutral-dark border border-neutral-light dark:border-border-dark p-1.5 rounded-full shadow-sm self-start md:self-auto">
              {(["weekly", "monthly", "yearly"] as Period[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all capitalize ${
                    period === p
                      ? "bg-primary text-slate-900 shadow-sm"
                      : "text-slate-500 hover:bg-neutral-50 dark:hover:bg-earth-800"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </header>

          {/* ── Error banner ── */}
          {error && (
            <div
              role="alert"
              className="mb-8 flex items-start gap-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-700 dark:text-red-300"
            >
              <span className="material-symbols-outlined mt-0.5 shrink-0">error</span>
              <span className="flex-1">{error}</span>
              <button
                onClick={() => window.location.reload()}
                className="shrink-0 underline font-semibold text-xs"
              >
                Retry
              </button>
            </div>
          )}

          {/* ── KPI cards ── */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <KpiCard
              label="Total Revenue"
              value={overview ? `${formatDZD(overview.total_revenue)} DZD` : "—"}
              sub={
                overview && (
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black ${
                      overview.revenue_growth >= 0
                        ? "bg-primary-light dark:bg-primary/20 text-primary-dark"
                        : "bg-red-100 dark:bg-red-900/30 text-red-700"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[12px] leading-none">
                      {overview.revenue_growth >= 0 ? "trending_up" : "trending_down"}
                    </span>
                    {overview.revenue_growth >= 0 ? "+" : ""}
                    {overview.revenue_growth}% vs last period
                  </span>
                )
              }
              icon="payments"
              isLoading={isLoading}
            />

            <KpiCard
              label="Active Products"
              value={overview ? String(overview.total_products) : "—"}
              sub={
                data && (
                  <span className="flex items-center gap-1.5 text-slate-500">
                    <span className="material-symbols-outlined text-[14px]">inventory_2</span>
                    {data.insights.low_stock_products > 0
                      ? `${data.insights.low_stock_products} low-stock items`
                      : "All stock levels normal"}
                  </span>
                )
              }
              icon="inventory_2"
              accent="border-l-4 border-primary"
              isLoading={isLoading}
            />

            <KpiCard
              label="Avg. Quality Rating"
              value={overview ? `${overview.avg_rating.toFixed(2)} / 5.0` : "—"}
              sub={overview && <StarRating rating={overview.avg_rating} />}
              icon="grade"
              isLoading={isLoading}
            />
          </section>

          {/* ── Main bento grid ── */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

            {/* Revenue over time — 2 cols */}
            <div className="lg:col-span-2 bg-white dark:bg-neutral-dark rounded-2xl shadow-sm border border-neutral-light dark:border-border-dark p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h4 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                    Revenue Over Time
                  </h4>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
                    Daily sales volume (DZD)
                  </p>
                </div>
                <button className="flex items-center gap-1 text-primary text-xs font-bold hover:underline">
                  <span className="material-symbols-outlined text-sm">download</span>
                  Export
                </button>
              </div>

              <BarChart data={revenueChartData} isLoading={isLoading} />

              {/* Orders chart below */}
              <div className="mt-8 pt-6 border-t border-neutral-100 dark:border-border-dark">
                <h5 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-4">
                  Orders per Day
                </h5>
                <BarChart data={ordersChartData} isLoading={isLoading} />
              </div>
            </div>

            {/* Top products — 1 col */}
            <div className="bg-white dark:bg-neutral-dark rounded-2xl shadow-sm border border-neutral-light dark:border-border-dark p-8">
              <h4 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6">
                Top Products
              </h4>

              {isLoading ? (
                <div className="space-y-5">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-3 w-3/4" />
                      <Skeleton className="h-2.5 w-full rounded-full" />
                    </div>
                  ))}
                </div>
              ) : topProducts.length === 0 ? (
                <p className="text-slate-400 text-sm">No product data yet.</p>
              ) : (
                <div className="space-y-5">
                  {topProducts.map((p: TopProduct, i: number) => {
                    const sold = p.total_sold ?? 0;
                    const pct  = (sold / maxSold) * 100;
                    const colors = [
                      "bg-primary",
                      "bg-primary/70",
                      "bg-primary/40",
                    ];
                    return (
                      <ProgressRow
                        key={p.id}
                        label={p.ministry_product__name}
                        value={sold > 0 ? `${sold} units` : "No sales yet"}
                        pct={pct}
                        colorClass={colors[i] ?? "bg-primary/30"}
                      />
                    );
                  })}
                </div>
              )}

              {/* Category distribution */}
              {!isLoading && data && data.charts.category_distribution.length > 0 && (
                <div className="mt-8 pt-6 border-t border-neutral-100 dark:border-border-dark">
                  <h5 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-4">
                    By Category
                  </h5>
                  <div className="space-y-4">
                    {data.charts.category_distribution.map(
                      (c: CategoryDataPoint) => (
                        <ProgressRow
                          key={c.product_item__category_name}
                          label={c.product_item__category_name}
                          value={`${c.total} units`}
                          pct={(c.total / categoryTotal) * 100}
                          colorClass="bg-neutral-500"
                        />
                      )
                    )}
                  </div>
                </div>
              )}

              {/* Footnote */}
              <div className="mt-8 pt-6 border-t border-neutral-100 dark:border-border-dark">
                <p className="text-xs text-slate-400 italic leading-relaxed">
                  Sales data reflects confirmed and delivered orders only.
                </p>
              </div>
            </div>
          </section>

          {/* ── Inventory turnover banner ── */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2 bg-neutral-50 dark:bg-earth-800 rounded-2xl border border-neutral-light dark:border-border-dark p-8 relative overflow-hidden">
              {/* decorative skew */}
              <div className="absolute top-0 right-0 w-1/3 h-full bg-white/40 dark:bg-white/5 -skew-x-12 translate-x-24 pointer-events-none" />

              <div className="relative z-10">
                <h4 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-1">
                  Inventory Overview
                </h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 max-w-md">
                  Current product catalogue status and stock health for your farm.
                </p>

                {isLoading ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <Skeleton key={i} className="h-24 rounded-xl" />
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white/80 dark:bg-neutral-dark p-4 rounded-xl shadow-sm">
                      <p className="text-[10px] font-black text-slate-400 uppercase mb-1">
                        Total Products
                      </p>
                      <h5 className="text-2xl font-extrabold text-primary">
                        {overview?.total_products ?? 0}
                      </h5>
                      <p className="text-[10px] text-primary font-medium mt-1">Active listings</p>
                    </div>
                    <div className="bg-white/80 dark:bg-neutral-dark p-4 rounded-xl shadow-sm">
                      <p className="text-[10px] font-black text-slate-400 uppercase mb-1">
                        Low Stock
                      </p>
                      <h5
                        className={`text-2xl font-extrabold ${
                          (data?.insights.low_stock_products ?? 0) > 0
                            ? "text-orange-500"
                            : "text-slate-700 dark:text-slate-200"
                        }`}
                      >
                        {data?.insights.low_stock_products ?? 0}
                      </h5>
                      <p className="text-[10px] text-slate-400 font-medium mt-1">
                        {(data?.insights.low_stock_products ?? 0) > 0
                          ? "Needs restocking"
                          : "All stocked"}
                      </p>
                    </div>
                    <div className="bg-white/80 dark:bg-neutral-dark p-4 rounded-xl shadow-sm">
                      <p className="text-[10px] font-black text-slate-400 uppercase mb-1">
                        Avg. Rating
                      </p>
                      <h5 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">
                        {overview?.avg_rating.toFixed(1) ?? "—"}
                        <span className="text-sm font-normal text-slate-400">/5</span>
                      </h5>
                      <p className="text-[10px] text-slate-400 font-medium mt-1">
                        Buyer satisfaction
                      </p>
                    </div>
                    <div className="bg-primary text-slate-900 p-4 rounded-xl shadow-sm flex flex-col justify-center">
                      <p className="text-[10px] font-black text-primary-dark/70 uppercase mb-1">
                        Status
                      </p>
                      <p className="text-sm font-bold">
                        {(data?.insights.low_stock_products ?? 0) === 0
                          ? "Optimal Ops"
                          : "Attention Needed"}
                      </p>
                      <span className="material-symbols-outlined text-xl mt-1">
                        {(data?.insights.low_stock_products ?? 0) === 0
                          ? "check_circle"
                          : "warning"}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Revenue growth card */}
            <div className="bg-white dark:bg-neutral-dark rounded-2xl shadow-sm border border-neutral-light dark:border-border-dark p-8 flex flex-col justify-between">
              <div>
                <h4 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-1">
                  Growth Summary
                </h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                  Revenue trend vs. previous period
                </p>

                {isLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-20 rounded-xl" />
                    <Skeleton className="h-3 w-2/3" />
                  </div>
                ) : (
                  <>
                    <div
                      className={`rounded-xl p-5 mb-4 ${
                        (overview?.revenue_growth ?? 0) >= 0
                          ? "bg-primary-light dark:bg-primary/10"
                          : "bg-red-50 dark:bg-red-900/20"
                      }`}
                    >
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">
                        Revenue Growth
                      </p>
                      <p
                        className={`text-4xl font-extrabold font-display ${
                          (overview?.revenue_growth ?? 0) >= 0
                            ? "text-primary"
                            : "text-red-600"
                        }`}
                      >
                        {(overview?.revenue_growth ?? 0) >= 0 ? "+" : ""}
                        {overview?.revenue_growth ?? 0}%
                      </p>
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed">
                      {(overview?.revenue_growth ?? 0) === 0
                        ? "No change compared to the previous period. Keep monitoring your listings."
                        : (overview?.revenue_growth ?? 0) > 0
                        ? "Great performance! Revenue is growing compared to the previous period."
                        : "Revenue declined compared to the previous period. Consider adjusting your pricing or stock."}
                    </p>
                  </>
                )}
              </div>

              <Link
                href="/farmer/dashboard/products"
                className="mt-6 flex items-center justify-center gap-2 w-full py-3 rounded-xl border-2 border-primary text-primary font-bold text-sm hover:bg-primary-light dark:hover:bg-primary/10 transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">inventory_2</span>
                Manage Products
              </Link>
            </div>
          </section>

          {/* ── Subsidy progress banner ── */}
          <section className="bg-slate-900 dark:bg-earth-800 rounded-3xl p-8 lg:p-10 text-white relative overflow-hidden shadow-2xl">
            {/* glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/10 rounded-full blur-3xl -ml-12 -mb-12 pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="max-w-md">
                <span className="inline-flex items-center gap-1.5 bg-primary/20 text-primary px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  Subsidy Programme
                </span>
                <h4 className="text-2xl font-extrabold tracking-tight mb-2">
                  Subsidy Limit Progress
                </h4>
                <p className="text-slate-400 text-sm leading-relaxed">
                  You have reached 82% of your sustainable farming subsidy cap for
                  this cycle. Complete 3 more certifications to unlock full benefits.
                </p>
              </div>

              <div className="w-full md:w-72 shrink-0">
                <div className="flex justify-between mb-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <span>Earned: 820,000 DZD</span>
                  <span>Limit: 1,000,000 DZD</span>
                </div>
                <div className="h-5 w-full bg-white/10 rounded-full p-0.5 shadow-inner">
                  <div
                    className="h-full rounded-full bg-primary relative overflow-hidden"
                    style={{ width: "82%" }}
                  >
                    <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full" />
                  </div>
                </div>
                <p className="text-[10px] text-slate-500 mt-2 text-right font-bold">
                  82% — 180,000 DZD remaining
                </p>
              </div>

              <button className="shrink-0 bg-primary text-slate-900 font-black py-3 px-8 rounded-xl shadow-lg hover:opacity-90 active:scale-95 transition-all text-sm uppercase tracking-wider whitespace-nowrap">
                Claim Grant
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}