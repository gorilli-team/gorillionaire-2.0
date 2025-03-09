const express = require("express");
const router = express.Router();
const https = require("https");

// Mapping of tokens to their Pyth price feed IDs
const PYTH_PRICE_FEED_IDS = {
  MON: "0xe786153cc54abd4b0e53b4c246d54d9f8eb3f3b5a34d4fc5a2e9a423b0ba5d6b",
};

// Get the price of MON from Pyth
const getMonPrice = async () => {
  return new Promise((resolve, reject) => {
    // Using the REST API instead of the stream endpoint
    const url = `https://hermes-beta.pyth.network/api/latest_price_feeds?ids[]=${PYTH_PRICE_FEED_IDS.MON}`;

    https
      .get(url, (res) => {
        let data = "";

        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          try {
            const parsedData = JSON.parse(data);
            console.log("Received price data:", parsedData);

            if (parsedData && parsedData.length > 0) {
              // Extract price from the response
              const priceInfo = parsedData[0].price;
              resolve(priceInfo);
            } else {
              reject(new Error("No price data found"));
            }
          } catch (error) {
            console.error("Error parsing data:", error);
            reject(error);
          }
        });
      })
      .on("error", (error) => {
        console.error("Error fetching price:", error);
        reject(error);
      });
  });
};

router.get("/mon-price", async (req, res) => {
  console.log("Getting MON price...");
  try {
    const price = await getMonPrice();
    res.json({ price });
  } catch (error) {
    console.error("Error in price endpoint:", error);
    res.status(500).json({ error: "Failed to fetch price" });
  }
});

module.exports = router;
