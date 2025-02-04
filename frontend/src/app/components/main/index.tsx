import React, { useState } from "react";
import { Card } from "../vault_card/index";
import VaultDetail from "../vault_detail/index";
import { ModalDeposit } from "../modal_deposit";

interface MainProps {
  selectedPage: string;
  selectedVault: string | null;
  setSelectedVault: React.Dispatch<React.SetStateAction<string | null>>;
}

export default function Main({
  selectedPage,
  selectedVault,
  setSelectedVault,
}: MainProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVaultForDeposit, setSelectedVaultForDeposit] = useState<string | null>(null);

  const handleDeposit = (amount: number) => {
    console.log(`Depositing ${amount} ETH`);
    setIsModalOpen(false);
  };

  const handleCardClick = (vaultName: string) => {
    setSelectedVault(vaultName);
  };

  const handleBack = () => {
    setSelectedVault(null);
  };

  const handleDepositClick = (vaultName: string) => {
    setSelectedVaultForDeposit(vaultName);
    setIsModalOpen(true);
  };

  const renderContent = () => {
    if (selectedVault) {
      return <VaultDetail vaultName={selectedVault} onBack={handleBack} />;
    }

    switch (selectedPage) {
      case "Feed":
        return <div className="p-4 text-gray-800">Feed</div>;
      case "My Account":
        return <div className="p-4 text-gray-800">Welcome to My Account</div>;
      case "Vaults":
        return (
          <div className="p-4 text-gray-800">
            <div className="grid grid-cols-4 gap-4">
              <Card
                title="Vault Test 1"
                apy="3.5%"
                tvl="$138.8k"
                chainName="Base"
                chainImage="/base.png"
                onCardClick={() => handleCardClick("Vault Test 1")}
                onDeposit={() => handleDepositClick("Vault Test 1")}
              />
            </div>
          </div>
        );
      default:
        return <div className="p-4 text-gray-800">Select a page</div>;
    }
  };

  return (
    <main className="flex-1 overflow-y-auto bg-gray-200">
      {renderContent()}

      <ModalDeposit
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onDeposit={handleDeposit}
      />
    </main>
  );
}
