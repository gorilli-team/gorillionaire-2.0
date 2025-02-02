import type { Metadata } from "next";
import '@coinbase/onchainkit/styles.css'; 
import "./globals.css";
import { Providers } from './providers'; 

export const metadata: Metadata = {
  title: "Gorillionaire",
  description: "A Next.js app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode,
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}