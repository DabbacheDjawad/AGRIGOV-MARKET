"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import YieldSidebar from "@/components/Ministry/Regional/YieldSideBar";
import RegionalMap from "@/components/Ministry/Regional/RegionalMap";
import RegionalRankings from "@/components/Ministry/Regional/RegionalRanking";
import type {
  AlgeriaRegion,
  RegionDetail,
  AllRegionsStatsData,
  ApiRegionComparison,
} from "@/types/Regional";
import { apiToRegionDetail } from "@/types/Regional";
import { regionalApi, ApiError } from "@/lib/api";

type MobileTab = "map" | "stats" | "rankings";

export default function RegionalDataPage() {
  const [allStats, setAllStats] = useState<AllRegionsStatsData | null>(null);
  const [comparisons, setComparisons] = useState<ApiRegionComparison[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [activeRegionId, setActiveRegionId] = useState<AlgeriaRegion | null>(null);
  const [mobileTab, setMobileTab] = useState<MobileTab>("map");

  const cancelledRef = useRef(false);

  const fetchData = useCallback(() => {
    cancelledRef.current = false;
    setIsLoading(true);
    setLoadError(null);

    Promise.all([regionalApi.allStats(), regionalApi.comparison()])
      .then(([statsRes, compRes]) => {
        if (cancelledRef.current) return;
        setAllStats(statsRes.data);
        setComparisons(compRes.data);
      })
      .catch((err: unknown) => {
        if (cancelledRef.current) return;
        setLoadError(
          err instanceof ApiError ? err.message : "Failed to load regional data. Please retry."
        );
      })
      .finally(() => {
        if (!cancelledRef.current) setIsLoading(false);
      });

    return () => { cancelledRef.current = true; };
  }, []);

  useEffect(fetchData, [fetchData]);

  const activeDetail: RegionDetail | null = (() => {
    if (!activeRegionId || !allStats) return null;
    const stat = allStats[activeRegionId];
    if (!stat) return null;
    const comp = comparisons.find((c) => c.region.toLowerCase() === activeRegionId);
    return apiToRegionDetail(stat, comp);
  })();

  const handleRegionClick = (id: string) =>
    setActiveRegionId((prev) => (prev === id ? null : (id as AlgeriaRegion)));

  const handleCardClose = () => setActiveRegionId(null);

  const mobileTabs: { id: MobileTab; label: string; icon: string }[] = [
    { id: "map", label: "Map", icon: "map" },
    { id: "stats", label: "Analytics", icon: "analytics" },
    { id: "rankings", label: "Rankings", icon: "leaderboard" },
  ];

  return (
    <div className="bg-background-light text-slate-800 font-display antialiased h-screen flex flex-col overflow-hidden">
      {loadError && (
        <div
          role="alert"
          className="shrink-0 flex items-center gap-3 bg-red-50 border-b border-red-200 px-4 py-2 text-sm text-red-700"
        >
          <span className="material-icons text-base">error</span>
          <span className="flex-1">{loadError}</span>
          <button
            onClick={() => { setLoadError(null); fetchData(); }}
            className="underline font-semibold text-xs shrink-0"
          >
            Retry
          </button>
        </div>
      )}

      {/* ── Desktop layout (xl+) ── */}
      <main className="hidden xl:flex flex-1 overflow-hidden">
        <YieldSidebar stats={allStats} isLoading={isLoading} />
        <RegionalMap
          activeRegionId={activeRegionId}
          onRegionClick={handleRegionClick}
          onCardClose={handleCardClose}
          activeDetail={activeDetail}
        />
        <RegionalRankings
          comparisons={comparisons}
          allStats={allStats}
          activeRegionId={activeRegionId}
          isLoading={isLoading}
          onSelect={handleRegionClick}
        />
      </main>

      {/* ── Tablet layout (md–xl): sidebar + map, rankings hidden ── */}
      <main className="hidden md:flex xl:hidden flex-1 overflow-hidden">
        <YieldSidebar stats={allStats} isLoading={isLoading} />
        <RegionalMap
          activeRegionId={activeRegionId}
          onRegionClick={handleRegionClick}
          onCardClose={handleCardClose}
          activeDetail={activeDetail}
        />
      </main>

      {/* ── Mobile layout (< md): tab-driven ── */}
      <main className="flex md:hidden flex-1 flex-col overflow-hidden">
        {/* Tab content */}
        <div className="flex-1 overflow-hidden relative">
          <div className={mobileTab === "map" ? "block h-full" : "hidden"}>
            <RegionalMap
              activeRegionId={activeRegionId}
              onRegionClick={(id) => { handleRegionClick(id); }}
              onCardClose={handleCardClose}
              activeDetail={activeDetail}
            />
          </div>
          <div className={`${mobileTab === "stats" ? "block" : "hidden"} h-full  overflow-y-auto`}>
            <YieldSidebar stats={allStats} isLoading={isLoading} />
          </div>
          <div className={`hidden h-full overflow-y-auto`}>
            <RegionalRankings
              comparisons={comparisons}
              allStats={allStats}
              activeRegionId={activeRegionId}
              isLoading={isLoading}
              onSelect={(id) => { handleRegionClick(id); setMobileTab("map"); }}
            />
          </div>
        </div>

        {/* Bottom tab bar */}
        <nav className="shrink-0 flex bg-white border-t border-slate-200 safe-area-pb">
          {mobileTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setMobileTab(tab.id)}
              className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 text-[10px] font-bold uppercase tracking-wide transition-colors ${
                mobileTab === tab.id
                  ? "text-primary"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <span className="material-icons text-xl">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </main>
    </div>
  );
}