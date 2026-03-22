"use client";

import Image from "next/image";
import Link from "next/link";

const navLinks = [
  { label: "Dashboard", href: "#" },
  { label: "Marketplace", href: "#" },
  { label: "Orders", href: "#", active: true },
  { label: "Logistics", href: "#" },
];

export default function OrdersNavbar() {
  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo + nav links */}
          <div className="flex">
            <div className="shrink-0 flex items-center gap-2">
              <div className="h-8 w-8 bg-primary rounded flex items-center justify-center font-bold">
                <span className="material-icons text-background-dark text-xl">agriculture</span>
              </div>
              <span className="hidden md:block font-bold text-lg tracking-tight text-gray-900 dark:text-white">
                AgriConnect{" "}
                <span className="text-xs font-normal text-gray-500 uppercase tracking-wide ml-1">
                  Ministry of Agriculture
                </span>
              </span>
            </div>

            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${
                    link.active
                      ? "border-primary text-gray-900 dark:text-white"
                      : "border-transparent text-gray-500 hover:border-primary hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Right: notifications + profile */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              aria-label="View notifications"
            >
              <span className="material-icons">notifications</span>
            </button>

            <div className="flex items-center gap-2">
              <div className="relative h-8 w-8 shrink-0">
                <Image
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAdTjbrWsNrBHJ619e-d8xhsRqnSBsqb-ua5sEa9D_4jTe2DBDteIh2Q1fs80E35VUHKraodIk_FVUYIjOP4Mtjr-2o-DL7Fd0BEMJbEuOWOXaSivzUlyWAlEm1mcXnFNagtLizdWyVKqlcFKYmcW9ZMT2gkOENt4Csz42zUAox3ttu3HN_GjHU-lQVuCc_al98OihJyIIx05uBHwYskzpBA7Z5cnBqsmW3z3D0Uq06poMnOyEyB3EuE23pDhMNrN-reYw_aPMtJprG"
                  alt="Green Valley Co-op profile"
                  fill
                  className="rounded-full object-cover bg-gray-300"
                  sizes="32px"
                />
              </div>
              <div className="hidden md:block text-sm">
                <p className="font-medium text-gray-700 dark:text-gray-200">Green Valley Co-op</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Buyer Account</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}