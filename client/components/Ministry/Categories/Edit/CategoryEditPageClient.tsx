'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import CoreDefinitionCard from './CoreDefinitionCard';
import QualityMetricsCard from './QualityMetricsCard';
import CertificationsCard from './CertificationsCard';
import SubCategoriesCard from './SubcategoryCard';
import {
  EMPTY_FORM,
  INITIAL_METRICS,
  INITIAL_CERTIFICATIONS,
  INITIAL_SUBCATEGORIES,
  LAST_MODIFIED,
} from '@/types/EditCategory';
import type { CategoryForm, Certification } from '@/types/EditCategory';
import { slugify } from '@/types/EditCategory';
import { categoryApi, ApiError } from '@/lib/api';

// ─── Page skeleton ────────────────────────────────────────────────────────────

function PageSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded-xl w-64" />
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-7 space-y-6">
          <div className="h-72 bg-slate-200 dark:bg-slate-700 rounded-xl" />
          <div className="h-48 bg-slate-200 dark:bg-slate-700 rounded-xl" />
        </div>
        <div className="md:col-span-5 space-y-6">
          <div className="h-40 bg-slate-200 dark:bg-slate-700 rounded-xl" />
          <div className="h-56 bg-slate-200 dark:bg-slate-700 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function CategoryEditPage() {
  const params   = useParams();
  const router   = useRouter();
  const categoryId = Number(params?.id ?? params?.categoryId);
  const isNew    = !categoryId || isNaN(categoryId);

  // ── fetch state ────────────────────────────────────────────────────────────
  const [isLoading,  setIsLoading]  = useState(!isNew);
  const [loadError,  setLoadError]  = useState<string | null>(null);

  // ── form state ─────────────────────────────────────────────────────────────
  const [form, setForm]                     = useState<CategoryForm>(EMPTY_FORM);
  const [metrics, setMetrics]               = useState(INITIAL_METRICS);
  const [certifications, setCertifications] = useState<Certification[]>(INITIAL_CERTIFICATIONS);
  const [subCategories, setSubCategories]   = useState(INITIAL_SUBCATEGORIES);
  const [isVisible, setIsVisible]           = useState(true);

  // ── action state ──────────────────────────────────────────────────────────
  const [isSaving,   setIsSaving]   = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [saveError,  setSaveError]  = useState<string | null>(null);
  const [toast,      setToast]      = useState<string | null>(null);

  const cancelledRef = useRef(false);

  // ── fetch category detail ──────────────────────────────────────────────────
  useEffect(() => {
    if (isNew) return;
    cancelledRef.current = false;
    setIsLoading(true);
    setLoadError(null);

    categoryApi.detail(categoryId)
      .then((data) => {
        if (cancelledRef.current) return;
        setForm({
          name:        data.name,
          slug:        data.slug,
          description: (data as { description?: string }).description ?? '',
        });
      })
      .catch((err: unknown) => {
        if (cancelledRef.current) return;
        setLoadError(err instanceof ApiError ? err.message : 'Failed to load category.');
      })
      .finally(() => { if (!cancelledRef.current) setIsLoading(false); });

    return () => { cancelledRef.current = true; };
  }, [categoryId, isNew]);

  // ── handlers ───────────────────────────────────────────────────────────────
  const handleFormChange = useCallback(
    (field: keyof CategoryForm, value: string) =>
      setForm((prev) => ({ ...prev, [field]: value })),
    [],
  );

  function handleDiscard() {
    if (isNew) {
      setForm(EMPTY_FORM);
    } else {
      // re-fetch to restore original
      setIsLoading(true);
      categoryApi.detail(categoryId)
        .then((data) => setForm({ name: data.name, slug: data.slug, description: (data as { description?: string }).description ?? '' }))
        .catch(() => {})
        .finally(() => setIsLoading(false));
    }
  }

  async function handleSave() {
    setSaveError(null);
    if (!form.name.trim() || !form.slug.trim()) {
      setSaveError('Name and slug are required.');
      return;
    }

    setIsSaving(true);
    const payload = {
      name:        form.name.trim(),
      slug:        form.slug.trim() || slugify(form.name),
      description: form.description.trim() || undefined,
    };

    try {
      if (isNew) {
        await categoryApi.create(payload);
        showToast('Category created successfully.');
        router.push('/admin/categories');
      } else {
        await categoryApi.update(categoryId, payload);
        showToast('Category updated successfully.');
      }
    } catch (err) {
      setSaveError(err instanceof ApiError ? err.message : 'Save failed. Please try again.');
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete() {
    if (isNew || !confirm(`Delete "${form.name}"? This cannot be undone.`)) return;
    setIsDeleting(true);
    try {
      await categoryApi.delete(categoryId);
      router.push('/admin/categories');
    } catch (err) {
      setSaveError(err instanceof ApiError ? err.message : 'Delete failed.');
      setIsDeleting(false);
    }
  }

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  // ── render: loading / error ────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="font-display bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen p-8 max-w-6xl mx-auto">
        <PageSkeleton />
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="font-display bg-background-light dark:bg-background-dark min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4 max-w-sm px-4">
          <span className="material-symbols-outlined text-5xl text-red-400">error</span>
          <p className="font-medium text-slate-700 dark:text-slate-300">{loadError}</p>
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

  // ── render: main ──────────────────────────────────────────────────────────
  return (
    <div className="font-display bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen">
      <main className="min-h-screen">
        <div className="max-w-6xl mx-auto p-6 lg:p-10">

          {/* Breadcrumbs + page header */}
          <div className="mb-10">
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-slate-500 text-sm mb-4">
              <Link href="/admin/categories" className="hover:text-primary transition-colors">
                Categories
              </Link>
              <span className="material-symbols-outlined text-xs">chevron_right</span>
              <span className="text-slate-900 dark:text-slate-100 font-medium">
                {isNew ? 'New Category' : `Edit: ${form.name || `#${categoryId}`}`}
              </span>
            </nav>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <h1 className="text-4xl font-extrabold tracking-tight mb-2">
                  {isNew ? 'Create Category' : (
                    <>
                      Edit:{' '}
                      <span className="text-primary italic capitalize">{form.name}</span>
                    </>
                  )}
                </h1>
                <p className="text-slate-500 max-w-xl text-sm">
                  Configure the category name, URL slug, quality benchmarks, and
                  taxonomic structures for the national harvest registry.
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={handleDiscard}
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-xl text-slate-600 dark:text-slate-400 font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
                >
                  Discard
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-8 py-2.5 rounded-xl bg-primary text-slate-900 font-bold shadow-sm hover:opacity-90 active:scale-95 transition-all disabled:opacity-60 flex items-center gap-2"
                >
                  {isSaving && (
                    <span className="material-symbols-outlined text-base animate-spin">
                      progress_activity
                    </span>
                  )}
                  {isNew ? 'Create Category' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>

          {/* Save error */}
          {saveError && (
            <div
              role="alert"
              className="mb-6 flex items-start gap-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-700 dark:text-red-300"
            >
              <span className="material-symbols-outlined mt-0.5 shrink-0">error</span>
              <span className="flex-1">{saveError}</span>
              <button type="button" onClick={() => setSaveError(null)} aria-label="Dismiss">
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>
          )}

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Left column */}
            <div className="md:col-span-7 space-y-6">
              <CoreDefinitionCard form={form} onChange={handleFormChange} />
              <QualityMetricsCard metrics={metrics} onAddMetric={() => console.log('Add metric')} />
            </div>

            {/* Right column */}
            <div className="md:col-span-5 space-y-6">
              <CertificationsCard
                certifications={certifications}
                onRemove={(id) => setCertifications((prev) => prev.filter((c) => c.id !== id))}
                onAdd={() => console.log('Add cert')}
              />
              <SubCategoriesCard
                subCategories={subCategories}
                onEdit={(id) => console.log('Edit sub-cat:', id)}
                onAdd={() => console.log('Add sub-cat')}
              />
              {/* Advanced metadata card */}
              <section className="relative overflow-hidden rounded-xl p-6 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-primary/10 shadow-sm">
                <div className="relative z-10 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-primary">Advanced Metadata</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      Configure harvest seasonality and shelf-life triggers.
                    </p>
                  </div>
                  <span className="material-symbols-outlined text-primary">auto_awesome</span>
                </div>
              </section>
            </div>
          </div>

          {/* Footer */}
          <footer className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 pb-20">
            <div className="flex items-center gap-4">
              <span className="material-symbols-outlined text-slate-400">history</span>
              <p className="text-sm text-slate-500 italic">
                Last modified by{' '}
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  {LAST_MODIFIED.by}
                </span>{' '}
                on {LAST_MODIFIED.date}
              </p>
            </div>

            <div className="flex items-center gap-6">
              {/* Visibility toggle */}
              <div className="text-right">
                <p className="text-xs font-bold uppercase tracking-tighter text-slate-400">
                  Visibility Status
                </p>
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isVisible ? 'bg-primary animate-pulse' : 'bg-slate-400'
                    }`}
                  />
                  <span className="font-bold text-slate-900 dark:text-slate-100">
                    {isVisible ? 'Publicly Visible' : 'Hidden'}
                  </span>
                  <button
                    onClick={() => setIsVisible((v) => !v)}
                    aria-label="Toggle category visibility"
                    className="text-xs text-primary font-bold hover:underline ml-1"
                  >
                    Toggle
                  </button>
                </div>
              </div>

              {/* Delete (only for existing categories) */}
              {!isNew && (
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  aria-label="Delete category"
                  className="bg-slate-100 dark:bg-slate-800 p-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 transition-colors disabled:opacity-50"
                >
                  {isDeleting ? (
                    <span className="material-symbols-outlined animate-spin">
                      progress_activity
                    </span>
                  ) : (
                    <span className="material-symbols-outlined">delete</span>
                  )}
                </button>
              )}
            </div>
          </footer>
        </div>
      </main>

      {/* Toast */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 z-50"
        >
          <span className="material-symbols-outlined text-primary text-base">check_circle</span>
          <span className="font-medium text-sm">{toast}</span>
        </div>
      )}
    </div>
  );
}