import { setAppState, getAppState } from "../store/appStore";
import { Transaction } from "../types";

export const fetchVaultAddress = async () => {
  try {
    const vaultAddress = "0xC6827ce6d60A13a20A86dCac8c9e6D0F84497345"; 

    setAppState("vaultAddress", vaultAddress);

    console.log("Vault address updated in the store:", vaultAddress);
    } catch (error) {
    console.error("Error fetching the vault address:", error);
    }
};

export const fetchVaultTransactions = async () => {
  const vaultAddress = getAppState("vaultAddress");

  if (!vaultAddress) {
    console.error("Vault address is missing in the store.");
    return [];
  }

  const BLOCKSCOUT_API_KEY = process.env.NEXT_PUBLIC_BLOCKSCOUT_API_KEY;
  const url = `https://base.blockscout.com/api?module=account&action=txlist&address=${vaultAddress}&startblock=0&endblock=99999999&sort=desc&apikey=${BLOCKSCOUT_API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log("API response transaction:", data);
    return data.result || [];
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return [];
  }
};

export const fetchVaultDepositors = async (): Promise<
  { investor: string; deposits: number; withdraws: number; image: string }[]
> => {
  try {
    const vaultAddress = getAppState("vaultAddress");

    if (!vaultAddress) {
      console.error("Vault address is missing.");
      return [];
    }

    const transactions: Transaction[] = await fetchVaultTransactions();
    if (!transactions?.length) return [];

    const depositorsMap: Record<string, { deposits: number; withdraws: number }> = {};

    transactions.forEach((tx) => {
      const from = tx.from?.toLowerCase()?.trim();
      const to = tx.to?.toLowerCase()?.trim();
      const vault = vaultAddress.toLowerCase();

      if (from && from !== vault) {
        if (!depositorsMap[from]) {
          depositorsMap[from] = { deposits: 0, withdraws: 0 };
        }
        depositorsMap[from].deposits += 1;
      }

      if (to && to !== vault) {
        if (!depositorsMap[to]) {
          depositorsMap[to] = { deposits: 0, withdraws: 0 };
        }
        depositorsMap[to].withdraws += 1;
      }
    });

    return Object.entries(depositorsMap)
      .filter(([wallet]) => wallet && wallet !== vaultAddress.toLowerCase())
      .map(([wallet, { deposits, withdraws }], index) => ({
        investor: wallet,
        deposits,
        withdraws,
        image: `/avatar_${(index % 5) + 1}.png`,
      }));
  } catch (error) {
    console.error("Error fetching vault depositors:", error);
    return [];
  }
};

export const fetchVaultInfo = async () => {
  const vaultAddress = "0xC6827ce6d60A13a20A86dCac8c9e6D0F84497345";
  const BLOCKSCOUT_API_KEY = process.env.NEXT_PUBLIC_BLOCKSCOUT_API_KEY;
  
  const url = `https://base.blockscout.com/api/v2/addresses/${vaultAddress}?apikey=${BLOCKSCOUT_API_KEY}`;

  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${BLOCKSCOUT_API_KEY}`
      }
    });
    const data = await response.json();
    console.log("Raw vault data:", data);
    return data;
  } catch (error) {
    console.error("Error fetching vault info:", error);
    return null;
  }
};

export const fetchVaultTokens = async () => {
  const vaultAddress = "0xC6827ce6d60A13a20A86dCac8c9e6D0F84497345";
  const BLOCKSCOUT_API_KEY = process.env.NEXT_PUBLIC_BLOCKSCOUT_API_KEY;
  
  const url = `https://base.blockscout.com/api/v2/addresses/${vaultAddress}/tokens?apikey=${BLOCKSCOUT_API_KEY}`;

  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${BLOCKSCOUT_API_KEY}`
      }
    });
    const data = await response.json();
    console.log("Vault tokens list:", data);
    return data;
  } catch (error) {
    console.error("Error fetching vault tokens:", error);
    return null;
  }
};

export const fetchCreationTransaction = async (txHash: string) => {
  const BLOCKSCOUT_API_KEY = process.env.NEXT_PUBLIC_BLOCKSCOUT_API_KEY;
  const url = `https://base.blockscout.com/api/v2/transactions/${txHash}?apikey=${BLOCKSCOUT_API_KEY}`;

  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${BLOCKSCOUT_API_KEY}`
      }
    });
    const data = await response.json();
    console.log("Creation transaction:", data);
    return data;
  } catch (error) {
    console.error("Error fetching creation transaction:", error);
    return null;
  }
};

export const fetchVaultTokenHolders = async () => {
  const vaultAddress = "0xC6827ce6d60A13a20A86dCac8c9e6D0F84497345";
  const BLOCKSCOUT_API_KEY = process.env.NEXT_PUBLIC_BLOCKSCOUT_API_KEY;
  
  const url = `https://base.blockscout.com/api/v2/tokens/${vaultAddress}/holders?apikey=${BLOCKSCOUT_API_KEY}`;

  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${BLOCKSCOUT_API_KEY}`
      }
    });
    const data = await response.json();
    console.log("Vault token holders:", data);
    return data;
  } catch (error) {
    console.error("Error fetching vault token holders:", error);
    return null;
  }
};