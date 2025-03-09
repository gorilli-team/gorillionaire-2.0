"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { trackedTokens } from "@/app/shared/tokenData";
import { useAccount, useReadContracts, useBalance } from "wagmi";
import { erc20Abi, isAddress } from "viem";
import { getTimeAgo } from "@/app/utils/time";
import { LoadingOverlay } from "../ui/LoadingSpinner";
type Token = {
  symbol: string;
  name: string;
  imageUrl: string | undefined;
  totalHolding: number;
};

type TradeEvent = {
  user: string;
  action: "Bought" | "Sold";
  amount: number;
  token: string;
  timeAgo: string;
  userImageUrl: string;
};

type TradeSignal = {
  _id: string;
  type: "Buy" | "Sell";
  token: string;
  amount: string;
  signal_text: string;
  events: string[];
  risk: "Moderate" | "Aggressive" | "Conservative";
  confidenceScore: string;
  created_at: string;
};

const MONAD_CHAIN_ID = 10143;

const fetchImageFromSignalText = (signalText: string) => {
  //find the first instance of one of the following words: CHOG, DAK, YAKI, MON
  const token = signalText.match(/CHOG|DAK|YAKI|MON/)?.[0];
  if (token === "CHOG") {
    return "https://imagedelivery.net/tWwhAahBw7afBzFUrX5mYQ/5d1206c2-042c-4edc-9f8b-dcef2e9e8f00/public";
  } else if (token === "DAK") {
    return "https://imagedelivery.net/tWwhAahBw7afBzFUrX5mYQ/27759359-9374-4995-341c-b2636a432800/public";
  } else if (token === "YAKI") {
    return "https://imagedelivery.net/tWwhAahBw7afBzFUrX5mYQ/6679b698-a845-412b-504b-23463a3e1900/public";
  } else if (token === "MON") {
    return "https://imagedelivery.net/cBNDGgkrsEA-b_ixIp9SkQ/I_t8rg_V_400x400.jpg/public";
  } else {
    //return placeholder image/ no token
    return "https://imagedelivery.net/cBNDGgkrsEA-b_ixIp9SkQ/I_t8rg_V_400x400.jpg/public";
  }
};

const formatNumber = (num: number): string => {
  if (num >= 1_000_000) {
    return (
      (num / 1_000_000).toLocaleString("en-US", { maximumFractionDigits: 1 }) +
      "M"
    );
  } else if (num >= 1_000) {
    return (
      (num / 1_000).toLocaleString("en-US", { maximumFractionDigits: 1 }) + "K"
    );
  } else {
    return num.toLocaleString("en-US", { maximumFractionDigits: 1 });
  }
};

const mapConfidenceScoreToRisk = (confidenceScore: string) => {
  if (Number(confidenceScore) >= 9) {
    return "Conservative";
  } else if (Number(confidenceScore) >= 8.5) {
    return "Moderate";
  } else {
    return "Aggressive";
  }
};

