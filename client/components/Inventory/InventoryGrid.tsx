"use client";

import { useState, useMemo } from "react";
import InventoryCard from "./InventoryCard";
import AddNewCard from "./AddNew";
import type { InventoryItem, ViewMode } from "@/types/Inventory";

interface Props {
  items: InventoryItem[];
  onEdit: (id: string) => void;
  onAddNew: () => void;
}

const PAGE_SIZE = 4;

const CATEGORIES = ["All Categories", "Vegetables", "Fruits", "Grains"];
const STATUSES = ["Status: All", "In Stock", "Low Stock"];

export default function InventoryGrid({ items, onEdit, onAddNew }: Props) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [status, setStatus] = useState("Status: All");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const matchSearch =
        !search || item.name.toLowerCase().includes(search.toLowerCase());
      const matchCategory =
        category === "All Categories" || item.category === category;
      const matchStatus =
        status === "Status: All" || item.status === status;
      return matchSearch && matchCategory && matchStatus;
    });
  }, [items, search, category, status]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleFilterChange = (setter: (v: string) => void) => (e: React.ChangeEvent<HTMLSelectElement>) => {
    setter(e.target.value);
    setPage(1);
  };

  const selectClass =
    "bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 text-sm rounded-lg focus:ring-primary focus:border-primary block p-2 outline-none";

  return (
    <div className="bg-white dark:bg-[#1a2e1a] rounded-xl border border-earth-100 dark:border-white/5 shadow-sm overflow-hidden">
      {/* Toolbar */}
      <div className="p-5 border-b border-earth-100 dark:border-white/10 flex flex-col sm:flex-row gap-4 justify-between items-center">
        {/* Search */}
        <div className="relative w-full sm:max-w-xs">
          <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
            search
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder-slate-400 dark:text-white"
          />
        </div>

        {/* Filters + view toggle */}
        <div className="flex gap-2 w-full sm:w-auto flex-wrap">
          <select value={category} onChange={handleFilterChange(setCategory)} className={selectClass}>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
          <select value={status} onChange={handleFilterChange(setStatus)} className={selectClass}>
            {STATUSES.map((s) => <option key={s}>{s}</option>)}
          </select>

          {/* View mode toggle */}
          <div className="flex border border-slate-200 dark:border-white/10 rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`p-2 transition-colors ${
                viewMode === "grid"
                  ? "bg-primary/20 text-primary-dark dark:text-primary"
                  : "bg-slate-50 dark:bg-white/5 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              }`}
              aria-label="Grid view"
            >
              <span className="material-icons text-lg block">grid_view</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`p-2 transition-colors ${
                viewMode === "list"
                  ? "bg-primary/20 text-primary-dark dark:text-primary"
                  : "bg-slate-50 dark:bg-white/5 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              }`}
              aria-label="List view"
            >
              <span className="material-icons text-lg block">view_list</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {paginated.map((item) => (
          <InventoryCard key={item.id} item={item} onEdit={onEdit} />
        ))}
        {/* Add new — always shown at end of last page or when results are fewer than page size */}
        {page === totalPages || paginated.length < PAGE_SIZE ? (
          <AddNewCard onClick={onAddNew} />
        ) : null}
      </div>

      {/* Pagination */}
      <div className="p-5 border-t border-earth-100 dark:border-white/10 flex justify-between items-center bg-slate-50 dark:bg-white/5">
        <span className="text-sm text-slate-500 dark:text-slate-400">
          Showing {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–
          {Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} items
        </span>

        <div className="flex space-x-2">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 border border-slate-200 dark:border-white/10 bg-white dark:bg-background-dark rounded hover:bg-slate-50 dark:hover:bg-white/5 text-slate-600 dark:text-slate-300 text-sm disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>

          {Array.from({ length: totalPages || 1 }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setPage(n)}
              className={`px-3 py-1 rounded text-sm font-semibold transition-colors ${
                n === page
                  ? "bg-primary text-black hover:bg-primary-dark"
                  : "border border-slate-200 dark:border-white/10 bg-white dark:bg-background-dark hover:bg-slate-50 dark:hover:bg-white/5 text-slate-600 dark:text-slate-300"
              }`}
            >
              {n}
            </button>
          ))}

          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages || totalPages === 0}
            className="px-3 py-1 border border-slate-200 dark:border-white/10 bg-white dark:bg-background-dark rounded hover:bg-slate-50 dark:hover:bg-white/5 text-slate-600 dark:text-slate-300 text-sm disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}