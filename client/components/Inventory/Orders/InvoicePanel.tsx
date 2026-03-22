import Image from "next/image";
import type { InvoiceDetail } from "@/types/Orders";

interface Props {
  invoice: InvoiceDetail;
}

export default function InvoicePanel({ invoice }: Props) {
  const isDelivered = invoice.status === "Delivered";

  return (
    <div className="lg:col-span-1">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700 sticky top-24">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900/50 rounded-t-xl">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
              Order {invoice.orderId}
            </h3>
            <p className="text-xs text-gray-500 mt-1">Digital Invoice Preview</p>
          </div>
          <span
            className={`h-8 w-8 rounded-full flex items-center justify-center ${
              isDelivered ? "bg-green-100" : "bg-blue-100"
            }`}
          >
            <span
              className={`material-icons text-sm ${
                isDelivered ? "text-green-600" : "text-blue-600"
              }`}
            >
              {isDelivered ? "check" : "local_shipping"}
            </span>
          </span>
        </div>

        {/* Body */}
        <div className="px-6 py-6 space-y-6">
          {/* Supplier */}
          <div className="flex items-start space-x-4">
            <div className="shrink-0">
              <div className="h-10 w-10 rounded bg-indigo-100 flex items-center justify-center text-indigo-700">
                <span className="material-icons">storefront</span>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                {invoice.supplierName}
              </h4>
              <p className="text-xs text-gray-500">Reg: {invoice.supplierReg}</p>
              <p className="text-xs text-gray-500">{invoice.supplierAddress}</p>
            </div>
          </div>

          <hr className="border-gray-100 dark:border-gray-700" />

          {/* Line items */}
          <div>
            <h5 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Items
            </h5>
            <div className="space-y-3">
              {invoice.lineItems.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-300">{item.label}</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    ${item.amount.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg flex justify-between items-center">
            <span className="text-sm font-medium text-gray-500">Total Amount</span>
            <span className="text-xl font-bold text-gray-900 dark:text-primary">
              ${invoice.total.toFixed(2)}
            </span>
          </div>

          {/* Map preview */}
          <div className="rounded-lg overflow-hidden h-32 relative group">
            <Image
              src={invoice.mapImageUrl}
              alt="Delivery route map"
              fill
              className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
              sizes="(max-width: 1024px) 100vw, 384px"
            />
            <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
              <span className="bg-white/90 dark:bg-black/80 backdrop-blur px-3 py-1 rounded-full text-xs font-medium shadow-sm">
                {invoice.routeLabel}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 flex flex-col gap-3">
            <button
              type="button"
              className="w-full flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-gray-900 bg-primary hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
            >
              <span className="material-icons mr-2 text-base">download</span>
              Download PDF Invoice
            </button>
            <button
              type="button"
              className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
            >
              <span className="material-icons mr-2 text-base">print</span>
              Print
            </button>
          </div>

          <p className="text-center text-xs text-gray-400">
            Official Ministry of Agriculture Document.
            <br />
            Generated on {invoice.generatedOn}.
          </p>
        </div>
      </div>
    </div>
  );
}