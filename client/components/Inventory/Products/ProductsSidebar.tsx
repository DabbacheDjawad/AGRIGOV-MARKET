"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FARMER_NAV } from "@/types/Inventory";
import { profileApi, farmApi } from "@/lib/api";

interface Props {
  farmName?: string;
}

export default function DashboardSidebar({ farmName: initialFarmName }: Props) {
  const pathname = usePathname();
  const [farmName, setFarmName] = useState<string>(initialFarmName || "My Farm");
  const [farmerUsername, setFarmerUsername] = useState<string>("Farmer");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch both farm name and user details in parallel
    Promise.all([farmApi.getMyFarm(), profileApi.me()])
      .then(([farm, profileRes]) => {
        console.log(farm);
        
        // Farm name
        if (farm?.results?.[0]?.name) setFarmName(farm.results[0].name);
        // Username from profile response (following the same pattern as the profile page)
        const user = (profileRes as any)?.data?.user;
        if (user?.username) setFarmerUsername(user.username);
      })
      .catch(() => {
        // If either endpoint fails, the fallback values remain
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen sticky top-0 border-r border-primary/10 bg-white dark:bg-slate-900 z-30">
      {/* Farm Identity */}
      <div className="px-6 py-8 border-b border-primary/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shrink-0 shadow-sm">
            <span
              className="material-symbols-outlined text-black text-2xl"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              agriculture
            </span>
          </div>
          <div className="min-w-0">
            {loading ? (
              <>
                <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mb-1" />
                <div className="h-3 w-16 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
              </>
            ) : (
              <>
                <p className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                  {farmName}
                </p>
                <p className="text-xs text-primary font-semibold tracking-wide uppercase truncate">
                  {farmerUsername}
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto custom-scrollbar">
        {FARMER_NAV.map((item) => {
          const active =
            item.href === "/farmer/dashboard"
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-200 ${
                active
                  ? "bg-primary text-slate-900 font-bold shadow-md shadow-primary/20"
                  : "text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary-dark font-medium"
              }`}
            >
              <span
                className="material-symbols-outlined text-xl shrink-0"
                style={
                  active ? { fontVariationSettings: "'FILL' 1" } : undefined
                }
              >
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer Actions */}
      <div className="p-4 border-t border-primary/10 space-y-2">
        <Link
          href="/farmer/profile"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors font-medium"
        >
          <span className="material-symbols-outlined text-xl">
            account_circle
          </span>
          My Profile
        </Link>
        <button
          onClick={() => {
            localStorage.clear();
            window.location.href = "/auth/login";
          }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors font-bold text-left"
        >
          <span className="material-symbols-outlined text-xl">logout</span>
          Sign Out
        </button>
      </div>
    </aside>
  );
}