"use client";

import Image from "next/image";
import { useState, useMemo } from "react";
import CategoryBadge from "./CategoryBadge";
import type { CommodityPrice } from "@/types/Prices";
import { CATEGORIES } from "@/types/Prices";

interface Props {
  items: CommodityPrice[];
  onEdit: (item: CommodityPrice) => void;
  editingId: string | null;
}

const PAGE_SIZE = 5;

export default function CommodityTable({ items, onEdit, editingId }: Props) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const q = search.toLowerCase();
      const matchSearch = !q || item.name.toLowerCase().includes(q);
      const matchCat =
        category === "All Categories" ||
        category.toLowerCase().includes(item.category.toLowerCase()) ||
        item.category.toLowerCase().includes(category.split(" ")[0].toLowerCase());
      return matchSearch && matchCat;
    });
  }, [items, search, category]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="lg:col-span-2 flex flex-col space-y-4">
      {/* Toolbar */}
      <div className="bg-surface-light dark:bg-surface-dark p-4 rounded-xl border border-border-light dark:border-border-dark shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="material-icons text-slate-400">search</span>
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search commodities (e.g., Maize, Rice)..."
            className="block w-full pl-10 pr-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg leading-5 bg-white dark:bg-slate-800 placeholder-slate-500 focus:outline-none focus:placeholder-slate-400 focus:border-primary focus:ring-1 focus:ring-primary sm:text-sm transition duration-150 ease-in-out dark:text-white"
          />
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <select
            value={category}
            onChange={(e) => { setCategory(e.target.value); setPage(1); }}
            className="block w-full pl-3 pr-10 py-2 text-base border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-lg dark:bg-slate-800 dark:text-white"
          >
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-background-dark bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors whitespace-nowrap"
          >
            <span className="material-icons text-lg mr-1">file_download</span>
            Export
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border-light dark:divide-border-dark">
            <thead className="bg-slate-50 dark:bg-slate-900/50">
              <tr>
                {["Commodity", "Category", "Unit", "Official Price", "Last Updated", ""].map(
                  (h, i) => (
                    <th
                      key={i}
                      scope="col"
                      className={`px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider ${
                        i === 3 ? "text-right" : i === 5 ? "relative" : "text-left"
                      } ${i === 4 ? "pl-8" : ""}`}
                    >
                      {h || <span className="sr-only">Edit</span>}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="bg-surface-light dark:bg-surface-dark divide-y divide-border-light dark:divide-border-dark">
              {paginated.map((item) => (
                <tr
                  key={item.id}
                  className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${
                    item.id === editingId ? "bg-primary/5 dark:bg-primary/5" : ""
                  }`}
                >
                  {/* Name + image */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="relative h-10 w-10 shrink-0">
                        <Image
                          src={item.imageUrl}
                          alt={item.imageAlt}
                          fill
                          className="rounded-full object-cover"
                          sizes="40px"
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-slate-900 dark:text-white">
                          {item.name}
                        </div>
                        <div className="text-xs text-slate-500">{item.subtitle}</div>
                      </div>
                    </div>
                  </td>
                  {/* Category */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <CategoryBadge category={item.category} />
                  </td>
                  {/* Unit */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                    {item.unit}
                  </td>
                  {/* Price */}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-slate-900 dark:text-white font-mono">
                    ${item.officialPrice.toFixed(2)}
                  </td>
                  {/* Last updated */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400 pl-8">
                    {item.lastUpdated}
                  </td>
                  {/* Edit */}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      type="button"
                      onClick={() => onEdit(item)}
                      className="text-slate-400 hover:text-primary transition-colors"
                      aria-label={`Edit ${item.name}`}
                    >
                      <span className="material-icons">edit</span>
                    </button>
                  </td>
                </tr>
              ))}

              {paginated.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-sm text-slate-400">
                    No commodities match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-surface-light dark:bg-surface-dark px-4 py-3 flex items-center justify-between border-t border-border-light dark:border-border-dark sm:px-6 mt-auto">
          <p className="text-sm text-slate-700 dark:text-slate-300">
            Showing{" "}
            <span className="font-medium">
              {filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}
            </span>{" "}
            to{" "}
            <span className="font-medium">
              {Math.min(page * PAGE_SIZE, filtered.length)}
            </span>{" "}
            of <span className="font-medium">{filtered.length}</span> results
          </p>

          <nav
            aria-label="Pagination"
            className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
          >
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-border-light dark:border-border-dark bg-white dark:bg-slate-800 text-sm font-medium text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <span className="sr-only">Previous</span>
              <span className="material-icons text-base">chevron_left</span>
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setPage(n)}
                aria-current={n === page ? "page" : undefined}
                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium transition-colors ${
                  n === page
                    ? "z-10 bg-primary/20 border-primary text-primary-dark dark:text-primary"
                    : "bg-white dark:bg-slate-800 border-border-light dark:border-border-dark text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700"
                }`}
              >
                {n}
              </button>
            ))}

            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-border-light dark:border-border-dark bg-white dark:bg-slate-800 text-sm font-medium text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <span className="sr-only">Next</span>
              <span className="material-icons text-base">chevron_right</span>
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}