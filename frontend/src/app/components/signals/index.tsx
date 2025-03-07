"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
type Token = {
  symbol: string;
  name: string;
  price: number;
  priceChange: number;
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
  created_at: string;
};

const fetchImageFromSignalText = (signalText: string) => {
  //find the first instance of one of the following words: CHOG, DAK, YAKI
  const token = signalText?.split(" ")[1];
  console.log(token);
  if (token === "CHOG") {
    return "https://imagedelivery.net/tWwhAahBw7afBzFUrX5mYQ/5d1206c2-042c-4edc-9f8b-dcef2e9e8f00/public";
  } else if (token === "DAK") {
    return "https://imagedelivery.net/tWwhAahBw7afBzFUrX5mYQ/27759359-9374-4995-341c-b2636a432800/public";
  } else if (token === "YAKI") {
    return "https://imagedelivery.net/tWwhAahBw7afBzFUrX5mYQ/6679b698-a845-412b-504b-23463a3e1900/public";
  } else {
    //return placeholder image/ no token
    return "https://imagedelivery.net/cBNDGgkrsEA-b_ixIp9SkQ/I_t8rg_V_400x400.jpg/public";
  }
};

const findTokenImage = (symbol: string) => {
  if (symbol === "DAK") {
    return "https://imagedelivery.net/tWwhAahBw7afBzFUrX5mYQ/27759359-9374-4995-341c-b2636a432800/public";
  } else if (symbol === "YAKI") {
    return "https://imagedelivery.net/tWwhAahBw7afBzFUrX5mYQ/6679b698-a845-412b-504b-23463a3e1900/public";
  } else if (symbol === "CHOG") {
    return "https://imagedelivery.net/tWwhAahBw7afBzFUrX5mYQ/5d1206c2-042c-4edc-9f8b-dcef2e9e8f00/public";
  }
};

const getTimeAgo = (date: string) => {
  const seconds = Math.floor(
    (new Date().getTime() - new Date(date).getTime()) / 1000
  );

  let interval = seconds / 31536000; // years
  if (interval > 1) return Math.floor(interval) + " years ago";

  interval = seconds / 2592000; // months
  if (interval > 1) return Math.floor(interval) + " months ago";

  interval = seconds / 86400; // days
  if (interval > 1) return Math.floor(interval) + " days ago";

  interval = seconds / 3600; // hours
  if (interval > 1) return Math.floor(interval) + " hours ago";

  interval = seconds / 60; // minutes
  if (interval > 1) return Math.floor(interval) + " minutes ago";

  return Math.floor(seconds) + " seconds ago";
};

