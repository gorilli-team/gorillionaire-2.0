import React, { useState } from "react";
import VaultStats from "../vault_stats";
import { useAccount } from "wagmi";
import VaultDepositors from "../vault_depositors";
import VaultStrategy from "../vault_strategy";
import VaultExplorer from "../vault_explorer";
import { Transaction } from "../../types"; 

interface VaultDetailProps {
  vaultName: string;
  onDeposit: () => void;
  onWithdraw: () => void;
}

const VaultDetail: React.FC<VaultDetailProps> = ({ vaultName, onDeposit, onWithdraw }) => {
  const { address } = useAccount();
  const [activeTab, setActiveTab] = useState<string>("Stats");

  const handleWithdraw = () => {
    console.log("Withdraw clicked");
  };

  const handleDeposit = () => {
    console.log("Deposit clicked");
  };

  const strategyTokens = [
    { name: "Compound", value: 49357.35, color: "#00C49F" },
    { name: "Uniswap", value: 31212.68, color: "#FF6384" },
    { name: "AAVE", value: 28991.33, color: "#8A2BE2" },
    { name: "Cream Finance", value: 28736.42, color: "#FFA500" }
  ];

  const mockTransactions: Transaction[] = [
    {
      hash: "0x1234567890abcdef",
      method: "Deposit",
      block: 1203948,
      age: 600,
      from: "0xa1b2c3d4e5f6g7h8",
      amount: "1000 USDT",
      txnFee: "0.02 ETH",
    },
    {
      hash: "0xabcdef1234567890",
      method: "Withdraw",
      block: 1203950,
      age: 1200,
      from: "0xa9b8c7d6e5f4g3h2",
      amount: "500 USDT",
      txnFee: "0.01 ETH",
    }
  ];
  

  const renderTabContent = () => {
    switch (activeTab) {
      case "Stats":
        return <VaultStats vaultName={vaultName} />;
      case "Depositors":
        return <VaultDepositors />;
      case "Strategy":
        return <VaultStrategy tokens={strategyTokens} />;
      case "Explorer":
        return <VaultExplorer transactions={mockTransactions} />;
      default:
        return null;
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center pb-2">
        <h2 className="text-lg font-semibold text-gray-800">{vaultName}</h2>
        {address ? (
        <div className="flex gap-2">
          <button
            onClick={onWithdraw}
            className="px-4 py-2 bg-white border border-blue-500 hover:bg-blue-500 text-sm hover:text-white text-blue-500 font-small rounded-lg transition w-[100px]"
          >
            Withdraw
          </button>
          <button
            onClick={onDeposit}
            className="px-4 py-2 bg-blue-500 border border-transparent text-white text-sm rounded-lg hover:bg-white hover:border-blue-500 hover:text-blue-500 transition w-[100px]"
          >
            Deposit
          </button>
        </div>
        ) : null}
      </div>
      <div className="flex space-x-4 border-b mb-4">
        {["Stats", "Depositors", "Strategy", "Explorer"].map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 ${
              activeTab === tab ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-600"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      {renderTabContent()}
    </div>
  );
};

export default VaultDetail;
