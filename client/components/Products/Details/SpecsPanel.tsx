"use client";

import { useState } from "react";
import type { ProductSpec, SpecTab } from "@/types/ProductDetails";

const TABS: SpecTab[] = ["Specifications", "Harvest Details", "Quality Certificates"];

interface Props {
  specs: ProductSpec[];
  description: string;
}

export default function SpecsTabPanel({ specs, description }: Props) {
  const [activeTab, setActiveTab] = useState<SpecTab>("Specifications");

  return (
    <div className="bg-neutral-surface dark:bg-neutral-surface-dark rounded-xl shadow-sm border border-neutral-border dark:border-neutral-border-dark overflow-hidden">
      {/* Tab bar */}
      <div className="border-b border-neutral-border dark:border-neutral-border-dark">
        <nav aria-label="Product detail tabs" className="flex -mb-px px-6">
          {TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm transition-colors first:pl-1 ${
                activeTab === tab
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      <div className="p-6">
        {activeTab === "Specifications" && (
          <>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Product Specifications
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-0 gap-x-8">
              {specs.map((spec) => (
                <div
                  key={spec.label}
                  className="flex justify-between py-3 border-b border-dashed border-neutral-border dark:border-neutral-border-dark"
                >
                  <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    {spec.label}
                    {spec.verified && (
                      <span
                        className="material-icons text-primary text-sm"
                        title="Verified by Ministry Agent"
                      >
                        verified
                      </span>
                    )}
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white text-right ml-4">
                    {spec.value}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-3">
                Description
              </h4>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                {description}
              </p>
            </div>
          </>
        )}

        {activeTab === "Harvest Details" && (
          <div className="py-6 text-center text-gray-400 text-sm">
            <span className="material-icons text-3xl mb-2 block">eco</span>
            Harvest details and season records will appear here.
          </div>
        )}

        {activeTab === "Quality Certificates" && (
          <div className="py-6 text-center text-gray-400 text-sm">
            <span className="material-icons text-3xl mb-2 block">workspace_premium</span>
            Official quality certificates and lab reports will appear here.
          </div>
        )}
      </div>
    </div>
  );
}