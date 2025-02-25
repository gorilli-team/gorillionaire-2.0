import React from "react";
import Token from "../token/index";
import { trackedTokens } from "@/app/shared/tokenData";

interface TokenData {
  name: string;
  symbol: string;
  price: string;
  volume: string;
  image: string;
  trackedSince?: string;
  trackingTime?: string;
  signalsGenerated?: number;
}

const untrackedTokens: TokenData[] = [
  {
    name: "Zentak",
    symbol: "ZTK",
    price: "$0.50",
    volume: "$100K",
    image: "https://imagedelivery.net/tWwhAahBw7afBzFUrX5mYQ/12345/public",
  },
  {
    name: "Vortex",
    symbol: "VTX",
    price: "$1.80",
    volume: "$400K",
    image: "https://imagedelivery.net/tWwhAahBw7afBzFUrX5mYQ/67890/public",
  },
];

const Tokens = () => {
  return (
    <div className="w-full min-h-screen bg-gray-50 p-8">
      <div className="container mx-auto">
        <h2 className="text-xl font-bold mb-4">Tracked Tokens</h2>
        <div className="grid grid-cols-3 gap-8">
          {trackedTokens.map((token: TokenData, index: number) => (
            <div key={index} className="bg-white shadow-md rounded-lg">
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
            <div key={index} className="bg-white shadow-md rounded-lg">
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
