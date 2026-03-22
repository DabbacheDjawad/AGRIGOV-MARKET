"use client";

import type { Filters } from "@/types/Product";

interface Props {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
}

const categories = [
  { id: "grains", label: "Grains & Cereals" },
  { id: "veg", label: "Vegetables" },
  { id: "fruit", label: "Fruits" },
  { id: "tubers", label: "Tubers" },
];

const regions = [
  "All Regions",
  "North District",
  "Central Valley",
  "Coastal Plains",
  "Highlands",
];

const grades = ["Grade A", "Grade B", "Export", "Organic"];

export default function FiltersSidebar({ filters, onFiltersChange }: Props) {
  const toggleCategory = (id: string) => {
    const updated = filters.categories.includes(id)
      ? filters.categories.filter((c) => c !== id)
      : [...filters.categories, id];
    onFiltersChange({ ...filters, categories: updated });
  };

  const selectGrade = (grade: string) => {
    onFiltersChange({
      ...filters,
      grade: filters.grade === grade ? null : grade,
    });
  };

  const reset = () => {
    onFiltersChange({ categories: [], region: "All Regions", grade: null });
  };

  return (
    <aside className="w-full lg:w-64 shrink-0">
      <div className="bg-white dark:bg-neutral-surface-dark rounded-xl shadow-sm border border-neutral-100 dark:border-neutral-800 p-6 sticky top-24">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Filters</h2>
          <button
            onClick={reset}
            className="text-sm text-primary-dark font-medium hover:text-primary transition-colors"
          >
            Reset
          </button>
        </div>

        <div className="space-y-6">
          {/* Category */}
          <fieldset>
            <legend className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Category
            </legend>
            <div className="space-y-2">
              {categories.map((cat) => (
                <div key={cat.id} className="flex items-center">
                  <input
                    id={cat.id}
                    type="checkbox"
                    checked={filters.categories.includes(cat.id)}
                    onChange={() => toggleCategory(cat.id)}
                    className="h-4 w-4 text-primary focus:ring-primary border-neutral-300 rounded"
                  />
                  <label
                    htmlFor={cat.id}
                    className="ml-2 block text-sm text-neutral-600 dark:text-neutral-400 cursor-pointer"
                  >
                    {cat.label}
                  </label>
                </div>
              ))}
            </div>
          </fieldset>

          <hr className="border-neutral-100 dark:border-neutral-800" />

          {/* Region */}
          <div>
            <label
              htmlFor="region"
              className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2"
            >
              Region
            </label>
            <select
              id="region"
              value={filters.region}
              onChange={(e) => onFiltersChange({ ...filters, region: e.target.value })}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-lg bg-neutral-50 dark:bg-neutral-800"
            >
              {regions.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </div>

          <hr className="border-neutral-100 dark:border-neutral-800" />

          {/* Quality Grade */}
          <fieldset>
            <legend className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Quality Grade
            </legend>
            <div className="grid grid-cols-2 gap-2">
              {grades.map((grade) => {
                const active = filters.grade === grade;
                return (
                  <button
                    key={grade}
                    type="button"
                    onClick={() => selectGrade(grade)}
                    className={`rounded-lg border px-3 py-2 text-sm font-medium text-center transition-all ${
                      active
                        ? "border-primary bg-primary/10 text-primary-dark"
                        : "border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50"
                    }`}
                  >
                    {grade}
                  </button>
                );
              })}
            </div>
          </fieldset>
        </div>
      </div>
    </aside>
  );
}