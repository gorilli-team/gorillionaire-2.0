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
}

const untrackedTokens: TokenData[] = [
  {
    name: "Zentak",
    symbol: "ZTK",
    price: "$0.50",
    volume: "$100K",
    address: "0x12345",
    image: "https://imagedelivery.net/tWwhAahBw7afBzFUrX5mYQ/12345/public",
  },
  {
    name: "Vortex",
    symbol: "VTX",
    price: "$1.80",
    volume: "$400K",
    address: "0x67890",
    image: "https://imagedelivery.net/tWwhAahBw7afBzFUrX5mYQ/67890/public",
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
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Tokens;
