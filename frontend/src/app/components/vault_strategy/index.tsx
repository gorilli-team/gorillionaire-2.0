import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { fetchVaultTokens } from "../../api/fetchVaultData";
import Image from "next/image";

interface TokenData {
  token: {
    name: string;
    symbol: string;
    icon_url?: string;
    decimals: string;
    exchange_rate: string;
  };
  value: string;
}

interface VaultData {
  items: TokenData[];
}

interface Token {
  name: string;
  value: number;
  color: string;
  logo: string;
}

const colors = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"];

const VaultStrategy: React.FC = () => {
  const [tokens, setTokens] = useState<Token[]>([]);
  const total = tokens.reduce((sum, token) => sum + token.value, 0);

  useEffect(() => {
    const getTokenData = async () => {
      try {
        const data: VaultData = await fetchVaultTokens();
        const filteredTokens = data.items.filter((item) =>
          ["USDC", "BRETT"].includes(item.token.symbol)
        );

        const formattedTokens = filteredTokens.map((item, index) => {
          // Convert value based on token decimals
          const decimals = parseInt(item.token.decimals);
          const tokenValue = parseFloat(item.value) / Math.pow(10, decimals);

          // Calculate value using exchange rate
          const value = tokenValue * parseFloat(item.token.exchange_rate);

          return {
            name: `${item.token.name} (${item.token.symbol})`,
            value: value,
            color: colors[index % colors.length],
            logo: item.token.icon_url || "/placeholder-coin.png",
          };
        });

        setTokens(formattedTokens);
      } catch (error) {
        console.error("Error fetching token data:", error);
      }
    };

    getTokenData();
  }, []);

  if (tokens.length === 0) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="flex justify-between items-center p-4 bg-white rounded-lg">
      <div className="w-1/3">
        {tokens.map((token) => (
          <div
            key={token.name}
            className="flex justify-between items-center p-2 bg-white border border-gray-200 rounded-lg mb-2"
          >
            <div className="flex items-center">
              <Image
                src={token.logo}
                alt={token.name}
                width={24}
                height={24}
                className="mr-2"
              />
              <span>{token.name}</span>
            </div>
            <div className="flex items-center">
              <span
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: token.color }}
              ></span>
              <span className="font-bold">
                $
                {token.value.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 6,
                })}
              </span>
              <span className="ml-2 text-gray-500">
                ({((token.value / total) * 100).toFixed(2)}%)
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <PieChart width={200} height={200}>
          <Pie
            data={tokens}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
          >
            {tokens.map((token, index) => (
              <Cell key={`cell-${index}`} fill={token.color} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </div>

      <div className="w-1/3 flex justify-center items-center">
        <div className="text-lg font-bold text-gray-700">
          $
          {total.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 6,
          })}
        </div>
      </div>
    </div>
  );
};

export default VaultStrategy;
