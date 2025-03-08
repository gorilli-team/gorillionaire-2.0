"use client";
import { usePrivy } from '@privy-io/react-auth';

export default function Header() {
  const { ready, authenticated, user, login, logout, createWallet } = usePrivy();

  return (
    <header className="h-16 px-6 flex items-center justify-between border-b border-gray-300 bg-gray-100">
      <div className="flex items-center justify-end space-x-4 flex-1 my-3">
        {ready && authenticated ? (
          <div className="flex items-center gap-4">
            {user?.wallet && (
              <div className="text-sm text-gray-600">
                {user.wallet.address.slice(0, 6)}...{user.wallet.address.slice(-4)}
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