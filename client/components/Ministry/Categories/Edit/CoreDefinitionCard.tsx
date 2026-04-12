import type { CategoryForm } from '@/types/EditCategory';
import { slugify } from '@/types/EditCategory';

interface CoreDefinitionCardProps {
  form:     CategoryForm;
  onChange: (field: keyof CategoryForm, value: string) => void;
}

export default function CoreDefinitionCard({ form, onChange }: CoreDefinitionCardProps) {
  const handleNameChange = (v: string) => {
    onChange('name', v);
    // Only auto-sync slug if it is currently equal to the slugified old name
    // (i.e. user hasn't manually edited the slug yet)
    if (form.slug === slugify(form.name)) {
      onChange('slug', slugify(v));
    }
  };

  return (
    <section className="bg-white dark:bg-slate-900 rounded-xl p-8 shadow-sm border border-primary/10">
      <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
        <span className="material-symbols-outlined text-primary">info</span>
        Core Definition
      </h3>

      <div className="space-y-6">
        {/* Name */}
        <div>
          <label
            htmlFor="cat-name"
            className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2"
          >
            Category Name <span className="text-red-500">*</span>
          </label>
          <input
            id="cat-name"
            type="text"
            value={form.name}
            onChange={(e) => handleNameChange(e.target.value)}
            className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-lg p-4 focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-slate-100 font-medium outline-none transition-all"
          />
        </div>

        {/* Slug */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label
              htmlFor="cat-slug"
              className="block text-xs font-bold uppercase tracking-widest text-slate-500"
            >
              Slug <span className="text-red-500">*</span>
            </label>
            <button
              type="button"
              onClick={() => onChange('slug', slugify(form.name))}
              className="text-[10px] text-primary font-bold hover:underline"
            >
              Re-generate from name
            </button>
          </div>
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-primary/50 transition-all">
            <span className="px-3 text-slate-400 text-sm font-mono shrink-0">/</span>
            <input
              id="cat-slug"
              type="text"
              value={form.slug}
              onChange={(e) => onChange('slug', slugify(e.target.value))}
              className="flex-1 bg-transparent p-4 font-mono text-sm text-slate-700 dark:text-slate-300 outline-none"
            />
          </div>
          <p className="text-[10px] text-slate-400 mt-1 ml-1">
            Used in API and URL paths. Only lowercase letters, numbers, and hyphens.
          </p>
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="cat-desc"
            className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2"
          >
            Description
          </label>
          <textarea
            id="cat-desc"
            rows={4}
            value={form.description}
            onChange={(e) => onChange('description', e.target.value)}
            className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-lg p-4 focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-slate-100 outline-none transition-all resize-none"
          />
        </div>
      </div>
    </section>
  );
}