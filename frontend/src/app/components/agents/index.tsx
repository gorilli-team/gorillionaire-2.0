"use client";

import React, { useState } from "react";

const Agents = () => {
  const [isMinting, setIsMinting] = useState(false);
  const [mintSuccess, setMintSuccess] = useState(false);

  const handleMint = () => {
    setIsMinting(true);
    // Simulate minting process
    setTimeout(() => {
      setIsMinting(false);
      setMintSuccess(true);
    }, 2000);
  };

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="w-full px-4 py-6">
        {/* Main info section - now full width */}
        <div className="flex flex-col items-center justify-center">
          {/* <div className="w-full bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg p-4 md:p-8 text-center shadow-lg">
            <h2 className="text-2xl md:text-3xl font-bold text-purple-800 mb-4 md:mb-6">
              🤖 Monad Trading Agents: The Future of L1 Trading 🦍
            </h2>
            <p className="text-purple-700 text-base md:text-lg mb-4 md:mb-6">
              Deep in the Monad blockchain, our autonomous agents are being
              forged to harness the power of the fastest L1 ever built.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 text-blue-700">
              <p className="font-medium">🤖 Microsecond-level MEV Detection</p>
              <p className="font-medium">
                🦍 Gorillionaire-grade Trading Strategies
              </p>
              <p className="font-medium">
                🤖 High-Frequency Arbitrage on Monad
              </p>
              <p className="font-medium">🦍 Alpha Opportunities</p>
            </div>
            <div className="mt-6 md:mt-8 p-4 bg-purple-200 rounded-lg">
              <p className="text-purple-800 font-semibold">
                Where Traditional MEV Bots Meet Gorilla Trading Power
              </p>
              <p className="text-purple-600 mt-2">
                Powered by Monad 10,000 TPS Infrastructure
              </p>
            </div>
          </div> */}

          {/* NFT Access Section - now full width */}
          <div className="w-full">
            <div className="bg-white rounded-lg border border-gray-200 shadow-md overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4">
                <h3 className="text-lg md:text-xl font-bold text-white">
                  🔒 Unlock Premium Signals
                </h3>
              </div>

              <div className="p-4 md:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800">
                      Gorillionaire API Access NFT
                    </h4>
                    <p className="text-gray-600 mt-1">Mint price: 0.05 MON</p>
                  </div>
                  <div className="h-16 w-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
                    <span className="text-2xl text-white">🦍</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                  <div className="flex items-start">
                    <span className="text-green-500 mr-2 flex-shrink-0">✓</span>
                    <p className="text-gray-700">
                      Exclusive access to all trading signals
                    </p>
                  </div>
                  <div className="flex items-start">
                    <span className="text-green-500 mr-2 flex-shrink-0">✓</span>
                    <p className="text-gray-700">
                      Real-time API endpoints with confidence scores
                    </p>
                  </div>
                  <div className="flex items-start">
                    <span className="text-green-500 mr-2 flex-shrink-0">✓</span>
                    <p className="text-gray-700">
                      Historical price data for all tokens
                    </p>
                  </div>
                  <div className="flex items-start">
                    <span className="text-green-500 mr-2 flex-shrink-0">✓</span>
                    <p className="text-gray-700">
                      Priority access to new agent releases
                    </p>
                  </div>
                </div>

                <div className="bg-gray-100 p-4 rounded-lg mb-6">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2 flex-shrink-0"></div>
                    <p className="text-sm text-gray-700">
                      Currently <span className="font-medium">247</span>{" "}
                      Gorillionaires have minted
                    </p>
                  </div>
                </div>

                {mintSuccess ? (
                  <div className="bg-green-100 border border-green-200 text-green-700 p-4 rounded-lg mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <span className="text-xl mr-2 flex-shrink-0">✅</span>
                      <div>
                        <p className="font-medium">NFT Successfully Minted!</p>
                        <p className="text-sm">
                          Your API access is now unlocked
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={handleMint}
                    disabled={isMinting}
                    className={`w-full py-3 px-4 rounded-lg font-medium text-white ${
                      isMinting
                        ? "bg-gray-400"
                        : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                    } transition-all duration-200 flex items-center justify-center`}
                  >
                    {isMinting ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Minting...
                      </>
                    ) : (
                      "Mint NFT for API Access"
                    )}
                  </button>
                )}

                {mintSuccess && (
                  <div className="mt-6">
                    <h5 className="font-medium text-gray-800 mb-2">
                      Your API Keys
                    </h5>
                    <div className="bg-gray-100 p-3 rounded-lg flex items-center justify-between">
                      <code className="text-xs text-gray-600 truncate">
                        0x86f6D762B53f21Te53fa5762D294d576A36...
                      </code>
                      <button className="text-purple-600 hover:text-purple-800 flex-shrink-0 ml-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t border-gray-200 p-4 bg-gray-50">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="mr-1">Powered by</span>
                    <span className="font-medium text-purple-600">
                      Monad Chain
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className="h-2 w-2 bg-green-500 rounded-full mr-1 flex-shrink-0"></div>
                    <span className="text-sm text-gray-600">
                      Live on mainnet
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Mints Section - full width and responsive */}
            <div className="mt-8 bg-white rounded-lg border border-gray-200 shadow-md overflow-hidden">
              <div className="bg-gray-50 border-b border-gray-200 p-4">
                <h3 className="font-medium text-gray-700">Recent NFT Mints</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {[
                  {
                    address: "0x86f6D762B53f21Te53fa5762D294d576A36",
                    time: "5 mins ago",
                  },
                  {
                    address: "0x71c8Fb21a22d95CEa35dD9D4eA72B17E",
                    time: "12 mins ago",
                  },
                  { address: "0x3bFc36B19f8d5331480", time: "28 mins ago" },
                ].map((mint, index) => (
                  <div
                    key={index}
                    className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2"
                  >
                    <div className="flex items-center">
                      <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 mr-3 flex-shrink-0">
                        🦍
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-sm font-medium text-gray-700 truncate">
                          {mint.address}
                        </p>
                        <p className="text-xs text-gray-500">{mint.time}</p>
                      </div>
                    </div>
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full sm:ml-2 flex-shrink-0">
                      Minted
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Agents;
