// app/buyer/dashboard/page.tsx
import type { Metadata } from "next";
import BuyerOrderDetails from "@/components/Buyer/Orders/Details/BuyerOrderDetails"; 
export const metadata: Metadata = { title: "Dashboard | AGRIGOV Buyer" };
export default function BuyerDashboardRoute() { return <BuyerOrderDetails />; }