const Signals = () => {
  const { address } = useAccount();
  const [moyakiBalance, setMoyakiBalance] = useState<number>(0);
  const [chogBalance, setChogBalance] = useState<number>(0);
  const [dakBalance, setDakBalance] = useState<number>(0);
  const [monBalance, setMonBalance] = useState<number>(0);

  // Get native MON balance
  const { data: monBalanceData } = useBalance({
    address,
    chainId: MONAD_CHAIN_ID,
  });

  // Get other token balances
  const { data } = useReadContracts({
    contracts: trackedTokens
      .filter((t) => isAddress(t.address) && address && isAddress(address))
      .flatMap((t) => [
        {
          address: t.address as `0x${string}`,
          abi: erc20Abi,
          functionName: "balanceOf",
          args: [address],
          chainId: MONAD_CHAIN_ID,
        },
      ]),
  });

  useEffect(() => {
    if (monBalanceData) {
      setMonBalance(Number(monBalanceData.formatted));
    }
  }, [monBalanceData]);

  useEffect(() => {
    if (data && data.length >= 3) {
      console.log("balances", data);
      // Convert BigInt to number, dividing by 10^18 for proper token amount
      setDakBalance(Number((data[0].result as bigint) / BigInt(10 ** 18)));
      setMoyakiBalance(Number((data[1].result as bigint) / BigInt(10 ** 18)));
      setChogBalance(Number((data[2].result as bigint) / BigInt(10 ** 18)));
    }
  }, [data]);

  const tokens: Token[] = [
    {
      symbol: "MON",
      name: "Monad",
      totalHolding: monBalance,
      imageUrl: fetchImageFromSignalText("MON"),
    },
    {
      symbol: "DAK",
      name: "Molandak",
      totalHolding: dakBalance,
      imageUrl: fetchImageFromSignalText("DAK"),
    },
    {
      symbol: "YAKI",
      name: "Moyaki",
      totalHolding: moyakiBalance,
      imageUrl: fetchImageFromSignalText("YAKI"),
    },
    {
      symbol: "CHOG",
      name: "Chog",
      totalHolding: chogBalance,
      imageUrl: fetchImageFromSignalText("CHOG"),
    },
  ];

  const recentTrades: TradeEvent[] = [
    {
      user: "arthur457.nad",
      action: "Sold",
      amount: 10,
      token: "CHOG",
      timeAgo: "19s ago",
      userImageUrl: "/arthur.png",
    },
    {
      user: "imfrancis.nad",
      action: "Bought",
      amount: 5,
      token: "YAKI",
      timeAgo: "14s ago",
      userImageUrl: "/francis.png",
    },
    {
      user: "nfthomas.nad",
      action: "Sold",
      amount: 5,
      token: "YAKI",
      timeAgo: "9s ago",
      userImageUrl: "/thomas.png",
    },
    {
      user: "luduvigo.nad",
      action: "Bought",
      amount: 20,
      token: "DAK",
      timeAgo: "35s ago",
      userImageUrl: "/luduvigo.png",
    },
    {
      user: "stephen.nad",
      action: "Bought",
      amount: 10,
      token: "CHOG",
      timeAgo: "28s ago",
      userImageUrl: "/stephen.png",
    },
    {
      user: "fester.nad",
      action: "Sold",
      amount: 5,
      token: "DAK",
      timeAgo: "11s ago",
      userImageUrl: "/fester.png",
    },
  ];

  const [tradeSignals, setTradeSignals] = useState<TradeSignal[]>([]);
  const [pastSignals, setPastSignals] = useState<TradeSignal[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSignals = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/signals/generated-signals`
        );
        const data = await response.json();
        if (data && Array.isArray(data)) {
          const buySignals = data
            .filter((signal) => signal.type === "Buy")
            .slice(0, 5);
          const sellSignals = data
            .filter((signal) => signal.type === "Sell")
            .slice(0, 5);
          //remove the buy signals from the data buySignals and sellSignals
          const otherSignals = data.filter(
            (signal) =>
              !buySignals.includes(signal) && !sellSignals.includes(signal)
          );
          setTradeSignals(buySignals.concat(sellSignals));
          setPastSignals(otherSignals);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error fetching past signals:", error);
      }
    };

    fetchSignals();
  }, []);

  // State for Yes/No buttons
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >({});

  const handleOptionSelect = (signalId: string, option: string) => {
    setSelectedOptions({
      ...selectedOptions,
      [signalId]: option,
    });
  };

  if (isLoading) {
    return <LoadingOverlay />;
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 pt-16 lg:pt-0">
      <div className="px-2 sm:px-4 py-4 sm:py-6">
        {/* Token Stats */}
        {address && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {tokens.map((token) => (
              <div
                key={token.symbol}
                className="bg-white rounded-lg shadow p-4 flex items-center"
              >
                <div className="flex items-center space-x-3 w-full">
                  <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 relative">
                    <Image
                      src={token.imageUrl || ""}
                      alt={token.name || "token image"}
                      width={128}
                      height={128}
                      className="object-cover rounded-full"
                    />
                  </div>
                  <div className="flex flex-col flex-grow">
                    <span className="text-sm">{token.name}</span>
                    <span className="text-xl font-bold">
                      {formatNumber(token.totalHolding)}{" "}
                      <span className="text-xl font-bold">{token.symbol}</span>
                    </span>
                    {/* <div className="flex justify-between items-center">
                    <div className="flex items-baseline">
                      <span className="text-sm">
                        Price:{" "}
                        {token.price.toLocaleString("en-US", {
                          maximumFractionDigits: 2,
                        })}
                      </span>
                      <span className="text-sm ml-1">$</span>
                    </div>
                  </div> */}
                  </div>
                  <div className="flex flex-col items-end">
                    {/* <span
                    className={`text-sm ${
                      token.priceChange >= 0 ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {token.priceChange >= 0 ? "+" : ""}
                    {token.priceChange}% (last 24h)
                  </span> */}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Recent Trades - Animated Ticker */}
        <div className="mb-6 overflow-hidden relative bg-white rounded-lg shadow">
          <div className="ticker-container py-3 px-2">
            <div className="ticker">
              {[...recentTrades].map((trade, index) => (
                <div key={index} className="ticker-item ml-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 rounded-full bg-gray-200 overflow-hidden flex-shrink-0"></div>
                    <span className="text-sm text-gray-700">{trade.user}</span>
                    <span className="text-xs text-gray-500">
                      {trade.timeAgo}
                    </span>
                  </div>
                  <div className="flex items-center mt-1">
                    <span
                      className={`text-sm ${
                        trade.action === "Bought"
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {trade.action} {trade.amount}k {trade.token}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Signals Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="mb-4 flex items-center">
              <span className="text-yellow-500 text-2xl mr-2">💰</span>
              <span className="font-bold text-2xl">Buy Signals</span>
            </div>

            <div className="space-y-6">
              {tradeSignals
                .filter((signal) => signal.type === "Buy")
                .map((signal, index) => (
                  <div
                    key={index}
                    className="border-b pb-4 last:border-b-0 last:pb-0"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center">
                        <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0 relative mr-2">
                          <Image
                            src={
                              fetchImageFromSignalText(signal.signal_text) || ""
                            }
                            alt={signal.signal_text || "signal image"}
                            width={24}
                            height={24}
                            className="object-cover rounded-full"
                          />
                        </div>
                        <span className="font-medium">
                          {signal.signal_text}
                        </span>
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          mapConfidenceScoreToRisk(signal.confidenceScore) ===
                          "Moderate"
                            ? "bg-yellow-100 text-yellow-800"
                            : mapConfidenceScoreToRisk(
                                signal.confidenceScore
                              ) === "Conservative"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {mapConfidenceScoreToRisk(signal.confidenceScore)}
                      </span>
                    </div>

                    <div className="flex space-x-2 mb-3">
                      <button
                        className={`px-3 py-1 rounded-full text-sm border ${
                          selectedOptions[
                            `${signal.type}-${signal.amount}-${signal.token}`
                          ] === "No"
                            ? "bg-gray-200 border-gray-300"
                            : "bg-white border-gray-300"
                        }`}
                        onClick={() =>
                          handleOptionSelect(
                            `${signal.type}-${signal.amount}-${signal.token}`,
                            "No"
                          )
                        }
                      >
                        No
                      </button>
                      <button
                        className={`px-3 py-1 rounded-full text-sm border
                         bg-violet-700 text-white border-violet-900`}
                        onClick={() =>
                          handleOptionSelect(
                            `${signal.type}-${signal.amount}-${signal.token}`,
                            "Yes"
                          )
                        }
                      >
                        Yes
                      </button>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      {signal.events.slice(0, 4).map((event, idx) => (
                        <div
                          key={idx}
                          className="text-xs bg-gray-100 px-2 py-1 rounded-full whitespace-normal break-words"
                        >
                          {event}
                        </div>
                      ))}
                    </div>
                    <div className="text-xs text-gray-400 mt-2">
                      {getTimeAgo(signal.created_at)}
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="mb-4 flex items-center">
              <span className="text-gray-500 text-2xl mr-2">💸</span>
              <span className="font-bold text-2xl">Sell Signals</span>
            </div>

            <div className="space-y-6">
              {tradeSignals
                .filter((signal) => signal.type === "Sell")
                .map((signal, index) => (
                  <div
                    key={index}
                    className="border-b pb-4 last:border-b-0 last:pb-0"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center">
                        <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0 relative mr-2">
                          <Image
                            src={
                              fetchImageFromSignalText(signal.signal_text) || ""
                            }
                            alt={signal.signal_text || "signal image"}
                            width={24}
                            height={24}
                            className="object-cover rounded-full"
                          />
                        </div>
                        <span className="font-medium">
                          {signal.signal_text}
                        </span>
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          mapConfidenceScoreToRisk(signal.confidenceScore) ===
                          "Moderate"
                            ? "bg-yellow-100 text-yellow-800"
                            : mapConfidenceScoreToRisk(
                                signal.confidenceScore
                              ) === "Conservative"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {mapConfidenceScoreToRisk(signal.confidenceScore)}
                      </span>
                    </div>

                    <div className="flex space-x-2 mb-3">
                      <button
                        className={`px-3 py-1 rounded-full text-sm border ${
                          selectedOptions[
                            `${signal.type}-${signal.amount}-${signal.token}`
                          ] === "No"
                            ? "bg-gray-200 border-gray-300"
                            : "bg-white border-gray-300"
                        }`}
                        onClick={() =>
                          handleOptionSelect(
                            `${signal.type}-${signal.amount}-${signal.token}`,
                            "No"
                          )
                        }
                      >
                        No
                      </button>
                      <button
                        className={`px-3 py-1 rounded-full text-sm border
                        bg-violet-700 text-white border-violet-900`}
                        onClick={() =>
                          handleOptionSelect(
                            `${signal.type}-${signal.amount}-${signal.token}`,
                            "Yes"
                          )
                        }
                      >
                        Yes
                      </button>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      {signal.events.slice(0, 4).map((event, idx) => (
                        <div
                          key={idx}
                          className="text-xs bg-gray-100 px-2 py-1 rounded-full whitespace-normal break-words"
                        >
                          {event}
                        </div>
                      ))}
                    </div>
                    <div className="text-xs text-gray-400 mt-2">
                      {getTimeAgo(signal.created_at)}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {pastSignals.length > 0 && (
          <div className="mb-6">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center m-4 px-4">
                <span className="text-yellow-500 text-2xl mr-2">🕰️</span>
                <span className="font-bold text-2xl">Past Signals</span>
              </div>
              <div>
                {pastSignals.map((signal, index) => (
                  <div
                    key={index}
                    className="flex flex-col bg-gray-50 m-4 p-4 rounded-lg"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0 relative mr-2">
                          <Image
                            src={
                              fetchImageFromSignalText(signal.signal_text) || ""
                            }
                            alt={signal.signal_text || "signal image"}
                            width={24}
                            height={24}
                            className="object-cover rounded-full"
                          />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {signal.signal_text}
                          </span>
                          <span className="text-xs text-gray-400">
                            {getTimeAgo(signal.created_at)}
                          </span>
                        </div>
                      </div>
                      <span className="text-xs px-2 py-1 rounded bg-gray-200 text-gray-700">
                        Expired
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mt-3">
                      {signal.events.slice(0, 4).map((event, idx) => (
                        <div
                          key={idx}
                          className="text-xs bg-gray-100 px-2 py-1 rounded-full whitespace-normal break-words"
                        >
                          {event}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CSS for ticker animation */}
      <style jsx>{`
        .ticker-container {
          overflow: hidden;
          width: 100%;
          height: 60px;
        }

        .ticker {
          display: flex;
          white-space: nowrap;
          animation: ticker 30s linear infinite;
        }

        .ticker-item {
          display: inline-block;
          flex-shrink: 0;
        }

        @keyframes ticker {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(
              -33.33%
            ); /* Move by 1/3 to ensure smooth loop with tripled content */
          }
        }
      `}</style>
    </div>
  );
};

export default Signals;
