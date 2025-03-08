import React, { useEffect, useState } from "react";
import Token from "../token/index";
import {
  trackedTokens,
  fetchAllTokens,
  TokenData,
} from "@/app/shared/tokenData";
import { useRouter } from "next/navigation";

interface TokenStats {
  name: string;
  symbol: string;
  address: string;
  totalEvents: number;
  trackedSince: string;
  trackingTime: string;
}

const untrackedTokens: TokenData[] = [
  {
    id: 1,
    name: "Wrapped Monad",
    symbol: "MON",
    supply: "93,415,274,755",
    holders: 103039,
    address: "0x760AfE86e5de5fa0Ee542fc7B7B713e1c5425701",
    image:
      "https://imagedelivery.net/cBNDGgkrsEA-b_ixIp9SkQ/I_t8rg_V_400x400.jpg/public",
    isActive: false,
    price: "$0.50",
    volume: "$1.2M",
    trackedSince: "Feb 20, 2025",
    signalsGenerated: 127,
  },
  {
    id: 2,
    name: "ShMonad",
    symbol: "ShMON",
    supply: "27,937",
    holders: 229794,
    address: "0x1b4Cb47622705F0F67b6B18bBD1cB1a91fc77d37",
    image:
      "https://pbs.twimg.com/media/GjskgXhWsAA_N_L?format=png&name=240x240",
    isActive: false,
    price: "$0.50",
    volume: "$1.2M",
    trackedSince: "Feb 25, 2025",
    signalsGenerated: 84,
  },
];

const Tokens = () => {
  const router = useRouter();
  const [tokenStats, setTokenStats] = useState<TokenStats[]>([]);

  useEffect(() => {
    const getTokens = async () => {
      try {
        const fetchedTokens = await fetchAllTokens();
        setTokenStats(fetchedTokens || []);
      } catch (error) {
        console.error("Error fetching tokens:", error);
        setTokenStats([]);
      }
    };

    getTokens();
  }, []);

  // Merge static data with dynamic stats
  const trackedTokensWithStats = trackedTokens.map((token) => {
    const stats = tokenStats.find((t) => t.name === token.name);
    return {
      ...token,
      signalsGenerated: stats?.totalEvents || 0,
      trackedSince: stats?.trackedSince || "",
      trackingTime: stats?.trackingTime || "",
    };
  });

  const handleTokenClick = (address: string) => {
    router.push(`/tokens/${address}`);
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 p-8">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Tracked Tokens</h2>
          <a
            href="https://t.me/monadsignals"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.692-1.653-1.123-2.678-1.799-1.185-.781-.417-1.21.258-1.911.177-.184 3.247-2.977 3.307-3.23.007-.032.015-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.139-5.062 3.345-.479.329-.913.489-1.302.481-.428-.009-1.252-.241-1.865-.44-.751-.244-1.349-.374-1.297-.789.027-.216.324-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.015 3.333-1.386 4.025-1.627 4.477-1.635.099-.002.321.023.465.141.119.098.152.228.166.331.016.122.037.384.021.591z" />
            </svg>
            <div className="flex flex-col items-start text-sm">
              <span className="font-medium">Join Telegram Channel</span>
              <span className="text-xs opacity-90">
                Get Real-time Trading Events
              </span>
            </div>
          </a>
        </div>
        <div className="grid grid-cols-3 gap-8">
          {trackedTokensWithStats.map((token: TokenData, index: number) => (
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
