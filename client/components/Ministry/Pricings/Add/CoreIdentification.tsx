import type { OfficialPriceForm } from "@/types/AddOfficialPrice";
import { UNIT_OPTIONS } from "@/types/Prices";

interface Props {
  form:     OfficialPriceForm;
  onChange: (field: keyof OfficialPriceForm, value: string) => void;
  errors:   Partial<Record<keyof OfficialPriceForm, string>>;
}

const inputCls =
  "w-full bg-slate-100 dark:bg-slate-800 border-none rounded-lg p-3 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary/50 outline-none transition-all text-sm";

export default function CoreIdentificationCard({ form, onChange, errors }: Props) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl p-8 space-y-6 border border-primary/10 shadow-sm">
      <div className="flex items-center gap-3 mb-2">
        <span className="material-symbols-outlined text-primary">edit_note</span>
        <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">
          Price Entry Details
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Ministry product ID */}
        <div className="space-y-2">
          <label
            htmlFor="product-id"
            className="block text-xs font-bold uppercase tracking-wider text-slate-500"
          >
            Ministry Product ID <span className="text-red-500">*</span>
          </label>
          <input
            id="product-id"
            type="number"
            min={1}
            value={form.product}
            onChange={(e) => onChange("product", e.target.value)}
            placeholder="e.g. 3"
            className={inputCls}
          />
          {errors.product && (
            <p className="text-xs text-red-500">{errors.product}</p>
          )}
          <p className="text-[10px] text-slate-400">
            The ID of the ministry-managed product from /api/ministry-products/.
          </p>
        </div>

        {/* Unit */}
        <div className="space-y-2">
          <label
            htmlFor="unit"
            className="block text-xs font-bold uppercase tracking-wider text-slate-500"
          >
            Unit <span className="text-red-500">*</span>
          </label>
          <select
            id="unit"
            value={form.unit}
            onChange={(e) => onChange("unit", e.target.value)}
            className={inputCls}
          >
            {UNIT_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
            <option value="bag">bag</option>
            <option value="quintal">quintal</option>
          </select>
        </div>
      </div>

      {/* Price range */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label
            htmlFor="min-price"
            className="block text-xs font-bold uppercase tracking-wider text-slate-500"
          >
            Min Price (DZD) <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold pointer-events-none">
              DZD
            </span>
            <input
              id="min-price"
              type="number"
              min={0}
              step={0.01}
              value={form.min_price}
              onChange={(e) => onChange("min_price", e.target.value)}
              placeholder="0.00"
              className={`${inputCls} pl-12`}
            />
          </div>
          {errors.min_price && (
            <p className="text-xs text-red-500">{errors.min_price}</p>
          )}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="max-price"
            className="block text-xs font-bold uppercase tracking-wider text-slate-500"
          >
            Max Price (DZD) <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold pointer-events-none">
              DZD
            </span>
            <input
              id="max-price"
              type="number"
              min={0}
              step={0.01}
              value={form.max_price}
              onChange={(e) => onChange("max_price", e.target.value)}
              placeholder="0.00"
              className={`${inputCls} pl-12`}
            />
          </div>
          {errors.max_price && (
            <p className="text-xs text-red-500">{errors.max_price}</p>
          )}
          {form.min_price &&
            form.max_price &&
            parseFloat(form.min_price) > parseFloat(form.max_price) && (
              <p className="text-xs text-red-500">Max must be ≥ min.</p>
            )}
        </div>
      </div>

      {/* Wilaya */}
      <div className="space-y-2">
        <label
          htmlFor="wilaya"
          className="block text-xs font-bold uppercase tracking-wider text-slate-500"
        >
          Wilaya (leave empty for national)
        </label>
        <input
          id="wilaya"
          type="text"
          value={form.wilaya}
          onChange={(e) => onChange("wilaya", e.target.value)}
          placeholder="e.g. Constantine, Algiers"
          className={inputCls}
        />
        <p className="text-[10px] text-slate-400">
          The backend will derive the region (north/south/east/west/national) from the wilaya.
        </p>
      </div>

      {/* Valid from / until */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label
            htmlFor="valid-from"
            className="block text-xs font-bold uppercase tracking-wider text-slate-500"
          >
            Valid From <span className="text-red-500">*</span>
          </label>
          <input
            id="valid-from"
            type="datetime-local"
            value={form.valid_from}
            onChange={(e) => onChange("valid_from", e.target.value)}
            className={inputCls}
          />
          {errors.valid_from && (
            <p className="text-xs text-red-500">{errors.valid_from}</p>
          )}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="valid-until"
            className="block text-xs font-bold uppercase tracking-wider text-slate-500"
          >
            Valid Until (leave empty = no expiry)
          </label>
          <input
            id="valid-until"
            type="datetime-local"
            value={form.valid_until}
            onChange={(e) => onChange("valid_until", e.target.value)}
            className={inputCls}
          />
        </div>
      </div>
    </div>
  );
}