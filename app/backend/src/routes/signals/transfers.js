//add a route to our backend that will receive the transfer data and store it in the database

const express = require("express");
const router = express.Router();
const Transfer = require("../../models/Transfer");
const { v4: uuidv4 } = require("uuid");

router.post("/", async (req, res) => {
  try {
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
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Check if transfer with this transaction hash already exists
    const existingTransfer = await Transfer.findOne({ transactionHash });
    if (existingTransfer) {
      return res.status(200).json({
        message: "Transfer already exists",
        transfer: existingTransfer,
      });
    }

    //console.log all
    console.log("--------------------------------");
    console.log("fromAddress", fromAddress);
    console.log("toAddress", toAddress);
    console.log("tokenName", tokenName);
    console.log("tokenSymbol", tokenSymbol);
    console.log("tokenDecimals", tokenDecimals);
    console.log("tokenAddress", tokenAddress);
    console.log("amount", amount);
    console.log("transactionHash", transactionHash);
    console.log("blockNumber", blockNumber);
    console.log("blockTimestamp", blockTimestamp);
    console.log("--------------------------------");

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

    console.log("Transfer created:", transfer);

    await transfer.save();

    res.status(201).json(transfer);
  } catch (error) {
    console.error("Error storing transfer:", error);
    res.status(500).json({ error: "Failed to store transfer" });
  }
});

router.get("/:token", async (req, res) => {
  try {
    const transfers = await Transfer.find({ token: req.params.token });
    res.status(200).json(transfers);
  } catch (error) {
    console.error("Error fetching transfers:", error);
    res.status(500).json({ error: "Failed to fetch transfers" });
  }
});

module.exports = router;
