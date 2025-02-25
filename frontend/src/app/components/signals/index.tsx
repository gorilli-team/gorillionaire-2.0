"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { trackedTokens } from "@/app/shared/tokenData";

type TradingLabel = "DEGEN" | "AGGRESSIVE" | "MODERATE" | "CONSERVATIVE";

const Signals = () => {
  const [activeTab, setActiveTab] = useState<"tokens" | "pools">("tokens");

  // Remove the useMemo initialTokens definition and use the imported one directly
  const processedTokens = trackedTokens.map((token) => ({
    ...token,
    metrics: {
      liquidity: "0.50",
      volume: "0.50",
      priceChange: "0.00",
    },
    activityScore: 0.1,
    explorerUrl: `https://testnet.monadexplorer.com/address/${
      token.address || "0x760AfE86e5de5fa0Ee542fc7B7B713e1c5425701"
    }`,
    tradingLabel: "MODERATE" as TradingLabel,
    signalScore: "1.50",
    isActive: false,
  }));

  // Initialize tokens state with processed tokens
  const [tokens, setTokens] = useState(processedTokens);
  const [blinkingTokens, setBlinkingTokens] = useState(new Set());
  const [filterLabel, setFilterLabel] = useState("ALL");

  // Process initial metrics on client-side only
  useEffect(() => {
    const initialProcessing = trackedTokens.map((token) => {
      // Move all the random calculations here
      const holdersValue = token.holders || 1;
      const isNew = token.age.includes("secs") || token.age.includes("min");
      const isEstablished = holdersValue > 10000;

      const liquidityScore = isEstablished
        ? Math.random() * 0.5 + 0.5
        : Math.random() * 0.7 + 0.1;
      const volumeScore = isEstablished
        ? Math.random() * 0.4 + 0.6
        : Math.random() * 0.6 + 0.1;
      const priceChange = (Math.random() * 20 - 10).toFixed(2);

      // Determine trading label based on metrics
      const aggregateScore = (
        Number(liquidityScore) * 0.3 +
        Number(volumeScore) * 0.3 +
        Math.abs(Number(priceChange)) * 0.4
      ).toFixed(2);

      // Assign trading label
      let tradingLabel: TradingLabel = "MODERATE"; // Default value
      if (parseFloat(aggregateScore) > 5) {
        tradingLabel = "DEGEN";
      } else if (parseFloat(aggregateScore) > 2) {
        tradingLabel = "AGGRESSIVE";
      } else if (parseFloat(aggregateScore) > 1) {
        tradingLabel = "MODERATE";
      } else if (parseFloat(aggregateScore) > 0.6) {
        tradingLabel = "CONSERVATIVE";
      }

      return {
        ...token,
        metrics: {
          liquidity: liquidityScore.toFixed(2),
          volume: volumeScore.toFixed(2),
          priceChange: priceChange,
        },
        activityScore: isNew
          ? 0.9
          : (Math.min(holdersValue, 1000000) / 1000000) * 0.8 + 0.1,
        explorerUrl: `https://testnet.monadexplorer.com/address/${
          token.address || "0x760AfE86e5de5fa0Ee542fc7B7B713e1c5425701"
        }`,
        tradingLabel: tradingLabel,
        signalScore: parseFloat(aggregateScore).toFixed(2), // Multiplied by 3 to make scores more like in the screenshot
        isActive: false,
      };
    });

    setTokens(initialProcessing);
  }, []);

  // Function to update token data and trigger blinking effect
  useEffect(() => {
    // Update tokens and trigger blinks
    const updateInterval = setInterval(() => {
      // Randomly select 1-3 tokens to update
      const numUpdates = Math.floor(Math.random() * 3) + 1;
      const updatedTokenIds = new Set();
      const newBlinkingIds = new Set();

      for (let i = 0; i < numUpdates; i++) {
        const randomIndex = Math.floor(Math.random() * tokens.length);
        const tokenId = tokens[randomIndex].id;
        updatedTokenIds.add(tokenId);

        // Determine if this update should trigger a blink (positive price change)
        const newPriceChange = (Math.random() * 20 - 7).toFixed(2); // Bias towards positive
        if (parseFloat(newPriceChange) > 3) {
          newBlinkingIds.add(tokenId);
        }
      }

      // Update tokens
      setTokens((prevTokens) => {
        return prevTokens.map((token) => {
          if (updatedTokenIds.has(token.id)) {
            const newPriceChange = (Math.random() * 20 - 7).toFixed(2);
            const newVolumeScore = (
              parseFloat(token.metrics.volume) +
              (Math.random() * 0.2 - 0.1)
            ).toFixed(2);

            // Generate aggregate score based on probability
            let newAggregateScore: number;
            if (Math.random() < 0.8) {
              // 80% chance: score between 0 and 3
              newAggregateScore = Math.random() * 3;
            } else {
              // 20% chance: score between 3 and 15
              newAggregateScore = Math.random() * 12 + 3;
            }

            // Assign new trading label based on the new ranges
            let newTradingLabel: TradingLabel = "MODERATE";
            if (newAggregateScore > 5) {
              newTradingLabel = "DEGEN";
            } else if (newAggregateScore > 3) {
              newTradingLabel = "AGGRESSIVE";
            } else if (newAggregateScore > 1.5) {
              newTradingLabel = "MODERATE";
            } else {
              newTradingLabel = "CONSERVATIVE";
            }

            return {
              ...token,
              metrics: {
                ...token.metrics,
                priceChange: newPriceChange,
                volume: newVolumeScore,
              },
              isActive: true,
              tradingLabel: newTradingLabel,
              signalScore: newAggregateScore.toFixed(2),
            };
          }
          return token;
        });
      });

      // Set blinking tokens
      setBlinkingTokens(newBlinkingIds);

      // Remove blink after 2 seconds
      setTimeout(() => {
        setBlinkingTokens(new Set());
      }, 2000);
    }, 5000); // 5-second updates

    return () => clearInterval(updateInterval);
  }, [tokens]);

  // Filter tokens based on selected label
  const filteredTokens = tokens.filter(
    (token) => filterLabel === "ALL" || token.tradingLabel === filterLabel
  );

  // Sort tokens: blink first, then by activity score
  const sortedTokens = [...filteredTokens].sort((a, b) => {
    if (blinkingTokens.has(a.id) && !blinkingTokens.has(b.id)) return -1;
    if (!blinkingTokens.has(a.id) && blinkingTokens.has(b.id)) return 1;
    return parseFloat(b.signalScore) - parseFloat(a.signalScore);
  });

  // Label color mapping
  const labelColorMap: Record<TradingLabel, string> = {
    DEGEN: "bg-purple-600 text-white",
    AGGRESSIVE: "bg-red-500 text-white",
    MODERATE: "bg-yellow-500 text-white",
    CONSERVATIVE: "bg-blue-500 text-white",
  };

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              <button
                onClick={() => setActiveTab("tokens")}
                className={`
                  py-4 px-1 border-b-2 font-medium text-sm
                  ${
                    activeTab === "tokens"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }
                `}
              >
                Single Token Signals
              </button>
              <button
                onClick={() => setActiveTab("pools")}
                className={`
                  py-4 px-1 border-b-2 font-medium text-sm
                  ${
                    activeTab === "pools"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }
                `}
              >
                Pool Signals
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "tokens" ? (
          <>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Signals</h1>
              <div className="flex items-center">
                <span className="text-sm text-gray-500 mr-4">
                  Showing {sortedTokens.length} of {tokens.length} tokens • Live
                  updates (5s)
                </span>
                <select
                  className="bg-white border border-gray-300 rounded-md px-3 py-1 text-sm"
                  value={filterLabel}
                  onChange={(e) => setFilterLabel(e.target.value)}
                >
                  <option value="ALL">All Signals</option>
                  <option value="DEGEN">DEGEN</option>
                  <option value="AGGRESSIVE">AGGRESSIVE</option>
                  <option value="MODERATE">MODERATE</option>
                  <option value="CONSERVATIVE">CONSERVATIVE</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4">
              {sortedTokens.map((token) => (
                <div
                  key={token.id}
                  className={`
                  relative rounded-lg shadow-md p-3 transition-all duration-300
                  ${
                    blinkingTokens.has(token.id)
                      ? "bg-green-100 animate-pulse border-2 border-green-500"
                      : "bg-white"
                  }
                  ${
                    parseFloat(token.metrics.priceChange) > 5
                      ? "border-l-4 border-l-green-500"
                      : parseFloat(token.metrics.priceChange) > 0
                      ? "border-l-4 border-l-blue-400"
                      : "border-l-4 border-l-red-400"
                  }
                `}
                >
                  <div className="flex flex-col h-full">
                    {/* Header Section - Redesigned */}
                    <div className="flex flex-col mb-2">
                      <div className="flex items-center mb-1">
                        {token.image ? (
                          <Image
                            src={token.image}
                            alt={token.name}
                            width={32}
                            height={32}
                            className="mr-2 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-2">
                            <span className="font-bold text-xs">
                              {token.symbol}
                            </span>
                          </div>
                        )}
                        <div className="overflow-hidden mr-2">
                          <p className="font-bold text-sm truncate">
                            {token.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {token.symbol}
                          </p>
                        </div>
                      </div>

                      {/* Trading Label - Moved to a separate row */}
                      {token.tradingLabel && (
                        <div className="flex justify-end">
                          <div
                            className={`px-2 py-1 rounded-full text-xs font-bold ${
                              labelColorMap[token.tradingLabel as TradingLabel]
                            }`}
                          >
                            {token.tradingLabel}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Signal score displayed prominently */}
                    <div className="flex justify-between mb-2 bg-gray-100 p-2 rounded">
                      <span className="text-sm text-gray-700">
                        Signal Score
                      </span>
                      <span className="text-sm font-bold">
                        {token.signalScore}
                      </span>
                    </div>

                    <div className="flex flex-col mt-2 text-sm">
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Price</span>
                        <span
                          className={
                            parseFloat(token.metrics.priceChange) > 0
                              ? "text-green-600 font-medium"
                              : "text-red-600 font-medium"
                          }
                        >
                          {parseFloat(token.metrics.priceChange) > 0 ? "+" : ""}
                          {token.metrics.priceChange}%
                        </span>
                      </div>

                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Volume</span>
                        <span>{token.metrics.volume}</span>
                      </div>

                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Holders</span>
                        <span>{token.holders.toLocaleString() || "-"}</span>
                      </div>

                      <div className="w-full bg-gray-200 rounded-full h-1 mb-3">
                        <div
                          className={`h-1 rounded-full ${
                            parseFloat(token.metrics.priceChange) > 0
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                          style={{
                            width: `${Math.min(
                              Math.abs(parseFloat(token.metrics.priceChange)) *
                                5,
                              100
                            )}%`,
                          }}
                        ></div>
                      </div>

                      {/* Explorer Link */}
                      <a
                        href={token.explorerUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-500 hover:text-gray-700 text-center text-xs flex items-center justify-center font-medium"
                      >
                        <svg
                          className="w-3 h-3 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          ></path>
                        </svg>
                        View in Explorer
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          // Pools Tab Content
          <div className="flex flex-col items-center justify-center py-20">
            <div className="bg-purple-100 rounded-lg p-8 max-w-2xl text-center">
              <h2 className="text-2xl font-bold text-purple-800 mb-4">
                🦍 Coming Soon: For Real DEGENs Only 🦍
              </h2>
              <p className="text-purple-700">
                We are cooking up something special for the true degens out
                there. Pool signals will give you the edge you need in the DeFi
                jungle.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Signals;
