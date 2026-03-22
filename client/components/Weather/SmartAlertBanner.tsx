"use client";

import { useState } from "react";
import type { SmartAlert } from "../../types/Weather";

const severityStyles = {
  danger: {
    wrapper: "bg-red-500/10 border-red-500/30 shadow-red-900/10",
    icon: "bg-red-500/20 text-red-500",
    title: "text-red-500 dark:text-red-400",
  },
  warning: {
    wrapper: "bg-yellow-500/10 border-yellow-500/30 shadow-yellow-900/10",
    icon: "bg-yellow-500/20 text-yellow-500",
    title: "text-yellow-500 dark:text-yellow-400",
  },
  info: {
    wrapper: "bg-blue-500/10 border-blue-500/30 shadow-blue-900/10",
    icon: "bg-blue-500/20 text-blue-500",
    title: "text-blue-500 dark:text-blue-400",
  },
};

interface Props {
  alert: SmartAlert;
}

export default function SmartAlertBanner({ alert }: Props) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  const s = severityStyles[alert.severity];

  return (
    <div className={`border rounded-xl p-4 flex items-start gap-4 shadow-lg ${s.wrapper}`}>
      <div className={`p-2 rounded-lg shrink-0 ${s.icon}`}>
        <span className="material-icons">warning</span>
      </div>
      <div className="grow">
        <h3 className={`font-bold text-lg ${s.title}`}>{alert.title}</h3>
        <p className="text-gray-700 dark:text-gray-300 text-sm mt-1 max-w-3xl">{alert.message}</p>
      </div>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        aria-label="Dismiss alert"
        className="text-gray-500 hover:text-white transition-colors shrink-0"
      >
        <span className="material-icons">close</span>
      </button>
    </div>
  );
}