import React, { useState } from "react";
import styles from "./index.module.css";

interface VaultDetailProps {
  vaultName: string;
  onBack: () => void;
}

const VaultDetail: React.FC<VaultDetailProps> = ({ vaultName, onBack }) => {
  const [activeTab, setActiveTab] = useState<string>("Stats");

  const renderTabContent = () => {
    switch (activeTab) {
      case "Stats":
        return <div className="p-4">Stats content for {vaultName}</div>;
      case "Depositors":
        return <div className="p-4">Depositors content for {vaultName}</div>;
      case "Strategy":
        return <div className="p-4">Strategy content for {vaultName}</div>;
      default:
        return null;
    }
  };

  return (
    <div className="p-4">
      <button
        onClick={onBack}
        className={`${styles['button-back']} px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-400 transition`}>
        Back
      </button>
      <h2 className="text-lg font-semibold text-gray-800 mb-4">{vaultName}</h2>
      <div className="flex space-x-4 border-b mb-4">
        {["Stats", "Depositors", "Strategy"].map((tab) => (
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
