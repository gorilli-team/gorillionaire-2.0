import express, { Request, Response } from "express";
import ethers from "ethers";
import PriceOracle from "../../services/PriceOracle";
import Intent from "../../models/Intent";
import { env } from "../../services/Env";

const router = express.Router();
const LIMIT = 20;
router.get(
  "/completed",
  async (
    req: Request<{}, {}, {}, { page: number; limit: number }>,
    res: Response
  ) => {
    const { page = 1, limit = LIMIT } = req.query;
    const intents = await Intent.find({ status: "completed" })
      .sort({ timestamp: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json(intents);
  }
);

const MON_ADDRESS = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";
const WMONAD_ADDRESS = "0x760AfE86e5de5fa0Ee542fc7B7B713e1c5425701";
const MONAD_CHAIN_ID = 10143;

const symbolToTokenInfo: Record<string, { address: string; decimals: number }> =
  {
    DAK: {
      address: "0x0F0BDEbF0F83cD1EE3974779Bcb7315f9808c714",
      decimals: 18,
    },
    CHOG: {
      address: "0xE0590015A873bF326bd645c3E1266d4db41C4E6B",
      decimals: 18,
    },
    YAKI: {
      address: "0xfe140e1dCe99Be9F4F15d657CD9b7BF622270C50",
      decimals: 18,
    },
    MON: { address: MON_ADDRESS, decimals: 18 },
  };

async function buildPriceRequest(
  tokenSymbol: string,
  amount: number,
  type: string,
  userAddress: string
) {
  const tokenInfo = symbolToTokenInfo[tokenSymbol];

  // If "buy" I need to convert the amount passed (which is based in token) to MON amount
  const codexOracle = new PriceOracle();
  const prices = await codexOracle.getTokenPrices([
    {
      address: WMONAD_ADDRESS,
      networkId: MONAD_CHAIN_ID,
    },
    {
      address: tokenInfo.address,
      networkId: MONAD_CHAIN_ID,
    },
  ]);

  const monPrice = parseFloat(prices[0].priceUsd);
  const tokenPrice = parseFloat(prices[1].priceUsd);

  const usdValue = amount * tokenPrice;

  // if buy, convert amount to MON amount
  if (type === "buy") amount = usdValue / monPrice;

  const priceParams = new URLSearchParams({
    chainId: MONAD_CHAIN_ID.toString(),
    sellToken:
      type === "sell"
        ? tokenInfo.address.toLowerCase()
        : MON_ADDRESS.toLowerCase(),
    buyToken:
      type === "sell"
        ? MON_ADDRESS.toLowerCase()
        : tokenInfo.address.toLowerCase(),
    sellAmount: ethers
      .parseUnits(amount.toFixed(tokenInfo.decimals), tokenInfo.decimals)
      .toString(),
    taker: userAddress,
  });

  const headers = {
    "0x-api-key": env.zeroX.apiKey,
    "0x-version": "v2",
  };

  return { priceParams, headers, usdValue, tokenPrice };
}

async function getPrice(
  token: string,
  amount: number,
  type: string,
  userAddress: string
) {
  const { priceParams, headers } = await buildPriceRequest(
    token,
    Number(amount),
    type,
    userAddress
  );

  const priceResponse = await fetch(
    "https://api.0x.org/swap/permit2/price?" + priceParams.toString(),
    { headers: headers as HeadersInit }
  );

  // Docs here: https://0x.org/docs/api#tag/Swap
  const res = await priceResponse.json();

  return res;
}

async function getQuote(
  token: string,
  amount: number,
  type: string,
  userAddress: string
) {
  const { priceParams, headers, usdValue, tokenPrice } =
    await buildPriceRequest(token, Number(amount), type, userAddress);

  const priceResponse = await fetch(
    "https://api.0x.org/swap/permit2/quote?" + priceParams.toString(),
    { headers: headers as HeadersInit }
  );

  const res = await priceResponse.json();
  if (!res.transaction) {
    throw new Error("No transaction data found");
  }

  const intentObject = new Intent({
    userAddress: userAddress,
    tokenSymbol: token,
    tokenAmount: amount,
    tokenPrice: tokenPrice,
    usdValue: usdValue,
    action: type,
    timestamp: Date.now(),
    data: res.transaction.data,
    status: "pending",
  });
  await intentObject.save();

  return { ...res, intentId: intentObject._id };
}

router.get(
  "/0x-quote",
  async (
    req: Request<
      {},
      {},
      {},
      { token: string; amount: number; type: string; userAddress: string }
    >,
    res: Response
  ) => {
    const { token, amount, type, userAddress } = req.query;
    if (!token || !amount || !type || !userAddress) {
      res.status(500).json({ error: "Required field missing" });
      return;
    }

    if (!["sell", "buy"].includes(type)) {
      res.status(500).json({ error: '"type" value not valid' });
      return;
    }

    try {
      const quote = await getQuote(token, amount, type, userAddress);
      res.status(200).json(quote);
    } catch (e) {
      console.log(e);
      res.status(500).json({ error: e });
    }
  }
);

router.get(
  "/0x-price",
  async (
    req: Request<
      {},
      {},
      {},
      { token: string; amount: number; type: string; userAddress: string }
    >,
    res: Response
  ) => {
    const { token, amount, type, userAddress } = req.query;
    if (!token || !amount || !type || !userAddress) {
      res.status(500).json({ error: "Required field missing" });
      return;
    }
    if (!["sell", "buy"].includes(type)) {
      res.status(500).json({ error: '"type" value not valid' });
      return;
    }

    try {
      const price = await getPrice(token, amount, type, userAddress);
      res.status(200).json(price);
    } catch (e) {
      res.status(500).json({ error: e });
    }
  }
);

export default router;
