type StepState = "done" | "active" | "upcoming";
interface Step { label: string; state: StepState }

const steps: Step[] = [
  { label: "Cart",         state: "done"     },
  { label: "Checkout",     state: "active"   },
  { label: "Confirmation", state: "upcoming" },
];

export default function CheckoutStepper() {
  return (
    <div className="hidden md:flex items-center gap-2 text-sm">
      {steps.map((step, i) => (
        <span key={step.label} className="flex items-center gap-2">
          {i > 0 && <span className="h-px w-8 bg-gray-200" />}
          <span
            className={`flex items-center gap-1.5 font-medium ${
              step.state === "active"   ? "text-primary-dark font-bold" :
              step.state === "done"     ? "text-primary-dark" :
                                         "text-gray-400"
            }`}
          >
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0 font-bold ${
                step.state === "active"   ? "bg-black text-primary border-2 border-primary" :
                step.state === "done"     ? "bg-primary text-black" :
                                           "border border-gray-300 text-gray-400"
              }`}
            >
              {step.state === "done" ? (
                <span
                  className="material-symbols-outlined text-xs"
                  style={{ fontSize: "12px", fontVariationSettings: "'FILL' 1" }}
                >
                  check
                </span>
              ) : (
                i + 1
              )}
            </span>
            {step.label}
          </span>
        </span>
      ))}
    </div>
  );
}