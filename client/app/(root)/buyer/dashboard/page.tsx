// app/buyer/dashboard/page.tsx
import type { Metadata } from "next";
import BuyerOverviewPage from "@/components/Buyer/Overview/BuyerOverviewPageClient";
export const metadata: Metadata = { title: "Dashboard | AGRIGOV Buyer" };
export default function BuyerDashboardRoute() { return <BuyerOverviewPage />; }