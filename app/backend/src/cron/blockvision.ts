import cron from "node-cron";
import blockvision from "../api/blockvision";

const tokenContractAddresses = [
  {
    contractAddress: "0xE0590015A873bF326bd645c3E1266d4db41C4E6B",
    tokenName: "CHOG",
  },
  {
    contractAddress: "0xfe140e1dCe99Be9F4F15d657CD9b7BF622270C50",
    tokenName: "MOYAKI",
  },
  {
    contractAddress: "0x0F0BDEbF0F83cD1EE3974779Bcb7315f9808c714",
    tokenName: "MOLANDAK",
  },
];

// Function to fetch token holders
export async function fetchTokenHolders(
  contractAddress: string,
  tokenName: string
) {
  try {
    const holders = await blockvision.retrieveTokenHolders({
      contractAddress,
      tokenName,
      pageIndex: "1",
      pageSize: "20",
    });
    return holders;
  } catch (err) {
    console.error("Error fetching token holders:", err);
    throw err;
  }
}

// Initialize the cron job
export function initTokenHoldersCron() {
  // Run every hour at minute 0
  return cron.schedule("0 * * * *", async () => {
    try {
      console.log("Fetching token holders...");
      for (const token of tokenContractAddresses) {
        await fetchTokenHolders(token.contractAddress, token.tokenName);
      }
      console.log("Successfully fetched token holders");
    } catch (error) {
      console.error("Failed to fetch token holders:", error);
    }
  });
}
