"use client";

import { useState } from "react";

export default function Header({ selectedPage }) {
  const [isConnected, setIsConnected] = useState(false);

  const handleConnectWallet = () => {
    setIsConnected(true);
  };

  return (
    <header className="h-16 px-6 flex items-center justify-between border-b border-gray-300 bg-gray-100">
      <div className="flex items-center justify-end space-x-4 flex-1">
        {isConnected ? (
          <>
            <div className="text-sm text-gray-700">Chain</div>
            <div className="bg-gray-200 px-3 py-1 rounded-lg text-sm text-gray-800">Wallet</div>
          </>
        ) : (
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-400"
            onClick={handleConnectWallet}
          >
            Connect Wallet
          </button>
        )}
      </div>
    </header>
  );
}
