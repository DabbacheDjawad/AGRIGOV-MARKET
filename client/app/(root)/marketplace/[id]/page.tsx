"use client";

import { useState } from "react";
import ProductDetailNavbar from "@/components/Products/Details/ProductDetailNavbar";
import ProductGallery from "@/components/Products/Details/ProductGallerie";
import SpecsTabPanel from "@/components/Products/Details/SpecsPanel";
import PriceBenchmarkChart from "@/components/Products/Details/PriceBenchMarkChart";
import PurchaseCard from "@/components/Products/Details/PurchaseCard";
import FarmerProfileWidget from "@/components/Products/Details/FarmerProfileWidget";
import OriginLogisticsPanel from "@/components/Products/Details/LogisticsPanel";
import Breadcrumb  from "@/components/Cart/BreadCrumb";
import { maizeProductDetail } from "@/types/ProductDetails";
import Link from "next/link";

export default function ProductDetailPage() {
  const product = maizeProductDetail;
  const [cartCount, setCartCount] = useState(0);

  const handleAddToCart = (qty: number) => setCartCount((c) => c + qty);
  const handleBuyNow = (qty: number) => {
    // Navigate to checkout in real app; for now just mirror cart add
    setCartCount((c) => c + qty);
  };

  const crumbs = [
    { label: "Home", href: "#", icon: "home" },
    { label: "Grains", href: "#" },
    { label: "Maize", href: "#" },
    { label: `Listing ${product.listingId}` },
  ];

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-gray-800 dark:text-gray-100 min-h-screen flex flex-col">
      <ProductDetailNavbar />

      {/* Breadcrumb strip */}
      <div className="bg-background-light dark:bg-background-dark border-b border-neutral-border dark:border-neutral-border-dark py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              {crumbs.map((crumb, i) => (
                <li key={i} className="flex items-center gap-2">
                  {i > 0 && <span className="text-gray-300">/</span>}
                  {crumb.href ? (
                    <Link
                      href={crumb.href}
                      className="text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 flex items-center"
                    >
                      {crumb.icon && (
                        <span className="material-icons text-sm mr-0.5">{crumb.icon}</span>
                      )}
                      {!crumb.icon && crumb.label}
                    </Link>
                  ) : (
                    <span
                      aria-current="page"
                      className="text-sm font-medium text-gray-900 dark:text-white"
                    >
                      {crumb.label}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <main className="grow py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left — gallery + specs + chart */}
            <div className="lg:col-span-8 space-y-8">
              <ProductGallery images={product.galleryImages} gradeLabel={product.gradeLabel} />
              <SpecsTabPanel specs={product.specs} description={product.description} />
              <PriceBenchmarkChart bars={product.chartBars} benchmarkLabel={product.benchmarkLabel} />
            </div>

            {/* Right — purchase card + farmer */}
            <div className="lg:col-span-4 space-y-6">
              <PurchaseCard
                product={product}
                onAddToCart={handleAddToCart}
                onBuyNow={handleBuyNow}
              />
              <FarmerProfileWidget farmer={product.farmer} />
            </div>
          </div>

          {/* Bottom — origin & logistics */}
          <div className="mt-8">
            <OriginLogisticsPanel
              mapImageUrl={product.mapImageUrl}
              warehouseLabel="Nakuru Warehouse"
              logistics={product.logistics}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-neutral-surface dark:bg-neutral-surface-dark border-t border-neutral-border dark:border-neutral-border-dark mt-12 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
              <span className="material-icons text-background-dark text-xs">agriculture</span>
            </div>
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              Ministry of Agriculture
            </span>
          </div>
          <p className="text-sm text-gray-500 text-center md:text-right">
            © {new Date().getFullYear()} National Agricultural Platform. All rights reserved.
            <br />A Government Initiative.
          </p>
        </div>
      </footer>
    </div>
  );
}