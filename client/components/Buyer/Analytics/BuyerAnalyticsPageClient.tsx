"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import BuyerLayout from "../BuyerLayout";
import type { BuyerDashboardResponse } from "@/types/BuyerDashboard";
import { fmtDZD, fmtDate, ORDER_STATUS_LABEL, ORDER_STATUS_ICON } from "@/types/BuyerDashboard";
import { buyerApi, ApiError } from "@/lib/api";

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700 ${className ?? ""}`} />;
}

// ─── Bar chart ────────────────────────────────────────────────────────────────
function BarChart({ data, color = "#0df20d", height = 140 }: {
  data: { label: string; value: number }[];
  color?: string;
  height?: number;
}) {
  const max = Math.max(...data.map(d => d.value), 1);
  if (data.length === 0) return <p className="text-xs text-slate-400 text-center py-6">No data yet.</p>;
  return (
    <div className="flex items-end gap-2" style={{ height }}>
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center group/bar relative">
          <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
            {fmtDZD(d.value)} DZD
          </div>
          <div className="w-full rounded-t-lg transition-all duration-700 group-hover/bar:opacity-80 cursor-default"
            style={{ height: `${Math.max((d.value / max) * 100, 3)}%`, background: color }} />
          <span className="text-[9px] font-bold mt-1 text-slate-400">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Donut chart ──────────────────────────────────────────────────────────────
function DonutChart({ segments }: { segments: { label: string; value: number; color: string }[] }) {
  const total = segments.reduce((s, sg) => s + sg.value, 0) || 1;
  const R = 52, CX = 70, CY = 70;
  let cum = 0;
  const arcs = segments.map(sg => {
    const start = cum;
    cum += sg.value / total;
    return { ...sg, start, end: cum };
  });
  const arc = (start: number, end: number) => {
    const r = (p: number) => (p * 2 * Math.PI) - Math.PI / 2;
    const [sx, sy] = [CX + R * Math.cos(r(start)), CY + R * Math.sin(r(start))];
    const [ex, ey] = [CX + R * Math.cos(r(end)),   CY + R * Math.sin(r(end))];
    const large = end - start > 0.5 ? 1 : 0;
    return `M${CX},${CY} L${sx},${sy} A${R},${R} 0 ${large} 1 ${ex},${ey} Z`;
  };
  return (
    <div className="flex items-center gap-6">
      <svg viewBox="0 0 140 140" className="w-32 h-32 shrink-0">
        {arcs.map((a, i) => (
          <path key={i} d={arc(a.start, a.end)} fill={a.color} stroke="#fff" strokeWidth={1.5} />
        ))}
        <circle cx={CX} cy={CY} r={32} fill="white" className="dark:fill-neutral-dark" />
        <text x={CX} y={CY - 4} textAnchor="middle" fontSize="13" fontWeight="800" fill="#0f172a" fontFamily="inherit">{total}</text>
        <text x={CX} y={CY + 9} textAnchor="middle" fontSize="7" fill="#94a3b8" fontFamily="inherit">ORDERS</text>
      </svg>
      <div className="space-y-2">
        {arcs.map((a, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: a.color }} />
            <span className="text-xs text-slate-600 dark:text-slate-400 capitalize">{a.label}</span>
            <span className="ml-auto text-xs font-bold text-slate-800 dark:text-slate-100">{a.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Sparkline ────────────────────────────────────────────────────────────────
function Sparkline({ data, color = "#0df20d" }: { data: { value: number }[]; color?: string }) {
  if (data.length < 2) return null;
  const max = Math.max(...data.map(d => d.value), 1);
  const W = 240, H = 60;
  const pts = data.map((d, i) => {
    const x = (i / (data.length - 1)) * W;
    const y = H - (d.value / max) * (H - 8) - 4;
    return `${x},${y}`;
  }).join(" ");
  const fill = `0,${H} ${pts} ${W},${H}`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-14" preserveAspectRatio="none">
      <polygon points={fill} fill={color} opacity={0.12} />
      <polyline fill="none" points={pts} stroke={color} strokeWidth="2" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

const STATUS_COLORS: Record<string, string> = {
  pending:   "#fbbf24",
  confirmed: "#60a5fa",
  delivered: "#0df20d",
  cancelled: "#f87171",
  in_transit:"#818cf8",
};

export default function BuyerAnalyticsPage() {
  const [data,      setData]      = useState<BuyerDashboardResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error,     setError]     = useState<string | null>(null);
  const cancelledRef = useRef(false);

  useEffect(() => {
    cancelledRef.current = false;
    buyerApi.dashboard()
      .then(res => { if (!cancelledRef.current) setData(res); })
      .catch((err: unknown) => { if (!cancelledRef.current) setError(err instanceof ApiError ? err.message : "Failed to load analytics."); })
      .finally(() => { if (!cancelledRef.current) setIsLoading(false); });
    return () => { cancelledRef.current = true; };
  }, []);

  const ov       = data?.overview;
  const charts   = data?.charts;
  const activity = data?.recent_activity ?? [];

  const spendingBars = useMemo(() =>
    (charts?.spending_over_time ?? []).map(d => ({
      label: new Date(d.month).toLocaleDateString("fr-DZ", { month: "short", year: "2-digit" }),
      value: d.total,
    })), [charts]);

  const donutSegments = useMemo(() =>
    (charts?.status_distribution ?? []).map(s => ({
      label: ORDER_STATUS_LABEL[s.status] ?? s.status,
      value: s.count,
      color: STATUS_COLORS[s.status] ?? "#94a3b8",
    })), [charts]);

  // Spending ratio
  const totalOrders = ov?.total_orders ?? 0;
  const delivered   = (charts?.status_distribution ?? []).find(s => s.status === "delivered")?.count ?? 0;
  const completionRate = totalOrders > 0 ? Math.round((delivered / totalOrders) * 100) : 0;

  return (
    <BuyerLayout>
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Analytics</h1>
          <p className="text-slate-500 text-sm mt-1">Your purchasing behaviour and order performance.</p>
        </div>

        {error && (
          <div role="alert" className="flex items-center gap-3 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            <span className="material-symbols-outlined text-base shrink-0">error</span>
            {error}
          </div>
        )}

        {/* Summary KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Orders",     value: ov ? String(ov.total_orders)                  : "—", icon: "receipt_long",   color: "text-primary"    },
            { label: "Total Spent",      value: ov ? `${fmtDZD(ov.total_spent)} DZD`          : "—", icon: "payments",       color: "text-blue-500"   },
            { label: "Avg Order Value",  value: ov ? `${fmtDZD(ov.avg_order_value)} DZD`      : "—", icon: "trending_up",    color: "text-purple-500" },
            { label: "Completion Rate",  value: isLoading ? "—"                               : `${completionRate}%`, icon: "task_alt", color: "text-green-500" },
          ].map(k => (
            <div key={k.label} className="bg-white dark:bg-neutral-dark rounded-2xl border border-neutral-light dark:border-border-dark shadow-sm p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className={`material-symbols-outlined text-[20px] ${k.color}`}>{k.icon}</span>
              </div>
              {isLoading ? <Skeleton className="h-7 w-24 mb-1" /> : (
                <p className="text-xl font-extrabold text-slate-900 dark:text-slate-100">{k.value}</p>
              )}
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{k.label}</p>
            </div>
          ))}
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Spending over time */}
          <div className="bg-white dark:bg-neutral-dark rounded-2xl border border-neutral-light dark:border-border-dark shadow-sm p-6">
            <h3 className="font-bold text-lg mb-1">Spending Over Time</h3>
            <p className="text-xs text-slate-400 mb-5">Monthly total spend (DZD)</p>
            {isLoading ? <Skeleton className="h-36" /> : (
              <>
                <BarChart data={spendingBars} color="#0df20d" height={140} />
                {spendingBars.length > 1 && (
                  <div className="mt-4 pt-4 border-t border-neutral-100 dark:border-border-dark">
                    <p className="text-[10px] font-bold uppercase text-slate-400 mb-2">Trend</p>
                    <Sparkline data={spendingBars} />
                  </div>
                )}
              </>
            )}
          </div>

          {/* Status distribution donut */}
          <div className="bg-white dark:bg-neutral-dark rounded-2xl border border-neutral-light dark:border-border-dark shadow-sm p-6">
            <h3 className="font-bold text-lg mb-1">Order Status Distribution</h3>
            <p className="text-xs text-slate-400 mb-5">Breakdown by current status</p>
            {isLoading ? (
              <div className="flex items-center gap-6">
                <Skeleton className="w-32 h-32 rounded-full" />
                <div className="space-y-3 flex-1">{Array.from({length:3}).map((_,i)=><Skeleton key={i} className="h-5"/>)}</div>
              </div>
            ) : donutSegments.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-8">No order data available.</p>
            ) : (
              <DonutChart segments={donutSegments} />
            )}
          </div>
        </div>

        {/* Recent activity table */}
        <div className="bg-white dark:bg-neutral-dark rounded-2xl border border-neutral-light dark:border-border-dark shadow-sm">
          <div className="px-6 py-5 border-b border-neutral-light dark:border-border-dark">
            <h3 className="font-bold text-lg">Recent Activity</h3>
            <p className="text-xs text-slate-400 mt-0.5">Last 5 orders from your account</p>
          </div>
          {isLoading ? (
            <div className="p-4 space-y-3">{Array.from({length:5}).map((_,i)=><Skeleton key={i} className="h-12"/>)}</div>
          ) : activity.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-8">No activity yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-neutral-50 dark:bg-earth-800 text-[11px] uppercase font-bold text-slate-500 dark:text-slate-400">
                  <tr>
                    <th className="px-6 py-3">Order</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Date</th>
                    <th className="px-6 py-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-light dark:divide-border-dark">
                  {activity.map(act => (
                    <tr key={act.id} className="hover:bg-neutral-50 dark:hover:bg-earth-800 transition-colors">
                      <td className="px-6 py-3 font-bold text-slate-800 dark:text-slate-100">#{act.id}</td>
                      <td className="px-6 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          act.status === "delivered" ? "bg-primary/10 text-primary-dark" :
                          act.status === "pending"   ? "bg-yellow-100 text-yellow-800" :
                          act.status === "confirmed" ? "bg-blue-100 text-blue-800" :
                          "bg-slate-100 text-slate-600"
                        }`}>
                          <span className="material-symbols-outlined text-[11px] leading-none">{ORDER_STATUS_ICON[act.status] ?? "help"}</span>
                          {ORDER_STATUS_LABEL[act.status] ?? act.status}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-slate-500">{fmtDate(act.created_at)}</td>
                      <td className="px-6 py-3 text-right font-bold font-mono text-slate-800 dark:text-slate-100">
                        {fmtDZD(act.total_price)} DZD
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Insight card */}
        {!isLoading && ov && ov.total_orders > 0 && (
          <div className="bg-slate-900 dark:bg-earth-800 rounded-2xl p-6 text-white relative overflow-hidden">
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
            <div className="relative z-10">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Insight</p>
              <p className="text-lg font-bold leading-snug">
                You've completed <span className="text-primary">{completionRate}%</span> of your orders and spent a total of{" "}
                <span className="text-primary">{fmtDZD(ov.total_spent)} DZD</span> across {ov.total_orders} orders.
              </p>
              {ov.total_reviews > 0 && (
                <p className="text-sm text-slate-400 mt-2">
                  You've also left {ov.total_reviews} review{ov.total_reviews !== 1 ? "s" : ""} — thank you for your feedback!
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </BuyerLayout>
  );
}