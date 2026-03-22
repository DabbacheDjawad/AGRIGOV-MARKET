import Link from "next/link";
import { platformActions } from "../../types/Weather";

export default function PlatformActionsCard() {
  return (
    <div className="bg-white dark:bg-surface-dark rounded-xl p-6 border border-gray-200 dark:border-primary/20">
      <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">Platform Actions</h3>
      <div className="space-y-3">
        {platformActions.map((action) => (
          <Link
            key={action.id}
            href={action.href}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-background-light dark:hover:bg-background-dark transition-colors group"
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors shrink-0 ${action.iconBg} ${action.iconColor} ${action.iconHoverBg} ${action.iconHoverText}`}
            >
              <span className="material-icons">{action.icon}</span>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-gray-900 dark:text-white text-sm">{action.title}</h4>
              <p className="text-xs text-gray-400">{action.subtitle}</p>
            </div>
            <span className="material-icons text-gray-600 text-sm ml-auto shrink-0">
              chevron_right
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}