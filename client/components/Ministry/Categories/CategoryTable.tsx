import type { ApiCategory } from '@/types/CategoryManagement';

interface CategoryTableProps {
  categories: ApiCategory[];
  totalCount: number;
  page:       number;
  isLoading:  boolean;
  onEdit:     (id: number) => void;
  onDelete:   (id: number) => void;
  onPageChange: (page: number) => void;
  pageSize:   number;
}

const PAGE_ICONS: Record<string, string> = {
  vegetables: 'eco',
  fruits:     'nutrition',
  grains:     'grass',
  tubers:     'potted_plant',
  dairy:      'water_drop',
  meat:       'restaurant',
  legumes:    'spa',
};

function guessIcon(name: string): string {
  const key = name.toLowerCase();
  for (const [k, v] of Object.entries(PAGE_ICONS)) {
    if (key.includes(k)) return v;
  }
  return 'category';
}

function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      {[1, 2, 3, 4].map((i) => (
        <td key={i} className="px-6 py-4">
          <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
          {i === 1 && <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded w-1/2 mt-2" />}
        </td>
      ))}
    </tr>
  );
}

export default function CategoryTable({
  categories,
  totalCount,
  page,
  isLoading,
  pageSize,
  onEdit,
  onDelete,
  onPageChange,
}: CategoryTableProps) {
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const start      = totalCount === 0 ? 0 : (page - 1) * pageSize + 1;
  const end        = Math.min(page * pageSize, totalCount);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
      {/* Table Header */}
      <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
        <h3 className="font-bold">Product Categories</h3>
        <div className="flex gap-2">
          <button
            aria-label="Filter categories"
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined text-slate-500">filter_list</span>
          </button>
          <button
            aria-label="Download categories"
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined text-slate-500">download</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 uppercase text-[11px] font-bold tracking-wider">
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Slug</th>
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {isLoading ? (
              Array.from({ length: pageSize }).map((_, i) => <SkeletonRow key={i} />)
            ) : categories.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-12 text-center text-sm text-slate-400 font-medium"
                >
                  <span className="material-symbols-outlined text-3xl block mb-2 opacity-40">
                    category
                  </span>
                  No categories found. Create your first category to get started.
                </td>
              </tr>
            ) : (
              categories.map((cat) => (
                <tr
                  key={cat.id}
                  className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors"
                >
                  {/* Icon & Name */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                        <span className="material-symbols-outlined">
                          {guessIcon(cat.name)}
                        </span>
                      </div>
                      <span className="font-semibold capitalize">{cat.name}</span>
                    </div>
                  </td>

                  {/* Slug */}
                  <td className="px-6 py-4">
                    <span className="font-mono text-xs bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg text-slate-600 dark:text-slate-400">
                      {cat.slug}
                    </span>
                  </td>

                  {/* ID */}
                  <td className="px-6 py-4 text-slate-400 font-mono text-sm">
                    #{cat.id}
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        aria-label={`Edit ${cat.name}`}
                        onClick={() => onEdit(cat.id)}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-primary transition-colors"
                      >
                        <span className="material-symbols-outlined text-xl">edit</span>
                      </button>
                      <button
                        aria-label={`Delete ${cat.name}`}
                        onClick={() => onDelete(cat.id)}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-red-500 transition-colors"
                      >
                        <span className="material-symbols-outlined text-xl">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer / Pagination */}
      <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
        <span className="text-xs text-slate-500 font-medium">
          Showing <span className="font-bold">{start}–{end}</span> of{' '}
          <span className="font-bold">{totalCount}</span>{' '}
          {totalCount === 1 ? 'category' : 'categories'}
        </span>
        <div className="flex gap-1">
          <button
            disabled={page === 1 || isLoading}
            onClick={() => onPageChange(page - 1)}
            className="px-3 py-1 border border-slate-200 dark:border-slate-700 rounded text-xs font-bold bg-white dark:bg-slate-800 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Prev
          </button>
          <button
            disabled={page === totalPages || isLoading}
            onClick={() => onPageChange(page + 1)}
            className="px-3 py-1 border border-slate-200 dark:border-slate-700 rounded text-xs font-bold bg-white dark:bg-slate-800 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}