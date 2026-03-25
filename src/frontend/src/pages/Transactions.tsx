import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { Transaction } from "../backend";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export function Transactions() {
  const { identity, login } = useInternetIdentity();
  const { actor } = useActor();
  const isAuthenticated = identity && !identity.getPrincipal().isAnonymous();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!actor || !isAuthenticated) return;
    actor
      .getUserTransactions()
      .then(setTransactions)
      .catch(() => toast.error("Failed to load transactions"))
      .finally(() => setLoading(false));
  }, [actor, isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-5xl mb-4">🔒</div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Sign in required
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Please sign in to view your transactions.
          </p>
          <button
            type="button"
            onClick={login}
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-purple-600 text-white font-semibold rounded-xl hover:opacity-90"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    completed:
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    pending:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    failed: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  };

  const formatDate = (ts: bigint) => {
    try {
      return new Date(Number(ts) / 1_000_000).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "—";
    }
  };

  const formatAmount = (cents: bigint) =>
    `$${(Number(cents) / 100).toFixed(2)}`;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Transactions
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Your payment history
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-20 px-4">
              <div className="text-4xl mb-3">💳</div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                No transactions yet. Subscribe to a plan to get started.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                    <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Plan
                    </th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Amount
                    </th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Method
                    </th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Status
                    </th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {transactions.map((tx) => (
                    <tr
                      key={tx.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors"
                    >
                      <td className="px-5 py-4">
                        <span className="font-medium capitalize text-gray-900 dark:text-white">
                          {tx.plan}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {formatAmount(tx.amountCents)}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="capitalize text-gray-600 dark:text-gray-300">
                          {tx.paymentMethod === "stripe" ? "💳" : "💰"}{" "}
                          {tx.paymentMethod}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${statusColors[tx.status] || statusColors.pending}`}
                        >
                          {tx.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-gray-500 dark:text-gray-400">
                        {formatDate(tx.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
