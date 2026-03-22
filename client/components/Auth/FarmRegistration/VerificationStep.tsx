export default function VerificationStep() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Verify Your Identity
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          A Ministry agent will review your submitted documents and verify your account within
          2–3 business days.
        </p>
      </div>

      <div className="rounded-xl border border-primary/20 bg-primary/5 dark:bg-primary/5 p-8 flex flex-col items-center text-center gap-4">
        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
          <span className="material-icons text-3xl text-primary-dark dark:text-primary">
            how_to_reg
          </span>
        </div>
        <div>
          <p className="font-semibold text-gray-900 dark:text-white">
            Documents submitted successfully!
          </p>
          <p className="text-sm text-gray-500 mt-1">
            You will receive an email confirmation once verification is complete.
          </p>
        </div>
      </div>

      <ul className="space-y-3">
        {[
          { icon: "email", label: "Check your registered email for a confirmation link." },
          { icon: "schedule", label: "Verification takes 2–3 business days." },
          { icon: "support_agent", label: "Contact support if you need expedited review." },
        ].map((item) => (
          <li key={item.icon} className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400">
            <span className="material-icons text-primary-dark dark:text-primary text-base mt-0.5">
              {item.icon}
            </span>
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  );
}