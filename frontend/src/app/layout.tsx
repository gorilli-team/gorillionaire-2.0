import type { Metadata } from "next";
import '@coinbase/onchainkit/styles.css'; 
import './styles/globals.css';
import { Providers } from './providers';
import Script from 'next/script';

export const metadata: Metadata = {
  title: "Gorillionaire",
  description: "Gorillionaire is an AI-powered agent that trades meme coins in the cryptocurrency market, learns from Twitter trends, and adjusts its trading strategy accordingly. By analyzing social media sentiment and market data, it aims to predict and capitalize on trends to maximize profit in the ever-changing crypto landscape.",
  icons: {
    icon: "fav_gorillionaire.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode,
}>) {
  return (
    <html lang="en">
      <head>
        <link 
            rel="stylesheet" 
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.1/css/all.min.css" 
            integrity="sha512-5Hs3dF2AEPkpNAR7UiOHba+lRSJNeM2ECkwxUIxC1Q/FLycGTbNapWXB4tP889k5T5Ju8fs4b1P5z/iB4nMfSQ==" 
            crossOrigin="anonymous" 
        />
        <link
          rel="preconnect" 
          href="https://fonts.googleapis.com" 
          crossOrigin="anonymous" 
        />
        <Script 
          src="https://s3.tradingview.com/tv.js" 
          strategy="beforeInteractive"
          type="text/javascript"
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}