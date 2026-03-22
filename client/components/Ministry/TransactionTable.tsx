import Link from "next/link";
import type { Transaction, TransactionStatus } from "@/types/Ministry";

interface Props {
  transactions: Transaction[];
}

const statusStyles: Record<TransactionStatus, string> = {
  Completed:
    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  Processing:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  Pending:
    "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  Cancelled:
    "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

export default function TransactionsTable({ transactions }: Props) {
  return (
    <div className="bg-white dark:bg-[#1a331a] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recent Transactions</h3>
        <Link href="#" className="text-sm text-primary font-medium hover:underline">
          View All
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
          <thead className="bg-slate-50 dark:bg-slate-900 text-xs uppercase font-semibold text-slate-500 dark:text-slate-400">
            <tr>
              {["Transaction ID", "Farmer / Entity", "Commodity", "Volume", "Status", "Date"].map(
                (h, i) => (
                  <th
                    key={h}
                    className={`px-6 py-3 ${i === 5 ? "text-right" : ""}`}
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {transactions.map((tx) => (
              <tr
                key={tx.id}
                className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{tx.txId}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold ${tx.entityBg} ${tx.entityTextColor}`}
                    >
                      {tx.entityInitials}
                    </div>
                    <div>
                      <div className="font-medium text-slate-900 dark:text-white">
                        {tx.entityName}
                      </div>
                      <div className="text-xs text-slate-400">{tx.entityLocation}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">{tx.commodity}</td>
                <td className="px-6 py-4">{tx.volume}</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[tx.status]}`}
                  >
                    {tx.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right text-slate-400">{tx.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}