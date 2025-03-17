// app.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import spikeRouter from "./routes/events/spike";
import listingsRouter from "./routes/events/listings";
import transfersRouter from "./routes/events/transfers";
import pricesRouter from "./routes/events/prices";
import tradeRouter from "./routes/trade/0x";
import pythRouter from "./routes/pyth/mon-price";
import nillionRouter from "./routes/nillion/data";
import activityRouter from "./routes/activity/track";
import tokenHoldersRouter from "./routes/token/holders";
import gorilliNftHoldersRouter from "./routes/gorilliNft/holders";
import generatedSignalsRouter from "./routes/signals/generated-signals";
import authRouter from "./routes/auth/privy";

dotenv.config();

const app = express();

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS setup
app.use(cors());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, X-Auth, admin, Authorization"
  );
  next();
});

// Routes
app.use("/events/spike", spikeRouter);
app.use("/events/listings", listingsRouter);
app.use("/events/transfers", transfersRouter);
app.use("/events/prices", pricesRouter);
app.use("/trade", tradeRouter);
app.use("/pyth", pythRouter);
app.use("/nillion/data", nillionRouter);
app.use("/activity/track", activityRouter);
app.use("/token/holders", tokenHoldersRouter);
app.use("/gorilli-nft/holders", gorilliNftHoldersRouter);
app.use("/signals/generated-signals", generatedSignalsRouter);
app.use("/auth/privy", authRouter);
// Basic error handling
app.use((err: any, req: any, res: any, next: any) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message });
});

export default app;
