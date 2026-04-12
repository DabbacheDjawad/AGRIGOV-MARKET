import type { Metadata } from "next";
import BuyerReviewsPage from "@/components/Buyer/Reviews/ReviewsPageClient";
export const metadata: Metadata = { title: "My Reviews | AGRIGOV Buyer" };
export default function BuyerReviewsRoute() { return <BuyerReviewsPage />; }