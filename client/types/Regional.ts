// ─── API response shapes ──────────────────────────────────────────────────────

export type AlgeriaRegion = "north" | "east" | "west" | "south";

export interface ApiRegionFarmers {
  total:  number;
  active: number;
}

export interface ApiRegionOrders {
  total:   number;
  revenue: number;
}

export interface ApiRegionMissions {
  completed: number;
}

export interface ApiTopProduct {
  id:   number;
  name: string;
  sold: number | null;
}

export interface ApiRegionStat {
  region:       string;
  wilayas:      string[];
  farmers:      ApiRegionFarmers;
  transporters: number;
  buyers:       number;
  orders:       ApiRegionOrders;
  missions:     ApiRegionMissions;
  top_products: ApiTopProduct[];
}

export interface AllRegionsStatsData {
  north: ApiRegionStat;
  east:  ApiRegionStat;
  west:  ApiRegionStat;
  south: ApiRegionStat;
}

export interface AllRegionsStatsResponse {
  status: string;
  code:   number;
  data:   AllRegionsStatsData;
}

export interface ApiRegionComparison {
  region:              string;
  total_active_prices: number;
  revenue:             number;
  order_count:         number;
}

export interface RegionComparisonResponse {
  status: string;
  code:   number;
  data:   ApiRegionComparison[];
}

export interface RegionStatResponse {
  status: string;
  code:   number;
  data:   ApiRegionStat;
}

// ─── UI view models (derived from API) ───────────────────────────────────────

export interface RegionDetail {
  id:             AlgeriaRegion;
  name:           string;
  wilayas:        string[];
  totalFarmers:   number;
  activeFarmers:  number;
  transporters:   number;
  buyers:         number;
  totalOrders:    number;
  revenue:        number;
  completedMissions: number;
  topProducts:    ApiTopProduct[];
  // comparison
  activePrices:   number;
  orderCount:     number;
}

export function apiToRegionDetail(
  stat: ApiRegionStat,
  comparison?: ApiRegionComparison
): RegionDetail {
  return {
    id:                stat.region.toLowerCase() as AlgeriaRegion,
    name:              stat.region.charAt(0).toUpperCase() + stat.region.slice(1),
    wilayas:           stat.wilayas,
    totalFarmers:      stat.farmers.total,
    activeFarmers:     stat.farmers.active,
    transporters:      stat.transporters,
    buyers:            stat.buyers,
    totalOrders:       stat.orders.total,
    revenue:           stat.orders.revenue,
    completedMissions: stat.missions.completed,
    topProducts:       stat.top_products,
    activePrices:      comparison?.total_active_prices ?? 0,
    orderCount:        comparison?.order_count ?? 0,
  };
}

// ─── Map definition ───────────────────────────────────────────────────────────

export interface MapRegionDef {
  id:        AlgeriaRegion;
  name:      string;
  path:      string;
  markerCx?: number;
  markerCy?: number;
}

/**
 * Approximate SVG paths representing Algeria's four administrative macro-regions.
 * ViewBox: 0 0 800 700
 * North: thin coastal strip
 * East/West: flanking the north strip and extending into mid-country
 * South: vast desert portion
 */
export const mapRegions: MapRegionDef[] = [
  {
    id:       "north",
    name:     "North",
    // Coastal strip — top of map
    path:     "M 150,80 L 650,80 L 660,200 L 430,220 L 250,210 L 140,200 Z",
    markerCx: 400,
    markerCy: 145,
  },
  {
    id:   "east",
    name: "East",
    // Right flank, mid section
    path: "M 430,220 L 660,200 L 680,450 L 460,480 L 400,350 Z",
    markerCx: 560,
    markerCy: 340,
  },
  {
    id:   "west",
    name: "West",
    // Left flank, mid section
    path: "M 140,200 L 250,210 L 400,350 L 320,480 L 140,450 Z",
    markerCx: 240,
    markerCy: 340,
  },
  {
    id:   "south",
    name: "South",
    // Large desert area
    path: "M 140,450 L 320,480 L 400,350 L 460,480 L 680,450 L 700,680 L 100,680 Z",
    markerCx: 400,
    markerCy: 580,
  },
];

export const REGION_NAMES: Record<AlgeriaRegion, string> = {
  north: "North",
  east:  "East",
  west:  "West",
  south: "South",
};

// ─── Alert types (static UI — no dedicated endpoint) ─────────────────────────

export type AlertSeverity = "danger" | "info" | "warning";

export interface RegionalAlert {
  id:       string;
  severity: AlertSeverity;
  icon:     string;
  title:    string;
  message:  string;
}

export const regionalAlerts: RegionalAlert[] = [
  {
    id:       "1",
    severity: "danger",
    icon:     "warning",
    title:    "Critical Water Scarcity Warning",
    message:  "North-Western dam reservoirs drop below 15% capacity. Irrigation restrictions applied to non-strategic perimeters.",
  },
  {
    id:       "2",
    severity: "warning",
    icon:     "warning",
    title:    "Sirocco Wind & Heatwave Alert",
    message:  "High Plateaus brace for intense Sirocco winds. Farmers advised to adjust irrigation cycles to protect cereal milk-ripening phases.",
  },
  {
    id:       "3",
    severity: "info",
    icon:     "info",
    title:    "MADR Cereal Subsidy Campaign",
    message:  "Ministry of Agriculture opens registration for the 2026 certified seed and fertilizer subsidies for durum wheat producers.",
  },
];

// ─── Heatmap (static UI) ──────────────────────────────────────────────────────

export const heatmapGrid: number[] = [
  // Row 0: Northern Coast / Tell Atlas (Max intensity, high rainfall & irrigation)
  0.95, 0.88, 0.92, 0.85,

  // Row 1: High Plateaus / Transition Zone (Moderate intensity, semi-arid grain fields)  
  0.65, 0.58, 0.70, 0.52,

  // Row 2: Northern Saharan Fringe (Low intensity, stepping into arid territory)
  0.30, 0.22, 0.35, 0.18,

  // Row 3: Deep South / Sahara Desert (Near-zero intensity, highly sparse oasis pockets)
  0.05, 0.02, 0.08, 0.01,
];
export const heatmapTitles: Record<number, string> = {
  0.2: "Low Yield",
  0.4: "Medium Yield",
  0.8: "High Yield",
  0.6: "Medium-High Yield",
  0.9: "Very High Yield",
  0.3: "Below Average",
  0.5: "Average",
  1.0: "Peak Yield",
  0.7: "Above Average",
};

// ─── Filter options (UI only) ─────────────────────────────────────────────────

export type SeasonOption   = "Q3 2026" | "Q2 2026" | "Q1 2026";
export type CropTypeOption = "All Crops" | "Wheat & Grains" | "Vegetables" | "Fruits";
export type MetricOption   = "Revenue" | "Order Count" | "Active Prices";

export const SEASONS:    SeasonOption[]   = ["Q3 2026", "Q2 2026", "Q1 2026"];
export const CROP_TYPES: CropTypeOption[] = ["All Crops", "Wheat & Grains", "Vegetables", "Fruits"];
export const METRICS:    MetricOption[]   = ["Revenue", "Order Count", "Active Prices"];