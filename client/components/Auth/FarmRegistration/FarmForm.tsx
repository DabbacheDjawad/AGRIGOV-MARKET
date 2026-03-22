import type { RegistrationFormState, CropType, FarmSizeUnit } from "@/types/FarmRegistration";
import { REGIONS, CROP_TYPES, FARM_SIZE_UNITS } from "@/types/FarmRegistration";
import DocumentUpload from "./DocUpload";

interface Props {
  form: RegistrationFormState;
  onChange: <K extends keyof RegistrationFormState>(key: K, value: RegistrationFormState[K]) => void;
}

const fieldClass =
  "block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 focus:border-primary focus:ring-primary sm:text-sm py-2.5 px-3 outline-none";

const labelClass = "text-sm font-medium text-gray-700 dark:text-gray-300";

const sectionHeading = (title: string) => (
  <div className="md:col-span-2 mt-2">
    <h4 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4 border-b border-gray-100 dark:border-white/10 pb-2">
      {title}
    </h4>
  </div>
);

export default function FarmDetailsForm({ form, onChange }: Props) {
  return (
    <div className="space-y-8">
      {/* Step heading */}
      <div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Farm Details</h3>
        <p className="text-gray-500 dark:text-gray-400">
          Please provide accurate information about your agricultural operations. This helps us
          match you with the right buyers.
        </p>
      </div>

      {/* Role reminder badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary-dark dark:text-primary">
        <span className="material-icons text-base">agriculture</span>
        Registering as: {form.role}
      </div>

      {/* Form grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sectionHeading("Location Information")}

        {/* Region */}
        <div className="space-y-1">
          <label htmlFor="region" className={labelClass}>
            Region / Province
          </label>
          <div className="relative">
            <select
              id="region"
              value={form.region}
              onChange={(e) => onChange("region", e.target.value)}
              className={`${fieldClass} appearance-none pr-8`}
            >
              <option value="">Select Region</option>
              {REGIONS.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
            <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-gray-500">
              <span className="material-icons text-lg">expand_more</span>
            </span>
          </div>
        </div>

        {/* District */}
        <div className="space-y-1">
          <label htmlFor="district" className={labelClass}>
            District / County
          </label>
          <input
            id="district"
            type="text"
            value={form.district}
            onChange={(e) => onChange("district", e.target.value)}
            placeholder="e.g. Makuyu District"
            className={fieldClass}
          />
        </div>

        {/* Address */}
        <div className="md:col-span-2 space-y-1">
          <label htmlFor="address" className={labelClass}>
            Detailed Address / Landmark
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              <span className="material-icons text-lg">place</span>
            </span>
            <input
              id="address"
              type="text"
              value={form.address}
              onChange={(e) => onChange("address", e.target.value)}
              placeholder="Near the Community Water Tank..."
              className={`${fieldClass} pl-10`}
            />
          </div>
        </div>

        {sectionHeading("Production Capacity")}

        {/* Farm size + unit */}
        <div className="space-y-1">
          <label htmlFor="farm-size" className={labelClass}>
            Farm Size
          </label>
          <div className="relative rounded-md shadow-sm flex">
            <input
              id="farm-size"
              type="number"
              min={0}
              step={0.1}
              value={form.farmSize}
              onChange={(e) => onChange("farmSize", e.target.value)}
              placeholder="0.0"
              className={`${fieldClass} rounded-r-none flex-1 pr-2`}
            />
            <select
              value={form.farmSizeUnit}
              onChange={(e) => onChange("farmSizeUnit", e.target.value as FarmSizeUnit)}
              aria-label="Farm size unit"
              className="border border-l-0 border-gray-300 dark:border-gray-600 rounded-r-lg bg-gray-50 dark:bg-white/10 text-gray-500 dark:text-gray-400 text-sm focus:border-primary focus:ring-primary py-2.5 pl-2 pr-7 outline-none"
            >
              {FARM_SIZE_UNITS.map((u) => (
                <option key={u}>{u}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Crop type */}
        <div className="space-y-1">
          <label htmlFor="crop-type" className={labelClass}>
            Primary Crop Type
          </label>
          <div className="relative">
            <select
              id="crop-type"
              value={form.cropType}
              onChange={(e) => onChange("cropType", e.target.value as CropType)}
              className={`${fieldClass} appearance-none pr-8`}
            >
              {CROP_TYPES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-gray-500">
              <span className="material-icons text-lg">expand_more</span>
            </span>
          </div>
        </div>

        {/* Document upload */}
        <DocumentUpload
          file={form.documentFile}
          onChange={(file) => onChange("documentFile", file)}
        />
      </div>
    </div>
  );
}