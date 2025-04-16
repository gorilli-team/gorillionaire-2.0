"use client";

import React, { useCallback, useMemo, useState, useEffect } from "react";
import Sidebar from "@/app/components/sidebar";
import Header from "@/app/components/header";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { abi } from "../abi/early-nft";
import { toast } from "react-toastify";
import { MONAD_CHAIN_ID } from "../utils/constants";
import { usePrivy } from "@privy-io/react-auth";

const V2Page = () => {
  const { address, isConnected } = useAccount();
  const { login } = usePrivy();
  const [selectedPage, setSelectedPage] = useState("V2");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { writeContract } = useWriteContract();
  const { data } = useReadContract({
    abi,
    functionName: "balanceOf",
    address: "0xD0f38A3Fb0F71e3d2B60e90327afde25618e1150",
    args: [address || "0x0"],
  });
  const [chainId, setChainId] = useState<number | null>(null);

  const alreadyMinted = useMemo(() => (data ?? 0) > 0, [data]);

  const onClick = useCallback(async () => {
    if (alreadyMinted) return;

    // First, check if wallet is connected
    if (!isConnected) {
      login();
      return;
    }

    // Then check if we're on Monad network
    if (chainId === null) {
      toast.error("Unable to determine network. Please try again.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }

    if (chainId !== MONAD_CHAIN_ID) {
      toast.error("Please switch to Monad network to continue", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }

    // Proceed with minting
    writeContract({
      abi,
      functionName: "mint",
      address: "0xD0f38A3Fb0F71e3d2B60e90327afde25618e1150",
    });
  }, [writeContract, alreadyMinted, chainId, isConnected, login]);

  // Get the current chain ID
  useEffect(() => {
    const getChainId = async () => {
      if (typeof window !== "undefined" && window.ethereum) {
        try {
          const chainId = await window.ethereum.request({
            method: "eth_chainId",
          });
          setChainId(parseInt(chainId, 16));
        } catch (error) {
          console.error("Error getting chain ID:", error);
        }
      }
    };

    getChainId();

    // Listen for chain changes
    if (typeof window !== "undefined" && window.ethereum) {
      window.ethereum.on("chainChanged", (chainId: string) => {
        setChainId(parseInt(chainId, 16));
      });
    }

    return () => {
      if (typeof window !== "undefined" && window.ethereum) {
        window.ethereum.removeListener("chainChanged", () => {});
      }
    };
  }, []);

  return (
    <div className="flex h-screen bg-gray-100 text-gray-800">
      {/* Mobile menu button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-40 p-2 rounded-full bg-gray-200"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Toggle menu"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={
              isMobileMenuOpen
                ? "M6 18L18 6M6 6l12 12"
                : "M4 6h16M4 12h16M4 18h16"
            }
          />
        </svg>
      </button>

      {/* Sidebar */}
      <div
        className={`
          fixed lg:relative
          ${
            isMobileMenuOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
          transition-transform duration-300 ease-in-out
          z-30 lg:z-0
          bg-white
          shadow-xl lg:shadow-none
          h-full
        `}
      >
        <Sidebar
          selectedPage={selectedPage}
          setSelectedPage={setSelectedPage}
        />
      </div>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <Header />
        <div className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">
              Gorillionaire V2 🦍
            </h1>

            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Coming Soon</h2>
              <p className="text-gray-700 mb-4">
                We are working hard on bringing you an even better Gorillionaire
                experience. Stay tuned for updates!
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium text-lg mb-2">Enhanced Signals</h3>
                  <p className="text-gray-600">
                    More accurate and timely trading signals
                  </p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium text-lg mb-2">Improved UI</h3>
                  <p className="text-gray-600">
                    Better user experience and interface
                  </p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium text-lg mb-2">New Features</h3>
                  <p className="text-gray-600">
                    Exciting new capabilities for traders
                  </p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium text-lg mb-2">Performance</h3>
                  <p className="text-gray-600">
                    Faster and more reliable platform
                  </p>
                </div>
              </div>
              <h2 className="text-xl font-semibold mb-4 mt-6">
                Limited Spots Available
              </h2>
              <div className="bg-indigo-50 p-4 rounded-lg mb-6">
                <p className="text-gray-700 mb-4">
                  Mint your NFT to secure your spot in our exclusive waiting
                  list.
                </p>

                <p className="text-gray-600 mb-4">
                  This is your opportunity to be among the first to experience
                  the future of trading.
                </p>
              </div>
              <div className="mt-6 flex justify-center">
                <button
                  onClick={onClick}
                  disabled={alreadyMinted}
                  className={`${
                    alreadyMinted
                      ? "bg-green-600"
                      : "bg-purple-600 hover:bg-purple-700 cursor-pointer"
                  } text-white font-medium py-2 px-6 rounded-lg transition-colors `}
                >
                  {alreadyMinted ? "NFT Minted" : "Mint Now"}
                </button>
              </div>
            </div>

            {/* V2 Image */}
            <div className="mb-8 flex justify-center">
              <img
                src="/v2.png"
                alt="Gorillionaire V2"
                className="rounded-lg shadow-lg max-w-full h-auto"
                width="1200"
                height="675"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default V2Page;
