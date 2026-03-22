type Step = { label: string; state: "done" | "active" | "upcoming" };

const steps: Step[] = [
  { label: "Cart", state: "done" },
  { label: "Checkout", state: "active" },
  { label: "Confirmation", state: "upcoming" },
];

export default function CheckoutStepper() {
  return (
    <div className="hidden md:flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
      {steps.map((step, i) => (
        <span key={step.label} className="flex items-center gap-2">
          {i > 0 && <span className="h-px w-8 bg-gray-300 dark:bg-gray-600" />}
          <span
            className={`flex items-center gap-1.5 font-medium ${
              step.state === "active"
                ? "text-primary font-bold"
                : step.state === "done"
                ? "text-primary"
                : ""
            }`}
          >
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0 ${
                step.state === "active"
                  ? "bg-black dark:bg-white text-primary dark:text-black border-2 border-primary"
                  : step.state === "done"
                  ? "bg-primary text-black"
                  : "border border-gray-300 dark:border-gray-600"
              }`}
            >
              {i + 1}
            </span>
            {step.label}
          </span>
        </span>
      ))}
    </div>
  );
}