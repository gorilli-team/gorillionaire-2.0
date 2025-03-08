const express = require("express");
const router = express.Router();
const GeneratedSignal = require("../../models/GeneratedSignal");

router.get("/", async (req, res) => {
  try {
    const signals = await GeneratedSignal.find().sort({ created_at: -1 });
    await signals.map((signal) => {
      if (signal?.signal_text?.startsWith("BUY")) {
        signal.type = "Buy";
      } else if (signal?.signal_text?.startsWith("SELL")) {
        signal.type = "Sell";
      }
      signal.level = "Conservative";
      if (
        signal.events &&
        Array.isArray(signal.events) &&
        signal.events.length > 0
      ) {
        signal.events = signal.events[0]
          .split("\n\n")
          .filter((event) => event.trim())
          .map((event) => {
            if (event.toLowerCase().includes("spike")) {
              const token = event.match(/DAK|YAKI|CHOG/)[0];
              return `🔥 ${token} spike`;
            }
            if (event.toLowerCase().includes("transfer")) {
              const amountMatch = event.match(/\d+(\.\d+)?/);
              const rawAmount = BigInt(amountMatch ? amountMatch[0] : "0");
              const amount = Number(rawAmount) / Math.pow(10, 18);
              const token = event.match(/DAK|YAKI|CHOG/)[0];
              let formattedAmount;
              if (amount >= 1000000) {
                formattedAmount = (amount / 1000000).toFixed(1) + "M";
              } else if (amount >= 1000) {
                formattedAmount = (amount / 1000).toFixed(1) + "K";
              } else {
                formattedAmount = amount.toFixed(2);
              }
              return `💸 ${formattedAmount} ${token} transfer`;
            }
            return event;
          });
      } else {
        console.log("NO EVENTS");
      }
    });
    res.json(signals);
  } catch (error) {
    console.log("ERROR", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
