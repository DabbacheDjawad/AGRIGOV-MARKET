import type { Metadata } from "next";
import CheckoutPage from "@/components/Checkout/CheckoutClientPage";

export const metadata: Metadata = {
  title: "Checkout — AgriConnect",
};

export default function Page() {
  return <CheckoutPage />;
}