"use client";

import type { OrderStatus } from "@/types/Orders";

type StatusFilter = "All Statuses" | OrderStatus;
const STATUS_OPTIONS: StatusFilter[] = ["All Statuses", "Delivered", "In Transit", "Pending", "Cancelled"];

interface Props {
  search: string;
  date: string;
  status: StatusFilter;
  onSearchChange: (v: string) => void;
  onDateChange: (v: string) => void;
  onStatusChange: (v: StatusFilter) => void;
}

export default function OrdersFilters({
  search, date, status,
  onSearchChange, onDateChange, onStatusChange,
}: Props) {
  const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";
  const inputClass =
    "focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-white rounded-md py-2 outline-none";

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6 border border-gray-100 dark:border-gray-700">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
        {/* Search */}
        <div className="md:col-span-5">
          <label htmlFor="search" className={labelClass}>Search Orders</label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="material-icons text-gray-400">search</span>
            </div>
            <input
              id="search"
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Order ID, Product, or Supplier"
              className={`${inputClass} pl-10`}
            />
          </div>
        </div>

        {/* Date */}
        <div className="md:col-span-3">
          <label htmlFor="date-range" className={labelClass}>Date Range</label>
          <input
            id="date-range"
            type="date"
            value={date}
            onChange={(e) => onDateChange(e.target.value)}
            className={`${inputClass} px-3`}
          />
        </div>

        {/* Status */}
        <div className="md:col-span-3">
          <label htmlFor="status" className={labelClass}>Status</label>
          <select
            id="status"
            value={status}
            onChange={(e) => onStatusChange(e.target.value as StatusFilter)}
            className={`${inputClass} pl-3 pr-10`}
          >
            {STATUS_OPTIONS.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>

        {/* Filter button */}
        <div className="md:col-span-1 flex justify-end">
          <button
            type="button"
            aria-label="Advanced filters"
            className="p-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 w-full flex items-center justify-center transition-colors"
          >
            <span className="material-icons">filter_list</span>
          </button>
        </div>
      </div>
    </div>
  );
}