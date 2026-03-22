export default function PricingGuidelinesCard() {
  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-100 dark:border-blue-900/30">
      <div className="flex gap-3">
        <span className="material-icons text-blue-600 dark:text-blue-400 shrink-0">info</span>
        <div>
          <h4 className="text-sm font-bold text-blue-800 dark:text-blue-300">
            Pricing Policy Guidelines
          </h4>
          <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">
            Updates exceeding 10% require supervisory approval. Please reference the weekly
            agricultural index report before making changes.
          </p>
        </div>
      </div>
    </div>
  );
}