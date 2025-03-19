import mongoose from "mongoose";

const priceDataSchema = new mongoose.Schema({
  tokenSymbol: {
    type: String,
    required: true,
    enum: ["CHOG", "YAKI", "DAK"],
  },
  price: {
    type: Number,
    required: true,
  },
  lastHourPrice: {
    type: Number,
    required: true,
  },
  lastHourPriceChange: {
    type: Number,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  blockNumber: {
    type: Number,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
});

// Create compound index for efficient queries
priceDataSchema.index({ tokenSymbol: 1, timestamp: -1 });

export default mongoose.model("PriceData", priceDataSchema);
