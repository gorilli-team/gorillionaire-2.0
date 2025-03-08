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
        // Since events is an array, take the first element and split it
        signal.events = signal.events[0]
          .split("\n\n")
          .filter((event) => event.trim())
          .map((event) => {
            if (event.toLowerCase().includes("transfer")) {
              const amountMatch = event.match(/\d+(\.\d+)?/);
              const amount = amountMatch ? parseFloat(amountMatch[0]) : 0;
              let formattedAmount;
              if (amount >= 1000000) {
                formattedAmount = (amount / 1000000).toFixed(1) + "M";
              } else if (amount >= 1000) {
                formattedAmount = (amount / 1000).toFixed(1) + "K";
              } else {
                formattedAmount = amount.toFixed(2);
              }
              return `💸 ${formattedAmount} transfer`;
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
