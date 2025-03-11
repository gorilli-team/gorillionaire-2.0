"use client";
import { usePrivy } from "@privy-io/react-auth";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LeaderboardBadge from "../leaderboard_badge";

export default function Header() {
  const { ready, authenticated, user, login, logout } = usePrivy();
  // Then in your component:
  const [monPriceFormatted, setMonPriceFormatted] = useState<string>("0.00");
  const [isFlashing, setIsFlashing] = useState(false);
  const [userAddress, setUserAddress] = useState<string | null>(null);

  // Function to show notification
  const showNotification = () => {
    toast('🚀 Notification Test!', {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Bounce,
    });
  };

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
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={true}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
      
      <header className="h-16 px-4 sm:px-6 flex items-center justify-between border-b border-gray-300 bg-gray-100 sticky top-0 z-20">
        {/* Left space for mobile hamburger menu */}
        <div className="w-8 h-8 lg:hidden"></div>
        
        <div className="flex items-center justify-end space-x-4 flex-1 my-3 ml-auto">
          {/* Notification Button */}
          <button
            onClick={showNotification}
            className="px-2 py-1 text-xs sm:text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            aria-label="Show notification"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>

          <div className="hidden md:block">
            <LeaderboardBadge />
          </div>
          
          {monPriceFormatted !== "0.00" && (
            <div
              className={`flex items-center gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg transition-colors duration-500 ml-auto sm:ml-0 ${
                isFlashing ? "bg-violet-300" : "bg-violet-100"
              }`}
            >
              <div className="items-end space-x-1 sm:space-x-2 sm:items-start">
                <span className="text-xs sm:text-md font-medium text-violet-900">
                  MON PRICE
                </span>
                <span
                  className={`text-xs sm:text-md font-bold text-violet-900 transition-transform duration-500 ${
                    isFlashing ? "scale-110" : "scale-100"
                  }`}
                >
                  ${monPriceFormatted}
                </span>
              </div>

              <div className="hidden sm:flex items-center gap-1 ml-2">
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
            <div className="flex items-center gap-2 sm:gap-4">
              {userAddress && (
                <div className="text-xs sm:text-sm text-gray-600 truncate max-w-[80px] sm:max-w-none">
                  {userAddress.slice(0, 6)}...
                  {userAddress.slice(-4)}
                </div>
              )}
              <button
                onClick={() => {
                  logout();
                  setUserAddress(null);
                }}
                className="px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm font-medium text-white bg-violet-600 rounded-md hover:bg-violet-400"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <div>
              <button
                onClick={login}
                disabled={!ready}
                className="px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm font-medium text-white bg-violet-900 rounded-md hover:bg-violet-700 disabled:opacity-50"
              >
                Connect Wallet
              </button>
            </div>
          )}
        </div>
      </header>
    </>
  );
}