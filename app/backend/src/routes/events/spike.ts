import express from "express";
import Spike from "../../models/Spike";
import { v4 as uuidv4 } from "uuid";
import { env } from "../../services/Env";

const router = express.Router();

//get all tokens
router.get("/", async (req, res) => {
  try {
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error fetching token stats:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:token", async (req, res) => {
  try {
    console.log("req.params.token", req.params.token);
  } catch (error) {
    console.error("Error fetching transfers:", error);
    res.status(500).json({ error: "Failed to fetch transfers" });
  }
});

// Example of how to broadcast a new event when it's created
router.post("/", async (req, res) => {
  try {
    const apiKey = req.headers["x-api-key"];
    if (apiKey !== env.indexer.apiKey) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const {
      tokenName,
      tokenSymbol,
      tokenDecimals,
      tokenAddress,
      thisHourTransfers,
      previousHourTransfers,
      blockNumber,
      blockTimestamp,
    } = req.body;

    // Validate required fields
    if (
      !tokenName ||
      !tokenSymbol ||
      !tokenDecimals ||
      !tokenAddress ||
      !thisHourTransfers ||
      !previousHourTransfers ||
      !blockNumber ||
      !blockTimestamp
    ) {
      console.log("Missing required fields in spike", req.body);
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    const newSpike = await Spike.create({
      // ... transfer data from request
      id: uuidv4(),
      tokenName,
      tokenSymbol,
      tokenDecimals,
      tokenAddress,
      thisHourTransfers,
      previousHourTransfers,
      blockNumber,
      blockTimestamp,
    });

    await newSpike.save();

    res.status(201).json({ success: true, spike: newSpike });
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ error: "Failed to create event" });
  }
});

export default router;
