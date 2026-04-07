import Image from "next/image";
import type { CartItem } from "@/types/Cart";
import type { ApiTransporter } from "@/types/Checkout";
import { PLATFORM_LEVY_RATE } from "@/types/Checkout";

const PLACEHOLDER = "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=100&q=70";

const fmt = (n: number) =>
  `${n.toLocaleString("fr-DZ", { minimumFractionDigits: 2 })} DZD`;

interface Props {
  items:       CartItem[];
  cartTotal:   number;
  isSubmitting: boolean;
  onConfirm:   () => void;
}

export default function CheckoutOrderSummary({
  items, cartTotal, isSubmitting, onConfirm,
}: Props) {
  const levy         = cartTotal * PLATFORM_LEVY_RATE;
  const total        = cartTotal + levy;

  return (
    <div className="sticky top-24 space-y-4">
      <div className="bg-white rounded-xl shadow-lg border border-neutral-100 overflow-hidden">

        {/* Ministry badge */}
        <div className="bg-primary/10 border-b border-primary/20 px-5 py-3 flex items-center gap-3">
          <span
            className="material-symbols-outlined text-primary-dark text-xl"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            verified_user
          </span>
          <div>
            <p className="text-xs font-bold text-primary-dark uppercase tracking-wide">
              Ministry Regulated
            </p>
            <p className="text-xs text-gray-600">Fair trade verified for buyers &amp; farmers.</p>
          </div>
        </div>

        <div className="p-5">
          <h2 className="text-base font-bold text-gray-900 mb-4">Order Summary</h2>

          {/* Items */}
          <ul className="divide-y divide-neutral-100 mb-4 max-h-64 overflow-y-auto">
            {items.map((item) => {
              const image = item.product.images[0]?.image ?? PLACEHOLDER;
              return (
                <li key={item.id} className="flex gap-3 py-3">
                  <div className="w-14 h-14 shrink-0 rounded-lg border border-neutral-100 overflow-hidden relative bg-neutral-100">
                    <Image
                      src={image}
                      alt={item.product.ministry_product.name}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{item.product.ministry_product.name}</p>
                    <p className="text-xs text-gray-500">{item.product.farm.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">Qty: {item.quantity}</p>
                  </div>
                  <span className="text-sm font-bold text-gray-900 shrink-0">
                    {item.total_price.toLocaleString("fr-DZ")}
                  </span>
                </li>
              );
            })}
          </ul>

          {/* Cost breakdown */}
          <div className="space-y-2.5 pt-4 border-t border-neutral-100 text-sm">
            <div className="flex justify-between text-gray-500">
              <span>Products subtotal</span>
              <span className="font-medium text-gray-900">{fmt(cartTotal)}</span>
            </div>

            <div className="flex justify-between text-gray-500">
              <span className="flex items-center gap-1">
                Platform levy ({(PLATFORM_LEVY_RATE * 100).toFixed(0)}%)
                <span
                  className="material-symbols-outlined text-gray-300 text-xs cursor-help"
                  title="Covers Ministry platform and escrow services"
                >
                  info
                </span>
              </span>
              <span className="font-medium text-gray-900">{fmt(levy)}</span>
            </div>

            <div className="flex justify-between pt-3 border-t border-neutral-100">
              <span className="text-base font-bold text-gray-900">Total</span>
              <span className="text-xl font-bold text-primary-dark">{fmt(total)}</span>
            </div>
          </div>

          {/* CTA */}
          <button
            type="button"
            onClick={onConfirm}
            className="mt-5 w-full flex items-center justify-center gap-2 py-4 px-4 rounded-lg bg-primary hover:bg-primary-dark text-black font-bold text-sm shadow-lg shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>
                Placing Order…
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                  lock
                </span>
                Confirm &amp; Place Order
              </>
            )}
          </button>

          <p className="mt-3 text-center text-xs text-gray-400">
            By placing your order you agree to the Ministry&apos;s{" "}
            <a href="#" className="text-primary-dark underline hover:no-underline">Terms of Trade</a>.
          </p>
        </div>
      </div>

      {/* Trust badges */}
      <div className="flex justify-center gap-6 opacity-50 hover:opacity-100 transition-opacity">
        {[
          { icon: "verified",        label: "SSL Secure"    },
          { icon: "account_balance", label: "Bank Verified" },
        ].map((b) => (
          <div key={b.label} className="flex items-center gap-1">
            <span className="material-symbols-outlined text-gray-400 text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
              {b.icon}
            </span>
            <span className="text-xs font-bold text-gray-500">{b.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}