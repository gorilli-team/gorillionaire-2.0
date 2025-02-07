import React, { useState, useEffect } from "react";
import VaultStats from "../vault_stats";
import { useAccount } from "wagmi";
import VaultDepositors from "../vault_depositors";
import VaultStrategy from "../vault_strategy";
import VaultExplorer from "../vault_explorer";
import { Transaction } from "../../types";
import { getAppState } from "../../store/appStore";
import { fetchVaultAddress, fetchVaultTransactions, fetchVaultDepositors } from "../../api/fetchVaultData";

interface VaultDetailProps {
  vaultName: string;
  onDeposit: () => void;
  onWithdraw: () => void;
}

const VaultDetail: React.FC<VaultDetailProps> = ({ vaultName, onDeposit, onWithdraw }) => {
  const { address } = useAccount();
  const [activeTab, setActiveTab] = useState<string>("Stats");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const vaultAddress = getAppState("vaultAddress");
  const [depositors, setDepositors] = useState<{ investor: string; deposits: number; withdraws: number; image: string }[]>([]);


  useEffect(() => {
    const initializeVaultAddress = async () => {
      await fetchVaultAddress();
    };
    initializeVaultAddress();
  }, []);

  useEffect(() => {
    const loadTransactions = async () => {
      const txs = await fetchVaultTransactions();
      setTransactions(txs);
    };
  
    if (vaultAddress) {
      loadTransactions();
    }
  }, [vaultAddress]);

  useEffect(() => {
    const loadDepositors = async () => {
      const wallets = await fetchVaultDepositors();
      setDepositors(wallets);
    };

    if (vaultAddress) {
      loadDepositors();
    }
  }, [vaultAddress]);

  const strategyTokens = [
    { name: "Compound", value: 49357.35, color: "#00C49F", logo: "/gorillionaire.jpg" },
    { name: "Uniswap", value: 31212.68, color: "#FF6384", logo: "/gorillionaire.jpg" },
    { name: "AAVE", value: 28991.33, color: "#8A2BE2", logo: "/gorillionaire.jpg" },
    { name: "Cream Finance", value: 28736.42, color: "#FFA500", logo: "/gorillionaire.jpg" }
  ];
  
  const renderTabContent = () => {
    switch (activeTab) {
      case "Stats":
        return <VaultStats vaultName={vaultName} />;
      case "Depositors":
        return <VaultDepositors depositors={depositors} />;
      case "Strategy":
        return <VaultStrategy tokens={strategyTokens} />;
      case "Explorer":
        return <VaultExplorer vaultAddress={vaultAddress} transactions={transactions} />;
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
            className={`px-4 py-2 ${activeTab === tab ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-600"}`}
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