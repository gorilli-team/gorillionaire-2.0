"use client";
import { WalletDefault } from "@coinbase/onchainkit/wallet";

export default function Header() {

  return (
    <header className="h-16 px-6 flex items-center justify-between border-b border-gray-300 bg-gray-100">
      <div className="flex items-center justify-end space-x-4 flex-1">
        <WalletDefault />
      </div>
    </header>
  );
};