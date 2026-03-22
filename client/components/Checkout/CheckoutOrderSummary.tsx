import Image from "next/image";
import type { OrderLineItem, CheckoutSummary } from "@/types/Checkout";

interface Props {
  items: OrderLineItem[];
  summary: CheckoutSummary;
  transportFee: number; // driven by selected transporter
  onConfirm: () => void;
}

export default function CheckoutOrderSummary({ items, summary, transportFee, onConfirm }: Props) {
  const total = summary.subtotal + transportFee + summary.vat - summary.ministrySubsidy;
  const fmt = (n: number) => `$${n.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;

  return (
    <div className="sticky top-24">
      <div className="bg-neutral-surface dark:bg-neutral-surface-dark rounded-xl shadow-lg border border-gray-100 dark:border-primary/10 overflow-hidden">
        {/* Ministry badge */}
        <div className="bg-primary/10 border-b border-primary/20 p-4 flex items-center gap-3">
          <span className="material-icons text-primary-dark dark:text-primary">verified_user</span>
          <div>
            <p className="text-xs font-bold text-primary-dark dark:text-primary uppercase tracking-wide">
              Ministry Regulated Price
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-300">
              Fair trade verified for buyers &amp; farmers.
            </p>
          </div>
        </div>

        <div className="p-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Order Summary</h2>

          {/* Product list */}
          <ul className="divide-y divide-gray-100 dark:divide-gray-700 mb-6">
            {items.map((item) => (
              <li key={item.id} className="flex py-4">
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md border border-gray-200 dark:border-gray-700 relative">
                  <Image
                    src={item.imageUrl}
                    alt={item.imageAlt}
                    fill
                    className="object-cover object-center"
                    sizes="64px"
                  />
                </div>
                <div className="ml-4 flex flex-1 flex-col justify-between">
                  <div className="flex justify-between text-base font-medium text-gray-900 dark:text-white">
                    <h3 className="text-sm font-semibold">{item.name}</h3>
                    <p className="ml-4 text-sm font-bold">{fmt(item.price)}</p>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{item.grade}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{item.quantity}</p>
                </div>
              </li>
            ))}
          </ul>

          {/* Cost breakdown */}
          <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-gray-700 text-sm">
            <div className="flex justify-between text-gray-600 dark:text-gray-400">
              <span>Subtotal</span>
              <span>{fmt(summary.subtotal)}</span>
            </div>
            <div className="flex justify-between text-gray-600 dark:text-gray-400">
              <span>Transportation Fee</span>
              <span className="font-medium text-gray-900 dark:text-white">{fmt(transportFee)}</span>
            </div>
            <div className="flex justify-between text-gray-600 dark:text-gray-400">
              <span className="flex items-center gap-1">
                Tax (VAT)
                <span
                  className="material-icons text-gray-400 text-base cursor-help"
                  title="VAT applied per Ministry directive"
                >
                  info
                </span>
              </span>
              <span>{fmt(summary.vat)}</span>
            </div>
            <div className="flex justify-between text-green-600 dark:text-primary">
              <span>Ministry Subsidy</span>
              <span>−{fmt(summary.ministrySubsidy)}</span>
            </div>
          </div>

          {/* Total + CTA */}
          <div className="pt-6 mt-6 border-t border-gray-100 dark:border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <span className="text-base font-bold text-gray-900 dark:text-white">Total Amount</span>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">{fmt(total)}</span>
            </div>

            <button
              type="button"
              onClick={onConfirm}
              className="w-full bg-primary hover:bg-primary-dark text-black font-bold py-4 px-4 rounded-lg shadow-lg shadow-primary/30 transition-all duration-150 hover:-translate-y-0.5 flex items-center justify-center gap-2 text-lg"
            >
              <span className="material-icons">lock</span>
              Confirm Payment
            </button>

            <p className="mt-4 text-center text-xs text-gray-500 dark:text-gray-400">
              By placing your order, you agree to the Ministry&apos;s{" "}
              <a href="#" className="text-primary-dark dark:text-primary underline">
                Terms of Trade
              </a>
              .
            </p>
          </div>
        </div>
      </div>

      {/* Trust badges */}
      <div className="mt-6 flex justify-center gap-6 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all">
        <div className="flex items-center gap-1">
          <span className="material-icons text-gray-500 text-base">verified</span>
          <span className="text-xs font-bold text-gray-600 dark:text-gray-400">SSL Secure</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="material-icons text-gray-500 text-base">account_balance</span>
          <span className="text-xs font-bold text-gray-600 dark:text-gray-400">Bank Verified</span>
        </div>
      </div>
    </div>
  );
}