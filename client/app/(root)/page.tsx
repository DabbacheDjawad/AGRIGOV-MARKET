"use client";

import { useState, useEffect } from "react";
import MarketTicker from "@/components/Home/Marketticker";
import HeroSection from "@/components/Home/Hero";
import PersonaCards from "@/components/Home/PersonaCards";
import PriceTable from "@/components/Home/PriceTable";
import NationalCoverageSection from "@/components/Home/NationalCoverage";
import { homepageApi } from "@/lib/api";
import {
  personaCards,   // we no longer use the static list, but keep it for fallback
  Stat,
  PriceRow,
  TickerItem,
  NewsArticle,
} from "@/types/Home";

// ─── Role‑based quick links ─────────────────────────────────────────────────
const ROLE_LINKS: Record<string, { icon: string; title: string; description: string; cta: string; href: string; color: string }[]> = {
  FARMER: [
    {
      icon: "storefront",
      title: "My Products",
      description: "Manage your listed products and update stock.",
      cta: "Go to Products",
      href: "/farmer/dashboard/products",
      color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    },
    {
      icon: "receipt_long",
      title: "Orders",
      description: "View incoming orders and confirm shipments.",
      cta: "View Orders",
      href: "/farmer/dashboard/orders",
      color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    },
    {
      icon: "local_shipping",
      title: "Missions",
      description: "Create and monitor delivery missions.",
      cta: "Manage Missions",
      href: "/farmer/dashboard/missions",
      color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    },
  ],
  BUYER: [
    {
      icon: "shopping_basket",
      title: "Marketplace",
      description: "Browse and purchase agricultural products.",
      cta: "Explore Marketplace",
      href: "/marketplace",
      color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    },
    {
      icon: "receipt_long",
      title: "My Orders",
      description: "Track your purchases and delivery status.",
      cta: "View Orders",
      href: "/buyer/dashboard/orders",
      color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    },
    {
      icon: "star_half",
      title: "My Reviews",
      description: "Rate products you've received.",
      cta: "Leave Reviews",
      href: "/buyer/dashboard/reviews",
      color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    },
  ],
  TRANSPORTER: [
    {
      icon: "local_shipping",
      title: "Missions",
      description: "Track your ongoing deliveries or find undelivered missions.",
      cta: "My Missions",
      href: "/transporter/dashboard/missions",
      color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    },
    {
      icon: "history",
      title: "Delivery History",
      description: "View completed missions and earnings.",
      cta: "View History",
      href: "/transporter/dashboard",
      color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    },
        {
      icon: "person",
      title: "profile",
      description: "View and edit your profile information.",
      cta: "View Profile",
      href: "/Transporter/profile",
      color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    },
  ],
  ADMIN: [
    {
      icon: "group",
      title: "User Management",
      description: "Verify and manage platform users.",
      cta: "Manage Users",
      href: "/Ministry/dashboard/users",
      color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    },
    {
      icon: "payments",
      title: "Price Regulation",
      description: "Set and update official product prices.",
      cta: "Manage Prices",
      href: "/Ministry/dashboard/PricesManagement",
      color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    },
    {
      icon: "category",
      title: "Product Categories",
      description: "Organise ministry product catalogue.",
      cta: "View Categories",
      href: "/Ministry/dashboard/categories",
      color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    },
  ],
};

// ─── Skeletons (unchanged) ─────────────────────────────────────────────────
function PriceTableSkeleton() {
  return (
    <section className="py-20 bg-background-light dark:bg-background-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold mb-2 animate-pulse h-8 w-64 bg-slate-200 dark:bg-slate-700 rounded" />
        <div className="h-64 bg-surface-light dark:bg-surface-dark rounded-xl animate-pulse" />
      </div>
    </section>
  );
}

function NationalCoverageSkeleton() {
  return (
    <section className="py-20 bg-background-light dark:bg-background-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 rounded-2xl h-64 animate-pulse" />
      </div>
    </section>
  );
}

function NewsSkeleton() {
  return (
    <section className="py-20 bg-surface-light dark:bg-surface-dark/50 border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold mb-8 animate-pulse h-8 w-64 bg-slate-200 dark:bg-slate-700 rounded" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="md:col-span-2 h-80 bg-slate-200 dark:bg-slate-700 rounded-xl animate-pulse" />
          <div className="h-60 bg-slate-200 dark:bg-slate-700 rounded-xl animate-pulse" />
          <div className="h-60 bg-slate-200 dark:bg-slate-700 rounded-xl animate-pulse" />
        </div>
      </div>
    </section>
  );
}

export default function LandingPage() {
  const [tickerItems, setTickerItems] = useState<TickerItem[]>([]);
  const [priceRows, setPriceRows] = useState<PriceRow[]>([]);
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([]);
  const [nationalStats, setNationalStats] = useState<Stat[]>([]);
  const [quickLinks, setQuickLinks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Determine user role from localStorage
    let userRole = "";
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        const user = JSON.parse(stored);
        userRole = user.role;
      }
    } catch {}

    // Fetch homepage data
    homepageApi
      .get()
      .then((res) => {
        const { data } = res;
        setTickerItems(data.ticker);
        setPriceRows(data.prices);
        setNewsArticles(data.news);

        // Build stats for NationalCoverageSection
        const stats: Stat[] = [
          {
            id: "farmers",
            icon: "groups",
            value: `${(data.stats.total_farmers / 1000000).toFixed(1)}M+`,
            label: "Registered Farmers",
          },
          {
            id: "transactions",
            icon: "shopping_bag",
            value: `${(data.stats.total_orders / 1000).toFixed(0)}k+`,
            label: "Total Orders",
          },
          {
            id: "counties",
            icon: "warehouse",
            value: `${data.stats.wilayas_count}`,
            label: "Connected Wilayas",
          },
        ];
        setNationalStats(stats);
      })
      .catch((err) => {
        console.error("Failed to load homepage data:", err);
      })
      .finally(() => setLoading(false));

    // Set quick links based on role
    setQuickLinks(ROLE_LINKS[userRole] || []);
  }, []);

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-800 dark:text-slate-100 font-display selection:bg-primary selection:text-black antialiased">
      {loading ? (
        <div className="h-10 bg-surface-dark animate-pulse" />
      ) : (
        <MarketTicker items={tickerItems.length > 0 ? tickerItems : []} />
      )}
      <HeroSection />
      <PersonaCards links={quickLinks} />
      {loading ? <PriceTableSkeleton /> : <PriceTable rows={priceRows} />}
      {loading ? <NationalCoverageSkeleton /> : <NationalCoverageSection stats={nationalStats} />}
    </div>
  );
}