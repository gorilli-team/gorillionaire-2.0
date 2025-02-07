import { setAppState, getAppState } from "../store/appStore";

export const fetchVaultAddress = async () => {
  try {
    /*
    const response = await fetch("URL_DELL_API_DI_ELIZA");
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

  const BLOCKSCOUT_API_KEY = "9392e205-7aaf-4069-871e-632706779609";
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
