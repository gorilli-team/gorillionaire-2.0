import { setAppState, getAppState } from "../store/appStore";
import { Transaction } from "../types";

export const fetchVaultAddress = async () => {
  try {
    /*
    const response = await fetch("ELIZA_URL_API");
    const data = await response.json();
    const vaultAddress = data.vaultAddress;
    */

    const vaultAddress = "0x5B1C72fEC49EfdDBc12E57fe1837D27B1356f8ed"; 

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
  const url = `https://base-sepolia.blockscout.com/api?module=account&action=txlist&address=${vaultAddress}&startblock=0&endblock=99999999&sort=desc&apikey=${BLOCKSCOUT_API_KEY}`;

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
      const from = tx.from?.toLowerCase();
      const to = tx.to?.toLowerCase();
      const vault = vaultAddress.toLowerCase();

      if (from) {
        if (!depositorsMap[from]) {
          depositorsMap[from] = { deposits: 0, withdraws: 0 };
        }
        depositorsMap[from].deposits += 1;
      }

      if (to) {
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
