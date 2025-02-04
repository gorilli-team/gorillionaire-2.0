import React from "react";
import { Card } from "../vault_card/index";

interface MainProps {
  selectedPage: string;
}

export default function Main({ selectedPage }: MainProps) {
  const handleDeposit = () => {
    console.log("Deposit clicked");
  };

  const handleWithdraw = () => {
    console.log("Withdraw clicked");
  };

  const renderContent = () => {
    switch (selectedPage) {
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
                onDeposit={handleDeposit}
                onWithdraw={handleWithdraw}
              />
            </div>
          </div>
        );
      default:
        return <div className="p-4 text-gray-800">Select a page</div>;
    }
  };

  return <main className="flex-1 overflow-y-auto bg-gray-200">{renderContent()}</main>;
}
