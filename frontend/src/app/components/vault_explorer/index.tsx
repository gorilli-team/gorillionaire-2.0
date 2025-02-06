// VaultExplorer.tsx
import React from "react";
import { Transaction } from "../../types";

const formatAge = (seconds: number): string => {
  if (seconds < 60) return `${seconds} seconds ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
  const date = new Date(Date.now() - seconds * 1000);
  return date.toLocaleTimeString();
};

const VaultExplorer: React.FC<{ transactions: Transaction[] }> = ({ transactions }) => {
  return (
    <div className="p-4">
      <table className="min-w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2 text-left">Transaction Hash</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Method</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Block</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Age</th>
            <th className="border border-gray-300 px-4 py-2 text-left">User</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Amount</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Txn Fee</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr key={tx.hash}>
              <td className="border border-gray-300 px-4 py-2">
                {tx.hash.slice(0, 6)}...{tx.hash.slice(-4)}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                <span
                  className={`px-2 py-1 text-white text-xs font-bold rounded-full ${
                    tx.method === "Deposit" ? "bg-green-500" : "bg-red-500"
                  }`}
                >
                  {tx.method}
                </span>
              </td>
              <td className="border border-gray-300 px-4 py-2">{tx.block}</td>
              <td className="border border-gray-300 px-4 py-2">{formatAge(tx.age)}</td>
              <td className="border border-gray-300 px-4 py-2">{tx.from.slice(0, 6)}...{tx.from.slice(-4)}</td>
              <td className="border border-gray-300 px-4 py-2">{tx.amount}</td>
              <td className="border border-gray-300 px-4 py-2">{tx.txnFee}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VaultExplorer;