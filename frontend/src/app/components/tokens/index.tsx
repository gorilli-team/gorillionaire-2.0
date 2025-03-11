import React, { useEffect, useState } from "react";
import { Pagination } from "flowbite-react";
import Image from "next/image";

import Token from "../token/index";
import {
  trackedTokens,
  fetchAllTokens,
  fetchUntrackedTokens,
  TokenData,
} from "@/app/shared/tokenData";
import { useRouter } from "next/navigation";
import { getTimeAgo } from "@/app/utils/time";

interface TokenStats {
  name: string;
  symbol: string;
  address: string;
  totalEvents: number;
  trackedSince: string;
  trackingTime: string;
}

interface UntrackedToken {
  tokenName: string;
  tokenAddress: string;
  tokenSymbol: string;
  blockTimestamp: string;
}

interface PaginationData {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

const Tokens = () => {
  const router = useRouter();
  const [tokenStats, setTokenStats] = useState<TokenStats[]>([]);
  const [untrackedTokens, setUntrackedTokens] = useState<UntrackedToken[]>([]);
  const [paginationData, setPaginationData] = useState<PaginationData>({
    total: 0,
    page: 1,
    limit: 25,
    pages: 1,
  });

  const onPageChange = async (page: number) => {
    await getUntrackedTokens(page);
  };

  const getUntrackedTokens = async (page: number = 1) => {
    try {
      console.log("getUntrackedTokens: page", page);
      const fetchedUntrackedTokens = await fetchUntrackedTokens(page);
      console.log("fetchedUntrackedTokens", fetchedUntrackedTokens);
      setUntrackedTokens(fetchedUntrackedTokens?.listings || []);
      setPaginationData(
        fetchedUntrackedTokens?.pagination || {
          total: 0,
          page: page,
          limit: 25,
          pages: 1,
        }
      );
    } catch (error) {
      console.error("Error fetching untracked tokens:", error);
      setUntrackedTokens([]);
      setPaginationData({
        total: 0,
        page: page,
        limit: 25,
        pages: 1,
      });
    }
  };

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

  useEffect(() => {
    getUntrackedTokens(1);
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

  const getTokenColor = (address: string) => {
    // Use the last 6 characters of the address as the color
    return `#${address.slice(-6)}`;
  };

  const formatBlockTimestamp = (timestamp: string) => {
    // Convert block timestamp (in seconds) to milliseconds and create ISO string
    return new Date(parseInt(timestamp) * 1000).toISOString();
  };

  // Remove client-side pagination logic as we're using server-side pagination
  const getEmptyRows = (
    items: UntrackedToken[],
    itemsPerPage: number
  ): null[] => {
    const currentItemCount = items.length;
    if (currentItemCount < itemsPerPage) {
      return Array(itemsPerPage - currentItemCount).fill(null);
    }
    return [];
  };

  const emptyRows = getEmptyRows(untrackedTokens, paginationData.limit);

  return (
    <div className="w-full min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="container mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
          <h2 className="text-xl font-bold">Tracked Tokens</h2>
          <a
            href="https://t.me/monadsignals"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors w-full sm:w-auto"
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
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

        <h2 className="text-xl font-bold mt-8 mb-4">New Tokens on Uniswap</h2>
        <div className="bg-white rounded-lg shadow-sm p-6 mt-4">
          <div className="overflow-x-auto">
            <div className="overflow-hidden">
              <table className="w-full border-collapse">
                <thead className="sticky top-0 bg-white z-10">
                  <tr className="text-left text-xs text-gray-500 border-b">
                    <th className="pb-2 font-medium">TOKEN NAME</th>
                    <th className="pb-2 font-medium">ADDRESS</th>
                    <th className="pb-2 font-medium">LISTED SINCE</th>
                    <th className="pb-2 font-medium">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {untrackedTokens.map(
                    (token: UntrackedToken, index: number) => (
                      <tr
                        key={index}
                        className="border-b border-gray-100 text-sm"
                      >
                        <td className="py-4 h-12">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden">
                              <div
                                className="w-full h-full bg-gray-300 rounded-full"
                                style={{
                                  backgroundColor: getTokenColor(
                                    token.tokenAddress
                                  ),
                                }}
                              ></div>
                            </div>
                            <span className="text-gray-700 font-medium">
                              {token.tokenName}
                            </span>
                            <span className="text-gray-500">
                              ({token.tokenSymbol})
                            </span>
                            <a
                              href={`https://testnet.monadexplorer.com/token/${token.tokenAddress}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center hover:opacity-80 transition-opacity"
                            >
                              <Image
                                src="/monad-explorer.png"
                                alt="Monad Logo"
                                className="w-6 h-6 rounded-md"
                                width={24}
                                height={24}
                                priority={false}
                              />
                            </a>
                          </div>
                        </td>
                        <td className="py-4 h-12 text-gray-700">
                          {token.tokenAddress}
                        </td>
                        <td className="py-4 h-12">
                          {getTimeAgo(
                            formatBlockTimestamp(token.blockTimestamp)
                          )}
                        </td>
                        <td className="py-4 h-12">
                          <button className="px-4 py-2 text-xs font-medium text-white bg-violet-600 rounded-md hover:bg-violet-700">
                            Want to track this token?
                          </button>
                        </td>
                      </tr>
                    )
                  )}
                  {/* Empty rows to maintain fixed height */}
                  {emptyRows.map((_, index) => (
                    <tr
                      key={`empty-${index}`}
                      className="border-b border-gray-100"
                    >
                      <td className="h-16"></td>
                      <td className="h-16"></td>
                      <td className="h-16"></td>
                      <td className="h-16"></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Activities Pagination centered */}
          <div className="mt-2 flex flex-col sm:flex-row items-center justify-between">
            <span className="text-sm text-gray-500 mb-4 sm:mb-0 font-bold">
              <span className="font-normal">Showing</span>{" "}
              {(paginationData.page - 1) * paginationData.limit + 1}-
              {Math.min(
                paginationData.page * paginationData.limit,
                paginationData.total
              )}{" "}
              <span className="font-normal">of</span> {paginationData.total}
            </span>
            <div className="flex-grow flex justify-center">
              <Pagination
                currentPage={paginationData.page}
                totalPages={paginationData.pages}
                onPageChange={onPageChange}
                showIcons={true}
              />
            </div>
            <div className="hidden sm:block sm:w-32"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tokens;
