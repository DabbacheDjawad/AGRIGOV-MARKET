"use client";

import { useState } from "react";
import Navbar from "@/components/navbar";
import FiltersSidebar from "@/components/Products/FilterSideBar";
import ProductGrid from "@/components/Products/ProductGrid";
import { products } from "@/types/Product";
import type { Filters } from "@/types/Product";

export default function MarketplaceCatalog() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("Newest Harvest");
  const [filters, setFilters] = useState<Filters>({
    categories: ["veg"],
    region: "All Regions",
    grade: null,
  });

  const filtered = products.filter((p) => {
    const matchSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());

    const matchCategory =
      filters.categories.length === 0 ||
      filters.categories.some((c) =>
        p.categoryId.toLowerCase().includes(c.toLowerCase())
      );

    const matchRegion =
      filters.region === "All Regions" || p.region === filters.region;

    const matchGrade =
      !filters.grade || p.grade.toLowerCase() === filters.grade.toLowerCase();

    return matchSearch && matchCategory && matchRegion && matchGrade;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sort === "Price: Low to High") return a.price - b.price;
    if (sort === "Price: High to Low") return b.price - a.price;
    return b.harvestOrder - a.harvestOrder;
  });

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-neutral-800 dark:text-neutral-100 antialiased min-h-screen flex flex-col">
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Header */}
        <div className="mb-8 space-y-4">
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white tracking-tight">
            Browse Fresh Produce
          </h1>
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="material-icons text-neutral-400">search</span>
              </div>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-neutral-200 dark:border-neutral-700 rounded-xl leading-5 bg-white dark:bg-neutral-surface-dark placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm shadow-sm transition-all"
                placeholder="Search for grains, vegetables, regions..."
              />
            </div>
            {/* Sort */}
            <div className="flex items-center gap-2">
              <label htmlFor="sort" className="sr-only">
                Sort by
              </label>
              <select
                id="sort"
                name="sort"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="block w-full pl-3 pr-10 py-3 text-base border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-xl bg-white dark:bg-neutral-surface-dark shadow-sm"
              >
                <option>Newest Harvest</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Nearest Location</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <FiltersSidebar filters={filters} onFiltersChange={setFilters} />
          <ProductGrid
            products={sorted}
            totalCount={products.length}
            filters={filters}
            onRemoveCategory={(cat) =>
              setFilters((f) => ({
                ...f,
                categories: f.categories.filter((c) => c !== cat),
              }))
            }
          />
        </div>
      </main>
    </div>
  );
}