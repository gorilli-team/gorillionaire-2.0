"use client";
import type { ReactNode } from "react";
import { OnchainKitProvider } from "@coinbase/onchainkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createConfig, http, WagmiProvider } from "wagmi";
import { coinbaseWallet } from "wagmi/connectors";

const monadChain = {
  id: 10143,
  name: "Monad testnet",
  network: "monad",
  nativeCurrency: {
    decimals: 18,
    name: "Monad",
    symbol: "MON",
  },
  rpcUrls: {
    public: { http: ["https://testnet-rpc.monad.xyz"] },
    default: { http: ["https://testnet-rpc.monad.xyz"] },
  },
  blockExplorers: {
    etherscan: {
      name: "MonadExplorer",
      url: "https://testnet.monadexplorer.com",
    },
    default: {
      name: "MonadExplorer",
      url: "https://testnet.monadexplorer.com",
    },
  },
} as const;

const config = createConfig({
  chains: [monadChain],
  connectors: [
    coinbaseWallet({
      appName: "OnchainKit",
      preference: "smartWalletOnly",
      version: "4",
    }),
  ],
  ssr: true,
  transports: {
    [10143]: http(),
  },
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <OnchainKitProvider
          apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
          chain={monadChain}
          config={{
            appearance: {
              name: "Connect Wallet",
              //   logo: '/gorillionaire.jpg',
              mode: "auto",
              theme: "default",
            },
            wallet: {
              display: "modal",
              //   termsUrl: 'https://your-dapp.com/terms',
              //   privacyUrl: 'https://your-dapp.com/privacy',
            },
          }}
        >
          {children}
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
