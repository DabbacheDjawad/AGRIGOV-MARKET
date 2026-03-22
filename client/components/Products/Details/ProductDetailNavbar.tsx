"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const navLinks = [
  { label: "Market", href: "#", active: true },
  { label: "Logistics", href: "#" },
  { label: "Farmers", href: "#" },
  { label: "Analysis", href: "#" },
];

export default function ProductDetailNavbar() {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-neutral-surface/90 dark:bg-neutral-surface-dark/90 backdrop-blur-md border-b border-neutral-border dark:border-neutral-border-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-primary flex items-center justify-center">
              <span className="material-icons text-background-dark">agriculture</span>
            </div>
            <span className="font-bold text-lg tracking-tight text-gray-900 dark:text-white">
              Ministry of Agriculture{" "}
              <span className="text-gray-500 font-normal ml-1">Marketplace</span>
            </span>
          </div>

          {/* Center nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`transition-colors text-sm font-medium ${
                  link.active
                    ? "text-gray-900 dark:text-white hover:text-primary"
                    : "text-gray-500 dark:text-gray-400 hover:text-primary"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              aria-label="Search"
              onClick={() => setSearchOpen((v) => !v)}
              className="p-2 text-gray-400 hover:text-primary transition-colors"
            >
              <span className="material-icons">search</span>
            </button>

            <button
              type="button"
              aria-label="Cart"
              className="relative p-2 text-gray-400 hover:text-primary transition-colors"
            >
              <span className="material-icons">shopping_cart</span>
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary" />
            </button>

            <div className="relative h-8 w-8 shrink-0 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600">
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCARgsgihUdEBOVGg-ezs7q6wDuXTf0V49tO-ff1jAv4uxsERdXAgP3VAF4uc0lOP42oxCC3XZjdLSQayHc7EVaCSc_8cX_pbv-Hj1JVLj7PDQ-pHgA8lEj4a6ZZHEYF0q4t8_YKQ4-HIOJjcUzoPqE6cwx_vEI5dQTrDkZK1BIhE5KJwlqHC8lY0fE7i-SY87sC85_CBxm7-_DVgfOiJ42rBsBtDYIiqVJwOoh3C_5VE2i74Wrrl3jJHeAbzHNpLuiF7yFs3MWTnsj"
                alt="User profile"
                fill
                className="object-cover"
                sizes="32px"
              />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}