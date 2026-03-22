"use client";

import type { PendingOrder } from "@/types/Inventory";

interface Props {
  pendingOrders: PendingOrder[];
  onAcceptOrder: (id: string) => void;
}

export default function StatsOverview({ pendingOrders, onAcceptOrder }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Monthly Revenue */}
      <div className="bg-white dark:bg-[#1a2e1a] p-6 rounded-xl border border-earth-100 dark:border-white/5 shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Monthly Revenue</p>
            <h3 className="text-2xl font-bold text-earth-800 dark:text-white mt-1">$12,450.00</h3>
          </div>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
            <span className="material-icons text-[14px] mr-1">trending_up</span>
            +12%
          </span>
        </div>
        <div className="w-full bg-slate-100 dark:bg-white/10 rounded-full h-1.5 mb-2">
          <div className="bg-primary h-1.5 rounded-full" style={{ width: "75%" }} />
        </div>
        <p className="text-xs text-slate-400">Target: $15,000</p>
      </div>

      {/* Total Stock Volume */}
      <div className="bg-white dark:bg-[#1a2e1a] p-6 rounded-xl border border-earth-100 dark:border-white/5 shadow-sm">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Stock Volume</p>
            <h3 className="text-2xl font-bold text-earth-800 dark:text-white mt-1">45.2 Tons</h3>
          </div>
          <div className="h-10 w-10 rounded-lg bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-orange-600 dark:text-orange-400">
            <span className="material-icons">scale</span>
          </div>
        </div>
        <div className="flex items-center space-x-4 text-xs text-slate-500 dark:text-slate-400">
          <span className="flex items-center">
            <span className="w-2 h-2 rounded-full bg-yellow-400 mr-1.5" />
            Grade A: 60%
          </span>
          <span className="flex items-center">
            <span className="w-2 h-2 rounded-full bg-slate-300 mr-1.5" />
            Grade B: 40%
          </span>
        </div>
      </div>

      {/* Pending Orders */}
      <div className="bg-white dark:bg-[#1a2e1a] p-6 rounded-xl border border-earth-100 dark:border-white/5 shadow-sm border-l-4 border-l-primary">
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Pending Orders</p>
          <a
            href="#"
            className="text-xs font-semibold text-primary-dark dark:text-primary hover:underline"
          >
            View All
          </a>
        </div>
        <div className="space-y-3">
          {pendingOrders.map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between p-2 bg-slate-50 dark:bg-white/5 rounded-lg"
            >
              <div className="flex items-center">
                <div className="h-8 w-8 rounded bg-white dark:bg-white/10 flex items-center justify-center text-slate-500 mr-3 text-xs font-bold border border-slate-100 dark:border-white/5 shrink-0">
                  {order.buyerInitials}
                </div>
                <div>
                  <p className="text-xs font-bold text-earth-800 dark:text-white">
                    {order.buyerName}
                  </p>
                  <p className="text-[10px] text-slate-500">{order.itemDescription}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onAcceptOrder(order.id)}
                className="text-primary-dark dark:text-primary hover:bg-primary/10 p-1 rounded transition-colors"
                aria-label={`Accept order from ${order.buyerName}`}
              >
                <span className="material-icons text-lg">check_circle</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}