const Signals = () => {
  const tokens: Token[] = [
    {
      symbol: "DAK",
      name: "Molandak",
      totalHolding: 44200,
      price: 1507.38,
      priceChange: 2,
      imageUrl: findTokenImage("DAK"),
    },
    {
      symbol: "YAKI",
      name: "Moyaki",
      totalHolding: 24700,
      price: 2923.52,
      priceChange: -5,
      imageUrl: findTokenImage("YAKI"),
    },
    {
      symbol: "CHOG",
      name: "Chog",
      totalHolding: 12600,
      price: 1007.97,
      priceChange: 2,
      imageUrl: findTokenImage("CHOG"),
    },
  ];

  const recentTrades: TradeEvent[] = [
    {
      user: "arthur457.lens",
      action: "Sold",
      amount: 10,
      token: "CHOG",
      timeAgo: "19s ago",
      userImageUrl: "/arthur.png",
    },
    {
      user: "imfrancis.lens",
      action: "Bought",
      amount: 5,
      token: "YAKI",
      timeAgo: "14s ago",
      userImageUrl: "/francis.png",
    },
    {
      user: "nfthomas.lens",
      action: "Sold",
      amount: 5,
      token: "YAKI",
      timeAgo: "9s ago",
      userImageUrl: "/thomas.png",
    },
    {
      user: "luduvigo.lens",
      action: "Bought",
      amount: 20,
      token: "DAK",
      timeAgo: "35s ago",
      userImageUrl: "/luduvigo.png",
    },
    {
      user: "stephen.lens",
      action: "Bought",
      amount: 10,
      token: "CHOG",
      timeAgo: "28s ago",
      userImageUrl: "/stephen.png",
    },
    {
      user: "fester.lens",
      action: "Sold",
      amount: 5,
      token: "DAK",
      timeAgo: "11s ago",
      userImageUrl: "/fester.png",
    },
  ];

  const [tradeSignals, setTradeSignals] = useState<TradeSignal[]>([]);

  //eslint-disable-next-line
  const [pastSignals, setPastSignals] = useState<TradeSignal[]>([]);

  useEffect(() => {
    const fetchSignals = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/signals/generated-signals`
        );
        const data = await response.json();
        const firstFiveSignals = data.slice(0, 5);
        const otherSignals = data.slice(5);
        setTradeSignals(firstFiveSignals);
        setPastSignals(otherSignals);
        console.log(data);
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

  return (
    <div className="w-full min-h-screen bg-gray-50 pt-16 lg:pt-0">
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6">
        {/* Token Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {tokens.map((token) => (
            <div
              key={token.symbol}
              className="bg-white rounded-lg shadow p-4 flex items-center"
            >
              <div className="flex items-center space-x-3 w-full">
                <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 relative">
                  <Image
                    src={token.imageUrl || ""}
                    alt={token.name || ""}
                    width={128}
                    height={128}
                    className="object-cover rounded-full"
                  />
                </div>
                <div className="flex flex-col flex-grow">
                  <span className="text-sm">{token.name}</span>
                  <span className="text-xl font-bold">
                    {(token.totalHolding / 1000).toLocaleString("en-US", {
                      maximumFractionDigits: 1,
                    })}
                    k <span className="text-xl font-bold">{token.symbol}</span>
                  </span>
                  <div className="flex justify-between items-center">
                    <div className="flex items-baseline">
                      <span className="text-sm">
                        Price:{" "}
                        {token.price.toLocaleString("en-US", {
                          maximumFractionDigits: 2,
                        })}
                      </span>
                      <span className="text-sm ml-1">$</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span
                    className={`text-sm ${
                      token.priceChange >= 0 ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {token.priceChange >= 0 ? "+" : ""}
                    {token.priceChange}% (last 24h)
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Trades - Animated Ticker */}
        <div className="mb-6 overflow-hidden relative bg-white rounded-lg shadow">
          <div className="ticker-container py-3 px-2">
            <div className="ticker">
              {[...recentTrades, ...recentTrades, ...recentTrades].map(
                (trade, index) => (
                  <div key={index} className="ticker-item ml-4">
                    {/* <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 rounded-full bg-gray-200 overflow-hidden flex-shrink-0"></div>
                      <span className="text-sm text-gray-700">
                        {trade.user}
                      </span>
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
                    </div> */}
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        {/* Main Signals Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="mb-4 flex items-center">
              <span className="text-yellow-500 text-2xl mr-2">🪙</span>
              <span className="font-bold text-2xl">Buy</span>
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
                            alt={signal.signal_text}
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
                          signal.risk === "Moderate"
                            ? "bg-yellow-100 text-yellow-800"
                            : signal.risk === "Conservative"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {signal.risk}
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
                         bg-blue-500 text-white border-blue-500`}
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
                    {/* 
                    add here the date: time timeAgo
                    */}
                    <div className="text-xs text-gray-400 mt-2">
                      {getTimeAgo(signal.created_at)}
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      {/* <div className="col-span-2">
                        <div className="flex items-center text-xs text-orange-500">
                          <span>
                            🔥 Spike: {signal.spikes.amount} transfers
                          </span>
                        </div>
                      </div> */}
                      {/* 
                      {signal.transfers.map((transfer, idx) => (
                        <div
                          key={idx}
                          className="flex items-center text-xs text-gray-500"
                        >
                          <span>
                            💸 {transfer.amount} {transfer.token} transfer
                          </span>
                        </div>
                      ))} */}
                    </div>

                    {/* <div className="text-xs text-gray-400 mt-2">
                      {signal.timeAgo}
                    </div> */}
                  </div>
                ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="mb-4 flex items-center">
              <span className="text-gray-500 text-2xl mr-2">💰</span>
              <span className="font-bold text-2xl">Sell</span>
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
                          {/* <Image
                            src={findTokenImage(signal.token) || ""}
                            alt={signal.token}
                            width={24}
                            height={24}
                            className="object-cover rounded-full"
                          /> */}
                        </div>
                        <span className="font-medium">
                          Sell {signal.amount} {signal.token}?
                        </span>
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          signal.risk === "Moderate"
                            ? "bg-yellow-100 text-yellow-800"
                            : signal.risk === "Conservative"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {signal.risk}
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
                        className={`px-3 py-1 rounded-full text-sm border ${
                          selectedOptions[
                            `${signal.type}-${signal.amount}-${signal.token}`
                          ] === "Yes"
                            ? "bg-blue-500 text-white border-blue-500"
                            : "bg-white border-gray-300"
                        }`}
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

                    <div className="grid grid-cols-2 gap-2">
                      <div className="col-span-2">
                        <div className="flex items-center text-xs text-orange-500">
                          {/* <span>
                            🔥 Spike: {signal.spikes.amount} transfers
                          </span> */}
                        </div>
                      </div>

                      {/* {signal.transfers.map((transfer, idx) => (
                        <div
                          key={idx}
                          className="flex items-center text-xs text-gray-500"
                        >
                          <span>
                            💸 {transfer.amount} {transfer.token} transfer
                          </span>
                        </div>
                      ))} */}
                    </div>

                    {/* <div className="text-xs text-gray-400 mt-2">
                      {signal.timeAgo}
                    </div> */}
                  </div>
                ))}
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center mb-4">
            <span className="text-gray-500 mr-2">🕰️</span>
            <span className="font-medium text-lg">Past Signals</span>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            {pastSignals.map((signal, index) => (
              <div
                key={index}
                className="flex justify-between items-center bg-gray-50 m-4 p-4 rounded-lg"
              >
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0 relative mr-2">
                    <Image
                      src={fetchImageFromSignalText(signal.signal_text) || ""}
                      alt={signal.signal_text}
                      width={24}
                      height={24}
                      className="object-cover rounded-full"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium">{signal.signal_text}</span>
                    <span className="text-xs text-gray-400">
                      {getTimeAgo(signal.created_at)}
                    </span>
                  </div>
                </div>
                <span className="text-xs px-2 py-1 rounded bg-gray-200 text-gray-700">
                  Expired
                </span>
              </div>
            ))}
          </div>
        </div>
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
