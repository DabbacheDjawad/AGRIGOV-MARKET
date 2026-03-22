"use client";

import Image from "next/image";
import { useState } from "react";
import type { GalleryImage } from "@/types/ProductDetails";

interface Props {
  images: GalleryImage[];
  gradeLabel: string;
}

export default function ProductGallery({ images, gradeLabel }: Props) {
  const [activeIdx, setActiveIdx] = useState(0);
  const active = images[activeIdx];

  return (
    <div className="bg-neutral-surface dark:bg-neutral-surface-dark rounded-xl p-1 shadow-sm border border-neutral-border dark:border-neutral-border-dark">
      {/* Main image */}
      <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800 mb-4 group">
        <span className="absolute top-4 left-4 z-10 bg-primary text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
          {gradeLabel}
        </span>
        <Image
          key={active.id}
          src={active.src}
          alt={active.alt}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 1024px) 100vw, 66vw"
          priority
        />
      </div>

      {/* Thumbnails */}
      <div className="grid grid-cols-5 gap-2 px-3 pb-3">
        {images.slice(0, 4).map((img, i) => (
          <button
            key={img.id}
            type="button"
            onClick={() => setActiveIdx(i)}
            aria-label={`View image ${i + 1}`}
            className={`relative aspect-square rounded-lg overflow-hidden transition-opacity ${
              activeIdx === i
                ? "ring-2 ring-primary ring-offset-2 ring-offset-neutral-surface dark:ring-offset-neutral-surface-dark"
                : "hover:opacity-80"
            }`}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              className="object-cover"
              sizes="80px"
            />
          </button>
        ))}
        {/* Video placeholder */}
        <button
          type="button"
          aria-label="Play video"
          className="relative aspect-square rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <span className="material-icons">play_circle</span>
        </button>
      </div>
    </div>
  );
}