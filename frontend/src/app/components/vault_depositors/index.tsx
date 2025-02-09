import React, { useState, useEffect } from "react";
import { fetchVaultTokenHolders } from "../../api/fetchVaultData";
import { getAppState } from "../../store/appStore";

interface TokenHolder {
  address: {
    hash: string;
  };
  value: string;
}

interface Depositor {
  investor: string;
  image: string;
}

interface VaultDepositorsProps {
  depositors: Depositor[];
}

const VaultDepositors: React.FC<VaultDepositorsProps> = ({ depositors }) => {
  const [tokenHolders, setTokenHolders] = useState<TokenHolder[]>([]);
  const vaultAddress = getAppState("vaultAddress");

  useEffect(() => {
    const loadTokenHolders = async () => {
      const holders = await fetchVaultTokenHolders();
      if (holders && holders.items) {
        setTokenHolders(holders.items);
        console.log("Token Holders:", holders.items);
      }
    };

    if (vaultAddress) {
      loadTokenHolders();
    }
  }, [vaultAddress]);

  // Convert value to a formatted number
  const formatValue = (value: string) => {
    // Convert to number and divide by 10^6 (assuming 6 decimal places)
    const formattedValue = parseFloat(value) / 1_000_000;
    return formattedValue.toFixed(6);
  };

  return (
    <div className="p-4">
      <table className="min-w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2 text-left">Holder</th>
            <th className="border border-gray-300 px-4 py-2 text-right">Quantity (vGOR)</th>
            <th className="border border-gray-300 px-4 py-2 text-right">Percentage</th>
          </tr>
        </thead>
        <tbody>
          {tokenHolders.map((holder, index) => {
            // Find matching depositor or use default avatar
            const depositor = depositors.find(d => 
              d.investor.toLowerCase() === holder.address.hash.toLowerCase()
            );

            return (
              <tr key={index}>
                <td className="border-b border-l border-gray-300 px-4 py-2 flex items-center gap-2">
                  <img
                    src={depositor?.image || `/avatar_${(index % 5) + 1}.png`}
                    alt="Holder Avatar"
                    className="w-8 h-8 rounded-full"
                  />
                  {holder.address.hash}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-right">
                  {formatValue(holder.value)}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-right">
                  100%
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default VaultDepositors;