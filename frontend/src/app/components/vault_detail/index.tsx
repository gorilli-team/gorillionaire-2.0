import React, { useState } from "react";
import VaultStats from "../vault_stats";


interface VaultDetailProps {
  vaultName: string;
}

const VaultDetail: React.FC<VaultDetailProps> = ({ vaultName}) => {
  const [activeTab, setActiveTab] = useState<string>("Stats");

  const renderTabContent = () => {
    switch (activeTab) {
      case "Stats":
        return <VaultStats vaultName={vaultName} />;
      case "Depositors":
        return <div className="p-4">Depositors content for {vaultName}</div>;
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
      <h2 className="text-lg font-semibold text-gray-800 pb-2">{vaultName}</h2>
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
