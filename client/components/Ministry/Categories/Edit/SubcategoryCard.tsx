import Image from 'next/image';
import { MinistryProduct } from '@/types/MinistryProduct';

interface SubCategoriesCardProps {
  subCategories: MinistryProduct[];
  isLoading: boolean;
  error: string | null;
  onEdit:        (id: string) => void;
  onAdd:         () => void;
}

export default function SubCategoriesCard({
  subCategories,
  isLoading,
  error,
  onEdit,
  onAdd,
}: SubCategoriesCardProps) {
  return (
    <section className="bg-white dark:bg-slate-900 rounded-xl p-8 shadow-sm border border-primary/10 overflow-hidden relative">
      {/* Decorative blur circle */}
      <div
        className="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-2xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold">Managed Sub‑Categories</h3>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="space-y-4">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 animate-pulse">
              <div className="w-12 h-12 rounded-lg bg-slate-200 dark:bg-slate-700" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
                <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error state */}
      {!isLoading && error && (
        <p className="text-sm text-red-600 dark:text-red-400 py-4">{error}</p>
      )}

      {/* Empty state */}
      {!isLoading && !error && subCategories.length === 0 && (
        <p className="text-sm text-slate-400 text-center py-4 font-medium">
          No products assigned to this category yet.
        </p>
      )}

      {/* Product list */}
      {!isLoading &&
        !error &&
        subCategories.map((product) => (
          <div
            key={product.id}
            className="group flex items-center justify-between p-4 bg-background-light dark:bg-slate-800 rounded-xl hover:translate-x-1 transition-transform duration-200 cursor-pointer"
            onClick={() => onEdit(String(product.id))}
            role="button"
            tabIndex={0}
            aria-label={`Edit ${product.name}`}
            onKeyDown={(e) => e.key === 'Enter' && onEdit(String(product.id))}
          >
            <div className="flex items-center gap-4">
              {/* Placeholder image – replace if product.image_url exists */}
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-700 relative shrink-0">
                <Image
                  src={
                    (product as any).image_url ??
                    '/placeholder-product.jpg'
                  }
                  alt={product.name}
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-slate-100">
                  {product.name}
                </p>
                <p className="text-[10px] text-slate-400 uppercase">
                  {/* you could show category_name or just a generic label */}
                  {product.category_name ?? 'Product'}
                </p>
              </div>
            </div>
            <span className="material-symbols-outlined text-slate-300 group-hover:text-primary transition-colors">
              edit_note
            </span>
          </div>
        ))}
    </section>
  );
}