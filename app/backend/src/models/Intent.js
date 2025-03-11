const mongoose = require("mongoose");

const IntentSchema = new mongoose.Schema({
  userAddress: {
    type: String,
    required: true,
  },
  tokenSymbol: {
    type: String,
    required: true,
  },
  tokenAmount: {
    type: Number,
    required: true,
  },
  tokenPrice: {
    type: Number,
    required: true,
  },
  action: {
    type: String,
    required: true,
  },
  usdValue: {
    type: Number,
    required: true,
  },
  timestamp: {
    type: Number,
    required: true,
  },
  data: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  txHash: {
    type: String,
  },
});

module.exports = mongoose.model("Intent", IntentSchema);
