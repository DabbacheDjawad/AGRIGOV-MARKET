'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import {
  BREADCRUMBS,
  COMMODITY_NAME,
  COMMODITY_ID,
  CURRENT_PRICE,
  PRICE_UNIT,
  QUARTER_DELTA_PCT,
  MARKET_HEALTH_BARS,
  CHART_BARS,
  CHART_RANGES,
  CROP_SPEC,
  INITIAL_FORM,
} from '@/types/EditOfficalPrice';
import type { ChartRange, PriceRevisionForm } from '@/types/EditOfficalPrice';

export default function PriceManagementPage() {
  const [activeRange, setActiveRange] = useState<ChartRange>('1Y');
  const [form, setForm]               = useState<PriceRevisionForm>(INITIAL_FORM);
  const [isPublishing, setIsPublishing] = useState(false);
  const [showToast, setShowToast]       = useState(false);

  function handleFormChange(field: keyof PriceRevisionForm, value: string | number) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handlePublish() {
    setIsPublishing(true);
    await new Promise((r) => setTimeout(r, 1000));
    setIsPublishing(false);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3500);
  }

  return (
    <div className="font-display bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen">
      {/* Main */}
      <main className="pt-24 px-6 pb-12 max-w-7xl mx-auto">
        {/* Breadcrumbs + title */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">
              {BREADCRUMBS.map((crumb, i) => (
                <span key={crumb} className="flex items-center gap-2">
                  {i < BREADCRUMBS.length - 1 ? (
                    <>
                      <span className="hover:text-primary cursor-pointer transition-colors">{crumb}</span>
                      <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                    </>
                  ) : (
                    <span className="text-primary font-bold">{crumb}</span>
                  )}
                </span>
              ))}
            </nav>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter">{COMMODITY_NAME}</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-4 py-2 bg-primary/20 text-primary rounded-full text-xs font-bold uppercase">
              Live Market Data
            </span>
            <span className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full text-xs font-bold uppercase">
              ID: {COMMODITY_ID}
            </span>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 flex flex-col md:flex-row justify-between items-center gap-6 py-8 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] font-black uppercase text-slate-500">Live Server Connection</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-slate-400 text-sm">security</span>
              <span className="text-[10px] font-black uppercase text-slate-500">AES-256 Compliant</span>
            </div>
          </div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            © {new Date().getFullYear()} Ministry of Digital Agriculture • Protocol v4.2.1
          </div>
        </footer>
      </main>

      {/* Mobile FAB */}
      <button
        onClick={handlePublish}
        aria-label="Edit price"
        className="fixed bottom-8 right-8 w-16 h-16 bg-primary text-slate-900 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-90 transition-all z-50 md:hidden"
      >
        <span className="material-symbols-outlined text-3xl">edit</span>
      </button>

      {/* Toast */}
      {showToast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-8 right-8 bg-white dark:bg-slate-900 border border-primary/20 shadow-sm rounded-2xl p-6 flex items-center gap-4 z-50 max-w-sm"
        >
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 dark:text-slate-100">Price Published</h4>
            <p className="text-xs text-slate-500">New price submitted to National Portal successfully.</p>
          </div>
        </div>
      )}
    </div>
  );
}