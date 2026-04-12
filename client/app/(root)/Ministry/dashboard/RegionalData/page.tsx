import type { Metadata } from "next";
import RegionalClientPage from "@/components/Ministry/Regional/RegionalPageClient";

export const metadata: Metadata = {
  title:       "Regional Data | Ministry of Agriculture",
  description: "Explore detailed agricultural data across Algeria's regions, including farmer activity, revenue, and regional comparisons. Gain insights to drive informed decisions and optimize agricultural strategies.",
};

export default function PricesRoute() {
  return <RegionalClientPage />;
}