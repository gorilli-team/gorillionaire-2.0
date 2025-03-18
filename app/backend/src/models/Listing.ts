import { Schema, model } from "mongoose";

const ListingSchema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true,
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
  transactionHash: {
    type: String,
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

export default model("Listing", ListingSchema);
