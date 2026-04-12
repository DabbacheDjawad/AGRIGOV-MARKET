"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import CommodityTable from "@/components/Ministry/Pricings/CommodityTable";
import PriceAdjustmentPanel from "@/components/Ministry/Pricings/PriceAdjustmentPanel";
import AuditLog from "@/components/Ministry/Pricings/AuditLog";
import PricingGuidelinesCard from "@/components/Ministry/Pricings/PricingsGuidelines";
import type { ApiOfficialPrice, AuditEntry, ChangeReason } from "@/types/Prices";
import { INITIAL_AUDIT_LOG } from "@/types/Prices";
import { officialPriceApi, ApiError } from "@/lib/api";

const PAGE_SIZE = 8;

export default function PriceManagementPage() {
  // ── data ───────────────────────────────────────────────────────────────────
  const [items,       setItems]       = useState<ApiOfficialPrice[]>([]);
  const [totalCount,  setTotalCount]  = useState(0);
  const [page,        setPage]        = useState(1);
  const [isLoading,   setIsLoading]   = useState(true);
  const [loadError,   setLoadError]   = useState<string | null>(null);

  // ── edit panel ─────────────────────────────────────────────────────────────
  const [editing,   setEditing]   = useState<ApiOfficialPrice | null>(null);
  const [isSaving,  setIsSaving]  = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // ── delete ─────────────────────────────────────────────────────────────────
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // ── audit log ──────────────────────────────────────────────────────────────
  const [log, setLog] = useState<AuditEntry[]>(INITIAL_AUDIT_LOG);

  // ── toast ──────────────────────────────────────────────────────────────────
  const [toast, setToast] = useState<string | null>(null);

  const cancelledRef = useRef(false);

  // ── fetch ──────────────────────────────────────────────────────────────────
  const fetchPrices = useCallback(() => {
    cancelledRef.current = false;
    setIsLoading(true);
    setLoadError(null);

    officialPriceApi.list(page, PAGE_SIZE)
      .then((res) => {
        if (cancelledRef.current) return;
        setItems(res.results);
        setTotalCount(res.count);
      })
      .catch((err: unknown) => {
        if (cancelledRef.current) return;
        setLoadError(err instanceof ApiError ? err.message : "Failed to load prices.");
      })
      .finally(() => { if (!cancelledRef.current) setIsLoading(false); });

    return () => { cancelledRef.current = true; };
  }, [page]);

  useEffect(fetchPrices, [fetchPrices]);

  // ── confirm price update ──────────────────────────────────────────────────
  const handleConfirm = useCallback(
    async (id: number, minPrice: number, maxPrice: number, reason: ChangeReason) => {
      setSaveError(null);
      setIsSaving(true);
      try {
        const updated = await officialPriceApi.update(id, {
          min_price: minPrice,
          max_price: maxPrice,
        });

        setItems((prev) => prev.map((i) => (i.id === id ? updated : i)));

        const target = items.find((i) => i.id === id);
        if (target) {
          setLog((prev) => [
            {
              id:            Date.now().toString(),
              actorType:     "human",
              actorName:     "You",
              actorBg:       "bg-primary/20",
              actorTextColor:"text-primary-dark dark:text-primary",
              actorIcon:     "person",
              message:       `Updated <b>${target.product_detail.name}</b> range: ${target.min_price}–${target.max_price} → ${minPrice}–${maxPrice} DZD. Reason: ${reason}.`,
              timeAgo:       "Just now",
            },
            ...prev,
          ]);
        }

        showToast("Price updated successfully.");
        setEditing(null);
      } catch (err) {
        setSaveError(err instanceof ApiError ? err.message : "Failed to save.");
      } finally {
        setIsSaving(false);
      }
    },
    [items]
  );

  // ── delete ─────────────────────────────────────────────────────────────────
  const handleDelete = useCallback(async (id: number) => {
    if (!confirm("Delete this price entry? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      await officialPriceApi.delete(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
      setTotalCount((c) => Math.max(0, c - 1));
      if (editing?.id === id) setEditing(null);
      showToast("Price entry deleted.");
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : "Failed to delete.", true);
    } finally {
      setDeletingId(null);
    }
  }, [editing]);

  function showToast(msg: string, _isError = false) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  // ── render ─────────────────────────────────────────────────────────────────
  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-800 dark:text-slate-100 min-h-screen">
      <main className="p-8 max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 w-full">

        {/* Page header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Official Market Price Control
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Manage and regulate national agricultural commodity prices.
            </p>
          </div>

          <div className="flex gap-4 flex-wrap">
            {/* KPI chips */}
            <div className="flex gap-3">
              <div className="bg-white dark:bg-slate-800 px-4 py-2 rounded-lg border border-neutral-light dark:border-border-dark shadow-sm flex items-center gap-3">
                <div className="p-2 rounded-md bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                  <span className="material-icons text-xl">price_change</span>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Total Entries</p>
                  <p className="text-lg font-bold text-slate-900 dark:text-white">
                    {isLoading ? "—" : totalCount}
                  </p>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 px-4 py-2 rounded-lg border border-neutral-light dark:border-border-dark shadow-sm flex items-center gap-3">
                <div className="p-2 rounded-md bg-primary/20 text-primary-dark dark:text-primary">
                  <span className="material-icons text-xl">verified</span>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Active Prices</p>
                  <p className="text-lg font-bold text-slate-900 dark:text-white">
                    {isLoading ? "—" : items.filter((i) => i.is_active).length}
                  </p>
                </div>
              </div>
            </div>

            <Link
              href="/Ministry/dashboard/PricesManagement/add"
              className="flex items-center gap-2 px-5 py-2 bg-primary text-slate-900 font-bold text-sm rounded-lg shadow-sm hover:opacity-90 active:scale-95 transition-all"
            >
              <span className="material-icons text-base">add</span>
              New Entry
            </Link>
          </div>
        </div>

        {/* Load error */}
        {loadError && (
          <div
            role="alert"
            className="mb-6 flex items-start gap-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-700 dark:text-red-300"
          >
            <span className="material-icons mt-0.5 shrink-0">error</span>
            <span className="flex-1">{loadError}</span>
            <button onClick={fetchPrices} className="shrink-0 underline font-semibold text-xs">
              Retry
            </button>
          </div>
        )}

        {/* Save error */}
        {saveError && (
          <div
            role="alert"
            className="mb-6 flex items-start gap-3 rounded-xl bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 px-4 py-3 text-sm text-orange-700 dark:text-orange-300"
          >
            <span className="material-icons mt-0.5 shrink-0">warning</span>
            <span className="flex-1">{saveError}</span>
            <button onClick={() => setSaveError(null)} aria-label="Dismiss">
              <span className="material-icons text-base">close</span>
            </button>
          </div>
        )}

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <CommodityTable
            items={items}
            totalCount={totalCount}
            page={page}
            pageSize={PAGE_SIZE}
            isLoading={isLoading}
            onEdit={setEditing}
            onDelete={handleDelete}
            onPageChange={setPage}
            editingId={editing?.id ?? null}
          />

          {/* Right sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {editing ? (
              <PriceAdjustmentPanel
                item={editing}
                onConfirm={handleConfirm}
                onCancel={() => { setEditing(null); setSaveError(null); }}
                isSaving={isSaving}
              />
            ) : (
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-neutral-light dark:border-border-dark shadow-sm p-8 text-center text-slate-400 text-sm">
                <span className="material-icons text-3xl mb-2 block">touch_app</span>
                Select a price entry to adjust its range.
              </div>
            )}

            <AuditLog entries={log} />
            <PricingGuidelinesCard />
          </div>
        </div>
      </main>

      {/* Toast */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 z-50"
        >
          <span className="material-icons text-primary text-base">check_circle</span>
          <span className="font-medium text-sm">{toast}</span>
        </div>
      )}
    </div>
  );
}