"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const navLinks = [
  { label: "Overview", href: "#" },
  { label: "Regional Data", href: "#", active: true },
  { label: "Market Prices", href: "#" },
  { label: "Logistics", href: "#" },
];

export default function RegionalHeader() {
  const [search, setSearch] = useState("");

  return (
    <header className="bg-surface-light border-b border-neutral-light h-16 flex items-center justify-between px-6 z-20 shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-black font-bold text-xl shadow-lg shadow-primary/20">
          <span className="material-icons">agriculture</span>
        </div>
        <div>
          <h1 className="font-bold text-lg tracking-tight leading-tight">Ministry of Agriculture</h1>
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
            National Data Portal
          </p>
        </div>
      </div>

      {/* Nav tabs */}
      <nav className="hidden md:flex items-center gap-1 bg-neutral-light/50 p-1 rounded-lg">
        {navLinks.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              link.active
                ? "bg-white text-black shadow-sm ring-1 ring-black/5"
                : "text-slate-600 hover:text-black hover:bg-white"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      {/* Right: search, notifications, avatar */}
      <div className="flex items-center gap-4">
        <div className="relative hidden lg:block">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 pointer-events-none">
            <span className="material-icons text-[20px]">search</span>
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search region, crop, or ID..."
            className="pl-10 pr-4 py-2 bg-neutral-light/50 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary focus:bg-white w-64 transition-all outline-none"
          />
        </div>

        <button
          type="button"
          className="relative p-2 text-slate-500 hover:text-black transition-colors rounded-full hover:bg-neutral-light"
          aria-label="Notifications"
        >
          <span className="material-icons">notifications</span>
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
        </button>

        <div className="h-8 w-8 rounded-full bg-slate-200 overflow-hidden border border-slate-300 relative shrink-0">
          <Image
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBsWAzkw86CFu98J-uWoswhAiy_cM6fZPPIl3mL3gaO61HyWKv4dN3SL-FHTkmBB4bwIH5EBsM-DXQV0F6MWpEOQ9zoPu9H9_t2hHRi2hHOmCr9EAjGk_ppZ2V4wruAkMACuHCTJ9-r3FkB_ad6h74EbUMBfcfauNnY50zHqTNuelA68bgBw0ZB8_rGzQTNdxV0_9XnSemTbXbRksq8exmGeHch_XLRMZHh1g47NDMjYj70dpiGRiYdBmbTdjCqR2-1X-H4m6JMyEwm"
            alt="Official portal user"
            fill
            className="object-cover"
            sizes="32px"
          />
        </div>
      </div>
    </header>
  );
}