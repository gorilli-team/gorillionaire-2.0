const mongoose = require("mongoose");

const GeneratedSignalSchema = new mongoose.Schema({
  type: {
    type: String,
  },
  token: {
    type: String,
  },
  amount: {
    type: String,
  },
  signal_text: {
    type: String,
  },
  events: {
    type: Array,
  },
  confidenceScore: {
    type: String,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Generated-Signal", GeneratedSignalSchema);
