"use client";

import Image from "next/image";
import { useState } from "react";
import type { WeatherZone } from "../../types/Weather";
import { ZONES, USER_AVATAR_URL } from "../../types/Weather";

interface Props {
  activeZoneId: string;
  onZoneChange: (id: string) => void;
}

export default function WeatherNavbar({ activeZoneId, onZoneChange }: Props) {
  return (
    <nav className="sticky top-0 z-50  dark:bg-background-dark/95 backdrop-blur border-b border-gray-200 dark:border-primary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-primary flex items-center justify-center">
              <span className="material-icons text-background-dark">agriculture</span>
            </div>
            <span className="text-xl font-bold tracking-tight">
              AgriMinistry{" "}
              <span className="text-primary font-normal">/ Weather Intel</span>
            </span>
          </div>

          {/* Zone selector */}
          <div className="hidden md:flex items-center bg-gray-100 dark:bg-surface-dark rounded-lg px-3 py-1.5 border border-transparent focus-within:border-primary transition-colors">
            <span className="material-icons text-gray-500 dark:text-gray-400 text-sm">location_on</span>
            <select
              value={activeZoneId}
              onChange={(e) => onZoneChange(e.target.value)}
              className="bg-transparent border-none text-sm focus:ring-0 text-gray-700 dark:text-gray-200 w-48 font-medium outline-none"
            >
              {ZONES.map((z) => (
                <option key={z.id} value={z.id}>{z.label}</option>
              ))}
            </select>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              aria-label="Notifications"
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-primary/10 transition-colors relative"
            >
              <span className="material-icons text-gray-600 dark:text-gray-300">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            </button>
            <div className="relative h-8 w-8 rounded-full bg-primary/20 border border-primary overflow-hidden shrink-0">
              <Image
                src={USER_AVATAR_URL}
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