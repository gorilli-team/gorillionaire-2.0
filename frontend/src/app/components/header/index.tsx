"use client";
import { usePrivy } from "@privy-io/react-auth";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

export default function Header() {
  const { ready, authenticated, user, login, logout } = usePrivy();
  // Then in your component:
  const [monPriceFormatted, setMonPriceFormatted] = useState<string>("0.00");
  const [isFlashing, setIsFlashing] = useState(false);
  const [userAddress, setUserAddress] = useState<string | null>(null);

  // Handle wallet connection/disconnection and address updates
  useEffect(() => {
    if (!ready) return; // Wait for Privy to be ready

    const trackUser = async () => {
      if (authenticated && user?.wallet) {
        setUserAddress(user.wallet.address);
        console.log("User wallet address:", user.wallet.address);
        //make a call to the backend to track the user
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/activity/track/signin`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ address: user.wallet.address }),
          }
        );
        const data = await response.json();
        console.log("Response:", data);
      } else {
        setUserAddress(null);
      }
    };

    trackUser();
  }, [ready, authenticated, user]);

  // Handle address changes
  useEffect(() => {
    if (userAddress) {
      console.log("Address updated:", userAddress);
      // You can trigger any address-dependent operations here
      // For example, fetch user-specific data, balances, etc.
    }
  }, [userAddress]);

  // Memoize fetchPrice to prevent unnecessary recreations
  const fetchPrice = useCallback(async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/pyth/mon-price`
      );
      const data = await res.json();
      const price = data?.price?.price;
      const scaledPrice = Number(price) / 1e8;
      const newPrice = new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(scaledPrice || 0);

      if (newPrice !== monPriceFormatted) {
        setMonPriceFormatted(newPrice);
        setIsFlashing(true);
        setTimeout(() => setIsFlashing(false), 1000);
      }
    } catch (error) {
      console.error("Error fetching price:", error);
    }
  }, [monPriceFormatted]);

  // Set up price fetching interval
  useEffect(() => {
    fetchPrice(); // Initial fetch
    const interval = setInterval(fetchPrice, 3000);
    return () => clearInterval(interval);
  }, [fetchPrice]);

  return (
    <header className="h-16 px-6 flex items-center justify-between border-b border-gray-300 bg-gray-100">
      <div className="flex items-center justify-end space-x-4 flex-1 my-3 ml-4">
        {monPriceFormatted !== "0.00" && (
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors duration-500 ml-auto sm:ml-0 ${
              isFlashing ? "bg-violet-300" : "bg-violet-100"
            }`}
          >
            <div className="items-end space-x-2 sm:items-start">
              <span className="text-md font-medium text-violet-900">
                MON PRICE
              </span>
              <span
                className={`text-md font-bold text-violet-900 transition-transform duration-500 ${
                  isFlashing ? "scale-110" : "scale-100"
                }`}
              >
                ${monPriceFormatted}
              </span>
            </div>

            <div className="flex items-center gap-1 ml-2">
              <span className="text-xs text-violet-900">Powered by</span>
              <Image
                src="/Pyth_Logotype_Dark.png"
                alt="Pyth"
                width={64}
                height={16}
                className="ml-1"
              />
            </div>
          </div>
        )}
        {ready && authenticated ? (
          <div className="flex items-center gap-4">
            {userAddress && (
              <div className="text-sm text-gray-600">
                {userAddress.slice(0, 6)}...
                {userAddress.slice(-4)}
              </div>
            )}
            <button
              onClick={() => {
                logout();
                setUserAddress(null);
              }}
              className="px-4 py-2 text-sm font-medium text-white bg-violet-600 rounded-md hover:bg-violet-400"
            >
              Disconnect
            </button>
          </div>
        ) : (
          <div>
            <button
              onClick={login}
              disabled={!ready}
              className="px-4 py-2 text-sm font-medium text-white bg-violet-900 rounded-md hover:bg-violet-700 disabled:opacity-50"
            >
              Connect Wallet
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
