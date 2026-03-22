"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Breadcrumb from "@/components/Cart/BreadCrumb";
import CartItemRow from "@/components/Cart/CartItemRow";
import OrderSummary from "@/components/Cart/OrderSummary";
import { initialCartItems } from "@/types/Cart";
import type { CartItem } from "@/types/Cart";

const TRANSPORT_FLAT = 45_000;
const LEVY_RATE = 0.01;
const ESTIMATED_WEIGHT_KG = 1_750;
const VEHICLE_TYPE = "Light Truck";

const CRUMBS = [
  { label: "Marketplace", href: "#" },
  { label: "Shopping Cart" },
];

export default function ShoppingCart() {
  const [items, setItems] = useState<CartItem[]>(initialCartItems);

  const updateQuantity = (id: string, qty: number) =>
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: qty } : item))
    );

  const removeItem = (id: string) =>
    setItems((prev) => prev.filter((item) => item.id !== id));

  const subtotal = useMemo(
    () => items.reduce((acc, item) => acc + item.pricePerUnit * item.quantity, 0),
    [items]
  );

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-800 dark:text-slate-100 min-h-screen font-display antialiased flex flex-col">

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <Breadcrumb crumbs={CRUMBS} />

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Your Agricultural Basket
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          Review items, adjust quantities, and proceed to secure transport booking.
        </p>

        <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
          {/* Cart items */}
          <section className="lg:col-span-8">
            <div className="bg-surface-light dark:bg-surface-dark shadow-sm border border-gray-100 dark:border-green-900/20 rounded-xl overflow-hidden mb-6">
              {/* Table header — desktop only */}
              <div className="hidden sm:grid grid-cols-12 gap-4 px-6 py-3 border-b border-gray-100 dark:border-green-900/20 bg-gray-50/50 dark:bg-white/5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <div className="col-span-6">Product</div>
                <div className="col-span-3 text-center">Quantity</div>
                <div className="col-span-3 text-right">Subtotal</div>
              </div>

              {items.length > 0 ? (
                items.map((item) => (
                  <CartItemRow
                    key={item.id}
                    item={item}
                    onQuantityChange={updateQuantity}
                    onRemove={removeItem}
                  />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                  <span className="material-icons text-5xl mb-3">shopping_basket</span>
                  <p className="text-lg font-medium">Your basket is empty.</p>
                  <Link
                    href="#"
                    className="mt-4 text-sm text-primary-dark dark:text-primary hover:underline font-medium"
                  >
                    Browse the Marketplace
                  </Link>
                </div>
              )}
            </div>

            {/* Continue shopping */}
            <div className="flex justify-between items-center bg-surface-light dark:bg-surface-dark p-6 rounded-xl shadow-sm border border-gray-100 dark:border-green-900/20">
              <Link
                href="#"
                className="text-primary-dark dark:text-primary hover:text-green-700 font-medium flex items-center"
              >
                <span className="material-icons text-sm mr-2">arrow_back</span>
                Continue Shopping
              </Link>
            </div>
          </section>

          {/* Order summary */}
          <section className="lg:col-span-4 mt-8 lg:mt-0">
            <OrderSummary
              subtotal={subtotal}
              transport={TRANSPORT_FLAT}
              levyRate={LEVY_RATE}
              totalWeightKg={ESTIMATED_WEIGHT_KG}
              vehicleType={VEHICLE_TYPE}
            />
          </section>
        </div>
      </main>
    </div>
  );
}