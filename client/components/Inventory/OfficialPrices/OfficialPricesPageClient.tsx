"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { officialPriceApi, categoryApi, ApiError } from "@/lib/api";
import type { ApiOfficialPrice } from "@/types/Prices";
import { formatPriceRange, formatOfficialPriceDate, regionBadgeClass } from "@/types/Prices";
import type { ApiCategory } from "@/types/CategoryManagement";

const PAGE_SIZE = 12;

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function PriceCardSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-neutral-light dark:border-border-dark p-5 animate-pulse space-y-3">
      <div className="flex justify-between items-start">
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-2/5" />
        <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded-full w-16" />
      </div>
      <div className="h-7 bg-slate-200 dark:bg-slate-700 rounded w-3/5" />
      <div className="flex gap-2">
        <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded w-1/4" />
        <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded w-1/4" />
      </div>
      <div className="h-px bg-slate-100 dark:bg-slate-700" />
      <div className="flex justify-between">
        <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded w-1/3" />
        <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded w-1/4" />
      </div>
    </div>
  );
}

function CategoryPillSkeleton() {
  return <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse w-24" />;
}

// ─── Price Card ───────────────────────────────────────────────────────────────

function PriceCard({ item }: { item: ApiOfficialPrice }) {
  const minP = parseFloat(item.min_price);
  const maxP = parseFloat(item.max_price);
  const mid  = (minP + maxP) / 2;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-neutral-light dark:border-border-dark shadow-sm hover:border-primary/50 hover:shadow-md transition-all p-5 flex flex-col gap-3">
      {/* Header: product name + active badge */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-bold text-slate-900 dark:text-white capitalize leading-tight">
            {item.product_detail.name}
          </p>
          {item.product_detail.category_name && (
            <p className="text-xs text-slate-400 mt-0.5 capitalize">
              {item.product_detail.category_name}
            </p>
          )}
        </div>
        {item.is_active ? (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 dark:bg-primary/20 text-primary-dark dark:text-primary text-[11px] font-bold shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Active
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 text-[11px] font-bold shrink-0">
            Inactive
          </span>
        )}
      </div>

      {/* Mid-price hero */}
      <div>
        <p className="text-2xl font-black text-slate-900 dark:text-white font-mono tabular-nums">
          {mid.toLocaleString("fr-DZ", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          <span className="text-sm font-semibold text-slate-400 ml-1">DZD/{item.unit}</span>
        </p>
        <p className="text-xs text-slate-500 mt-0.5">
          Range: {formatPriceRange(item)}
        </p>
      </div>

      {/* Region badge */}
      <span className={`self-start px-2 py-0.5 rounded-full text-[11px] font-bold ${regionBadgeClass(item.region_name)}`}>
        {item.region_name ? item.region_name.charAt(0).toUpperCase() + item.region_name.slice(1) : "National"}
        {item.wilaya ? ` · ${item.wilaya}` : ""}
      </span>

      {/* Divider */}
      <div className="border-t border-neutral-light dark:border-border-dark" />

      {/* Validity */}
      <div className="flex items-center justify-between text-[11px] text-slate-400">
        <span className="flex items-center gap-1">
          <span className="material-icons text-[13px]">calendar_today</span>
          From {formatOfficialPriceDate(item.valid_from)}
        </span>
        <span>
          {item.valid_until
            ? `Until ${formatOfficialPriceDate(item.valid_until)}`
            : "No expiry"}
        </span>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function FarmerOfficialPricesClient() {
  const [prices,     setPrices]     = useState<ApiOfficialPrice[]>([]);
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page,       setPage]       = useState(1);
  const [isLoading,  setIsLoading]  = useState(true);
  const [loadError,  setLoadError]  = useState<string | null>(null);

  // Filters
  const [search,          setSearch]          = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [activeCategory,  setActiveCategory]  = useState<string>("");   // category name filter
  const [activeRegion,    setActiveRegion]    = useState<string>("");

  const cancelledRef = useRef(false);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => { setDebouncedSearch(search); setPage(1); }, 350);
    return () => clearTimeout(t);
  }, [search]);

  // Reset page when filters change
  useEffect(() => { setPage(1); }, [activeCategory, activeRegion]);

  // ── Fetch ───────────────────────────────────────────────────────────────────
  const fetchData = useCallback(() => {
    cancelledRef.current = false;
    setIsLoading(true);
    setLoadError(null);

    Promise.allSettled([
      officialPriceApi.list(page, PAGE_SIZE),
      categoryApi.list(1, 100),
    ]).then(([pricesResult, catsResult]) => {
      if (cancelledRef.current) return;

      if (pricesResult.status === "fulfilled") {
        setPrices(pricesResult.value.results);
        setTotalCount(pricesResult.value.count);
      } else {
        const err = pricesResult.reason;
        setLoadError(err instanceof ApiError ? err.message : "Failed to load prices.");
      }

      if (catsResult.status === "fulfilled") {
        setCategories(catsResult.value.results);
      }
    }).finally(() => {
      if (!cancelledRef.current) setIsLoading(false);
    });

    return () => { cancelledRef.current = true; };
  }, [page]);

  useEffect(() => { return fetchData(); }, [fetchData]);

  // ── Client-side filter (search + category + region) ─────────────────────────
  const filtered = useMemo(() => {
    let rows = prices;
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      rows = rows.filter((p) =>
        p.product_detail.name.toLowerCase().includes(q) ||
        (p.product_detail.category_name ?? "").toLowerCase().includes(q) ||
        p.wilaya.toLowerCase().includes(q) ||
        p.region_name.toLowerCase().includes(q)
      );
    }
    if (activeCategory) {
      rows = rows.filter((p) =>
        (p.product_detail.category_name ?? "").toLowerCase() === activeCategory.toLowerCase()
      );
    }
    if (activeRegion) {
      rows = rows.filter((p) =>
        p.region_name.toLowerCase() === activeRegion.toLowerCase()
      );
    }
    return rows;
  }, [prices, debouncedSearch, activeCategory, activeRegion]);

  const totalPages  = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const activeCount = prices.filter((p) => p.is_active).length;

  const REGIONS = ["north", "south", "east", "west", "national"];

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-800 dark:text-slate-100 min-h-screen">
      <main className="p-4 md:p-8  max-w-screen-2xl mx-auto w-full">

        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Official Market Prices
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Ministry-regulated reference prices. Use these as benchmarks when listing your products.
          </p>
        </div>

        {/* KPI strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { icon: "price_change", label: "Total Entries",    value: isLoading ? "—" : String(totalCount),  bg: "bg-blue-100 dark:bg-blue-900/30",   text: "text-blue-600 dark:text-blue-400"  },
            { icon: "verified",     label: "Active Prices",    value: isLoading ? "—" : String(activeCount), bg: "bg-primary/20",                      text: "text-primary-dark dark:text-primary" },
            { icon: "category",     label: "Categories",       value: isLoading ? "—" : String(categories.length), bg: "bg-purple-100 dark:bg-purple-900/30", text: "text-purple-600 dark:text-purple-400" },
            { icon: "map",          label: "Regions Covered",  value: isLoading ? "—" : String(new Set(prices.map((p) => p.region_name).filter(Boolean)).size), bg: "bg-amber-100 dark:bg-amber-900/30", text: "text-amber-600 dark:text-amber-400" },
          ].map((k) => (
            <div key={k.label} className="bg-white dark:bg-slate-800 rounded-xl border border-neutral-light dark:border-border-dark shadow-sm px-4 py-3 flex items-center gap-3">
              <div className={`p-2 rounded-lg ${k.bg} ${k.text}`}>
                <span className="material-icons text-xl">{k.icon}</span>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">{k.label}</p>
                <p className="text-lg font-bold text-slate-900 dark:text-white">{k.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

          {/* ── Sidebar ─────────────────────────────────────────────────────── */}
          <aside className="lg:col-span-1 space-y-5">

            {/* Search */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-neutral-light dark:border-border-dark shadow-sm p-4">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 material-icons text-lg">search</span>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search products…"
                  className="block w-full pl-10 pr-8 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-800 placeholder-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary dark:text-white transition-colors"
                />
                {search && (
                  <button onClick={() => setSearch("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    <span className="material-icons text-base">close</span>
                  </button>
                )}
              </div>
            </div>

            {/* Region filter */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-neutral-light dark:border-border-dark shadow-sm p-4">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Region</p>
              <div className="space-y-1">
                <button
                  onClick={() => setActiveRegion("")}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeRegion === ""
                      ? "bg-primary/10 text-primary-dark dark:text-primary font-bold"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700"
                  }`}
                >
                  All Regions
                </button>
                {REGIONS.map((r) => (
                  <button
                    key={r}
                    onClick={() => setActiveRegion(activeRegion === r ? "" : r)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                      activeRegion === r
                        ? "bg-primary/10 text-primary-dark dark:text-primary font-bold"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-neutral-light dark:border-border-dark shadow-sm p-4">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Categories</p>
              {isLoading ? (
                <div className="space-y-1.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-8 bg-slate-100 dark:bg-slate-700 rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : categories.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No categories found.</p>
              ) : (
                <div className="space-y-1">
                  <button
                    onClick={() => setActiveCategory("")}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeCategory === ""
                        ? "bg-primary/10 text-primary-dark dark:text-primary font-bold"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700"
                    }`}
                  >
                    All Categories
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(activeCategory === cat.name ? "" : cat.name)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                        activeCategory === cat.name
                          ? "bg-primary/10 text-primary-dark dark:text-primary font-bold"
                          : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700"
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info card */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-100 dark:border-blue-900/30">
              <div className="flex gap-3">
                <span className="material-icons text-blue-600 dark:text-blue-400 shrink-0">info</span>
                <div>
                  <h4 className="text-sm font-bold text-blue-800 dark:text-blue-300">Price Guidelines</h4>
                  <p className="text-xs text-blue-700 dark:text-blue-400 mt-1 leading-relaxed">
                    These are Ministry-regulated reference prices. Your listing price should stay within the
                    published min–max range for faster approval.
                  </p>
                </div>
              </div>
            </div>
          </aside>

          {/* ── Main content ─────────────────────────────────────────────────── */}
          <div className="lg:col-span-3 flex flex-col gap-5">

            {/* Active filters + result count */}
            <div className="flex items-center justify-between flex-wrap gap-2">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {isLoading ? (
                  "Loading…"
                ) : (
                  <>
                    Showing <span className="font-semibold text-slate-700 dark:text-slate-200">{filtered.length}</span>
                    {filtered.length !== totalCount && ` of ${totalCount}`} price entries
                  </>
                )}
              </p>

              {/* Active filter chips */}
              <div className="flex flex-wrap gap-2">
                {activeCategory && (
                  <button
                    onClick={() => setActiveCategory("")}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary-dark dark:text-primary text-xs font-bold border border-primary/20 hover:bg-primary/20 transition-colors"
                  >
                    <span className="material-icons text-[13px]">category</span>
                    {activeCategory}
                    <span className="material-icons text-[13px]">close</span>
                  </button>
                )}
                {activeRegion && (
                  <button
                    onClick={() => setActiveRegion("")}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary-dark dark:text-primary text-xs font-bold border border-primary/20 hover:bg-primary/20 transition-colors capitalize"
                  >
                    <span className="material-icons text-[13px]">map</span>
                    {activeRegion}
                    <span className="material-icons text-[13px]">close</span>
                  </button>
                )}
                {debouncedSearch && (
                  <button
                    onClick={() => setSearch("")}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold border border-slate-200 dark:border-slate-600 hover:bg-slate-200 transition-colors"
                  >
                    <span className="material-icons text-[13px]">search</span>
                    &ldquo;{debouncedSearch}&rdquo;
                    <span className="material-icons text-[13px]">close</span>
                  </button>
                )}
              </div>
            </div>

            {/* Error */}
            {loadError && (
              <div role="alert" className="flex items-start gap-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-700 dark:text-red-300">
                <span className="material-icons mt-0.5 shrink-0">error</span>
                <span className="flex-1">{loadError}</span>
                <button onClick={fetchData} className="shrink-0 underline font-semibold text-xs">Retry</button>
              </div>
            )}

            {/* Grid of price cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {isLoading
                ? Array.from({ length: PAGE_SIZE }).map((_, i) => <PriceCardSkeleton key={i} />)
                : filtered.length === 0
                ? (
                  <div className="sm:col-span-2 xl:col-span-3 flex flex-col items-center justify-center py-16 text-slate-400">
                    <span className="material-icons text-5xl mb-3 opacity-40">price_change</span>
                    <p className="text-sm font-medium">No price entries match your filters.</p>
                    <button
                      onClick={() => { setSearch(""); setActiveCategory(""); setActiveRegion(""); }}
                      className="mt-3 text-xs text-primary font-semibold hover:underline"
                    >
                      Clear all filters
                    </button>
                  </div>
                )
                : filtered.map((item) => <PriceCard key={item.id} item={item} />)
              }
            </div>

            {/* Pagination */}
            {!isLoading && totalPages > 1 && (
              <nav className="flex items-center justify-between pt-2">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Page <span className="font-semibold">{page}</span> of <span className="font-semibold">{totalPages}</span>
                </p>
                <div className="inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <span className="material-icons text-base">chevron_left</span>
                  </button>
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((n) => (
                    <button
                      key={n}
                      onClick={() => setPage(n)}
                      aria-current={n === page ? "page" : undefined}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium transition-colors ${
                        n === page
                          ? "z-10 bg-primary/20 border-primary text-primary-dark dark:text-primary"
                          : "bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700"
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <span className="material-icons text-base">chevron_right</span>
                  </button>
                </div>
              </nav>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}