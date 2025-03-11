const express = require("express");
const router = express.Router();
const GeneratedSignal = require("../../models/GeneratedSignal");
const UserSignal = require("../../models/UserSignal");

router.get("/", async (req, res) => {
  try {
    const signals = await GeneratedSignal.find().sort({ created_at: -1 });
    signals.map((signal) => {
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

    if (req.query.userAddress) {
      const userSignals = await UserSignal.find({
        userAddress: req.query.userAddress,
      });

      const expanded = signals.map((s) => ({
        ...s.toObject(),
        userSignal: userSignals.find(
          (userSignal) => userSignal.signalId === s._id
        ),
      }));
      res.json(expanded);
    } else {
      res.json(signals);
    }
  } catch (error) {
    console.error("ERROR", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/user-signal", async (req, res) => {
  const { userAddress, signalId, choice } = req.body;
  if (!userAddress || !signalId || !choice) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const userSignal = await UserSignal.findOne({
    userAddress,
    signalId,
  });
  if (userSignal) {
    return res.status(400).json({ error: "User signal already exists" });
  }

  const newUserSignal = await UserSignal.create({
    userAddress,
    signalId,
    choice,
  });
  res.json(newUserSignal);
});

module.exports = router;
