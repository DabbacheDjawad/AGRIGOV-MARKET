"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import CheckoutStepper      from "@/components/Checkout/CheckoutStepper";
import DeliveryAddressCard  from "@/components/Checkout/DeliveryAddress";
import CheckoutOrderSummary from "@/components/Checkout/CheckoutOrderSummary";
import { cartApi, orderApi } from "@/lib/api";
import { ApiError } from "@/lib/api";
import type { CartResponse } from "@/types/Cart";
import type { ApiTransporter, CheckoutResponse, DeliveryAddress } from "@/types/Checkout";
import { redirect } from "next/navigation";

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Try to pre-fill the delivery address from the stored user object.
 * The user object written to localStorage on login contains wilaya/baladiya
 * via the farmer profile — this is best-effort and editable.
 */
function getStoredAddress(): DeliveryAddress {
  try {
    const raw = typeof window !== "undefined" ? localStorage.getItem("user") : null;
    if (!raw) return { wilaya: "", baladiya: "", address: "", phone: "" };
    const u = JSON.parse(raw);
    return {
      wilaya:   u.wilaya   ?? "",
      baladiya: u.baladiya ?? "",
      address:  u.Address  ?? u.address ?? "",
      phone:    u.phone    ?? "",
    };
  } catch {
    return { wilaya: "", baladiya: "", address: "", phone: "" };
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function CheckoutPage() {
  const [cart,             setCart]          = useState<CartResponse | null>(null);
  const [selectedId,       setSelectedId]    = useState<number | null>(null);
  const [address,          setAddress]       = useState<DeliveryAddress>(getStoredAddress);
  const [notes,            setNotes]         = useState("");

  const [cartLoading,      setCartLoading]   = useState(true);
  const [transLoading,     setTransLoading]  = useState(true);
  const [isSubmitting,     setIsSubmitting]  = useState(false);
  const [error,            setError]         = useState("");
  const [confirmedOrder,   setConfirmedOrder] = useState<CheckoutResponse | null>(null);

  // ── Load cart ───────────────────────────────────────────────────────────────

  useEffect(() => {
    cartApi.get()
      .then(setCart)
      .catch((err) => setError(err instanceof ApiError ? err.message : "Failed to load cart."))
      .finally(() => setCartLoading(false));
  }, []);

  // ── Re-fetch transporters when the user changes the delivery wilaya ─────────

  const handleAddressChange = useCallback((a: DeliveryAddress) => {
    setAddress(a);
    setSelectedId(null);
    setTransLoading(true);
  }, []);

  // ── Submit order ────────────────────────────────────────────────────────────

  const handleConfirm = async () => {
    // if (!address.wilaya || !address.address) {
    //   setError("Please fill in your delivery address before confirming.");
    //   return;
    // }
    let success:Boolean = false;
    setIsSubmitting(true);
    setError("");

    try {
      const order = await orderApi.checkout();
      setConfirmedOrder(order);
      success=true;
    } catch (err) {
        console.log(err);
        success=false;
      setError(
        err instanceof ApiError
          ? err.status === 401 ? "Please sign in to place an order." : err.message
          : "Failed to place your order. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
    if(success) {
      redirect("/marketplace");
    }
  };

  // ── Loading skeleton ────────────────────────────────────────────────────────

  if (cartLoading) {
    return (
      <div className="bg-background-light font-display min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-pulse space-y-6">
          <div className="h-8 w-48 bg-neutral-200 rounded" />
          <div className="grid lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-5">
              <div className="h-32 bg-neutral-100 rounded-xl" />
              <div className="h-64 bg-neutral-100 rounded-xl" />
            </div>
            <div className="lg:col-span-4">
              <div className="h-96 bg-neutral-100 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Empty cart guard ────────────────────────────────────────────────────────

  if (!cart || cart.items.length === 0) {
    return (
      <div className="bg-background-light font-display min-h-screen flex items-center justify-center p-8">
        <div className="text-center space-y-4 max-w-sm">
          <span className="material-symbols-outlined text-5xl text-neutral-300 block"
            style={{ fontVariationSettings: "'FILL' 0" }}>
            shopping_basket
          </span>
          <p className="text-lg font-semibold text-gray-900">Your cart is empty</p>
          <p className="text-sm text-gray-500">Add products before proceeding to checkout.</p>
          <Link href="/marketplace"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-black text-sm font-bold">
            <span className="material-symbols-outlined text-base">storefront</span>
            Browse Marketplace
          </Link>
        </div>
      </div>
    );
  }

  // ── Main checkout ───────────────────────────────────────────────────────────

  return (
    <div className="bg-background-light font-display text-gray-800 antialiased min-h-screen flex flex-col">

      {/* Nav strip */}
      <div className="bg-white border-b border-neutral-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-black text-sm"
                style={{ fontVariationSettings: "'FILL' 1" }}>
                agriculture
              </span>
            </div>
            <span className="text-sm font-bold text-gray-900">AgriConnect</span>
          </div>
          <CheckoutStepper />
          <Link href="/cart" className="text-xs text-gray-400 hover:text-primary-dark font-medium flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Back to Cart
          </Link>
        </div>
      </div>

      <main className="grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">

        {/* Error */}
        {error && (
          <div role="alert"
            className="mb-6 flex items-center gap-2.5 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
            <span className="material-symbols-outlined text-base shrink-0">error</span>
            {error}
            <button type="button" onClick={() => setError("")}
              className="ml-auto text-red-400 hover:text-red-600">
              <span className="material-symbols-outlined text-base">close</span>
            </button>
          </div>
        )}

        <div className="lg:grid lg:grid-cols-12 lg:gap-8 lg:items-start">

          {/* ── Left: steps ──────────────────────────────────────────────── */}
          <section className="lg:col-span-8 space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>

            {/* 1. Delivery address */}
            <DeliveryAddressCard
              address={address}
              onChange={handleAddressChange}
            />

            {/* 3. Optional notes */}
            <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-5">
              <label htmlFor="notes" className="block text-sm font-semibold text-gray-900 mb-2 items-center gap-2">
                <span className="material-symbols-outlined text-primary text-base">
                  edit_note
                </span>
                Order Notes <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <textarea
                id="notes"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Special instructions for the farmer or transporter…"
                className="block w-full py-2.5 px-3 rounded-lg border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:border-primary focus:ring-primary focus:outline-none resize-none transition"
              />
            </div>
          </section>

          {/* ── Right: order summary ──────────────────────────────────────── */}
          <aside className="lg:col-span-4 mt-8 lg:mt-0">
            <CheckoutOrderSummary
              items={cart.items}
              cartTotal={cart.total_price}
              isSubmitting={isSubmitting}
              onConfirm={handleConfirm}
            />
          </aside>
        </div>
      </main>
    </div>
  );
}