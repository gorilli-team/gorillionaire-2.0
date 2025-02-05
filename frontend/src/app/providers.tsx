"use client";
import type { ReactNode } from 'react';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { baseSepolia } from 'wagmi/chains';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <OnchainKitProvider
      apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
      chain={baseSepolia}
      config={{
        appearance: {
          name: 'Connect Wallet',
        //   logo: '/gorillionaire.jpg',
          mode: 'auto',
          theme: 'default',
        },
        wallet: { 
          display: 'modal',
        //   termsUrl: 'https://your-dapp.com/terms', 
        //   privacyUrl: 'https://your-dapp.com/privacy',
        },
      }}
    >
      {children}
    </OnchainKitProvider>
  );
}