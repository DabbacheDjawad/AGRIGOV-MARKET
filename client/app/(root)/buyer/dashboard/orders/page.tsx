import type { Metadata } from "next";
import BuyerOrdersPage from "@/components/Buyer/Orders/BuyerOrdersPageClient";
export const metadata: Metadata = { title: "Orders & Invoices | AGRIGOV Buyer" };
export default function BuyerOrdersRoute() { return <BuyerOrdersPage />; }