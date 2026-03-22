import type { UserRole, RoleOption } from "@/types/Auth";

interface Props {
  options: RoleOption[];
  selected: UserRole;
  onChange: (role: UserRole) => void;
}

export default function RoleSelector({ options, selected, onChange }: Props) {
  return (
    <div className="mb-8">
      <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 ml-1">
        Select your role
      </label>
      <div className="grid grid-cols-4 gap-2 p-1 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700">
        {options.map((option) => {
          const isActive = selected === option.id;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onChange(option.id)}
              className={`flex flex-col items-center justify-center py-3 px-1 rounded-lg transition-all group ${
                isActive
                  ? "bg-white dark:bg-slate-700 shadow-sm border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-white"
                  : "border border-transparent text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 hover:shadow-sm hover:border-slate-200 dark:hover:border-slate-600 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
              aria-pressed={isActive}
            >
              <span
                className={`material-icons mb-1 text-xl group-hover:scale-110 transition-transform ${
                  isActive ? "text-primary" : ""
                }`}
              >
                {option.icon}
              </span>
              <span
                className={`text-[10px] leading-none ${
                  isActive ? "font-bold" : "font-medium"
                }`}
              >
                {option.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}