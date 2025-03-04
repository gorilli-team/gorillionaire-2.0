import React, { useEffect, useState } from "react";
import {
  fetchVaultInfo,
  fetchVaultTransactions,
  fetchCreationTransaction,
} from "../../api/fetchVaultData";
import TokenChart from "../token_chart";
import Image from "next/image";
interface TokenInfo {
  symbol: string;
}

interface VaultInfo {
  name: string;
  creator_address_hash: string;
  creation_transaction_hash: string;
  hash: string;
  token: TokenInfo;
}

interface CreationData {
  timestamp?: string;
}

interface TokenData {
  count: number;
  data: Array<{
    _id: string;
    agentId: string;
    key: string;
    createdAt: string;
    expiresAt: string;
    value: string;
  }>;
}

const VaultStats: React.FC = () => {
  const [vaultData, setVaultData] = useState<VaultInfo | null>(null);
  const [transactionCount, setTransactionCount] = useState<number>(0);
  const [creationData, setCreationData] = useState<CreationData | null>(null);
  const [tokenData, setTokenData] = useState<TokenData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchVaultInfo();
        setVaultData(data);

        if (data?.creation_transaction_hash) {
          const creationTx = await fetchCreationTransaction(
            data.creation_transaction_hash
          );
          setCreationData(creationTx);
        }

        const transactions = await fetchVaultTransactions();
        setTransactionCount(transactions.length);

        const tokenResponse = null;
        setTokenData(tokenResponse);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  if (!vaultData || !tokenData) return <div>Loading...</div>;

  const getTitleForKey = (key: string) => {
    switch (key) {
      case "volume24h":
        return "24h Volume";
      case "volumeChange24h":
        return "24h Volume Change";
      case "percentChange24h":
        return "24h Percent Change";
      case "percentChange1h":
        return "1h Percent Change";
      default:
        return key;
    }
  };

  // Order of charts
  const chartOrder = [
    "percentChange1h",
    "percentChange24h",
    "volume24h",
    "volumeChange24h",
  ];

  // Order the data according to chartOrder
  const orderedChartData = chartOrder
    .map((key) => tokenData.data.find((item) => item.key === key))
    .filter((item) => item !== undefined);

  return (
    <div className="p-4">
      <h3 className="text-md font-semibold mb-2">Details</h3>
      <div className="border p-4 rounded-lg mb-4 bg-gray-100">
        <div className="flex justify-between pb-2">
          <strong>Vault name:</strong>
          <span>
            {vaultData.name} ({vaultData.token.symbol})
          </span>
        </div>
        <div className="flex justify-between pb-2">
          <strong>Contract address:</strong>
          <span>{vaultData.hash}</span>
        </div>
        <div className="flex justify-between pb-2">
          <strong>Creator address:</strong>
          <span>{vaultData.creator_address_hash}</span>
        </div>
        <div className="flex justify-between pb-2">
          <strong>Creation date:</strong>
          <span>
            {creationData?.timestamp
              ? new Date(creationData.timestamp).toLocaleString("en-US", {
                  month: "2-digit",
                  day: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                  hour12: true,
                })
              : "Loading..."}
          </span>
        </div>
        <div className="flex justify-between pb-2">
          <strong>Chain:</strong>
          <div className="flex">
            <Image
              src="/base.jpg"
              alt="img-base"
              width={24}
              height={24}
              className="rounded-full"
            />
            <span className="ps-1">Base</span>
          </div>
        </div>
        <div className="flex justify-between pb-2">
          <strong>Creation transaction:</strong>
          <span>{vaultData.creation_transaction_hash}</span>
        </div>
        <div className="flex justify-between pb-2">
          <strong>Total transactions:</strong>
          <span>{transactionCount}</span>
        </div>
      </div>

      <h3 className="text-md font-semibold mb-2">Token Statistics</h3>
      <div className="grid grid-cols-2 gap-4">
        {orderedChartData.map((item) => (
          <TokenChart
            key={item._id}
            data={item}
            title={getTitleForKey(item.key)}
            type={item.key === "volume24h" ? "volume" : "percentage"}
          />
        ))}
      </div>
    </div>
  );
};

export default VaultStats;
