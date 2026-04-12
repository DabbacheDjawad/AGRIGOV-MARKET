import type { Metadata } from "next";
import MinistryDashboardPage from "@/components/Ministry/MinistryDashboardPageClient";

export const metadata: Metadata = {
  title: "Overview | Ministry of Agriculture",
  description: "Real-time national agricultural metrics and regulatory dashboard",
};

export default function AdminOverviewRoute() {
  return <MinistryDashboardPage />;
}