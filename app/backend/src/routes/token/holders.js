const express = require("express");
const router = express.Router();
const TokenHolders = require("../../models/TokenHolders");

router.get("/:tokenAddress", async (req, res) => {
  try {
    const tokenAddress = req.params.tokenAddress;
    const tokenHolders = await TokenHolders.findOne({
      tokenAddress: tokenAddress,
    });

    res.json(tokenHolders);
  } catch (error) {
    console.error("Error fetching transfers:", error);
    res.status(500).json({ error: "Failed to fetch transfers" });
  }
});

module.exports = router;
