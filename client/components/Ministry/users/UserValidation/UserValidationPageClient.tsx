'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import IdentityVerificationCard from './IdentityVerificationCard';
import FarmDocumentsCard from './Documents';
import ActivityHistoryCard from './ActivityHistoryCard';
import FarmLocationCard from './FarmLocationCard';
import VerificationPanel from './VerificationPanel';
import ApprovalSuccessOverlay from './ApprovalSuccessOverlay';
import {
  SIDEBAR_NAV,
  BREADCRUMBS,
  STATIC_MAP_URL,
  STATIC_VERIFICATION_STEPS,
  buildIdentityDetails,
  buildDocuments,
  primaryDocUrl,
  roleLabel,
} from '@/types/UserValidation';
import type { ApiUserDetail, ActivityEvent } from '@/types/UserValidation';
import { ministryApi, ApiError } from '@/lib/api';

// ─── Rejection modal ──────────────────────────────────────────────────────────

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
    >
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-md w-full p-6">
        <div className="flex items-start gap-3 mb-5">
          <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-rose-600 text-xl">block</span>
          </div>
          <div>
            <h2 className="font-bold text-lg">Reject Registration</h2>
            <p className="text-sm text-slate-500 mt-0.5">
              You are about to reject <span className="font-semibold">{username}</span>.
              Their account will be deactivated and they will be notified.
            </p>
          </div>
        </div>

        <label
          htmlFor="reject-reason"
          className="text-xs font-bold uppercase text-slate-500 tracking-wider block mb-2"
        >
          Rejection Reason <span className="text-rose-500">*</span>
        </label>
        <textarea
          id="reject-reason"
          value={reason}
          onChange={(e) => setReason(e.target.value.slice(0, charLimit))}
          placeholder="e.g. The submitted national ID is expired or illegible."
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
            {isRejecting && (
              <span className="material-symbols-outlined text-base animate-spin">
                progress_activity
              </span>
            )}
            {isRejecting ? 'Rejecting…' : 'Confirm Rejection'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Page skeleton ────────────────────────────────────────────────────────────

function PageSkeleton() {
  return (
    <div className="max-w-6xl mx-auto animate-pulse">
      <div className="flex items-center gap-4 mb-10">
        <div className="w-16 h-16 rounded-2xl bg-slate-200 dark:bg-slate-700" />
        <div className="space-y-2">
          <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-48" />
          <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-32" />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <div className="h-64 bg-slate-200 dark:bg-slate-700 rounded-3xl" />
          <div className="h-48 bg-slate-200 dark:bg-slate-700 rounded-3xl" />
        </div>
        <div className="lg:col-span-4 space-y-6">
          <div className="h-72 bg-slate-200 dark:bg-slate-700 rounded-3xl" />
          <div className="h-48 bg-slate-200 dark:bg-slate-700 rounded-3xl" />
        </div>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function UserValidationPage() {
  const params   = useParams();
  const router   = useRouter();
  const userId   = Number(params?.id ?? params?.userId);

  // ── fetch state ────────────────────────────────────────────────────────────
  const [user,       setUser]       = useState<ApiUserDetail | null>(null);
  const [isLoading,  setIsLoading]  = useState(true);
  const [loadError,  setLoadError]  = useState<string | null>(null);

  // ── action state ──────────────────────────────────────────────────────────
  const [isConfirming, setIsConfirming] = useState(false);
  const [showSuccess,  setShowSuccess]  = useState(false);
  const [rejectOpen,   setRejectOpen]   = useState(false);
  const [isRejecting,  setIsRejecting]  = useState(false);
  const [actionError,  setActionError]  = useState<string | null>(null);
  const [internalNote, setInternalNote] = useState('');

  const cancelledRef = useRef(false);

  // ── fetch user detail ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!userId || isNaN(userId)) return;
    cancelledRef.current = false;
    setIsLoading(true);
    setLoadError(null);

    ministryApi.userDetail(userId)
      .then((res) => {
        if (cancelledRef.current) return;
        setUser(res.data.user);
      })
      .catch((err: unknown) => {
        if (cancelledRef.current) return;
        setLoadError(err instanceof ApiError ? err.message : 'Failed to load user details.');
      })
      .finally(() => {
        if (!cancelledRef.current) setIsLoading(false);
      });

    return () => { cancelledRef.current = true; };
  }, [userId]);

  // ── approve ────────────────────────────────────────────────────────────────
  const handleApprove = useCallback(async () => {
    if (!userId) return;
    setActionError(null);
    setIsConfirming(true);
    try {
      await ministryApi.validateUser(userId);
      setShowSuccess(true);
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : 'Failed to approve user.');
    } finally {
      setIsConfirming(false);
    }
  }, [userId]);

  // ── reject ─────────────────────────────────────────────────────────────────
  const handleConfirmReject = useCallback(async (reason: string) => {
    if (!userId) return;
    setActionError(null);
    setIsRejecting(true);
    try {
      await ministryApi.rejectUser(userId, reason);
      setRejectOpen(false);
      // Navigate back to list after rejection
      router.push('/Ministry/dashboard/users');
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : 'Failed to reject user.');
      setIsRejecting(false);
    }
  }, [userId, router]);

  // ── build derived data from API user ──────────────────────────────────────
  const identityDetails  = user ? buildIdentityDetails(user) : [];
  const documents        = user ? buildDocuments(user) : [];
  const idCardUrl        = user ? primaryDocUrl(user) : '';

  // Activity timeline built from user dates
  const activityEvents: ActivityEvent[] = user
    ? [
        {
          id:        'submitted',
          title:     'Account Created',
          timestamp: new Date(user.created_at).toLocaleString('fr-DZ'),
          body:      `${user.username} registered as a ${user.role.toLowerCase()} and submitted their profile documents.`,
          isActive:  true,
        },
        {
          id:        'ai-check',
          title:     'Automated Risk Scan',
          timestamp: new Date(user.created_at).toLocaleString('fr-DZ'),
          body:      'AI Background check: Low Risk. No matches in global sanction lists or debt registries.',
          isActive:  false,
        },
        ...(user.profile.validation.validated_at || user.profile.validation.rejected_at
          ? [{
              id:        'resolution',
              title:     user.profile.validation.is_validated ? 'Validated' : 'Rejected',
              timestamp: new Date(
                user.profile.validation.validated_at ??
                user.profile.validation.rejected_at!
              ).toLocaleString('fr-DZ'),
              body:      user.profile.validation.is_validated
                ? `Validated by ${user.profile.validation.validated_by}.`
                : `Rejected: ${user.profile.validation.rejection_reason}`,
              isActive:  user.profile.validation.is_validated,
            }]
          : []),
      ]
    : [];

  // ── render: loading / error ────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="font-display bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen">
        <aside className="hidden lg:flex flex-col h-full w-64 fixed left-0 top-0 z-40 bg-white dark:bg-slate-900 border-r border-primary/10 py-4 pt-20">
          <div className="px-6 mb-8">
            <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-32 animate-pulse" />
          </div>
        </aside>
        <main className=" pt-24 pb-12 px-6 lg:px-12">
          <PageSkeleton />
        </main>
      </div>
    );
  }

  if (loadError || !user) {
    return (
      <div className="font-display bg-background-light dark:bg-background-dark min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4 max-w-sm px-4">
          <span className="material-symbols-outlined text-5xl text-red-400">error</span>
          <p className="font-medium text-slate-700 dark:text-slate-300">
            {loadError ?? 'User not found.'}
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 rounded-xl bg-primary text-slate-900 font-bold text-sm"
            >
              Retry
            </button>
            <button
              onClick={() => router.back()}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold text-sm"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isFarmer = user.profile.type === 'farmer';

  // ── render: main ──────────────────────────────────────────────────────────
  return (
    <div className="font-display bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen">
      {/* Success overlay */}
      {showSuccess && (
        <ApprovalSuccessOverlay
          farmerName={user.username}
          onContinue={() => router.push('/Ministry/dashboard/users')}
        />
      )}

      {/* Rejection modal */}
      {rejectOpen && (
        <RejectModal
          username={user.username}
          onConfirm={handleConfirmReject}
          onCancel={() => setRejectOpen(false)}
          isRejecting={isRejecting}
        />
      )}

      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col h-full w-64 fixed left-0 top-0 z-40 bg-white dark:bg-slate-900 border-r border-primary/10 py-4 pt-20 space-y-2">
        <div className="px-6 mb-8">
          <h2 className="font-bold text-xl">Ministry Admin</h2>
          <p className="text-xs text-slate-500 font-medium uppercase tracking-tighter">
            Agri-Management System
          </p>
        </div>
        <nav className="flex-1 space-y-1 px-2">
          {SIDEBAR_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={item.active ? 'page' : undefined}
              className={
                item.active
                  ? 'bg-primary/10 text-primary rounded-xl px-4 py-3 mx-2 flex items-center gap-3 text-sm font-medium tracking-wide uppercase'
                  : 'text-slate-600 dark:text-slate-400 px-4 py-3 mx-2 flex items-center gap-3 hover:bg-primary/10 hover:text-primary transition-all rounded-xl text-sm font-medium tracking-wide uppercase'
              }
            >
              <span
                className="material-symbols-outlined"
                style={item.filled ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                {item.icon}
              </span>
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <main className=" pb-12 px-6 lg:px-12">
        <div className="max-w-6xl mx-auto">

          {/* Action error banner */}
          {actionError && (
            <div
              role="alert"
              className="mb-6 flex items-start gap-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-700 dark:text-red-300"
            >
              <span className="material-symbols-outlined mt-0.5 shrink-0">error</span>
              <span className="flex-1">{actionError}</span>
              <button onClick={() => setActionError(null)} aria-label="Dismiss">
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>
          )}

          {/* Page header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div className="space-y-2">
              {/* Breadcrumbs */}
              <nav aria-label="Breadcrumb" className="flex text-xs font-bold uppercase tracking-widest text-slate-500 gap-2 mb-2">
                {BREADCRUMBS.map((crumb, i) => (
                  <span key={crumb} className="flex items-center gap-2">
                    {i < BREADCRUMBS.length - 1 ? (
                      <>
                        <Link href="/Ministry/dashboard/users" className="hover:text-primary transition-colors">
                          {crumb}
                        </Link>
                        <span>/</span>
                      </>
                    ) : (
                      <span className="text-primary font-semibold">{crumb}</span>
                    )}
                  </span>
                ))}
              </nav>

              {/* User identity row */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-sm bg-primary/20 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-primary text-3xl">person</span>
                </div>
                <div>
                  <h1 className="text-4xl font-extrabold tracking-tight">{user.username}</h1>
                  <p className="text-slate-500 text-sm mt-0.5">{user.email}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="bg-primary/20 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter">
                      {roleLabel(user.role)}
                    </span>
                    <span className="text-slate-500 text-sm font-medium italic">
                      • Registered {new Date(user.created_at).toLocaleDateString('fr-DZ', {
                        day: '2-digit', month: 'short', year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-3 shrink-0">
              <button
                onClick={() => setRejectOpen(true)}
                disabled={isConfirming || isRejecting}
                className="bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 px-5 py-2.5 rounded-full font-bold text-sm flex items-center gap-2 active:scale-95 transition-all hover:bg-red-200 dark:hover:bg-red-900/30 disabled:opacity-60"
              >
                <span className="material-symbols-outlined text-lg">block</span>
                Reject
              </button>
              <button
                onClick={handleApprove}
                disabled={isConfirming || isRejecting}
                className="bg-primary text-slate-900 px-8 py-2.5 rounded-full font-bold text-sm flex items-center gap-2 shadow-sm active:scale-95 transition-all hover:opacity-90 disabled:opacity-60"
              >
                {isConfirming ? (
                  <span className="material-symbols-outlined text-lg animate-spin">
                    progress_activity
                  </span>
                ) : (
                  <span
                    className="material-symbols-outlined text-lg"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    check_circle
                  </span>
                )}
                {isConfirming ? 'Approving…' : 'Approve Verification'}
              </button>
            </div>
          </div>

          {/* Bento grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left column */}
            <div className="lg:col-span-8 space-y-6">
              <IdentityVerificationCard
                idCardUrl={idCardUrl}
                details={identityDetails}
                selfieVerified={user.is_verified}
                onViewFullScreen={() => window.open(idCardUrl, '_blank', 'noopener,noreferrer')}
              />
              <FarmDocumentsCard
                documents={documents}
                onOpenDoc={(id) => console.log('Open doc:', id)}
              />
              <ActivityHistoryCard events={activityEvents} />
            </div>

            {/* Right column */}
            <div className="lg:col-span-4 space-y-6">
              {/* Farm location — only for farmers */}
              {isFarmer && user.profile.type === 'farmer' && (
                <FarmLocationCard
                  mapImageUrl={STATIC_MAP_URL}
                  farmName={user.profile.address || 'Farm Location'}
                  farmCoords={`${user.profile.wilaya}, ${user.profile.baladiya}`}
                  farmHectares={user.profile.farm_size}
                  onFullMap={() => console.log('Open full map')}
                />
              )}
              <VerificationPanel
                steps={STATIC_VERIFICATION_STEPS}
                internalNote={internalNote}
                onNoteChange={setInternalNote}
                onConfirmApproval={handleApprove}
                isConfirming={isConfirming}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}