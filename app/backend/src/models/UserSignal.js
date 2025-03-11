const mongoose = require("mongoose");

const UserSignalSchema = new mongoose.Schema({
  userAddress: {
    type: String,
    required: true,
  },
  signalId: {
    type: String,
    required: true,
  },
  choice: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User-Signal", UserSignalSchema);
