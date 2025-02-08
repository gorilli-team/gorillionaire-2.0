import React, { useEffect, useState } from "react";
import { Transaction } from "../../types";

const formatTimestamp = (timestamp: string): string => {
    const txTime = new Date(parseInt(timestamp) * 1000);
    const now = new Date();
    const secondsAgo = Math.floor((now.getTime() - txTime.getTime()) / 1000);
  
    if (secondsAgo < 60) return `${secondsAgo}s ago`;
    const minutesAgo = Math.floor(secondsAgo / 60);
    if (minutesAgo < 60) return `${minutesAgo}m ago`;
    const hoursAgo = Math.floor(minutesAgo / 60);
    if (hoursAgo < 24) return `${hoursAgo}h ago`;
    const daysAgo = Math.floor(hoursAgo / 24);
    
    return `${daysAgo}d ago`;
};
  
// const formatTxnFee = (gasUsed: string, gasPrice: string): string => {
//     const feeInWei = BigInt(gasUsed) * BigInt(gasPrice);
//     const feeInEth = Number(feeInWei) / 1e18;
//     return feeInEth.toFixed(8);
// };
  
const formatHash = (hash: string): string => {
    return `${hash.slice(0, 10)}...${hash.slice(-4)}`;
};

const VaultExplorer: React.FC<{ transactions: Transaction[], vaultAddress: string }> = ({ transactions, vaultAddress }) => {
    const [sortedTransactions, setSortedTransactions] = useState<Transaction[]>([]);
  
    useEffect(() => {
      if (!vaultAddress) return;
  
      const formattedTransactions: Transaction[] = transactions
        .map((tx) => ({
          hash: tx.hash,
          method: tx.to.toLowerCase() === vaultAddress.toLowerCase() ? ("Deposit" as const) : ("Withdraw" as const),
          blockNumber: tx.blockNumber,
          timeStamp: formatTimestamp(tx.timeStamp),
          from: tx.from,
          to: tx.to,
        //   amount: tx.value,
        //   txnFee: formatTxnFee(tx.gasUsed, tx.gasPrice)
        }))
        .sort((a, b) => parseInt(b.blockNumber) - parseInt(a.blockNumber));
    
      setSortedTransactions(formattedTransactions);
    }, [transactions, vaultAddress]);
  
    return (
      <div className="p-4">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-left">Transaction Hash</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Method</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Block</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Timestamp</th>
              {/* <th className="border border-gray-300 px-4 py-2 text-left">Amount ETH</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Fee ETH</th> */}
            </tr>
          </thead>
          <tbody>
            {sortedTransactions.map((tx) => (
              <tr key={tx.hash}>
                <td className="border border-gray-300 px-4 py-2">
                  {formatHash(tx.hash)}
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
                <td className="border border-gray-300 px-4 py-2">{tx.blockNumber}</td>
                <td className="border border-gray-300 px-4 py-2">{tx.timeStamp}</td>
                {/* <td className="border border-gray-300 px-4 py-2">{tx.amount}</td>
                <td className="border border-gray-300 px-4 py-2">{tx.txnFee}</td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  

export default VaultExplorer;
