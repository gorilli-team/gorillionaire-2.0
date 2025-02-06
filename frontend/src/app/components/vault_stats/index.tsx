import React from "react";

interface VaultStatsProps {
  vaultName: string;
}

const VaultStats: React.FC<VaultStatsProps> = ({ vaultName }) => {
  return (
    <div className="p-4">
      <h3 className="text-md font-semibold mb-2">Details</h3>
      <div className="border p-4 rounded-lg mb-4 bg-gray-100">
        <div className="flex justify-between pb-2">
          <strong>Vault name:</strong>
          <span>{vaultName}</span>
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
      <div className="flex w-full gap-2">
        <div className="border p-4 rounded-lg bg-gray-100 w-1/2 flex flex-col">
          <span className="font-bold">APY:</span>
          <span>3.5%</span>
        </div>
        <div className="border p-4 rounded-lg bg-gray-100 w-1/2 flex flex-col">
          <span className="font-bold">TVL:</span>
          <span>$138,297.78</span>
        </div>
      </div>
    </div>
  );
};

export default VaultStats;