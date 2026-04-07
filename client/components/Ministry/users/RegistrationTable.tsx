import type { ApiPendingUser, RoleFilter } from '@/types/UserManagement';
import { ROLE_BADGE_STYLES, ROLE_FILTERS, PAGE_SIZE, apiRoleToDisplay } from '@/types/UserManagement';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('fr-DZ', {
    month: 'short',
    day:   '2-digit',
    year:  'numeric',
  });
}

function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      {[1, 2, 3, 4, 5].map((i) => (
        <td key={i} className="px-6 py-4">
          <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
          {i === 1 && <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded w-1/2 mt-2" />}
        </td>
      ))}
    </tr>
  );
}

interface Props {
  users:          ApiPendingUser[];
  activeFilter:   RoleFilter;
  currentPage:    number;
  totalCount:     number;
  isLoading:      boolean;
  onFilterChange: (filter: RoleFilter) => void;
  onPageChange:   (page: number) => void;
  onViewDocs:     (id: number) => void;
  onApprove:      (id: number) => void;
  onReject:       (id: number) => void;
}

export default function RegistrationTable({
  users, activeFilter, currentPage, totalCount, isLoading,
  onFilterChange, onPageChange, onViewDocs, onApprove, onReject,
}: Props) {
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const offset     = (currentPage - 1) * PAGE_SIZE;
  const start      = totalCount === 0 ? 0 : offset + 1;
  const end        = Math.min(offset + PAGE_SIZE, totalCount);

  // Client-side role filter
  const filtered = activeFilter === 'All'
    ? users
    : users.filter((u) => apiRoleToDisplay(u.role) === activeFilter);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      {/* Toolbar */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <h3 className="text-lg font-bold">Registration Requests</h3>

        <div className="flex items-center gap-3">
          <div
            role="tablist"
            aria-label="Filter by role"
            className="flex rounded-lg border border-slate-200 dark:border-slate-800 p-1 bg-slate-50 dark:bg-slate-800/50"
          >
            {ROLE_FILTERS.map((filter) => (
              <button
                key={filter}
                role="tab"
                aria-pressed={activeFilter === filter}
                onClick={() => onFilterChange(filter)}
                className={
                  activeFilter === filter
                    ? 'px-3 py-1 rounded-md bg-white dark:bg-slate-700 shadow-sm text-xs font-bold transition-all'
                    : 'px-3 py-1 rounded-md text-slate-500 dark:text-slate-400 text-xs font-medium hover:text-primary transition-colors'
                }
              >
                {filter}
              </button>
            ))}
          </div>

          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            <span className="material-symbols-outlined text-sm">filter_list</span>
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Registered</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {isLoading ? (
              Array.from({ length: PAGE_SIZE }).map((_, i) => <SkeletonRow key={i} />)
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-sm text-slate-400 font-medium">
                  <span className="material-symbols-outlined text-3xl block mb-2 opacity-40">
                    inbox
                  </span>
                  No pending requests match the current filter.
                </td>
              </tr>
            ) : (
              filtered.map((user) => {
                const displayRole = apiRoleToDisplay(user.role);
                const roleBadge   = displayRole ? ROLE_BADGE_STYLES[displayRole] : '';

                return (
                  <tr
                    key={user.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    {/* User */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="size-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-primary text-base">
                            person
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-bold">{user.username}</p>
                          <p className="text-xs text-slate-500 truncate max-w-50">
                            {user.email}
                          </p>
                          <p className="text-xs text-slate-400 font-mono">#{user.id}</p>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="px-6 py-4">
                      {displayRole ? (
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${roleBadge}`}>
                          {displayRole.toUpperCase()}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400">{user.role}</span>
                      )}
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                      {formatDate(user.created_at)}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="size-2 rounded-full bg-amber-500" />
                        <span className="text-sm font-medium text-amber-600 dark:text-amber-500">
                          Pending
                        </span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => onViewDocs(user.id)}
                          className="px-3 py-1.5 text-xs font-bold text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors"
                        >
                          View Docs
                        </button>
                        <button
                          aria-label={`Approve ${user.username}`}
                          onClick={() => onApprove(user.id)}
                          className="p-1.5 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-colors"
                        >
                          <span className="material-symbols-outlined text-xl">check_circle</span>
                        </button>
                        <button
                          aria-label={`Reject ${user.username}`}
                          onClick={() => onReject(user.id)}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors"
                        >
                          <span className="material-symbols-outlined text-xl">cancel</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="p-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Showing <span className="font-bold">{start}–{end}</span> of{' '}
          <span className="font-bold">{totalCount}</span> pending requests
        </p>
        <div className="flex gap-2">
          <button
            disabled={currentPage === 1 || isLoading}
            onClick={() => onPageChange(currentPage - 1)}
            className="px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-800 text-sm font-bold disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            Previous
          </button>
          <button
            disabled={currentPage === totalPages || isLoading}
            onClick={() => onPageChange(currentPage + 1)}
            className="px-3 py-1 rounded-lg bg-primary text-slate-900 text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}