"use client";

import Image from "next/image";
import type { CartItem } from "@/types/Cart";

interface Props {
  item: CartItem;
  onQuantityChange: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
}

export default function CartItemRow({ item, onQuantityChange, onRemove }: Props) {
  const subtotal = (item.pricePerUnit * item.quantity).toLocaleString("en-NG");

  const handleDecrement = () =>
    onQuantityChange(item.id, Math.max(0, item.quantity - 1));
  const handleIncrement = () => onQuantityChange(item.id, item.quantity + 1);
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val) && val >= 0) onQuantityChange(item.id, val);
  };

  return (
    <div className="p-6 border-b border-gray-100 dark:border-green-900/20 last:border-0 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
      <div className="sm:grid sm:grid-cols-12 sm:gap-x-6 items-center">

        {/* Product info */}
        <div className="sm:col-span-6 flex items-start">
          <div className="shrink-0 w-24 h-24 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 relative">
            <Image
              src={item.imageUrl}
              alt={item.imageAlt}
              fill
              className="object-cover object-center"
              sizes="96px"
            />
          </div>
          <div className="ml-4 flex-1">
            <h3 className="text-base font-medium text-gray-900 dark:text-white">
              <a href="#">{item.name}</a>
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{item.description}</p>
            <div className="mt-2 flex items-center text-sm text-primary-dark dark:text-primary font-medium">
              <span className="material-icons text-base mr-1">{item.supplierIcon}</span>
              <a className="hover:underline" href="#">{item.supplierName}</a>
            </div>
            <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">Location: {item.location}</p>
            {/* Mobile remove */}
            <button
              onClick={() => onRemove(item.id)}
              className="mt-2 text-sm text-red-500 hover:text-red-700 font-medium flex items-center sm:hidden"
              type="button"
            >
              <span className="material-icons text-base mr-1">delete</span> Remove
            </button>
          </div>
        </div>

        {/* Quantity */}
        <div className="mt-4 sm:mt-0 sm:col-span-3 flex flex-col items-center justify-center">
          <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
            <button
              onClick={handleDecrement}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              type="button"
              aria-label="Decrease quantity"
            >
              <span className="material-icons text-sm">remove</span>
            </button>
            <input
              type="number"
              value={item.quantity}
              onChange={handleInput}
              className="w-16 text-center border-none bg-transparent p-0 text-gray-900 dark:text-white focus:ring-0 text-sm font-medium [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              min={0}
            />
            <button
              onClick={handleIncrement}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              type="button"
              aria-label="Increase quantity"
            >
              <span className="material-icons text-sm">add</span>
            </button>
          </div>
          <span className="text-xs text-gray-500 mt-1">Unit: {item.unitLabel}</span>
          <span className="text-xs font-medium text-gray-900 dark:text-gray-200 mt-1">
            {item.priceLabel}
          </span>
        </div>

        {/* Subtotal + desktop remove */}
        <div className="mt-4 sm:mt-0 sm:col-span-3 flex sm:flex-col items-center sm:items-end justify-between sm:justify-center">
          <p className="text-lg font-bold text-gray-900 dark:text-white">₦{subtotal}</p>
          <div className="flex items-center gap-3 mt-0 sm:mt-2">
            <button
              onClick={() => onRemove(item.id)}
              className="hidden sm:inline-flex text-gray-400 hover:text-red-500 transition-colors"
              title="Remove item"
              type="button"
              aria-label="Remove item"
            >
              <span className="material-icons">delete_outline</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}