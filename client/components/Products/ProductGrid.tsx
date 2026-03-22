"use client";

import { useState } from "react";
import ProductCard from "./ProductCard";
import type { Product, Filters } from "@/types/Product";

interface Props {
  products: Product[];
  totalCount: number;
  filters: Filters;
  onRemoveCategory: (cat: string) => void;
}

const PAGE_SIZE = 6;

const CATEGORY_LABELS: Record<string, string> = {
  grains: "Grains & Cereals",
  veg: "Vegetables",
  fruit: "Fruits",
  tubers: "Tubers",
};

export default function ProductGrid({ products, totalCount, filters, onRemoveCategory }: Props) {
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(products.length / PAGE_SIZE);
  const paginated = products.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="flex-1">
      {/* Results count + active filter pills */}
      <div className="mb-4 flex items-center justify-between flex-wrap gap-2">
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Showing{" "}
          <span className="font-bold text-neutral-900 dark:text-white">{products.length}</span>{" "}
          of{" "}
          <span className="font-bold text-neutral-900 dark:text-white">{totalCount}</span>{" "}
          fresh products
        </p>

        {/* Active filter pills */}
        <div className="hidden sm:flex flex-wrap gap-2">
          {filters.categories.map((cat) => (
            <span
              key={cat}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200"
            >
              {CATEGORY_LABELS[cat] ?? cat}
              <button
                type="button"
                onClick={() => onRemoveCategory(cat)}
                className="shrink-0 ml-1.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-neutral-400 hover:bg-neutral-200 hover:text-neutral-500 focus:outline-none"
              >
                <span className="sr-only">Remove {CATEGORY_LABELS[cat]} filter</span>
                <span className="material-icons text-xs">close</span>
              </button>
            </span>
          ))}
          {filters.grade && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200">
              {filters.grade}
            </span>
          )}
        </div>
      </div>

      {/* Grid */}
      {paginated.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {paginated.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-neutral-400">
          <span className="material-icons text-5xl mb-4">search_off</span>
          <p className="text-lg font-medium">No products match your filters.</p>
          <p className="text-sm mt-1">Try adjusting the filters or search term.</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-10 flex items-center justify-center">
          <nav aria-label="Pagination" className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm font-medium text-neutral-500 hover:bg-neutral-50 dark:hover:bg-neutral-700 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <span className="sr-only">Previous</span>
              <span className="material-icons">chevron_left</span>
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                onClick={() => setPage(n)}
                aria-current={n === page ? "page" : undefined}
                className={`relative inline-flex items-center px-4 py-2 border text-sm font-bold transition-colors ${
                  n === page
                    ? "z-10 bg-primary/10 border-primary text-primary-dark"
                    : "bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-500 hover:bg-neutral-50 dark:hover:bg-neutral-700"
                }`}
              >
                {n}
              </button>
            ))}

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm font-medium text-neutral-500 hover:bg-neutral-50 dark:hover:bg-neutral-700 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <span className="sr-only">Next</span>
              <span className="material-icons">chevron_right</span>
            </button>
          </nav>
        </div>
      )}
    </div>
  );
}