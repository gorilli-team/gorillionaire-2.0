const express = require("express");
const router = express.Router();
const Listing = require("../../models/Listing");
const { v4: uuidv4 } = require("uuid");
const { broadcastEvent } = require("../../websocket");
const { ethers } = require("ethers");
const ERC20Abi = require("../../abi/ERC20.json");

router.post("/", async (req, res) => {
  try {
    const apiKey = req.headers["x-api-key"];
    if (apiKey !== process.env.INDEXER_API_KEY) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { tokenAddress, transactionHash, blockNumber, blockTimestamp } =
      req.body;

    // Validate required fields
    if (!transactionHash || !blockNumber || !blockTimestamp || !tokenAddress) {
      console.log("Missing required fields");
      return res.status(400).json({ error: "Missing required fields" });
    }

    const existingListing = await Listing.findOne({ tokenAddress });
    if (existingListing) {
      return res.status(200).json({
        message: "Listing already exists",
        listing: existingListing,
      });
    }

    const id = uuidv4();
    const timestamp = new Date().toISOString();
    const provider = new ethers.JsonRpcProvider(
      "https://testnet-rpc.monad.xyz"
    );
    const contract = new ethers.Contract(tokenAddress, ERC20Abi, provider);
    const name = await contract.name();
    const symbol = await contract.symbol();
    const decimals = await contract.decimals();

    // Create new listing record in database
    const listing = await Listing.create({
      id,
      tokenName: name,
      tokenSymbol: symbol,
      tokenDecimals: Number(decimals),
      tokenAddress,
      timestamp,
      transactionHash,
      blockNumber,
      blockTimestamp,
    });

    // Create event object
    const newEvent = {
      id: listing._id.toString(),
      type: "LISTING",
      blockTimestamp: listing.blockTimestamp,
      timestamp,
      description: `Listed token ${listing.tokenName} (${listing.tokenSymbol})`,
      impact: "MEDIUM",
    };

    // Broadcast to WebSocket clients
    broadcastEvent(name, newEvent);

    await listing.save();

    res.status(201).json(listing);
  } catch (error) {
    console.error("Error storing listing:", error);
    res.status(500).json({ error: "Failed to store listing" });
  }
});

router.get("/", async (req, res) => {
  try {
    // Get pagination parameters from query string
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 25;
    const skip = (page - 1) * limit;

    // Get total count for pagination metadata
    const totalCount = await Listing.countDocuments({});

    const listings = await Listing.find({})
      .sort({ blockTimestamp: -1 })
      .skip(skip)
      .limit(limit);

    // Return listings with pagination metadata
    res.status(200).json({
      listings,
      pagination: {
        total: totalCount,
        page,
        limit,
        pages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching listings:", error);
    res.status(500).json({ error: "Failed to fetch listings" });
  }
});

module.exports = router;
