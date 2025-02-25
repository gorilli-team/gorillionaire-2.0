//add a route to our backend that will receive the transfer data and store it in the database

const express = require("express");
const router = express.Router();
const Transfer = require("../../models/Transfer");

router.post("/", async (req, res) => {
  try {
    const { fromAddress, toAddress, amount, timestamp, transactionHash } =
      req.body;

    // Validate required fields
    if (
      !fromAddress ||
      !toAddress ||
      !amount ||
      !timestamp ||
      !transactionHash
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Create new transfer record in database
    const transfer = await Transfer.create({
      fromAddress,
      toAddress,
      amount,
      timestamp,
      transactionHash,
    });

    res.status(201).json(transfer);
  } catch (error) {
    console.error("Error storing transfer:", error);
    res.status(500).json({ error: "Failed to store transfer" });
  }
});

module.exports = router;
