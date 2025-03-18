import express, { Request, Response } from "express";
import GeneratedSignal from "../../models/GeneratedSignal";
import UserSignal from "../../models/UserSignal";
import UserAuth from "../../models/UserAuth";

const router = express.Router();

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
      const confidenceScore = signal.signal_text?.match(
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
        signal.events = signal.events[0].split("\n\n").map((event: string) => {
          const splitEvents = event.split("\n");
          const splitEvents2 = splitEvents.map((splitEvent: string) => {
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
        userSignal: userSignals.find((us) => {
          return us.signalId === s._id.toString();
        }),
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
  const privyToken = req.headers.authorization?.replace("Bearer ", "");

  if (!userAddress || !signalId || !choice) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  const userAuth = await UserAuth.findOne({
    userAddress,
    privyAccessToken: privyToken,
  });

  if (!userAuth) {
    res.status(400).json({ error: "User not found" });
    return;
  }

  const userSignal = await UserSignal.findOne({
    userAddress,
    signalId,
  });
  if (userSignal) {
    res.status(400).json({ error: "User signal already exists" });
    return;
  }

  const newUserSignal = await UserSignal.create({
    userAddress,
    signalId,
    choice,
  });
  res.json(newUserSignal);
});

export default router;
