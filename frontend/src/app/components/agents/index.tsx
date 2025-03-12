"use client";

import React, { useState, useEffect } from "react";
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { usePrivy } from "@privy-io/react-auth";
import { parseEther } from "viem";
import { NFT_ACCESS_ADDRESS } from "../../utils/constants";
import ACCESS_NFT_ABI from "../../../../../access-nft/abi/AccessNFTAbi.json";

const Agents = () => {
  const { isConnected, address } = useAccount();
  const { login } = usePrivy();
  const [isMinting, setIsMinting] = useState(false);
  const [mintSuccess, setMintSuccess] = useState(false);
  const [hasNFT, setHasNFT] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useReadContract({
    address: NFT_ACCESS_ADDRESS,
    abi: ACCESS_NFT_ABI,
    functionName: 's_price',
    query: { enabled: isConnected },
  });

  const { data: nftBalance } = useReadContract({
    address: NFT_ACCESS_ADDRESS,
    abi: ACCESS_NFT_ABI,
    functionName: 'balanceOf',
    args: [address],
    query: { enabled: isConnected && !!address },
  });

  useEffect(() => {
    if (typeof nftBalance === 'bigint' || typeof nftBalance === 'number') {
      if (nftBalance > 0) {
        setHasNFT(true);
        setMintSuccess(true);
      }
    }
  }, [nftBalance]);

  const { writeContract, data: hash, error } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
    query: { enabled: !!hash },
  });


  useEffect(() => {
    if (isConfirming) {
      setIsMinting(true);
    } else if (isConfirmed) {
      setIsMinting(false);
      setMintSuccess(true);
    } else if (error) {
      setIsMinting(false);
      setErrorMessage(error.message || "Transaction failed. Please try again.");
    }
  }, [isConfirming, isConfirmed, error]);

  const handleMint = () => {
    if (!isConnected) {
      login();
      return;
    }

    setErrorMessage("");
    setIsMinting(true);
    
    try {
      // Call mint function with 1 MON as payment
      writeContract({
        address: NFT_ACCESS_ADDRESS,
        abi: ACCESS_NFT_ABI,
        functionName: 'mint',
        value: parseEther('1'), // 1 MON = 1 * 10^18 wei
      });
    } catch (err) {
      console.error("Mint error:", err);
      setIsMinting(false);
      setErrorMessage("Failed to start minting process. Please try again.");
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="w-full px-4 py-6">
        {/* Main info section - now full width */}
        <div className="flex flex-col items-center justify-center">
          {/* NFT Access Section - now full width with clearer agent messaging */}
          <div className="w-full">
            <div className="bg-white rounded-lg border border-gray-200 shadow-md overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4">
                <h3 className="text-lg md:text-xl font-bold text-white">
                  🔒 Unlock Premium Agent Trading Signals
                </h3>
              </div>

              <div className="p-4 md:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800">
                      Agent Trading API Access NFT
                    </h4>
                    <p className="text-gray-600 mt-1">Mint price: 1 MON</p>
                  </div>
                  <div className="h-16 w-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
                    <span className="text-2xl text-white">🦍</span>
                  </div>
                </div>

                <div className="bg-indigo-50 p-4 rounded-lg mb-6">
                  <p className="text-indigo-800 font-medium">
                    Power your trading agents with exclusive Gorillionaire
                    signals
                  </p>
                  <p className="text-indigo-700 text-sm mt-1">
                    Feed our high-confidence signals directly to your autonomous
                    trading bots via our secure API
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                  <div className="flex items-start">
                    <span className="text-green-500 mr-2 flex-shrink-0">✓</span>
                    <p className="text-gray-700">
                      Direct signal integration with your trading agents
                    </p>
                  </div>
                  <div className="flex items-start">
                    <span className="text-green-500 mr-2 flex-shrink-0">✓</span>
                    <p className="text-gray-700">
                      Agent-optimized API endpoints with confidence scores
                    </p>
                  </div>
                  <div className="flex items-start">
                    <span className="text-green-500 mr-2 flex-shrink-0">✓</span>
                    <p className="text-gray-700">
                      MEV-aware signal feeds for all tokens
                    </p>
                  </div>
                  <div className="flex items-start">
                    <span className="text-green-500 mr-2 flex-shrink-0">✓</span>
                    <p className="text-gray-700">
                      Agent performance boosting alpha strategies
                    </p>
                  </div>
                </div>

                <div className="bg-gray-100 p-4 rounded-lg mb-6">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2 flex-shrink-0"></div>
                    <p className="text-sm text-gray-700">
                      Currently <span className="font-medium">247</span>{" "}
                      Gorillionaires powering their agents with our signals
                    </p>
                  </div>
                </div>

                {errorMessage && (
                  <div className="bg-red-100 border border-red-200 text-red-700 p-4 rounded-lg mb-6">
                    <div className="flex items-center">
                      <span className="text-xl mr-2 flex-shrink-0">⚠️</span>
                      <p>{errorMessage}</p>
                    </div>
                  </div>
                )}

                {mintSuccess ? (
                  <div className="bg-green-100 border border-green-200 text-green-700 p-4 rounded-lg mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <span className="text-xl mr-2 flex-shrink-0">✅</span>
                      <div>
                        <p className="font-medium">NFT Successfully Minted!</p>
                        <p className="text-sm">
                          Your trading agents now have access to premium signals
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={handleMint}
                    disabled={isMinting || hasNFT}
                    className={`w-full py-3 px-4 rounded-lg font-medium text-white ${
                      isMinting || hasNFT
                        ? "bg-gray-400"
                        : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                    } transition-all duration-200 flex items-center justify-center`}
                  >
                    {!isConnected ? (
                      "Connect Wallet to Mint"
                    ) : isMinting ? (
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
                    ) : hasNFT ? (
                      "You Already Own This NFT"
                    ) : (
                      "Mint NFT to Fuel Your Trading Agents"
                    )}
                  </button>
                )}

                {mintSuccess && (
                  <div className="mt-6">
                    <h5 className="font-medium text-gray-800 mb-2">
                      Your Agent API Keys
                    </h5>
                    <div className="bg-gray-100 p-3 rounded-lg flex items-center justify-between">
                      <code className="text-xs text-gray-600 truncate">
                        {address ? `${address.slice(0, 24)}...` : "0x86f6D762B53f21Te53fa5762D294d576A36..."}
                      </code>
                      <button 
                        className="text-purple-600 hover:text-purple-800 flex-shrink-0 ml-2"
                        onClick={() => {
                          if (address) {
                            navigator.clipboard.writeText(address);
                          }
                        }}
                      >
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

                    <div className="mt-4 bg-blue-50 p-3 rounded-lg">
                      <h6 className="font-medium text-blue-800 text-sm">
                        Integration Example:
                      </h6>
                      <pre className="mt-2 text-xs bg-gray-800 text-gray-200 p-3 rounded overflow-x-auto">
                        <code>
                          {`// Connect your trading agent to our signal API
const signals = await fetch('https://api.gorillionaire.io/signals', {
  headers: { 'Authorization': 'Bearer ${address ? address : "0x86f6D762B53f21Te53fa5762D294d576A36"}' }
});

// Feed signals directly to your agent
myTradingAgent.consumeSignals(signals.data);`}
                        </code>
                      </pre>
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t border-gray-200 p-4 bg-gray-50">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="mr-1">Powered by</span>
                    <span className="font-medium text-purple-600">
                      Monad 10,000 TPS Infrastructure
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className="h-2 w-2 bg-green-500 rounded-full mr-1 flex-shrink-0"></div>
                    <span className="text-sm text-gray-600">
                      Live agent signals
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Mints Section - with agent language */}
            <div className="mt-8 bg-white rounded-lg border border-gray-200 shadow-md overflow-hidden">
              <div className="bg-gray-50 border-b border-gray-200 p-4">
                <h3 className="font-medium text-gray-700">
                  Recent Agent API Activations
                </h3>
              </div>
              <div className="divide-y divide-gray-200">
                {[
                  {
                    address: "0x86f6D762B53f21Te53fa5762D294d576A36",
                    time: "5 mins ago",
                    type: "Trading Bot",
                  },
                  {
                    address: "0x71c8Fb21a22d95CEa35dD9D4eA72B17E",
                    time: "12 mins ago",
                    type: "MEV Agent",
                  },
                  {
                    address: "0x3bFc36B19f8d5331480",
                    time: "28 mins ago",
                    type: "Arbitrage Bot",
                  },
                ].map((mint, index) => (
                  <div
                    key={index}
                    className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2"
                  >
                    <div className="flex items-center">
                      <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 mr-3 flex-shrink-0">
                        🤖
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-sm font-medium text-gray-700 truncate">
                          {mint.address}
                        </p>
                        <div className="flex items-center">
                          <p className="text-xs text-gray-500">{mint.time}</p>
                          <span className="mx-1 text-gray-400">•</span>
                          <p className="text-xs text-indigo-600">{mint.type}</p>
                        </div>
                      </div>
                    </div>
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full sm:ml-2 flex-shrink-0">
                      Activated
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