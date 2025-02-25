import React, { useState, useEffect } from "react";
import Image from "next/image";

const Signals = () => {
  // Token data from the provided list
  const initialTokens = [
    {
      id: 1,
      name: "Wrapped Monad",
      symbol: "MON",
      supply: "93,415,274,755",
      holders: 103039,
      age: "17 days ago",
      address: "0x760A...5701",
      image:
        "https://imagedelivery.net/tWwhAahBw7afBzFUrX5mYQ/6679b698-a845-412b-504b-23463a3e1900/public",
      isActive: false,
    },
    {
      id: 2,
      name: "Tether USD",
      symbol: "USDT",
      supply: "27,937",
      holders: 229794,
      age: "28 days 6 hrs ago",
      address: "0x88b8...055D",
      image:
        "https://imagedelivery.net/cBNDGgkrsEA-b_ixIp9SkQ/images.png/public",
      isActive: false,
    },
    {
      id: 3,
      name: "USD Coin",
      symbol: "USDC",
      supply: "87,831",
      holders: 1042219,
      age: "28 days 6 hrs ago",
      address: "0xf817...E5Ea",
      image: "https://imagedelivery.net/cBNDGgkrsEA-b_ixIp9SkQ/usdc.png/public",

      isActive: false,
    },
    {
      id: 11,
      name: "Molandak",
      symbol: "DAK",
      supply: "296,997",
      holders: 603708,
      age: "10 days 20 hrs ago",
      address: "0x0F0B...c714",
      image:
        "https://imagedelivery.net/tWwhAahBw7afBzFUrX5mYQ/27759359-9374-4995-341c-b2636a432800/public",
      isActive: false,
    },
    {
      id: 12,
      name: "Moyaki",
      symbol: "YAKI",
      supply: "288,018",
      holders: 536061,
      age: "10 days 20 hrs ago",
      address: "0xfe14...0C50",
      image:
        "https://imagedelivery.net/tWwhAahBw7afBzFUrX5mYQ/6679b698-a845-412b-504b-23463a3e1900/public",

      isActive: false,
    },
    {
      id: 13,
      name: "Chog",
      symbol: "CHOG",
      supply: "275,880",
      holders: 565297,
      age: "10 days 20 hrs ago",
      address: "0xE059...4E6B",
      image:
        "https://imagedelivery.net/tWwhAahBw7afBzFUrX5mYQ/5d1206c2-042c-4edc-9f8b-dcef2e9e8f00/public",
      isActive: false,
    },
  ];

  // Add metrics for tokens
  const processedTokens = initialTokens.map((token) => {
    // Calculate activity score based on holders and recency
    const holdersValue = token.holders || 1;
    const isNew = token.age.includes("secs") || token.age.includes("min");
    const isEstablished = holdersValue > 10000;

    // Generate random but semi-realistic metrics
    const liquidityScore = isEstablished
      ? Math.random() * 0.5 + 0.5
      : Math.random() * 0.7 + 0.1;
    const volumeScore = isEstablished
      ? Math.random() * 0.4 + 0.6
      : Math.random() * 0.6 + 0.1;
    const priceChange = (Math.random() * 20 - 10).toFixed(2); // -10% to +10%

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
      // Add explorer link for each token (would normally come from your data)
      explorerUrl: `https://testnet.monadexplorer.com/address/${
        token.address || "0x760AfE86e5de5fa0Ee542fc7B7B713e1c5425701"
      }`,
    };
  });

  // State to store tokens and track blinking ones
  const [tokens, setTokens] = useState(processedTokens);
  const [blinkingTokens, setBlinkingTokens] = useState(new Set());

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
            return {
              ...token,
              metrics: {
                ...token.metrics,
                priceChange: (Math.random() * 20 - 7).toFixed(2), // Bias towards positive
                volume: (
                  parseFloat(token.metrics.volume) +
                  (Math.random() * 0.2 - 0.1)
                ).toFixed(2),
              },
              isActive: true,
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

  // Sort tokens: blink first, then by activity score
  const sortedTokens = [...tokens].sort((a, b) => {
    if (blinkingTokens.has(a.id) && !blinkingTokens.has(b.id)) return -1;
    if (!blinkingTokens.has(a.id) && blinkingTokens.has(b.id)) return 1;
    return b.activityScore - a.activityScore;
  });

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Token Signals</h1>
          <div className="text-sm text-gray-500">
            Showing {tokens.length} tokens • Live updates (5s)
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {sortedTokens.map((token) => (
            <div
              key={token.id}
              className={`
              aspect-square rounded-lg shadow-md p-3 transition-all duration-300
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
                <div className="flex items-center mb-2">
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
                      <span className="font-bold text-xs">{token.symbol}</span>
                    </div>
                  )}
                  <div className="overflow-hidden">
                    <p className="font-bold text-sm truncate">{token.name}</p>
                    <p className="text-xs text-gray-500">{token.symbol}</p>
                  </div>
                </div>

                <div className="flex flex-col mt-auto text-xs">
                  <div className="flex justify-between mt-1">
                    <span className="text-gray-500">Price</span>
                    <span
                      className={
                        parseFloat(token.metrics.priceChange) > 0
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {token.metrics.priceChange}%
                    </span>
                  </div>

                  <div className="flex justify-between mt-1">
                    <span className="text-gray-500">Volume</span>
                    <span>{token.metrics.volume}</span>
                  </div>

                  <div className="flex justify-between mt-1">
                    <span className="text-gray-500">Holders</span>
                    <span>{token.holders.toLocaleString() || "-"}</span>
                  </div>

                  <div className="mt-2 w-full bg-gray-200 rounded-full h-1">
                    <div
                      className={`h-1 rounded-full ${
                        parseFloat(token.metrics.priceChange) > 0
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                      style={{
                        width: `${Math.min(
                          Math.abs(parseFloat(token.metrics.priceChange)) * 5,
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
                    className="mt-2 text-gray-500 hover:text-gray-700 text-center text-xs flex items-center justify-center font-medium"
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
      </div>
    </div>
  );
};

export default Signals;
