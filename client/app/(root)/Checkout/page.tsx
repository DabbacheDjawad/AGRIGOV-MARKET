"use client";

import { useState } from "react";
import DeliveryAddress from "@/components/Checkout/DeliveryAddress";
import TransporterSelector from "@/components/Checkout/TransporterSelector";
import CheckoutOrderSummary from "@/components/Checkout/CheckoutOrderSummary";
import { transporters, orderLineItems, checkoutSummaryBase } from "@/types/Checkout";

const DELIVERY_ADDRESS = {
  name: "Green Valley Cooperative",
  line1: "Plot 45, Northern Agricultural Zone",
  line2: "Kilimanjaro Region, 20114",
  phone: "+255 712 345 678",
  mapImageUrl:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAUyYGlWXdHc688RkHXmyy_akux8_qdFBgCrasIKZZCZ31jvgk8aRa7IL1njefwuzAnjYShXXLbKar1TE4oF9MncwO9t6j0jk3_MKfsaWmPVdNXgKLLlgOnliPz-qJ8qHiu94dwvtDuyQgSAMVOGEEDN8JTQf3iDodXTB3biks7bshK7E36sISMPaZ2j1tbQhSM0WtrDckM1jE8iX-jqfA4n7K7Dk5PjsnM6-1wGMwQrEpEzM2a5uQavxRCy3zvPr5ERlNvcNMxFBxI",
};

export default function CheckoutPage() {
  const [selectedTransporterId, setSelectedTransporterId] = useState(transporters[0].id);

  const selectedTransporter = transporters.find((t) => t.id === selectedTransporterId)!;

  const handleConfirm = () => {
    // Navigate to confirmation page in a real app
    alert("Order confirmed! Redirecting to confirmation...");
  };

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-800 dark:text-slate-100 antialiased min-h-screen flex flex-col">

      <main className="grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
          {/* Left: checkout steps */}
          <section className="lg:col-span-8 space-y-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Checkout</h1>

            <DeliveryAddress
              address={DELIVERY_ADDRESS}
              onChangeClick={() => {
                /* open address modal */
              }}
            />

            <TransporterSelector
              transporters={transporters}
              selectedId={selectedTransporterId}
              onChange={setSelectedTransporterId}
            />
          </section>

          {/* Right: order summary */}
          <aside className="lg:col-span-4 mt-8 lg:mt-0">
            <CheckoutOrderSummary
              items={orderLineItems}
              summary={checkoutSummaryBase}
              transportFee={selectedTransporter.price}
              onConfirm={handleConfirm}
            />
          </aside>
        </div>
      </main>
    </div>
  );
}