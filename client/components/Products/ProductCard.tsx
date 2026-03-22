"use client";

import { useState } from "react";
import Image from "next/image";
import type { Product } from "@/types/Product";

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const [liked, setLiked] = useState(false);

  return (
    <div className="group bg-white dark:bg-neutral-surface-dark rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-neutral-100 dark:border-neutral-800 overflow-hidden flex flex-col">
      {/* Image */}
      <div className="relative h-48 w-full overflow-hidden bg-neutral-200">
        <Image
          src={product.imageUrl}
          alt={product.imageAlt}
          fill
          className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
        />
        {/* Grade Badge */}
        <div className="absolute top-3 left-3 bg-white/90 dark:bg-black/80 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-neutral-900 dark:text-white flex items-center gap-1 shadow-sm">
          <span className={`w-2 h-2 rounded-full ${product.gradeColor}`} />
          {product.grade}
        </div>
        {/* Favourite */}
        <button
          onClick={() => setLiked((v) => !v)}
          aria-label={liked ? "Remove from favourites" : "Add to favourites"}
          className="absolute top-3 right-3 p-2 bg-white/90 dark:bg-black/50 backdrop-blur-sm rounded-full transition-colors shadow-sm"
        >
          <span
            className={`material-icons text-lg ${
              liked ? "text-red-500" : "text-neutral-400 hover:text-red-500"
            }`}
          >
            {liked ? "favorite" : "favorite_border"}
          </span>
        </button>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-1">
          <span className="text-xs font-medium text-primary-dark uppercase tracking-wider">
            {product.category}
          </span>
          <span className="text-xs text-neutral-500 flex items-center gap-1">
            <span className="material-icons text-xs">schedule</span>
            {product.postedAt}
          </span>
        </div>

        <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-1">
          {product.name}
        </h3>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-3 line-clamp-2">
          {product.description}
        </p>

        <div className="mt-auto">
          {/* Location */}
          <div className="flex items-center gap-2 mb-4 pt-3 border-t border-neutral-100 dark:border-neutral-800">
            <span className="material-icons text-neutral-400 text-sm">location_on</span>
            <span className="text-sm text-neutral-600 dark:text-neutral-300 truncate">
              {product.location}
            </span>
            {product.verified && (
              <span className="ml-auto flex items-center text-xs text-green-600 bg-green-50 dark:bg-green-900/30 dark:text-green-400 px-1.5 py-0.5 rounded">
                <span className="material-icons text-xs mr-1">verified</span>
                Verified
              </span>
            )}
          </div>

          {/* Price + CTA */}
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs text-neutral-500">Price per unit</p>
              <p className="text-xl font-bold text-neutral-900 dark:text-white">
                ${product.price.toFixed(2)}{" "}
                <span className="text-sm font-normal text-neutral-500">
                  / {product.priceUnit}
                </span>
              </p>
            </div>
            <button className="bg-primary hover:bg-primary-dark text-neutral-900 font-bold py-2 px-4 rounded-lg shadow-sm hover:shadow transition-all text-sm flex items-center gap-2 whitespace-nowrap">
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}