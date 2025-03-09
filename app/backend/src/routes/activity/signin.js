const express = require("express");
const router = express.Router();
const { ethers } = require("ethers");
const UserActivity = require("../../models/UserActivity");
const crypto = require("crypto");

//gg endpoint
router.get("/gg", async (req, res) => {
  res.json({ message: "gg" });
});

// Generate nonce for signing
router.get("/nonce", async (req, res) => {
  try {
    const { address } = req.query;
    if (!address) {
      return res.status(400).json({ error: "No address provided" });
    }

    // Generate a random nonce
    const nonce = `Sign this message to prove you own the wallet and earn points: ${crypto
      .randomBytes(32)
      .toString("hex")}`;

    // Store or update nonce in database
    await UserActivity.findOneAndUpdate(
      { address: address.toLowerCase() },
      {
        address: address.toLowerCase(),
        nonce,
      },
      { upsert: true }
    );

    res.json({ nonce });
  } catch (error) {
    console.error("Error generating nonce:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Verify signature and reward points
router.post("/verify", async (req, res) => {
  try {
    const { address, signature } = req.body;
    if (!address || !signature) {
      return res.status(400).json({ error: "Invalid request" });
    }

    // Get stored nonce
    const userActivity = await UserActivity.findOne({
      address: address.toLowerCase(),
    });

    if (!userActivity || !userActivity.nonce) {
      return res
        .status(400)
        .json({ error: "No nonce found. Please request a new one." });
    }

    // Verify the signature
    const recoveredAddress = ethers.verifyMessage(
      userActivity.nonce,
      signature
    );
    if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
      return res.status(401).json({ error: "Signature verification failed" });
    }

    // Check if already rewarded in the last 24 hours
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    if (
      userActivity.lastSignIn > twentyFourHoursAgo &&
      userActivity.isRewarded
    ) {
      return res.status(400).json({
        error: "Already rewarded in the last 24 hours",
        nextRewardTime: new Date(
          userActivity.lastSignIn.getTime() + 24 * 60 * 60 * 1000
        ),
      });
    }

    // Update points and reset nonce
    const pointsToAward = 10;
    await UserActivity.findOneAndUpdate(
      { address: address.toLowerCase() },
      {
        $inc: { points: pointsToAward },
        lastSignIn: new Date(),
        isRewarded: true,
        nonce: null,
      }
    );

    res.json({
      success: true,
      points: pointsToAward,
      totalPoints: (userActivity.points || 0) + pointsToAward,
    });
  } catch (error) {
    console.error("Error verifying signature:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get user points
router.get("/points", async (req, res) => {
  try {
    const { address } = req.query;
    if (!address) {
      return res.status(400).json({ error: "No address provided" });
    }

    const userActivity = await UserActivity.findOne({
      address: address.toLowerCase(),
    });

    if (!userActivity) {
      return res.json({ points: 0 });
    }

    res.json({
      points: userActivity.points,
      lastSignIn: userActivity.lastSignIn,
      nextRewardAvailable: userActivity.isRewarded
        ? new Date(userActivity.lastSignIn.getTime() + 24 * 60 * 60 * 1000)
        : new Date(),
    });
  } catch (error) {
    console.error("Error fetching points:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
