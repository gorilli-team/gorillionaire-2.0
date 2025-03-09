"use client";
import { usePrivy } from "@privy-io/react-auth";
import { useState, useEffect } from "react";

export default function Header() {
  const { ready, authenticated, user, login, logout } = usePrivy();

  const [monPriceFormatted, setMonPriceFormatted] = useState<string>("0.00");
  const [isFlashing, setIsFlashing] = useState(false);

  const fetchPrice = async () => {
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
  };

  useEffect(() => {
    fetchPrice(); // Initial fetch
    const interval = setInterval(fetchPrice, 10000);
    return () => clearInterval(interval);
  }, [monPriceFormatted]); // Include monPriceFormatted in deps to properly compare in fetchPrice

  return (
    <header className="h-16 px-6 flex items-center justify-between border-b border-gray-300 bg-gray-100">
      <div
        className={`flex items-center gap-2 bg-violet-100 px-3 py-1.5 rounded-lg transition-colors duration-500 ${
          isFlashing ? "bg-violet-300" : "bg-violet-100"
        }`}
      >
        <span className="text-md font-medium text-violet-900">MON PRICE</span>
        <span
          className={`text-md font-bold text-violet-900 transition-transform duration-500 ${
            isFlashing ? "scale-110" : "scale-100"
          }`}
        >
          ${monPriceFormatted}
        </span>
      </div>

      <div className="flex items-center justify-end space-x-4 flex-1 my-3">
        {ready && authenticated ? (
          <div className="flex items-center gap-4">
            {user?.wallet && (
              <div className="text-sm text-gray-600">
                {user.wallet.address.slice(0, 6)}...
                {user.wallet.address.slice(-4)}
              </div>
            )}
            <button
              onClick={logout}
              className="px-4 py-2 text-sm font-medium text-white bg-violet-600 rounded-md hover:bg-violet-400"
            >
              Disconnect
            </button>
          </div>
        ) : (
          <button
            onClick={login}
            disabled={!ready}
            className="px-4 py-2 text-sm font-medium text-white bg-violet-900 rounded-md hover:bg-violet-700 disabled:opacity-50"
          >
            Connect Wallet
          </button>
        )}
      </div>
    </header>
  );
}
