'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import UserStatCards from './StatCards';
import RegistrationTable from './RegistrationTable';
import type { ApiPendingUser, RoleFilter, ApiDashboardOverview } from '@/types/UserManagement';
import { PAGE_SIZE } from '@/types/UserManagement';
import { ministryApi, ApiError } from '@/lib/api';

// ─── Rejection Modal ─────────────────────────────────────────────────────────

interface RejectModalProps {
  username:    string;
  onConfirm:   (reason: string) => void;
  onCancel:    () => void;
  isRejecting: boolean;
}

function RejectModal({ username, onConfirm, onCancel, isRejecting }: RejectModalProps) {
  const [reason, setReason] = useState('');
  const charLimit = 500;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="reject-modal-title"
    >
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-md w-full p-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-rose-600 text-xl">cancel</span>
          </div>
          <div>
            <h2 id="reject-modal-title" className="font-bold text-lg">
              Reject Registration
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              You are about to reject <span className="font-semibold">{username}</span>.
              Please provide a reason.
            </p>
          </div>
        </div>

        <label htmlFor="reject-reason" className="text-xs font-bold uppercase text-slate-500 tracking-wider block mb-2">
          Rejection Reason <span className="text-rose-500">*</span>
        </label>
        <textarea
          id="reject-reason"
          value={reason}
          onChange={(e) => setReason(e.target.value.slice(0, charLimit))}
          placeholder="e.g. Invalid documents – the submitted ID card is expired."
          rows={4}
          className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-rose-400 resize-none"
        />
        <p className={`text-right text-xs mt-1 ${reason.length >= charLimit ? 'text-rose-500' : 'text-slate-400'}`}>
          {reason.length}/{charLimit}
        </p>

        <div className="flex gap-3 mt-4">
          <button
            type="button"
            onClick={onCancel}
            disabled={isRejecting}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!reason.trim() || isRejecting}
            onClick={() => onConfirm(reason.trim())}
            className="flex-1 px-4 py-2.5 rounded-xl bg-rose-600 text-white text-sm font-bold hover:bg-rose-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isRejecting ? (
              <span className="material-symbols-outlined text-base animate-spin">
                progress_activity
              </span>
            ) : (
              <span className="material-symbols-outlined text-base">cancel</span>
            )}
            {isRejecting ? 'Rejecting…' : 'Confirm Rejection'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function UserManagementPage() {
  const router = useRouter();

  // ── Data state ─────────────────────────────────────────────────────────────
  const [overview,      setOverview]      = useState<ApiDashboardOverview | null>(null);
  const [users,         setUsers]         = useState<ApiPendingUser[]>([]);
  const [totalCount,    setTotalCount]    = useState(0);
  const [isLoadingDash, setIsLoadingDash] = useState(true);
  const [isLoadingUsers,setIsLoadingUsers]= useState(true);
  const [dashError,     setDashError]     = useState<string | null>(null);
  const [usersError,    setUsersError]    = useState<string | null>(null);

  // ── UI state ───────────────────────────────────────────────────────────────
  const [activeFilter,  setActiveFilter]  = useState<RoleFilter>('All');
  const [currentPage,   setCurrentPage]   = useState(1);
  const [toast,         setToast]         = useState<string | null>(null);

  // ── Rejection modal ────────────────────────────────────────────────────────
  const [rejectTarget,  setRejectTarget]  = useState<ApiPendingUser | null>(null);
  const [isRejecting,   setIsRejecting]   = useState(false);

  // ── Approve state ──────────────────────────────────────────────────────────
  const [approvingId,   setApprovingId]   = useState<number | null>(null);

  const cancelledRef = useRef(false);

  // ── fetch dashboard stats ──────────────────────────────────────────────────
  useEffect(() => {
    setIsLoadingDash(true);
    ministryApi.dashboard()
      .then((res) => setOverview(res.data.overview))
      .catch((err: unknown) => setDashError(err instanceof ApiError ? err.message : 'Failed to load stats.'))
      .finally(() => setIsLoadingDash(false));
  }, []);

  // ── fetch pending users ────────────────────────────────────────────────────
  const fetchUsers = useCallback(() => {
    cancelledRef.current = false;
    setIsLoadingUsers(true);
    setUsersError(null);

    const offset = (currentPage - 1) * PAGE_SIZE;
    ministryApi.pendingUsers(PAGE_SIZE, offset)
      .then((res) => {
        if (cancelledRef.current) return;
        // Handle the nested envelope: results.data[]
        const data = Array.isArray(res.results)
          ? (res.results as unknown as ApiPendingUser[])
          : res.results.data;
        setUsers(data);
        setTotalCount(res.count);
      })
      .catch((err: unknown) => {
        if (cancelledRef.current) return;
        setUsersError(err instanceof ApiError ? err.message : 'Failed to load pending users.');
      })
      .finally(() => {
        if (!cancelledRef.current) setIsLoadingUsers(false);
      });

    return () => { cancelledRef.current = true; };
  }, [currentPage]);

  useEffect(fetchUsers, [fetchUsers]);

  // ── approve ────────────────────────────────────────────────────────────────
  const handleApprove = useCallback(async (id: number) => {
    setApprovingId(id);
    try {
      await ministryApi.validateUser(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
      setTotalCount((c) => Math.max(0, c - 1));
      showToast('User approved successfully.');
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : 'Failed to approve user.', true);
    } finally {
      setApprovingId(null);
    }
  }, []);

  // ── reject ─────────────────────────────────────────────────────────────────
  const handleOpenReject = useCallback((id: number) => {
    const user = users.find((u) => u.id === id);
    if (user) setRejectTarget(user);
  }, [users]);

  const handleConfirmReject = useCallback(async (reason: string) => {
    if (!rejectTarget) return;
    setIsRejecting(true);
    try {
      await ministryApi.rejectUser(rejectTarget.id, reason);
      setUsers((prev) => prev.filter((u) => u.id !== rejectTarget.id));
      setTotalCount((c) => Math.max(0, c - 1));
      showToast(`${rejectTarget.username} has been rejected.`);
      setRejectTarget(null);
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : 'Failed to reject user.', true);
    } finally {
      setIsRejecting(false);
    }
  }, [rejectTarget]);

  // ── view docs → navigate to detail page ───────────────────────────────────
  const handleViewDocs = useCallback((id: number) => {
    router.push(`/Ministry/dashboard/users/${id}`);
  }, [router]);

  // ── filter ─────────────────────────────────────────────────────────────────
  const handleFilterChange = useCallback((filter: RoleFilter) => {
    setActiveFilter(filter);
    setCurrentPage(1);
  }, []);

  // ── toast helper ──────────────────────────────────────────────────────────
  function showToast(msg: string, _isError = false) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  // ── render ─────────────────────────────────────────────────────────────────
  return (
    <div className="flex h-screen overflow-hidden font-display bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100">
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-8">

          {/* Dashboard error */}
          {dashError && (
            <div className="mb-6 flex items-center gap-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-700 dark:text-red-300">
              <span className="material-symbols-outlined shrink-0">error</span>
              <span>{dashError}</span>
            </div>
          )}

          <UserStatCards
            overview={overview}
            pendingCount={totalCount}
            isLoading={isLoadingDash}
          />

          {/* Users error */}
          {usersError && (
            <div className="mb-6 flex items-start gap-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-700 dark:text-red-300">
              <span className="material-symbols-outlined mt-0.5 shrink-0">error</span>
              <span className="flex-1">{usersError}</span>
              <button onClick={fetchUsers} className="shrink-0 underline font-semibold text-xs">
                Retry
              </button>
            </div>
          )}

          <RegistrationTable
            users={users}
            activeFilter={activeFilter}
            currentPage={currentPage}
            totalCount={totalCount}
            isLoading={isLoadingUsers}
            onFilterChange={handleFilterChange}
            onPageChange={setCurrentPage}
            onViewDocs={handleViewDocs}
            onApprove={handleApprove}
            onReject={handleOpenReject}
          />
        </div>
      </main>

      {/* Rejection modal */}
      {rejectTarget && (
        <RejectModal
          username={rejectTarget.username}
          onConfirm={handleConfirmReject}
          onCancel={() => setRejectTarget(null)}
          isRejecting={isRejecting}
        />
      )}

      {/* Toast */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 z-50 animate-fade-in"
        >
          <span className="material-symbols-outlined text-primary text-base">check_circle</span>
          <span className="font-medium text-sm">{toast}</span>
        </div>
      )}
    </div>
  );
}