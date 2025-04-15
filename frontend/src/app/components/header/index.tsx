"use client";
import { useLogin, usePrivy } from "@privy-io/react-auth";
import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LeaderboardBadge from "../leaderboard_badge";
import Cookies from "js-cookie";

interface Notification {
  type: string;
  data: {
    data?: {
      action?: string;
      tokenAmount?: number;
      tokenPrice?: number;
      tokenSymbol?: string;
      userAddress?: string;
    };
  };
  message?: string;
  title?: string;
}

export default function Header() {
  const { ready, authenticated, user, logout } = usePrivy();

  const { login } = useLogin({
    onComplete: async ({ user }) => {
      const privyToken = Cookies.get("privy-token");
      if (!privyToken || !user.wallet?.address) return;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/privy`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ address: user.wallet.address, privyToken }),
        }
      );
      await response.json();
    },
  });
  const [monPriceFormatted, setMonPriceFormatted] = useState<string>("0.00");
  const [isFlashing, setIsFlashing] = useState(false);
  const [userAddress, setUserAddress] = useState<string | null>(null);

  // WebSocket notification state
  const wsRef = useRef<WebSocket | null>(null);

  // Function to show notification
  const showCustomNotification = (
    message: string,
    title: string = "Notification"
  ) => {
    toast(
      <div>
        <div className="font-bold">{title}</div>
        <div>{message}</div>
      </div>,
      {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      }
    );
  };

  // Handle wallet connection/disconnection and address updates
  useEffect(() => {
    if (!ready) return; // Wait for Privy to be ready

    const trackUser = async () => {
      if (authenticated && user?.wallet) {
        setUserAddress(user.wallet.address);
        //make a call to the backend to track the user
        const privyToken = Cookies.get("privy-token");

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/activity/track/signin`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${privyToken}`,
            },
            body: JSON.stringify({ address: user.wallet.address }),
          }
        );
        await response.json();
      } else {
        setUserAddress(null);
      }
    };

    trackUser();
  }, [ready, authenticated, user]);

  // WebSocket for notifications
  useEffect(() => {
    // Only connect when authenticated and we have an address
    if (!authenticated || !userAddress) {
      return;
    }

    // Close any existing WebSocket connection
    if (wsRef.current) {
      wsRef.current.close();
    }

    const wsUrl = `${process.env.NEXT_PUBLIC_API_URL}/events/notifications`;
    console.log(`Connecting to WebSocket: ${wsUrl}`);
    wsRef.current = new WebSocket(wsUrl);

    wsRef.current.onopen = () => {
      console.log("WebSocket connection established");
    };

    wsRef.current.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data) as Notification;
        console.log("WebSocket notification received:", message);

        // Debug logging to see the address comparison
        const notificationAddress = message.data?.data?.userAddress;
        console.log("Notification address:", notificationAddress);
        console.log("Current user address:", userAddress);

        if (
          message.type === "NOTIFICATION" &&
          notificationAddress &&
          userAddress &&
          notificationAddress.toLowerCase() === userAddress.toLowerCase()
        ) {
          // Extract relevant data
          const { action, tokenAmount, tokenPrice, tokenSymbol } =
            message.data.data || {};

          console.log("Address match, showing notification");

          // Choose emoji based on action
          const actionEmoji = action === "buy" ? "💰" : "💸";

          // Format the message for notification - using const instead of let
          const notificationMessage = `${actionEmoji} ${action?.toUpperCase()} ${tokenAmount} ${tokenSymbol} @ $${
            tokenPrice ? tokenPrice.toFixed(2) : "N/A"
          }`;

          // Show toast notification with formatted message
          showCustomNotification(notificationMessage, "Trade Signal");
        } else {
          console.log(
            "Not showing notification, address doesn't match or not a notification type"
          );
        }
      } catch (error) {
        console.error("Error processing WebSocket message:", error);
      }
    };

    wsRef.current.onclose = () => {
      console.log("WebSocket connection closed");
    };

    wsRef.current.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      if (wsRef.current) {
        console.log("Closing WebSocket connection");
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [authenticated, userAddress]);

  // Handle address changes
  useEffect(() => {
    if (userAddress) {
      console.log("Address updated:", userAddress);
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
        setTimeout(() => setIsFlashing(false), 5000);
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

        <div className="flex flex-wrap items-center justify-end space-x-4 flex-1 my-3 ml-auto">
          <div className="hidden md:block">
            <LeaderboardBadge />
          </div>
          <a
            href="https://t.me/monadsignals"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors w-[240px]"
            aria-label="Join our Telegram Channel for Real-time Trading Events"
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.692-1.653-1.123-2.678-1.799-1.185-.781-.417-1.21.258-1.911.177-.184 3.247-2.977 3.307-3.23.007-.032.015-.15-.056-.212s-.041-.041-.249-.024c-.106.024-1.793 1.139-5.062 3.345-.479.329-.913.489-1.302.481-.428-.009-1.252-.241-1.865-.44-.751-.244-1.349-.374-1.297-.789.027-.216.324-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.015 3.333-1.386 4.025-1.627 4.477-1.635.099-.002.321.023.465.141.119.098.152.228.166.331.016.122.037.384.021.591z" />
            </svg>
            <div className="flex flex-col items-start text-sm">
              <span className="font-medium">Join Telegram Channel</span>
              <span className="text-xs opacity-90">
                Get Real-time Trading Events
              </span>
            </div>
          </a>

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
