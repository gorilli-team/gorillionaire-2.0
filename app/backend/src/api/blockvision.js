const axios = require("axios");

// Configuration
const baseURL =
  process.env.BLOCKVISION_API_URL || "https://api.blockvision.org/v2/monad";
const apiKey = process.env.BLOCKVISION_API_KEY;

// Function to retrieve token holders
const retrieveTokenHolders = async ({
  contractAddress,
  pageIndex = "1",
  pageSize = "20",
}) => {
  try {
    const response = await axios.get(`${baseURL}/token/holders`, {
      params: {
        contractAddress,
        pageIndex,
        pageSize,
      },
      headers: {
        "x-api-key": apiKey,
        accept: "application/json",
      },
    });

    console.log(JSON.stringify(response.data));

    return response.data;
  } catch (error) {
    console.error(
      "BlockvisionAPI Error:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Export the function directly
module.exports = {
  retrieveTokenHolders,
};
