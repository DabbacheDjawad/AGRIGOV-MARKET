"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { profileApi } from "@/lib/api";

interface NavItem {
  href: string;
  label: string;
  icon: string;
}

export default function MobileSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [userName, setUserName] = useState("Driver");
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await profileApi.me();
        const user = data.data?.user;
        if (user) {
          setUserName(user.username || user.email?.split('@')[0] || "Driver");
          setUserEmail(user.email || "");
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("role");
    router.push("/Login");
    setIsOpen(false);
  };

  const navItems: NavItem[] = [
    { href: "/Transporter/dashboard", label: "Dashboard", icon: "dashboard" },
    { href: "/Transporter/dashboard/missions", label: "Missions", icon: "local_shipping" },
  ];

  const isActive = (href: string) => {
    if (href === "/Transporter/dashboard" && pathname === "/Transporter/dashboard") return true;
    if (href === "/Transporter/dashboard/missions" && pathname === "/Transporter/dashboard/missions") return true;
    return false;
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 w-10 h-10 rounded-full bg-primary text-black flex items-center justify-center shadow-lg"
        aria-label="Open menu"
      >
        <span className="material-symbols-outlined">menu</span>
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-80 bg-white dark:bg-slate-900 z-50 shadow-xl transform transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="p-4 border-b border-primary/20 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-black">local_shipping</span>
            </div>
            <div>
              <h2 className="font-bold text-lg">Transporter Hub</h2>
              <p className="text-xs text-primary">Logistics Management</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-primary/10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-2xl">person</span>
            </div>
            <div>
              <p className="font-semibold">{loading ? "Loading..." : userName}</p>
              <p className="text-xs text-slate-500">{loading ? "..." : userEmail}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive(item.href)
                  ? "bg-primary/20 text-primary font-semibold"
                  : "text-slate-600 dark:text-slate-400 hover:bg-primary/10"
              }`}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-primary/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined">logout</span>
            Logout
          </button>
        </div>
      </div>
    </>
  );
}