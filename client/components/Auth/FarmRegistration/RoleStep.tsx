import type { UserRole } from "@/types/FarmRegistration";
import { ROLE_ICONS } from "@/types/FarmRegistration";

const ALL_ROLES: UserRole[] = ["Farmer", "Buyer", "Logistics", "Ministry"];

const roleDescriptions: Record<UserRole, string> = {
  Farmer: "Register your farm and sell produce directly.",
  Buyer: "Purchase agricultural products at fair prices.",
  Logistics: "Provide transport for agricultural goods.",
  Ministry: "Official government administrative access.",
};

interface Props {
  selected: UserRole;
  onSelect: (role: UserRole) => void;
}

export default function RoleStep({ selected, onSelect }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Select Your Role
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Choose the account type that best describes your role on the platform.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {ALL_ROLES.map((role) => {
          const isActive = selected === role;
          return (
            <button
              key={role}
              type="button"
              onClick={() => onSelect(role)}
              aria-pressed={isActive}
              className={`flex items-start gap-4 p-4 rounded-xl border-2 text-left transition-all ${
                isActive
                  ? "border-primary bg-primary/10 dark:bg-primary/5"
                  : "border-gray-200 dark:border-white/10 hover:border-primary/50 hover:bg-primary/5"
              }`}
            >
              <div
                className={`mt-0.5 shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
                  isActive
                    ? "bg-primary text-black"
                    : "bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400"
                }`}
              >
                <span className="material-icons">{ROLE_ICONS[role]}</span>
              </div>
              <div>
                <p
                  className={`font-semibold text-sm ${
                    isActive
                      ? "text-primary-dark dark:text-primary"
                      : "text-gray-900 dark:text-white"
                  }`}
                >
                  {role}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {roleDescriptions[role]}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}