import type { Metadata } from "next";
import MinistryAnalyticsPage from "@/components/Ministry/Analytics/MinistryAnalyticsPageClient";

export const metadata: Metadata = {
  title: "Analytics | Ministry of Agriculture",
  description: "Charts and performance insights from national agricultural data",
};

export default function AnalyticsRoute() {
  return <MinistryAnalyticsPage />;
}