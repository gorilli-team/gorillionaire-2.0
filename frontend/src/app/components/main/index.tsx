/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useEffect, useState } from "react";
import { Card } from "../vault_card/index";
import VaultDetail from "../vault_detail/index";
import { ModalDeposit } from "../modal_deposit";
import FeedNews from "../feed_news/index";
import TradingTest from "../trading_test";
import styles from "./index.module.css";
import { fetchFeedData } from "@/app/api/fetchFeedData";
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
  "0xC6827ce6d60A13a20A86dCac8c9e6D0F84497345" as `0x${string}`;
const USDC_ADDRESS = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";

interface MainProps {
  selectedPage: string;
  selectedVault: string | null;
  setSelectedVault: React.Dispatch<React.SetStateAction<string | null>>;
  setSelectedPage: React.Dispatch<React.SetStateAction<string>>;
}

export default function Main({
  selectedPage,
  selectedVault,
  setSelectedVault,
  setSelectedPage
}: MainProps) {
  const { address } = useAccount();
  const { data: hash, writeContract } = useWriteContract();

  const account = useAccount();

  useEffect(() => {
    console.log("useAccount() Data:", account);
  }, [account]);


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
  
  // Convert amount to USDC decimals safely
  const amountStr = amount.toString();
  const [integerPart, decimalPart = ''] = amountStr.split('.');
  const paddedDecimal = decimalPart.padEnd(6, '0').slice(0, 6);
  const amountParsed = BigInt(integerPart + paddedDecimal);

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
      args: [VAULT_ADDRESS, amountParsed],
    });
  } else {
    writeContract({
      address: VAULT_ADDRESS,
      abi: vaultAbi,
      functionName: "deposit",
      args: [amountParsed, address],
    });
  }

  setIsModalOpen(false);
};

  const handleCardClick = (vaultName: string) => {
    setSelectedVault(vaultName);
    setSelectedPage("Vault");
  };

  // const handleBack = () => {
  //   setSelectedVault(null);
  // };

  const handleDepositClick = (vaultName: string) => {
    setSelectedVaultForDeposit(vaultName);
    setIsModalOpen(true);
  };

  const handleWithdrawClick = () => {
    console.log("Withdraw clicked");
  };

  const handleFetchFeed = async () => {
    const data = await fetchFeedData();
    console.log("Fetched feed data:", data);
  };
  

  const renderContent = () => {
    if (selectedVault) {
      return (
        <VaultDetail
          vaultName={selectedVault}
          onDeposit={() => handleDepositClick(selectedVault)}
          onWithdraw={handleWithdrawClick}
        />
      );
    }
  
  
    switch (selectedPage) {
      case "Feed":
        return (
          <div className="w-full flex flex-col justify-center items-center p-4 text-gray-800">
            <FeedNews 
              imageUrl="/gorillionaire.jpg"
              timestamp={new Date().toISOString()}
              content="Yo degens! Just sold some PENGU and bought WOW. Time to ride the meme coin wave! 🌊🚀 WAGMI!"
              vaultName="Vault Test 1"
              onDepositClick={handleDepositClick}
              onCardClick={setSelectedVault}
              onWithdrawClick={handleWithdrawClick}
              setSelectedPage={setSelectedPage}
            />
            <button 
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            onClick={handleFetchFeed}
          >
            Aggiorna Feed
          </button>
          </div>
        );
      case "My Account":
        return (
          <div className="p-6 pt-4 text-gray-800">
            <div className="text-xl font-bold text-gray-800 mb-4">Welcome back!</div>
            <div className="flex items-center bg-white shadow-md rounded-2xl p-4 mb-6">
              <img
                src="/user.jpg"
                alt="User Profile"
                className="h-12 w-12 rounded-full mr-4"
              />
              <div>
                <h2 className="text-lg font-semibold text-gray-800">Your Wallet</h2>
                <p className="text-gray-600">{account.address}</p>
              </div>
            </div>

            <h2 className="text-xl font-bold text-gray-800 mb-4">Your Investments</h2>
            <div className="w-[34%] gap-2">
              <Card 
                title="Vault Test 1"
                apy="3.5%"
                tvl="$138.8k"
                chainName="Base"
                chainImage="/base.jpg"
                onDeposit={() => handleDepositClick("Vault Test 1")}
                onCardClick={() => handleCardClick("Vault Test 1")}
                onWithdraw={handleWithdrawClick}
              />
            </div>
          </div>
        );
      case "Vault":
        return (
            <VaultDetail
                vaultName="Vault Test 1"
                onDeposit={() => handleDepositClick("Vault Test 1")}
                onWithdraw={handleWithdrawClick}
            />
        );
      case "TestTrading":
        return (
          <TradingTest />
        );    
      default:
        return <div className="p-4 text-gray-800">Select a page</div>;
    }
  };

  return (
    <main className={`flex-1 overflow-y-auto bg-gray-200 ${styles.mainContent}`}>
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
