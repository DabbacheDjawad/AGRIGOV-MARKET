"use client";

import Link from "next/link";
import Image from "next/image";

const navLinks = [
  { href: "#", label: "Marketplace Catalog", active: true },
  { href: "#", label: "Order History", active: false },
  { href: "#", label: "Track Deliveries", active: false },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-neutral-surface-dark border-b border-neutral-200 dark:border-neutral-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="shrink-0 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="material-icons text-neutral-900 text-xl">agriculture</span>
              </div>
              <span className="hidden md:block font-bold text-lg text-neutral-900 dark:text-white">
                AgriConnect{" "}
                <span className="text-xs font-normal text-neutral-500 uppercase tracking-wide ml-1">
                  National Platform
                </span>
              </span>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 transition-colors ${
                  link.active
                    ? "border-primary text-neutral-900 dark:text-white"
                    : "border-transparent text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 hover:border-neutral-300"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-full text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 focus:outline-none relative">
              <span className="material-icons">notifications</span>
              <span className="absolute top-2 right-2 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-neutral-900" />
            </button>

            <div className="flex items-center gap-2 border-l border-neutral-200 dark:border-neutral-700 pl-4">
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBU6Qha3B9OrxI5XaK5vbdUGjLTPHw_4Cpf-O4-Ygth7QlQmN2NaYtoQ15_Tn6WoB5ikhJR16FAMoTUx42A26dGEvJcPbZhkU0a1NXWv5Z5NzsEwvlzuEXl1GDcEl6KH9ziTmO6Z31ZGa8F8OKtGJeiyS4osX5YeWb1HoG5DhQepucr8Duo2ROWrJ29qjFpzwCAgreyvGF6Tr1cH90R9eepXubzC7FKmSJt2tOhiO7fFFCZJKv00JL6FD9ggtcecWQchW3uJmEWJAAM"
                alt="Profile Avatar"
                width={32}
                height={32}
                className="h-8 w-8 rounded-full object-cover ring-2 ring-primary/20"
              />
              <div className="hidden lg:flex flex-col">
                <span className="text-sm font-medium text-neutral-900 dark:text-white">
                  Wholesale Foods Ltd.
                </span>
                <span className="text-xs text-neutral-500 dark:text-neutral-400">
                  Buyer Account
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}