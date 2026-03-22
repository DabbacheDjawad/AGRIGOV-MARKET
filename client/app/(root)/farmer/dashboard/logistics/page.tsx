"use client";
import LogisticsStatCards from "@/components/Inventory/logistics/LogisticsStatsCard";
import OrdersTable from "@/components/Inventory/logistics/OrdersTable";
import PickupSchedule from "@/components/Inventory/logistics/PickupSchedule";
import LiveTracking from "@/components/Inventory/logistics/LiveTracking";
import WeatherAlert from "@/components/Inventory/logistics/WeatherAlert";
import { statCards, logisticsOrders, pickupEvents } from "@/types/Logistics";

export default function LogisticsPage() {
  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-800 dark:text-slate-100 antialiased min-h-screen flex flex-col">

      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

          {/* Page header */}
          <div className="md:flex md:items-center md:justify-between">
            <div className="min-w-0 flex-1">
              <h2 className="text-2xl font-bold leading-7 text-slate-900 dark:text-white sm:truncate sm:text-3xl sm:tracking-tight">
                Logistics Overview
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Manage your active shipments, coordinate with transporters, and track delivery
                performance.
              </p>
            </div>
            <div className="mt-4 flex md:ml-4 md:mt-0 gap-3">
              <button
                type="button"
                className="inline-flex items-center rounded-lg bg-white dark:bg-surface-dark px-3 py-2 text-sm font-semibold text-slate-900 dark:text-white shadow-sm ring-1 ring-inset ring-neutral-light dark:ring-neutral-dark hover:bg-slate-50 dark:hover:bg-neutral-dark transition-colors"
              >
                <span className="material-icons text-lg mr-2">download</span>
                Export Report
              </button>
              <button
                type="button"
                className="inline-flex items-center rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-black shadow-sm hover:bg-primary-dark transition-colors focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <span className="material-icons text-lg mr-2">add</span>
                New Shipment Request
              </button>
            </div>
          </div>

          {/* Stats */}
          <LogisticsStatCards cards={statCards} />

          {/* Main content: table + sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <OrdersTable orders={logisticsOrders} />

            {/* Sidebar */}
            <div className="space-y-6">
              <PickupSchedule events={pickupEvents} />
              <LiveTracking />
              <WeatherAlert
                title="Weather Alert"
                message="Heavy rains expected tomorrow afternoon. Ensure all pending pickups are covered or rescheduled."
              />
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}