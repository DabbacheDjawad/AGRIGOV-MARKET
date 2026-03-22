import Image from "next/image";
import type { Stat } from "@/types/Home";

interface Props {
  stats: Stat[];
}

export default function NationalCoverageSection({ stats }: Props) {
  return (
    <section className="py-20 bg-background-light dark:bg-background-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 rounded-2xl overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Stats */}
            <div className="p-10 lg:p-16 flex flex-col justify-center relative z-10">
              <h2 className="text-3xl font-bold text-white mb-8">National Coverage</h2>
              <div className="space-y-6">
                {stats.map((stat) => (
                  <div key={stat.id} className="flex items-start">
                    <div className="shrink-0 h-12 w-12 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/40">
                      <span className="material-icons text-primary">{stat.icon}</span>
                    </div>
                    <div className="ml-4">
                      <p className="text-4xl font-bold text-white">{stat.value}</p>
                      <p className="text-slate-400 text-sm uppercase tracking-wide">{stat.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Map */}
            <div className="relative min-h-100">
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDZIbhulA9h1ivyujTZn0Yz4MgoA5nL90F0PKDvyQkkSybMsSEKSRJPyHdHWTFvYzFMNHGMDLwspNex8ahhKOdvQ52NgJo76fra77qIvzqiWywOlOmzpkL_JZJ__44B1dTTpIDx8cP_Cnkoow40FryRhJm6MKZRw_is74LLepBccD4GOSYKAEp3YNqTzliNOIaPamx8u4NguTBFUNjZGlmAQSLFy1KgWcD64Xr6HV6yFBqZk05sFyo4ts6WyPmHXrIoc5fxtdJPk8mH"
                alt="National map visualization"
                fill
                className="object-cover mix-blend-overlay opacity-50"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-linear-to-r from-slate-900 to-transparent" />

              {/* Animated map pins */}
              {[
                { top: "25%", left: "25%" },
                { top: "50%", left: "50%" },
                { top: "66%", left: "66%" },
              ].map((pos, i) => (
                <span key={i} className="absolute" style={{ top: pos.top, left: pos.left }}>
                  <span
                    className="absolute h-3 w-3 bg-primary rounded-full animate-ping"
                    style={{ animationDelay: `${i * 150}ms` }}
                  />
                  <span className="relative block h-3 w-3 bg-primary rounded-full" />
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}