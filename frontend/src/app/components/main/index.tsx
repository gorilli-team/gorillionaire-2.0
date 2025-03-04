/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import { Card } from "../vault_card/index";
import VaultDetail from "../vault_detail/index";
import { ModalDeposit } from "../modal_deposit";
import { ModalWithdraw } from "../modal_withdraw";
import FeedNews from "../feed_news/index";
import TradingTest from "../trading_test";
import FeedSignalComponent from "../feed_components/feedSignalComponent";
import TweetComponent from "../feed_components/tweetComponent";
import PriceComponent from "../feed_components/priceComponent";
import styles from "./index.module.css";
import {
  fetchFeedData,
  fetchPricesData,
  fetchTweetsData,
  fetchTokenData,
} from "@/app/api/fetchFeedData";
import { ethers } from "ethers";
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
import Tokens from "../tokens";
import Image from "next/image";
import Signals from "../signals";
import Agents from "../agents";

interface FeedSignal {
  signal: string;
  confidence: number;
  metrics: {
    volatility1h: number;
    volatility24h: number;
    volumeTrend: string;
    avg1hChange: number;
    avg24hChange: number;
  };
}

interface Tweet {
  id: string;
  name: string;
  username: string;
  text: string;
  createdAt: string;
  permanentUrl: string;
}

interface PriceData {
  price: number;
  marketCap: number;
  volume24h: number;
  volumeChange24h: number;
  percentChange1h: number;
  percentChange24h: number;
  timestamp: string;
}

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
  setSelectedPage,
}: MainProps) {
  const { address } = useAccount();
  const { data: hash, writeContract } = useWriteContract();
  const account = useAccount();

  const [feedSignal, setFeedSignal] = useState<FeedSignal | null>(null);
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [priceData, setPriceData] = useState<PriceData | null>(null);

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

  const {
    data: userBalance,
    isError: balanceIsError,
    isPending: balanceIsPending,
  } = useReadContract({
    abi: vaultAbi,
    address: VAULT_ADDRESS,
    functionName: "balanceOf",
    args: [address || "0x0"],
  });

  const {
    data: maxWithdraw,
    isError: maxWithdrawIsError,
    isPending: maxWithdrawIsPending,
  } = useReadContract({
    abi: vaultAbi,
    address: VAULT_ADDRESS,
    functionName: "maxWithdraw",
    args: [address || "0x0"],
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [allowance, setAllowance] = useState(BigInt(0));
  const [maxWithdrawAmount, setMaxWithdrawAmount] = useState<bigint>(BigInt(0));
  const [selectedVaultForDeposit, setSelectedVaultForDeposit] = useState<
    string | null
  >(null);

  useEffect(() => {
    if (allowanceData) {
      setAllowance(allowanceData);
    }
  }, [allowanceData]);

  useEffect(() => {
    if (maxWithdraw && typeof maxWithdraw === "bigint") {
      setMaxWithdrawAmount(maxWithdraw);
    }
  }, [maxWithdraw]);

  const handleDeposit = (amount: number) => {
    console.log(`Depositing ${amount} USDC`);

    const amountStr = amount.toString();
    const [integerPart, decimalPart = ""] = amountStr.split(".");
    const paddedDecimal = decimalPart.padEnd(6, "0").slice(0, 6);
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

  const handleWithdraw = async (amount: number) => {
    console.log(`Withdrawing ${amount} USDC`);

    if (!address) {
      console.log("no wallet connected");
      return;
    }

    try {
      const amountInUSDC = ethers.parseUnits(amount.toString(), 6);

      writeContract({
        address: VAULT_ADDRESS,
        abi: vaultAbi,
        functionName: "withdraw",
        args: [amountInUSDC, address, address],
      });

      setIsWithdrawModalOpen(false);
    } catch (error) {
      console.error("Error in withdrawal:", error);
    }
  };

  const handleCardClick = (vaultName: string) => {
    setSelectedVault(vaultName);
    setSelectedPage("Vault");
  };

  const handleDepositClick = (vaultName: string) => {
    setSelectedVaultForDeposit(vaultName);
    setIsModalOpen(true);
  };

  const handleWithdrawClick = () => {
    setIsWithdrawModalOpen(true);
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
      case "Tokens":
        return (
          <div className="w-full flex flex-col justify-center items-center text-gray-800">
            <Tokens />
          </div>
        );
      case "Signals":
        return (
          <div className="w-full flex flex-col justify-center items-center text-gray-800">
            <Signals />
          </div>
        );

      case "Agents":
        return (
          <div className="w-full flex flex-col justify-center items-center text-gray-800">
            <Agents />
          </div>
        );
      case "Feed":
        return (
          <div className="w-full flex flex-col justify-center items-center text-gray-800">
            <FeedNews
              imageUrl="/gorillionaire.jpg"
              vaultName="Gorillionaire Vault Token"
              onDepositClick={handleDepositClick}
              onCardClick={setSelectedVault}
              onWithdrawClick={handleWithdrawClick}
              setSelectedPage={setSelectedPage}
            />

            {feedSignal && <FeedSignalComponent signal={feedSignal} />}

            <div className="space-y-2">
              {tweets.map((tweet, index) => (
                <TweetComponent key={index} tweet={tweet} />
              ))}
            </div>

            {priceData && <PriceComponent price={priceData} />}
          </div>
        );

      case "My Account":
        return (
          <div className="p-6 pt-4 text-gray-800">
            <div className="text-xl font-bold text-gray-800 mb-4">
              Welcome back!
            </div>
            <div className="flex items-center bg-white shadow-md rounded-2xl p-4 mb-6">
              <Image
                src="/user.jpg"
                alt="User Profile"
                width={48}
                height={48}
                className="rounded-full mr-4"
              />
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  Your Wallet
                </h2>
                <p className="text-gray-600">{account.address}</p>
              </div>
            </div>

            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Your Investments
            </h2>
            <div className="w-[34%] gap-2">
              <Card
                title="Gorillionaire Vault Token"
                chainName="Base"
                chainImage="/base.jpg"
                onDeposit={() =>
                  handleDepositClick("Gorillionaire Vault Token")
                }
                onCardClick={() => handleCardClick("Gorillionaire Vault Token")}
                onWithdraw={handleWithdrawClick}
              />
            </div>
          </div>
        );
      case "Vault":
        return (
          <VaultDetail
            vaultName="Gorillionaire Vault Token"
            onDeposit={() => handleDepositClick("Gorillionaire Vault Token")}
            onWithdraw={handleWithdrawClick}
          />
        );
      case "TestTrading":
        return <TradingTest />;
      default:
        return <div className="p-4 text-gray-800">Select a page</div>;
    }
  };

  return (
    <main
      className={`flex-1 overflow-y-auto bg-gray-200 ${styles.mainContent}`}
    >
      {renderContent()}

      <ModalDeposit
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onDeposit={handleDeposit}
        allowance={allowance}
      />

      <ModalWithdraw
        isOpen={isWithdrawModalOpen}
        onClose={() => setIsWithdrawModalOpen(false)}
        onWithdraw={handleWithdraw}
        maxAmount={maxWithdrawAmount}
      />
    </main>
  );
}
