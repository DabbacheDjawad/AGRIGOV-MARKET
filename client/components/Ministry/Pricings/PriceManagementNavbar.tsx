"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

const navLinks = [
  { label: "Price Management", href: "#", active: true },
  { label: "Regional Reports", href: "#" },
  { label: "Officials", href: "#" },
];

export default function PriceManagementNavbar() {
  const [now, setNow] = useState("");

  useEffect(() => {
    const fmt = () =>
      setNow(
        new Date().toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    fmt();
    const id = setInterval(fmt, 60_000);
    return () => clearInterval(id);
  }, []);

  return (
    <nav className="sticky top-0 z-30 bg-surface-light dark:bg-surface-dark border-b border-border-light dark:border-border-dark shadow-sm">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo + nav */}
          <div className="flex items-center gap-4">
            <div className="shrink-0 flex items-center gap-2">
              <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center text-background-dark font-bold">
                <span className="material-icons">agriculture</span>
              </div>
              <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">
                AgriControl
              </span>
            </div>

            <div className="hidden md:flex ml-10 space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`px-1 pt-1 text-sm font-medium border-b-2 transition-colors ${
                    link.active
                      ? "border-primary text-slate-900 dark:text-white"
                      : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Right: session clock, notifications, avatar */}
          <div className="flex items-center gap-4">
            {now && (
              <div className="hidden lg:flex flex-col items-end text-right mr-4">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Current Session
                </span>
                <span className="text-sm font-semibold">{now}</span>
              </div>
            )}

            <button
              type="button"
              className="p-1 rounded-full text-slate-400 hover:text-slate-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              aria-label="Notifications"
            >
              <span className="material-icons">notifications</span>
            </button>

            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary-dark dark:text-primary font-bold border border-primary/30 text-sm">
              JD
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}