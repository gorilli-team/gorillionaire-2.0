"use client";
import type { ReactNode } from 'react';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { base } from 'wagmi/chains';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <OnchainKitProvider
      apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
      chain={base}
      config={{
        appearance: {
          name: 'Gorillionaire',
          logo: 'https://your-logo.com',
          mode: 'auto',
          theme: 'default',
        },
        wallet: { 
          display: 'modal',
          termsUrl: 'https://your-dapp.com/terms', 
          privacyUrl: 'https://your-dapp.com/privacy',
        },
      }}
    >
      {children}
    </OnchainKitProvider>
  );
}