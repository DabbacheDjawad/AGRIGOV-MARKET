"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import CategoryTable from "./CategoryTable";
import QualityStandardsPanel from "./QualityStandards";
import CertificationsPanel from "./Certifications";
import {
  INITIAL_QUALITY_STANDARDS,
  CERTIFICATIONS,
} from "@/types/CategoryManagement";
import type { ApiCategory } from "@/types/CategoryManagement";
import type { CategoryPayload } from "@/types/CategoryManagement";
import { categoryApi, ApiError } from "@/lib/api";
import { slugify } from "@/types/EditCategory";

const PAGE_SIZE = 10;

// ─── Create modal ─────────────────────────────────────────────────────────────

interface CreateModalProps {
  onConfirm: (payload: CategoryPayload) => void;
  onCancel: () => void;
  isCreating: boolean;
}

function CreateModal({ onConfirm, onCancel, isCreating }: CreateModalProps) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [slugEdited, setSlugEdited] = useState(false);

  const handleNameChange = (v: string) => {
    setName(v);
    if (!slugEdited) setSlug(slugify(v));
  };

  const handleSlugChange = (v: string) => {
    setSlug(slugify(v));
    setSlugEdited(true);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center px-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-md w-full p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-primary text-xl">
              add_circle
            </span>
          </div>
          <h2 className="font-bold text-lg">Create Category</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-1.5">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. Fruits"
              className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>

          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-1.5">
              Slug <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-primary/50">
              <span className="px-3 text-slate-400 text-xs font-bold shrink-0">
                /
              </span>
              <input
                type="text"
                value={slug}
                onChange={(e) => handleSlugChange(e.target.value)}
                placeholder="auto-generated"
                className="flex-1 bg-transparent py-3 pr-4 text-sm font-mono outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-1.5">
              Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe this product category…"
              className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/50 resize-none transition-all"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            type="button"
            onClick={onCancel}
            disabled={isCreating}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!name.trim() || !slug.trim() || isCreating}
            onClick={() =>
              onConfirm({
                name: name.trim(),
                slug: slug.trim(),
                description: description.trim() || undefined,
              })
            }
            className="flex-1 py-2.5 rounded-xl bg-primary text-slate-900 text-sm font-bold hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isCreating && (
              <span className="material-symbols-outlined text-base animate-spin">
                progress_activity
              </span>
            )}
            {isCreating ? "Creating…" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Delete confirmation modal ────────────────────────────────────────────────

interface DeleteModalProps {
  category: ApiCategory;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
}

function DeleteModal({
  category,
  onConfirm,
  onCancel,
  isDeleting,
}: DeleteModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center px-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-sm w-full p-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-red-600 text-xl">
              delete
            </span>
          </div>
          <div>
            <h2 className="font-bold text-lg">Delete Category</h2>
            <p className="text-sm text-slate-500 mt-1">
              Permanently delete{" "}
              <span className="font-semibold capitalize">{category.name}</span>?
              This action cannot be undone and may affect existing products.
            </p>
          </div>
        </div>
        <div className="flex gap-3 mt-5">
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-sm font-bold hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isDeleting && (
              <span className="material-symbols-outlined text-base animate-spin">
                progress_activity
              </span>
            )}
            {isDeleting ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function CategoryManagementPage() {
  const router = useRouter();

  // ── data ───────────────────────────────────────────────────────────────────
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // ── search ─────────────────────────────────────────────────────────────────
  const [search, setSearch] = useState("");

  // ── modals ─────────────────────────────────────────────────────────────────
  const [showCreate, setShowCreate] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ApiCategory | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // ── toast ──────────────────────────────────────────────────────────────────
  const [toast, setToast] = useState<string | null>(null);

  const cancelledRef = useRef(false);

  // ── fetch ──────────────────────────────────────────────────────────────────
  const fetchCategories = useCallback(() => {
    cancelledRef.current = false;
    setIsLoading(true);
    setLoadError(null);

    categoryApi
      .list(page, PAGE_SIZE)
      .then((res) => {
        if (cancelledRef.current) return;
        setCategories(res.results);
        setTotalCount(res.count);
      })
      .catch((err: unknown) => {
        if (cancelledRef.current) return;
        setLoadError(
          err instanceof ApiError ? err.message : "Failed to load categories.",
        );
      })
      .finally(() => {
        if (!cancelledRef.current) setIsLoading(false);
      });

    return () => {
      cancelledRef.current = true;
    };
  }, [page]);

  useEffect(fetchCategories, [fetchCategories]);

  // ── derived (client-side search filter) ───────────────────────────────────
  const filtered = search.trim()
    ? categories.filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.slug.toLowerCase().includes(search.toLowerCase()),
      )
    : categories;

  // ── create ─────────────────────────────────────────────────────────────────
  const handleCreate = useCallback(async (payload: CategoryPayload) => {
    setIsCreating(true);
    try {
      const created = await categoryApi.create(payload);
      setCategories((prev) => [created, ...prev]);
      setTotalCount((c) => c + 1);
      setShowCreate(false);
      showToast(`"${created.name}" created successfully.`);
    } catch (err) {
      showToast(
        err instanceof ApiError ? err.message : "Failed to create category.",
        true,
      );
    } finally {
      setIsCreating(false);
    }
  }, []);

  // ── delete ─────────────────────────────────────────────────────────────────
  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await categoryApi.delete(deleteTarget.id);
      setCategories((prev) => prev.filter((c) => c.id !== deleteTarget.id));
      setTotalCount((c) => Math.max(0, c - 1));
      showToast(`"${deleteTarget.name}" deleted.`);
      setDeleteTarget(null);
    } catch (err) {
      showToast(
        err instanceof ApiError ? err.message : "Failed to delete.",
        true,
      );
    } finally {
      setIsDeleting(false);
    }
  }, [deleteTarget]);

  // ── edit → navigate ────────────────────────────────────────────────────────
  const handleEdit = useCallback(
    (id: number) => {
      router.push(`/Ministry/dashboard/categories/${id}/edit`);
    },
    [router],
  );

  function showToast(msg: string, _isError = false) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  // ── render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen font-display bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100">
      <main className="bg-slate-50/50 dark:bg-background-dark">
        <div className="max-sm:p-3 p-8 space-y-8 max-w-7xl mx-auto">
          {/* Page header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">
                Product Categories
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
                Manage agricultural product classifications
              </p>
            </div>
            <button
              onClick={() => setShowCreate(true)}
              className="flex items-center gap-2 bg-primary text-slate-900 px-5 py-2.5 rounded-xl font-bold text-sm shadow-sm hover:opacity-90 active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              New Category
            </button>
          </div>

          {/* Search bar */}
          <div className="relative max-w-sm">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
              search
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search categories…"
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>

          {/* Load error */}
          {loadError && (
            <div
              role="alert"
              className="flex items-start gap-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-700 dark:text-red-300"
            >
              <span className="material-symbols-outlined mt-0.5 shrink-0">
                error
              </span>
              <span className="flex-1">{loadError}</span>
              <button
                onClick={fetchCategories}
                className="shrink-0 underline font-semibold text-xs"
              >
                Retry
              </button>
            </div>
          )}

          {/* Category Table */}
          <CategoryTable
            categories={filtered}
            totalCount={totalCount}
            page={page}
            isLoading={isLoading}
            pageSize={PAGE_SIZE}
            onEdit={handleEdit}
            onDelete={(id) => {
              const cat = categories.find((c) => c.id === id) ?? null;
              setDeleteTarget(cat);
            }}
            onPageChange={setPage}
          />

          {/* Bottom Panels (static UI) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <QualityStandardsPanel
              standards={INITIAL_QUALITY_STANDARDS}
              onAddStandard={() => console.log("Add standard")}
              onConfigureStandard={(id) => console.log("Configure:", id)}
            />
            <CertificationsPanel
              certifications={CERTIFICATIONS}
              onEdit={(id) => console.log("Edit cert:", id)}
            />
          </div>
        </div>
      </main>
      {/* Create modal */}
      {showCreate && (
        <CreateModal
          onConfirm={handleCreate}
          onCancel={() => setShowCreate(false)}
          isCreating={isCreating}
        />
      )}
      {/* Delete confirmation */}
      {deleteTarget && (
        <DeleteModal
          category={deleteTarget}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          isDeleting={isDeleting}
        />
      )}
      {/* Toast */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 z-50"
        >
          <span className="material-symbols-outlined text-primary text-base">
            check_circle
          </span>
          <span className="font-medium text-sm">{toast}</span>
        </div>
      )}
    </div>
  );
}
