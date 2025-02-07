import { setAppState } from "../store/appStore";

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
