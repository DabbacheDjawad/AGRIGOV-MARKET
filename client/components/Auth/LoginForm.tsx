"use client";

import { useState } from "react";
import Link from "next/link";
import RoleSelector from "./RoleSelector";
import { roleOptions } from "@/types/Auth";
import type { UserRole } from "@/types/Auth";

export default function LoginForm() {
  const [role, setRole] = useState<UserRole>("Farmer");
  const [identity, setIdentity] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!identity || !password) return;
    setIsLoading(true);
    // Simulate async sign-in — replace with real auth call
    await new Promise((res) => setTimeout(res, 1200));
    setIsLoading(false);
  };

  const inputClass =
    "block w-full py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg leading-5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm transition duration-150 ease-in-out";

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 p-8 relative overflow-hidden">
        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-primary to-green-600" />

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-primary/10 mb-4 text-green-700 dark:text-primary">
            <span className="material-icons text-4xl">agriculture</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Welcome Back</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">
            Sign in to access your dashboard
          </p>
        </div>

        {/* Role selector */}
        <RoleSelector options={roleOptions} selected={role} onChange={setRole} />

        {/* Form */}
        <div className="space-y-5">
          {/* Identity */}
          <div>
            <label
              htmlFor="identity"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
            >
              Email or Phone Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="material-icons text-slate-400 text-xl">person_outline</span>
              </div>
              <input
                id="identity"
                type="text"
                value={identity}
                onChange={(e) => setIdentity(e.target.value)}
                placeholder="e.g. farmer@agri.gov or +1234567890"
                className={`${inputClass} pl-10 pr-3`}
                autoComplete="username"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Password
              </label>
              <Link
                href="#"
                className="text-sm font-medium text-green-700 dark:text-primary hover:text-green-800 dark:hover:text-green-400 transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="material-icons text-slate-400 text-xl">lock_outline</span>
              </div>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your secure password"
                className={`${inputClass} pl-10 pr-10`}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <span className="material-icons text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xl transition-colors">
                  {showPassword ? "visibility" : "visibility_off"}
                </span>
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading || !identity || !password}
            className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-black bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <span className="material-icons animate-spin text-lg">autorenew</span>
                Signing In…
              </>
            ) : (
              "Secure Sign In"
            )}
          </button>
        </div>

        {/* Divider */}
        <div className="relative mt-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200 dark:border-slate-700" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-slate-900 text-slate-500">
              First time here?
            </span>
          </div>
        </div>

        {/* Register link */}
        <div className="mt-6 text-center">
          <Link
            href="#"
            className="inline-flex items-center justify-center px-4 py-2 border border-slate-300 dark:border-slate-600 shadow-sm text-sm font-medium rounded-lg text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 w-full transition-colors"
          >
            <span className="material-icons text-primary mr-2 text-lg">app_registration</span>
            Register New Account
          </Link>
        </div>

        {/* Trust badge */}
        <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center space-x-2 opacity-60 hover:opacity-100 transition-opacity">
          <span className="material-icons text-slate-400 text-sm">verified_user</span>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Secured by Ministry of Agriculture IT
          </span>
        </div>
      </div>

      {/* Mobile footer */}
      <p className="lg:hidden text-center text-xs text-slate-400 mt-6">
        © {new Date().getFullYear()} National Agricultural Platform. All rights reserved.
      </p>
    </div>
  );
}