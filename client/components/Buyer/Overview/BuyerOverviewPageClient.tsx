"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import BuyerLayout from "../BuyerLayout";
import type { BuyerDashboardResponse } from "@/types/BuyerDashboard";
import { fmtDZD, fmtDateTime, ORDER_STATUS_BADGE, ORDER_STATUS_LABEL, ORDER_STATUS_ICON } from "@/types/BuyerDashboard";
import { buyerApi, ApiError } from "@/lib/api";

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700 ${className ?? ""}`} />;
}

function KpiCard({
  icon, iconColor, label, value, sub, isLoading,
}: {
  icon: string; iconColor: string; label: string;
  value: string; sub?: string; isLoading: boolean;
}) {
  return (
    <div className="bg-white dark:bg-neutral-dark rounded-2xl border border-neutral-light dark:border-border-dark shadow-sm p-5 relative overflow-hidden group">
      <div className="absolute right-3 top-3 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
        <span className={`material-symbols-outlined text-5xl ${iconColor}`}>{icon}</span>
      </div>
      <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">{label}</p>
      {isLoading ? <Skeleton className="h-8 w-28 mb-1" /> : (
        <p className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">{value}</p>
      )}
      {sub && !isLoading && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
    </div>
  );
}

// Inline mini bar chart for spending over time
function SpendingMiniChart({ data }: { data: { label: string; value: number }[] }) {
  const max = Math.max(...data.map(d => d.value), 1);
  if (data.length === 0) return <p className="text-xs text-slate-400 text-center py-4">No spending data yet.</p>;
  return (
    <div className="flex items-end gap-1.5 h-24 mt-2">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center group/bar relative">
          <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
            {fmtDZD(d.value)} DZD
          </div>
          <div className="w-full bg-primary rounded-t-lg" style={{ height: `${Math.max((d.value / max) * 100, 4)}%` }} />
          <span className="text-[9px] font-bold mt-1 text-slate-400 uppercase">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

export default function BuyerOverviewPage() {
  const [data,      setData]      = useState<BuyerDashboardResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error,     setError]     = useState<string | null>(null);
  const cancelledRef = useRef(false);

  useEffect(() => {
    cancelledRef.current = false;
    buyerApi.dashboard()
      .then(res => { if (!cancelledRef.current) setData(res); })
      .catch((err: unknown) => { if (!cancelledRef.current) setError(err instanceof ApiError ? err.message : "Failed to load dashboard."); })
      .finally(() => { if (!cancelledRef.current) setIsLoading(false); });
    return () => { cancelledRef.current = true; };
  }, []);

  const ov       = data?.overview;
  const activity = data?.recent_activity ?? [];
  const charts   = data?.charts;

  const spendingData = (charts?.spending_over_time ?? []).map(d => ({
    label: new Date(d.month).toLocaleDateString("fr-DZ", { month: "short", year: "2-digit" }),
    value: d.total,
  }));

  const statusColors: Record<string, string> = {
    pending: "#fbbf24", confirmed: "#60a5fa", delivered: "#0df20d", cancelled: "#f87171", in_transit: "#818cf8",
  };

  return (
    <BuyerLayout>
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Welcome back 👋</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Here's an overview of your activity on AGRIGOV.</p>
          </div>
          <Link href="/marketplace" className="flex items-center gap-2 bg-primary text-slate-900 px-5 py-2.5 rounded-xl font-bold text-sm hover:opacity-90 active:scale-95 transition-all shadow-sm">
            <span className="material-symbols-outlined text-[18px]">storefront</span>
            Browse Marketplace
          </Link>
        </div>

        {error && (
          <div role="alert" className="flex items-center gap-3 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            <span className="material-symbols-outlined text-base shrink-0">error</span>
            {error}
          </div>
        )}

        {/* KPI grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard icon="receipt_long" iconColor="text-primary" label="Total Orders"
            value={ov ? String(ov.total_orders) : "—"} isLoading={isLoading} />
          <KpiCard icon="payments" iconColor="text-blue-500" label="Total Spent"
            value={ov ? `${fmtDZD(ov.total_spent)} DZD` : "—"}
            sub={ov ? `Avg ${fmtDZD(ov.avg_order_value)} DZD / order` : undefined}
            isLoading={isLoading} />
          <KpiCard icon="star" iconColor="text-amber-500" label="Reviews Given"
            value={ov ? String(ov.total_reviews) : "—"} isLoading={isLoading} />
          <KpiCard icon="local_shipping" iconColor="text-indigo-500" label="Delivered"
            value={isLoading ? "—" : String((charts?.status_distribution ?? []).find(s => s.status === "delivered")?.count ?? 0)}
            sub="completed orders" isLoading={isLoading} />
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Recent activity – 2 cols */}
          <div className="lg:col-span-2 bg-white dark:bg-neutral-dark rounded-2xl border border-neutral-light dark:border-border-dark shadow-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold">Recent Activity</h3>
              <Link href="/buyer/dashboard/orders" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                View all <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>

            {isLoading ? (
              <div className="space-y-3">{Array.from({length:5}).map((_,i) => <Skeleton key={i} className="h-14" />)}</div>
            ) : activity.length === 0 ? (
              <div className="flex flex-col items-center py-12 text-slate-400">
                <span className="material-symbols-outlined text-5xl mb-3">inbox</span>
                <p className="text-sm">No recent orders yet.</p>
                <Link href="/marketplace" className="mt-4 text-sm font-bold text-primary hover:underline">Start shopping →</Link>
              </div>
            ) : (
              <div className="space-y-3">
                {activity.map(act => (
                  <Link key={act.id} href={`/buyer/dashboard/orders/${act.id}`}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-neutral-50 dark:hover:bg-earth-800 transition-colors group">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-primary text-[18px]">
                          {ORDER_STATUS_ICON[act.status] ?? "receipt_long"}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-100">Order #{act.id}</p>
                        <p className="text-[10px] text-slate-400">{fmtDateTime(act.created_at)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${ORDER_STATUS_BADGE[act.status] ?? ""}`}>
                        {ORDER_STATUS_LABEL[act.status] ?? act.status}
                      </span>
                      <p className="text-sm font-bold font-mono text-slate-700 dark:text-slate-200 hidden sm:block">
                        {fmtDZD(act.total_price)} DZD
                      </p>
                      <span className="material-symbols-outlined text-slate-300 group-hover:text-primary transition-colors text-sm">arrow_forward_ios</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Right column */}
          <div className="space-y-5">
            {/* Order status breakdown */}
            <div className="bg-white dark:bg-neutral-dark rounded-2xl border border-neutral-light dark:border-border-dark shadow-sm p-6">
              <h4 className="font-bold mb-4">Order Status</h4>
              {isLoading ? (
                <div className="space-y-2">{Array.from({length:3}).map((_,i)=><Skeleton key={i} className="h-7"/>)}</div>
              ) : (charts?.status_distribution ?? []).length === 0 ? (
                <p className="text-xs text-slate-400">No orders yet.</p>
              ) : (
                <div className="space-y-3">
                  {(charts?.status_distribution ?? []).map(s => {
                    const total = (charts?.status_distribution ?? []).reduce((acc,x) => acc + x.count, 0) || 1;
                    const pct   = (s.count / total) * 100;
                    return (
                      <div key={s.status} className="space-y-1">
                        <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
                          <span className="capitalize">{ORDER_STATUS_LABEL[s.status] ?? s.status}</span>
                          <span>{s.count}</span>
                        </div>
                        <div className="h-1.5 w-full bg-neutral-100 dark:bg-earth-800 rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all duration-700"
                            style={{ width: `${Math.max(pct, 3)}%`, background: statusColors[s.status] ?? "#94a3b8" }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Spending trend */}
            <div className="bg-white dark:bg-neutral-dark rounded-2xl border border-neutral-light dark:border-border-dark shadow-sm p-6">
              <h4 className="font-bold mb-1">Spending Trend</h4>
              <p className="text-xs text-slate-400 mb-2">Monthly spend (DZD)</p>
              {isLoading ? <Skeleton className="h-24" /> : <SpendingMiniChart data={spendingData} />}
            </div>

            {/* Quick actions */}
            <div className="bg-primary rounded-2xl p-6 text-slate-900 relative overflow-hidden shadow-sm">
              <div className="absolute -bottom-4 -right-4 opacity-10 pointer-events-none">
                <span className="material-symbols-outlined text-[100px]">shopping_bag</span>
              </div>
              <h4 className="font-bold text-lg mb-1 relative z-10">Ready to order?</h4>
              <p className="text-sm opacity-80 mb-4 relative z-10">Discover fresh products from verified Algerian farms.</p>
              <Link href="/marketplace" className="relative z-10 inline-flex items-center gap-2 bg-white text-primary px-4 py-2 rounded-xl font-bold text-sm hover:opacity-90 transition-all">
                <span className="material-symbols-outlined text-[16px]">storefront</span>
                Shop Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </BuyerLayout>
  );
}