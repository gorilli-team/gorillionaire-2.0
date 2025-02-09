import React, { useEffect, useState } from "react";
import { fetchVaultInfo, fetchVaultTransactions, fetchCreationTransaction } from "../../api/fetchVaultData";

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

const VaultStats: React.FC = () => {
    const [vaultData, setVaultData] = useState<VaultInfo | null>(null);
    const [transactionCount, setTransactionCount] = useState<number>(0);
    const [creationData, setCreationData] = useState<CreationData | null>(null);
    
    // const sentimentData = [
    //     { date: "Feb 05", sentiment: 10 },
    //     { date: "Feb 06", sentiment: -5 },
    //     { date: "Feb 07", sentiment: -20 },
    //     { date: "Feb 08", sentiment: 8 },
    //     { date: "Feb 09", sentiment: 25 },
    //     { date: "Feb 10", sentiment: -12 },
    // ];

    // Fetch vault data
    useEffect(() => {
      const getVaultData = async () => {
        try {
          const data = await fetchVaultInfo();
          setVaultData(data);
          
          if (data?.creation_transaction_hash) {
            const creationTx = await fetchCreationTransaction(data.creation_transaction_hash);
            setCreationData(creationTx);
          }
          
          const transactions = await fetchVaultTransactions();
          setTransactionCount(transactions.length);
          
        } catch (error) {
          console.error("Error fetching vault data:", error);
        }
      };

      getVaultData();
    }, []);

    if (!vaultData) return <div>Loading...</div>;

    return (
        <div className="p-4">
            <h3 className="text-md font-semibold mb-2">Details</h3>
            <div className="border p-4 rounded-lg mb-4 bg-gray-100">
                <div className="flex justify-between pb-2">
                    <strong>Vault name:</strong>
                    <span>{vaultData.name} ({vaultData.token.symbol})</span>
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
                            ? new Date(creationData.timestamp).toLocaleString('en-US', {
                                month: '2-digit',
                                day: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit',
                                hour12: true
                              })
                            : "Loading..."}
                    </span>
                </div>
                <div className="flex justify-between pb-2">
                    <strong>Chain:</strong>
                    <div className="flex">
                        <img className="w-6 h-6" src="/base.jpg" alt="img-base" />
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
        </div>
    );
};

export default VaultStats;