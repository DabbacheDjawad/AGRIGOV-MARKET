import type { RegistrationStep } from "@/types/FarmRegistration";
import { STEPS, STEP_PROGRESS } from "@/types/FarmRegistration";

interface Props {
  currentStep: RegistrationStep;
}

export default function FormStepper({ currentStep }: Props) {
  const progressPct = STEP_PROGRESS[currentStep];

  return (
    <div className="bg-gray-50 dark:bg-white/5 px-6 py-6 border-b border-gray-100 dark:border-white/10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Create Account</h2>
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
          Step {currentStep} of {STEPS.length}
        </span>
      </div>

      {/* Progress bar */}
      <div className="overflow-hidden h-2 mb-4 rounded bg-gray-200 dark:bg-gray-700">
        <div
          className="h-full bg-primary rounded transition-all duration-500"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Step labels */}
      <div className="flex justify-between text-xs font-medium">
        {STEPS.map(({ step, label }) => {
          const done = step <= currentStep;
          return (
            <span
              key={step}
              className={done ? "text-primary-dark dark:text-primary" : "text-gray-400 dark:text-gray-500"}
            >
              {label}
            </span>
          );
        })}
      </div>
    </div>
  );
}