import type { Metadata } from "next";
import PriceManagementPage from "@/components/Ministry/Pricings/PriceManagementPageClient";

export const metadata: Metadata = {
  title:       "Price Control | Ministry of Agriculture",
  description: "Manage and regulate national agricultural commodity prices",
};

export default function PricesRoute() {
  return <PriceManagementPage />;
}