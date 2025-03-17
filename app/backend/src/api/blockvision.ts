import axios from "axios";
import TokenHolders from "../models/TokenHolders";
import { env } from "../services/Env";

class BlockvisionAPI {
  // Configuration
  private baseURL = env.blockvision.apiUrl;
  private apiKey = env.blockvision.apiKey;
  private GORILLI_NFT_CONTRACT_ADDRESS =
    "0x12bF70e3325104ed2D7fefbB8f3e88cE2Dd66A30";

  // Function to retrieve token holders
  async retrieveTokenHolders({
    contractAddress,
    tokenName,
    pageIndex = "1",
    pageSize = "20",
  }: {
    contractAddress: string;
    tokenName: string;
    pageIndex?: string;
    pageSize?: string;
  }) {
    try {
      const response = await axios.get(`${this.baseURL}/token/holders`, {
        params: {
          contractAddress,
          pageIndex,
          pageSize,
        },
        headers: {
          "x-api-key": this.apiKey,
          accept: "application/json",
        },
      });

      // Update existing record or create new one if it doesn't exist
      const updatedTokenHolders = await TokenHolders.findOneAndUpdate(
        { tokenAddress: contractAddress },
        {
          tokenName: tokenName,
          total: response.data.result.total,
          holders: response.data.result.data,
        },
        { new: true, upsert: true }
      );

      if (updatedTokenHolders) {
        console.log("Token holders updated successfully");
      } else {
        console.log("Token holders created successfully");
      }

      return response.data;
    } catch (error: any) {
      console.error(
        "BlockvisionAPI Error:",
        error.response?.data || error.message
      );
      throw error;
    }
  }

  async retrieveAddressTokens({
    address,
    pageIndex = "1",
    pageSize = "20",
  }: {
    address: string;
    pageIndex?: string;
    pageSize?: string;
  }) {
    try {
      console.log("address", address);
      console.log("pageIndex", pageIndex);
      console.log("pageSize", pageSize);
      console.log("baseURL", this.baseURL);
      console.log("apiKey", this.apiKey);
      const response = await axios.get(`${this.baseURL}/account/tokens`, {
        params: {
          address,
          pageIndex,
          pageSize,
        },
        headers: {
          "x-api-key": this.apiKey,
          accept: "application/json",
        },
      });

      return response.data;
    } catch (error: any) {
      console.error("Error retrieving address tokens:", error.message);
      throw {
        message: "Failed to retrieve address tokens",
        error: error.message,
        status: error.response?.status || 500,
      };
    }
  }

  async retrieveGorilliNftHolders() {
    try {
      const response = await axios.get(
        `${this.baseURL}/collection/holders?contractAddress=${this.GORILLI_NFT_CONTRACT_ADDRESS}`,
        {
          headers: {
            "x-api-key": this.apiKey,
            accept: "application/json",
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error retrieving gorilli nft holders:", error);
    }
  }
}

export default new BlockvisionAPI();
