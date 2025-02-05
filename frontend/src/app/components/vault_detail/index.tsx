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
        return (
          <div className="p-4">
            <h3 className="text-md font-semibold mb-2">Details</h3>
            <div className="border p-4 rounded-lg mb-4 bg-gray-100">
              <div className="flex justify-between pb-2">
                <strong>Vault name:</strong>
                <span>{vaultName}</span>
              </div>
              <div className="flex justify-between pb-2">
                <strong>Created by:</strong> 
                <span>TrollDetective.Eve</span>
              </div>
              <div className="flex justify-between pb-2">
                <strong>List date:</strong> 
                <span>05/02/2025</span>
              </div>
              <div className="flex justify-between pb-2">
                <strong>Chain:</strong>
                <div className="flex">
                    <img className="w-6 h-6" src="/base.png" alt="img-base" />
                    <span className="ps-1">Base</span>
                </div>
              </div>
              <div className="flex justify-between pb-2">
                <strong>Contract address:</strong>  
                <span>0x4173151106c668B79fb2aF40e6894f12A91B4d2F</span>
              </div>
              <div className="flex justify-between pb-2">
                <strong>Last updated:</strong>  
                <span>05/02/2025</span>
              </div>
            </div>

            <h3 className="text-md font-semibold mb-2">APY</h3>
            <div className="border p-4 rounded-lg mb-4 bg-gray-100">
              <p>APY: 3.5%</p>
              <p>[Placeholder for APY chart]</p>
            </div>

            <h3 className="text-md font-semibold mb-2">TVL</h3>
            <div className="border p-4 rounded-lg bg-gray-100">
              <p>TVL: $138,297.78</p>
              <p>[Placeholder for TVL chart]</p>
            </div>
          </div>
        );
      case "Depositors":
        return <div className="p-4">Depositors content for {vaultName}</div>;
      case "Strategy":
        return <div className="p-4">Strategy content for {vaultName}</div>;
      case "News":
        return <div className="p-4">Latest news and updates about {vaultName}</div>;
      default:
        return null;
    }
  };

  return (
    <div className="p-4">
      <button
        onClick={onBack}
        className={`${styles['button-back']} px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-300 transition`}
      >
        Back
      </button>
      <h2 className="text-lg font-semibold text-gray-800 pb-2">{vaultName}</h2>
      <div className="flex space-x-4 border-b mb-4">
        {["Stats", "Depositors", "Strategy", "News"].map((tab) => (
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
