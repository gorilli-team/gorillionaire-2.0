const mongoose = require("mongoose");

const IntentSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  userAddress: {
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
