"use client";

import { useState } from "react";

interface Props {
  onMobileMenuToggle: () => void;
}

export default function AdminHeader({ onMobileMenuToggle }: Props) {
  const [search, setSearch] = useState("");

  return (
    <header className="bg-white dark:bg-[#1a331a] h-16 shadow-sm border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 z-10 shrink-0">
      {/* Mobile logo + menu */}
      <div className="flex items-center md:hidden">
        <button
          type="button"
          onClick={onMobileMenuToggle}
          className="text-slate-500 hover:text-primary transition-colors"
          aria-label="Toggle menu"
        >
          <span className="material-icons">menu</span>
        </button>
        <span className="ml-3 font-bold text-lg dark:text-white">AgriMinistry</span>
      </div>

      {/* Search — desktop */}
      <div className="hidden md:flex items-center max-w-md w-full bg-slate-100 dark:bg-background-dark rounded-lg px-3 py-2 border border-transparent focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/50 transition-all">
        <span className="material-icons text-slate-400 text-xl">search</span>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search regions, crops, or IDs..."
          className="bg-transparent border-none focus:ring-0 outline-none text-sm w-full text-slate-700 dark:text-slate-200 placeholder-slate-400 ml-2"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-2">
        <button
          type="button"
          className="relative p-2 text-slate-500 hover:text-primary transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Notifications"
        >
          <span className="material-icons">notifications</span>
          <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full border border-white dark:border-background-dark" />
        </button>
        <button
          type="button"
          className="p-2 text-slate-500 hover:text-primary transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Help"
        >
          <span className="material-icons">help_outline</span>
        </button>
      </div>
    </header>
  );
}