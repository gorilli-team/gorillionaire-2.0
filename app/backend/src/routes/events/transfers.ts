//add a route to our backend that will receive the transfer data and store it in the database

import express, { Request, Response } from "express";
import Transfer from "../../models/Transfer";
import { v4 as uuidv4 } from "uuid";
import { broadcastEvent } from "../../websocket";
import { env } from "../../services/Env";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const apiKey = req.headers["x-api-key"];
    if (apiKey !== env.indexer.apiKey) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const {
      fromAddress,
      toAddress,
      tokenName,
      tokenSymbol,
      tokenDecimals,
      tokenAddress,
      amount,
      timestamp,
      transactionHash,
      blockNumber,
      blockTimestamp,
    } = req.body;

    // Validate required fields
    if (
      !fromAddress ||
      !toAddress ||
      !amount ||
      !transactionHash ||
      !blockNumber ||
      !blockTimestamp ||
      !tokenSymbol ||
      !tokenDecimals ||
      !tokenAddress
    ) {
      console.log("Missing required fields");
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    // Check if transfer with this transaction hash already exists
    const existingTransfer = await Transfer.findOne({ transactionHash });
    if (existingTransfer) {
      res.status(200).json({
        message: "Transfer already exists",
        transfer: existingTransfer,
      });
      return;
    }
    const id = uuidv4();

    // Create new transfer record in database
    const transfer = await Transfer.create({
      id,
      tokenName,
      fromAddress,
      toAddress,
      tokenSymbol,
      tokenDecimals,
      tokenAddress,
      amount,
      timestamp,
      transactionHash,
      blockNumber,
      blockTimestamp,
    });

    let highImpactBaseValue = 1000000;
    if (tokenName === "Chog") {
      highImpactBaseValue = 100000;
    } else if (tokenName === "Molandak") {
      highImpactBaseValue = 10000;
    } else if (tokenName === "Moyaki") {
      highImpactBaseValue = 1000000;
    }

    // Create event object
    const newEvent = {
      id: transfer._id.toString(),
      type: "TRANSFER",
      blockTimestamp: transfer.blockTimestamp,
      timestamp: new Date().toISOString(),
      description: `Transferred ${(
        Number(transfer.amount) / 1e18
      ).toLocaleString()} ${transfer.tokenSymbol}`,
      value: (Number(transfer.amount) / 1e18).toLocaleString(),
      impact:
        Number(transfer.amount) / 1e18 > highImpactBaseValue * 10
          ? "HIGH"
          : Number(transfer.amount) / 1e18 > highImpactBaseValue * 5
          ? "MEDIUM"
          : "LOW",
    };

    // Broadcast to WebSocket clients
    broadcastEvent(tokenName, newEvent);

    await transfer.save();

    res.status(201).json(transfer);
  } catch (error) {
    console.error("Error storing transfer:", error);
    res.status(500).json({ error: "Failed to store transfer" });
  }
});

router.get(
  "/:token",
  async (
    req: Request<{ token: string }, {}, {}, { page: string; limit: string }>,
    res: Response
  ) => {
    try {
      console.log("req.params.token", req.params.token);

      // Get pagination parameters from query string
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 25;
      const skip = (page - 1) * limit;

      // Get total count for pagination metadata
      const totalCount = await Transfer.countDocuments({
        tokenName: req.params.token,
      });

      // Fetch paginated transfers
      const transfers = await Transfer.find({ tokenName: req.params.token })
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(limit);

      // Return transfers with pagination metadata
      res.status(200).json({
        transfers,
        pagination: {
          total: totalCount,
          page,
          limit,
          pages: Math.ceil(totalCount / limit),
        },
      });
    } catch (error) {
      console.error("Error fetching transfers:", error);
      res.status(500).json({ error: "Failed to fetch transfers" });
    }
  }
);

export default router;
