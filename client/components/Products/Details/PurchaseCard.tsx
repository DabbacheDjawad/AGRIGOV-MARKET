"use client";

import { useState, useMemo } from "react";
import type { ProductDetail } from "@/types/ProductDetails";

interface Props {
  product: ProductDetail;
  onAddToCart: (qty: number) => void;
  onBuyNow: (qty: number) => void;
}

export default function PurchaseCard({ product, onAddToCart, onBuyNow }: Props) {
  const [quantity, setQuantity] = useState(product.defaultQuantity);
  const [isFavorited, setIsFavorited] = useState(false);
  const [deliveryCity, setDeliveryCity] = useState(product.defaultDeliveryCity);

  const availabilityPct = Math.min(
    100,
    Math.round((product.availableTons / product.totalTons) * 100)
  );

  const subtotal = useMemo(
    () => quantity * product.pricePerTon + product.estimatedShipping,
    [quantity, product.pricePerTon, product.estimatedShipping]
  );

  return (
    <div className="bg-neutral-surface dark:bg-neutral-surface-dark rounded-xl shadow-lg border border-neutral-border dark:border-neutral-border-dark p-6 sticky top-24">
      {/* Title + favorite */}
      <div className="flex justify-between items-start mb-2">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">
          {product.name}
        </h1>
        <button
          type="button"
          onClick={() => setIsFavorited((v) => !v)}
          aria-label={isFavorited ? "Remove from favourites" : "Add to favourites"}
          className={`transition-colors ${isFavorited ? "text-red-500" : "text-gray-400 hover:text-red-500"}`}
        >
          <span className="material-icons">
            {isFavorited ? "favorite" : "favorite_border"}
          </span>
        </button>
      </div>

      {/* Price */}
      <div className="mb-6">
        <span className="text-3xl font-extrabold text-gray-900 dark:text-white">
          ${product.pricePerTon.toFixed(2)}
        </span>
        <span className="text-gray-500 text-sm font-medium"> / Ton</span>
        {product.priceDrop && (
          <div className="text-xs text-green-600 dark:text-green-400 mt-1 font-medium flex items-center">
            <span className="material-icons text-sm mr-1">trending_down</span>
            {product.priceDrop}
          </div>
        )}
      </div>

      {/* Availability bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-600 dark:text-gray-400">Availability</span>
          <span className="font-bold text-gray-900 dark:text-white">
            {product.availableTons} Tons Left
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
          <div
            className="bg-primary h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${availabilityPct}%` }}
          />
        </div>
        <p className="text-xs text-gray-400 mt-1">
          Min. Order: {product.minOrderTons} Tons
        </p>
      </div>

      {/* Order form */}
      <div className="space-y-4 mb-6">
        {/* Quantity */}
        <div>
          <label
            htmlFor="quantity"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Quantity (Tons)
          </label>
          <div className="relative rounded-md shadow-sm">
            <input
              id="quantity"
              type="number"
              min={product.minOrderTons}
              max={product.availableTons}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(product.minOrderTons, Number(e.target.value)))}
              className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white pr-16 focus:border-primary focus:ring-primary outline-none sm:text-sm py-3 font-semibold pl-4"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <span className="text-gray-500 sm:text-sm font-medium">TONS</span>
            </div>
          </div>
        </div>

        {/* Logistics estimator */}
        <div className="bg-background-light dark:bg-background-dark p-3 rounded-lg border border-neutral-border dark:border-neutral-border-dark">
          <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <span className="material-icons text-gray-400">local_shipping</span>
            <span>
              Est. Delivery to{" "}
              <button
                type="button"
                className="font-bold border-b border-dashed border-gray-400 cursor-pointer hover:border-primary hover:text-primary transition-colors"
                onClick={() => {
                  const city = prompt("Enter delivery city:", deliveryCity);
                  if (city) setDeliveryCity(city);
                }}
              >
                {deliveryCity}
              </button>
            </span>
          </div>
          <div className="mt-2 text-xs text-gray-500 flex justify-between">
            <span>Shipping Cost:</span>
            <span className="font-medium text-gray-900 dark:text-white">
              ~${product.estimatedShipping.toFixed(2)}
            </span>
          </div>
          <div className="mt-1 text-xs text-gray-500 flex justify-between">
            <span>Subtotal ({quantity} tons):</span>
            <span className="font-medium text-gray-900 dark:text-white">
              ~${subtotal.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* CTA buttons */}
      <div className="space-y-3">
        <button
          type="button"
          onClick={() => onBuyNow(quantity)}
          className="w-full bg-primary hover:bg-primary-dark text-black font-bold py-3.5 px-4 rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 flex justify-center items-center gap-2"
        >
          <span>Buy Now</span>
          <span className="material-icons text-sm">arrow_forward</span>
        </button>
        <button
          type="button"
          onClick={() => onAddToCart(quantity)}
          className="w-full bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-900 dark:text-white font-semibold py-3.5 px-4 rounded-lg border border-gray-300 dark:border-gray-600 transition-colors flex justify-center items-center gap-2"
        >
          <span className="material-icons text-sm">add_shopping_cart</span>
          <span>Add to Cart</span>
        </button>
      </div>

      <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
        <span className="material-icons text-sm text-green-600">shield</span>
        <span>Secure Payment via Ministry Escrow</span>
      </div>
    </div>
  );
}