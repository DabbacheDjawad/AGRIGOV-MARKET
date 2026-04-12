import type { Metadata } from "next";
import AddPricePage from "@/components/Ministry/Pricings/Add/AddPricePageClient";

export const metadata: Metadata = {
  title:       "Add Official Price | Ministry of Agriculture",
  description: "Official administrative entry for the national agricultural commodity pricing index",
};

export default function AddPriceRoute() {
  return <AddPricePage />;
}