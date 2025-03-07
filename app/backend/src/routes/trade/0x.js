const express = require("express");
const router = express.Router();
const ethers = require("ethers");

const WMONAD_ADDRESS = "0x760AfE86e5de5fa0Ee542fc7B7B713e1c5425701";
const MONAD_CHAIN_ID = 10143;

const symbolToTokenInfo = {
  DAK: { address: "0x0F0BDEbF0F83cD1EE3974779Bcb7315f9808c714", decimals: 18 },
};

function buildPriceRequest(tokenSymbol, amount, type, userAddress) {
  console.log(userAddress);
  const tokenInfo = symbolToTokenInfo[tokenSymbol];
  const priceParams = new URLSearchParams({
    chainId: MONAD_CHAIN_ID.toString(),
    sellToken:
      type === "sell" ? tokenInfo.address.toLowerCase() : WMONAD_ADDRESS,
    buyToken:
      type === "sell" ? WMONAD_ADDRESS : tokenInfo.address.toLowerCase(),
    sellAmount: ethers
      .parseUnits(amount.toString(), tokenInfo.decimals)
      .toString(),
    taker: userAddress,
  });

  const headers = {
    "0x-api-key": process.env.ZEROX_API_KEY,
    "0x-version": "v2",
  };

  return { priceParams, headers };
}

async function getPrice(token, amount, type) {
  const { priceParams, headers } = buildPriceRequest(token, amount, type);

  const priceResponse = await fetch(
    "https://api.0x.org/swap/permit2/price?" + priceParams.toString(),
    { headers }
  );

  // Docs here: https://0x.org/docs/api#tag/Swap
  const res = await priceResponse.json();

  return res;
}

async function getQuote(token, amount, type, userAddress) {
  const { priceParams, headers } = buildPriceRequest(
    token,
    amount,
    type,
    userAddress
  );

  const priceResponse = await fetch(
    "https://api.0x.org/swap/permit2/quote?" + priceParams.toString(),
    { headers }
  );

  return await priceResponse.json();
}

router.get("/0x-quote", async (req, res) => {
  const { token, amount, type, userAddress } = req.query;
  if (!token || !amount || !type || !userAddress)
    return res.status(500).json({ error: "Required field missing" });
  if (!["sell", "buy"].includes(type))
    return res.status(500).json({ error: '"type" value not valid' });

  try {
    const quote = await getQuote(token, amount, type, userAddress);
    console.log(quote);
    res.status(200).json(quote);
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: e });
  }
});

router.get("/0x-price", async (req, res) => {
  const { token, amount, type } = req.query;
  if (!token || !amount || !type)
    return res.status(500).json({ error: "Required field missing" });
  if (!["sell", "buy"].includes(type))
    return res.status(500).json({ error: '"type" value not valid' });

  try {
    const price = await getPrice(token, amount, type, userAddress);
    res.status(200).json(price);
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

module.exports = router;
