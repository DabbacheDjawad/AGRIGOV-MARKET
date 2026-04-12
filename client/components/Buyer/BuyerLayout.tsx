"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { label: "Overview",          icon: "dashboard",     href: "/buyer/dashboard"            },
  { label: "Orders & Invoices", icon: "receipt_long",  href: "/buyer/dashboard/orders"     },
  { label: "Reviews",           icon: "star",          href: "/buyer/dashboard/reviews"    },
  { label: "Analytics",         icon: "analytics",     href: "/buyer/dashboard/analytics"  },
];

export default function BuyerLayout({ children }: { children: React.ReactNode }) {
  const path = usePathname();

  return (
    <div className="flex min-h-screen bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100">

      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 shrink-0 bg-white dark:bg-neutral-dark border-r border-neutral-light dark:border-border-dark">
        {/* Logo */}
        <div className="p-6 border-b border-neutral-light dark:border-border-dark">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-primary text-[20px]">person</span>
            </div>
            <div>
              <p className="text-sm font-bold leading-tight">Buyer Portal</p>
              <p className="text-[10px] text-slate-500 font-medium">AGRIGOV Platform</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {NAV.map((item) => {
            const isActive = path === item.href || (item.href !== "/buyer/dashboard" && path.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-primary/10 text-primary font-bold"
                    : "text-slate-600 dark:text-slate-400 hover:bg-neutral-50 dark:hover:bg-earth-800 hover:text-slate-900 dark:hover:text-slate-100"
                }`}
              >
                <span
                  className="material-symbols-outlined text-[20px]"
                  style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                  {item.icon}
                </span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-light dark:border-border-dark space-y-1">
          <Link href="/marketplace" className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-slate-500 hover:text-primary transition-colors">
            <span className="material-symbols-outlined text-[18px]">storefront</span>
            Marketplace
          </Link>
          <Link href="/Cart" className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-slate-500 hover:text-primary transition-colors">
            <span className="material-symbols-outlined text-[18px]">shopping_cart</span>
            My Cart
          </Link>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 min-w-0 overflow-y-auto">
        {/* Mobile nav */}
        <div className="md:hidden flex gap-1 overflow-x-auto p-3 bg-white dark:bg-neutral-dark border-b border-neutral-light dark:border-border-dark scrollbar-hide">
          {NAV.map((item) => {
            const isActive = path === item.href || (item.href !== "/buyer/dashboard" && path.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-colors shrink-0 ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-slate-500 hover:bg-neutral-50 dark:hover:bg-earth-800"
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}