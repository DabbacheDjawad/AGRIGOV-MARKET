// app/(root)/Transporter/layout.tsx
"use client";

import { useState } from "react";
import TransporterNavSidebar from "@/components/Transporter/TransporterNavSidebar";
import MobileSidebar from "@/components/Transporter/MobileSidebar";
import { usePathname } from "next/navigation";

export default function TransporterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="bg-background-light dark:bg-background-dark h-screen flex overflow-hidden">
      {/* Desktop Sidebar - hidden on mobile */}
      <div className="hidden md:block">
        <TransporterNavSidebar />
      </div>

      {/* Mobile Sidebar - shown on mobile */}
      <MobileSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}