import React, { useState } from "react";
import VaultStats from "../vault_stats";
import { useAccount } from "wagmi";
import VaultDepositors from "../vault_depositors";

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

  const renderTabContent = () => {
    switch (activeTab) {
      case "Stats":
        return <VaultStats vaultName={vaultName} />;
      case "Depositors":
        return <VaultDepositors />;
      case "Strategy":
        return <div className="p-4">Strategy content for {vaultName}</div>;
      case "Explorer":
        return <div className="p-4">Latest news and updates about {vaultName}</div>;
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
