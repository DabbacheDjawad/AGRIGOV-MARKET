"use client";

import { useState } from "react";
import type { TransportRequest } from "@/types/Transporter";

interface Props {
  request: TransportRequest;
  onClose: () => void;
  onAccept: (req: TransportRequest) => void;
  onDecline: (req: TransportRequest) => void;
}

export default function MissionDetailOverlay({ request, onClose, onAccept, onDecline }: Props) {
  const [accepting, setAccepting] = useState(false);

  const handleAccept = async () => {
    setAccepting(true);
    await new Promise((r) => setTimeout(r, 800));
    onAccept(request);
    setAccepting(false);
  };

  const stats = [
    { label: "Weight", value: `${request.weightKg} kg`, highlight: false },
    { label: "Distance", value: `${request.distanceKm} km`, highlight: false },
    { label: "Pay", value: `$${request.pay}`, highlight: true },
    { label: "Est. Time", value: `${request.estimatedMins} min`, highlight: false },
  ];

  return (
    <div className="absolute bottom-6 left-6 right-6 md:left-auto md:w-96 bg-white dark:bg-[#1a2e1a] rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 p-5 z-20">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="font-bold text-lg">{request.cargo}</h4>
          <p className="text-sm text-slate-500">
            {request.pickup}{" "}
            <span className="mx-1">→</span>
            {request.dropoff}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
        >
          <span className="material-icons">close</span>
        </button>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-background-light dark:bg-slate-800 p-2 rounded-lg text-center"
          >
            <span className="block text-xs text-slate-500 uppercase">{s.label}</span>
            <span
              className={`font-bold ${
                s.highlight
                  ? "text-primary-dark dark:text-primary"
                  : "text-slate-800 dark:text-white"
              }`}
            >
              {s.value}
            </span>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => onDecline(request)}
          className="flex-1 py-3 bg-white border border-slate-300 dark:bg-transparent dark:border-slate-600 dark:text-slate-300 text-slate-700 font-bold rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          Decline
        </button>
        <button
          type="button"
          onClick={handleAccept}
          disabled={accepting}
          className="flex-2 py-3 bg-primary hover:bg-green-400 text-black font-bold rounded-lg shadow-lg shadow-green-500/20 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {accepting ? "Accepting…" : "Accept Mission"}
          {!accepting && (
            <span className="material-icons text-sm">check_circle</span>
          )}
        </button>
      </div>
    </div>
  );
}