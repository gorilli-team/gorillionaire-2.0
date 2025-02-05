import React, { useEffect, useState } from "react";
import { Card } from "../vault_card/index";
import VaultDetail from "../vault_detail/index";
import { ModalDeposit } from "../modal_deposit"; // Importa la modale di deposito
import {
  useAccount,
  useReadContract,
  useSendTransaction,
  useWriteContract,
} from "wagmi";

import { TransactionDefault } from "@coinbase/onchainkit/transaction";
import {
  Transaction,
  TransactionButton,
  TransactionSponsor,
  TransactionStatus,
  TransactionStatusAction,
  TransactionStatusLabel,
} from "@coinbase/onchainkit/transaction";
import { WalletDefault } from "@coinbase/onchainkit/wallet";
import { vaultAbi } from "../../../../public/abi/vaultabi";
import { erc20abi } from "../../../../public/abi/erc20abi";

const VAULT_ADDRESS =
  "0x4173151106c668B79fb2aF40e6894f12A91B4d2F" as `0x${string}`;
const USDC_ADDRESS = "0x036CbD53842c5426634e7929541eC2318f3dCF7e";

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
  const { address } = useAccount();
  const { data: hash, writeContract } = useWriteContract();

  const {
    data: allowanceData,
    isError: allowanceIsError,
    isPending: allowanceIsPending,
  } = useReadContract({
    abi: erc20abi,
    address: USDC_ADDRESS,
    functionName: "allowance",
    args: [address || "0x0", VAULT_ADDRESS],
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [allowance, setAllowance] = useState(BigInt(0));
  const [selectedVaultForDeposit, setSelectedVaultForDeposit] = useState<
    string | null
  >(null);

  useEffect(() => {
    if (allowanceData) {
      setAllowance(allowanceData);
    }
  }, [allowanceData]);

  const handleDeposit = (amount: number) => {
    console.log(`Depositing ${amount} USDC`);
    const amountParsed = BigInt(amount * Math.pow(10, 18));
    if (!address) {
      console.log("no wallet connected");
      return;
    }
    if (allowance < amountParsed) {
      console.log("Less allowance, approving token");
      writeContract({
        address: USDC_ADDRESS,
        abi: erc20abi,
        functionName: "approve",
        args: [VAULT_ADDRESS, BigInt(amount * Math.pow(10, 18))],
      });
    } else {
      writeContract({
        address: VAULT_ADDRESS,
        abi: vaultAbi,
        functionName: "deposit",
        args: [BigInt(1), address],
      });
    }

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
              <Card
                title="Vault Test 2"
                apy="3.5%"
                tvl="$138.8k"
                chainName="Base"
                chainImage="/base.png"
                onCardClick={() => handleCardClick("Vault Test 1")}
                onDeposit={() => handleDepositClick("Vault Test 1")}
              />
              <Card
                title="Vault Test 3"
                apy="3.5%"
                tvl="$138.8k"
                chainName="Base"
                chainImage="/base.png"
                onCardClick={() => handleCardClick("Vault Test 1")}
                onDeposit={() => handleDepositClick("Vault Test 1")}
              />
              <Card
                title="Vault Test 4"
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
        allowance={allowance}
      />
    </main>
  );
}
