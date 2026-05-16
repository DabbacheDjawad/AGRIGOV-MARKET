import type { Metadata } from "next";
import OfficialPricesPage from "@/components/Inventory/OfficialPrices/OfficialPricesPageClient";

export const metadata: Metadata = {
  title:       "Official Prices View | AGRIGOV Farmer Portal",
  description: "View the latest official prices for agricultural products, helping you make informed decisions on when to sell your produce. Stay updated with market trends and maximize your profits with our comprehensive price listings.",
};

export default function OfficialPricesViewPage() {
  return <OfficialPricesPage />;
}