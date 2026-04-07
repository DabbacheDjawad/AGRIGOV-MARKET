import type { Metadata } from "next";
import FarmerAnalyticsPage from "@/components/Inventory/Analytics/FarmerAnalyticsPageClient";

export const metadata: Metadata = {
  title: "Harvest Insights | AgriGov",
  description:
    "Annual performance review, revenue projections, crop analysis, and market data for your farm.",
};

export default function AnalyticsRoute() {
  return <FarmerAnalyticsPage />;
}