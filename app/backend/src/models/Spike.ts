import { Schema, model } from "mongoose";

const SpikeSchema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  timestamp: {
    type: Number,
  },
  tokenName: {
    type: String,
    required: true,
  },
  tokenSymbol: {
    type: String,
    required: true,
  },
  tokenDecimals: {
    type: Number,
    required: true,
  },
  tokenAddress: {
    type: String,
    required: true,
  },
  thisHourTransfers: {
    type: Number,
    required: true,
  },
  previousHourTransfers: {
    type: Number,
    required: true,
  },
  blockNumber: {
    type: Number,
    required: true,
  },
  blockTimestamp: {
    type: Number,
    required: true,
  },
});

export default model("Spike", SpikeSchema);
