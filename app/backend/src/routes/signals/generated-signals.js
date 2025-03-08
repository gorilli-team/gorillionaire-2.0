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
      //find in signal.signal_text conains Confidence Score of 9.75
      const confidenceScore = signal.signal_text.match(
        /Confidence Score of (\d+\.\d+)/
      );
      if (confidenceScore) {
        signal.confidenceScore = confidenceScore[1];
      }
      signal.level = "Conservative";
      if (
        signal.events &&
        Array.isArray(signal.events) &&
        signal.events.length > 0
      ) {
        signal.events = signal.events[0].split("\n\n").map((event) => {
          const splitEvents = event.split("\n");
          const splitEvents2 = splitEvents.map((splitEvent) => {
            return splitEvent.split("\n\n");
          });
          return splitEvents2;
        });
        signal.events = signal.events.flat();
      }
    });
    res.json(signals);
  } catch (error) {
    console.log("ERROR", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
