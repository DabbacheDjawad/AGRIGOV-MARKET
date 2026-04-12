import type { Metadata } from "next";
import FarmerDashboardPage from "@/components/Inventory/FarmerOverviewPageClient";

export const metadata: Metadata = {
  title:       "Farm Overview | AGRIGOV Farmer Portal",
  description: "Real-time overview of your farm revenue, orders, inventory and analytics",
};

export default function FarmerDashboardRoute() {
  return <FarmerDashboardPage />;
}