import React from "react";
import Token from "../token/index";
import { trackedTokens } from "@/app/shared/tokenData";
import { useRouter } from "next/navigation";

interface TokenData {
  name: string;
  symbol: string;
  price: string;
  volume: string;
  image: string;
  trackedSince?: string;
  trackingTime?: string;
  signalsGenerated?: number;
  address: string;
  supply: string;
  holders: number;
  age: string;
  isActive: boolean;
}

const untrackedTokens: TokenData[] = [
  {
    name: "Wrapped Monad",
    symbol: "MON",
    supply: "93,415,274,755",
    holders: 103039,
    age: "17 days ago",
    address: "0x760AfE86e5de5fa0Ee542fc7B7B713e1c5425701",
    image:
      "https://imagedelivery.net/cBNDGgkrsEA-b_ixIp9SkQ/I_t8rg_V_400x400.jpg/public",
    isActive: false,
    price: "$0.50",
    volume: "$1.2M",
    trackedSince: "Feb 20, 2025",
    trackingTime: "5 days",
    signalsGenerated: 127,
  },
  {
    name: "ShMonad",
    symbol: "ShMON",
    supply: "27,937",
    holders: 229794,
    age: "28 days 6 hrs ago",
    address: "0x1b4Cb47622705F0F67b6B18bBD1cB1a91fc77d37",
    image:
      "https://pbs.twimg.com/media/GjskgXhWsAA_N_L?format=png&name=240x240",
    isActive: false,
    price: "$0.50",
    volume: "$1.2M",
    trackedSince: "Feb 25, 2025",
    trackingTime: "2 days",
    signalsGenerated: 84,
  },
];

const Tokens = () => {
  const router = useRouter();

  const handleTokenClick = (address: string) => {
    router.push(`/tokens/${address}`);
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 p-8">
      <div className="container mx-auto">
        <h2 className="text-xl font-bold mb-4">Tracked Tokens</h2>
        <div className="grid grid-cols-3 gap-8">
          {trackedTokens.map((token: TokenData, index: number) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-lg cursor-pointer hover:shadow-lg transition-shadow duration-200"
              onClick={() => handleTokenClick(token.address)}
            >
              <Token
                name={token.name}
                symbol={token.symbol}
                image={token.image}
                trackedSince={token.trackedSince}
                trackingTime={token.trackingTime}
                signalsGenerated={token.signalsGenerated}
              />
            </div>
          ))}
        </div>

        <h2 className="text-xl font-bold mt-8 mb-4">Untracked Tokens</h2>
        <div className="grid grid-cols-3 gap-8">
          {untrackedTokens.map((token: TokenData, index: number) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-lg cursor-pointer hover:shadow-lg transition-shadow duration-200"
              onClick={() => handleTokenClick(token.symbol)}
            >
              <Token
                name={token.name}
                symbol={token.symbol}
                image={token.image}
                trackedSince={token.trackedSince}
                trackingTime={token.trackingTime}
                signalsGenerated={token.signalsGenerated}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Tokens;
